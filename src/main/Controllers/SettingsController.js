import { screen } from 'electron';
import { is } from '@electron-toolkit/utils';
import DisplayProcessor from './DisplayController.js';
import * as storage from 'rocket-store';

export default class SettingsController {
    constructor() {
        // singleton
        if (typeof global.SettingsController !== 'undefined') {
            return global.SettingsController;
        }
        global.SettingsController = this;

        this.data = null;

        this.init();
    }

    async init() {
        try {
            this.storage = await storage.Rocketstore();

            await this.registerDisplayProcessor();
        } catch (error) {
            console.error(error);
        }
    }

    /**
     *
     * @returns
     */
    async updateStoredSettings() {
        this.storedSettings = await new Promise(async (resolve, reject) => {
            const stored = await this.storage.get('settings', 'settings');
            if (stored.count === 0) {
                return resolve({});
            }

            resolve(stored.result[0]);
        });


        return this.storedSettings;
    }

    /**
     *
     */
    async registerDisplayProcessor() {
        return this.DisplayProcessor = new DisplayProcessor();
    }

    /**
     *
     * @param {*} key
     * @returns
     */
    async clear() {
        return await this.storage.delete('settings');
    }

    /**
     *
     * @param {*} key
     * @returns
     */
    async set(key, value) {
        // get all settings (as we store them in a single object)
        let settings = await this.getAll();

        // update/add required key value pair in object
        settings[key] = value;

        // reset this.data so it refetches updated dataset
        this.data = null;

        // store object
        return await this.storage.post('settings', 'settings', settings);
    }

    /**
     *
     * @param {*} key
     * @returns
     */
    async get(key = null) {
        let settings = await this.getAll();

        if (!(key in settings)) {
            return null;
        }

        return settings[key];
    }

    /**
     *
     * @returns
     */
    async getAll() {
        if (this.data !== null) {
            return this.data;
        }

        // get defaults
        const defaultData = await this.getDefaultData();

        // get stored data
        const storedData = await this.getStoredData();

        // defaults first, they get replaced if they exist by stored set
        return this.data = {...defaultData, ...storedData};
    }

    /**
     *
     * @returns
     */
    async getDefaultData() {
        const primaryDisplay = screen.getPrimaryDisplay();

        const data = {};

        data.SettingsOnStartup = true;
        data.Debug = false;
        data.ExternalCrest = false;
        data.IP = '127.0.0.1';
        data.Port = 8180;
        data.Connected = false;
        data.TickRate = 24;
        data.SettingsDisplay = primaryDisplay.id;
        data.HudEnabled = false;
        data.HudDisplay = primaryDisplay.id;
        // data.AutoDirectorEnabled = false;
        // data.AutoDirectorDisplay = primaryDisplay.id;
        data.DirectorEnabled = false;
        data.DirectorDisplay = primaryDisplay.id;
        data.DirectorDefaultView = 'auto';
        data.DirectorStartingView = 'solo';
        data.DirectorCommandAuto = 'ctrl+Num0';
        data.DirectorCommandBlank = 'ctrl+Num1';
        data.DirectorCommandSolo = 'ctrl+Num2';
        data.DirectorCommandLeaderboard = 'ctrl+Num3';
        data.DirectorCommandStandings = 'ctrl+Num4';
        data.DirectorCommandBattle = 'ctrl+Num5';

        // data.Developer = false;
        // data.MockFetch = false;
        // data.MockState = (await this.getMockStateOptions())[0].value;

        return data;
    }

    /**
     *
     * @returns
     */
    async getStoredData() {
        let storedSettings = await new Promise(async (resolve, reject) => {
            const stored = await this.storage.get('settings', 'settings');

            if (typeof stored !== 'object') {
                return resolve({});
            }

            if (stored.count === 0) {
                return resolve({});
            }

            if (!('result' in stored)) {
                return resolve({});
            }

            if (stored.result[0] === 'string') {
                return resolve({});
            }

            return resolve(stored.result[0]);
        });

        if (typeof storedSettings === 'string') {
            storedSettings = {};
        }

        // check displays exist
        storedSettings = await this.checkStoredDeveloper(storedSettings);
        storedSettings = await this.checkStoredDisplays(storedSettings);

        return storedSettings;
    }

    /**
     *
     */
    async checkStoredDeveloper(storedSettings) {
        if (typeof storedSettings === 'string') {
            storedSettings = {};
        }

        storedSettings['Developer'] = false;
        if (is.dev) {
            storedSettings['Developer'] = true;
        }

        return storedSettings;
    }

    /**
     *
     */
    async checkStoredDisplays(storedSettings) {
        if (typeof storedSettings === 'string') {
            storedSettings = {};
        }


        if ('SettingsDisplay' in storedSettings) {
            storedSettings['SettingsDisplay'] = await this.DisplayProcessor.getDisplayID(storedSettings['SettingsDisplay']);
        }

        if ('HudDisplay' in storedSettings) {
            storedSettings['HudDisplay'] = await this.DisplayProcessor.getDisplayID(storedSettings['HudDisplay']);
        }

        // if ('AutoDirectorDisplay' in storedSettings) {
        //     storedSettings['AutoDirectorDisplay'] = await this.DisplayProcessor.getDisplayID(storedSettings['AutoDirectorDisplay']);
        // }

        if ('DirectorDisplay' in storedSettings) {
            storedSettings['DirectorDisplay'] = await this.DisplayProcessor.getDisplayID(storedSettings['DirectorDisplay']);
        }

        return storedSettings;
    }

    /**
     *
     */
    async getAllOptions() {
        const options = {};
        options.SettingsOnStartupOptions = await this.getDefaultYesNo();
        // options.DebugOptions = await this.getDefaultYesNo();
        options.ExternalCrestOptions = await this.getDefaultYesNo();

        options.SettingsDisplayOptions = await this.getDefaultDisplays();

        options.HudEnabledOptions = await this.getDefaultYesNo();
        options.HudDisplayOptions = await this.getDefaultDisplays();

        // options.AutoDirectorEnabledOptions = await this.getDefaultYesNo();
        // options.AutoDirectorDisplayOptions = await this.getDefaultDisplays();

        options.DirectorEnabledOptions = await this.getDefaultYesNo();
        options.DirectorDisplayOptions = await this.getDefaultDisplays();
        options.DirectorDefaultViewOptions = await this.getDirectorDefaultViewOptions();

        // options.MockFetchOptions = await this.getDefaultYesNo();
        // options.MockStateOptions = await this.getMockStateOptions();

        return options;
    }

    /**
     *
     */
    async getDefaultYesNo() {
        return [
            { label: 'Yes', value: true },
            { label: 'No', value: false }
        ];
    }

    /**
     *
     */
    async getDefaultDisplays() {
        const defaultDisplays = [];
        const allDisplays = screen.getAllDisplays();
        allDisplays.forEach(display => {
            defaultDisplays.push({
                label: `${display.label} (${display.id})`,
                value: display.id
            });
        });

        defaultDisplays.push({
            label: `Offscreen`,
            value: 'offscreen'
        });

        return defaultDisplays;
    }

    /**
     *
     */
    async getDirectorDefaultViewOptions() {
        return [
            { label: 'Auto', value: 'auto' },
            { label: 'Blank', value: 'blank' },
            { label: 'Solo', value: 'solo' },
            { label: 'Leaderboard', value: 'leaderboard' },
            { label: 'Standings', value: 'standings' },
            { label: 'Battle', value: 'battle' },
        ];
    }

    // /**
    //  *
    //  */
    // async getMockStateOptions() {
    //     return [
    //         { label: 'Menu', value: 'menu.json' },
    //         { label: 'Practice: Pit', value: 'practice-pit.json' },
    //         { label: 'Practice: Driving', value: 'practice-driving.json' },
    //         { label: 'Qualifying: Pit', value: 'qualifying-pit.json' },
    //         { label: 'Qualifying: Driving', value: 'qualifying-driving.json' },
    //         { label: 'Qualifying: Standings', value: 'qualifying-standings.json' },
    //         { label: 'Race: Lobby', value: 'race-lobby.json' },
    //         { label: 'Race: Start', value: 'race-start.json' },
    //         { label: 'Race: Leaders Over Start Line', value: 'race-leaders-over-start-line.json' },
    //         { label: 'Race: Driving: Lap 1', value: 'race-driving-lap-1.json' },
    //         { label: 'Race: Driving: Lap 4', value: 'race-driving-lap-4.json' },
    //         { label: 'Race: Chequered Flag', value: 'race-chequered-flag.json' },
    //         { label: 'Race: Standings', value: 'race-standings.json' },
    //         { label: 'Replay: Start', value: 'replay-start.json' },
    //         { label: 'Replay: Leaders Over Start Line', value: 'replay-leaders-over-start-line.json' },
    //         { label: 'Replay: Driving: Lap 1', value: 'replay-driving-lap-1.json' },
    //         { label: 'Replay: Driving: Lap 4', value: 'replay-driving-lap-4.json' },
    //         { label: 'Replay: Chequered Flag', value: 'replay-chequered-flag.json' },
    //         { label: 'Disconnected', value: 'disconnected.json' },
    //     ];
    // }
}