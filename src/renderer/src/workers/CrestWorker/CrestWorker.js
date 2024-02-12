import localforage from 'localforage';

class CrestWorker {
    constructor() {
        this.ip = null;
        this.port = null;
        this.init();
    }

    /**
     * Let's go!
     */
    async init() {
        try {
            await this.registerListeners();
        } catch (error) {
            console.error(error);
        }
    }

    /**
     * Register Worker listeners
     */
    async registerListeners() {
        return self.onmessage = async (event) => {
            if (typeof event.data === 'undefined') {
                return console.error('No message supplied');
            }

            if (event.data.name === 'updateconfig') {
                const config = await localforage.getItem('config');

                if (!('configIp' in config)) {
                    return null;
                }

                if (!('configPort' in config)) {
                    return null;
                }
            
                this.ip = config.configIp;
                this.port = config.configPort;
                return await this.returnMessage('updateconfigcomplete');
            }

            if (event.data.name === 'fetch') {
                const data = await this.fetchData();
                if (!data) {
                    return;
                }
                return await this.returnMessage('fetchcomplete', data);
            }
        };
    }

    /**
     * Fetch data from the designated end point (Crest)
     * @returns object
     */
    async fetchData() {
        // no ip or port defined?
        if (!this.ip || !this.port) {
            // .. bail and return a message to parent
            return await this.returnMessage('connectionfailed');
        }

        // init fetch request
        const url = `http://${this.ip}:${this.port}/crest2/v1/api`;

        // fetch the data
        const response = await fetch(url,
            {
                signal: AbortSignal.timeout(1000),
                // headers: {
                //     'Accept-Encoding': 'gzip'
                // }
            }).catch(async (error) => {
                return null;
            });
        
        // no response?
        if (!response) {
            // .. bail and return a message to parent
            return await this.returnMessage('connectionfailed');
        }

        // validate response
        const valid = await this.validate(response);
        if (!valid) {
            // .. bail and return a message to parent
            return await this.returnMessage('connectionfailed');
        }

        // if we got here we should have good data
        return await response.json();
    }

    /**
     * Do we have valid data?
     * @param {*} fetchResponse 
     * @returns boolean
     */
    async validate(fetchResponse) {
        // clone the response to main so our events in this method don't contaminate main thread
        const response = fetchResponse.clone();

        if (response.status !== 200) {
            return false;
        }

        // get text from response
        let textResponse = await response.text();

        // prep for json
        let passedJson;

        // is it json?
        try {
            passedJson = JSON.parse(textResponse);
        } catch (e) {
            return false;
        }

        // do we have a timestamp in the response? probably valid then
        if (!('timestamp' in passedJson)) {
            return false;
        }

        // maybe introduce object instance checks here
        
        return true;
    }

    /**
     * Easy method to send a message back to parent worker with/without additional data
     * @param {*} name 
     * @param {*} data 
     */
    async returnMessage(name, data = null) {
        if (!data) {
            return self.postMessage({
                name
            });
        }

        return self.postMessage({
            name,
            data
        });
    }
}

new CrestWorker();
