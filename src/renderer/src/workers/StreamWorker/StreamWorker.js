import localforage from 'localforage';

class StreamWorker {
    constructor() {
        this.StreamWorker = self;

        this.gapMinTime = 6000;

        this.soloMinTime = 30000;

        this.timingsMinTime = 30000;

        this.standingsTimer = null;
        this.standingsPages = null;
        this.standingsPage = null;

        this.chaseRaf = Date.now();
        this.chaseThreshold = 15000; // minimum is 3000
        this.chaseMinTime = 30000;

        this.viewStates = null;
        this.sessionState = null;
        this.sessionName = null;
        this.gameState = null;
        this.raceState = null;

        this.viewTimer = null;
        this.viewActive = false;
        this.viewCurrent = null;
        this.viewLocked = false;
        this.viewLockedTime = 30000;

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
                const view = await this.getDirectorView(solo, timings, standings, chase);

                return await this.returnMessage('streamview', {
                    solo,
                    standings,
                    timings,
                    chase,
                    view
                });
            }

            if (event.data.name === 'update-gamestates') {
                const isPaused = await this.isPaused(event.data.data);
                if (isPaused) {
                    return await this.returnMessage('paused', true);
                }

                const viewStates = this.viewStates = await this.getAvailableViewStates(event.data.data);
                return await this.returnMessage('streamview', {
                    viewStates
                });
            }

            if (event.data.name === 'updateview-eventdata') {
                const eventTimeRemaining = await this.getEventTimeRemaining(event.data.data);
                const eventTimeElapsed = await this.getEventTimeElapsed(event.data.data);
                const sessionName = this.sessionName = await this.getSessionName(event.data.data);
                const sessionState = this.sessionState = await this.getSessionState(event.data.data);
                const gameState = this.gameState = await this.getGameState(event.data.data);
                const raceState = this.raceState = await this.getRaceState(event.data.data);
                const director = await this.getDirector(sessionState, gameState, raceState);
                await this.updateViewLock(gameState, eventTimeElapsed);

                return await this.returnMessage('streamview', {
                    eventTimeRemaining,
                    sessionName,
                    sessionState,
                    gameState,
                    raceState,
                    director
                });
            }
        };
    }

    /**
     * 
     */
    async isPaused(data) {
        if (data.mGameState !== 3) {
            return false;
        }

        return true;
    }

    /**
     * 
     */
    async updateViewLock(gameState, eventTimeElapsed) {
        if (gameState !== 2 || eventTimeElapsed < (this.viewLockedTime / 1000) ) {
            return this.viewLocked = 'solo';
        }

        return this.viewLocked = false;
    }

    /**
     * 
     * @param {*} sessionState 
     * @param {*} gameState 
     * @param {*} raceState 
     * @param {*} eventTimeRemaining 
     * @returns 
     */
    async getDirector(sessionState, gameState, raceState) {
        if (!sessionState) {
            return null;
        }

        if (!gameState) {
            return null;
        }

        if (!raceState) {
            return null;
        }

        if (sessionState === null || gameState === null || raceState === null) {
            return false;
        }

        // not on circuit?
        if (gameState !== 2) {
            // no direction
            return false;
        }

        return true;
    }

    /**
     * 
     * @param {*} solo 
     * @param {*} timings 
     * @param {*} standings 
     * @param {*} chase 
     */
    async getDirectorView(solo, timings, standings, chase) {
        if (this.sessionState === null) {
            return null;
        }

        if (this.viewStates === null) {
            return null;
        }

        if (this.sessionState === 1 // practice
            && this.viewStates.indexOf('solo') !== -1
            && this.viewStates.indexOf('timings') !== -1
        ) {
            return await this.getView(solo, timings);
        }

        if (this.sessionState === 3 // qualifying
            && this.viewStates.indexOf('solo') !== -1
            && this.viewStates.indexOf('timings') !== -1
        ) {
            return await this.getView(solo, timings);
        }

        if (this.sessionState === 5 // race
            && this.viewStates.indexOf('solo') !== -1
            && this.viewStates.indexOf('timings') !== -1
            && this.viewStates.indexOf('standings') !== -1
            && this.viewStates.indexOf('chase') !== -1
        ) {
            return await this.getView(solo, timings, standings, chase);
        }

        return null;
    }

    /**
     * Calculate Director View
     * 
     * This takes the data sets provided and works out whats best for the viewer.
     * 
     * solo: the driver and their basic time
     * timings: times of all cars on track in a list
     * standings: current race positions, chunked for pagination style display
     * chase: 2 way or 3 way battles between the driver and closest opponents
     */
    async getView(solo = null, timings = null, standings = null, chase = null) {
        if (solo === null
            && timings == null
            && standings == null
            && chase == null
        ) {
            return null;
        }

        if (this.viewLocked !== false) {
            return this.viewLocked;
        }

        let activeViews = [];
        activeViews.push('gap');
        if (solo !== null) {
            activeViews.push('solo');
        }
        if (timings !== null) {
            activeViews.push('timings');
        }
        if (standings !== null) {
            activeViews.push('standings');
        }
        if (chase !== null) {
            activeViews.push('chase');
        }

        if (this.viewCurrent === 'gap') {
            if (!this.viewIsActive()) {
                this.viewActivate();
                this.timeStart();
            }

            if (this.viewIsActive()) {
                if (this.timeIsComplete(this.gapMinTime)) {
                    this.timeStop();
                    this.viewDeactivate();
                    
                    // remove from pool so we dont get it 2 times in a row
                    activeViews.splice(activeViews.indexOf('gap'), 1);
                }
            }
        }

        if (this.viewCurrent === 'solo') {
            if (!this.viewIsActive()) {
                this.viewActivate();
                this.timeStart();
            }

            if (this.viewIsActive()) {
                if (this.timeIsComplete(this.soloMinTime)) {
                    this.timeStop();
                    this.viewDeactivate();
                    
                    // remove from pool so we dont get it 2 times in a row
                    activeViews.splice(activeViews.indexOf('solo'), 1);
                }
            }
        }
        
        if (this.viewCurrent === 'timings') {
            if (!this.viewIsActive()) {
                this.viewActivate();
                this.timeStart();
            }

            if (this.viewIsActive()) {
                if (this.timeIsComplete(this.timingsMinTime)) {
                    this.timeStop();
                    this.viewDeactivate();
                    
                    // remove from pool so we dont get it 2 times in a row
                    activeViews.splice(activeViews.indexOf('timings'), 1);
                }
            }
        }
        
        if (this.viewCurrent === 'chase') {
            if (!this.viewIsActive()) {
                this.viewActivate();
                this.timeStart();
            }

            if (this.viewIsActive()) {
                if (this.timeIsComplete(this.chaseMinTime) || activeViews.indexOf('chase') === -1) {
                    this.timeStop();
                    this.viewDeactivate();
                    
                    // remove from pool so we dont get it 2 times in a row
                    activeViews.splice(activeViews.indexOf('chase'), 1);
                }
            }
        }
        
        if (this.viewCurrent === 'standings') {
            if (!this.viewIsActive()) {
                this.viewActivate();
                this.standingsStart();
            }

            if (this.viewIsActive()) {
                if (this.standingsComplete()) {
                    this.standingsStop();
                    this.standingsReset();
                    this.viewDeactivate();
                    
                    // remove from pool so we dont get it 2 times in a row
                    activeViews.splice(activeViews.indexOf('standings'), 1);
                }
            }
        }

        if (!this.viewIsActive()) {
            this.viewCurrent = null;

            // select random view
            if (activeViews.length > 0) {
                this.viewCurrent = activeViews[ Math.floor( Math.random() * activeViews.length ) ];
            }

            // chase view always wins
            if (activeViews.indexOf('chase') !== -1) {
                this.viewCurrent = 'chase';
            }
        }

        return this.viewCurrent;
    }

    /**
     */
    timeStart() {
        this.viewTimer = Date.now();
    }
    
    /**
     */
    timeIsComplete(time) {
        const now = Date.now();
        const delta = now - this.viewTimer;

        return delta > time ? true : false;
    }
    
    /**
     */
    timeStop() {
        this.viewTimer = null;
    }

    /**
     */
    viewActivate() {
        this.viewActive = true;
    }

    /**
     */
    viewIsActive() {
        return this.viewActive;
    }
    
    /**
     */
    viewDeactivate() {
        this.viewActive = false;
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

        // not started?
        if (this.standingsTimer === null) {
            // ... bail
            return true;
        }

        // store data for use outside of function
        if (this.standingsPages === null) {
            const sorted = [].concat(data.participants).sort((a, b) => {
                return a.mRacePosition - b.mRacePosition;
            });
    
            const pages = [];
            for (let i = 0; i < sorted.length; i += 6) {
                pages.push(sorted.slice(i, i + 6));
            }

            this.standingsPages = pages;
        }

        let page = this.standingsPage;

        if (page === null) {
            page = 0;
        }

        // update values which we're using to limit the tick rate of the request
        const now = Date.now();
        const delta = now - this.standingsTimer;

        // once a second by default
        let interval = 6 * 1000; // 6 seconds a page

        // wait for iteration
        if (delta > interval) {
            // update raf
            this.standingsTimer = now - (delta % interval);
            
            page++;

            if (page > this.standingsPages.length) {
                page = null;
            }
        }

        // save for next iteration
        this.standingsPage = page;

        return {
            page,
            pages: this.standingsPages
        };
    }

    standingsStart() {
        this.standingsTimer = Date.now();
    }

    standingsComplete() {
        if (this.standingsPages === null) {
            return false;
        }

        return this.standingsPage === this.standingsPages.length ? true : false;
    }

    standingsStop() {
        this.standingsTimer = null;
    }

    standingsReset() {
        this.standingsPages = null;
        this.standingsPage = null;
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

            if (
                !ahead
                && participant.mRacePosition === data.user.mRacePosition - 1
                && index < data.userIndex
                && participant.distanceToUser !== null
                && participant.calculatedCurrentTime > 0
            ) {
                ahead = participant;
            }

            if (
                !behind
                && participant.mRacePosition === data.user.mRacePosition + 1
                && index > data.userIndex
                && participant.distanceToUser !== null
                && participant.calculatedCurrentTime > 0
            ) {
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

        // prepare chase threshold
        let chaseThreshold = this.chaseThreshold / 1000;
        if (chaseThreshold < 5) {
            chaseThreshold = 5;
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
                this.driverAheadCountdown = chaseThreshold;
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
                this.driverBehindCountdown = chaseThreshold;
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

        const data = await localforage.getItem('chasestore');

        if (data === null) {
            return null;
        }

        if (data.ahead === null && data.behind === null) {
            return null;
        }

        return data;
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
    async getEventTimeElapsed(data) {
        if (!('eventTimeElapsed' in data)) {
            return null;
        }

        return data.eventTimeElapsed;
    }

    /**
     * 
     */
    async getEventTimeRemaining(data) {
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
     */
    async getGameState(data) {
        if (!('gameState' in data)) {
            return null;
        }

        return data.gameState;
    }

    /**
     * 
     */
    async getRaceState(data) {
        if (!('raceState' in data)) {
            return null;
        }

        return data.raceState;
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
            return ['standings', 'timings', 'solo', 'chase'];
        }

        return null;
    }
}

new StreamWorker;
