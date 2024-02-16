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

        const tyreData = await this.getTyreData(data);
        const tyreDataDisplay = await this.getTyreDataForDisplay(tyreData);
        const brakeData = await this.getBrakeData(data);
        const brakeDataDisplay = await this.getBrakeDataForDisplay(brakeData);
        const suspensionData = await this.getSuspensionData(data);
        const suspensionDataDisplay = await this.getSuspensionDataForDisplay(suspensionData);
        const engineData = await this.getEngineData(data);
        const engineDataDisplay = await this.getEngineDataForDisplay(engineData);
        const aeroData = await this.getAeroData(data);
        const aeroDataDisplay = await this.getAeroDataForDisplay(aeroData);

        return {...tyreDataDisplay, ...brakeDataDisplay, ...suspensionDataDisplay, ...engineDataDisplay, ...aeroDataDisplay}
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
        const { mTyreWearFrontLeftDisplay, mTyreWearFrontRightDisplay, mTyreWearRearLeftDisplay, mTyreWearRearRightDisplay } = await this.mTyreWearDisplay(tyreData.mTyreWear);
        const { 
            mTyreWearFrontLeftStateColor,
            mTyreWearFrontRightStateColor,
            mTyreWearRearLeftStateColor,
            mTyreWearRearRightStateColor,
            mTyreWearFrontLeftStateAmount,
            mTyreWearFrontRightStateAmount,
            mTyreWearRearLeftStateAmount,
            mTyreWearRearRightStateAmount
        } = await this.mTyreWearState(tyreData.mTyreWear);
        const { mTyreTempFrontLeftDisplay, mTyreTempFrontRightDisplay, mTyreTempRearLeftDisplay, mTyreTempRearRightDisplay } = await this.mTyreTempDisplay(tyreData.mTyreTemp);
        const { 
            mTyreTempFrontLeftStateColor,
            mTyreTempFrontRightStateColor,
            mTyreTempRearLeftStateColor,
            mTyreTempRearRightStateColor,
            mTyreTempFrontLeftStateAmount,
            mTyreTempFrontRightStateAmount,
            mTyreTempRearLeftStateAmount,
            mTyreTempRearRightStateAmount
        } = await this.mTyreTempState(tyreData.mTyreTemp);

        return {
            mAirPressureFrontLeftDisplay,
            mAirPressureFrontRightDisplay,
            mAirPressureRearLeftDisplay,
            mAirPressureRearRightDisplay,

            mTyreCompoundFrontLeftDisplay,
            mTyreCompoundFrontRightDisplay,
            mTyreCompoundRearLeftDisplay,
            mTyreCompoundRearRightDisplay,

            mTyreCompoundFrontLeftDisplay,
            mTyreCompoundFrontRightDisplay,
            mTyreCompoundRearLeftDisplay,
            mTyreCompoundRearRightDisplay,

            mTyreWearFrontLeftDisplay,
            mTyreWearFrontRightDisplay,
            mTyreWearRearLeftDisplay,
            mTyreWearRearRightDisplay,

            mTyreWearFrontLeftStateColor,
            mTyreWearFrontRightStateColor,
            mTyreWearRearLeftStateColor,
            mTyreWearRearRightStateColor,
            
            mTyreWearFrontLeftStateAmount,
            mTyreWearFrontRightStateAmount,
            mTyreWearRearLeftStateAmount,
            mTyreWearRearRightStateAmount,

            mTyreTempFrontLeftDisplay,
            mTyreTempFrontRightDisplay,
            mTyreTempRearLeftDisplay,
            mTyreTempRearRightDisplay,

            mTyreTempFrontLeftStateColor,
            mTyreTempFrontRightStateColor,
            mTyreTempRearLeftStateColor,
            mTyreTempRearRightStateColor,

            mTyreTempFrontLeftStateAmount,
            mTyreTempFrontRightStateAmount,
            mTyreTempRearLeftStateAmount,
            mTyreTempRearRightStateAmount,
        };
    }

    /**
     * Get air (tyre) pressures preapred for the view
     * @param {*} mAirPressure 
     * @returns object
     */
    async mAirPressureDisplay(mAirPressure) {
        const mAirPressureFrontLeftDisplay = mAirPressure[0];
        const mAirPressureFrontRightDisplay = mAirPressure[1];
        const mAirPressureRearLeftDisplay = mAirPressure[2];
        const mAirPressureRearRightDisplay = mAirPressure[3];

        return {
            mAirPressureFrontLeftDisplay,
            mAirPressureFrontRightDisplay,
            mAirPressureRearLeftDisplay,
            mAirPressureRearRightDisplay,
        };
    }

    /**
     * Get tyre compound prepared for the view
     * @param {*} mTyreCompound 
     * @returns object
     */
    async mTyreCompoundDisplay(mTyreCompound) {
        const mTyreCompoundFrontLeftDisplay = mTyreCompound[0];
        const mTyreCompoundFrontRightDisplay = mTyreCompound[1];
        const mTyreCompoundRearLeftDisplay = mTyreCompound[2];
        const mTyreCompoundRearRightDisplay = mTyreCompound[3];

        return {
            mTyreCompoundFrontLeftDisplay,
            mTyreCompoundFrontRightDisplay,
            mTyreCompoundRearLeftDisplay,
            mTyreCompoundRearRightDisplay,
        };
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
            mTyreTempFrontLeftDisplay,
            mTyreTempFrontRightDisplay,
            mTyreTempRearLeftDisplay,
            mTyreTempRearRightDisplay,
        };
    }

    /**
     * Get tyre temps prepared for the view
     * @param {*} mTyreTemp 
     * @returns object
     */
    async mTyreTempState(mTyreTemp) {
        let fl = await this.mTyreTempValueState(mTyreTemp[0]);
        let fr = await this.mTyreTempValueState(mTyreTemp[1]);
        let rl = await this.mTyreTempValueState(mTyreTemp[2]);
        let rr = await this.mTyreTempValueState(mTyreTemp[3]);

        return {
            mTyreTempFrontLeftStateColor: fl.color,
            mTyreTempFrontLeftStateAmountr: fl.amount,
            mTyreTempFrontRightStateColor: fr.color,
            mTyreTempFrontRightStateAmountr: fr.amount,
            mTyreTempRearLeftStateColor: rl.color,
            mTyreTempRearLeftStateAmountr: rl.amount,
            mTyreTempRearRightStateColor: rr.color,
            mTyreTempRearRightStateAmountr: rr.amount,
        };
    }

    /**
     * Prepare tyre temp state values
     * @param {*} mTyreTempValue 
     * @returns object
     */
    async mTyreTempValueState(mTyreTempValue) {
        // amount
        let amount = 1;

        // color
        let color = null;
        if (mTyreTempValue >= 100) {
            color = 'yellow';

        }
        if (mTyreTempValue > 110) {
            color = 'red';
        }

        return {
            color: color,
            amount: amount
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

        let mTyreWearFrontLeftDisplay = 100 - Math.round((2 * mTyreWear[0]) * 100);
        if (mTyreWearFrontLeftDisplay <= 0) {
            mTyreWearFrontLeftDisplay = `0`;
        }

        let mTyreWearFrontRightDisplay = 100 - Math.round((2 * mTyreWear[1]) * 100);
        if (mTyreWearFrontRightDisplay <= 0) {
            mTyreWearFrontRightDisplay = `0`;
        }

        let mTyreWearRearLeftDisplay = 100 - Math.round((2 * mTyreWear[2]) * 100);
        if (mTyreWearRearLeftDisplay <= 0) {
            mTyreWearRearLeftDisplay = `0`;
        }

        let mTyreWearRearRightDisplay = 100 - Math.round((2 * mTyreWear[3]) * 100);
        if (mTyreWearRearRightDisplay <= 0) {
            mTyreWearRearRightDisplay = `0`;
        }

        return {
            mTyreWearFrontLeftDisplay,
            mTyreWearFrontRightDisplay,
            mTyreWearRearLeftDisplay,
            mTyreWearRearRightDisplay,
        };
    }

    /**
     * Get tyre wear state prepared for the view
     * @param {*} mTyreTemp 
     * @returns object
     */
    async mTyreWearState(mTyreWear) {
        let fl = await this.mTyreWearValueState(mTyreWear[0]);
        let fr = await this.mTyreWearValueState(mTyreWear[1]);
        let rl = await this.mTyreWearValueState(mTyreWear[2]);
        let rr = await this.mTyreWearValueState(mTyreWear[3]);

        return {
            mTyreWearFrontLeftStateColor: fl.color,
            mTyreWearFrontLeftStateAmount: fl.amount,
            mTyreWearFrontRightStateColor: fr.color,
            mTyreWearFrontRightStateAmount: fr.amount,
            mTyreWearRearLeftStateColor: rl.color,
            mTyreWearRearLeftStateAmount: rl.amount,
            mTyreWearRearRightStateColor: rr.color,
            mTyreWearRearRightStateAmount: rr.amount,
        };
    }

    /**
     * Prepare tyre temp state values
     * @param {*} mTyreWear 
     * @returns object
     */
    async mTyreWearValueState(mTyreWear) {
        let color = '';
        let amount = Math.round((2 * mTyreWear) * 100);
        if (amount >= 10) {
            color = 'green';
        }
        if (amount >= 20) {
            color = 'yellow';
        }
        if (amount >= 50) {
            color = 'red';
        }

        return {
            color: color,
            amount: `${amount}%`
        }
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
        const { mBrakeDamageFrontLeftDisplay, mBrakeDamageFrontRightDisplay, mBrakeDamageRearLeftDisplay, mBrakeDamageRearRightDisplay } = await this.mBrakeDamageDisplay(brakeData.mBrakeDamage);
        const { 
            mBrakeDamageFrontLeftStateColor,
            mBrakeDamageFrontRightStateColor,
            mBrakeDamageRearLeftStateColor,
            mBrakeDamageRearRightStateColor,
            mBrakeDamageFrontLeftStateAmount,
            mBrakeDamageFrontRightStateAmount,
            mBrakeDamageRearLeftStateAmount,
            mBrakeDamageRearRightStateAmount
        } = await this.mBrakeDamageState(brakeData.mBrakeDamage);
        const { mBrakeTempCelsiusFrontLeftDisplay, mBrakeTempCelsiusFrontRightDisplay, mBrakeTempCelsiusRearLeftDisplay, mBrakeTempCelsiusRearRightDisplay } = await this.mBrakeTempCelsiusDisplay(brakeData.mBrakeTempCelsius);
        const { 
            mBrakeTempCelsiusFrontLeftStateColor,
            mBrakeTempCelsiusFrontRightStateColor,
            mBrakeTempCelsiusRearLeftStateColor,
            mBrakeTempCelsiusRearRightStateColor,
            mBrakeTempCelsiusFrontLeftStateAmount,
            mBrakeTempCelsiusFrontRightStateAmount,
            mBrakeTempCelsiusRearLeftStateAmount,
            mBrakeTempCelsiusRearRightStateAmount
        } = await this.mBrakeTempCelsiusState(brakeData.mBrakeTempCelsius);

        return {
            mBrakeDamageFrontLeftDisplay,
            mBrakeDamageFrontRightDisplay,
            mBrakeDamageRearLeftDisplay,
            mBrakeDamageRearRightDisplay,
            mBrakeDamageFrontLeftStateColor,
            mBrakeDamageFrontRightStateColor,
            mBrakeDamageRearLeftStateColor,
            mBrakeDamageRearRightStateColor,
            mBrakeDamageFrontLeftStateAmount,
            mBrakeDamageFrontRightStateAmount,
            mBrakeDamageRearLeftStateAmount,
            mBrakeDamageRearRightStateAmount,
            mBrakeTempCelsiusFrontLeftDisplay,
            mBrakeTempCelsiusFrontRightDisplay,
            mBrakeTempCelsiusRearLeftDisplay,
            mBrakeTempCelsiusRearRightDisplay,
            mBrakeTempCelsiusFrontLeftStateColor,
            mBrakeTempCelsiusFrontRightStateColor,
            mBrakeTempCelsiusRearLeftStateColor,
            mBrakeTempCelsiusRearRightStateColor,
            mBrakeTempCelsiusFrontLeftStateAmount,
            mBrakeTempCelsiusFrontRightStateAmount,
            mBrakeTempCelsiusRearLeftStateAmount,
            mBrakeTempCelsiusRearRightStateAmount,
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
            mBrakeDamageFrontLeftDisplay,
            mBrakeDamageFrontRightDisplay,
            mBrakeDamageRearLeftDisplay,
            mBrakeDamageRearRightDisplay,
        };
    }

    /**
     * Get brake damage state prepared for the view
     * @param {*} mBrakeDamage 
     * @returns object
     */
    async mBrakeDamageState(mBrakeDamage) {
        let fl = await this.mBrakeDamageValueState(mBrakeDamage[0]);
        let fr = await this.mBrakeDamageValueState(mBrakeDamage[1]);
        let rl = await this.mBrakeDamageValueState(mBrakeDamage[2]);
        let rr = await this.mBrakeDamageValueState(mBrakeDamage[3]);

        return {
            mBrakeDamageFrontLeftStateColor: fl.color,
            mBrakeDamageFrontLeftStateAmount: fl.amount,
            mBrakeDamageFrontRightStateColor: fr.color,
            mBrakeDamageFrontRightStateAmount: fr.amount,
            mBrakeDamageRearLeftStateColor: rl.color,
            mBrakeDamageRearLeftStateAmount: rl.amount,
            mBrakeDamageRearRightStateColor: rr.color,
            mBrakeDamageRearRightStateAmount: rr.amount,
        };
    }

    /**
     * Prepare tyre temp state values
     * @param {*} mBrakeDamage 
     * @returns object
     */
    async mBrakeDamageValueState(mBrakeDamage) {
        let color = 'red';
        let amount = 0;
        if (mBrakeDamage > 0.1) {
            amount = 0.4 + mBrakeDamage;
        }
        if (mBrakeDamage > 0.5) {
            amount = 1;
        }

        return {
            color: color,
            amount: amount
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
            mBrakeTempCelsiusFrontLeftDisplay,
            mBrakeTempCelsiusFrontRightDisplay,
            mBrakeTempCelsiusRearLeftDisplay,
            mBrakeTempCelsiusRearRightDisplay,
        };
    }

    /**
     * Get brake damage state prepared for the view
     * @param {*} mBrakeTempCelsius 
     * @returns object
     */
    async mBrakeTempCelsiusState(mBrakeTempCelsius) {
        let fl = await this.mBrakeTempCelsiusValueState(mBrakeTempCelsius[0]);
        let fr = await this.mBrakeTempCelsiusValueState(mBrakeTempCelsius[1]);
        let rl = await this.mBrakeTempCelsiusValueState(mBrakeTempCelsius[2]);
        let rr = await this.mBrakeTempCelsiusValueState(mBrakeTempCelsius[3]);

        return {
            mBrakeTempCelsiusFrontLeftStateColor: fl.color,
            mBrakeTempCelsiusFrontLeftStateAmount: fl.amount,
            mBrakeTempCelsiusFrontRightStateColor: fr.color,
            mBrakeTempCelsiusFrontRightStateAmount: fr.amount,
            mBrakeTempCelsiusRearLeftStateColor: rl.color,
            mBrakeTempCelsiusRearLeftStateAmount: rl.amount,
            mBrakeTempCelsiusRearRightStateColor: rr.color,
            mBrakeTempCelsiusRearRightStateAmount: rr.amount,
        };
    }

    /**
     * Prepare tyre temp state values
     * @param {*} mBrakeTempCelsius 
     * @returns object
     */
    async mBrakeTempCelsiusValueState(mBrakeTempCelsius) {
        let color = null;
        let amount = 1;

        if (mBrakeTempCelsius >= 600) {
            color = 'yellow';
        }

        if (mBrakeTempCelsius >= 800) {
            color = 'red';
        }

        return {
            color: color,
            amount: amount
        }
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

        return {
            mSuspensionDamageFrontLeftDisplay,
            mSuspensionDamageFrontRightDisplay,
            mSuspensionDamageRearLeftDisplay,
            mSuspensionDamageRearRightDisplay,
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
            mSuspensionDamageFrontLeftDisplay,
            mSuspensionDamageFrontRightDisplay,
            mSuspensionDamageRearLeftDisplay,
            mSuspensionDamageRearRightDisplay,
        };
    }

    /**
     * Get engine data
     * @param {*} data 
     * @returns object
     */
    async getEngineData(data) {
        return {
            mEngineDamage: data.mEngineDamage,
        };
    }

    /**
     * Get engine data prepared for the view
     * @param {*} engineData 
     * @returns object
     */
    async getEngineDataForDisplay(engineData) {
        const mEngineDamageDisplay = await this.mEngineDamageDisplay(engineData.mEngineDamage);

        return {
            mEngineDamageDisplay,
        };
    }

    /**
     * Get engine damage data
     * @param {*} mEngineDamage 
     * @returns string
     */
    async mEngineDamageDisplay(mEngineDamage) {
        return `${Math.round(mEngineDamage * 100)}`;
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

        return {
            mAeroDamageDisplay,
        };
    }

    /**
     * Get aero damage prepared for the view
     * @param {*} mAeroDamage 
     * @returns string
     */
    async mAeroDamageDisplay(mAeroDamage) {
        return `${Math.round(mAeroDamage * 100)}`;
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
