import { parentPort } from 'worker_threads';
import { isReady, isInMenu } from '../../utils/CrestUtils';
import BattleFactory from '../Factories/BattleFactory';
import DirectorFactory from '../Factories/DirectorFactory';
import DirectorViewFactory from '../Factories/DirectorViewFactory';

class DirectorWorker {
    constructor() {
        this.worker = parentPort;
        this.defaultDataPath = null;
        this.settings = {};

        this.init();
    }

    /**
     *
     */
    async init() {
        try {
            await this.registerListeners();
            await this.registerFactories();
        } catch (error) {
            console.error(error);

        }
    }

    /**
     *
     */
    async registerFactories() {
        this.BattleFactory = new BattleFactory();
        this.DirectorFactory = new DirectorFactory();
        this.DirectorViewFactory = new DirectorViewFactory();
    }

    /**
     *
     */
    async registerListeners() {
        this.worker.on('message', async (event) => {
            if (event.name === 'setup') {
                await this.returnMessage({
                    name: 'setup',
                    data: await this.processSetup(event.data)
                });
            }

            if (event.name === 'data') {
                await this.returnMessage({
                    name: 'data',
                    data: await this.processData(event.data)
                });
            }

            if (event.name === 'view') {
                await this.returnMessage({
                    name: 'view',
                    data: await this.processView(event.data)
                });
            }

            if (event.name === 'setting') {
                await this.returnMessage({
                    name: 'setting',
                    data: await this.processSetting(event.data)
                });
            }
        });
    }

    /**
     *
     */
    async processSetup(data) {
        this.DirectorFactory.setSettings(data);
    }

    /**
     *
     */
    async processSetting(data) {
        this.DirectorFactory.setSettings(data);
    }

    /**
     *
     * @returns
     */
    async resetData() {
        await this.BattleFactory.reset();
        await this.DirectorFactory.reset();
        await this.DirectorViewFactory.reset();
        return null;
    }

    /**
     *
     */
    async clearEventStorage() {
        await this.returnMessage({
            name: 'clearEventStorage'
        });
    }

    /**
     *
     */
    async processData(data) {
        const inMenu = await isInMenu(data);
        if (inMenu) {
            await this.clearEventStorage();
        }

        const ready = await isReady(data);
        if (!ready) {
            return await this.resetData();
        }

        // The aim here to to prepare data for the view:
        // - ensure data is dry
        // - null values are returned if data is not ready for the view

        // Apply on track battle data to crest data
        // - battle
        // -- aheadParticipantIndex
        // -- behindParticipantIndex
        // -- distance
        // -- duration
        // - participants/mParticipantInfo/Array
        // -- mBattlingParticipantAhead
        // -- mBattlingParticipantBehind
        data = await this.BattleFactory.getData(data);


        // Director
        // - Director
        data = await this.DirectorFactory.getData(data);

        return data;
    }

    /**
     *
     * @param {*} data
     */
    async processView(data) {
        const ready = await isReady(data);
        if (!ready) {
            await this.DirectorViewFactory.reset();
            return null;
        }

        return await this.DirectorViewFactory.getData(data);
    }

    /**
     *
     */
    async returnMessage(data) {
        this.worker.postMessage(data);
    }
}

new DirectorWorker();