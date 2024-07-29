import SettingsVariables from '../variables/SettingsVariables';
import { ipcMain } from 'electron';
import { execFile } from 'child_process';
import crest2 from '../../resources/crest2/CREST2.exe?asset';

export default class CrestProcessor {
    constructor() {
        // singleton
        if (typeof global.CrestProcessor !== 'undefined') {
            return global.CrestProcessor;
        }
        global.CrestProcessor = this;

        this.init();
    }

    /**
     * 
     */
    async init() {
        try {
            await this.registerSettingsVariables();
            await this.processInitialState();
            await this.doTimer();
        } catch (error) {
            console.log(error);
        }
    }

    /**
     * 
     * @param {*} ExternalCrest 
     * @returns 
     */
    async toggle(ExternalCrest) {
        if (!ExternalCrest) {
            return await this.openCrest();
        }

        return await this.closeCrest();
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
    async processInitialState() {
        const ExternalCrest = await this.SettingsVariables.get('ExternalCrest');
        if (ExternalCrest) {
            return;
        }

        this.openCrest();
    }

    /**
     * 
     */
    async getVariables() {
        const ExternalCrest = await this.SettingsVariables.get('ExternalCrest');
        const TickRate = await this.SettingsVariables.get('TickRate');
        const IP = ExternalCrest ? await this.SettingsVariables.get('IP') : '127.0.0.1';
        const Port = ExternalCrest ? await this.SettingsVariables.get('Port') : '8881';

        return {
            TickRate,
            IP,
            Port
        }
    }

    /**
     * 
     */
    async doTimer() {
        const { TickRate, IP, Port } = await this.getVariables();

        // wait for data
        const data = await this.fetchData(IP, Port);

        // update connected state
        await this.setConnectedState(data);

        // handle sleep/delay before next iteration
        let interval = 1000 / TickRate;
        if (data === null) {
            interval = 1000;
        }
        await this.sleep(interval);

        // do next iteration
        await this.doTimer();
        
    }

    /**
     * 
     */
    async setConnectedState(data) {
        const ConnectedCurrent = await this.SettingsVariables.get('Connected');

        let Connected = false;
        if (data !== null) {
            Connected = true;
        }

        // if already stored, do nothing
        if (Connected === ConnectedCurrent) {
            return;
        }
        
        ipcMain.emit('setSetting', 'Connected', Connected);
    }

    /**
     * 
     * @param {*} ms 
     */
    async sleep(ms) {
        await new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * Fetch data from crest worker
     */
    async fetchData(IP, Port) {
        if (!IP) {
            return null;
        }

        if (!Port) {
            return null;
        }

        // init fetch request
        const url = `http://${IP}:${Port}/crest2/v1/api`;
        
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
            return null;
        }

        // validate response
        const valid = await this.validate(response);
        if (!valid) {
            // .. bail and return a message to parent
            return null;
        }

        // if we got here we should have good data
        return await this.processData( await response.json() );
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
     * Open Crest2
     */
    async openCrest() {
        console.log('openCrest');

        if (process.platform === 'win32') {
            try {
                if (typeof this.crest !== 'undefined') {
                    await this.closeCrest();
                }

                const { Port } = await this.getVariables();

                return this.crest = execFile(crest2, ['-p', Port]);
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
        console.log('closecrest');

        this.crest.kill();
        delete this.crest;

        return;
    }

    /**
     * Prepare data for all frontend views
     * @param {*} data 
     * @returns 
     */
    async processData(data) {
        console.log(data);

        return data;
    }
}