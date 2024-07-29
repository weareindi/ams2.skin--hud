import { screen } from 'electron';
import SettingsVariables from '../variables/SettingsVariables';

export default class DisplayProcessor {
    constructor() {
        // singleton
        if (typeof global.DisplayProcessor !== 'undefined') {
            return global.DisplayProcessor;
        }
        global.DisplayProcessor = this;

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
        this.SettingsDisplay = await (new SettingsVariables()).get('SettingsDisplay');
        this.HudDisplay = await (new SettingsVariables()).get('HudDisplay');
        this.AutoDirectorDisplay = await (new SettingsVariables()).get('AutoDirectorDisplay');
        this.DirectorDisplay = await (new SettingsVariables()).get('DirectorDisplay');
    }

    /**
     * 
     */
    async getDisplay(displayID) {
        let requestedDisplay = screen.getPrimaryDisplay();
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
        const scale = (display.bounds.width / this.defaultWidth) * 100;
        await win.send('setScale', scale);
    }

    /**
     * 
     */
    async exists(displayId) {
        console.log('displayId');
        console.log(displayId);

        return true;
    }
}