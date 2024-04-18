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
        await this.registerListeners();
    }

    /**
     * Listen for messages from parent worker
     */
    async registerListeners() {        
        // data
        electron.ipcRenderer.on('data', async (event, data) => {
            await this.updateGlobalVars(data);
        });
    }

    /**
     * Lets make this data available to the rest of the app via the 'provide/inject' vue utils
     * .. keeping the data dry so our views can literally take what we provide it here and render
     * .. no extra work or searching within objects
     */
    async provideRefs() {
        // game vars
        this.app.provide('standings', ref(null));
        this.app.provide('participant', ref(null));
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
}
