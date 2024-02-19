import { app, shell, BrowserWindow, Tray, Menu, screen, ipcMain, nativeTheme } from 'electron';
import { join } from 'path';
import { electronApp, optimizer, is } from '@electron-toolkit/utils';
import { execFile } from 'child_process';
import mkdirp from 'mkdirp';
import fs from 'fs';
import icon from '../../resources/icon.png?asset';
import iconTrayMac from '../../resources/iconTemplate.png?asset';
import iconTrayWinLight from '../../resources/iconTemplate.png?asset';
import iconTrayWinDark from '../../resources/iconTemplateDark.png?asset';
import crest2 from '../../resources/crest2/CREST2.exe?asset';

class Main {
    constructor() {
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
            await this.registerAppListeners();
            await this.createTray();
            await this.createMainWindow();
            await this.registerRendererListeners();
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

        // on activate
        app.on('activate', () => {
            // On macOS it's common to re-create a window in the app when the
            // dock icon is clicked and there are no other windows open.
            if (BrowserWindow.getAllWindows().length === 0) {
                this.createMainWindow();
            }
        });

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
                    if (process.platform === 'darwin') {
                        this.mainWindow.maximize();
                    }

                    if (process.platform === 'win32') {
                        this.mainWindow.setFullScreen(true);
                    }

                    this.mainWindow.show();
                    this.mainWindow.setIgnoreMouseEvents(false);
                    this.mainWindow.webContents.send('openSettings');
                }
            },
            {
                label: 'Quit',
                click: async () => {
                    this.mainWindow.close();
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
        // create main window
        this.mainWindow = new BrowserWindow({
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

        // on resize
        this.mainWindow.on('resize', () => {
            if (process.platform === 'win32') {
                // ... set to fullscreen
                this.mainWindow.setFullScreen(true);

                // send resize event to renderer
                this.mainWindow.webContents.send('resize');
            }
        });

        // Open the DevTools on load
        if (is.dev) {
            this.mainWindow.webContents.openDevTools();
        }

        // show ontop of game at all times
        this.mainWindow.setAlwaysOnTop(true, 'pop-up-menu');

        // disable mouse as default
        this.mainWindow.setIgnoreMouseEvents(true);

        // built on a mac but is a windows app
        this.mainWindow.on('ready-to-show', () => {
            if (process.platform === 'darwin') {
                this.mainWindow.maximize();
            }

            if (process.platform === 'win32') {
                this.mainWindow.setFullScreen(true);
            }

            this.mainWindow.show();
        });

        // on open
        this.mainWindow.webContents.setWindowOpenHandler((details) => {
            shell.openExternal(details.url);
            return { action: 'deny' };
        });

        // HMR for renderer base on electron-vite cli.
        // Load the remote URL for development or the local html file for production.
        if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
            this.mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL']);
        } else {
            this.mainWindow.loadFile(join(__dirname, '../renderer/index.html'));
        }
    }

    /**
     * Register listern for events from renderer
     */
    async registerRendererListeners() {
        // get curretn array of displays (monitors)
        ipcMain.handle('getDisplays', (event) => {
            const allDisplays = screen.getAllDisplays();    
            return allDisplays
        });

        // get primary display
        ipcMain.handle('getPrimaryDisplay', async (event) => {
            const primaryDisplay = screen.getPrimaryDisplay();
            return primaryDisplay;
        });

        // change the display
        ipcMain.handle('changeDisplay', async (event, id) => {
            if (!id) {
                return;
            }

            const allDisplays = screen.getAllDisplays();
            const requestedDisplay = allDisplays.find((display) => {
                return display.id === id;
            });

            // move display to requested display bounds
            this.mainWindow.setBounds({
                x: requestedDisplay.bounds.x,
                y: requestedDisplay.bounds.y,
                width: requestedDisplay.workArea.width,
                height: requestedDisplay.workArea.height
            });
        });

        // enable pointer events
        ipcMain.handle('enableMouse', (event) => {
            this.mainWindow.setIgnoreMouseEvents(false);
        });

        // disable pointer events
        ipcMain.handle('disableMouse', (event) => {
            this.mainWindow.setIgnoreMouseEvents(true);
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

        // update scale
        ipcMain.handle('getScale', async (event) => {
            const primaryDisplay = screen.getPrimaryDisplay();
            const {width} = primaryDisplay.bounds;
            return (width / this.defaultWidth) * 100;
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
}

new Main();
