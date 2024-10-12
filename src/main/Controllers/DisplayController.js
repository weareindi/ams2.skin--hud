import { screen } from 'electron';
import SettingsController from './SettingsController';

export default class DisplayController {
    constructor() {
        // singleton
        if (typeof global.DisplayController !== 'undefined') {
            return global.DisplayController;
        }
        global.DisplayController = this;

        this.defaultWidth = 1920;
        this.defaultHeight = 1080;

        this.init();
    }

    /**
     *
     */
    async init() {
        try {
            await this.getVariables();
        } catch (error) {
            console.log(error);
        }
    }

    /**
     *
     */
    async getVariables() {
        this.SettingsDisplay = await (new SettingsController()).get('SettingsDisplay');
        this.HudDisplay = await (new SettingsController()).get('HudDisplay');
        this.AutoDirectorDisplay = await (new SettingsController()).get('AutoDirectorDisplay');
        this.DirectorDisplay = await (new SettingsController()).get('DirectorDisplay');
    }

    /**
     *
     */
    async getDisplay(displayID) {
        let requestedDisplay = screen.getPrimaryDisplay();

        if (displayID === 'offscreen') {
            const bounds = {...requestedDisplay.bounds};

            return {
                ...requestedDisplay,
                id: 'offscreen',
                bounds: {
                    x: 1920 * 100,
                    y: 1080 * 100,
                    width: bounds.width,
                    height: bounds.height,
                }
            };
        }

        const allDisplays = screen.getAllDisplays();
        for (let adi = 0; adi < allDisplays.length; adi++) {
            const display = allDisplays[adi];
            if (display.id !== displayID) {
                continue;
            }

            requestedDisplay = display;
        }

        return requestedDisplay;
    }

    /**
     *
     */
    async getDisplayID(displayID) {
        return (await this.getDisplay(displayID)).id;
    }

    /**
     *
     */
    async setDisplay(win, displayId) {
        const display = await this.getDisplay(displayId);
        if (display === null) {
            return;
        }

        await win.setBounds({
            x: display.bounds.x,
            y: display.bounds.y,
            width: display.bounds.width,
            height: display.bounds.height
        });

        await this.setScale(win, displayId);
    }

    /**
     *
     */
    async setScale(win, displayId) {
        const display = await this.getDisplay(displayId);
        const scale = (display.bounds.height / this.defaultHeight) * 100;
        await win.send('setScale', scale);
    }

    /**
     *
     */
    async exists(displayId) {
        return true;
    }
}