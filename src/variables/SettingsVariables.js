import { screen } from 'electron';
import storage from 'electron-json-storage';
import DisplayProcessor from '../main/DisplayProcessor.js';

export default class SettingsVariables {
    constructor() {
        // singleton
        if (typeof global.SettingsVariables !== 'undefined') {
            return global.SettingsVariables;
        }
        global.SettingsVariables = this;

        this.init();
    }

    async init() {
        try {
            // await this.clear();
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
        return this.storedSettings = storage.getSync('settings');
    }

    /**
     * 
     */
    async registerDisplayProcessor() {
        this.DisplayProcessor = new DisplayProcessor();
    }

    /**
     * 
     * @param {*} key 
     * @returns 
     */
    async clear() {
        storage.remove('settings');
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

        // store object
        storage.set('settings', settings);
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
        // get defaults
        const defaultData = await this.getDefaultData();

        // get stored data
        const storedData = await this.getStoredData();

        // defaults first, they get replaced if they exist by stored set
        return {...defaultData, ...storedData};
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
        data.AutoDirectorEnabled = false;
        data.AutoDirectorDisplay = primaryDisplay.id;
        data.DirectorEnabled = false;
        data.DirectorDisplay = primaryDisplay.id;
        return data;
    }

    /**
     * 
     * @returns 
     */
    async getStoredData() {
        let storedSettings = await new Promise((resolve, reject) => {
            storage.get('settings', function(error, data) {
                if (error) {
                    reject(error);
                }

                resolve(data);
            });
        });        

        // check displays exist
        storedSettings = await this.checkStoredDisplays(storedSettings);

        return storedSettings;
    }

    /**
     * 
     */
    async checkStoredDisplays(storedSettings) {
        if ('SettingsDisplay' in storedSettings) {
            storedSettings['SettingsDisplay'] = await this.DisplayProcessor.getDisplayID(storedSettings['SettingsDisplay']);
        }

        if ('HudDisplay' in storedSettings) {
            storedSettings['HudDisplay'] = await this.DisplayProcessor.getDisplayID(storedSettings['HudDisplay']);
        }

        if ('AutoDirectorDisplay' in storedSettings) {
            storedSettings['AutoDirectorDisplay'] = await this.DisplayProcessor.getDisplayID(storedSettings['AutoDirectorDisplay']);
        }

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
        options.DebugOptions = await this.getDefaultYesNo();
        options.ExternalCrestOptions = await this.getDefaultYesNo();

        options.SettingsDisplayOptions = await this.getDefaultDisplays();

        options.HudEnabledOptions = await this.getDefaultYesNo();
        options.HudDisplayOptions = await this.getDefaultDisplays();

        options.AutoDirectorEnabledOptions = await this.getDefaultYesNo();
        options.AutoDirectorDisplayOptions = await this.getDefaultDisplays();

        options.DirectorEnabledOptions = await this.getDefaultYesNo();
        options.DirectorDisplayOptions = await this.getDefaultDisplays();
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

        return defaultDisplays;
    }
}