import { app, Tray, Menu, screen, ipcMain, nativeTheme } from 'electron';
import { electronApp, optimizer, is } from '@electron-toolkit/utils';
import { execFile } from 'child_process';
import fs from 'fs';
import iconTrayMac from '../../resources/iconTemplate.png?asset';
import iconTrayWinLight from '../../resources/iconTemplate.png?asset';
import iconTrayWinDark from '../../resources/iconTemplateDark.png?asset';
import crest2 from '../../resources/crest2/CREST2.exe?asset';
import MainWindow from './MainWindow.js';
import StreamWindow from './StreamWindow.js';

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
            await this.registerAppListeners();
            await this.registerRendererListeners();
            await this.createMainWindow();
        } catch (error) {
            console.log(error);
        }
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

        // // on activate
        // app.on('activate', () => {
        //     // On macOS it's common to re-create a window in the app when the
        //     // dock icon is clicked and there are no other windows open.
        //     if (BrowserWindow.getAllWindows().length === 0) {
        //         this.createMainWindow();
        //     }
        // });

        // all windows closed?
        app.on('window-all-closed', () => {
            app.quit();
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
                    const mainWindow = await this.mainWindow.getWindow();
                    
                    if (process.platform === 'darwin') {
                        mainWindow.maximize();
                    }

                    if (process.platform === 'win32') {
                        mainWindow.setFullScreen(true);
                    }

                    mainWindow.show();
                    mainWindow.setIgnoreMouseEvents(false);
                    mainWindow.webContents.send('openSettings');
                }
            },
            {
                label: 'Quit',
                click: async () => {
                    const mainWindow = await this.mainWindow.getWindow();

                    mainWindow.close();
                }
            }
        ]);

        // prepare the tray context menu
        this.tray.setContextMenu(contextMenu);
    }

    /**
     * Create main window
     */
    async createMainWindow() {
        if (typeof this.mainWindow !== 'undefined') { 
            await this.exitMainWindow();
        }
        
        return this.mainWindow = new MainWindow();
    }

    /**
     * Exit main window
     */
    async exitMainWindow() {
        this.mainWindow.exit();
        delete this.mainWindow;
        return;
    }

    /**
     * Create stream window
     */
    async createStreamWindow() {
        if (typeof this.streamWindow !== 'undefined') { 
            await this.exitStreamWindow();
        }

        this.streamWindow = new StreamWindow();
    }

    /**
     * Exit stream window
     */
    async exitStreamWindow() {
        this.streamWindow.exit();
        delete this.streamWindow;
        return;
    }

    /**
     * Get all displays
     */
    async getAllDisplays() {
        const allDisplays = screen.getAllDisplays();
        return allDisplays;
    }

    /**
     * Open Crest2
     */
    async openCrest() {
        if (process.platform === 'win32') {
            try {
                if (typeof this.crest !== 'undefined') {
                    await this.closeCrest();
                }

                return this.crest = execFile(crest2, ['-p', '8180']);
            } catch (error) {
                console.error(error);
                return null;
            }
        }
    }

    /**
     * Close Crest2
     */
    async closeCrest() {
        return this.crest.kill();
    }

    /**
     * 
     * @param {*} id 
     * @returns 
     */
    async getRequestedDisplay(id) {
        if (typeof id === 'undefined' || !id) { 
            return await this.getPrimaryDisplay();
        }

        if (id === 'offscreen') { 
            const primaryDisplay = await this.getPrimaryDisplay();

            return {
                id: 'offscreen',
                bounds: { 
                    x: primaryDisplay.bounds.x - primaryDisplay.bounds.width,
                    y: primaryDisplay.bounds.y - primaryDisplay.bounds.height,
                    width: primaryDisplay.bounds.width,
                    height: primaryDisplay.bounds.height,
                }
            }
        }

        const allDisplays = await this.getAllDisplays();
        const requestedDisplay = allDisplays.find((display) => {
            return display.id === id;
        });

        if (!requestedDisplay) { 
            return;
        }

        return requestedDisplay;
    }

    /**
     * 
     * @param {*} win 
     * @returns 
     */
    async getRequestedWindow(win) {
        if (typeof win === 'undefined' || !win) { 
            return null;
        }

        if (win === 'main' && typeof this.mainWindow !== 'undefined' && this.mainWindow) { 
            return this.mainWindow;
        }

        if (win === 'stream' && typeof this.streamWindow !== 'undefined' && this.streamWindow) { 
            return this.streamWindow;
        }

        return null;
    }

    /**
     * 
     * @returns 
     */
    async getPrimaryDisplay() { 
        return screen.getPrimaryDisplay();
    }

    /**
     * Register listern for events from renderer
     */
    async registerRendererListeners() {
        // get curretn array of displays (monitors)
        ipcMain.handle('getDisplays', async (event) => {
            return await this.getAllDisplays();
        });

        // get primary display
        ipcMain.handle('getPrimaryDisplay', async (event) => {
            return await this.getPrimaryDisplay();
        });

        // change the display
        ipcMain.handle('changeWindowDisplay', async (event, win, id) => {
            if (!win) { 
                return;
            }

            if (!id) {
                return;
            }

            const requestedWindow = await this.getRequestedWindow(win);
            if (!requestedWindow) { 
                return;
            }

            const requestedDisplay = await this.getRequestedDisplay(id);
            if (!requestedDisplay) { 
                return;
            }
           
            await requestedWindow.setBounds({
                x: requestedDisplay.bounds.x,
                y: requestedDisplay.bounds.y,
                width: requestedDisplay.bounds.width,
                height: requestedDisplay.bounds.height
            });

            await requestedWindow.send('updateScale');
        });

        // enable pointer events
        ipcMain.handle('enableMouse', async (event) => {
            const mainWindow = await this.mainWindow.getWindow();
            mainWindow.setIgnoreMouseEvents(false);
        });

        // disable pointer events
        ipcMain.handle('disableMouse', async (event) => {
            const mainWindow = await this.mainWindow.getWindow();
            mainWindow.setIgnoreMouseEvents(true);
        });

        // quit app
        ipcMain.handle('quit', (event) => {
            app.quit();
            return;
        });

        // open crest
        ipcMain.handle('openCrest', async (event) => {
            await this.openCrest();
            return;
        });

        // close crest
        ipcMain.handle('closeCrest', async (event) => {
            await this.closeCrest();
            return;
        });

        // open main window
        ipcMain.handle('createMainWidndow', async (event) => {
            await this.createMainWidndow();
            return;
        });

        // close main window
        ipcMain.handle('closeMainWindow', async (event) => {
            await this.closeMainWindow();
            return;
        });

        // open stream window
        ipcMain.handle('createStreamWindow', async (event) => {
            await this.createStreamWindow();
            return;
        });

        // close stream window
        ipcMain.handle('exitStreamWindow', async (event) => {
            await this.exitStreamWindow();
            return;
        });

        // update scale
        ipcMain.handle('getScale', async (event, id) => {
            const requestedDisplay = await this.getRequestedDisplay(id);
            if (!requestedDisplay) {
                return 100;
            }

            const {width} = requestedDisplay.bounds;
            const scale = (width / this.defaultWidth) * 100;
            return scale;
        });

        // get version
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
            let currentVersion = `v${app.getVersion()}`;

            // pprepare latest version for comparison
            let latest_Version = currentVersion;
            if ('tag_name' in json) {
                // ... update latest version to found version from fetch request
                latest_Version = json.tag_name;
            }

            // compare. if same version return false
            if (currentVersion === latest_Version) {
                return false;
            }

            // return true, update avilable
            return true;
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
    }
}

new Main();
