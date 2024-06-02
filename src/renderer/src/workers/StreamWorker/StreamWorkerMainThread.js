import StreamWorker from './StreamWorker.js?worker';
import { ref, watch } from 'vue';

export default class StreamWorkerMainThread {
    install(app) {
        this.app = app;
        this.init();
    }

    /**
     * Let's get it on
     */
    async init() {
        try {
            await this.startWorker();
        } catch (error) {
            console.error(error);
        }
    }

    /**
     * Making the magic happen
     */
    async startWorker() {
        await this.provideRefs();
        await this.createWorker();
        await this.registerListeners();
    }

    /**
     * Create the parent worker
     */
    async createWorker() {
        return this.worker = new StreamWorker();
    }

    /**
     * Listen for messages from parent worker
     */
    async registerListeners() {        
        // from main
        electron.ipcRenderer.on('data', async (event, data) => {
            await this.postMessage(data.name, data.data);
        });

        // from stream worker
        this.worker.onmessage = async (event) => {
            if (event.data.name === 'resetcomplete') {
                return;
            }

            if (event.data.name === 'streamview') {
                await this.updateGlobalVars(event.data.data);
                return;
            }

            if (event.data.name === 'paused') {
                await this.updateGlobalVars({
                    view: null
                });
                return;
            }
        };
    }

    /**
     * Lets make this data available to the rest of the app via the 'provide/inject' vue utils
     * .. keeping the data dry so our views can literally take what we provide it h ere and render
     * .. no extra work or searching within objects
     */
    async provideRefs() {
        // game vars
        this.app.provide('view', ref(null));
        this.app.provide('viewStates', ref(null));
        this.app.provide('standings', ref(null));
        this.app.provide('timings', ref(null));
        this.app.provide('solo', ref(null));
        this.app.provide('chase', ref(null));
        this.app.provide('eventTimeRemaining', ref(null));
        this.app.provide('sessionName', ref(null));
        this.app.provide('director', ref(null));
    }


    /**
     * Any data that comes back from the workers gets pushed into our prepared refs here
     * @param {*} data 
     */
    async updateGlobalVars(data) {
        // loop through provided data
        for (const key in data) {

            // skip if no object found
            if (!Object.hasOwnProperty.call(this.app._context.provides, key)) {
                continue;
            }

            // note: remember were using vue 'ref' for data handling.
            // ref adds the 'value' attribute to the provide which we're updating here
            this.app._context.provides[key].value = data[key];
        }
    }

    /**
     * Easy method to send a message to parent worker with/without additional data
     * @param {*} name 
     * @param {*} data 
     */
    async postMessage(name, data = null) {
        if (!data) {
            return this.worker.postMessage({
                name
            });
        }

        return this.worker.postMessage({
            name,
            data
        });
    }
}
