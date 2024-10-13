import { app, BrowserWindow } from 'electron';
import { join } from 'path';
import { is } from '@electron-toolkit/utils';
import SettingsController from '../Controllers/SettingsController.js';
import DisplayController from '../Controllers/DisplayController.js';

export default class SettingsWindow {
    constructor() {
        this.init();
    }

    /**
     * Create the main window
     */
    async init() {
        try {
            await this.registerSettingsController();
            await this.registerDisplayController();
            await this.processInitialState();
        } catch (error) {
            console.log(error);
        }
    }

    /**
     *
     */
    async registerSettingsController() {
        this.SettingsController = new SettingsController();
    }

    /**
     *
     */
    async registerDisplayController() {
        this.DisplayController = new DisplayController();
    }

    /**
     *
     */
    async processInitialState() {
        const SettingsOnStartup = await this.SettingsController.get('SettingsOnStartup');
        if (!SettingsOnStartup) {
            return;
        }

        await this.start();
    }

    /**
     *
     */
    async start() {
        await this.createWindow();
        await this.setWindowToStoredDisplay();
        await this.registerWindowListeners();
        await this.loadUrl();
        await this.dev();
    }

    /**
     *
     */
    async setWindowToStoredDisplay() {
        await this.DisplayController.setDisplay(this.window, await this.SettingsController.get('SettingsDisplay'));
    }

    /**
     *
     */
    async sendSettings() {
        const settings = await this.SettingsController.getAll();
        const options = await this.SettingsController.getAllOptions();
        await this.send('init-settings', {...settings, ...options});
    }

    /**
     *
     */
    async dev() {
        if (!is.dev) {
            return;
        }

        // open dev tools
        this.window.webContents.openDevTools({ mode: 'detach' });
    }

    /**
     *
     */
    async setTitle() {
        this.window.setTitle(`${this.window.getTitle()}: v${app.getVersion()}`);
    }

    /**
     *
     */
    async createWindow() {
        this.window = new BrowserWindow({
            width: this.defaultWidth,
            height: this.defaultHeight,
            show: false,
            autoHideMenuBar: true,
            ...(process.platform === 'linux' ? { icon } : {}),
            webPreferences: {
                preload: join(__dirname, '../preload/index.js'),
                sandbox: false
            },
            simpleFullscreen: true,
            frame: false,
            transparent: true,
            alwaysOnTop: true,
            hasShadow: false,
        });

        // show ontop of game at all times
        this.window.setAlwaysOnTop(true, 'pop-up-menu', 1);

        // disable throttling
        this.window.webContents.setBackgroundThrottling(false);

        // max fps, 30 for hud
        this.window.webContents.setFrameRate(30);
    }

    /**
     *
     */
    async registerWindowListeners() {
        // ready to show
        this.window.on('ready-to-show', async () => {
            const display = await this.SettingsController.get('DirectorDisplay');
            if (display !== 'offscreen') {
                this.window.setFullScreen(true);
            }

            this.window.show();
        });

        // on open
        this.window.webContents.setWindowOpenHandler((details) => {
            shell.openExternal(details.url);
            return { action: 'deny' };
        });

        // finished loading contents
        this.window.webContents.on('did-finish-load', async () => {
            await this.setTitle();
            await this.sendSettings();
        });
    }

    /**
     *
     */
    async loadUrl() {
        // HMR for renderer base on electron-vite cli.
        // Load the remote URL for development or the local html file for production.
        if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
            this.window.loadURL(`${process.env['ELECTRON_RENDERER_URL']}/settings.html`);
        } else {
            this.window.loadFile(join(__dirname, '../renderer/settings.html'));
        }
    }

    /**
     *
     * @returns
     */
    async getWindow() {
        return this.window;
    }

    /**
     *
     * @param {*} bounds
     */
    async setBounds(bounds) {
        this.window.setBounds(bounds);
    }

    /**
     *
     */
    async close() {
        return this.window.close();
    }

    /**
     *
     */
    async send(name, data) {
        try {
            if (typeof this.window === 'undefined') {
                return;
            }

            if (!data) {
                return this.window.webContents.send(name, null);
            }

            return this.window.webContents.send(name, data);
        } catch (error) {
            // console.error(error);
        }
    }
}