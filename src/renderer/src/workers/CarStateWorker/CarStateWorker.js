import { display } from "../../utils/DataUtils";

class CarStateWorker {
    constructor() {
        this.init();
    }

    /**
     * Let's get to work
     */
    async init() {
        try {
            await this.registerListeners();
        } catch (error) {
            console.error(error);
        }
    }

    /**
     * Register listeners for messages from parent worker
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
     * Check and process data provided by the parent worker
     * @param {*} data 
     * @returns object
     */
    async prepareData(data) {
        if (!('mAeroDamage' in data)) {
            return null;
        }

        if (!('mOilTempCelsius' in data)) {
            return null;
        }

        if (!('mWaterTempCelsius' in data)) {
            return null;
        }

        if (!('mEngineDamage' in data)) {
            return null;
        }

        if (!('mTyreTemp' in data)) {
            return null;
        }

        if (!('mTyreWear' in data)) {
            return null;
        }

        if (!('mBrakeDamage' in data)) {
            return null;
        }

        if (!('mSuspensionDamage' in data)) {
            return null;
        }

        if (!('mBrakeTempCelsius' in data)) {
            return null;
        }

        if (!('mAirPressure' in data)) {
            return null;
        }

        if (!('mTyreCompound' in data)) {
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

        const tyreData = await this.getTyreData(data);
        const tyreDataDisplay = await this.getTyreDataForDisplay(tyreData);
        
        const brakeData = await this.getBrakeData(data);
        const brakeDataDisplay = await this.getBrakeDataForDisplay(brakeData);

        const suspensionData = await this.getSuspensionData(data);
        const suspensionDataDisplay = await this.getSuspensionDataForDisplay(suspensionData);

        const engineData = await this.getEngineData(data);
        const engineDataDisplay = await this.getEngineDataForDisplay(engineData);

        const clutchData = await this.getClutchData(data);
        const clutchDataDisplay = await this.getClutchDataForDisplay(clutchData);

        const aeroData = await this.getAeroData(data);
        const aeroDataDisplay = await this.getAeroDataForDisplay(aeroData);

        return {...tyreDataDisplay, ...brakeDataDisplay, ...suspensionDataDisplay, ...engineDataDisplay, ...clutchDataDisplay, ...aeroDataDisplay}
    }

    /**
     * Get tyre data
     * @param {*} data 
     * @returns object
     */
    async getTyreData(data) {
        return {
            mAirPressure: data.mAirPressure,
            mTyreCompound: data.mTyreCompound,
            mTyreTemp: data.mTyreTemp,
            mTyreWear: data.mTyreWear,
        };
    }

    /**
     * Get tyre data prepared for the view
     * @param {*} tyreData 
     * @returns object
     */
    async getTyreDataForDisplay(tyreData) {
        const { mAirPressureFrontLeftDisplay, mAirPressureFrontRightDisplay, mAirPressureRearLeftDisplay, mAirPressureRearRightDisplay } = await this.mAirPressureDisplay(tyreData.mAirPressure);
        const { mTyreCompoundFrontLeftDisplay, mTyreCompoundFrontRightDisplay, mTyreCompoundRearLeftDisplay, mTyreCompoundRearRightDisplay } = await this.mTyreCompoundDisplay(tyreData.mTyreCompound);
        const { mTyreTempFrontLeftDisplay, mTyreTempFrontRightDisplay, mTyreTempRearLeftDisplay, mTyreTempRearRightDisplay } = await this.mTyreTempDisplay(tyreData.mTyreTemp);
        const { mTyreWearFrontLeftDisplay, mTyreWearFrontRightDisplay, mTyreWearRearLeftDisplay, mTyreWearRearRightDisplay } = await this.mTyreWearDisplay(tyreData.mTyreWear);
        const { mTyreFrontLeftStatus, mTyreFrontRightStatus, mTyreRearLeftStatus, mTyreRearRightStatus } = await this.mTyreStatus(tyreData.mTyreWear);
        const { mTyreFrontLeftHighlight, mTyreFrontRightHighlight, mTyreRearLeftHighlight, mTyreRearRightHighlight } = await this.mTyreHighlight(tyreData.mTyreWear, tyreData.mTyreTemp);
        

        return {
            mAirPressureFrontLeftDisplay,
            mAirPressureFrontRightDisplay,
            mAirPressureRearLeftDisplay,
            mAirPressureRearRightDisplay,

            mTyreCompoundFrontLeftDisplay,
            mTyreCompoundFrontRightDisplay,
            mTyreCompoundRearLeftDisplay,
            mTyreCompoundRearRightDisplay,

            mTyreTempFrontLeftDisplay,
            mTyreTempFrontRightDisplay,
            mTyreTempRearLeftDisplay,
            mTyreTempRearRightDisplay,

            mTyreWearFrontLeftDisplay,
            mTyreWearFrontRightDisplay,
            mTyreWearRearLeftDisplay,
            mTyreWearRearRightDisplay,

            mTyreFrontLeftStatus,
            mTyreFrontRightStatus,
            mTyreRearLeftStatus,
            mTyreRearRightStatus,

            mTyreFrontLeftHighlight,
            mTyreFrontRightHighlight,
            mTyreRearLeftHighlight,
            mTyreRearRightHighlight,
        };
    }

    /**
     * Get air (tyre) pressures preapred for the view
     * @param {*} mAirPressure 
     * @returns object
     */
    async mAirPressureDisplay(mAirPressure) {
        const mAirPressureFrontLeftDisplay = `${Math.round(mAirPressure[0])}`;
        const mAirPressureFrontRightDisplay = `${Math.round(mAirPressure[1])}`;
        const mAirPressureRearLeftDisplay = `${Math.round(mAirPressure[2])}`;
        const mAirPressureRearRightDisplay = `${Math.round(mAirPressure[3])}`;

        return {
            mAirPressureFrontLeftDisplay: display(mAirPressureFrontLeftDisplay, 3, ' bar'),
            mAirPressureFrontRightDisplay: display(mAirPressureFrontRightDisplay, 3, ' bar'),
            mAirPressureRearLeftDisplay: display(mAirPressureRearLeftDisplay, 3, ' bar'),
            mAirPressureRearRightDisplay: display(mAirPressureRearRightDisplay, 3, ' bar')
        }
    }

    /**
     * Get tyre compound prepared for the view
     * @param {*} mTyreCompound 
     * @returns object
     */
    async mTyreCompoundDisplay(mTyreCompound) {
        const mTyreCompoundFrontLeftDisplay = await this.getTyreCompoundDisplay(mTyreCompound[0]);
        const mTyreCompoundFrontRightDisplay = await this.getTyreCompoundDisplay(mTyreCompound[1]);
        const mTyreCompoundRearLeftDisplay = await this.getTyreCompoundDisplay(mTyreCompound[2]);
        const mTyreCompoundRearRightDisplay = await this.getTyreCompoundDisplay(mTyreCompound[3]);

        return {
            mTyreCompoundFrontLeftDisplay: display(mTyreCompoundFrontLeftDisplay),
            mTyreCompoundFrontRightDisplay: display(mTyreCompoundFrontRightDisplay),
            mTyreCompoundRearLeftDisplay: display(mTyreCompoundRearLeftDisplay),
            mTyreCompoundRearRightDisplay: display(mTyreCompoundRearRightDisplay)
        }
    }

    /**
     * Get tyre compound initial from tyre compound
     * @param {*} mTyreCompound 
     * @returns string
     */
    async getTyreCompoundDisplay(mTyreCompound) {
        // return first character of first word in compound name
        return mTyreCompound[0];
    }

    /**
     * Get tyre temps prepared for the view
     * @param {*} mTyreTemp 
     * @returns object
     */
    async mTyreTempDisplay(mTyreTemp) {
        const mTyreTempFrontLeftDisplay = `${Math.floor(mTyreTemp[0])}`;
        const mTyreTempFrontRightDisplay = `${Math.floor(mTyreTemp[1])}`;
        const mTyreTempRearLeftDisplay = `${Math.floor(mTyreTemp[2])}`;
        const mTyreTempRearRightDisplay = `${Math.floor(mTyreTemp[3])}`;

        return {
            mTyreTempFrontLeftDisplay: display(mTyreTempFrontLeftDisplay, 3, '°'),
            mTyreTempFrontRightDisplay: display(mTyreTempFrontRightDisplay, 3, '°'),
            mTyreTempRearLeftDisplay: display(mTyreTempRearLeftDisplay, 3, '°'),
            mTyreTempRearRightDisplay: display(mTyreTempRearRightDisplay, 3, '°')
        }
    }

    /**
     * Get tyre wear prepared for display
     * @param {*} mTyreWear 
     * @returns object
     */
    async mTyreWearDisplay(mTyreWear) {
        // ... strange equation right? "100 - (2 * mTyreWear) * 100"?
        // The default UI in the game show tyres wear from 0% - 50% damage represented as 100% to 0% in game.
        // ... so when the tyre life reaches zero in the games UI, it still has another 50% to go as far as the internal engine is concerned
        // I've copied that philosophy

        let mTyreWearFrontLeftDisplay = Math.round((2 * mTyreWear[0]) * 100);
        if (mTyreWearFrontLeftDisplay >= 100) {
            mTyreWearFrontLeftDisplay = `100`;
        }

        let mTyreWearFrontRightDisplay = Math.round((2 * mTyreWear[1]) * 100);
        if (mTyreWearFrontRightDisplay >= 100) {
            mTyreWearFrontRightDisplay = `100`;
        }

        let mTyreWearRearLeftDisplay = Math.round((2 * mTyreWear[2]) * 100);
        if (mTyreWearRearLeftDisplay >= 100) {
            mTyreWearRearLeftDisplay = `100`;
        }

        let mTyreWearRearRightDisplay = Math.round((2 * mTyreWear[3]) * 100);
        if (mTyreWearRearRightDisplay >= 100) {
            mTyreWearRearRightDisplay = `100`;
        }

        return {
            mTyreWearFrontLeftDisplay: display(mTyreWearFrontLeftDisplay, 3, '%'),
            mTyreWearFrontRightDisplay: display(mTyreWearFrontRightDisplay, 3, '%'),
            mTyreWearRearLeftDisplay: display(mTyreWearRearLeftDisplay, 3, '%'),
            mTyreWearRearRightDisplay: display(mTyreWearRearRightDisplay, 3, '%')
        }
    }

    /**
     * Get tyre status
     * @param {*} mTyreWear 
     * @returns object
     */
    async mTyreStatus(mTyreWear) {
        const mTyreFrontLeftStatus = await this.getTyreStatus(mTyreWear[0]);
        const mTyreFrontRightStatus = await this.getTyreStatus(mTyreWear[1]);
        const mTyreRearLeftStatus = await this.getTyreStatus(mTyreWear[2]);
        const mTyreRearRightStatus = await this.getTyreStatus(mTyreWear[3]);

        return {
            mTyreFrontLeftStatus,
            mTyreFrontRightStatus,
            mTyreRearLeftStatus,
            mTyreRearRightStatus,
        };
    }

    /**
     * Get tyre status based on current wear
     * @param {*} wear 
     * @returns 
     */
    async getTyreStatus(wear) {
        if (wear >= 0.1) {
            return 1;
        }

        if (wear >= 0.25) {
            return 2;
        }

        if (wear >= 0.5) {
            return 3;
        }

        if (wear >= 1) {
            return 4;
        }

        return null;
    }

    /**
     * Get tyre highlight
     * @param {*} mTyreWear
     * @param {*} mTyreTemp
     * @returns object
     */
    async mTyreHighlight(mTyreWear, mTyreTemp) {
        const mTyreFrontLeftHighlight = await this.getTyreHighlight(mTyreWear[0], mTyreTemp[0]);
        const mTyreFrontRightHighlight = await this.getTyreHighlight(mTyreWear[1], mTyreTemp[1]);
        const mTyreRearLeftHighlight = await this.getTyreHighlight(mTyreWear[2], mTyreTemp[2]);
        const mTyreRearRightHighlight = await this.getTyreHighlight(mTyreWear[3], mTyreTemp[3]);

        return {
            mTyreFrontLeftHighlight,
            mTyreFrontRightHighlight,
            mTyreRearLeftHighlight,
            mTyreRearRightHighlight,
        };
    }

    /**
     * Get tyre highlight based on current wear
     * @param {*} wear 
     * @param {*} temp 
     * @returns 
     */
    async getTyreHighlight(wear, temp) {
        if (wear >= 1) {
            return null;
        }

        if (temp >= 100) {
            return 1;
        }

        return null;
    }

    /**
     * Get brake data
     * @param {*} data 
     * @returns object
     */
    async getBrakeData(data) {
        return {
            mBrakeDamage: data.mBrakeDamage,
            mBrakeTempCelsius: data.mBrakeTempCelsius,
        };
    }

    /**
     * Get brake data prepared for display
     * @param {*} brakeData 
     * @returns object
     */
    async getBrakeDataForDisplay(brakeData) {
        const {
            mBrakeDamageFrontLeftDisplay,
            mBrakeDamageFrontRightDisplay,
            mBrakeDamageRearLeftDisplay,
            mBrakeDamageRearRightDisplay
        } = await this.mBrakeDamageDisplay(brakeData.mBrakeDamage);

        const {
            mBrakeTempCelsiusFrontLeftDisplay,
            mBrakeTempCelsiusFrontRightDisplay,
            mBrakeTempCelsiusRearLeftDisplay,
            mBrakeTempCelsiusRearRightDisplay
        } = await this.mBrakeTempCelsiusDisplay(brakeData.mBrakeTempCelsius);

        const {
            mBrakeFrontLeftStatus,
            mBrakeFrontRightStatus,
            mBrakeRearLeftStatus,
            mBrakeRearRightStatus
        } = await this.mBrakeStatus(brakeData.mBrakeDamage, brakeData.mBrakeTempCelsius);

        return {
            mBrakeDamageFrontLeftDisplay,
            mBrakeDamageFrontRightDisplay,
            mBrakeDamageRearLeftDisplay,
            mBrakeDamageRearRightDisplay,

            mBrakeTempCelsiusFrontLeftDisplay,
            mBrakeTempCelsiusFrontRightDisplay,
            mBrakeTempCelsiusRearLeftDisplay,
            mBrakeTempCelsiusRearRightDisplay,
            
            mBrakeFrontLeftStatus,
            mBrakeFrontRightStatus,
            mBrakeRearLeftStatus,
            mBrakeRearRightStatus,
        };
    }

    /**
     * Get brage damage prepared for the view
     * @param {*} mBrakeDamage 
     * @returns object
     */
    async mBrakeDamageDisplay(mBrakeDamage) {
        // cast to string as 0 is still a valid number we want to display
        const mBrakeDamageFrontLeftDisplay = `${Math.round(mBrakeDamage[0] * 100)}`;
        const mBrakeDamageFrontRightDisplay = `${Math.round(mBrakeDamage[1] * 100)}`;
        const mBrakeDamageRearLeftDisplay = `${Math.round(mBrakeDamage[2] * 100)}`;
        const mBrakeDamageRearRightDisplay = `${Math.round(mBrakeDamage[3] * 100)}`;

        return {
            mBrakeDamageFrontLeftDisplay: display(mBrakeDamageFrontLeftDisplay, 3, '%'),
            mBrakeDamageFrontRightDisplay: display(mBrakeDamageFrontRightDisplay, 3, '%'),
            mBrakeDamageRearLeftDisplay: display(mBrakeDamageRearLeftDisplay, 3, '%'),
            mBrakeDamageRearRightDisplay: display(mBrakeDamageRearRightDisplay, 3, '%')
        }
    }

    /**
     * Get brake temps prepared for the view
     * @param {*} mBrakeTempCelsius 
     * @returns object
     */
    async mBrakeTempCelsiusDisplay(mBrakeTempCelsius) {
        const mBrakeTempCelsiusFrontLeftDisplay = Math.floor(mBrakeTempCelsius[0]);
        const mBrakeTempCelsiusFrontRightDisplay = Math.floor(mBrakeTempCelsius[1]);
        const mBrakeTempCelsiusRearLeftDisplay = Math.floor(mBrakeTempCelsius[2]);
        const mBrakeTempCelsiusRearRightDisplay = Math.floor(mBrakeTempCelsius[3]);

        return {
            mBrakeTempCelsiusFrontLeftDisplay: display(mBrakeTempCelsiusFrontLeftDisplay, 4, '°'),
            mBrakeTempCelsiusFrontRightDisplay: display(mBrakeTempCelsiusFrontRightDisplay, 4, '°'),
            mBrakeTempCelsiusRearLeftDisplay: display(mBrakeTempCelsiusRearLeftDisplay, 4, '°'),
            mBrakeTempCelsiusRearRightDisplay: display(mBrakeTempCelsiusRearRightDisplay, 4, '°')
        }
    }

    /**
     * Get suspension status
     * @param {*} mBrakeDamage 
     * @param {*} mBrakeTempCelsius 
     * @returns object
     */
    async mBrakeStatus(mBrakeDamage, mBrakeTempCelsius) {
        const mBrakeFrontLeftStatus = await this.getBrakeStatus(mBrakeDamage[0], mBrakeTempCelsius[0]);
        const mBrakeFrontRightStatus = await this.getBrakeStatus(mBrakeDamage[1], mBrakeTempCelsius[1]);
        const mBrakeRearLeftStatus = await this.getBrakeStatus(mBrakeDamage[2], mBrakeTempCelsius[2]);
        const mBrakeRearRightStatus = await this.getBrakeStatus(mBrakeDamage[3], mBrakeTempCelsius[3]);

        return {
            mBrakeFrontLeftStatus,
            mBrakeFrontRightStatus,
            mBrakeRearLeftStatus,
            mBrakeRearRightStatus,
        };
    }

    /**
     * Get brake status based on current damage and temperature values
     * @param {*} damage 
     * @param {*} temperature 
     * @returns 
     */
    async getBrakeStatus(damage, temperature) {
        if (damage >= 0) {
            return 1;
        }

        if (damage >= 0.25) {
            return 2;
        }

        if (damage >= 0.5) {
            return 3;
        }

        if (damage >= 1) {
            return 4;
        }

        return null;
    }

    /**
     * Get suspension data
     * @param {*} data 
     * @returns object
     */
    async getSuspensionData(data) {
        return {
            mSuspensionDamage: data.mSuspensionDamage,
        };
    }

    /**
     * Get suspension data prepared for display
     * @param {*} suspensionData 
     * @returns object
     */
    async getSuspensionDataForDisplay(suspensionData) {
        const { mSuspensionDamageFrontLeftDisplay, mSuspensionDamageFrontRightDisplay, mSuspensionDamageRearLeftDisplay, mSuspensionDamageRearRightDisplay } = await this.mSuspensionDamageDisplay(suspensionData.mSuspensionDamage);
        const { mSuspensionFrontLeftStatus, mSuspensionFrontRightStatus, mSuspensionRearLeftStatus, mSuspensionRearRightStatus } = await this.mSuspensionStatus(suspensionData.mSuspensionDamage);

        return {
            mSuspensionDamageFrontLeftDisplay,
            mSuspensionDamageFrontRightDisplay,
            mSuspensionDamageRearLeftDisplay,
            mSuspensionDamageRearRightDisplay,
            mSuspensionFrontLeftStatus,
            mSuspensionFrontRightStatus,
            mSuspensionRearLeftStatus,
            mSuspensionRearRightStatus,
        };
    }

    /**
     * Get suspension damage data prepared for display
     * @param {*} mSuspensionDamage 
     * @returns object
     */
    async mSuspensionDamageDisplay(mSuspensionDamage) {
        const mSuspensionDamageFrontLeftDisplay = `${Math.round(mSuspensionDamage[0] * 100)}`;
        const mSuspensionDamageFrontRightDisplay = `${Math.round(mSuspensionDamage[1] * 100)}`;
        const mSuspensionDamageRearLeftDisplay = `${Math.round(mSuspensionDamage[2] * 100)}`;
        const mSuspensionDamageRearRightDisplay = `${Math.round(mSuspensionDamage[3] * 100)}`;

        return {
            mSuspensionDamageFrontLeftDisplay: display(mSuspensionDamageFrontLeftDisplay, 3, '%'),
            mSuspensionDamageFrontRightDisplay: display(mSuspensionDamageFrontRightDisplay, 3, '%'),
            mSuspensionDamageRearLeftDisplay: display(mSuspensionDamageRearLeftDisplay, 3, '%'),
            mSuspensionDamageRearRightDisplay: display(mSuspensionDamageRearRightDisplay, 3, '%')
        }
    }

    /**
     * Get suspension status
     * @param {*} mSuspensionDamage 
     * @returns object
     */
    async mSuspensionStatus(mSuspensionDamage) {
        const mSuspensionFrontLeftStatus = await this.getSuspensionStatus(mSuspensionDamage[0]);
        const mSuspensionFrontRightStatus = await this.getSuspensionStatus(mSuspensionDamage[1]);
        const mSuspensionRearLeftStatus = await this.getSuspensionStatus(mSuspensionDamage[2]);
        const mSuspensionRearRightStatus = await this.getSuspensionStatus(mSuspensionDamage[3]);

        return {
            mSuspensionFrontLeftStatus,
            mSuspensionFrontRightStatus,
            mSuspensionRearLeftStatus,
            mSuspensionRearRightStatus,
        };
    }

    /**
     * Get suspension status based on current damage value
     * @param {*} damage 
     * @returns 
     */
    async getSuspensionStatus(damage) {
        if (damage >= 0) {
            return 1;
        }

        if (damage >= 0.25) {
            return 2;
        }

        if (damage >= 0.5) {
            return 3;
        }

        if (damage >= 1) {
            return 4;
        }

        return null;
    }

    /**
     * Get engine data
     * @param {*} data 
     * @returns object
     */
    async getEngineData(data) {
        return {
            mWaterTempCelsius: data.mWaterTempCelsius,
            mOilTempCelsius: data.mOilTempCelsius,
            mEngineDamage: data.mEngineDamage,
        };
    }

    /**
     * Get engine data prepared for the view
     * @param {*} engineData 
     * @returns object
     */
    async getEngineDataForDisplay(engineData) {
        const mWaterTempCelsiusDisplay = await this.mWaterTempCelsiusDisplay(engineData.mWaterTempCelsius);
        const mOilTempCelsiusDisplay = await this.mOilTempCelsiusDisplay(engineData.mOilTempCelsius);
        const mEngineDamageDisplay = await this.mEngineDamageDisplay(engineData.mEngineDamage);
        const mEngineStatus = await this.mEngineStatus(engineData.mEngineDamage);
        const mEngineHighlight = await this.mEngineHighlight(engineData.mOilTempCelsius);

        return {
            mWaterTempCelsiusDisplay,
            mOilTempCelsiusDisplay,
            mEngineDamageDisplay,
            mEngineStatus,
            mEngineHighlight,
        };
    }

    /**
     * Get car water temp prepared for the view
     * @param {*} mWaterTempCelsius 
     * @returns number
     */
    async mWaterTempCelsiusDisplay(mWaterTempCelsius) {
        const mWaterTempCelsiusDisplay = Math.round(mWaterTempCelsius);

        return display(mWaterTempCelsiusDisplay, 3, '°');
    }

    /**
     * Get car oil temp prepared for the view
     * @param {*} mOilTempCelsius 
     * @returns number
     */
    async mOilTempCelsiusDisplay(mOilTempCelsius) {
        const mOilTempCelsiusDisplay = Math.round(mOilTempCelsius);

        return display(mOilTempCelsiusDisplay, 3, '°');
    }

    /**
     * Get engine damage data
     * @param {*} mEngineDamage 
     * @returns string
     */
    async mEngineDamageDisplay(mEngineDamage) {
        const mEngineDamageDisplay = `${Math.round(mEngineDamage * 100)}`;

        return display(mEngineDamageDisplay, 3, '%');
    }

    /**
     * Get engine status
     * @param {*} mEngineDamage 
     * @returns object
     */
    async mEngineStatus(mEngineDamage) {
        const mEngineStatus = await this.getEngineStatus(mEngineDamage);

        return mEngineStatus;
    }

    /**
     * Get engine status based on current damage value
     * @param {*} damage 
     * @returns 
     */
    async getEngineStatus( damage) {
        if (damage >= 0) {
            return 1;
        }

        if (damage >= 0.15) {
            return 2;
        }

        if (damage >= 0.2) {
            return 3;
        }

        if (damage >= 1) {
            return 4;
        }

        return null;
    }

    /**
     * Get engine highlight
     * @param {*} mOilTempCelsius 
     * @returns object
     */
    async mEngineHighlight(mOilTempCelsius) {
        const mEngineHighlight = await this.getEngineHighlight(mOilTempCelsius);

        return mEngineHighlight;
    }

    /**
     * Get engine status based on current damage value
     * @param {*} temperature 
     * @returns 
     */
    async getEngineHighlight(temperature) {
        if (temperature >= 126.6) {
            return 1;
        }

        return null;
    }

    /**
     * Get clutch data
     * @param {*} data 
     * @returns object
     */
    async getClutchData(data) {
        return {
            mClutchOverheated: data.mClutchOverheated,
            mClutchSlipping: data.mClutchSlipping,
            mClutchTemp: data.mClutchTemp,
            mClutchWear: data.mClutchWear,
        };
    }

    /**
     * Get clutch data prepared for the view
     * @param {*} clutchData 
     * @returns object
     */
    async getClutchDataForDisplay(clutchData) {
        const mClutchOverheatedDisplay = await this.mClutchOverheatedDisplay(clutchData.mClutchOverheated);
        const mClutchSlippingDisplay = await this.mClutchSlippingDisplay(clutchData.mClutchSlipping);
        const mClutchTempDisplay = await this.mClutchTempDisplay(clutchData.mClutchTemp);
        const mClutchWearDisplay = await this.mClutchWearDisplay(clutchData.mClutchWear);
        const mClutchStatus = await this.mClutchStatus(clutchData.mClutchOverheated, clutchData.mClutchSlipping, clutchData.mClutchTemp, clutchData.mClutchWear);
        const mClutchHighlight = await this.mClutchHighlight(clutchData.mClutchOverheated, clutchData.mClutchSlipping, clutchData.mClutchTemp);
        
        return {
            mClutchOverheatedDisplay,
            mClutchSlippingDisplay,
            mClutchTempDisplay,
            mClutchWearDisplay,
            mClutchStatus,
            mClutchHighlight,
        };
    }

    /**
     * Get clutch temp data
     * @param {*} mClutchOverheated 
     * @returns string
     */
    async mClutchOverheatedDisplay(mClutchOverheated) {
        const mClutchOverheatedDisplay = mClutchOverheated;

        return display(mClutchOverheatedDisplay);
    }

    /**
     * Get clutch temp data
     * @param {*} mClutchSlipping 
     * @returns string
     */
    async mClutchSlippingDisplay(mClutchSlipping) {
        const mClutchSlippingDisplay = mClutchSlipping;

        return display(mClutchSlippingDisplay);
    }

    /**
     * Get clutch temp data
     * @param {*} mClutchTemp 
     * @returns string
     */
    async mClutchTempDisplay(mClutchTemp) {
        const mClutchTempDisplay = Math.floor(mClutchTemp);

        return display(mClutchTempDisplay, null, '°');
    }

    /**
     * Get clutch wear data
     * @param {*} mClutchWear 
     * @returns string
     */
    async mClutchWearDisplay(mClutchWear) {
        const mClutchWearDisplay = Math.round(mClutchWear * 100);

        return display(mClutchWearDisplay, null, '%');
    }

    /**
     * Get clutch status
     * @param {*} mClutchWear 
     * @returns object
     */
    async mClutchStatus(mClutchWear) {
        const mClutchStatus = await this.getClutchStatus(mClutchWear);

        return mClutchStatus;
    }

    /**
     * Get clutch status based on current damage value
     * @param {*} damage 
     * @returns 
     */
    async getClutchStatus(mClutchWear) {
        if (mClutchWear >= 0.1) {
            return 1;
        }

        if (mClutchWear >= 0.25) {
            return 2;
        }

        if (mClutchWear >= 0.5) {
            return 3;
        }

        if (mClutchWear >= 1) {
            return 4;
        }

        return null;
    }

    /**
     * Get clutch highlight
     * @returns object
     */
    async mClutchHighlight(mClutchOverheated, mClutchSlipping, mClutchTemp) {
        const mClutchHighlight = await this.getClutchHighlight(mClutchOverheated, mClutchSlipping, mClutchTemp);

        return mClutchHighlight;
    }

    /**
     * Get clutch status based on current damage value
     * @returns 
     */
    async getClutchHighlight(mClutchOverheated, mClutchSlipping, mClutchTemp) {
        if (mClutchOverheated) {
            return 1;
        }

        if (mClutchSlipping) {
            return 1;
        }        

        return null;
    }

    /**
     * Get aero data
     * @param {*} data 
     * @returns object
     */
    async getAeroData(data) {
        return {
            mAeroDamage: data.mAeroDamage,
        };
    }

    /**
     * Get aero data prepared for the view
     * @param {*} aeroData 
     * @returns object
     */
    async getAeroDataForDisplay(aeroData) {
        const mAeroDamageDisplay = await this.mAeroDamageDisplay(aeroData.mAeroDamage);
        const mAeroStatus = await this.mAeroStatus(aeroData.mAeroDamage);
        const mAeroHighlight = await this.mAeroHighlight();

        return {
            mAeroDamageDisplay,
            mAeroStatus,
            mAeroHighlight,
        };
    }

    /**
     * Get aero damage prepared for the view
     * @param {*} mAeroDamage 
     * @returns string
     */
    async mAeroDamageDisplay(mAeroDamage) {
        const mAeroDamageDisplay = `${Math.round(mAeroDamage * 100)}`;

        return display(mAeroDamageDisplay, 3, '%');
    }

    /**
     * Get aero status
     * @param {*} mAeroDamage 
     * @returns object
     */
    async mAeroStatus(mAeroDamage) {
        const mAeroStatus = await this.getAeroStatus(mAeroDamage);

        return mAeroStatus;
    }

    /**
     * Get aero status based on current damage value
     * @param {*} damage 
     * @returns 
     */
    async getAeroStatus(damage) {
        if (damage > 0) {
            return 1;
        }

        if (damage >= 0.25) {
            return 2;
        }

        if (damage >= 0.4) {
            return 3;
        }

        if (damage >= 0.5) {
            return 4;
        }

        return null;
    }

    /**
     * Get aero highlight
     * @returns object
     */
    async mAeroHighlight() {
        const mAerohHighlight = await this.getAeroHighlight();

        return mAerohHighlight;
    }

    /**
     * Placeholder aero highlight
     * @returns 
     */
    async getAeroHighlight() {
        return null;
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

new CarStateWorker();
