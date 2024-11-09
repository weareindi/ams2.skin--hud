import { isReady, getParticipantAtIndex, getParticipantInPostion, getActiveParticipant } from '../../utils/CrestUtils';
import ParticipantFactory from './ParticipantFactory';

export default class ParticipantsFactory {
    constructor() {
        this.init();
    }

    /**
     *
     */
    async init() {
        try {
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
            await this.resetParticipantFactories();

            this.participantFactories = {};
        } catch (error) {
            console.error(error);
        }
    }

    /**
     *
     */
    async resetParticipantFactories() {
        for (const mName in this.participantFactories) {
            const participantFactory = this.participantFactories[mName];
            await participantFactory.reset();
        }
    }

    /**
     *
     * @param {*} data
     * @returns
     */
    async getData(data) {
        try {
            await this.removeDeadParticipants(data);
            await this.registerParticipantFactories(data);
            return await this.prepareData(data);
        } catch (error) {
            console.error(error);
        }
    }

    /**
     *
     */
    async getParticipantFactories() {
        return this.participantFactories;
    }

    /**
     * When a participant leaves the lobby, remove their participant factory
     * @param {*} data
     */
    async removeDeadParticipants(data) {
        for (const mName in this.participantFactories) {
            const mNameExists = await this.mNameExists(data, mName);

            if (mNameExists) {
                continue;
            }

            delete this.participantFactories[mName];
        }
    }

    /**
     *
     * @param {*} data
     * @param {*} mName
     * @returns
     */
    async mNameExists(data, mName) {
        for (let pii = 0; pii < data.participants.mParticipantInfo.length; pii++) {
            if (data.participants.mParticipantInfo[pii].mName === mName) {
                return true;
            }
        }

        return false;
    }

    /**
     *
     * @param {*} data
     */
    async registerParticipantFactories(data) {
        for (let pi = 0; pi < data.participants.mNumParticipants; pi++) {
            // already exists?
            if (data.participants.mParticipantInfo[pi].mName in this.participantFactories) {
                // ... skip
                continue;
            }

            // start new lap factory for participant
            this.participantFactories[data.participants.mParticipantInfo[pi].mName] = new ParticipantFactory();
        }
    }

    /**
     *
     * @param {*} data
     * @returns
     */
    async prepareData(data) {
        const ready = await isReady(data);
        if (!ready) {
            return null;
        }

        for (let pi = 0; pi < data.participants.mNumParticipants; pi++) {
            let participantFactory = await this.getParticipantFactory(data, pi);
            data.participants.mParticipantInfo[pi] = await participantFactory.getData(data, pi);
        }

        // append non-pariticpant count (ie. safety car)
        data.participants.mNumNonParticipants = await this.mNumNonParticipants(data);

        // append non-pariticpant count (ie. safety car)
        data.participants.mNumActiveParticipants = await this.mNumActiveParticipants(data);

        // append classes
        data.participants.mClasses = await this.mClasses(data);

        // append class info
        data.participants.mActiveParticipantClassNum = await this.mActiveParticipantClassNum(data);

        // append class info
        data.participants.mNumClasses = await this.mNumClasses(data);

        // apply mRacingDistance
        data = await this.applyParticipantAdditionals(data);

        // append fastest lap index
        data.participants.mFastestLapParticipantIndex = await this.mFastestLapParticipantIndex(data);

        return data;
    }

    /**
     *
     * @param {*} data
     */
    async mNumClasses(data) {
        if (!('participants' in data)) {
            return null;
        }

        if (!('mClasses' in data.participants)) {
            return null;
        }

        return Object.keys(data.participants.mClasses).length;
    }

    /**
     *
     * @param {*} data
     * @returns
     */
    async mFastestLapParticipantIndex(data) {
        let mFastestLapParticipantIndex = null;
        let mFastestLapTimes = 999999999999;
        for (let pi = 0; pi < data.participants.mNumActiveParticipants; pi++) {
            // time not at quick as previous iteration
            if (data.participants.mParticipantInfo[pi].mFastestLapTimes > mFastestLapTimes) {
                continue;
            }

            // no time set, skip
            if (data.participants.mParticipantInfo[pi].mFastestLapTimes <= 0) {
                continue;
            }

            mFastestLapTimes = data.participants.mParticipantInfo[pi].mFastestLapTimes;
            mFastestLapParticipantIndex = data.participants.mParticipantInfo[pi].mParticipantIndex;
        }

        return mFastestLapParticipantIndex;
    }

    /**
     *
     * @param {*} data
     * @returns
     */
    async applyParticipantAdditionals(data) {
        for (let pi = 0; pi < data.participants.mNumActiveParticipants; pi++) {
            data.participants.mParticipantInfo[pi].mDistanceAhead = await this.mDistanceAhead(data, data.participants.mParticipantInfo[pi]);
            data.participants.mParticipantInfo[pi].mDistanceBehind = await this.mDistanceBehind(data, data.participants.mParticipantInfo[pi]);
        }

        return data;
    }

    /**
     *
     * @param {*} data
     * @param {*} participant
     */
    async mDistanceAhead(data, participant) {
        if (participant === null) {
            return null;
        }

        if (!('mRacePosition' in participant)) {
            return null;
        }

        if (participant.mRacePosition === 1) {
            return null;
        }

        if (!('mRacingDistance' in participant)) {
            return null;
        }

        if (participant.mRacingDistance === null) {
            return null;
        }

        const aheadParticipant = await getParticipantInPostion(data, participant.mRacePosition - 1);

        if (aheadParticipant === null) {
            return null;
        }

        if (!('mRacingDistance' in aheadParticipant)) {
            return null;
        }

        if (aheadParticipant.mRacingDistance === null) {
            return null;
        }

        let difference = aheadParticipant.mRacingDistance - participant.mRacingDistance;
        if (difference < 0) {
            difference = 0;
        }


        const laps = Math.floor(difference / data.eventInformation.mTrackLength);
        if (laps > 0) {
            return `${laps}` // return as string so we know string == lap counter
        }

        return difference;
    }

    /**
     *
     * @param {*} data
     * @param {*} participant
     */
    async mDistanceBehind(data, participant) {
        if (participant === null) {
            return null;
        }

        if (!('mRacePosition' in participant)) {
            return null;
        }

        if (participant.mRacePosition === 1) {
            return null;
        }

        if (participant.mRacePosition === data.participants.mNumActiveParticipants) {
            return null;
        }

        if (!('mRacingDistance' in participant)) {
            return null;
        }

        if (participant.mRacingDistance === null) {
            return null;
        }

        const behindParticipant = await getParticipantInPostion(data, participant.mRacePosition + 1);

        if (behindParticipant === null) {
            return null;
        }

        if (!('mRacingDistance' in behindParticipant)) {
            return null;
        }

        if (behindParticipant.mRacingDistance === null) {
            return null;
        }

        let difference = participant.mRacingDistance - behindParticipant.mRacingDistance;
        if (difference < 0) {
            difference = 0;
        }

        const laps = Math.floor(difference / data.eventInformation.mTrackLength);
        if (laps > 0) {
            return `${laps}` // return as string so we know string == lap counter
        }

        return difference;
    }

    // /**
    //  *
    //  */
    // async mTimeAhead(data, participant) {
    //     if (participant.mRacePosition === 1) {
    //         return null;
    //     }

    //     if (participant.mCurrentLapTimes === null) {
    //         return null;
    //     }

    //     if (participant.mCurrentLapTimes <= 0) {
    //         return null;
    //     }

    //     const aheadParticipant = await getParticipantInPostion(data, participant.mRacePosition - 1);

    //     if (aheadParticipant.mCurrentLapTimes === null) {
    //         return null;
    //     }

    //     if (aheadParticipant.mCurrentLapTimes <= 0) {
    //         return null;
    //     }

    //     let difference = Math.abs(aheadParticipant.mCurrentLapTimes - participant.mCurrentLapTimes);
    //     if (aheadParticipant.mCurrentLap - participant.mCurrentLap === 1 ) {
    //         difference = Math.abs((aheadParticipant.mCurrentLapTimes + aheadParticipant.mLastLapTimes) - participant.mCurrentLapTimes);
    //     }

    //     const laps = Math.floor((aheadParticipant.mRacingDistance - participant.mRacingDistance) / data.eventInformation.mTrackLength);
    //     if (laps > 0) {
    //         return `${laps}` // return as string so we know string == lap counter
    //     }

    //     return difference;
    // }

    // /**
    //  *
    //  */
    // async mTimeBehind(data, participant) {
    //     if (participant.mRacePosition === data.participants.mNumActiveParticipants) {
    //         return null;
    //     }

    //     if (participant.mCurrentLapTimes === null) {
    //         return null;
    //     }

    //     if (participant.mCurrentLapTimes <= 0) {
    //         return null;
    //     }

    //     const behindParticipant = await getParticipantInPostion(data, participant.mRacePosition + 1);

    //     if (behindParticipant.mCurrentLapTimes === null) {
    //         return null;
    //     }

    //     if (behindParticipant.mCurrentLapTimes <= 0) {
    //         return null;
    //     }

    //     const difference = Math.abs(participant.mCurrentLapTimes - behindParticipant.mCurrentLapTimes);
    //     const laps = Math.floor((participant.mRacingDistance - behindParticipant.mRacingDistance) / data.eventInformation.mTrackLength);
    //     if (laps > 0) {
    //         return `${laps}` // return as string so we know string == lap counter
    //     }

    //     return difference;
    // }

    /**
     *
     * @param {*} data
     * @returns
     */
    async mNumNonParticipants(data) {
        let nonParticipants = 0;

        for (let pi = 0; pi < data.participants.mNumParticipants; pi++) {
            if (data.participants.mParticipantInfo[pi].mCarClassNames === 'SafetyCar') {
                nonParticipants++;
            }
        }

        return nonParticipants;
    }

    /**
     *
     * @param {*} data
     * @returns
     */
    async mNumActiveParticipants(data) {
        let numParticipants = 0;

        for (let pi = 0; pi < data.participants.mNumParticipants; pi++) {
            if (data.participants.mParticipantInfo[pi].mCarClassNames === 'SafetyCar') {
                continue;
            }

            numParticipants++;
        }

        return numParticipants;
    }

    /**
     * Count total valid classes
     * @param {*} data
     * @returns
     */
    async mClasses(data) {
        const classes = {};

        for (let pi = 0; pi < data.participants.mNumParticipants; pi++) {
            if (data.participants.mParticipantInfo[pi].mCarClassNames === 'SafetyCar') {
                continue;
            }

            if (!(data.participants.mParticipantInfo[pi].mCarClassNames in classes)) {
                classes[data.participants.mParticipantInfo[pi].mCarClassNames] = 0;
            }

            classes[data.participants.mParticipantInfo[pi].mCarClassNames]++;
        }

        return classes;
    }

    /**
     * Count active participant class participants
     * @param {*} data
     * @returns
     */
    async mActiveParticipantClassNum(data) {

        // get participant
        let participant = await getActiveParticipant(data);

        // get classes
        const classes = await this.mClasses(data);
        if (!(participant.mCarClassNames in classes)) {
            return 0;
        }

        // return amount for participant class
        return classes[participant.mCarClassNames];
    }

    /**
     *
     * @param {*} data
     * @param {*} participantIndex
     * @returns
     */
    async getParticipantFactory(data, participantIndex) {
        let participant = await getParticipantAtIndex(data, participantIndex);
        let participantFactories = await this.getParticipantFactories();

        if (!(participant.mName in participantFactories)) {
            return null;
        }

        return participantFactories[participant.mName];
    }
}