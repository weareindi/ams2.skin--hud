class DashWorker {
    constructor() {
        this.init();
    }

    /**
     * Time to shine!
     */
    async init() {
        try {
            await this.registerListeners();
        } catch (error) {
            console.error(error);
        }
    }

    /**
     * Register listener for messages from parent worker
     */
    async registerListeners() {
        return self.onmessage = async (event) => {
            if (typeof event.data === 'undefined') {
                return console.error('No message supplied');
            }

            if (event.data.name === 'process') {
                const data = await this.prepareData(event.data.data);
                await this.returnMessage('updateview', data);
            }
        };
    }
    
    /**
     * Check and prepare supplied data from parent worker
     * @param {*} data 
     * @returns object
     */
    async prepareData(data) {
        if (!('mAntiLockActive' in data)) {
            return null;
        }

        if (!('mAntiLockSetting' in data)) {
            return null;
        }

        if (!('mBoostActive' in data)) {
            return null;
        }

        if (!('mBoostAmount' in data)) {
            return null;
        }

        if (!('mBrake' in data)) {
            return null;
        }

        if (!('mBrakeBias' in data)) {
            return null;
        }

        if (!('mClutch' in data)) {
            return null;
        }

        if (!('mClutchOverheated' in data)) {
            return null;
        }

        if (!('mClutchSlipping' in data)) {
            return null;
        }

        if (!('mClutchTemp' in data)) {
            return null;
        }

        if (!('mClutchWear' in data)) {
            return null;
        }

        if (!('mDrsState' in data)) {
            return null;
        }

        if (!('mErsAutoModeEnabled' in data)) {
            return null;
        }

        if (!('mErsDeploymentMode' in data)) {
            return null;
        }

        if (!('mGear' in data)) {
            return null;
        }

        if (!('mMaxRPM' in data)) {
            return null;
        }

        if (!('mNumGears' in data)) {
            return null;
        }

        if (!('mOilTempCelsius' in data)) {
            return null;
        }

        if (!('mRainDensity' in data)) {
            return null;
        }

        if (!('mRpm' in data)) {
            return null;
        }

        if (!('mSpeed' in data)) {
            return null;
        }

        if (!('mThrottle' in data)) {
            return null;
        }

        if (!('mUnfilteredThrottle' in data)) {
            return null;
        }

        if (!('mTractionControlSetting' in data)) {
            return null;
        }

        const temperatureData = await this.getTemperatureData(data);
        const temperatureDataDisplay = await this.getTemperatureDataForDisplay(temperatureData);
        const settingsData = await this.getSettingsData(data);
        const settingsDataDisplay = await this.getSettingsDataForDisplay(settingsData);
        const inputsData = await this.getInputsData(data);
        const inputsDataDisplay = await this.getInputsDataForDisplay(inputsData);
        const speedometerData = await this.getSpeedometerData(data);
        const speedometerDataDisplay = await this.getSpeedometerDataForDisplay(speedometerData);

        return {...temperatureDataDisplay, ...settingsDataDisplay, ...inputsDataDisplay, ...speedometerDataDisplay}
    }

    /**
     * Get car tempaerature data
     * @param {*} data 
     * @returns object
     */
    async getTemperatureData(data) {
        return {
            mOilTempCelsius: data.mOilTempCelsius,
            mWaterTempCelsius: data.mWaterTempCelsius,
        };
    }

    /**
     * Get car tempaerature data prepared for the view
     * @param {*} temperatureData 
     * @returns object
     */
    async getTemperatureDataForDisplay(temperatureData) {
        const mOilTempCelsiusDisplay = await this.mOilTempCelsiusDisplay(temperatureData.mOilTempCelsius);
        const mWaterTempCelsiusDisplay = await this.mWaterTempCelsiusDisplay(temperatureData.mWaterTempCelsius);

        return {
            mOilTempCelsiusDisplay,
            mWaterTempCelsiusDisplay,
        };
    }

    /**
     * Get car oil temp prepared for the view
     * @param {*} mOilTempCelsius 
     * @returns number
     */
    async mOilTempCelsiusDisplay(mOilTempCelsius) {
        return Math.round(mOilTempCelsius);
    }

    /**
     * Get car water temp prepared for the view
     * @param {*} mWaterTempCelsius 
     * @returns number
     */
    async mWaterTempCelsiusDisplay(mWaterTempCelsius) {
        return Math.round(mWaterTempCelsius);
    }

    /**
     * Get car settings data
     * @param {*} data 
     * @returns object
     */
    async getSettingsData(data) {
        return {
            mAntiLockActive: data.mAntiLockActive,
            mAntiLockSetting: data.mAntiLockSetting,
            mBoostActive: data.mBoostActive,
            mBoostAmount: data.mBoostAmount,
            mBrakeBias: data.mBrakeBias,
            mDrsState: data.mDrsState,
            mErsAutoModeEnabled: data.mErsAutoModeEnabled,
            mErsDeploymentMode: data.mErsDeploymentMode,
            mTractionControlSetting: data.mTractionControlSetting,
            mThrottle: data.mThrottle,
            mUnfilteredThrottle: data.mUnfilteredThrottle,
            mGear: data.mGear,
        };
    }
    
    /**
     * Get car settings data preapred for view
     * @param {*} settingsData 
     * @returns object
     */
    async getSettingsDataForDisplay(settingsData) {
        const mAntiLockActiveDisplay = await this.mAntiLockActiveDisplay(settingsData.mAntiLockActive);
        const mAntiLockSettingDisplay = await this.mAntiLockSettingDisplay(settingsData.mAntiLockSetting);
        const mBoostActiveDisplay = await this.mBoostActiveDisplay(settingsData.mBoostActive);
        const mBoostAmountDisplay = await this.mBoostAmountDisplay(settingsData.mBoostAmount);
        const mBrakeBiasDisplay = await this.mBrakeBiasDisplay(settingsData.mBrakeBias);
        const mDrsStateDisplay = await this.mDrsStateDisplay(settingsData.mDrsState);
        const isDrsAvailableDisplay = await this.isDrsAvailableDisplay(settingsData.mDrsState);
        const mErsAutoModeEnabledDisplay = await this.mErsAutoModeEnabledDisplay(settingsData.mErsAutoModeEnabled);
        const mErsDeploymentModeDisplay = await this.mErsDeploymentModeDisplay(settingsData.mErsDeploymentMode);
        const isErsAvailableDisplay = await this.isErsAvailableDisplay(settingsData.mBoostAmount);
        const isTractionControlActiveDisplay = await this.isTractionControlActiveDisplay(settingsData.mThrottle, settingsData.mUnfilteredThrottle, settingsData.mGear);
        const mTractionControlSettingDisplay = await this.mTractionControlSettingDisplay(settingsData.mTractionControlSetting);
        const boostStatusDisplay = await this.boostStatusDisplay(settingsData.mBoostAmount);

        return {
            mAntiLockActiveDisplay,
            mAntiLockSettingDisplay,
            mBoostActiveDisplay,
            mBoostAmountDisplay,
            mBrakeBiasDisplay,
            mDrsStateDisplay,
            isDrsAvailableDisplay,
            mErsAutoModeEnabledDisplay,
            mErsDeploymentModeDisplay,
            isErsAvailableDisplay,
            isTractionControlActiveDisplay,
            mTractionControlSettingDisplay,
            boostStatusDisplay,
        };
    }

    /**
     * Is Traction Control Active?
     * Unlike ABS, there is no data from the game to say "TC is active" so lets create a psuedo event
     * @param {*} mThrottle 
     * @param {*} mUnfilteredThrottle 
     * @returns boolean
     */
    async isTractionControlActiveDisplay(mThrottle, mUnfilteredThrottle, mGear) {
        // If the raw input is being filtered by the game, we're assuming that's traction control in effect
        if (mThrottle === mUnfilteredThrottle) {
            return false;
        }

        // ... we'll also assume auto-blip effects the above so we'll also say TC is working when in gear
        if (!mGear) {
            return false;
        }

        return true;
    }

    /**
     * Is DRS available?
     * @param {*} mDrsState 
     * @returns boolean
     */
    async isDrsAvailableDisplay(mDrsState) {
        return mDrsState;
    }

    /**
     * Is ERS available?
     * @param {*} mBoostAmount 
     * @returns boolean
     */
    async isErsAvailableDisplay(mBoostAmount) {
        if (typeof this.ersHasBeen === 'undefined') {
            this.ersHasBeen = false;
        }

        // if the boost amount at any point is higher than zero, we probably have ers available
        // boost is full in the pits and race start so this is quite a safe thing to test against
        if (mBoostAmount > 0) {
            this.ersHasBeen = true;
        }

        return this.ersHasBeen;
    }

    /**
     * Is antilock currently doing it's thing?
     * @param {*} mAntiLockActive 
     * @returns boolean
     */
    async mAntiLockActiveDisplay(mAntiLockActive) {
        return mAntiLockActive;
    }

    /**
     * Get antilock setting prepared for the view
     * @param {*} mAntiLockSetting 
     * @returns string
     */
    async mAntiLockSettingDisplay(mAntiLockSetting) {
        if (mAntiLockSetting < 0) {
            return null;
        }
        
        return `${mAntiLockSetting}`;
    }

    /**
     * Get boost active value prepared for the view
     * @param {*} mBoostActive 
     * @returns boolean
     */
    async mBoostActiveDisplay(mBoostActive) {
        return mBoostActive;
    }

    /**
     * Get boost amount preapred for the view
     * @param {*} mBoostAmount 
     * @returns number
     */
    async mBoostAmountDisplay(mBoostAmount) {
        return Math.round(mBoostAmount);
    }

    /**
     * Get rear brake bias value prepared for the view
     * @param {*} mBrakeBias 
     * @returns number
     */
    async mBrakeBiasDisplay(mBrakeBias) {
        return mBrakeBias;
    }

    /**
     * Get drs state prepared fro the view
     * @param {*} mDrsState 
     * @returns string
     */
    async mDrsStateDisplay(mDrsState) {
        return mDrsState;
    }

    /**
     * Get ers auto mode enabled prepared for the view
     * @param {*} mErsAutoModeEnabled 
     * @returns boolean
     */
    async mErsAutoModeEnabledDisplay(mErsAutoModeEnabled) {
        return mErsAutoModeEnabled;
    }

    /**
     * Get ers deployment mode preapred for the view
     * @param {*} mErsDeploymentMode 
     * @returns string
     */
    async mErsDeploymentModeDisplay(mErsDeploymentMode) {
        if (mErsDeploymentMode === 0) {
            return 'Auto';
        }

        if (mErsDeploymentMode === 1) {
            return 'Off';
        }

        if (mErsDeploymentMode === 2) {
            return 'Build';
        }

        if (mErsDeploymentMode === 3) {
            return 'Balanced';
        }

        if (mErsDeploymentMode === 4) {
            return 'Attack';
        }

        if (mErsDeploymentMode === 5) {
            return 'Qualify';
        }

        return mErsDeploymentMode;
    }

    /**
     * Get tc settings preapred for view
     * @param {*} mTractionControlSetting 
     * @returns string
     */
    async mTractionControlSettingDisplay(mTractionControlSetting) {
        // .. car doesn't have tc
        if (mTractionControlSetting < 0) {
            return null;
        }
        
        return `${mTractionControlSetting}`;
    }

    /**
     * Get boost status prepared for the view
     * Boost data is a little unreliable, sometimes from tick-to-tick the data hasn't updated fast enough.
     * .. so I'm using previousMBoostAmountA (1 tick) and previousMBoostAmountB (2 ticks) for comparison
     * @param {*} mBoostAmount 
     * @returns number
     */
    async boostStatusDisplay(mBoostAmount) {
        if (typeof this.previousMBoostAmountA === 'undefined') {
            this.previousMBoostAmountA = mBoostAmount;
        }
        if (typeof this.previousMBoostAmountB === 'undefined') {
            this.previousMBoostAmountB = mBoostAmount;
        }

        // value
        let value = null

        // ... charging?
        if (this.previousMBoostAmountB <= mBoostAmount) {
            value = 2; // charging
        }

        // is is going down?
        if (this.previousMBoostAmountB > mBoostAmount) {
            value = 1; // depleating
        }

        // is it full?
        if (mBoostAmount === 100) {
            value = 0; // full
        }

        // update scoped var for future reference
        this.previousMBoostAmountB = this.previousMBoostAmountA;
        this.previousMBoostAmountA = mBoostAmount;

        // return value
        return value;
    }

    /**
     * Get inputs data
     * @param {*} data 
     * @returns object
     */
    async getInputsData(data) {
        return {
            mBrake: data.mBrake,
            mClutch: data.mClutch,
            mClutchOverheated: data.mClutchOverheated,
            mClutchSlipping: data.mClutchSlipping,
            mClutchTemp: data.mClutchTemp,
            mClutchWear: data.mClutchWear,
            mThrottle: data.mThrottle,
        };
    }
    
    /**
     * Get the inputs data prepared for the view
     * @param {*} inputsData 
     * @returns object
     */
    async getInputsDataForDisplay(inputsData) {
        const mBrakeDisplay = await this.mBrakeDisplay(inputsData.mBrake);
        const mClutchDisplay = await this.mClutchDisplay(inputsData.mClutch);
        const mClutchOverheatedDisplay = await this.mClutchOverheatedDisplay(inputsData.mClutchOverheated);
        const mClutchSlippingDisplay = await this.mClutchSlippingDisplay(inputsData.mClutchSlipping);
        const mClutchTempDisplay = await this.mClutchTempDisplay(inputsData.mClutchTemp);
        const mClutchWearDisplay = await this.mClutchWearDisplay(inputsData.mClutchWear);
        const mThrottleDisplay = await this.mThrottleDisplay(inputsData.mThrottle);

        return {
            mBrakeDisplay,
            mClutchDisplay,
            mClutchOverheatedDisplay,
            mClutchSlippingDisplay,
            mClutchTempDisplay,
            mClutchWearDisplay,
            mThrottleDisplay,
        };
    }

    /**
     * Get brake input value prepared for the view
     * @param {*} mBrake 
     * @returns string
     */
    async mBrakeDisplay(mBrake) {
        // ensuring its a string as no input (0) is a still a valid value
        return `${Math.round(mBrake * 100)}`;
    }

    /**
     * Get clutch input value prepared for the view
     * @param {*} mClutch 
     * @returns string
     */
    async mClutchDisplay(mClutch) {
        // ensuring its a string as no input (0) is a still a valid value
        return `${Math.round(mClutch * 100)}`;
    }

    /**
     * Get clutch overheating value prepared for the view
     * @param {*} mClutchOverheated 
     * @returns 
     */
    async mClutchOverheatedDisplay(mClutchOverheated) {
        return mClutchOverheated;
    }

    /**
     * Get clutch slipping value prepared for the view
     * @param {*} mClutchSlipping 
     * @returns 
     */
    async mClutchSlippingDisplay(mClutchSlipping) {
        return mClutchSlipping;
    }

    /**
     * Get clutch temp prepared for the view
     * @param {*} mClutchTemp 
     * @returns number
     */
    async mClutchTempDisplay(mClutchTemp) {
        return mClutchTemp;
    }

    /**
     * Get clutch wear prepared for the view
     * @param {*} mClutchWear 
     * @returns number
     */
    async mClutchWearDisplay(mClutchWear) {
        return mClutchWear;
    }

    /**
     * Get throttle input value prepared for the view
     * @param {*} mThrottle 
     * @returns string
     */
    async mThrottleDisplay(mThrottle) {
        // ensuring its a string as no input (0) is a still a valid value
        return `${Math.round(mThrottle * 100)}`;
    }

    /**
     * Get speedometer data
     * @param {*} data 
     * @returns object
     */
    async getSpeedometerData(data) {
        return {
            mSpeed: data.mSpeed,
            mRpm: data.mRpm,
            mMaxRPM: data.mMaxRPM,
            mGear: data.mGear,
        };
    }

    /**
     * Get speedometer data prepared for the view
     * @param {*} speedometerData 
     * @returns object
     */
    async getSpeedometerDataForDisplay(speedometerData) {
        const mSpeedDisplay = await this.mSpeedDisplay(speedometerData.mSpeed);
        const mRpmDisplay = await this.mRpmDisplay(speedometerData.mRpm);
        const mRpmPercentage = await this.mRpmPercentage(speedometerData.mRpm, speedometerData.mMaxRPM);
        const mGearDisplay = await this.mGearDisplay(speedometerData.mGear);

        return {
            mSpeedDisplay,
            mRpmDisplay,
            mRpmPercentage,
            mGearDisplay,
        };
    }

    /**
     * Get speed prepared for the view
     * @param {*} mSpeed 
     * @returns number
     */
    async mSpeedDisplay(mSpeed) {
        return Math.floor(mSpeed * 3.6);
    }

    /**
     * Get rpm prepared for the view
     * @param {*} mRpm 
     * @param {*} mMaxRPM 
     * @returns number
     */
    async mRpmDisplay(mRpm) {
        return Math.round(mRpm);
    }

    /**
     * Get current rpm as a percentage 0-100
     * @param {*} mRpm 
     * @param {*} mMaxRPM 
     * @returns number
     */
    async mRpmPercentage(mRpm, mMaxRPM) {
        return Math.round((mRpm / mMaxRPM) * 100);
    }

    /**
     * Get current gear
     * @param {*} mGear 
     * @returns number
     */
    async mGearDisplay(mGear) {
        return mGear;
    }

    /**
     * Easy method to send a message back to parent worker with/without additional data
     * @param {*} name 
     * @param {*} data 
     */
    async returnMessage(name, data = null) {
        if (!data) {
            return self.postMessage({
                name
            });
        }

        return self.postMessage({
            name,
            data
        });
    }
}

new DashWorker();
