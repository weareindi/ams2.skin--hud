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
            const participant = data.participants.mParticipantInfo[pii];

            if (participant.mName === mName) {
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
        for (let participantIndex = 0; participantIndex < data.participants.mNumParticipants; participantIndex++) {
            const participant = await getParticipantAtIndex(data, participantIndex);
            const mName = participant.mName;

            // already exists?
            if (mName in this.participantFactories) {
                // ... skip
                continue;
            }

            // start new lap factory for participant
            this.participantFactories[mName] = new ParticipantFactory();
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

        for (let participantIndex = 0; participantIndex < data.participants.mNumParticipants; participantIndex++) {
            let participantFactory = await this.getParticipantFactory(data, participantIndex);
            let participant = await participantFactory.getData(data, participantIndex);
            data.participants.mParticipantInfo[participantIndex] = participant;
        }

        // append non-pariticpant count (ie. safety car)
        data.participants.mNumNonParticipants = await this.mNumNonParticipants(data);

        // append classes
        data.participants.mClasses = await this.mClasses(data);

        // append class info
        data.participants.mActiveParticipantClassNum = await this.mActiveParticipantClassNum(data);

        // apply mRacingDistance
        data = await this.applyParticipantDistances(data);

        return data;
    }

    /**
     *
     * @param {*} data
     * @returns
     */
    async mNumNonParticipants(data) {
        let nonParticipants = 0;

        for (let participantIndex = 0; participantIndex < data.participants.mNumParticipants; participantIndex++) {
            const participant = await getParticipantAtIndex(data, participantIndex);

            if (participant.mCarClassNames === 'SafetyCar') {
                nonParticipants++;
            }
        }

        return nonParticipants;
    }

    /**
     * Count total valid classes
     * @param {*} data
     * @returns
     */
    async mClasses(data) {
        const classes = {};

        for (let participantIndex = 0; participantIndex < data.participants.mNumParticipants; participantIndex++) {
            let participant = await getParticipantAtIndex(data, participantIndex);

            if (participant.mCarClassNames === 'SafetyCar') {
                continue;
            }

            if (!(participant.mCarClassNames in classes)) {
                classes[participant.mCarClassNames] = 0;
            }

            classes[participant.mCarClassNames]++;
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

        // return amount for participant class
        return classes[participant.mCarClassNames];
    }

    /**
     *
     * @param {*} data
     * @returns
     */
    async applyParticipantDistances(data) {

        for (let pii = 0; pii < data.participants.mParticipantInfo.length; pii++) {
            // if not race
            if (data.gameStates.mSessionState !== 5) {
                data.participants.mParticipantInfo[pii].mRacingDistance = null;
                continue;
            }

            // if leader
            if (data.participants.mParticipantInfo[pii].mRacePosition === 1) {
                data.participants.mParticipantInfo[pii].mRacingDistance = null;
                continue;
            }

            const participant = data.participants.mParticipantInfo[ pii ];

            if (participant.mRacePosition <= 0) {
                data.participants.mParticipantInfo[pii].mRacingDistance = null;
                continue;
            }

            const participantTotalLapDistance = participant.mCurrentLapDistance + ((participant.mCurrentLap - 1) * data.eventInformation.mTrackLength);
            const participantAhead = await getParticipantInPostion(data, participant.mRacePosition - 1);
            const participantAheadTotalLapDistance = participantAhead.mCurrentLapDistance + ((participantAhead.mCurrentLap - 1) * data.eventInformation.mTrackLength);
            const participantDistanceAhead = participantAheadTotalLapDistance - participantTotalLapDistance;
            data.participants.mParticipantInfo[pii].mRacingDistance = participantDistanceAhead;
        }

        return data;
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