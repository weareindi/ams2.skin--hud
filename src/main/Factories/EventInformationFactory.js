import { isReady } from '../../utils/CrestUtils';

export default class EventInformationFactory {
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
    
        data.eventInformation.mEventTimeRemaining = await this.mEventTimeRemaining(data);
        data.eventInformation.mLapsInEvent = await this.mLapsInEvent(data);        
        data.eventInformation.mAdditionalLap = await this.mAdditionalLap(data);        
        
        return data;
    }

    /**
     * Only starts counting down if the session has started
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

    /**
     * 
     * @param {*} data 
     * @returns 
     */
    async mLapsInEvent(data) {
        if (!data.eventInformation.mLapsInEvent) {
            return null;
        }

        return data.eventInformation.mLapsInEvent;
    }

    /**
     * 
     * @param {*} data 
     * @returns 
     */
    async mAdditionalLap(data) {
        return null;
    }
}