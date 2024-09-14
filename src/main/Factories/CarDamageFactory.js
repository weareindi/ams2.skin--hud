import { isReady } from '../../utils/CrestUtils';

export default class CarDamageFactory {
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
            // console.log('CarDamageFactory reset');
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
    async prepareData(data, mParticipantIndex) {
        const ready = await isReady(data);
        if (!ready) {
            return null;
        }

        data.carDamage.mAeroDamageAmount = await this.mAeroDamageAmount(data);
        data.carDamage.mAeroState = await this.mAeroState(data);

        data.carDamage.mClutchDamageAmount = await this.mClutchDamageAmount(data);
        data.carDamage.mClutchState = await this.mClutchState(data);

        data.carDamage.mEngineDamageAmount = await this.mEngineDamageAmount(data);
        data.carDamage.mEngineState = await this.mEngineState(data);

        return data;
    }

    /**
     *
     * @param {*} data
     * @returns
     */
    async mAeroDamageAmount(data) {
        return Math.floor(data.carDamage.mAeroDamage * 100);
    }

    /**
     *
     * @param {*} data
     * @returns
     */
    async mAeroState(data) {
        if (data.carDamage.mAeroDamage >= 0.5) {
            return 6;
        }

        if (data.carDamage.mAeroDamage >= 0.2) {
            return 5;
        }

        if (data.carDamage.mAeroDamage > 0) {
            return 3;
        }

        return 0;
    }

    /**
     *
     * @param {*} data
     * @returns
     */
    async mClutchDamageAmount(data) {
        return Math.round(data.carState.mClutchWear * 100);
    }

    /**
     *
     * @param {*} data
     * @returns
     */
    async mClutchState(data) {
        // if (data.carState.mClutchWear >= 1) {
        //     return 6;
        // }

        // if (data.carState.mClutchWear >= 0.5) {
        //     return 5;
        // }

        // if (data.carState.mClutchWear >= 0.25) {
        //     return 3;
        // }

        // if (data.carState.mClutchWear >= 0.1) {
        //     return 1;
        // }

        return 0;
    }

    /**
     *
     * @param {*} data
     * @returns
     */
    async mEngineDamageAmount(data) {
        return Math.round(data.carDamage.mEngineDamage * 100);
    }

    /**
     *
     * @param {*} data
     * @returns
     */
    async mEngineState(data) {
        // if (data.carDamage.mEngineDamage >= 1) {
        //     return 6;
        // }

        if (data.carDamage.mEngineDamage >= 0.4) {
            return 6;
        }

        if (data.carDamage.mEngineDamage >= 0.2) {
            return 5;
        }

        if (data.carDamage.mEngineDamage >= 0.1) {
            return 3;
        }

        return 0;
    }
}

