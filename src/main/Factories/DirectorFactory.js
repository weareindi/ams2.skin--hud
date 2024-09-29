import { getActiveParticipant, getParticipantInPostion, getParticipantsSortedByPosition, getParticipantsSortedIntoClass, isReady, hasEventStarted } from '../../utils/CrestUtils';
import { random, weightedArray } from '../../utils/DataUtils';
import stc from "string-to-color";

export default class DirectorFactory {
    constructor() {

        this.baseTimes = {
            blank: 1000,
            solo: 8000,
            leaderboard: 1000,
            standings: 1000 * 6, // 6 participants per page
            battle: 8000,
        };

        this.minTimes = {
            blank: null,
            solo: null,
            leaderboard: null,
            standings: null,
            battle: null,
        };

        this.currentView = null;
        this.view = null;

        this.defaultView = 'auto';
        // this.commandAuto = null;
        // this.commandBlank = null;
        // this.commandSolo = null;
        // this.commandLeaderboard = null;
        // this.commandStandings = null;
        // this.commandBattle = null;

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
            this.timeStart = null;
            this.timeStandings = null;

            this.minTimes = {
                blank: null,
                solo: null,
                leaderboard: null,
                standings: null,
                battle: null,
            };
        } catch (error) {
            console.error(error);
        }
    }

    /**
     *
     */
    async updateBinds() {
        // if (
        //     !globalShortcut.isRegistered(this.commandAuto)
        //     || !globalShortcut.isRegistered(this.commandBlank)
        //     || !globalShortcut.isRegistered(this.commandSolo)
        //     || !globalShortcut.isRegistered(this.commandLeaderboard)
        //     || !globalShortcut.isRegistered(this.commandStandings)
        //     || !globalShortcut.isRegistered(this.commandBattle)
        // ) {
        //     globalShortcut.unregisterAll();
        // }

        // globalShortcut.register(this.commandAuto, () => {
        //     console.log('auto mode selected');
        //     this.view = 'auto';
        // });

        // globalShortcut.register(this.commandBlank, () => {
        //     console.log('blank view selected');
        //     this.view = 'blank';
        // });

        // globalShortcut.register(this.commandSolo, () => {
        //     console.log('solo view selected');
        //     this.view = 'solo';
        // });

        // globalShortcut.register(this.commandLeaderboard, () => {
        //     console.log('leaderboard view selected');
        //     this.view = 'leaderboard';
        // });

        // globalShortcut.register(this.commandStandings, () => {
        //     console.log('standings view selected');
        //     this.view = 'standings';
        // });

        // globalShortcut.register(this.commandBattle, () => {
        //     console.log('battle view selected');
        //     this.view = 'battle';
        // });
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

        // update vars
        // await this.getVariables();
        // await this.updateBinds();

        // let view = await this.getCurrentView(data);
        let view = 'battle';

        // if auto, then get
        if (view === 'auto') {
            const eventStarted = await hasEventStarted(data);
            if (!eventStarted) {
                return 'solo';
            }

            // available views
            let views = await this.getWeightedViews(data);
            views = await this.filterToPointsOfInterest(data, views);

            // select auto view
            view = await this.selectAutoView(data, views);
        }

        const vData = await this.getViewData(data, view);
        if (vData === null) {
            return null;
        }

        data.director = {
            view: view,
            data: vData
        };

        return data;
    }

    /**
     *
     * @param {*} data
     * @param {*} view
     */
    async updateMinTimes(data, view, multiplier = 1) {
        if (view === 'blank') {
            return this.minTimes.blank = this.baseTimes.blank * multiplier;
        }

        if (view === 'solo') {
            return this.minTimes.solo = this.baseTimes.solo * multiplier;
        }

        if (view === 'leaderboard') {
            return this.minTimes.leaderboard = this.baseTimes.leaderboard * multiplier;
        }

        if (view === 'standings') {
            return this.minTimes.standings = this.baseTimes.standings * multiplier;
        }

        if (view === 'battle') {
            return this.minTimes.battle = this.baseTimes.battle * multiplier;
        }
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
            await this.updateMinTimes(data, view);

            return null;
        }

        if (view === 'solo') {
            await this.updateMinTimes(data, view);

            return {
                mParticipantIndex: participant.mParticipantIndex
            };
        }

        if (view === 'leaderboard') {
            const eventStarted = await hasEventStarted(data);
            if (!eventStarted) {
                return null;
            }

            await this.updateMinTimes(data, view, data.participants.mNumParticipants);

            return {
                mParticipantIndex: participant.mParticipantIndex,
                classes: await this.getLeaderboard(data),
            };
        }

        if (view === 'standings') {
            const eventStarted = await hasEventStarted(data);
            if (!eventStarted) {
                return null;
            }

            const standings = await this.getStandings(data);
            const multiplier = await this.getStandingsMultiplier(standings);
            await this.updateMinTimes(data, view, multiplier);
            const { classIndex, classPageIndex } = await this.getStandingsActivePageIndices(standings, multiplier)

            return {
                mParticipantIndex: participant.mParticipantIndex,
                standings: standings,
                classIndex: classIndex,
                classPageIndex: classPageIndex,
            }
        }

        if (view === 'battle') {
            const eventStarted = await hasEventStarted(data);
            if (!eventStarted) {
                return null;
            }

            await this.updateMinTimes(data, view);

            const battle = await this.getBattle(data);
            return battle;
        }

        return null;
    }

    async getStandingsMultiplier(standings) {
        let multiplier = 0;
        for (const mCarClassName in standings) {
            multiplier += standings[mCarClassName].pages.length;
        }
        return multiplier;
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
            this.timeStart = performance.now();
            this.currentView = nextView;
            return this.currentView.label;
        }

        let duration = performance.now() - this.timeStart;

        if (duration > this.minTimes[this.currentView.label]) {
            this.timeStart = performance.now();
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
        const classes = await getParticipantsSortedIntoClass(data);

        // remove safety car
        delete classes['SafetyCar'];

        // return indexes only
        for (const mCarClassName in classes) {
            classes[mCarClassName] = {
                mCarClassName: mCarClassName,
                mCarClassColor: stc(mCarClassName),
                participants: classes[mCarClassName]
                    .map((participant) => {
                        return participant.mParticipantIndex;
                    })
            }
        }

        return classes;
    }

    /**
     *
     * @param {*} data
     * @returns
     */
    async getStandings(data) {
        // sorted by position
        const classes = await getParticipantsSortedIntoClass(data);

        // remove safety car
        delete classes['SafetyCar'];

        // return indexes only
        for (const mCarClassName in classes) {

            const pages = [];
            for (let pi = 0; pi < classes[mCarClassName].length; pi += 6) {
                pages.push( classes[mCarClassName].slice(pi, pi + 6) );
            }

            classes[mCarClassName] = {
                mCarClassName: mCarClassName,
                mCarClassColor: stc(mCarClassName),
                pages: pages.map((page) => {
                    return page.map((participant) => {
                        return participant.mParticipantIndex;
                    });
                }),
            }
        }

        return classes;
    }

    /**
     *
     * @param {*} standings
     * @param {*} multiplier
     * @returns
     */
    async getStandingsActivePageIndices(standings, multiplier) {
        // no time started? start now
        if (this.timeStandings === null) {
            this.timeStandings = performance.now();
        }

        // reset timer if time passed
        if (this.timeStandings + this.minTimes.standings < performance.now()) {
            this.timeStandings = performance.now();
        }

        // get current overall page
        let page = 0;
        for (let index = 0; index < multiplier; index++) {
            if (performance.now() - this.timeStandings > (this.baseTimes.standings * index)) {
                page = index;
            }
        }

        // loop until page match
        let classPageCounter = -1;
        let classIndex = 0;
        let classPageIndex = 0;
        for (const mCarClassName in standings) {
            // loop through pages of current class
            for (classPageIndex = 0; classPageIndex < standings[mCarClassName].pages.length; classPageIndex++) {
                // increment page counter
                classPageCounter++;

                // ... until it matches page
                if (classPageCounter === page) {
                    break;
                }
            }

            // also stop here if page number matches
            if (classPageCounter === page) {
                break;
            }

            // increment class
            classIndex++;
        }

        return {
            classIndex,
            classPageIndex
        };
    }
}