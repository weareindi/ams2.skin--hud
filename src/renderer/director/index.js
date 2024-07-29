// App
import { createApp, ref, watch } from 'vue';
import directorView from './index.vue';

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
        this.app = createApp(directorView);
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
        this.app.mount('#director');
    }
}

// wait for director before proceeding
electron.ipcRenderer.on('init-director', (event) => {
    new Init();
});