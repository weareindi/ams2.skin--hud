// App
import { createApp, ref, watch } from 'vue';
import settingsView from './index.vue';

// Router
import router from './router.js';

// SVG Data
import SvgCollection from '@renderer/collections/SvgCollection.js';

// Global Components
import SvgComponent from '@renderer/views/components/SvgComponent.vue';

// Main CSS
import '../assets/scss/_main.scss';

class Init {
    constructor(settings = {}) {
        this.app = null;
        this.settings = settings;
        this.init();
    }

    async init() {
        try {
            await this.registerApp();
            await this.registerRefs();
            await this.registerValues();
            await this.registerWatcher();
            await this.registerUses();
            await this.registerComponents();
            await this.registerElectronListener();
            await this.mountApp();
        } catch (error) {
            console.error(error);
        }
    }

    /**
     * 
     */
    async registerApp() {
        this.app = createApp(settingsView);
    }

    /**
     * 
     */
    async registerRefs() {
        for (const key in this.settings) {
            this.app.provide(key, ref(null));
        }
    }

    /**
     * 
     */
    async registerValues() {
        for (const key in this.settings) {
            if (!(key in this.app._context.provides)) {
                continue;
            }

            this.app._context.provides[key].value = this.settings[key];
        }
    }

    /**
     * 
     */
    async registerWatcher() {
        for (const key in this.settings) {
            if (!(key in this.app._context.provides)) {
                continue;
            }

            watch(this.app._context.provides[key], async (newValue) => {
                await this.setVariable(key, newValue);
            });
        }
    }

    /**
     * 
     * @param {*} key 
     * @param {*} newValue 
     */
    async setVariable(key, value) {
        electron.ipcRenderer.invoke('setVariable', key, value);
    }

    /**
     * 
     */
    async registerElectronListener() {
        // update settings from the electron side
        electron.ipcRenderer.on('setSetting', (event, data) => {
            for (const key in data) {
                if (!(key in this.app._context.provides)) {
                    continue;
                }

                this.app._context.provides[key].value = data[key];
            }
        });
    }

    /**
     * 
     */
    async registerUses() {
        this.app.use(router);
        this.app.use(new SvgCollection());
    }

    /**
     * 
     */
    async registerComponents() {
        this.app.component('SvgComponent', SvgComponent);
    }

    /**
     * 
     */
    async mountApp() {
        this.app.mount('#settings');
    }
}

// wait for settings before proceeding
electron.ipcRenderer.on('init-settings', (event, data) => {
    new Init(data);
});