import { millisecondsToTime } from '../../utils/TimeUtils';

class StandingsWorker {
    constructor() {
        this.storedSector = null;
        this.storedDelta = null;
        this.previousBestLapTime = null;
        this.previousFastestSector1Time = null;
        this.previousFastestSector2Time = null;
        this.previousFastestSector3Time = null;
        this.deltaDisplayThen = Date.now();
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
        };
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
        const sortedParticipantData = await this.getSortedParticipants(data.mParticipantInfo);
        const participantData = await this.setParticipantsIndexes(sortedParticipantData);      
        user = await this.updateUser(user, sortedParticipantData);
        const standingsData = await this.getStandingsData(user, participantData);
        const userIndex = standingsData.indexOf(user);
        const standingsDataDisplay = await this.getStandingsDataForDisplay(user, userIndex, standingsData, data.mSessionState, data.mTrackLength, data.timings);
        
        return {standingsDisplay: standingsDataDisplay};
    }

    /**
     * Get the user data which has been sorted and processed
     * @param {*} user 
     * @param {*} sortedParticipantData 
     * @returns object
     */
    async updateUser(user, sortedParticipantData) {
        let participantUser = null;
        for (const participantIndex in sortedParticipantData) {
            const participant =  sortedParticipantData[participantIndex];
            
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
                const delta = await this.delta(user.mCurrentSector, timings);
                const deltaDisplay = await this.deltaDisplay(delta);
                const deltaStatus = await this.deltaStatusDisplay(delta);
                const deltaVisible = await this.deltaVisible(timings.mCurrentTime, delta, deltaStatus);
                const mCurrentTimeDisplay = await this.mCurrentTimeDisplay(timings.mCurrentTime);
                const mBestLapTimeDisplay = await this.mBestLapTimeDisplay(timings.mBestLapTime);
                const mLastLapTimeDisplay = await this.mLastLapTimeDisplay(timings.mLastLapTime);

                standing.delta = deltaDisplay;
                standing.deltaStatus = deltaStatus;
                standing.deltaVisible = deltaVisible;
                standing.mCurrentTime = mCurrentTimeDisplay;
                standing.mBestLapTime = mBestLapTimeDisplay;
                standing.mLastLapTime = mLastLapTimeDisplay;
            }

            standings.push(standing);
        }

        // slice standings from the current users position, outwards as per limit
        return [].concat(standings.slice(userIndex - (limit / 2), userIndex), standings[userIndex], standings.slice(userIndex + 1, userIndex + 1 + (limit / 2)));
    }

    /**
     * Delta is performance of current lap against session best lap
     * @param {*} timings 
     * @returns 
     */
    async delta(mCurrentSector, timings) {
        if (!('mLastLapTime' in timings)) {
            return null;
        }

        if (timings.mLastLapTime < 0) {
            return null;
        }

        if (!('mBestLapTime' in timings)) {
            return null;
        }

        if (timings.mBestLapTime < 0) {
            return null;
        }

        if (mCurrentSector === this.storedSector && this.previousBestLapTime) {
            return this.storedDelta;
        }

        // update store sector
        this.storedSector = mCurrentSector;

        // lap end/start
        if (mCurrentSector === 0 && this.previousBestLapTime) {
            this.storedDelta = timings.mCurrentSector3Time - this.previousFastestSector3Time;
            // this.storedDelta = timings.mLastLapTime - this.previousBestLapTime;
        }

        // sector 0 end
        if (mCurrentSector === 1) {
            this.storedDelta = timings.mCurrentSector1Time - this.previousFastestSector1Time;
            // this.storedDelta = timings.mCurrentSector1Time - timings.mFastestSector1Time;
        }

        // sector 1 end
        if (mCurrentSector === 2) {
            this.storedDelta = timings.mCurrentSector2Time - this.previousFastestSector2Time;
            // this.storedDelta = timings.mCurrentSector2Time - timings.mFastestSector2Time;
        }

        // update previous best lap time.
        // we store the previous best as mBestLapTime gets updated over the line when you
        // improve so we can't calculate the difference any more
        this.previousBestLapTime = timings.mBestLapTime;
        this.previousFastestSector1Time = timings.mFastestSector1Time;
        this.previousFastestSector2Time = timings.mFastestSector2Time;
        this.previousFastestSector3Time = timings.mFastestSector3Time;

        // reset delta display timeout
        await this.resetDeltaDisplayTimeout();
        await this.deltaDisplayTimeout();
    }

    /**
     */
    async deltaDisplay(delta) {
        let prefix = '±';
        if (delta < 0) { 
            prefix = '-';
        }
        if (delta > 0) { 
            prefix = '+';
        }

        return `${prefix}${millisecondsToTime(delta)}`;
    }

    /**
     * 
     */
    async deltaVisible(mCurrentTime, delta, deltaStatus) { 
        if (!mCurrentTime) {
            return false;
        } 

        if (!delta) {
            return false;
        } 

        if (!deltaStatus) {
            return false;
        }

        return this.isDeltaVisible;
    }
    /**
     * 
     */
    async resetDeltaDisplayTimeout() { 
        return this.isDeltaVisible = true;
    }

    /**
     */
    async deltaDisplayTimeout() {
        setTimeout(() => {
            this.isDeltaVisible = false;
        }, 5000);
    }

    /**
     */
    async deltaStatusDisplay(delta) {
        if (!delta) { 
            return null;
        }

        let status = 'zero';
        if (delta > 0) {
            status = 'positive';
        }

        if (delta < 0) {
            status = 'negative';
        }

        return status;
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

        // create shortname from first 3 characters of first item
        let shortname = parts[0].slice(0, 3);

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
     * @param {*} sortedParticipantData 
     * @returns array
     */
    async getStandingsData(user, sortedParticipantData) {
        // get participants ahead
        const ahead = sortedParticipantData.slice(0, user.positionIndex);

        // get participants behind
        const behind = sortedParticipantData.slice(user.positionIndex + 1, sortedParticipantData.length);

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
     * @param {*} participantsData 
     * @returns array
     */
    async getSortedParticipants(participantsData) {
        return [].concat(participantsData).sort((a, b) => {
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
}

new StandingsWorker();
