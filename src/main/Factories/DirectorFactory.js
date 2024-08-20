import { getActiveParticipant, getParticipantInPostion, getParticipantsSortedByPosition, isReady } from '../../utils/CrestUtils';
import { random, weightedArray } from '../../utils/DataUtils';
import { globalShortcut } from 'electron/main';
import SettingsVariables from '../../variables/SettingsVariables';

export default class DirectorFactory {
    constructor() {
        this.minTimes = {
            blank: null,
            solo: null,
            leaderboard: null,
            standings: null,
            battle: null,
        };

        this.timeNow = null;
        this.timeStart = null;
        this.currentView = null;
        // this.nextView = null;
        // this.mode = null;

        this.view = null;
        this.defaultView = null;
        this.commandAuto = null;
        this.commandBlank = null;
        this.commandSolo = null;
        this.commandLeaderboard = null;
        this.commandStandings = null;
        this.commandBattle = null;

        this.init();
    }

    /**
     * 
     */
    async init() {
        try {
            await this.registerSettingsVariables();
            await this.reset();
        } catch (error) {
            console.error(error);
        }
    }

    /**
     * 
     */
    async registerSettingsVariables() {
        this.SettingsVariables = new SettingsVariables();
    }

    /**
     * 
     */
    async getVariables() {
        this.defaultView = await this.SettingsVariables.get('DirectorDefaultView');
        this.commandAuto = await this.SettingsVariables.get('DirectorCommandAuto');
        this.commandBlank = await this.SettingsVariables.get('DirectorCommandBlank');
        this.commandSolo = await this.SettingsVariables.get('DirectorCommandSolo');
        this.commandLeaderboard = await this.SettingsVariables.get('DirectorCommandLeaderboard');
        this.commandStandings = await this.SettingsVariables.get('DirectorCommandStandings');
        this.commandBattle = await this.SettingsVariables.get('DirectorCommandBattle');
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
     */
    async updateBinds() {
        if (
            !globalShortcut.isRegistered(this.commandAuto)
            || !globalShortcut.isRegistered(this.commandBlank)
            || !globalShortcut.isRegistered(this.commandSolo)
            || !globalShortcut.isRegistered(this.commandLeaderboard)
            || !globalShortcut.isRegistered(this.commandStandings)
            || !globalShortcut.isRegistered(this.commandBattle)
        ) {            
            globalShortcut.unregisterAll();
        }

        globalShortcut.register(this.commandAuto, () => {
            console.log('auto mode selected');
            this.view = 'auto';
        });

        globalShortcut.register(this.commandBlank, () => {
            console.log('blank view selected');
            this.view = 'blank';
        });

        globalShortcut.register(this.commandSolo, () => {
            console.log('solo view selected');
            this.view = 'solo';
        });

        globalShortcut.register(this.commandLeaderboard, () => {
            console.log('leaderboard view selected');
            this.view = 'leaderboard';
        });

        globalShortcut.register(this.commandStandings, () => {
            console.log('standings view selected');
            this.view = 'standings';
        });

        globalShortcut.register(this.commandBattle, () => {
            console.log('battle view selected');
            this.view = 'battle';
        });
        
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

        // update vars
        await this.getVariables();  
        await this.updateBinds();      

        let view = await this.getCurrentView(data);        

        // if auto, then get
        if (view === 'auto') {
            // set min times
            await this.setMinTimes(data);

            // available views
            let views = await this.getWeightedViews(data);
            views = await this.filterToPointsOfInterest(data, views);

            // select auto view
            view = await this.selectAutoView(data, views);
        }

        let viewData =  await this.getViewData(data, view);

        data.director = {
            view: view,
            data: viewData
        };

        return data;
    }

    /**
     * 
     * @param {*} data 
     */
    async getCurrentView(data) {
        if (this.view === null) {
            return this.defaultView;
        }

        return this.view;
    }

    /**
     * 
     * @param {*} data 
     * @param {*} view 
     */
    async getViewData(data, view) {
        if (view === null) {
            return null;
        }

        const participant = await getActiveParticipant(data);

        if (view === 'blank') {
            return null;
        }

        if (view === 'solo') {
            return {
                mParticipantIndex: participant.mParticipantIndex
            };
        }

        if (view === 'leaderboard') {
            return {
                mParticipantIndex: participant.mParticipantIndex,
                participants: await this.getLeaderboard(data),
            };
        }

        if (view === 'standings') {
            const standings = await this.getStandings(data);
            return {
                mParticipantIndex: participant.mParticipantIndex,
                page: standings.page,
                participants: standings.participants,
            }
        }

        if (view === 'battle') {
            const battle = await this.getBattle(data);
            return battle;
        }
        

        return null;
    }

    /**
     * 
     * @param {*} data 
     */
    async getBattle(data) {
        const participant = await getActiveParticipant(data);

        const battle = {
            driver: participant.mParticipantIndex
        };

        if (participant.mBattlingParticipantAhead) {
            battle.ahead = (await getParticipantInPostion(data, participant.mRacePosition - 1)).mParticipantIndex;
        }

        if (participant.mBattlingParticipantBehind) {
            battle.behind = (await getParticipantInPostion(data, participant.mRacePosition + 1)).mParticipantIndex;
        }

        return battle;
    }

    /**
     * 
     * @param {*} data 
     * @returns 
     */
    async getLeaderboard(data) {
        // sorted by position
        const participants = await getParticipantsSortedByPosition(data);

        // return mParticipantIndex only
        return [].concat(participants).map((participant) => {
            return participant.mParticipantIndex;
        })
    }

    /**
     * 
     * @param {*} data 
     * @returns 
     */
    async getStandings(data) {
        // sorted by position
        let participants = await getParticipantsSortedByPosition(data);

        // reduce to mParticipantIndex
        participants = participants.map((participant) => {
            return participant.mParticipantIndex;
        });

        // split into pages
        const pages = [];
        for (let pi = 0; pi < participants.length; pi += 6) {
            pages.push( participants.slice(pi, pi + 6) );
        }
        
        let duration = Date.now() - this.timeStart;
        let pageDuration = this.minTimes.standings / pages.length;

        let currentPage = 0;
        for (let pi = 0; pi < pages.length; pi++) {
            if (duration >= (pageDuration * pi)) {
                currentPage = pi;
            }      
        }

        return {
            page: currentPage,
            participants: pages[currentPage]
        };
    }

    /**
     * 
     * @param {*} data 
     */
    async setMinTimes(data) {
        // blank / show nothing
        const blankMinTIme = 10000;

        // solo
        const soloMinTIme = 120000;

        // 5000ms + 1000ms per participant
        const leaderboardMinTIme = 10000 + (1000 * data.participants.mNumParticipants);

        // standings show 6 participants per page.
        // 1000ms per participant * 6 participants * amount of pages
        const standingsMinTime = (1000 * 6) * Math.ceil(data.participants.mNumParticipants / 6);

        // battle
        const battleMinTIme = 120000;
        
        this.minTimes = {
            blank: blankMinTIme,
            solo: soloMinTIme,
            leaderboard: leaderboardMinTIme,
            standings: standingsMinTime,
            battle: battleMinTIme,
        };
    }

    /**
     * 
     * @param {*} data 
     * @param {*} views 
     */
    async selectAutoView(data, views) {
        if (!views.length) {
            return null;
        }

        let nextView = random(views);

        // first iteration
        if (this.currentView === null) {
            this.timeStart = Date.now();
            this.currentView = nextView;
            return this.currentView.label;
        }

        let duration = Date.now() - this.timeStart;

        if (duration > this.minTimes[this.currentView.label]) {
            this.timeStart = Date.now();
            this.currentView = nextView;
            return this.currentView.label;
        }

        return this.currentView.label;
    }

    /**
     * 
     * @param {*} data 
     */
    async getWeightedViews(data) {
        let views = [];

        // all
        views.push({
            label: 'blank',
            weight: 0.1
        });
        views.push({
            label: 'solo',
            weight: 0.4
        });
        views.push({
            label: 'leaderboard',
            weight: 0.4
        });

        // practice
        if (data.gameStates.mSessionState === 1) {
            //
        }

        // qualifying
        if (data.gameStates.mSessionState === 3) {
            //
        }

        // race
        if (data.gameStates.mSessionState === 5) {
            views.push({
                label: 'standings',
                weight: 0.4
            });
            views.push({
                label: 'battle',
                weight: 0.6
            });
        }

        return weightedArray(views);
    }

    /**
     * 
     * @param {*} data 
     * @param {*} views 
     */
    async filterToPointsOfInterest(data, views) {
        const participant = await getActiveParticipant(data);

        // remove battle from view if not battling
        if (!participant.mBattlingParticipantAhead && !participant.mBattlingParticipantBehind) {
            views = views.filter((view) => {
                return view.label !== 'battle';
            });
        }

        return views;
    }
}