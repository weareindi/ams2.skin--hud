import { app, BrowserWindow } from 'electron';
import { join } from 'path';
import { is } from '@electron-toolkit/utils';
// import { execFile } from 'child_process';
import SettingsVariables from '../variables/SettingsVariables';
import DisplayProcessor from './DisplayProcessor.js';
import CrestProcessor from './CrestProcessor.js';

// import crest2 from '../../resources/crest2/CREST2.exe?asset';

export default class SettingsWindow {
    constructor() {
        this.init();
    }
    
    /**
     * Create the main window
     */
    async init() {
        try {
            await this.registerSettingsVariables();
            await this.registerDisplayProcessor();
            await this.registerCrestProcessor();
            await this.processInitialState();
        } catch (error) {
            console.log(error);
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
    async registerDisplayProcessor() {
        this.DisplayProcessor = new DisplayProcessor();
    }

    /**
     * 
     */
    async registerCrestProcessor() {
        this.CrestProcessor = new CrestProcessor();
    }

    /**
     * 
     */
    async processInitialState() {
        const SettingsOnStartup = await this.SettingsVariables.get('SettingsOnStartup');
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
        await this.DisplayProcessor.setDisplay(this.window, await this.SettingsVariables.get('SettingsDisplay'));
    }

    /**
     * 
     */
    async sendSettings() {
        const settings = await this.SettingsVariables.getAll();
        const options = await this.SettingsVariables.getAllOptions();
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
        // this.window.setIgnoreMouseEvents(true);
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
        if (typeof this.window === 'undefined') {
            return;
        }

        if (!data) {
            return this.window.webContents.send(name);
        }

        return this.window.webContents.send(name, data);
    }
}