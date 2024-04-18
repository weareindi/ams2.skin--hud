import { millisecondsToTime } from '../../utils/TimeUtils';
import localforage from "localforage";

class StandingsWorker {
    constructor() {
        this.lastLapSectorDeltaSector = null;
        this.lastLapSectorDeltaVisible = false;
        this.lastLapSectorDeltaVisibleTimeout = null;
        this.bestLapSectorDeltaSector = null;
        this.bestLapSectorDeltaVisible = false;
        this.bestLapSectorDeltaVisibleTimeout = null;
        this.init();
    }

    /**
     * Go, go, go!
     */
    async init() {
        try {
            await this.registerListeners();
        } catch (error) {
            console.error(error);
        }
    }

    /**
     * Register listeners for messages from parent worker
     */
    async registerListeners() {
        return self.onmessage = async (event) => {
            if (typeof event.data === 'undefined') {
                return console.error('No message supplied');
            }

            if (event.data.name === 'process') {
                const data = await this.prepareData(event.data.data);
                await this.returnMessage('updateview', data);
            }

            if (event.data.name === 'reset') {
                await this.deleteParticipantsData();
                await this.returnMessage('resetcomplete');
            }
        };
    }

    /**
     * Delete the store
     */
    async deleteParticipantsData() {
        return await localforage.removeItem('participantsstore');
    }

    /**
     * Prepare data for the view
     * @param {*} data 
     * @returns 
     */
    async prepareData(data) {
        // do we have what we need?
        if (!('user' in data)) {
            return null;
        }

        if (!('mNumParticipants' in data)) {
            return null;
        }

        if (!('mParticipantInfo' in data)) {
            return null;
        }

        if (!('mSessionState' in data)) {
            return null;
        }

        if (!('mTrackLength' in data)) {
            return null;
        }

        if (!('timings' in data)) {
            return null;
        }

        let user = data.user;
        const lapsAppliedParticipantInfo = await this.applyStoredParticipantLapData(data.mParticipantInfo);
        const sortedParticipantInfo = await this.getSortedParticipants(lapsAppliedParticipantInfo);
        const participantData = await this.setParticipantsIndexes(sortedParticipantInfo);
        user = await this.updateUser(user, sortedParticipantInfo);
        const standingsData = await this.getStandingsData(user, participantData);
        const userIndex = standingsData.indexOf(user);
        const standingsDataDisplay = await this.getStandingsDataForDisplay(user, userIndex, standingsData, data.mSessionState, data.mTrackLength, data.timings);
        const standingsDataStream = await this.getStandingsDataForStream(data.mParticipantInfo);

        return {
            standingsDisplay: standingsDataDisplay,
            standingsStream: standingsDataStream,
            participant: user,
        };
    }

    /**
     * Add stored lap data for each participant to main data array
     * @param {*} participantData 
     * @returns 
     */
    async applyStoredParticipantLapData(mParticipantInfo) {
        // get stored participants
        let participants = await localforage.getItem('participantsstore');

        // no participants? create empty array so we have something to work with
        if (!participants) {
            participants = []
        }

        for (const index in mParticipantInfo) {
            const participant = mParticipantInfo[index];

            if (!(index in participants)) {
                participants[index] = {};
            }

            //
            // all laps
            //
            if (!('laps' in participants[index])) {
                participants[index]['laps'] = {};
            }

            if (!(participant.mCurrentLap in participants[index]['laps'])) {
                participants[index]['laps'][participant.mCurrentLap] = {};
            }

            participants[index]['laps'][participant.mCurrentLap]['mCurrentSector1Times'] = participant.mCurrentSector1Times;
            participants[index]['laps'][participant.mCurrentLap]['mCurrentSector2Times'] = participant.mCurrentSector2Times;
            participants[index]['laps'][participant.mCurrentLap]['mCurrentSector3Times'] = participant.mCurrentSector3Times;

            // push back into main mParticipantInfo array
            mParticipantInfo[index]['laps'] = participants[index]['laps'];

            //
            // fastest laps
            //
            if (!('fastestLaps' in participants[index])) {
                participants[index]['fastestLaps'] = {};
            }

            if (!(participant.mCurrentLap in participants[index]['fastestLaps'])) {
                participants[index]['fastestLaps'][participant.mCurrentLap] = {}
            }

            if (!(participant.mFastestLapTimes in participants[index]['fastestLaps'][participant.mCurrentLap])) {
                participants[index]['fastestLaps'][participant.mCurrentLap] = {}
            }

            participants[index]['fastestLaps'][participant.mCurrentLap]['mFastestLapTimes'] = participant.mFastestLapTimes;
            participants[index]['fastestLaps'][participant.mCurrentLap]['mFastestSector1Times'] = participant.mFastestSector1Times;
            participants[index]['fastestLaps'][participant.mCurrentLap]['mFastestSector2Times'] = participant.mFastestSector2Times;
            participants[index]['fastestLaps'][participant.mCurrentLap]['mFastestSector3Times'] = participant.mFastestSector3Times;

            for (const lapNumber in participants[index]['fastestLaps']) {
                if (lapNumber > participant.mCurrentLap - 2) {
                    continue;
                }

                delete participants[index]['fastestLaps'][lapNumber];
            }

            // // push back into main mParticipantInfo array
            mParticipantInfo[index]['fastestLaps'] = participants[index]['fastestLaps'];
        }

        // save laps to storage
        await localforage.setItem('participantsstore', participants);

        // return mParticipantInfo
        return mParticipantInfo;
    }

    /**
     * Get the user data which has been sorted and processed
     * @param {*} user 
     * @param {*} sortedParticipantInfo 
     * @returns object
     */
    async updateUser(user, sortedParticipantInfo) {
        let participantUser = null;
        for (const participantIndex in sortedParticipantInfo) {
            const participant =  sortedParticipantInfo[participantIndex];
            
            if (participant.mRacePosition !== user.mRacePosition) {
                continue;
            }

            participantUser = participant;
            break;
        }

        return participantUser;
    }

    /**
     * Get a full stack of standings prepared for the view
     * @param {*} user 
     * @param {*} userIndex 
     * @param {*} standingsData 
     * @param {*} mSessionState 
     * @param {*} mTrackLength 
     * @returns array
     */
    async getStandingsDataForDisplay(user, userIndex, standingsData, mSessionState, mTrackLength, timings) {
        // the number if total standings we want to return
        // they dont all show at once so lets limit the data that is returned to the view
        // ... this may be moved to a user defined option hense the use of this variable
        let limit = 6;

        // .. ensure its an even number
        if ((limit % 2)) {
            limit = 2 * Math.round(limit / 2);
        }

        // standings
        let standings = [];
        for (const index in standingsData) {
            const standing = {};
            const participantData = standingsData[index];
            const status = await this.statusDisplay(index, participantData, userIndex, user, mSessionState);
            const distance = await this.distanceDisplay(index, participantData, userIndex, user, mTrackLength);
            const mNameDisplay = await this.mNameDisplay(participantData.mName);
            const mCarClassNamesDisplay = await this.mCarClassNamesDisplay(participantData.mCarClassNames);

            // populate standing
            standing.positionIndex = participantData.positionIndex;
            standing.status = status;
            standing.distance = distance;
            standing.mRacePosition = participantData.mRacePosition;
            standing.mName = mNameDisplay;
            standing.mCarClassNames = mCarClassNamesDisplay;
            standing.isUser = userIndex == index;

            // user only values
            if (userIndex == index) {
                standing.mBestLapTime = await this.mBestLapTimeDisplay(timings.mBestLapTime);
                standing.mLastLapTime = await this.mLastLapTimeDisplay(timings.mLastLapTime);
                standing.mCurrentTime = await this.mCurrentTimeDisplay(timings.mCurrentTime);

                const bestLapSectorDelta = await this.processBestLapSectorDelta(participantData);
                standing.bestLapSectorDelta = await this.processBestLapSectorDeltaDisplay(bestLapSectorDelta);
                standing.bestLapSectorDeltaPositive = await this.processBestLapSectorDeltaPositiveDisplay(bestLapSectorDelta);
                standing.bestLapSectorDeltaVisible = await this.processBestLapSectorDeltaVisible(participantData);

                const lastLapSectorDelta = await this.processLastLapSectorDelta(participantData);
                standing.lastLapSectorDelta = await this.processLastLapSectorDeltaDisplay(lastLapSectorDelta);
                standing.lastLapSectorDeltaPositive = await this.processLastLapSectorDeltaPositiveDisplay(lastLapSectorDelta);
                standing.lastLapSectorDeltaVisible = await this.processLastLapSectorDeltaVisible(participantData);
            }

            standings.push(standing);
        }

        // slice standings from the current users position, outwards as per limit
        return [].concat(standings.slice(userIndex - (limit / 2), userIndex), standings[userIndex], standings.slice(userIndex + 1, userIndex + 1 + (limit / 2)));
    }

    /**
     * 
     * @param {*} participantData 
     * @returns 
     */
    async processBestLapSectorDelta(participantData) {
        const lastLapNum = participantData.mCurrentLap - 1;
        if (!(lastLapNum in participantData.laps)) {
            return null;
        }

        const fastestLapNumbers = Object.keys(participantData.fastestLaps);
        if (fastestLapNumbers.length < 2) {
            return null;
        }

        const lastLapSectors = participantData.laps[lastLapNum];
        const oldFastestLapData = participantData.fastestLaps[fastestLapNumbers[0]];
        const newFastestLapData = participantData.fastestLaps[fastestLapNumbers[1]];

        let current = 0;
        let last = 0;

        if (participantData.mCurrentSector === 0 && participantData.mFastestLapTimes === newFastestLapData.mFastestLapTimes) {
            current += lastLapSectors.mCurrentSector1Times;
            current += lastLapSectors.mCurrentSector2Times;
            current += lastLapSectors.mCurrentSector3Times;

            last += oldFastestLapData.mFastestSector1Times;
            last += oldFastestLapData.mFastestSector2Times;
            last += oldFastestLapData.mFastestSector3Times;
        }

        if (participantData.mCurrentSector === 0 && participantData.mFastestLapTimes !== newFastestLapData.mFastestLapTimes) {
            current += lastLapSectors.mCurrentSector1Times;
            current += lastLapSectors.mCurrentSector2Times;
            current += lastLapSectors.mCurrentSector3Times;

            last += newFastestLapData.mFastestSector1Times;
            last += newFastestLapData.mFastestSector2Times;
            last += newFastestLapData.mFastestSector3Times;
        }

        if (participantData.mCurrentSector === 1) {
            current += participantData.mCurrentSector1Times;

            last += newFastestLapData.mFastestSector1Times;
        }
        
        if (participantData.mCurrentSector === 2) {
            current += participantData.mCurrentSector1Times;
            current += participantData.mCurrentSector2Times;

            last += newFastestLapData.mFastestSector1Times;
            last += newFastestLapData.mFastestSector2Times;
        }

        return current - last;
    }

    /**
     * 
     * @param {*} participantData 
     * @returns 
     */
    async processBestLapSectorDeltaDisplay(difference) {
        let symbol = difference > 0 ? '+' : '-';
    
        return `${symbol}${millisecondsToTime(difference)}`;
    }

    /**
     * Are we showing the best lap delta?
     * @param {*} participantData 
     * @returns boolean
     */
    async processBestLapSectorDeltaVisible(participantData) {
        if (participantData.mCurrentSector !== this.bestLapSectorDeltaSector) {
            clearTimeout(this.bestLapSectorDeltaVisibleTimeout);
            this.bestLapSectorDeltaVisible = true;
            this.bestLapSectorDeltaVisibleTimeout = setTimeout(() => {
                this.bestLapSectorDeltaVisible = false;
            }, 6000);
        }

        this.bestLapSectorDeltaSector = participantData.mCurrentSector;

        return this.bestLapSectorDeltaVisible;
    }

    /**
     * Is delta positive?
     * @param {*} delta 
     * @returns boolean
     */
    async processBestLapSectorDeltaPositiveDisplay(delta) {
        if (delta > 0) {
            return true;
        }

        return false;
    }

    /**
     * Calculate difference at cuurent sector to previous lap
     * @param {*} participantData 
     * @returns 
     */
    async processLastLapSectorDelta(participantData) {
        const lastLapNum = participantData.mCurrentLap - 1;
        if (!(lastLapNum in participantData.laps)) {
            return null;
        }

        const lastLapX2Num = participantData.mCurrentLap - 2;
        if (!(lastLapX2Num in participantData.laps)) {
            return null;
        }

        const lastLapSectors = participantData.laps[lastLapNum];
        const lastLapX2Sectors = participantData.laps[lastLapX2Num];

        let current = 0;
        let last = 0;

        if (participantData.mCurrentSector === 0) {
            current += lastLapSectors.mCurrentSector1Times;
            current += lastLapSectors.mCurrentSector2Times;
            current += lastLapSectors.mCurrentSector3Times;

            last += lastLapX2Sectors.mCurrentSector1Times;
            last += lastLapX2Sectors.mCurrentSector2Times;
            last += lastLapX2Sectors.mCurrentSector3Times;
        }

        if (participantData.mCurrentSector === 1) {
            current += participantData.mCurrentSector1Times;
            last += lastLapSectors.mCurrentSector1Times;
        }
        
        if (participantData.mCurrentSector === 2) {
            current += participantData.mCurrentSector1Times;
            current += participantData.mCurrentSector2Times;
            last += lastLapSectors.mCurrentSector1Times;
            last += lastLapSectors.mCurrentSector2Times;
        }

        return current - last;
    }

    /**
     * Calculate difference at cuurent sector to previous lap
     * @param {*} participantData 
     * @returns 
     */
    async processLastLapSectorDeltaDisplay(difference) {        
        let symbol = difference > 0 ? '+' : '-';
    
        return `${symbol}${millisecondsToTime(difference)}`;
    }

    /**
     * Is delta positive?
     * @param {*} delta 
     * @returns boolean
     */
    async processLastLapSectorDeltaPositiveDisplay(delta) {
        if (delta > 0) {
            return true;
        }
        
        return false;
    }

    /**
     * Are we showing the last lap delta?
     * @param {*} participantData 
     * @returns boolean
     */
    async processLastLapSectorDeltaVisible(participantData) {
        if (participantData.mCurrentSector !== this.lastLapSectorDeltaSector) {
            clearTimeout(this.lastLapSectorDeltaVisibleTimeout);
            this.lastLapSectorDeltaVisible = true;
            this.lastLapSectorDeltaVisibleTimeout = setTimeout(() => {
                this.lastLapSectorDeltaVisible = false;
            }, 6000);
        }

        this.lastLapSectorDeltaSector = participantData.mCurrentSector;

        return this.lastLapSectorDeltaVisible;
    }

    /**
     * Process current time for display
     * @param {*} mCurrentTime 
     * @returns string
     */
    async mCurrentTimeDisplay(mCurrentTime) {
        if (mCurrentTime < 0) { 
            return null;
        }

        return millisecondsToTime(mCurrentTime);
    }

    /**
     * Process best time for display
     * @param {*} mBestLapTime 
     * @returns string
     */
    async mBestLapTimeDisplay(mBestLapTime) {
        if (mBestLapTime < 0) { 
            return null;
        }

        return millisecondsToTime(mBestLapTime);
    }

    /**
     * Process last lap time for display
     * @param {*} mLastLapTime 
     * @returns string
     */
    async mLastLapTimeDisplay(mLastLapTime) {
        if (mLastLapTime < 0) { 
            return null;
        }

        return millisecondsToTime(mLastLapTime);
    }

    /**
     * Get participant name
     * @param {*} mName 
     * @returns string
     */
    async mNameDisplay(mName) {
        return mName;
    }

    /**
     * Prepare car class name for standing in view
     * @param {*} mCarClassNames 
     * @returns string
     */
    async mCarClassNamesDisplay(mCarClassNames) {
        // split name at capitals
        const parts = mCarClassNames.match(/[A-Z][a-z]+|[A-Z]|[0-9]+/g);

        let name = mCarClassNames;
        if (parts) {
            name = parts[0];
        }

        // // create shortname from first 3 characters of first item
        let shortname = name.slice(0, 3);

        if (parts) {
            // remove first part as we've used it
            parts.shift();

            // any more parts? add the first character from the next part only
            if (parts.length) {
                if (shortname.length === 1) {
                    shortname += parts[0].slice(0, 3);
                } else {
                    shortname += parts[0].slice(0, 1);
                }
            }
        }
        
        // make it uppercase
        return shortname.toUpperCase();        
    }

    /**
     * Get participant status prepared for the view
     * @param {*} index 
     * @param {*} participant 
     * @param {*} userIndex
     * @param {*} user
     * @param {*} mSessionState 
     * @returns string
     */
    async statusDisplay(index, participant, userIndex, user, mSessionState) {
        // skip if its current driver
        if (participant.positionIndex === user.positionIndex) {
            return null
        }

        if (mSessionState === 1 || mSessionState === 3) { // practice (1) or qualifying (3)
            if (participant.mRaceStates === 1) {
                return 'out';
            }

            if (participant.mRaceStates === 2) {
                return 'hot';
            }
        }

        if (mSessionState === 5) { // race (5)
            // participant ahead on same lap (racing)
            if (index < userIndex && participant.mRacePosition < user.mRacePosition && participant.mCurrentLap === user.mCurrentLap) {
                return 'ahead';
            }

            // participant behind on same lap (racing)
            if (index > userIndex && participant.mRacePosition > user.mRacePosition && participant.mCurrentLap === user.mCurrentLap) {
                return 'behind';
            }

            // participant ahead on higher lap, better position
            if (index < userIndex && participant.mRacePosition < user.mRacePosition && participant.mCurrentLap > user.mCurrentLap) {
                return 'leader';
            }

            // participant behind on same lap, better position 
            if (index > userIndex && participant.mRacePosition < user.mRacePosition && participant.mCurrentLap === user.mCurrentLap) {
                return 'leader';
            }

            // participant behind on higher lap, better position
            if (index > userIndex && participant.mRacePosition < user.mRacePosition && participant.mCurrentLap > user.mCurrentLap) {
                return 'leader';
            }

            // participant ahead on lower lap, lower position
            if (index < userIndex && participant.mRacePosition > user.mRacePosition && participant.mCurrentLap < user.mCurrentLap) {
                return 'backmarker';
            }

            // participant ahead on lower lap, lower position
            if (index > userIndex && participant.mRacePosition > user.mRacePosition && participant.mCurrentLap < user.mCurrentLap) {
                return 'backmarker';
            }

            // participant ahead on lower lap, lower position
            if (index < userIndex && participant.mRacePosition > user.mRacePosition && participant.mCurrentLap === user.mCurrentLap) {
                return 'backmarker';
            }
        }

        // no match?
        return null
    }

    /**
     * Get distance to other participants prepared for the view
     * @param {*} index 
     * @param {*} participantData 
     * @param {*} userIndex 
     * @param {*} user 
     * @param {*} mTrackLength 
     * @returns string
     */
    async distanceDisplay(index, participantData, userIndex, user, mTrackLength) {
        if (participantData.mCurrentLapDistance <= 0 && participantData.mCurrentLap === 1) {
            return null;
        }

        let symbol = '±';
        let diff = 0;

        // if ahead of current player on circuit
        if (index < userIndex) {
            symbol = '+';
            
            if (user.mCurrentLapDistance < participantData.mCurrentLapDistance) {
                diff = participantData.mCurrentLapDistance - user.mCurrentLapDistance;
            }
            
            if (user.mCurrentLapDistance > participantData.mCurrentLapDistance) {
                diff = mTrackLength - (user.mCurrentLapDistance - participantData.mCurrentLapDistance);
            }
        }

        // if behind current player on circuit
        if (index > userIndex) {
            symbol = '-';

            // racing
            if (user.mCurrentLapDistance > participantData.mCurrentLapDistance) {
                diff = user.mCurrentLapDistance - participantData.mCurrentLapDistance;
            }

            // leaders
            if (user.mCurrentLapDistance < participantData.mCurrentLapDistance) {
                diff = mTrackLength - (participantData.mCurrentLapDistance - user.mCurrentLapDistance);
            }
        }

        diff = Math.abs(diff);

        return `${symbol}${diff.toFixed(2)}m`;
    }

    /**
     * Get standings data in a carousel prepared array with the current user in the center
     * @param {*} user 
     * @param {*} sortedParticipantInfo 
     * @returns array
     */
    async getStandingsData(user, sortedParticipantInfo) {
        // get participants ahead
        const ahead = sortedParticipantInfo.slice(0, user.positionIndex);

        // get participants behind
        const behind = sortedParticipantInfo.slice(user.positionIndex + 1, sortedParticipantInfo.length);

        // prepend and appends ahead,behind data to aid carousel of data
        return [].concat(behind, ahead, user, behind, ahead);
    }

    /**
     * Apply participants position index
     * @param {*} participantsData 
     * @returns object
     */
    async setParticipantsIndexes(participantsData) {
        for (const index in participantsData) {
            // set original index
            participantsData[index].positionIndex = parseFloat(index);
        }

        return participantsData;
    }

    /**
     * Sort participants by lap distance, leader first
     * @param {*} mParticipantInfo 
     * @returns array
     */
    async getSortedParticipants(mParticipantInfo) {
        return [].concat(mParticipantInfo).sort((a, b) => {
            if (a.mCurrentLapDistance === 0 && a.mCurrentLapDistance === 0) {
                return a.mRacePosition - b.mRacePosition;
            }

            return b.mCurrentLapDistance - a.mCurrentLapDistance;
        });
    }

    /**
     * Easy method to send a message back to parent worker with/without additional data
     * @param {*} name 
     * @param {*} data 
     */
    async returnMessage(name, data = null) {
        if (!data) {
            return self.postMessage({
                name
            });
        }

        return self.postMessage({
            name,
            data
        });
    }

    /**
     * Get a full stack of standings prepared for the stream
     * @param {*} mParticipantInfo 
     * @returns array
     */
    async getStandingsDataForStream(mParticipantInfo) {
        const sorted = [].concat(mParticipantInfo).sort((a, b) => {
            return a.mRacePosition - b.mRacePosition;
        });

        const chunked = [];
        for (let i = 0; i < sorted.length; i += 6) {
            chunked.push(sorted.slice(i, i + 6));
        }

        return chunked;
    }
}

new StandingsWorker();
