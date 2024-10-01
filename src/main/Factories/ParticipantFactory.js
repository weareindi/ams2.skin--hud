import { isReady, getParticipantAtIndex, getParticipantInPostion, getActiveParticipant, getParticipantInClassPostion, getParticipantsSortedByRaceDistance } from '../../utils/CrestUtils';
import stc from "string-to-color";
import * as storage from 'rocket-store';

export default class ParticipantFactory {
    constructor() {
        this.init();
    }

    /**
     *
     */
    async init() {
        try {
            this.storage = await storage.Rocketstore();
            await this.reset();
        } catch (error) {
            console.error(error);
        }
    }

    /**
     *
     */
    async reset() {
        try {
            this.hasReinflated = false;

            this.driverIndex = null;
            this.isDriver = false;

            this.outlap = false;
            this.outlapNumber = false;

            this.newlap = false;
            this.newlapTimer = null;
            this.newlapDistance = 0;

            this.mRacePositionStartStored = null;
            this.mCarClassPositionStartStored = null;

            this.runID = null;
            this.lap = {
                runID: null,
                mCurrentLap: null,
                mCurrentLapTimes: null,
                mLapsInvalidated: null,
                mFuelLevel: null,
            };
            this.laps = [];
        } catch (error) {
            console.error(error);
        }
    }

    /**
     *
     */
    async reinflate(data, participant) {
        if (this.hasReinflated) {
            return;
        }

        // if (!participant.mIsDriver) {
        //     return this.laps;
        // }

        // set to true so we dont run again
        this.hasReinflated = true;

        // update laps laps data
        this.laps = await this.getStoredLaps();
        this.mRacePositionStartStored = await this.getStoredRacePositionStart(participant.mParticipantIndex);
        this.mCarClassPositionStartStored = await this.getStoredCarClassPositionStart(participant.mParticipantIndex);
    }

    /**
     *
     */
    async getStoredLaps() {
        return await new Promise(async (resolve, reject) => {
            const stored = await this.storage.get('laps', 'laps');
            if (stored.count === 0) {
                return resolve([]);
            }

            return resolve(stored.result[0]);
        });
    }

    /**
     *
     * @param {*} laps
     * @returns
     */
    async setStoredLaps(laps) {
        return await this.storage.post('laps', 'laps', laps);
    }

    /**
     *
     */
    async getStoredRacePositionStart(mParticipantIndex) {
        return await new Promise(async (resolve, reject) => {
            const stored = await this.storage.get('mRacePositionStart', mParticipantIndex);
            if (stored.count === 0) {
                return resolve(null);
            }

            return resolve(stored.result[0]);
        });
    }

    /**
     *
     * @param {*} laps
     * @returns
     */
    async setStoredRacePositionStart(mParticipantIndex, mRacePosition) {
        return await this.storage.post('mRacePositionStart', mParticipantIndex, mRacePosition);
    }

    /**
     *
     */
    async getStoredCarClassPositionStart(mParticipantIndex) {
        return await new Promise(async (resolve, reject) => {
            const stored = await this.storage.get('mCarClassPositionStart', mParticipantIndex);
            if (stored.count === 0) {
                return resolve(null);
            }

            return resolve(stored.result[0]);
        });
    }

    /**
     *
     * @param {*} laps
     * @returns
     */
    async setStoredCarClassPositionStart(mParticipantIndex, mCarClassPosition) {
        return await this.storage.post('mCarClassPositionStart', mParticipantIndex, mCarClassPosition);
    }

    /**
     *
     * @param {*} data
     * @param {*} mParticipantIndex
     * @returns
     */
    async getData(data, mParticipantIndex) {
        try {
            return await this.prepareData(data, mParticipantIndex);
        } catch (error) {
            console.error(error);
        }
    }

    /**
     *
     * @param {*} data
     * @param {*} mParticipantIndex
     * @returns
     */
    async prepareData(data, mParticipantIndex) {
        const ready = await isReady(data);
        if (!ready) {
            return null;
        }

        let participant = await getParticipantAtIndex(data, mParticipantIndex);
        if (participant === null) {
            return null;
        }

        data.participants.mParticipantInfo[mParticipantIndex].mIsDriver = await this.mIsDriver(data, mParticipantIndex);
        data.participants.mParticipantInfo[mParticipantIndex].mParticipantIndex = mParticipantIndex;
        data.participants.mParticipantInfo[mParticipantIndex].mPlacementIndex = await this.mPlacementIndex(data, mParticipantIndex);

        await this.reinflate(data, data.participants.mParticipantInfo[mParticipantIndex]);
        await this.processCurrentLapState(data, data.participants.mParticipantInfo[mParticipantIndex]);

        data.participants.mParticipantInfo[mParticipantIndex].mCurrentLapTimes = await this.mCurrentLapTimes(data.participants.mParticipantInfo[mParticipantIndex]);
        data.participants.mParticipantInfo[mParticipantIndex].mNameMain = await this.mNameMain(data.participants.mParticipantInfo[mParticipantIndex]);
        data.participants.mParticipantInfo[mParticipantIndex].mNameShort = await this.mNameShort(data.participants.mParticipantInfo[mParticipantIndex]);
        data.participants.mParticipantInfo[mParticipantIndex].mNameTag = await this.mNameTag(data.participants.mParticipantInfo[mParticipantIndex]);
        data.participants.mParticipantInfo[mParticipantIndex].mCarNamesMain = await this.mCarNames(data.participants.mParticipantInfo[mParticipantIndex]);
        data.participants.mParticipantInfo[mParticipantIndex].mCarClassName = await this.mCarClassName(data.participants.mParticipantInfo[mParticipantIndex]);
        data.participants.mParticipantInfo[mParticipantIndex].mCarClassNamesShort = await this.mCarClassNamesShort(data.participants.mParticipantInfo[mParticipantIndex]);
        data.participants.mParticipantInfo[mParticipantIndex].mCarClassColor = await this.mCarClassColor(data.participants.mParticipantInfo[mParticipantIndex]);
        data.participants.mParticipantInfo[mParticipantIndex].mCarClassPosition = await this.mCarClassPosition(data, data.participants.mParticipantInfo[mParticipantIndex]);
        data.participants.mParticipantInfo[mParticipantIndex].mKPH = await this.mKPH(data.participants.mParticipantInfo[mParticipantIndex]);
        data.participants.mParticipantInfo[mParticipantIndex].mOutLap = await this.mOutLap(data.participants.mParticipantInfo[mParticipantIndex]);
        data.participants.mParticipantInfo[mParticipantIndex].mOutLapLabel = await this.mOutLapLabel(data.participants.mParticipantInfo[mParticipantIndex]);
        data.participants.mParticipantInfo[mParticipantIndex].mIsNewLap = await this.mIsNewLap(data.participants.mParticipantInfo[mParticipantIndex]);
        data.participants.mParticipantInfo[mParticipantIndex].mInvalidLap = await this.mInvalidLap(data.participants.mParticipantInfo[mParticipantIndex]);
        data.participants.mParticipantInfo[mParticipantIndex].mLapsInfo = await this.mLapsInfo(data.participants.mParticipantInfo[mParticipantIndex]);
        data.participants.mParticipantInfo[mParticipantIndex].mFastestLapTimes = await this.mFastestLapTimes(data.participants.mParticipantInfo[mParticipantIndex]);
        data.participants.mParticipantInfo[mParticipantIndex].mLastLapTimes = await this.mLastLapTimes(data.participants.mParticipantInfo[mParticipantIndex]);
        data.participants.mParticipantInfo[mParticipantIndex].mRacingDistance = await this.mRacingDistance(data, data.participants.mParticipantInfo[mParticipantIndex]);
        data.participants.mParticipantInfo[mParticipantIndex].mRacingDistanceParticipantAhead = await this.mRacingDistanceParticipantAhead(data, data.participants.mParticipantInfo[mParticipantIndex]);
        data.participants.mParticipantInfo[mParticipantIndex].mPitModesLabel = await this.mPitModesLabel(data.participants.mParticipantInfo[mParticipantIndex]);
        data.participants.mParticipantInfo[mParticipantIndex].mPitSchedulesLabel = await this.mPitSchedulesLabel(data.participants.mParticipantInfo[mParticipantIndex]);
        data.participants.mParticipantInfo[mParticipantIndex].mRacePositionStart = await this.mRacePositionStart(data.participants.mParticipantInfo[mParticipantIndex]);
        data.participants.mParticipantInfo[mParticipantIndex].mCarClassPositionStart = await this.mCarClassPositionStart(data.participants.mParticipantInfo[mParticipantIndex]);

        // data.participants.mParticipantInfo[mParticipantIndex].mLastSector1Times = await this.mLastSector1Times(data.participants.mParticipantInfo[mParticipantIndex]);
        // data.participants.mParticipantInfo[mParticipantIndex].mLastSector2Times = await this.mLastSector2Times(data.participants.mParticipantInfo[mParticipantIndex]);
        // data.participants.mParticipantInfo[mParticipantIndex].mLastSector3Times = await this.mLastSector3Times(data.participants.mParticipantInfo[mParticipantIndex]);

        return data.participants.mParticipantInfo[mParticipantIndex];
    }

    // /**
    //  *
    //  */
    // async mLastSector1Times(participant) {
    //     return -1;
    // }

    // /**
    //  *
    //  */
    // async mLastSector2Times(participant) {
    //     return -1;
    // }

    // /**
    //  *
    //  */
    // async mLastSector3Times(participant) {
    //     return -1;
    // }

    /**
     *
     */
    async mRacePositionStart(participant) {
        if (this.mRacePositionStartStored === null) {
            this.mRacePositionStartStored = participant.mRacePosition;

            // store just incase hud closes
            await this.setStoredRacePositionStart(participant.mParticipantIndex, participant.mRacePosition);
        }

        return this.mRacePositionStartStored;
    }

    /**
     *
     */
    async mCarClassPositionStart(participant) {
        if (this.mCarClassPositionStartStored === null) {
            this.mCarClassPositionStartStored = participant.mCarClassPosition;

            // store just incase hud closes
            await this.setStoredCarClassPositionStart(participant.mParticipantIndex, participant.mCarClassPosition);
        }

        return this.mCarClassPositionStartStored;
    }

    /**
     *
     */
    async mPitModesLabel(participant) {
        if (participant.mPitModes === 1) {
            return 'Pit';
        }

        if (participant.mPitModes === 2) {
            return 'Pit';
        }

        if (participant.mPitModes === 3) {
            return 'Pit';
        }

        if (participant.mPitModes === 4) {
            return 'Pit';
        }

        if (participant.mPitModes === 5) {
            return 'Pit';
        }

        return null;
    }

    /**
     *
     */
    async mPitSchedulesLabel(participant) {
        if (participant.mPitSchedules === 1) {
            return 'Pitting';
        }

        if (participant.mPitSchedules === 2) {
            return 'Pitting';
        }

        if (participant.mPitSchedules === 3) {
            return 'Damage';
        }

        if (participant.mPitSchedules === 4) {
            return 'MAND';
        }

        if (participant.mPitSchedules === 5) {
            return 'DT';
        }

        if (participant.mPitSchedules === 6) {
            // return 'Stop+Go';
        }

        if (participant.mPitSchedules === 7) {
            // return 'Occupied';
        }

        return null;
    }

    /**
     *
     * @param {*} data
     * @param {*} mParticipantIndex
     * @returns
     */
    async mRacingDistance(data, participant) {
        // if (data.gameStates.mSessionState !== 5) {
        //     return null;
        // }

        if (participant.mCurrentLapDistance === null) {
            return null;
        }

        if (participant.mCurrentLap === null) {
            return null;
        }

        return participant.mCurrentLapDistance + ((participant.mCurrentLap - 1) * data.eventInformation.mTrackLength);
    }

    /**
     *
     * @param {*} data
     * @param {*} participant
     * @returns
     */
    async mRacingDistanceParticipantAhead(data, participant) {
        // if not race, no need to calculate
        if (data.gameStates.mSessionState !== 5) {
            return null;
        }

        // if leader, no need to calculate
        if (participant.mRacePosition <= 1) {
            return null;
        }

        if (participant.mCurrentLapDistance === null) {
            return null;
        }

        if (participant.mCurrentLap === null) {
            return null;
        }

        const participantTotalLapDistance = participant.mCurrentLapDistance + ((participant.mCurrentLap - 1) * data.eventInformation.mTrackLength);
        const participantAhead = await getParticipantInPostion(data, participant.mRacePosition - 1);
        const participantAheadTotalLapDistance = participantAhead.mCurrentLapDistance + ((participantAhead.mCurrentLap - 1) * data.eventInformation.mTrackLength);
        return participantAheadTotalLapDistance - participantTotalLapDistance;
    }

    /**
     *
     * @param {*} data
     * @param {*} mParticipantIndex
     * @returns
     */
    async mPlacementIndex(data, mParticipantIndex) {
        const participants = await getParticipantsSortedByRaceDistance(data);
        if (participants === null) {
            return null;
        }

        for (let pi = 0; pi < participants.length; pi++) {
            if (participants[pi].mParticipantIndex !== mParticipantIndex) {
                continue;
            }

            return pi;
        }

        return null;
    }

    /**
     *
     * @param {*} participant
     */
    async mCarClassName(participant) {
        // split name underscore
        const parts = participant.mCarClassNames.split('_');

        let name = participant.mCarClassNames;
        if (parts) {
            // use first part of name
            name = parts[0];
        }

        // make it uppercase
        return name;
    }

    /**
     *
     * @param {*} participant
     */
    async mCarClassNamesShort(participant) {
        // split name underscore
        const parts = participant.mCarClassNames.split('_');

        let name = participant.mCarClassNames;
        if (parts) {
            // use first part of name
            name = parts[0];
        }

        // remove special chars
        name = name.replaceAll('-', '');

        // create shortname from first 3 characters of first item
        let shortname = name.slice(0, 3);

        if (parts) {
            // remove first part as we've used it
            parts.shift();

            // any more parts? add the first character from the next part only
            if (parts.length) {
                if (shortname.length === 1) {
                    shortname += parts[0].slice(0, 3);
                }
            }
        }

        // make it uppercase
        return shortname.toUpperCase();
    }

    /**
     *
     * @param {*} participant
     */
    async mCarNames(participant) {
        // split name at capitalscv
        const parts = participant.mCarNames.split('-');

        if (parts) {
            return parts[0].trim();
        }

        return mCarNames;
    }

    /**
     *
     * @param {*} participant
     */
    async mCarClassColor(participant) {
        return stc(participant.mCarClassNames);
    }

    /**
     *
     * @param {*} data
     * @param {*} participant
     */
    async mCarClassPosition(data, participant) {
        // sort into class groups
        const mCarClassPositions = {};
        for (let ppi = 1; ppi <= data.participants.mNumParticipants; ppi++) {
            let loopParticipant = await getParticipantInPostion(data, ppi);
            if (loopParticipant === null) {
                continue;
            }

            if (!(loopParticipant.mCarClassNames in mCarClassPositions)) {
                mCarClassPositions[loopParticipant.mCarClassNames] = [];
            }

            mCarClassPositions[loopParticipant.mCarClassNames].push( loopParticipant.mRacePosition );
        }

        if (!Object.keys(mCarClassPositions).length) {
            return null;
        }

        // get index of race position within class group (plus 1)
        return mCarClassPositions[participant.mCarClassNames].indexOf( participant.mRacePosition ) + 1;
    }

    /**
     *
     * @param {*} participant
     * @returns
     */
    async mNameParts(participant) {
        // extract tag
        const regex = /([\[|\(|\{].*?[\]|\)|\}])/g;

        // prep tag
        let tag = '';

        // get matches
        let matches = regex.exec(participant.mName);
        if (matches !== null) {
            // update tag with match
            tag = matches[0];
        }

        // prepare name
        let name = participant.mName
            .replace(tag, '')
            .replace(/^[-_]+/, '') // remove leading _ or - chars
            .replace(/[-_]+$/, '') // remove trailing _ or - chars
            .replace(/[-_]+/, ' ') // replace underscore in names with space
            ;

        // trim surrounding white space
        name = name.trim();

        return {
            name,
            tag
        }
    }

    /**
     *
     * @param {*} participant
     * @returns
     */
    async mNameMain(participant) {
        const mNameParts = await this.mNameParts(participant);

        return mNameParts.name;
    }

    /**
     *
     * @param {*} data
     * @param {*} mParticipantIndex
     * @returns
     */
    async mNameShort(data, mParticipantIndex) {
        const mNameParts = await this.mNameParts(data, mParticipantIndex);
        const nameSplit = mNameParts.name.split(' ');

        let nameShort = '';
        for (let index = 0; index < nameSplit.length - 1; index++) {
            const nameSplitPart = nameSplit[index];
            nameShort += `${nameSplitPart[0]}. `;
        }

        nameShort += nameSplit[nameSplit.length-1];

        return nameShort;
    }

    /**
     *
     * @param {*} data
     * @param {*} mParticipantIndex
     * @returns
     */
    async mNameTag(data, mParticipantIndex) {
        const mNameParts = await this.mNameParts(data, mParticipantIndex);

        const mNameTag = mNameParts.tag.slice(1, -1);

        if (!mNameTag.length) {
            return null;
        }

        return mNameTag.slice(0, 4);
    }

    /**
     *
     * @param {*} data
     * @returns
     */
    async mIsDriver(data, mParticipantIndex) {
        if (data.participants.mViewedParticipantIndex !== mParticipantIndex) {
            return this.isDriver = false;
        }

        // update driver index when ever we are in the car
        if (
            data.unfilteredInput.mUnfilteredThrottle !== 0
            || data.unfilteredInput.mUnfilteredBrake !== 1
            // || data.unfilteredInput.mUnfilteredSteering !== 0
            || data.unfilteredInput.mUnfilteredClutch !== 0
        ) {
            this.driverIndex = data.participants.mViewedParticipantIndex;
        }

        // if we have a driver index and driver index is same as participant
        if (this.driverIndex !== null && this.driverIndex === data.participants.mViewedParticipantIndex) {
            // ... its almost certainly the current driver rather than a monitored driver
            return this.isDriver = true;
        }

        return this.isDriver = false;
    }

    /**
     *
     * @param {*} data
     * @param {*} participant
     */
    async processCurrentLapState(data, participant) {
        const currentLap = await this.getCurrentLap(data, participant);

        if (
            this.runID !== null
            && this.lap.mCurrentLap !== null
            && currentLap.mCurrentLap > this.lap.mCurrentLap
        ) {
            // add stored lap to laps array
            this.laps.push( this.lap );

            // store driver laps is driver for reinflation if app closes mid-session
            if (participant.mIsDriver) {
                await this.setStoredLaps(this.laps);
            }
        }

        // update stored lap with current lap data
        this.lap = currentLap;
    }

    /**
     *
     * @param {*} data
     * @param {*} participant
     */
    async getCurrentLap(data, participant) {
        return {
            runID: await this.getRunID(participant),
            mCurrentLap: participant.mCurrentLap,
            mCurrentLapTimes: await this.mCurrentLapTimes(participant),
            mLapsInvalidated: participant.mLapsInvalidated,
            mFuelLevel: await this.mFuelLevel(data),
        }
    }

    /**
     *
     * @param {*} data
     */
    async mFuelLevel(data) {
        if (this.driverIndex !== null && this.driverIndex === data.participants.mViewedParticipantIndex) {
            return data.carState.mFuelLevel;
        }

        return null;
    }

    /**
     *
     * @param {*} participant
     */
    async getRunID(participant) {
        if (participant.mPitModes !== 0) {
            return await this.generateRunID(participant);
        }

        if (this.runID === null) {
            return await this.generateRunID(participant);
        }

        return this.runID;
    }

    /**
     * Get a new run ID
     * @returns
     */
    async generateRunID() {
        // nothing complex, just the current timestamp
        return this.runID = performance.now();
    }

    /**
     *
     * @param {*} participant
     */
    async mCurrentLapTimes(participant) {
        const mCurrentSectorTimes = [
            participant.mCurrentSector1Times,
            participant.mCurrentSector2Times,
            participant.mCurrentSector3Times,
        ];

        let mCurrentLapTimes = 0;
        for (let csti = 0; csti <= participant.mCurrentSector; csti++) {
            mCurrentLapTimes += mCurrentSectorTimes[csti];
        }

        if (mCurrentLapTimes < 0) {
            return 0;
        }

        return mCurrentLapTimes;
    }

    /**
     *
     * @param {*} participant
     * @returns
     */
    async mLapsInfo(participant) {
        if (!('mLapsInfo' in participant)) {
            return this.laps;
        }

        return participant.mLapsInfo.concat(this.laps);
    }

    /**
     *
     * @param {*} participant
     * @returns
     */
    async mFastestLapTimes(participant) {
        if (participant.mFastestLapTimes <=0 ) {
            return 0;
        }

        return participant.mFastestLapTimes;
    }

    /**
     *
     * @param {*} participant
     * @returns
     */
    async mLastLapTimes(participant) {
        if (participant.mLastLapTimes <=0 ) {
            return 0;
        }

        return participant.mLastLapTimes;
    }

    /**
     *
     * @param {*} participant
     * @returns
     */
    async mOutLap(participant) {
        // not on circuit
        if (participant.mPitModes !== 0) {
            this.outlap = true;
            this.outlapNumber = participant.mCurrentLap;
        }

        // has crossed line not in pit
        if (
            participant.mPitModes === 0
            && (participant.mCurrentLap > this.outlapNumber || (participant.mCurrentLap === 1 && participant.mLapsInvalidated === 0))
        ) {
            this.outlap = false;
        }

        return this.outlap;
    }

    /**
     *
     * @param {*} participant
     * @returns
     */
    async mOutLapLabel(participant) {
        return participant.mOutLap ? 'Out Lap' : '';
    }

    /**
     * Set to true for first X seconds of a lap
     * @param {*} participant
     * @returns
     */
    async mIsNewLap(participant) {
        if (this.newlap === true && this.newlapTimer + 6000 >= performance.now()) {
            return this.newlap;
        }

        // assign fasle as default
        this.newlap = false;

        // has crossed line not in pit
        if (
            participant.mPitModes === 0
            && participant.mCurrentLapDistance < this.newlapDistance
        ) {
            // assign to true
            this.newlap = true;

            // set timer
            this.newlapTimer = performance.now();
        }

        // update distance for next iternation condition
        this.newlapDistance = participant.mCurrentLapDistance;

        return this.newlap;
    }

    /**
     *
     * @param {*} participant
     * @returns
     */
    async mInvalidLap(participant) {
        return participant.mLapsInvalidated;
    }

    /**
     *
     * @param {*} participant
     * @returns
     */
    async mKPH(participant) {
        return Math.floor(participant.mSpeeds * 3.6);
    }
}