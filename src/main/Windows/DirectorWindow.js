import { app, BrowserWindow, ipcMain } from 'electron';
import { join } from 'path';
import { is } from '@electron-toolkit/utils';
import SettingsController from '../Controllers/SettingsController.js';
import DisplayController from '../Controllers/DisplayController.js';

export default class DirectorWindow {
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
        const DirectorEnabled = await this.SettingsController.get('DirectorEnabled');
        if (!DirectorEnabled) {
            return;
        }

        await this.start();
    }

    /**
     * 
     */
    async toggle(activate) {
        if (!activate) {
            return await this.exit();
        }

        return await this.start();
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
        await this.DisplayController.setDisplay(this.window, await this.SettingsController.get('DirectorDisplay'));
    }

    /**
     * 
     */
    async dev() {
        if (!is.dev) {
            return;
        }

        // open dev tools
        this.window.webContents.openDevTools();
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
    }

    /**
     * 
     */
    async registerWindowListeners() {
        // on resize
        this.window.on('resize', () => {
            if (process.platform === 'win32') {
                // ... set to fullscreen
                this.window.setFullScreen(true);

                // send resize event to renderer
                this.window.webContents.send('resize');
            }
        });

        // ready to show
        this.window.on('ready-to-show', () => {
            if (process.platform === 'darwin') {
                this.window.maximize();
            }

            if (process.platform === 'win32') {
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
            await this.send('init-director');
        });
    }

    /**
     * 
     */
    async loadUrl() {
        // HMR for renderer base on electron-vite cli.
        // Load the remote URL for development or the local html file for production.
        if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
            this.window.loadURL(`${process.env['ELECTRON_RENDERER_URL']}/director.html`);
        } else {
            this.window.loadFile(join(__dirname, '../renderer/director.html'));
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
                return this.window.webContents.send(name);
            }
            
            return this.window.webContents.send(name, data);
        } catch (error) {
            // console.error(error);
        }
    }
}