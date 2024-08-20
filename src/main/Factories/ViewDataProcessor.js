import { millisecondsToTime } from '../../utils/TimeUtils';
import { display } from "../../utils/DataUtils";

export default class ViewDataProcessor {
    constructor() {}

    /**
     * 
     */
    async getData(data) {
        try {
            return await this.prepareData(data);
        } catch (error) {
            console.error(error);
        }
    }

    /**
     * 
     * @param {*} data 
     * @returns 
     */
    async prepareData(data) {
        return {
            mCurrentLap: await this.mCurrentLap(data),
            mLapsInEvent: await this.mLapsInEvent(data),
            mNumParticipants: await this.mNumParticipants(data),
            mRacePosition: await this.mRacePosition(data),
            mFastestLapTimes: await this.mFastestLapTimes(data),
            mLastLapTimes: await this.mLastLapTimes(data),
        };

        // return data.participants.mParticipantInfo[ data.participants.mViewedParticipantIndex ];
    }

    /**
     * 
     */
    async mCurrentLap(data) {
        const participant = data.participants.mParticipantInfo[ data.participants.mViewedParticipantIndex ];
        return display(participant.mCurrentLap, null, null, 'Lap');
    }

    /**
     * 
     */
    async mLapsInEvent(data) {
        return display(data.eventInformation.mLapsInEvent, null, null, 'Laps');
    }

    /**
     * 
     */
    async mNumParticipants(data) {
        const participant = data.participants.mParticipantInfo[ data.participants.mViewedParticipantIndex ];
        return display(participant.mNumParticipants, null, null, 'Participants');
    }

    /**
     * 
     */
    async mRacePosition(data) {
        const participant = data.participants.mParticipantInfo[ data.participants.mViewedParticipantIndex ];
        return display(participant.mRacePosition, null, null, 'Position');
    }

    /**
     * 
     */
    async mFastestLapTimes(data) {
        const participant = data.participants.mParticipantInfo[ data.participants.mViewedParticipantIndex ];
        return display(millisecondsToTime(participant.mFastestLapTimes), null, null, 'Fastest Lap');
    }

    /**
     * 
     */
    async mLastLapTimes(data) {
        const participant = data.participants.mParticipantInfo[ data.participants.mViewedParticipantIndex ];
        return display(millisecondsToTime(participant.mLastLapTimes), null, null, 'Previous Lap');
    }
}