import { isReady } from '../../utils/CrestUtils';

export default class EventTimingsFactory {
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
            // console.log(this.db);
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

        data.eventTimings = await this.eventTimings(data);

        return data;
    }

    /**
     * 
     * @param {*} data 
     * @returns 
     */
    async eventTimings(data) {
        return {
            mEventTimeRemaining: await this.mEventTimeRemaining(data)
        };
    }

    /**
     * 
     * @param {*} data 
     * @returns 
     */
    async mEventTimeRemaining(data) {
        if (!data.eventInformation.mSessionDuration) {
            return null;
        }
        
        // before race start?
        if (
            data.timings.mCurrentTime < 0
            && data.gameStates.mSessionState === 5
        ) {            
            return data.eventInformation.mSessionDuration;
        }

        return data.timings.mEventTimeRemaining;
    }
}