import { isReady } from '../../utils/CrestUtils';

export default class CarStateFactory {
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
            this.ersAvailable = false;
            this.ersAmountIteration1 = null;
            this.ersAmountIteration2 = null;
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

        data.carState.mTachometer = await this.mTachometer(data);
        data.carState.mTachometerState = await this.mTachometerState(data);
        data.carState.mGear = await this.mGear(data);

        data.carState.mAntiLockSetting = await this.mAntiLockSetting(data);
        data.carState.mAntiLockActive = await this.mAntiLockActive(data);

        data.carState.mTractionControlSetting = await this.mTractionControlSetting(data);
        data.carState.mTractionControlActive = await this.mTractionControlActive(data);

        data.carState.mDrsState = await this.mDrsState(data);

        data.carState.mErsAvailable = await this.mErsAvailable(data);
        data.carState.mErsDeploymentModeLabel = await this.mErsDeploymentModeLabel(data);
        data.carState.mErsState = await this.mErsState(data);

        data.carState.mWaterTemp = await this.mWaterTemp(data);
        data.carState.mWaterState = await this.mWaterState(data);

        data.carState.mOilTemp = await this.mOilTemp(data);
        data.carState.mOilState = await this.mOilState(data);

        return data;
    }

    /**
     *
     * @param {*} data
     * @returns
     */
    async mTachometer(data) {
        return data.carState.mRpm / data.carState.mMaxRPM;
    }

    /**
     *
     * @param {*} data
     * @returns
     */
    async mTachometerState(data) {
        if (data.carState.mTachometer >= 0.97) {
            return 4;
        }

        return 0;
    }

    /**
     *
     * @param {*} data
     * @returns
     */
    async mGear(data) {
        if (data.carState.mGear === 0) {
            return 'N';
        }

        if (data.carState.mGear < 0) {
            return 'R';
        }

        return data.carState.mGear;
    }

    /**
     *
     * @param {*} data
     * @returns
     */
    async mAntiLockSetting(data) {
        if (data.carState.mAntiLockSetting < 0) {
            return null;
        }

        return data.carState.mAntiLockSetting;
    }

    /**
     *
     * @param {*} data
     * @returns
     */
    async mAntiLockActive(data) {
        // check against mAntiLockSetting (we've just updated it to null or a value)
        if (data.carState.mAntiLockSetting === null) {
            return null;
        }

        return data.carState.mAntiLockActive;
    }

    /**
     *
     * @param {*} data
     * @returns
     */
    async mTractionControlSetting(data) {
        if (data.carState.mTractionControlSetting < 0) {
            return null;
        }

        return data.carState.mTractionControlSetting;
    }

    /**
     *
     * @param {*} data
     * @returns
     */
    async mTractionControlActive(data) {
        // check against mTractionControlSetting (we've just updated it to null or a value)
        if (data.carState.mTractionControlSetting === null) {
            return null;
        }

        // If the raw input is being filtered by the game, we're assuming that's traction control in effect
        // If throttle matches input?
        if (data.carState.mThrottle === data.unfilteredInput.mUnfilteredThrottle) {
            // ... return false
            return false;
        }

        // ... we'll also assume auto-blip effects the above so we'll also say TC is working only when in gear
        // If not in gear?
        if (!data.carState.mGear) {
            // ... return false
            return false;
        }

        return true;
    }

    /**
     *
     * @param {*} data
     * @returns
     */
    async mDrsState(data) {
        if (data.carState.mDrsState === 1) {
            return 1;
            // return 'disabled';
        }

        if (data.carState.mDrsState === 3) {
            return 2;
            // return 'enabled';
        }

        if (data.carState.mDrsState === 11) {
            return 3;
            // return 'inactive';
        }

        if (data.carState.mDrsState === 17 || data.carState.mDrsState === 27) {
            return 4;
            // return 'active';
        }

        return 0;
    }

    /**
     *
     * @param {*} data
     * @returns
     */
    async mErsDeploymentModeLabel(data) {
        const prefix = data.carState.mErsAutoModeEnabled ? '[A]' : '';

        if (data.carState.mErsDeploymentMode === 1) {
            return `${prefix} Off`;
        }

        if (data.carState.mErsDeploymentMode === 2) {
            return `${prefix} Build`;
        }

        if (data.carState.mErsDeploymentMode === 3) {
            return `${prefix} Balanced`;
        }

        if (data.carState.mErsDeploymentMode === 4) {
            return `${prefix} Attack`;
        }

        if (data.carState.mErsDeploymentMode === 5) {
            return `${prefix} Qualify`;
        }

        return null;
    }

    /**
     *
     * @param {*} data
     * @returns
     */
    async mErsAvailable(data) {
        // if the boost amount at any point is higher than zero, we probably have ers available
        // boost is full in the pits and race start so this is quite a safe thing to test against
        if (data.carState.mBoostAmount > 0) {
            this.ersAvailable = true;
        }

        // never had boost?
        return this.ersAvailable;
    }

    /**
     *
     * @param {*} data
     * @returns
     */
    async mErsState(data) {
        if (data.carState.mErsAvailable === false) {
            return null;
        }

        if (!this.ersAmountIteration1) {
            this.ersAmountIteration1 = data.carState.mBoostAmount;
        }

        if (!this.ersAmountIteration2) {
            this.ersAmountIteration2 = data.carState.mBoostAmount;
        }

        let state = null;

        // ... charging?
        if (this.ersAmountIteration2 <= data.carState.mBoostAmount) {
            state = 2; // charging
        }

        // is is going down?
        if (this.ersAmountIteration1 > data.carState.mBoostAmount) {
            state = 1; // depleating
        }

        // is it full?
        if (data.carState.mBoostAmount === 100) {
            state = 0; // full
        }

        // update scoped vars for future reference
        this.ersAmountIteration2 = this.ersAmountIteration1;
        this.ersAmountIteration1 = data.carState.mBoostAmount;

        // work out highlight state
        if (data.carState.mBoostActive === false && state === 2) {
            return 1;
            // return 'disabled-charging';
        }

        if (data.carState.mBoostActive === false && state === 1) {
            return 2;
            // return 'disabled-depleating';
        }

        if (data.carState.mBoostActive === false && state === 0) {
            return 3;
            // return 'disabled-full';
        }

        if (data.carState.mBoostActive === true && state === 2) {
            return 4;
            // return 'enabled-charging';
        }

        if (data.carState.mBoostActive === true && state === 1) {
            return 5;
            // return 'enabled-depleating';
        }

        if (data.carState.mBoostActive === true && state === 0) {
            return 6;
            // return 'enabled-full';
        }

        return null;
    }

    /**
     *
     * @param {*} data
     * @returns
     */
    async mWaterTemp(data) {
        return Math.round(data.carState.mWaterTempCelsius);
    }

    /**
     *
     * @param {*} data
     * @returns
     */
    async mWaterState(data) {
        if (data.carState.mWaterTempCelsius >= 100) {
            return 6;
        }

        if (data.carState.mWaterTempCelsius >= 98) {
            return 5;
        }

        return 0;
    }

    /**
     *
     * @param {*} data
     * @returns
     */
    async mOilTemp(data) {
        return Math.round(data.carState.mOilTempCelsius);
    }

    /**
     *
     * @param {*} data
     * @returns
     */
    async mOilState(data) {
        // if (data.carState.mOilTempCelsius >= 126.6) {
        //     return 6;
        // }

        if (data.carState.mOilTempCelsius >= 120) {
            return 6;
        }

        if (data.carState.mOilTempCelsius >= 115) {
            return 5;
        }

        if (data.carState.mOilTempCelsius > 0) {
            return null;
        }

        return null;
    }
}

