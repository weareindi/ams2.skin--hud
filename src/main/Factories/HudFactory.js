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
            //
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
        if (data.gameStates.mGameState === 4
            // && (
            //     data.unfilteredInput.mUnfilteredThrottle === 0
            //     && data.unfilteredInput.mUnfilteredBrake === 1
            //     && data.unfilteredInput.mUnfilteredSteering === 0
            //     && data.unfilteredInput.mUnfilteredClutch === 0
            // )
        ) {
            // if finished/disqualified/retired/dnf
            if (data.gameStates.mRaceState === 3 || data.gameStates.mRaceState === 4 || data.gameStates.mRaceState === 5 || data.gameStates.mRaceState === 6) {
                return 0;
            }

            return 1;
        }

        // in car
        if (
            data.gameStates.mGameState === 2
            // && (
            //     data.unfilteredInput.mUnfilteredThrottle !== 0
            //     || data.unfilteredInput.mUnfilteredBrake !== 1
            //     || data.unfilteredInput.mUnfilteredSteering !== 0
            //     || data.unfilteredInput.mUnfilteredClutch !== 0
            // )
        ) {
            return 2;
        }

        // // replay
        // if (data.gameStates.mGameState === 7) {
        //     return 1;
        // }

        return 0;
    }
}

