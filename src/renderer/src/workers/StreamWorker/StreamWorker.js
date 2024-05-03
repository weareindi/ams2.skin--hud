import localforage from 'localforage';

class StreamWorker {
    constructor() {
        this.StreamWorker = self;
        this.standingsRaf = Date.now();
        this.standingsActivePage = 0;
        this.chaseRaf = Date.now();
        this.director = null;
        this.viewStates = null;
        this.sessionState = null;
        this.init();

    }

    /**
     * Let't get this party started
     */
    async init() {
        try {
            await this.registerListener();
        } catch (error) {
            console.error(error);
        }
    }

    /**
     * Register listener for messages from main thread
     */
    async registerListener() {
        return this.StreamWorker.onmessage = async (event) => {
            if (typeof event.data === 'undefined') {
                return console.error('No message supplied');
            }

            if (event.data.name === 'reset') {
                await this.returnMessage('resetcomplete');
                return;
            }

            if (event.data.name === 'updateview-standingsdata') {
                const solo = await this.getSoloData(event.data.data);
                const standings = await this.getStandingsData(event.data.data);
                const timings = await this.getTimingsData(event.data.data);
                const chaseData = await this.getChaseData(event.data.data);
                const chase = await this.getChaseDataForStream(chaseData);
                const director = await this.getDirector(null, null, solo, timings, standings, chase);

                return await this.returnMessage('streamview', {
                    solo,
                    standings,
                    timings,
                    chase,
                    director
                });
            }

            if (event.data.name === 'update-gamestates') {
                const viewStates = await this.getAvailableViewStates(event.data.data);
                const director = await this.getDirector(null, viewStates);

                return await this.returnMessage('streamview', {
                    viewStates,
                    director
                });
            }

            if (event.data.name === 'updateview-eventdata') {
                const eventTimeRemaining = await this.getEventTimeRemianing(event.data.data);
                const sessionState = await this.getSessionState(event.data.data);
                const director = await this.getDirector(sessionState);

                return await this.returnMessage('streamview', {
                    eventTimeRemaining,
                    sessionState,
                    director
                });
            }
        };
    }

    /**
     * 
     * @param {*} sessionState 
     * @param {*} viewStates 
     * @param {*} solo 
     * @param {*} timings 
     * @param {*} standings 
     * @param {*} chase 
     */
    async getDirector(sessionState, viewStates, solo, timings, standings, chase) {
        if (!sessionState && !this.sessionState) {
            return null;
        }

        if (sessionState) {
            this.sessionState = sessionState;
        }

        if (!viewStates && !this.viewStates) {
            return null;
        }

        if (viewStates) {
            this.viewStates = viewStates;
        }

        if (this.sessionState === 1 // practice
            && this.viewStates.indexOf('solo') !== -1
            && this.viewStates.indexOf('timings') !== -1
            && solo
            && timings
        ) {
            return await this.getDirectorView(solo, timings);
        }

        if (this.sessionState === 3 // qualifying
            && this.viewStates.indexOf('solo') !== -1
            && this.viewStates.indexOf('timings') !== -1
            && solo
            && timings
        ) {
            return await this.getDirectorView(solo, timings);
        }

        if (this.sessionState === 5 // race
            && this.viewStates.indexOf('solo') !== -1
            && this.viewStates.indexOf('timings') !== -1
            && solo
            && timings
            && standings
            && chase
        ) {
            return await this.getDirectorView(solo, timings, standings, chase);
        }

        return null;
    }

    /**
     * 
     */
    async getDirectorView(solo = null, timings = null, standings = null, chase = null) {
        console.log(solo);
        console.log(timings);

        return null;
    }

    /**
     * Easy method to send a message back to parent worker with/without additional data
     * @param {*} name 
     * @param {*} data 
     */
    async returnMessage(name, data = null) {
        if (data === null) {
            return this.StreamWorker.postMessage({
                name
            });
        }

        return this.StreamWorker.postMessage({
            name,
            data
        });
    }

    /**
     * 
     */
    async getEventTimeRemianing(data) {
        if (!('eventTimeRemaining' in data)) {
            return null;
        }

        return data.eventTimeRemaining;
    }

    /**
     * 
     */
    async getSessionName(data) {
        if (!('sessionName' in data)) {
            return null;
        }

        return data.sessionName;
    }

    /**
     * 
     */
    async getSessionState(data) {
        if (!('sessionState' in data)) {
            return null;
        }

        return data.sessionState;
    }

    /**
     * 
     * @param {*} data 
     * @returns array
     */
    async getAvailableViewStates(data) {
        if (data.mGameState !== 2) {
            return null;
        }

        if (data.mRaceState !== 1 && data.mRaceState !== 2) {
            return null;
        }

        if (data.mSessionState === 1) {
            return ['timings', 'solo'];
        }

        if (data.mSessionState === 3) {
            return ['timings', 'solo'];
        }

        if (data.mSessionState === 5) {
            return ['standings', 'solo', 'chase'];
        }

        return null;
    }
    
    /**
     * Get a full stack of standings prepared for the stream
     * @param {*} data 
     * @returns array
     */
    async getSoloData(data) {
        if (!('user' in data)) {
            return null;
        }

        return data.user;
    }
    
    /**
     * Get a full stack of standings prepared for the stream
     * @param {*} data 
     * @returns array
     */
    async getTimingsData(data) {
        if (!('participants' in data)) {
            return null;
        }

        const sorted = [].concat(data.participants).sort((a, b) => {
            return a.mRacePosition - b.mRacePosition;
        });

        return sorted;
    }
    
    /**
     * Get a full stack of standings prepared for the stream
     * @param {*} data 
     * @returns array
     */
    async getStandingsData(data) {
        if (!('participants' in data)) {
            return null;
        }

        const sorted = [].concat(data.participants).sort((a, b) => {
            return a.mRacePosition - b.mRacePosition;
        });

        const pages = [];
        for (let i = 0; i < sorted.length; i += 6) {
            pages.push(sorted.slice(i, i + 6));
        }

        let page = this.standingsActivePage;

        // update values which we're using to limit the tick rate of the request
        const now = Date.now();
        const delta = now - this.standingsRaf;

        // once a second by default
        let interval = 1000;

        if (delta > interval) {
            // update raf
            this.standingsRaf = now - (delta % interval);

            page++;
            if (this.standingsActivePage === pages.length) {
                page = 0;
            }
        }

        // save for next iteration
        this.standingsActivePage = page;

        return {
            page,
            pages
        };
    }

    /**
     * 
     * @param {*} data
     * @returns 
     */
    async getChaseData(data) {
        if (!('userIndex' in data)) {
            return null;
        }

        if (!('user' in data)) {
            return null;
        }

        if (!('standings' in data)) {
            return null;
        }

        if (data.standings.length < 2) {
            return null;
        }

        let ahead = null;
        let behind = null;

        for (let index = 0; index < data.standings.length; index++) {
            const participant = data.standings[index];

            if (!ahead && participant.mRacePosition === data.user.mRacePosition - 1 && index < data.userIndex) {
                ahead = participant;
            }

            if (!behind && participant.mRacePosition === data.user.mRacePosition + 1 && index > data.userIndex) {
                behind = participant;
            }

            if (ahead && behind) {
                break;
            }
        }
        
        return {ahead, user: data.user, behind};
    }

    /**
     * 
     * @param {*} chaseData 
     */
    async getChaseDataForStream(chaseData) {
        if (!chaseData) {
            return null;
        }

        // update values which we're using to limit the tick rate of the request
        const now = Date.now();
        const delta = now - this.chaseRaf;

        // once a second by default
        let interval = 1000;

        // are we ready for a new fetch yet?
        if (delta > interval) {
            this.chaseRaf = now - (delta % interval);

            // ahead
            if (
                !chaseData.ahead
                || !this.driverAhead
                || this.driverAhead.mName !== chaseData.ahead.mName
                // || this.driverAhead.mCurrentLap !== chaseData.user.mCurrentLap
                || chaseData.ahead.distanceToUser > 0
                || chaseData.ahead.distanceToUser < -100
            ) {
                this.driverAhead = chaseData.ahead;
                this.driverAheadCountdown = 5;
            }

            this.driverAheadCountdown--;
            if (this.driverAheadCountdown <= 0) {
                this.driverAheadCountdown = 0;
            }

            if (this.driverAheadCountdown !== 0) {
                chaseData.ahead = null;
            }

            // behind
            if (
                !chaseData.behind
                || !this.driverBehind
                || this.driverBehind.mName !== chaseData.behind.mName
                // || this.driverBehind.mCurrentLap !== chaseData.user.mCurrentLap
                || chaseData.behind.distanceToUser < 0
                || chaseData.behind.distanceToUser > 100
            ) {
                this.driverBehind = chaseData.behind;
                this.driverBehindCountdown = 5;
            }

            this.driverBehindCountdown--;
            if (this.driverBehindCountdown <= 0) {
                this.driverBehindCountdown = 0;
            }

            if (this.driverBehindCountdown !== 0) {
                chaseData.behind = null;
            }
            
            await localforage.setItem('chasestore', chaseData);
        }

        return await localforage.getItem('chasestore');
    }

}

new StreamWorker;
