import { isReady } from '../../utils/CrestUtils';

export default class HudFactory {
    constructor() {
        this.init();
    }

    /**
     *
     */
    async init() {
        try {
            await this.reset();
        } catch (error) {
            console.error(error);
        }
    }

    /**
     *
     */
    async reset() {
        try {
            // console.log('HudFactory reset');
        } catch (error) {
            console.error(error);
        }
    }

    /**
     *
     * @param {*} data
     * @param {*} mParticipantIndex
     * @returns
     */
    async getData(data, mParticipantIndex) {
        try {
            return await this.prepareData(data, mParticipantIndex);
        } catch (error) {
            console.error(error);
        }
    }

    /**
     *
     * @param {*} data
     * @param {*} mParticipantIndex
     * @returns
     */
    async prepareData(data) {
        const ready = await isReady(data);
        if (!ready) {
            return null;
        }

        data.mHudStatus = await this.mHudStatus(data);

        return data;
    }

    /**
     *
     * @param {*} data
     * @returns
     */
    async mHudStatus(data) {
        // in pit box
        if (data.gameStates.mGameState === 4) {
            return 1;
        }

        // in car
        if (data.gameStates.mGameState === 2) {
            return 2;
        }

        // // replay
        // if (data.gameStates.mGameState === 7) {
        //     return 1;
        // }

        return 0;
    }
}

