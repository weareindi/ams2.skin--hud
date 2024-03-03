import ParentWorker from './ParentWorker.js?worker';
import { ref, watch } from 'vue';
import localforage from 'localforage';

export default class ParentWorkerMainThread {
    install(app) {
        this.app = app;
        this.init();
    }

    /**
     * Let's get it on
     */
    async init() {
        try {
            await this.startWorker();
        } catch (error) {
            console.error(error);
        }
    }

    /**
     * Making the magic happen
     */
    async startWorker() {
        await this.provideRefs();
        await this.registerConfig();
        await this.registerConfigWatch();
        await this.createWorker();
        await this.registerListeners();
        await this.create();
    }

    /**
     * Lets make this data available to the rest of the app via the 'provide/inject' vue utils
     * .. keeping the data dry so our views can literally take what we provide it here and render
     * .. no extra work or searching within objects
     */
    async provideRefs() {
        // settings vars
        this.app.provide('configExternalCrest', ref(null));
        this.app.provide('configIp', ref(null));
        this.app.provide('configPort', ref(null));
        this.app.provide('configTickRate', ref(null));
        // this.app.provide('configEnabledMainDisplay', ref(null));
        this.app.provide('configActiveMainDisplay', ref(null));
        this.app.provide('configEnabledStreamDisplay', ref(null));
        this.app.provide('configActiveStreamDisplay', ref(null));
        this.app.provide('configStartVisible', ref(null));
        this.app.provide('configDebug', ref(null));
        this.app.provide('isConnected', ref(null));
        this.app.provide('isSettingsOpen', ref(null));

        // game vars
        this.app.provide('mGameState', ref(null));
        this.app.provide('mSessionState', ref(null));
        this.app.provide('mSessionIsPrivate', ref(null));
        this.app.provide('mRaceState', ref(null));

        this.app.provide('mOilTempCelsiusDisplay', ref(null));
        this.app.provide('mWaterTempCelsiusDisplay', ref(null));
        this.app.provide('mAntiLockActiveDisplay', ref(null));
        this.app.provide('mAntiLockSettingDisplay', ref(null));
        this.app.provide('mAntiLockHighlight', ref(null));

        this.app.provide('mBoostActiveDisplay', ref(null));
        this.app.provide('mBoostAmountDisplay', ref(null));
        this.app.provide('mBrakeBiasDisplay', ref(null));
        this.app.provide('mDrsStateDisplay', ref(null));
        this.app.provide('mDrsStatus', ref(null));
        this.app.provide('mDrsHighlight', ref(null));

        this.app.provide('mErsAutoModeEnabledDisplay', ref(null));
        this.app.provide('mErsDeploymentModeDisplay', ref(null));
        this.app.provide('mErsStatus', ref(null));
        this.app.provide('mErsHighlight', ref(null));

        this.app.provide('mTractionControlSettingDisplay', ref(null));
        this.app.provide('mTractionControlHighlight', ref(null));

        this.app.provide('mClutchDisplay', ref(null));
        this.app.provide('mBrakeDisplay', ref(null));
        this.app.provide('mThrottleDisplay', ref(null));

        this.app.provide('mClutchOverheatedDisplay', ref(null));
        this.app.provide('mClutchSlippingDisplay', ref(null));
        this.app.provide('mClutchTempDisplay', ref(null));
        this.app.provide('mClutchWearDisplay', ref(null));
        this.app.provide('mClutchStatus', ref(null));
        this.app.provide('mClutchHighlight', ref(null));

        this.app.provide('standingsDisplay', ref(null));

        this.app.provide('mCurrentLapDisplay', ref(null));
        this.app.provide('mLapsInEventDisplay', ref(null));
        this.app.provide('mRacePositionDisplay', ref(null));
        this.app.provide('mNumParticipantsDisplay', ref(null));
        this.app.provide('mEventTimeRemainingDisplay', ref(null));
        this.app.provide('mFastestLapTimesDisplay', ref(null));
        this.app.provide('mLastLapTimesDisplay', ref(null));
        this.app.provide('mSessionAdditionalLapsDisplay', ref(null));

        this.app.provide('fuelCapacityDisplay', ref(null));
        this.app.provide('fuelDisplay', ref(null));
        this.app.provide('fuelPerLapDisplay', ref(null));
        this.app.provide('fuelToEndSessionDisplay', ref(null));
        this.app.provide('pitsToEndSessionDisplay', ref(null));

        this.app.provide('mSpeedDisplay', ref(null));
        this.app.provide('mGearDisplay', ref(null));
        this.app.provide('mRpmDisplay', ref(null));
        this.app.provide('mRpmPercentage', ref(null));
        this.app.provide('mRpmHighlight', ref(null));

        this.app.provide('mAirPressureFrontLeftDisplay', ref(null));
        this.app.provide('mAirPressureFrontRightDisplay', ref(null));
        this.app.provide('mAirPressureRearLeftDisplay', ref(null));
        this.app.provide('mAirPressureRearRightDisplay', ref(null));

        this.app.provide('mBrakeDamageFrontLeftDisplay', ref(null));
        this.app.provide('mBrakeDamageFrontRightDisplay', ref(null));
        this.app.provide('mBrakeDamageRearLeftDisplay', ref(null));
        this.app.provide('mBrakeDamageRearRightDisplay', ref(null));

        this.app.provide('mBrakeTempCelsiusFrontLeftDisplay', ref(null));
        this.app.provide('mBrakeTempCelsiusFrontRightDisplay', ref(null));
        this.app.provide('mBrakeTempCelsiusRearLeftDisplay', ref(null));
        this.app.provide('mBrakeTempCelsiusRearRightDisplay', ref(null));
        
        this.app.provide('mBrakeFrontLeftStatus', ref(null));
        this.app.provide('mBrakeFrontRightStatus', ref(null));
        this.app.provide('mBrakeRearLeftStatus', ref(null));
        this.app.provide('mBrakeRearRightStatus', ref(null));
        
        this.app.provide('mBrakeFrontLeftHighlight', ref(null));
        this.app.provide('mBrakeFrontRightHighlight', ref(null));
        this.app.provide('mBrakeRearLeftHighlight', ref(null));
        this.app.provide('mBrakeRearRightHighlight', ref(null));

        this.app.provide('mSuspensionDamageFrontLeftDisplay', ref(null));
        this.app.provide('mSuspensionDamageFrontRightDisplay', ref(null));
        this.app.provide('mSuspensionDamageRearLeftDisplay', ref(null));
        this.app.provide('mSuspensionDamageRearRightDisplay', ref(null));

        this.app.provide('mSuspensionFrontLeftStatus', ref(null));
        this.app.provide('mSuspensionFrontRightStatus', ref(null));
        this.app.provide('mSuspensionRearLeftStatus', ref(null));
        this.app.provide('mSuspensionRearRightStatus', ref(null));

        this.app.provide('mSuspensionFrontLeftHighlight', ref(null));
        this.app.provide('mSuspensionFrontRightHighlight', ref(null));
        this.app.provide('mSuspensionRearLeftHighlight', ref(null));
        this.app.provide('mSuspensionRearRightHighlight', ref(null));

        this.app.provide('mTyreCompoundFrontLeftDisplay', ref(null));
        this.app.provide('mTyreCompoundFrontRightDisplay', ref(null));
        this.app.provide('mTyreCompoundRearLeftDisplay', ref(null));
        this.app.provide('mTyreCompoundRearRightDisplay', ref(null));

        this.app.provide('mTyreTempFrontLeftDisplay', ref(null));
        this.app.provide('mTyreTempFrontRightDisplay', ref(null));
        this.app.provide('mTyreTempRearLeftDisplay', ref(null));
        this.app.provide('mTyreTempRearRightDisplay', ref(null));

        this.app.provide('mTyreWearFrontLeftDisplay', ref(null));
        this.app.provide('mTyreWearFrontRightDisplay', ref(null));
        this.app.provide('mTyreWearRearLeftDisplay', ref(null));
        this.app.provide('mTyreWearRearRightDisplay', ref(null));

        this.app.provide('mTyreFrontLeftStatus', ref(null));
        this.app.provide('mTyreFrontRightStatus', ref(null));
        this.app.provide('mTyreRearLeftStatus', ref(null));
        this.app.provide('mTyreRearRightStatus', ref(null));

        this.app.provide('mTyreFrontLeftHighlight', ref(null));
        this.app.provide('mTyreFrontRightHighlight', ref(null));
        this.app.provide('mTyreRearLeftHighlight', ref(null));
        this.app.provide('mTyreRearRightHighlight', ref(null));

        this.app.provide('mEngineDamageDisplay', ref(null));
        this.app.provide('mEngineStatus', ref(null));
        this.app.provide('mEngineHighlight', ref(null));

        this.app.provide('mAeroDamageDisplay', ref(null));
        this.app.provide('mAeroStatus', ref(null));
        this.app.provide('mAeroHighlight', ref(null));
    }

    /**
     * Create the initial config
     */
    async registerConfig() {
        // Inflate with exisiting data
        let config = await localforage.getItem('config');

        // ... no data stored?
        if (!config) {
            // ... create empty object
            config = {}
        }

        // set defaults if data doesnt exist
        if (!('configExternalCrest' in config)) { 
            config.configExternalCrest = false;
        }

        if (!('configIp' in config)) { 
            config.configIp = '127.0.0.1';
        }

        if (!('configPort' in config)) { 
            config.configPort = 8880;
        }
        
        if (!('configTickRate' in config)) { 
            config.configTickRate = 24;
        }

        // if (!('configEnabledMainDisplay' in config)) { 
        //     config.configEnabledMainDisplay = true;
        // }
        
        if (!('configActiveMainDisplay' in config)) { 
            config.configActiveMainDisplay = false;
        }

        if (!('configEnabledStreamDisplay' in config)) { 
            config.configEnabledStreamDisplay = false;
        }
        
        if (!('configActiveStreamDisplay' in config)) { 
            config.configActiveStreamDisplay = false;
        }

        if (!('configStartVisible' in config)) { 
            config.configStartVisible = true;
        }

        if (!('configDebug' in config)) { 
            config.configDebug = false;
        }

        // update reactive data with what we had stored
        this.app._context.provides.configExternalCrest.value = config.configExternalCrest;
        this.app._context.provides.configIp.value = config.configIp;
        this.app._context.provides.configPort.value = config.configPort;
        this.app._context.provides.configTickRate.value = config.configTickRate;
        // this.app._context.provides.configEnabledMainDisplay.value = config.configEnabledMainDisplay;
        this.app._context.provides.configActiveMainDisplay.value = config.configActiveMainDisplay;
        this.app._context.provides.configEnabledStreamDisplay.value = config.configEnabledStreamDisplay;
        this.app._context.provides.configActiveStreamDisplay.value = config.configActiveStreamDisplay;
        this.app._context.provides.configStartVisible.value = config.configStartVisible;
        this.app._context.provides.configDebug.value = config.configDebug;

        // update stored config for future use
        await localforage.setItem('config', config);
    }

    /**
     * Watch the config settings reactive values for changes.
     * Making is nice an easy to change values in the settings component (SettingsModalComponent.vue) and have them stored here
     */
    async registerConfigWatch() {
        let config = await localforage.getItem('config');

        watch([
            this.app._context.provides.configExternalCrest,
            this.app._context.provides.configIp,
            this.app._context.provides.configPort,
            this.app._context.provides.configTickRate,
            // this.app._context.provides.configEnabledMainDisplay,
            this.app._context.provides.configActiveMainDisplay,
            this.app._context.provides.configEnabledStreamDisplay,
            this.app._context.provides.configActiveStreamDisplay,
            this.app._context.provides.configStartVisible,
            this.app._context.provides.configDebug,
        ], async ([
            configExternalCrest,
            configIp,
            configPort,
            configTickRate,
            // configEnabledMainDisplay,
            configActiveMainDisplay,
            configEnabledStreamDisplay,
            configActiveStreamDisplay,
            configStartVisible,
            configDebug,
        ], [
            prevConfigExternalCrest,
            prevConfigIp,
            prevConfigPort,
            prevConfigTickRate,
            // prevConfigEnabledMainDisplay,
            prevConfigActiveMainDisplay,
            prevConfigEnabledStreamDisplay,
            prevConfigActiveStreamDisplay,
            prevConfigStartVisible,
            prevConfigDebug,
        ]) => {
            // get watched vars
            config.configExternalCrest = configExternalCrest;
            config.configIp = configIp;
            config.configPort = configPort;
            config.configTickRate = configTickRate;
            // config.configEnabledMainDisplay = configEnabledMainDisplay;
            config.configActiveMainDisplay = configActiveMainDisplay;
            config.configEnabledStreamDisplay = configEnabledStreamDisplay;
            config.configActiveStreamDisplay = configActiveStreamDisplay;
            config.configStartVisible = configStartVisible;
            config.configDebug = configDebug;

            // update stored config
            await localforage.setItem('config', config);

            // update config in workers
            await this.updateConfig();

            // toggle crest if required
            if (configExternalCrest !== prevConfigExternalCrest) {
                await this.toggleCrest();
            }

            // toggle stream window
            if (configEnabledStreamDisplay !== prevConfigEnabledStreamDisplay) {
                await this.toggleStreamDisplay();
            }
        });
    }

    /**
     * Toggle the opening/closing of crest
     */
    async toggleCrest() {
        if (!this.app._context.provides.configExternalCrest.value) {
            return await electron.ipcRenderer.invoke('openCrest');
        }

        return await electron.ipcRenderer.invoke('closeCrest');
    }

    /**
     * Toggle the opening/closing of stream window
     */
    async toggleStreamDisplay() {
        if (!this.app._context.provides.configEnabledStreamDisplay.value) {
            return await electron.ipcRenderer.invoke('exitStreamWindow');
        }

        return await electron.ipcRenderer.invoke('createStreamWindow');
    }

    /**
     * Create the parent worker
     */
    async createWorker() {
        return this.worker = new ParentWorker();
    }

    /**
     * Listen for messages from parent worker
     */
    async registerListeners() {
        return this.worker.onmessage = async (event) => {
            if (typeof event.data === 'undefined') {
                return console.error('No message supplied');
            }

            if (event.data.name === 'createcomplete') {
                await this.updateConfig();
                await this.toggleCrest();
            }

            if (event.data.name === 'updateconfigcomplete') {
                await this.start();
            }

            if (event.data.name === 'update-connectedstate') {
                await this.updateConnectedState(event.data.data);
                // await this.toStream(event.data.data);
            }

            if (event.data.name === 'update-gamestates') {
                await this.updateGlobalVars(event.data.data);
                await this.toStream(event.data.data);
            }

            if (event.data.name === 'updateview-dashdata') {
                await this.updateGlobalVars(event.data.data);
                await this.toStream(event.data.data);
            }

            if (event.data.name === 'updateview-lapdata') {
                await this.updateGlobalVars(event.data.data);
                await this.toStream(event.data.data);
            }

            if (event.data.name === 'updateview-standingsdata') {
                await this.updateGlobalVars(event.data.data);
                await this.toStream(event.data.data);
            }

            if (event.data.name === 'updateview-carstatedata') {
                await this.updateGlobalVars(event.data.data);
                await this.toStream(event.data.data);
            }

            if (event.data.name === 'reset') {
                await this.resetGameVars();
            }

            if (event.data.name === 'dump') {
                await this.dump(event.data.data);
            }
        };
    }

    /**
     * Send data to stream window
     * @param {*} data 
     */
    async toStream(data) {
        await electron.ipcRenderer.invoke('toStream', data);
    }

    /**
     * Send data back to main process/electron
     * @param {*} data 
     */
    async dump(data) {
        // check we have debug enabled
        let config = await localforage.getItem('config');

        if (!('debug' in config)) { 
            return null;
        }

        if (config.debug !== true) { 
            return null;
        }

        // if we got here, send send data back to main process
        await electron.ipcRenderer.invoke('dump', data);
    }

    /**
     * Update connected state reactive value
     * @param {*} state 
     */
    async updateConnectedState(state) {
        this.app._context.provides.isConnected.value = state;
    }

    /**
     * Any data that comes back from the workers gets pushed into our prepared refs here
     * @param {*} data 
     */
    async updateGlobalVars(data) {
        // reset the reset toggle so we can re-reset the next time we need to (ie. when we're no longer at a circuit and back in the main menu)
        this.hasreset = false;

        // loop through provided data
        for (const key in data) {
            // note: remember were using vue 'ref' for data handling.
            // ref adds the 'value' attribute to the provide which we're updating here
            this.app._context.provides[key].value = data[key];
        }
    }

    /**
     * Reset all game based reactive values
     */
    async resetGameVars() {
        // already reset recently? Let's bail
        if (this.hasreset) {
            return;
        }

        // lets be dry and declarative about what we want reset
        this.app._context.provides.mGameState.value = null;
        this.app._context.provides.mSessionState.value = null;
        this.app._context.provides.mSessionIsPrivate.value = null;
        this.app._context.provides.mRaceState.value = null;    

        this.app._context.provides.mOilTempCelsiusDisplay.value = null;
        this.app._context.provides.mWaterTempCelsiusDisplay.value = null;

        this.app._context.provides.mAntiLockActiveDisplay.value = null;
        this.app._context.provides.mAntiLockSettingDisplay.value = null;
        this.app._context.provides.mAntiLockHighlight.value = null;

        this.app._context.provides.mBoostActiveDisplay.value = null;
        this.app._context.provides.mBoostAmountDisplay.value = null;
        this.app._context.provides.mBrakeBiasDisplay.value = null;

        this.app._context.provides.mDrsStateDisplay.value = null;
        this.app._context.provides.mDrsStatus.value = null;
        this.app._context.provides.mDrsHighlight.value = null;

        this.app._context.provides.mErsAutoModeEnabledDisplay.value = null;
        this.app._context.provides.mErsDeploymentModeDisplay.value = null;
        this.app._context.provides.mErsStatus.value = null;
        this.app._context.provides.mErsHighlight.value = null;

        this.app._context.provides.mTractionControlSettingDisplay.value = null;
        this.app._context.provides.mTractionControlHighlight.value = null;

        this.app._context.provides.mClutchDisplay.value = null;
        this.app._context.provides.mBrakeDisplay.value = null;
        this.app._context.provides.mThrottleDisplay.value = null;
        
        this.app._context.provides.mClutchOverheatedDisplay.value = null;
        this.app._context.provides.mClutchSlippingDisplay.value = null;
        this.app._context.provides.mClutchTempDisplay.value = null;
        this.app._context.provides.mClutchWearDisplay.value = null;
        this.app._context.provides.mClutchStatus.value = null;
        this.app._context.provides.mClutchHighlight.value = null;

        this.app._context.provides.standingsDisplay.value = null;

        this.app._context.provides.mCurrentLapDisplay.value = null;
        this.app._context.provides.mLapsInEventDisplay.value = null;
        this.app._context.provides.mRacePositionDisplay.value = null;
        this.app._context.provides.mNumParticipantsDisplay.value = null;
        this.app._context.provides.mEventTimeRemainingDisplay.value = null;
        this.app._context.provides.mFastestLapTimesDisplay.value = null;
        this.app._context.provides.mLastLapTimesDisplay.value = null;
        this.app._context.provides.mSessionAdditionalLapsDisplay.value = null;

        this.app._context.provides.fuelCapacityDisplay.value = null;
        this.app._context.provides.fuelDisplay.value = null;
        this.app._context.provides.fuelPerLapDisplay.value = null;
        this.app._context.provides.fuelToEndSessionDisplay.value = null;
        this.app._context.provides.pitsToEndSessionDisplay.value = null;

        this.app._context.provides.mSpeedDisplay.value = null;
        this.app._context.provides.mGearDisplay.value = null;
        this.app._context.provides.mRpmDisplay.value = null;
        this.app._context.provides.mRpmPercentage.value = null;
        this.app._context.provides.mRpmHighlight.value = null;        

        this.app._context.provides.mAirPressureFrontLeftDisplay.value = null;
        this.app._context.provides.mAirPressureFrontRightDisplay.value = null;
        this.app._context.provides.mAirPressureRearLeftDisplay.value = null;
        this.app._context.provides.mAirPressureRearRightDisplay.value = null;

        this.app._context.provides.mBrakeDamageFrontLeftDisplay.value = null;
        this.app._context.provides.mBrakeDamageFrontRightDisplay.value = null;
        this.app._context.provides.mBrakeDamageRearLeftDisplay.value = null;
        this.app._context.provides.mBrakeDamageRearRightDisplay.value = null;

        this.app._context.provides.mBrakeTempCelsiusFrontLeftDisplay.value = null;
        this.app._context.provides.mBrakeTempCelsiusFrontRightDisplay.value = null;
        this.app._context.provides.mBrakeTempCelsiusRearLeftDisplay.value = null;
        this.app._context.provides.mBrakeTempCelsiusRearRightDisplay.value = null;

        this.app._context.provides.mBrakeFrontLeftStatus.value = null;
        this.app._context.provides.mBrakeFrontRightStatus.value = null;
        this.app._context.provides.mBrakeRearLeftStatus.value = null;
        this.app._context.provides.mBrakeRearRightStatus.value = null;

        this.app._context.provides.mBrakeFrontLeftHighlight.value = null;
        this.app._context.provides.mBrakeFrontRightHighlight.value = null;
        this.app._context.provides.mBrakeRearLeftHighlight.value = null;
        this.app._context.provides.mBrakeRearRightHighlight.value = null;

        this.app._context.provides.mSuspensionDamageFrontLeftDisplay.value = null;
        this.app._context.provides.mSuspensionDamageFrontRightDisplay.value = null;
        this.app._context.provides.mSuspensionDamageRearLeftDisplay.value = null;
        this.app._context.provides.mSuspensionDamageRearRightDisplay.value = null;

        this.app._context.provides.mSuspensionFrontLeftStatus.value = null;
        this.app._context.provides.mSuspensionFrontRightStatus.value = null;
        this.app._context.provides.mSuspensionRearLeftStatus.value = null;
        this.app._context.provides.mSuspensionRearRightStatus.value = null;

        this.app._context.provides.mSuspensionFrontLeftHighlight.value = null;
        this.app._context.provides.mSuspensionFrontRightHighlight.value = null;
        this.app._context.provides.mSuspensionRearLeftHighlight.value = null;
        this.app._context.provides.mSuspensionRearRightHighlight.value = null;

        this.app._context.provides.mTyreCompoundFrontLeftDisplay.value = null;
        this.app._context.provides.mTyreCompoundFrontRightDisplay.value = null;
        this.app._context.provides.mTyreCompoundRearLeftDisplay.value = null;
        this.app._context.provides.mTyreCompoundRearRightDisplay.value = null;

        this.app._context.provides.mTyreTempFrontLeftDisplay.value = null;
        this.app._context.provides.mTyreTempFrontRightDisplay.value = null;
        this.app._context.provides.mTyreTempRearLeftDisplay.value = null;
        this.app._context.provides.mTyreTempRearRightDisplay.value = null;

        this.app._context.provides.mTyreWearFrontLeftDisplay.value = null;
        this.app._context.provides.mTyreWearFrontRightDisplay.value = null;
        this.app._context.provides.mTyreWearRearLeftDisplay.value = null;
        this.app._context.provides.mTyreWearRearRightDisplay.value = null;

        this.app._context.provides.mTyreFrontLeftStatus.value = null;
        this.app._context.provides.mTyreFrontRightStatus.value = null;
        this.app._context.provides.mTyreRearLeftStatus.value = null;
        this.app._context.provides.mTyreRearRightStatus.value = null;

        this.app._context.provides.mTyreFrontLeftHighlight.value = null;
        this.app._context.provides.mTyreFrontRightHighlight.value = null;
        this.app._context.provides.mTyreRearLeftHighlight.value = null;
        this.app._context.provides.mTyreRearRightHighlight.value = null;

        this.app._context.provides.mEngineDamageDisplay.value = null;
        this.app._context.provides.mEngineStatus.value = null;
        this.app._context.provides.mEngineHighlight.value = null;

        this.app._context.provides.mAeroDamageDisplay.value = null;
        this.app._context.provides.mAeroStatus.value = null;
        this.app._context.provides.mAeroHighlight.value = null;

        // update hasreset var
        this.hasreset = true;
    }

    /**
     * Send the create message
     */
    async create() {
        return await this.postMessage('create');
    }

    /**
     * Send the update config message
     */
    async updateConfig() {
        return await this.postMessage('updateconfig');
    }

    /**
     * Send the start message
     */
    async start() {
        return await this.postMessage('start');
    }

    /**
     * Easy method to send a message to parent worker with/without additional data
     * @param {*} name 
     * @param {*} data 
     */
    async postMessage(name, data = null) {
        if (!data) {
            return this.worker.postMessage({
                name
            });
        }

        return this.worker.postMessage({
            name,
            data
        });
    }
}
