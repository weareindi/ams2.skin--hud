import { isReady, getActiveParticipant } from '../../utils/CrestUtils';

export default class WeatherFactory {
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
            this.mRainDensity = null;
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

        data.wheelsAndTyres.mSuspensionDamage = await this.mSuspensionDamage(data);
        data.wheelsAndTyres.mSuspensionDamageState = await this.mSuspensionDamageState(data);
        data.wheelsAndTyres.mBrakeDamage = await this.mBrakeDamage(data);
        data.wheelsAndTyres.mBrakeDamageState = await this.mBrakeDamageState(data);
        data.wheelsAndTyres.mTyreWear = await this.mTyreWear(data);
        data.wheelsAndTyres.mTyreWearState = await this.mTyreWearState(data);
        data.wheelsAndTyres.mTyreTemp = await this.mTyreTemp(data);
        data.wheelsAndTyres.mTyreTempState = await this.mTyreTempState(data);


        return data;
    }

    /**
     *
     * @param {*} data
     * @returns
     */
    async mSuspensionDamage(data) {
        return [
            Math.round(data.wheelsAndTyres.mSuspensionDamage[0] * 100) / 100,
            Math.round(data.wheelsAndTyres.mSuspensionDamage[1] * 100) / 100,
            Math.round(data.wheelsAndTyres.mSuspensionDamage[2] * 100) / 100,
            Math.round(data.wheelsAndTyres.mSuspensionDamage[3] * 100) / 100,
        ];
    }

    /**
     *
     * @param {*} data
     * @returns
     */
    async mSuspensionDamageState(data) {
        const state = (value) => {
            if (value >= 1) {
                return 4;
            }

            if (value >= 0.2) {
                return 3;
            }

            if (value >= 0.15) {
                return 2;
            }

            if (value > 0) {
                return 1;
            }

            return 0;
        }

        return [
            state(data.wheelsAndTyres.mSuspensionDamage[0]),
            state(data.wheelsAndTyres.mSuspensionDamage[1]),
            state(data.wheelsAndTyres.mSuspensionDamage[2]),
            state(data.wheelsAndTyres.mSuspensionDamage[3])
        ];
    }

    /**
     *
     * @param {*} data
     * @returns
     */
    async mBrakeDamage(data) {
        return [
            Math.round(data.wheelsAndTyres.mBrakeDamage[0] * 100) / 100,
            Math.round(data.wheelsAndTyres.mBrakeDamage[1] * 100) / 100,
            Math.round(data.wheelsAndTyres.mBrakeDamage[2] * 100) / 100,
            Math.round(data.wheelsAndTyres.mBrakeDamage[3] * 100) / 100,
        ];
    }

    /**
     *
     * @param {*} data
     * @returns
     */
    async mBrakeDamageState(data) {
        const state = (value) => {
            if (value >= 1) {
                return 4;
            }

            if (value >= 0.5) {
                return 3;
            }

            if (value >= 0.25) {
                return 2;
            }

            if (value >= 0.1) {
                return 1;
            }

            return 0;
        }

        return [
            state(data.wheelsAndTyres.mBrakeDamage[0]),
            state(data.wheelsAndTyres.mBrakeDamage[1]),
            state(data.wheelsAndTyres.mBrakeDamage[2]),
            state(data.wheelsAndTyres.mBrakeDamage[3])
        ];
    }

    /**
     *
     * @param {*} data
     * @returns
     */
    async mTyreWear(data) {
        return [
            Math.round(data.wheelsAndTyres.mTyreWear[0] * 100) / 100,
            Math.round(data.wheelsAndTyres.mTyreWear[1] * 100) / 100,
            Math.round(data.wheelsAndTyres.mTyreWear[2] * 100) / 100,
            Math.round(data.wheelsAndTyres.mTyreWear[3] * 100) / 100,
        ];
    }

    /**
     *
     * @param {*} data
     * @returns
     */
    async mTyreWearState(data) {
        const state = (value) => {
            if (value >= 1) {
                return 4;
            }

            if (value >= 0.5) {
                return 3;
            }

            if (value >= 0.25) {
                return 2;
            }

            if (value >= 0.1) {
                return 1;
            }

            return 0;
        }

        return [
            state(data.wheelsAndTyres.mTyreWear[0]),
            state(data.wheelsAndTyres.mTyreWear[1]),
            state(data.wheelsAndTyres.mTyreWear[2]),
            state(data.wheelsAndTyres.mTyreWear[3])
        ];
    }

    /**
     *
     * @param {*} data
     * @returns
     */
    async mTyreTemp(data) {
        return [
            Math.round(data.wheelsAndTyres.mTyreTemp[0] * 100) / 100,
            Math.round(data.wheelsAndTyres.mTyreTemp[1] * 100) / 100,
            Math.round(data.wheelsAndTyres.mTyreTemp[2] * 100) / 100,
            Math.round(data.wheelsAndTyres.mTyreTemp[3] * 100) / 100,
        ];
    }

    /**
     *
     * @param {*} data
     * @returns
     */
    async mTyreTempState(data) {
        const state = (value) => {
            if (value >= 1) {
                return 4;
            }

            if (value >= 0.5) {
                return 3;
            }

            if (value >= 0.25) {
                return 2;
            }

            if (value >= 0.1) {
                return 1;
            }

            return 0;
        }

        return [
            state(data.wheelsAndTyres.mTyreTemp[0]),
            state(data.wheelsAndTyres.mTyreTemp[1]),
            state(data.wheelsAndTyres.mTyreTemp[2]),
            state(data.wheelsAndTyres.mTyreTemp[3])
        ];
    }
}

