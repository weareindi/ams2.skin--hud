import { app, Tray, Menu, ipcMain, nativeTheme } from 'electron';
import { electronApp, optimizer } from '@electron-toolkit/utils';
import iconTrayMac from '../../resources/iconTemplate.png?asset';
import iconTrayWinLight from '../../resources/iconTemplate.png?asset';
import iconTrayWinDark from '../../resources/iconTemplateDark.png?asset';
import SettingsVariables from '../variables/SettingsVariables';
import DisplayProcessor from './DisplayProcessor.js';
import CrestProcessor from './CrestProcessor.js';
import SettingsWindow from './SettingsWindow.js';
import HudWindow from './HudWindow.js';
import DirectorWindow from './DirectorWindow.js';

class Main { 
    constructor() {
        this.isFirstInstance = app.requestSingleInstanceLock();
        if (!this.isFirstInstance) { 
            app.quit();
            return;
        }

        this.appID = 'skin.ams2.hud';
        this.appName = 'AMS2HUD';
        this.defaultWidth = 1920;
        this.defaultHeight = 1080;

        this.init();
    }

    /**
     * Let's do some electron-ing
     */
    async init() {
        try {
            // wait for ready state
            await app.whenReady();
            await this.setElectronVars();
            await this.createTray();
            await this.registerSettingsVariables();
            await this.registerDisplayProcessor();
            await this.registerCrestProcessor();
            await this.registerAppListeners();
            await this.registerRendererListeners();
            await this.registerSettingsWindow();
            await this.registerHudWindow();
            await this.registerDirectorWindow();
            await this.registerMainListeners();
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
    async registerCrestProcessor() {
        this.CrestProcessor = new CrestProcessor();
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
    async registerSettingsWindow() {
        this.SettingsWindow = new SettingsWindow();
    }

    /**
     * 
     */
    async registerHudWindow() {
        this.HudWindow = new HudWindow();
    }

    /**
     * 
     */
    async registerDirectorWindow() {
        this.DirectorWindow = new DirectorWindow();
    }

    /**
     * Set electron app ID
     */
    async setElectronVars() {
        electronApp.setAppUserModelId(this.appID);
    }

    /**
     * Register app event listeners
     */
    async registerAppListeners() {
        // browser window created
        app.on('browser-window-created', (_, window) => {
            // ignore window shortcuts in production (ie. dev tools)
            optimizer.watchWindowShortcuts(window);
        });

        // all windows closed?
        app.on('window-all-closed', () => {
            // do nothing, keeping this event keeps the app active even when no windows are open
        });
    }

    /**
     * Register main event listeners
     */
    async registerMainListeners() {
        ipcMain.on('setSetting', async (key, value) => {
            const data = {};
            data[key] = value;
            await this.SettingsWindow.send('setSetting', data);
        });
    }

    /**
     * Create the system tray menu
     */
    async createTray() {
        this.tray;

        // if mac (I built this app on a mac so you'll see a few references to darwin)
        if (process.platform === 'darwin') {
            this.tray = new Tray(iconTrayMac);
        }

        // if windows
        if (process.platform === 'win32' && nativeTheme.shouldUseDarkColors) {
            this.tray = new Tray(iconTrayWinDark);
        }
        if (process.platform === 'win32' && !nativeTheme.shouldUseDarkColors) {
            this.tray = new Tray(iconTrayWinLight);
        }

        await this.setTrayToolTip();
        await this.registerTrayEvents();
        await this.setTrayContextMenu();
    }
    
    /**
     * Set system tray tool tip
     */
    async setTrayToolTip() {
        this.tray.setToolTip(this.appName);
    }
    
    /**
     * Register systemn tray events
     */
    async registerTrayEvents() {
        // ignore double clicks
        this.tray.setIgnoreDoubleClickEvents(true);

        // on click
        this.tray.on('click', () => {
            this.tray.popUpContextMenu();
        });
    }
    
    /**
     * Build and set the system tray context menu
     */
    async setTrayContextMenu() {
        // prepare context menu
        const contextMenu = Menu.buildFromTemplate([
            {
                label: 'Show Settings',
                click: async () => {
                    return this.SettingsWindow.start();
                }
            },
            {
                label: 'Quit',
                click: async () => {
                    app.quit();
                }
            }
        ]);

        // prepare the tray context menu
        this.tray.setContextMenu(contextMenu);
    }

    /**
     * Register listern for events from renderer
     */
    async registerRendererListeners() {        
        // start/init named window
        ipcMain.handle('startWindow', async (event, win) => {
            if (!(win in this) || !('start' in this[win])) {
                return;
            }

            this[win].start();
        });
        
        // close named window
        ipcMain.handle('closeWindow', async (event, win) => {
            if (!(win in this) || !('close' in this[win])) {
                return;
            }

            this[win].close();
        });

        // dump
        ipcMain.handle('dump', async (event, data) => {
            if (!data) { 
                return false;
            }

            if (data === 'null') { 
                return false;
            }

            if (typeof data === 'object') { 
                data = JSON.stringify(data);
            }

            const { default: slash } = await import('slash');
            const user_documents = app.getPath('documents');
            const dir = slash(`${user_documents}/${this.appName}/dump`);
            const date = new Date();
            const filename = `${date.toISOString().split('-').join('').split(':').join('').split('.').join('')}.log`;
            const path = `${dir}/${filename}`;

            fs.mkdir(dir, { recursive: true }, (err) => err && console.error(err));
            fs.writeFileSync(path, data, 'utf-8', (err) => err && console.error(err));
        });

        // Check for new version on github
        ipcMain.handle('checkUpdate', async (event) => {
            // get package.json from repo
            const url = `https://api.github.com/repos/weareindi/ams2.skin--hud/releases/latest`;

            // fetch the data
            const response = await fetch(url, {
                method: 'GET'
            }).catch(async (error) => {
                console.log(error);
                return null;
            });
        
            // no response?
            if (!response) {
                // .. bail
                return false;
            }

            // get json
            const json = await response.json();

            // get running app current version
            let localVersion = `v${app.getVersion()}`;

            // pprepare latest version for comparison
            let latestRelease = localVersion;
            if ('tag_name' in json) {
                // ... update latest version to found version from fetch request
                latestRelease = json.tag_name;
            }

            // compare. if same version return false
            if (semver.compare(localVersion, latestRelease) >= 0) {
                return false;
            }

            // return true, update avilable
            return true;
        });

        // update settings storage
        ipcMain.handle('setVariable', async (event, key, value) => {
            // update storage
            await this.SettingsVariables.set(key, value);

            // update vars
            // if (key === 'IP') {
            //     await this.CrestProcessor.setIP(value);
            // }
    
            // if (key === 'Port') {
            //     await this.CrestProcessor.setPort(value);
            // }
    
            // if (key === 'TickRate') {
            //     await this.CrestProcessor.setTickRate(value);
            // }
    
            if (key === 'ExternalCrest') {
                await this.CrestProcessor.toggle(value);
            }
    
            if (key === 'SettingsDisplay') {
                await this.DisplayProcessor.setDisplay(this.SettingsWindow.window, value);
            }
    
            if (key === 'HudEnabled') {
                await this.HudWindow.toggle(value);
            }
    
            if (key === 'HudDisplay') {
                await this.DisplayProcessor.setDisplay(this.HudWindow.window, value);
            }
    
            // if (key === 'AutoDirectorEnabled') {
            //     await this.AutoDirectorWindow.toggle(value);
            // }
    
            // if (key === 'AutoDirectorDisplay') {
            //     await this.DisplayProcessor.setDisplay(this.AutoDirectorWindow.window, value);
            // }
    
            if (key === 'DirectorEnabled') {
                await this.DirectorWindow.toggle(value);
            }
    
            if (key === 'DirectorDisplay') {
                await this.DisplayProcessor.setDisplay(this.DirectorWindow.window, value);
            }
    
            if (key === 'DirectorDefaultView') {
                
            }            
        });

        // update scale
        ipcMain.handle('setScale', async (event, windowName, displayVariableName) => {
            await this.DisplayProcessor.setScale(this[windowName].window, await this.SettingsVariables.get(displayVariableName));
        });

        // // enable pointer events
        // ipcMain.handle('enableMouse', async (event) => {
        //     const mainWindow = await this.mainWindow.getWindow();
        //     mainWindow.setIgnoreMouseEvents(false);
        // });

        // // disable pointer events
        // ipcMain.handle('disableMouse', async (event) => {
        //     const mainWindow = await this.mainWindow.getWindow();
        //     mainWindow.setIgnoreMouseEvents(true);
        // });
    }
}

new Main();
