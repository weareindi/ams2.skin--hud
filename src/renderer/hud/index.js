// App
import { createApp, ref } from 'vue';
import hudView from './index.vue';

// Router
import router from './router.js';

// SVG Data
import SvgCollection from '@renderer/collections/SvgCollection.js';

// Global Components
import SvgComponent from '@renderer/views/components/SvgComponent.vue';

// Variables
import Variables from './variables.json?json';

// Main CSS
import '../assets/scss/_main.scss';

class Init {
    constructor() {
        this.app = null;
        this.init();
    }

    async init() {
        try {
            await this.registerApp();
            await this.registerRefs();
            await this.registerDataListener();
            await this.registerUses();
            await this.registerComponents();
            await this.mountApp();
        } catch (error) {
            console.error(error);
        }
    }

    /**
     * 
     */
    async registerApp() {
        this.app = createApp(hudView);
    }

    /**
     * Register the references before they get updated by the 'data' from node event
     */
    async registerRefs() {
        for (let vi = 0; vi < Variables.length; vi++) {
            const key = Variables[vi];
            
            // key already exists, dont try to add it again
            if (key in this.app._context.provides) {
                continue;
            }

            this.app.provide(key, ref(null));
        }
    }

    /**
     * 
     */
    async registerDataListener() {
        // data from node
        electron.ipcRenderer.on('data', async (event, data) => {
            await this.updateRefs(data);
            await this.updateValues(data);
        });
    }

    /**
     * 
     */
    async updateRefs(data) {
        for (const key in data) {
            // key already exists, dont try to add it again
            if (key in this.app._context.provides) {
                continue;
            }

            this.app.provide(key, ref(null));
        }        
    }

    /**
     * 
     */
    async updateValues(data) {
        for (const key in data) {
            // key doesn't exist?
            if (!(key in this.app._context.provides)) {
                // ... skip
                continue;
            }            

            // update value
            this.app._context.provides[key].value = data[key];
        }
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
        console.log(this.app);
        

        this.app.mount('#hud');
    }
}

// wait for hud before proceeding
electron.ipcRenderer.on('init-hud', (event) => {
    new Init();
});