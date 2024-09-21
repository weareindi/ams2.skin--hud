import { ipcMain } from 'electron';
import { execFile } from 'child_process';
import * as storage from 'rocket-store';

import crest2 from '../../../resources/crest2/CREST2.exe?asset';
import SettingsController from './SettingsController';
import MockDataController from './MockDataController';

import { Worker } from 'node:worker_threads';
import DataWorkerPath from '../Workers/DataWorker?modulePath';

export default class DataController {
    constructor() {
        // singleton
        if (typeof global.DataController !== 'undefined') {
            return global.DataController;
        }
        global.DataController = this;

        // prepare vars
        this.MockState = null;

        this.init();
    }

    /**
     *
     */
    async init() {
        try {
            this.storage = await storage.Rocketstore();
            await this.registerSettingsController();
            await this.processInitialState();
            await this.registerWorkers();
            await this.registerWorkerListeners();
            await this.doTimer();
        } catch (error) {
            console.log(error);
        }
    }

    /**
     *
     */
    async registerWorkers() {
        await this.registerDataWorker();
        // await this.registerWorkerHud();
        // await this.registerWorkerDirector();
    }

    /**
     *
     */
    async registerDataWorker() {
        this.DataWorker = new Worker(DataWorkerPath);
        this.DataWorker.postMessage({
            name: 'setup'
        });
    }

    /**
     *
     */
    async registerDataWorkerListener() {
        this.DataWorker.on('message', async (event) => {
            if (event.name === 'setup') {
                //
            }

            if (event.name === 'data') {
                ipcMain.emit('data', event.data);
            }

            if (event.name === 'clearEventStorage') {
                await this.clearEventStorage();
            }

        });
    }

    /**
     *
     */
    async registerWorkerListeners() {
        await this.registerDataWorkerListener();
    }

    /**
     *
     */
    async clearEventStorage() {
        await this.storage.delete('laps');
        await this.storage.delete('mRacePositionStart');
        await this.storage.delete('mCarClassPositionStart');
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
    async registerSettingsController() {
        this.SettingsController = new SettingsController();
    }

    /**
     *
     */
    async processInitialState() {
        const ExternalCrest = await this.SettingsController.get('ExternalCrest');
        if (ExternalCrest) {
            return;
        }

        this.openCrest();
    }

    /**
     *
     */
    async getVariables() {
        const ExternalCrest = await this.SettingsController.get('ExternalCrest');
        const TickRate = await this.SettingsController.get('TickRate');
        const IP = ExternalCrest ? await this.SettingsController.get('IP') : '127.0.0.1';
        const Port = ExternalCrest ? await this.SettingsController.get('Port') : '8881';
        const MockFetch = await this.SettingsController.get('MockFetch');
        const MockState = await this.SettingsController.get('MockState');

        return {
            TickRate,
            IP,
            Port,
            MockFetch,
            MockState,
        }
    }

    /**
     *
     */
    async doTimer() {
        const { TickRate, IP, Port, MockFetch, MockState } = await this.getVariables();

        let data = {};

        if (MockFetch) {
            this.MockState = MockState;
            data = await this.fetchMockDataController(MockState);
        } else {
            this.MockState = null;
            data = await this.fetchData(IP, Port);
        }

        // update connected state
        await this.setConnectedState(data);

        // send to hud worker
        this.DataWorker.postMessage({
            name: 'data',
            data: data
        });

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
     * @param {*} data
     * @returns
     */
    async setConnectedState(data) {
        const ConnectedCurrent = await this.SettingsController.get('Connected');

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
     *
     * @param {*} MockState
     */
    async fetchMockDataController(MockState) {
        if (this.MockState !== MockState) {
            await this.resetData();
        }

        return await (new MockDataController()).data(MockState);
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
                    // "Content-Type": "application/json",
                    // 'Accept-Encoding': 'gzip'
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

        const json = await this.getJson(response);

        return json;
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
            passedJson = JSON.parse( textResponse.replace(/(?:\r\n|\r|\n)/g, '') );
        } catch (e) {
            return false;
        }

        // do we have a timestamp in the response? probably valid then
        if (!('timestamp' in passedJson)) {
            return false;
        }

        return true;
    }

    /**
     *
     */
    async getJson(fetchResponse) {
        const response = fetchResponse.clone();

        if (response.status !== 200) {
            return false;
        }

        // get text from response
        let textResponse = await response.text();

        return await JSON.parse( textResponse.replace(/(?:\r\n|\r|\n)/g, '') );
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
        this.crest.kill();
        delete this.crest;
        return;
    }
}