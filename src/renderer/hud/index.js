// App
import { createApp, ref, watch } from 'vue';
import hudView from './index.vue';

// Router
import router from './router.js';

// SVG Data
import SvgCollection from '@renderer/collections/SvgCollection.js';

// Global Components
import SvgComponent from '@renderer/views/components/SvgComponent.vue';

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
        this.app.mount('#hud');
    }
}

// wait for hud before proceeding
electron.ipcRenderer.on('init-hud', (event) => {
    new Init();
});