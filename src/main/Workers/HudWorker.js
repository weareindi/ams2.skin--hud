import { parentPort } from 'worker_threads';
import { isReady, isInMenu } from '../../utils/CrestUtils';

import HudFactory from '../Factories/HudFactory';
import HudViewFactory from '../Factories/HudViewFactory';

class HudWorker {
    constructor() {
        this.worker = parentPort;
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
        this.HudFactory = new HudFactory();
        this.HudViewFactory = new HudViewFactory();
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
        });
    }

    /**
     *
     */
    async processSetup(data) {
        // if ('defaultDataPath' in data) {
        //     storage.setDataPath(data.defaultDataPath);
        // }
    }

    /**
     *
     * @returns
     */
    async resetData() {
        await this.HudFactory.reset();
        await this.HudViewFactory.reset();
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

        // const eventChanged = await eventChanged(data);
        // if (eventChanged) {
        //     await this.clearEventStorage();
        // }

        const ready = await isReady(data);
        if (!ready) {
            return await this.resetData();
        }

        // Apply hud specific data to crest dataset
        data = await this.HudFactory.getData(data);

        return data;
    }

    /**
     *
     * @param {*} data
     */
    async processView(data) {
        const ready = await isReady(data);
        if (!ready) {
            await this.HudViewFactory.reset();
            return null;
        }

        return await this.HudViewFactory.getData(data);
    }

    /**
     *
     */
    async returnMessage(data) {
        this.worker.postMessage(data);
    }
}

new HudWorker();