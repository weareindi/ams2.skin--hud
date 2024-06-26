import { millisecondsToTime } from '../../utils/TimeUtils';

class EventWorker {
    constructor() {
        this.init();
    }

    /**
     * Time to shine!
     */
    async init() {
        try {
            await this.registerListeners();
        } catch (error) {
            console.error(error);
        }
    }

    /**
     * Register listener for messages from parent worker
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
                await this.reset();
                await this.returnMessage('resetcomplete');
            }
        };
    }

    /**
     * Reset vars used at start of each event
     */
    async reset() {}
    
    /**
     * Check and prepare supplied data from parent worker
     * @param {*} data 
     * @returns object
     */
    async prepareData(data) {
        if (!('eventInformation' in data)) {
            return null;
        }

        if (!('timings' in data)) {
            return null;
        }

        const eventData = await this.getEventData(data);

        return {...eventData}
    }

    /**
     * 
     * @param {*} data 
     */
    async getEventData(data) {
        if (!('timings' in data)) {
            return null;
        }

        if (!('mEventTimeRemaining' in data.timings)) {
            return null;
        }

        if (!('eventInformation' in data)) {
            return null;
        }

        if (!('mSessionDuration' in data.eventInformation)) {
            return null;
        }

        if (!('gameStates' in data)) {
            return null;
        }

        if (!('mSessionState' in data.gameStates)) {
            return null;
        }

        return {
            eventTimeRemaining: await this.getEventTimeRemaining(data.timings.mEventTimeRemaining),
            eventTimeElapsed: await this.getEventTimeElapsed(data.eventInformation.mSessionDuration, data.timings.mEventTimeRemaining),
            gameState: await this.getGameState(data.gameStates.mGameState),
            raceState: await this.getRaceState(data.gameStates.mRaceState),
            sessionName: await this.getSessionName(data.gameStates.mSessionState),
            sessionState: await this.getSessionState(data.gameStates.mSessionState)
        }
    }

    /**
     * 
     */
    async getEventTimeRemaining(mEventTimeRemaining) {
        if (mEventTimeRemaining < 0) {
            return millisecondsToTime(0, true);
        }

        return millisecondsToTime(mEventTimeRemaining, true);
    }

    /**
     * 
     */
    async getEventTimeElapsed(mSessionDuration, mEventTimeRemaining) {
        const elapsed = mSessionDuration - mEventTimeRemaining;

        if (elapsed > mSessionDuration) {
            return mSessionDuration;
        }

        return elapsed;
    }

    /**
     * 
     */
    async getSessionName(mSessionState) {
        if (mSessionState === 1) {
            return 'practice';
        }

        if (mSessionState === 3) {
            return 'qualifying';
        }

        if (mSessionState === 5) {
            return 'race';
        }

        return null;
    }

    /**
     * 
     */
    async getSessionState(mSessionState) {
        return mSessionState;
    }

    /**
     * 
     */
    async getGameState(mGameState) {
        return mGameState;
    }

    /**
     * 
     */
    async getRaceState(mRaceState) {
        return mRaceState;
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

new EventWorker();
