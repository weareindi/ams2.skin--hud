import { isReady } from '../../utils/CrestUtils';
import { display } from '../../utils/DataUtils';
import { millisecondsToTime } from '../../utils/TimeUtils';

/**
 * The asumption with this factory is that all values in data exist.
 * Either as a view ready value or null;
 */
export default class ViewFactory {
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

        const view = {};

        // we only want to process whats being used by the view
        view.vCurrentLap = await this.vCurrentLap(data);
        view.vLapsInEvent = await this.vLapsInEvent(data);
        view.vEventDuration = await this.vEventDuration(data);
        view.vNumParticipants = await this.vNumParticipants(data);
        view.vRacePosition = await this.vRacePosition(data);
        
        // view.vFastestLapTimes = await this.vFastestLapTimes(data);
        // view.vLastLapTimes = await this.vLastLapTimes(data);

        // console.log(view);
        return view;
    }
    
    /**
     * 
     */
    async vCurrentLap(data) {
        const participant = data.participants.mParticipantInfo[ data.participants.mViewedParticipantIndex ];

        if (participant.mCurrentLap === null) {
            return null;
        }

        return display(participant.mCurrentLap, null, null, 'Lap');
    }

    /**
     * 
     */
    async vLapsInEvent(data) {
        if (data.eventInformation.mLapsInEvent === null) {
            return null;
        }

        return display(data.eventInformation.mLapsInEvent, null, null, 'Laps');
    }

    /**
     * 
     */
    async vEventDuration(data) {
        if (data.eventInformation.mEventTimeRemaining === null) {
            return null;
        }

        return display(data.eventInformation.mEventTimeRemaining, null, null, 'Laps');
    }

    /**
     * 
     */
    async vNumParticipants(data) {
        if (data.participants.mNumParticipants === null) {
            return null;
        }

        return display(data.participants.mNumParticipants, null, null, 'Participants');
    }

    /**
     * 
     */
    async vRacePosition(data) {
        const participant = data.participants.mParticipantInfo[ data.participants.mViewedParticipantIndex ];
        return display(participant.mRacePosition, null, null, 'Position');
    }

    // /**
    //  * 
    //  */
    // async vFastestLapTimes(data) {
    //     const participant = data.participants.mParticipantInfo[ data.participants.mViewedParticipantIndex ];
    //     return display(millisecondsToTime(participant.mFastestLapTimes), null, null, 'Fastest Lap');
    // }

    // /**
    //  * 
    //  */
    // async vLastLapTimes(data) {
    //     const participant = data.participants.mParticipantInfo[ data.participants.mViewedParticipantIndex ];
    //     return display(millisecondsToTime(participant.mLastLapTimes), null, null, 'Previous Lap');
    // }
}