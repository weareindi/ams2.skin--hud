import { isReady, isOnCircuit } from '../../utils/CrestUtils';

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
            this.mAirPressures = [null,null,null,null];
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
        data.wheelsAndTyres.mBrakeTemp = await this.mBrakeTemp(data);
        data.wheelsAndTyres.mBrakeTempState = await this.mBrakeTempState(data);
        data.wheelsAndTyres.mTyreWear = await this.mTyreWear(data);
        data.wheelsAndTyres.mTyreWearState = await this.mTyreWearState(data);
        data.wheelsAndTyres.mTyreTemp = await this.mTyreTemp(data);
        data.wheelsAndTyres.mTyreTempState = await this.mTyreTempState(data);
        data.wheelsAndTyres.mTyreCompoundShort = await this.mTyreCompoundShort(data);
        data.wheelsAndTyres.mAirPressure = await this.mAirPressure(data);
        data.wheelsAndTyres.mAirPressureState = await this.mAirPressureState(data);
        data.wheelsAndTyres.mAirPressurePrevious = await this.mAirPressurePrevious(data);

        return data;
    }


    /**
     *
     * @param {*} data
     * @returns
     */
    async mAirPressurePrevious(data) {
        const onCircuit = await isOnCircuit(data);
        if (onCircuit) {
            return this.mAirPressures = data.wheelsAndTyres.mAirPressure;
        }

        return this.mAirPressures;
    }

    /**
     *
     * @param {*} data
     * @returns
     */
    async mSuspensionDamage(data) {
        return [
            data.wheelsAndTyres.mSuspensionDamage[0],
            data.wheelsAndTyres.mSuspensionDamage[1],
            data.wheelsAndTyres.mSuspensionDamage[2],
            data.wheelsAndTyres.mSuspensionDamage[3],
        ];
    }

    /**
     *
     * @param {*} data
     * @returns
     */
    async mSuspensionDamageState(data) {
        const state = (value) => {
            if (value >= 0.4) {
                return 6;
            }

            if (value >= 0.25) {
                return 5;
            }

            // if (value >= 0.2) {
            //     return 3;
            // }

            // if (value >= 0.15) {
            //     return 2;
            // }

            if (value > 0) {
                return 3;
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
            data.wheelsAndTyres.mBrakeDamage[0],
            data.wheelsAndTyres.mBrakeDamage[1],
            data.wheelsAndTyres.mBrakeDamage[2],
            data.wheelsAndTyres.mBrakeDamage[3],
        ];
    }

    /**
     *
     * @param {*} data
     * @returns
     */
    async mBrakeDamageState(data) {
        const state = (value) => {
            if (value >= 0.4) {
                return 6;
            }

            if (value >= 0.25) {
                return 5;
            }

            // if (value >= 0.2) {
            //     return 3;
            // }

            // if (value >= 0.15) {
            //     return 2;
            // }

            if (value > 0.2) {
                return 3;
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
    async mBrakeTemp(data) {
        return [
            data.wheelsAndTyres.mBrakeTempCelsius[0],
            data.wheelsAndTyres.mBrakeTempCelsius[1],
            data.wheelsAndTyres.mBrakeTempCelsius[2],
            data.wheelsAndTyres.mBrakeTempCelsius[3],
        ];
    }

    /**
     *
     * @param {*} data
     * @returns
     */
    async mBrakeTempState(data) {
        const state = (value) => {
            if (value >= 1000) {
                return 6;
            }

            if (value >= 800) {
                return 5;
            }

            if (value >= 100) {
                return 0;
            }

            return 1;
        }

        return [
            state(data.wheelsAndTyres.mBrakeTemp[0]),
            state(data.wheelsAndTyres.mBrakeTemp[1]),
            state(data.wheelsAndTyres.mBrakeTemp[2]),
            state(data.wheelsAndTyres.mBrakeTemp[3])
        ];
    }

    /**
     *
     * @param {*} data
     * @returns
     */
    async mTyreWear(data) {
        return [
            data.wheelsAndTyres.mTyreWear[0],
            data.wheelsAndTyres.mTyreWear[1],
            data.wheelsAndTyres.mTyreWear[2],
            data.wheelsAndTyres.mTyreWear[3],
        ];
    }

    /**
     *
     * @param {*} data
     * @returns
     */
    async mTyreWearState(data) {
        const state = (value) => {
            if (value >= 0.75) {
                return 6;
            }

            if (value >= 0.5) {
                return 5;
            }

            if (value >= 0.25) {
                return 3;
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
            Number(data.wheelsAndTyres.mTyreTemp[0].toFixed(0)),
            Number(data.wheelsAndTyres.mTyreTemp[1].toFixed(0)),
            Number(data.wheelsAndTyres.mTyreTemp[2].toFixed(0)),
            Number(data.wheelsAndTyres.mTyreTemp[3].toFixed(0)),
        ];
    }

    /**
     *
     * @param {*} data
     * @returns
     */
    async mTyreTempState(data) {
        const state = (value, compound) => {
            if (compound === 'track') {
                if (value >= 130) {
                    return 6;
                }

                if (value >= 120) {
                    return 5;
                }

                if (value >= 50) {
                    return 0;
                }
            }

            if (compound === 'vintage') {
                if (value >= 115) {
                    return 6;
                }

                if (value >= 105) {
                    return 5;
                }

                if (value >= 50) {
                    return 0;
                }
            }

            if (compound === 'semi-slick') {
                if (value >= 115) {
                    return 6;
                }

                if (value >= 105) {
                    return 5;
                }

                if (value >= 50) {
                    return 0;
                }
            }

            if (compound === 'soft slick') {
                if (value >= 130) {
                    return 6;
                }

                if (value >= 120) {
                    return 5;
                }

                if (value >= 60) {
                    return 0;
                }
            }

            if (compound === 'medium slick') {
                if (value >= 135) {
                    return 6;
                }

                if (value >= 125) {
                    return 5;
                }

                if (value >= 60) {
                    return 0;
                }
            }

            if (compound === 'hard slick') {
                if (value >= 140) {
                    return 6;
                }

                if (value >= 130) {
                    return 5;
                }

                if (value >= 60) {
                    return 0;
                }
            }

            if (compound === 'intermediate') {
                if (value >= 130) {
                    return 6;
                }

                if (value >= 120) {
                    return 5;
                }

                if (value >= 60) {
                    return 0;
                }
            }

            if (compound === 'wet') {
                if (value >= 110) {
                    return 6;
                }

                if (value >= 100) {
                    return 5;
                }

                if (value >= 60) {
                    return 0;
                }
            }

            return 1;
        }

        return [
            state(data.wheelsAndTyres.mTyreTemp[0], data.wheelsAndTyres.mTyreCompound[0].toLowerCase()),
            state(data.wheelsAndTyres.mTyreTemp[1], data.wheelsAndTyres.mTyreCompound[1].toLowerCase()),
            state(data.wheelsAndTyres.mTyreTemp[2], data.wheelsAndTyres.mTyreCompound[2].toLowerCase()),
            state(data.wheelsAndTyres.mTyreTemp[3], data.wheelsAndTyres.mTyreCompound[3].toLowerCase())
        ];
    }

    /**
     *
     * @param {*} data
     * @returns
     */
    async mTyreCompoundShort(data) {
        const short = (string) => {
            // use first character
            return string.substring(0, 1);
        }

        return [
            short(data.wheelsAndTyres.mTyreCompound[0]),
            short(data.wheelsAndTyres.mTyreCompound[1]),
            short(data.wheelsAndTyres.mTyreCompound[2]),
            short(data.wheelsAndTyres.mTyreCompound[3]),
        ];
    }

    /**
     *
     * @param {*} data
     * @returns
     */
    async mAirPressure(data) {
        return [
            Number((data.wheelsAndTyres.mAirPressure[0] / 100)).toFixed(2),
            Number((data.wheelsAndTyres.mAirPressure[1] / 100)).toFixed(2),
            Number((data.wheelsAndTyres.mAirPressure[2] / 100)).toFixed(2),
            Number((data.wheelsAndTyres.mAirPressure[3] / 100)).toFixed(2),
        ];
    }

    /**
     *
     * @param {*} data
     * @returns
     */
    async mAirPressureState(data) {
        const state = (value) => {
            return 0;
        }

        return [
            state(data.wheelsAndTyres.mAirPressure[0]),
            state(data.wheelsAndTyres.mAirPressure[1]),
            state(data.wheelsAndTyres.mAirPressure[2]),
            state(data.wheelsAndTyres.mAirPressure[3])
        ];
    }
}

