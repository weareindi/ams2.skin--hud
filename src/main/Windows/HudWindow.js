import { app, BrowserWindow, ipcMain } from 'electron';
import { join } from 'path';
import { is } from '@electron-toolkit/utils';
import SettingsController from '../Controllers/SettingsController.js';
import DisplayController from '../Controllers/DisplayController.js';

import { Worker } from 'node:worker_threads';
import HudWorkerPath from '../Workers/HudWorker?modulePath';

export default class HudWindow {
    constructor() {
        this.init();

        this.HudWorker = null;
        this.HudWorkerReady = false;
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
        const HudEnabled = await this.SettingsController.get('HudEnabled');
        if (!HudEnabled) {
            return;
        }


        await this.start();
    }

    /**
     *
     */
    async toggle(activate) {
        if (!activate) {
            await this.unregisterWorker();
            await this.exit();
            return;
        }


        return await this.start();
    }

    /**
     *
     */
    async start() {
        await this.registerWorker();
        await this.registerWorkerListener();
        await this.createWindow();
        await this.setWindowToStoredDisplay();
        await this.registerWindowListeners();
        await this.loadUrl();
        await this.dev();
    }

    /**
     *
     */
    async registerWorker() {
        this.HudWorker = new Worker(HudWorkerPath);
        this.HudWorker.postMessage({
            name: 'setup'
        });
    }

    /**
     *
     */
    async unregisterWorker() {
        const terminated = await this.HudWorker.terminate();
        if (!terminated) {
            return;
        }

        this.HudWorkerReady = false;
    }

    /**
     *
     */
    async registerWorkerListener() {
        this.HudWorker.on('message', async (event) => {
            if (event.name === 'setup') {
                this.HudWorkerReady = true;
            }

            if (event.name === 'data') {
                // send data to hud worker for view processing
                this.HudWorker.postMessage({
                    name: 'view',
                    data: event.data
                });
            }

            if (event.name === 'view') {

                // console.timeEnd('test');
                this.send('data', event.data);
            }

        });
    }

    /**
     *
     */
    async data(data) {
        if (!this.HudWorkerReady) {
            return;
        }

        // console.time('test');

        this.HudWorker.postMessage({
            name: 'data',
            data: data
        });
    }

    /**
     *
     */
    async setWindowToStoredDisplay() {
        await this.DisplayController.setDisplay(this.window, await this.SettingsController.get('HudDisplay'));
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

        // disable mouse as default
        this.window.setIgnoreMouseEvents(true);

        // disable throttling
        this.window.webContents.setBackgroundThrottling(false);

        // max fps, 60 for hud
        this.window.webContents.setFrameRate(60);
    }

    /**
     *
     */
    async registerWindowListeners() {
        // on resize
        this.window.on('resize', async () => {
            const display = await this.SettingsController.get('DirectorDisplay');
            if (display !== 'offscreen') {
                this.window.setFullScreen(true);
            }
        });

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
            await this.send('init-hud');
        });
    }

    /**
     *
     */
    async loadUrl() {
        // HMR for renderer base on electron-vite cli.
        // Load the remote URL for development or the local html file for production.
        if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
            this.window.loadURL(`${process.env['ELECTRON_RENDERER_URL']}/hud.html`);
        } else {
            this.window.loadFile(join(__dirname, '../renderer/hud.html'));
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
    async exit() {
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