import { display } from "../../utils/DataUtils";

class DashWorker {
    constructor() {
        this.ersHasBeen = null;
        this.previousMBoostAmountA = null;
        this.previousMBoostAmountB = null;
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

            if (event.data.name === 'reset') {
                await this.reset();
                await this.returnMessage('resetcomplete');
            }
        };
    }

    /**
     * Reset vars used at start of each event
     */
    async reset() {
        this.ersHasBeen = null;
        this.previousMBoostAmountA = null;
        this.previousMBoostAmountB = null;
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

        const settingsData = await this.getSettingsData(data);
        const settingsDataDisplay = await this.getSettingsDataForDisplay(settingsData);
        const inputsData = await this.getInputsData(data);
        const inputsDataDisplay = await this.getInputsDataForDisplay(inputsData);
        const speedometerData = await this.getSpeedometerData(data);
        const speedometerDataDisplay = await this.getSpeedometerDataForDisplay(speedometerData);

        return {...settingsDataDisplay, ...inputsDataDisplay, ...speedometerDataDisplay}
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
        const mAntiLockHighlight = await this.mAntiLockHighlight(settingsData.mAntiLockActive);
        const mBrakeBiasDisplay = await this.mBrakeBiasDisplay(settingsData.mBrakeBias);
        const mBoostActiveDisplay = await this.mBoostActiveDisplay(settingsData.mBoostActive);
        const mBoostAmountDisplay = await this.mBoostAmountDisplay(settingsData.mBoostAmount);
        const mErsAutoModeEnabledDisplay = await this.mErsAutoModeEnabledDisplay(settingsData.mErsAutoModeEnabled);
        const mErsDeploymentModeDisplay = await this.mErsDeploymentModeDisplay(settingsData.mErsDeploymentMode);
        const mErsStatus = await this.mErsStatus(settingsData.mBoostAmount);
        const mErsHighlight = await this.mErsHighlight(settingsData.mBoostAmount, settingsData.mBoostActive);
        const mDrsStateDisplay = await this.mDrsStateDisplay(settingsData.mDrsState);
        const mDrsStatus = await this.mDrsStatus(settingsData.mDrsState);
        const mDrsHighlight = await this.mDrsHighlight(settingsData.mDrsState);
        const mTractionControlSettingDisplay = await this.mTractionControlSettingDisplay(settingsData.mTractionControlSetting);
        const mTractionControlHighlight = await this.mTractionControlHighlight(settingsData.mThrottle, settingsData.mUnfilteredThrottle, settingsData.mGear);

        return {
            mAntiLockActiveDisplay,
            mAntiLockSettingDisplay,
            mAntiLockHighlight,
            mBrakeBiasDisplay,
            mBoostActiveDisplay,
            mBoostAmountDisplay,
            mErsAutoModeEnabledDisplay,
            mErsDeploymentModeDisplay,
            mErsStatus,
            mErsHighlight,
            mDrsStateDisplay,
            mDrsStatus,
            mDrsHighlight,
            mTractionControlSettingDisplay,
            mTractionControlHighlight,
        };
    }

    /**
     * Get ers status
     * @param {*} mBoostAmount 
     * @returns object
     */
    async mErsStatus(mBoostAmount) {
        const mErsStatus = await this.getErsStatus(mBoostAmount);

        return mErsStatus;
    }

    /**
     * Get ers status based on boost amount
     * @param {*} mBoostAmount 
     * @returns 
     */
    async getErsStatus(mBoostAmount) {
        // if the boost amount at any point is higher than zero, we probably have ers available
        // boost is full in the pits and race start so this is quite a safe thing to test against
        if (mBoostAmount > 0) {
            this.ersHasBeen = true;
        }

        return this.ersHasBeen;
    }

    /**
     * Get ers highlight
     * @param {*} mBoostAmount 
     * @param {*} mBoostActive
     * @returns object
     */
    async mErsHighlight(mBoostAmount, mBoostActive) {
        const mErsHighlight = await this.getErsHighlight(mBoostAmount, mBoostActive);

        return mErsHighlight;
    }

    /**
     * Get ers highlight based on boost amount
     * @param {*} mBoostAmount 
     * @param {*} mBoostActive 
     * @returns 
     */
    async getErsHighlight(mBoostAmount, mBoostActive) {
        if (!this.previousMBoostAmountA) {
            this.previousMBoostAmountA = mBoostAmount;
        }

        if (!this.previousMBoostAmountB) {
            this.previousMBoostAmountB = mBoostAmount;
        }

        // charge state
        let state = null

        // ... charging?
        if (this.previousMBoostAmountB <= mBoostAmount) {
            state = 2; // charging
        }

        // is is going down?
        if (this.previousMBoostAmountB > mBoostAmount) {
            state = 1; // depleating
        }

        // is it full?
        if (mBoostAmount === 100) {
            state = 0; // full
        }

        // update scoped vars for future reference
        this.previousMBoostAmountB = this.previousMBoostAmountA;
        this.previousMBoostAmountA = mBoostAmount;

        // work out highlight state
        if (mBoostActive === false && state === 2) {
            return 'disabled-charging';
        }
        
        if (mBoostActive === false && state === 1) {
            return 'disabled-depleating';
        }
        
        if (mBoostActive === false && state === 0) {
            return 'disabled-full';
        }

        if (mBoostActive === true && state === 2) {
            return 'enabled-charging';
        }

        if (mBoostActive === true && state === 1) {
            return 'enabled-depleating';
        }

        if (mBoostActive === true && state === 0) {
            return 'enabled-full';
        }

        return null;
    }

    /**
     * Get drs status
     * @param {*} mDrsState 
     * @returns object
     */
    async mDrsStatus(mDrsState) {
        const mDrsStatus = await this.getDrsStatus(mDrsState);

        return mDrsStatus;
    }

    /**
     * Get drs status
     * @param {*} mDrsState 
     * @returns 
     */
    async getDrsStatus(mDrsState) {
        if (mDrsState === 0) {
            return null;
        }

        return mDrsState;
    }

    /**
     * Get drs highlight
     * @param {*} mDrsState 
     * @returns object
     */
    async mDrsHighlight(mDrsState) {
        const mDrsHighlight = await this.getDrsHighlight(mDrsState);

        return mDrsHighlight;
    }

    /**
     * Get drs Highlight
     * @param {*} mDrsState 
     * @returns 
     */
    async getDrsHighlight(mDrsState) {
        if (mDrsState === 1) {
            return 'disabled';
        }

        if (mDrsState === 3) {
            return 'enabled';
        }

        if (mDrsState === 11) {
            return 'inactive';
        }

        if (mDrsState === 17 || mDrsState === 27) {
            return 'active';
        }

        return null;
    }

    /**
     * Is antilock currently doing it's thing?
     * @param {*} mAntiLockActive 
     * @returns boolean
     */
    async mAntiLockActiveDisplay(mAntiLockActive) {
        return display(mAntiLockActive);
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
        
        return display(mAntiLockSetting, 2);
    }

    /**
     * Get abs highlight
     * @param {*} mAntiLockActive 
     * @returns object
     */
    async mAntiLockHighlight(mAntiLockActive) {
        const mAntiLockHighlight = await this.getAntiLockHighlight(mAntiLockActive);

        return mAntiLockHighlight;
    }

    /**
     * Get abs highlight state
     * @param {*} active 
     * @returns 
     */
    async getAntiLockHighlight(mAntiLockActive) {
        if (mAntiLockActive) {
            return 2;
        }

        return null;
    }

    /**
     * Get boost active value prepared for the view
     * @param {*} mBoostActive 
     * @returns boolean
     */
    async mBoostActiveDisplay(mBoostActive) {
        return display(mBoostActive);
    }

    /**
     * Get boost amount preapred for the view
     * @param {*} mBoostAmount 
     * @returns number
     */
    async mBoostAmountDisplay(mBoostAmount) {
        return display(Math.round(mBoostAmount));
    }

    /**
     * Get rear brake bias value prepared for the view
     * @param {*} mBrakeBias 
     * @returns number
     */
    async mBrakeBiasDisplay(mBrakeBias) {
        return display(mBrakeBias);
    }

    /**
     * Get drs state prepared fro the view
     * @param {*} mDrsState 
     * @returns string
     */
    async mDrsStateDisplay(mDrsState) {
        return display(mDrsState);
    }

    /**
     * Get ers auto mode enabled prepared for the view
     * @param {*} mErsAutoModeEnabled 
     * @returns boolean
     */
    async mErsAutoModeEnabledDisplay(mErsAutoModeEnabled) {
        return display(mErsAutoModeEnabled);
    }

    /**
     * Get ers deployment mode preapred for the view
     * @param {*} mErsDeploymentMode 
     * @returns string
     */
    async mErsDeploymentModeDisplay(mErsDeploymentMode) {
        if (mErsDeploymentMode === 0) {
            return display('Auto');
        }

        if (mErsDeploymentMode === 1) {
            return display('Off');
        }

        if (mErsDeploymentMode === 2) {
            return display('Build');
        }

        if (mErsDeploymentMode === 3) {
            return display('Balanced');
        }

        if (mErsDeploymentMode === 4) {
            return display('Attack');
        }

        if (mErsDeploymentMode === 5) {
            return display('Qualify');
        }

        return null;
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
        
        return display(mTractionControlSetting, 2);
    }

    /**
     * Get tc highlight
     * @param {*} mThrottle 
     * @param {*} mUnfilteredThrottle 
     * @param {*} mGear 
     * @returns object
     */
    async mTractionControlHighlight(mThrottle, mUnfilteredThrottle, mGear) {
        const mTractionControlHighlight = await this.getTractionControlHighlight(mThrottle, mUnfilteredThrottle, mGear);

        return mTractionControlHighlight;
    }

    /**
     * Get tc highlight state
     * @param {*} active 
     * @returns 
     */
    async getTractionControlHighlight(mThrottle, mUnfilteredThrottle, mGear) {
        // If the raw input is being filtered by the game, we're assuming that's traction control in effect
        // throttle matches input?
        if (mThrottle === mUnfilteredThrottle) {
            // ... return null
            return null;
        }

        // ... we'll also assume auto-blip effects the above so we'll also say TC is working only when in gear
        // not in gear?
        if (!mGear) {
            // ... return null
            return null;
        }

        return 3; // 3 is green
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
        const mThrottleDisplay = await this.mThrottleDisplay(inputsData.mThrottle);

        return {
            mBrakeDisplay,
            mClutchDisplay,
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
        return display(`${Math.round(mBrake * 100)}`, 3);
    }

    /**
     * Get clutch input value prepared for the view
     * @param {*} mClutch 
     * @returns string
     */
    async mClutchDisplay(mClutch) {
        // ensuring its a string as no input (0) is a still a valid value
        return display(`${Math.round(mClutch * 100)}`, 3);
    }

    /**
     * Get throttle input value prepared for the view
     * @param {*} mThrottle 
     * @returns string
     */
    async mThrottleDisplay(mThrottle) {
        // ensuring its a string as no input (0) is a still a valid value
        return display(`${Math.round(mThrottle * 100)}`, 3);
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
        const mRpmDisplay = await this.mRpmDisplay(speedometerData.mRpm, speedometerData.mMaxRPM);
        const mRpmPercentage = await this.mRpmPercentage(speedometerData.mRpm, speedometerData.mMaxRPM);
        const mRpmHighlight = await this.mRpmHighlight(speedometerData.mRpm, speedometerData.mMaxRPM);
        const mGearDisplay = await this.mGearDisplay(speedometerData.mGear);

        return {
            mSpeedDisplay,
            mRpmDisplay,
            mRpmPercentage,
            mRpmHighlight,
            mGearDisplay,
        };
    }

    /**
     * Get speed prepared for the view
     * @param {*} mSpeed 
     * @returns number
     */
    async mSpeedDisplay(mSpeed) {
        let value = Math.floor(mSpeed * 3.6);

        return display(value, 3, 'KPH');
    }

    /**
     * Get rpm prepared for the view
     * @param {*} mRpm 
     * @param {*} mMaxRPM 
     * @returns number
     */
    async mRpmDisplay(mRpm, mMaxRPM) {
        return display(Math.round(mRpm), `${mMaxRPM}`.length);
    }

    /**
     * Get current rpm as a percentage 0-100
     * @param {*} mRpm 
     * @param {*} mMaxRPM 
     * @returns number
     */
    async mRpmPercentage(mRpm, mMaxRPM) {
        return display(Math.round((mRpm / mMaxRPM) * 100));
    }

    /**
     * Get rpm highlight
     * @param {*} mRpm
     * @param {*} mMaxRPM
     * @returns object
     */
    async mRpmHighlight(mRpm, mMaxRPM) {
        const mRpmHighlight = await this.getRpmHighlight(mRpm, mMaxRPM);

        return mRpmHighlight;
    }

    /**
     * Get rpm highlight state
     * @param {*} mRpmPercentage
     * @returns 
     */
    async getRpmHighlight(mRpm, mMaxRPM) {
        const percent = (mRpm / mMaxRPM) * 100;

        if (percent >= 97) {
            return 1;
        }

        return null;
    }

    /**
     * Get current gear
     * @param {*} mGear 
     * @returns number
     */
    async mGearDisplay(mGear) {
        let value = mGear;
        if (mGear === 0) {
            value = 'N';
        }

        if (mGear < 0) {
            value = 'R';
        }

        return display(value);
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
