import { isReady, getActiveParticipant } from '../../utils/CrestUtils';
import { millisecondsToTime } from '../../utils/TimeUtils';

export default class TimingsFactory {
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
            this.mParticipantIndex = null;
            this.splitTimePreviousSector = null;
            this.splitTimeIsNewSector = false;
            this.splitTimeTimer = performance.now();
        } catch (error) {
            console.error(error);
        }
    }

    /**
     *
     * @param {*} data
     * @returns
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
        const ready = await isReady(data);
        if (!ready) {
            return null;
        }

        const participant = await getActiveParticipant(data);
        data.timings.mSplitTime = await this.mSplitTime(data, participant);
        data.timings.mSplitTimeDisplay = await this.mSplitTimeDisplay(data, participant);
        data.timings.mSplitTimeState = await this.mSplitTimeState(data, participant);
        data.timings.mSplitTimeAhead = await this.mSplitTimeAhead(data, participant);
        data.timings.mSplitTimeBehind = await this.mSplitTimeBehind(data, participant);

        return data;
    }

    /**
     *
     * @param {*} data
     */
    async mSplitTime(data, participant) {
        if (participant.mLastLapTimes <= 0) {
            return null;
        }

        return data.timings.mSplitTime;
    }

    /**
     *
     * @param {*} data
     */
    async mSplitTimeDisplay(data, participant) {
        if (this.mParticipantIndex == null) {
            this.mParticipantIndex = participant.mParticipantIndex;
        }

        if (participant.mParticipantIndex !== this.mParticipantIndex) {
            await this.reset();
        }

        if (this.splitTimePreviousSector === null) {
            this.splitTimePreviousSector = participant.mCurrentSector;
        }

        if (participant.mCurrentSector !== this.splitTimePreviousSector) {
            this.splitTimePreviousSector = participant.mCurrentSector;
            this.splitTimeTimer = performance.now();
        }

        if (this.splitTimeTimer + 5400 < performance.now()) {
            return null;
        }

        if (participant.mLastLapTimes <= 0) {
            return null;
        }

        // display lap time if over the line and lap is fastest as it updates all other vars and returns 0
        if (participant.mLastLapTimes === participant.mFastestLapTimes && participant.mCurrentSector === 0) {
            return millisecondsToTime(participant.mLastLapTimes);
        }

        // lets be in control of the prefix
        let prefix = '+';
        if (data.timings.mSplitTime <= 0) {
            prefix = '-';
        }

        return `${prefix}${Math.abs(data.timings.mSplitTime).toFixed(3)}`;
    }

    /**
     *
     * @param {*} data
     * @param {*} participant
     */
    async mSplitTimeState(data, participant) {
        const state = (value) => {
            // green flashing
            if (participant.mLastLapTimes === participant.mFastestLapTimes && participant.mCurrentSector === 0) {
                return 2;
            }

            if (value <= 0) {
                return 1;
            }

            if (value >= 0) {
                return 5;
            }

            return 0;
        }

        return state(data.timings.mSplitTime);
    }

    /**
     *
     * @param {*} data
     */
    async mSplitTimeAhead(data, participant) {
        if (data.timings.mSplitTimeAhead < 0) {
            return null;
        }

        if (typeof participant.mDistanceAhead === 'string') {
            return participant.mDistanceAhead;
        }

        return data.timings.mSplitTimeAhead;
    }

    /**
     *
     * @param {*} data
     */
    async mSplitTimeBehind(data, participant) {
        if (data.timings.mSplitTimeBehind < 0) {
            return null;
        }

        if (typeof participant.mDistanceBehind === 'string') {
            return participant.mDistanceBehind;
        }

        return data.timings.mSplitTimeBehind;
    }
}