import CrestWorker from '../CrestWorker/CrestWorker?worker';
import DashWorker from '../DashWorker/DashWorker?worker';
import LapWorker from '../LapWorker/LapWorker?worker';
import StandingsWorker from '../StandingsWorker/StandingsWorker?worker';
import CarStateWorker from '../CarStateWorker/CarStateWorker?worker';
import localforage from 'localforage';

class ParentWorker {
    constructor() {
        this.ParentWorker = self;
        this.fetching = false;
        this.config = {};
        this.isConnected = false;
        this.mSessionState = null;
        this.then = Date.now();
        this.init();

    }

    /**
     * Let't get this party started
     */
    async init() {
        try {
            await this.registerListener();
        } catch (error) {
            console.error(error);
        }
    }

    /**
     * Register listener for messages from main thread
     */
    async registerListener() {
        return this.ParentWorker.onmessage = async (event) => {
            if (typeof event.data === 'undefined') {
                return console.error('No message supplied');
            }

            if (event.data.name === 'create') {
                await this.create();
                await this.returnMessage('createcomplete');
                return;
            }

            if (event.data.name === 'updateconfig') {
                await this.updateConfig();
                await this.crestworkerUpdateConfig();
                await this.returnMessage('updateconfigcomplete');
                return;
            }

            if (event.data.name === 'start') {
                this.fetching = false;
                await this.crestworkerFetchData();

                await this.returnMessage('startcomplete');
                return;
            }
        };
    }

    /**
     * Create everything we need
     */
    async create() {
        await this.createCrestWorker();
        await this.createCrestWorkerListener();
        await this.createDashWorker();
        await this.createDashWorkerListener();
        await this.createLapWorker();
        await this.createLapWorkerListener();
        await this.createStandingsWorker();
        await this.createStandingsWorkerListener();
        await this.createCarStateWorker();
        await this.createCarStateWorkerListener();
    }

    /**
     * Update scoped config values
     */
    async updateConfig() {
        return this.config = await localforage.getItem('config');
    }

    /**
     * Create the crest worker
     */
    async createCrestWorker() {
        return this.CrestWorker = new CrestWorker();
    }

    /**
     * Do a reset
     */
    async reset() {
        await this.resetDashWorkerData();
        await this.resetLapWorkerData();
        await this.resetStandingsWorkerData();
        await this.resetData();
    }

    /**
     * Do a restart
     */
    async restart() {
        await this.resetStandingsWorkerData();
    }

    /**
     * Send the reset message back to the main thread
     */
    async resetData() {
        return await this.returnMessage('reset');
    }

    /**
     * Listen for messages from the cresh worker
     */
    async createCrestWorkerListener() {
        return this.CrestWorker.onmessage = async (event) => {
            if (typeof event.data === 'undefined') {
                return console.error('No message supplied');
            }

            if (event.data.name === 'updateconfigcomplete') {
                // console.log('updateconfigcomplete');
            }

            if (event.data.name === 'fetchcomplete') {
                // if we got here, we must be connected
                await this.updateConnectedState(true);

                // check data for correct vars

                // done fetching, reset variable
                this.fetching = false;

                // update game state
                await this.updateGameStatesData(event.data.data);

                // is paused
                const paused = await this.isPaused(event.data.data);
                if (paused) {
                    // just stop everything. keep data still and dont reset
                    // return null;
                }

                // are we ready?
                const ready = await this.isReady(event.data.data);

                // ... no?
                if (!ready) {
                    await this.reset();
                    return null;
                }

                // is new session?
                const newSession = await this.isNewSession(event.data.data);

                // ... yes?
                if (newSession) {
                    await this.restart();
                }

                // get user
                const userId = await this.getUserId(event.data.data);
                const user = await this.getUser(event.data.data);
                if (!user) {
                    return null;
                }

                this.processDashWorkerData(event.data.data); 
                this.processCarStateWorkerData(event.data.data);

                // user is whoever we're looking at, not nessasarily the driver
                this.processStandingsWorkerData(user, event.data.data);


                // get driver
                const driverId = await this.getDriverId(event.data.data);
                const driver = await this.getDriver(event.data.data);

                // dont contaminate lap data with viewed user data
                if (userId === driverId) {
                    this.processLapWorkerData(driver, event.data.data);
                }
            }

            if (event.data.name === 'connectionfailed') {
                // not connected
                await this.updateConnectedState(false);

                this.fetching = false;
                return;
            }
        };
    }

    /**
     * 
     * @param {*} data 
     * @returns 
     */
    async getDriverId(data) {
        if (data.participants.mViewedParticipantIndex < 0) {
            return null;
        }

        let driverid = null; 

        // any user input updates the driver id
        if (data.unfilteredInput.mUnfilteredThrottle > 0) {
            driverid = data.participants.mViewedParticipantIndex;
        }
        if (data.unfilteredInput.mUnfilteredSteering > 0) {
            driverid = data.participants.mViewedParticipantIndex;
        }
        if (data.unfilteredInput.mUnfilteredBrake < 1) {
            driverid = data.participants.mViewedParticipantIndex;
        }
        if (data.unfilteredInput.mUnfilteredClutch > 1) {
            driverid = data.participants.mViewedParticipantIndex;
        }

        // save driver id if driverid is found/applied
        if (driverid !== null) {
            await localforage.setItem('driverid', driverid);
        }

        // return whatever id is stored
        return await localforage.getItem('driverid');
    }

    /**
     * 
     * @param {*} data 
     * @returns 
     */
    async getDriver(data) {
        const driverId = await this.getDriverId(data);

        if (driverId === null) {
            return null;
        }

        if (!('participants' in data)) {
            return null;
        }

        if (!('mParticipantInfo' in data.participants)) {
            return null;
        }

        return data.participants.mParticipantInfo[driverId];
    }

    /**
     * Update connected state
     * @param {*} state 
     */
    async updateConnectedState(state) {
        // update scope
        this.isConnected = state;

        // send state to main thread
        await this.returnMessage('update-connectedstate', state);
    }

    /**
     * Send message back to main thread to update the game state with supplied data
     * @param {*} data 
     */
    async updateGameStatesData(data) {
        await this.returnMessage('update-gamestates', {
            mGameState: data.gameStates.mGameState,
            mSessionState: data.gameStates.mSessionState,
            mSessionIsPrivate: data.gameStates.mSessionIsPrivate,
            mRaceState: data.gameStates.mRaceState,
        });
    }

    /**
     * Is the game paused?
     * @param {*} data 
     * @returns boolean
     */
    async isPaused(data) {
        if (data.gameStates.mGameState !== 3) {
            return false;
        }

        return true;
    }

    /**
     * Is the game in a state ready for either hud?
     * @param {*} data 
     * @returns boolean
     */
    async isReady(data) {
        // replay
        if (data.gameStates.mGameState === 7 && data.gameStates.mSessionState === 5 && data.gameStates.mRaceState === 2) {
            return true;
        }

        // not in a proper session
        if (data.gameStates.mGameState === 1 && !data.gameStates.mSessionState && !data.gameStates.mRaceState) {
            return false;
        }

        return true;
    }

    /**
     * Has the session restarted or changed?
     * @param {*} data 
     * @returns boolean
     */
    async isNewSession(data) {
        if (this.mSessionState === data.gameStates.mSessionState) {
            return false;
        }

        this.mSessionState = data.gameStates.mSessionState;

        return true;
    }

    /**
     * Tell the crest worker to update the config
     */
    async crestworkerUpdateConfig() {
        await this.postMessage(this.CrestWorker, 'updateconfig'); 
    }

    /**
     * Fetch data from crest worker
     */
    async crestworkerFetchData() {
        requestAnimationFrame(async () => {
            await this.crestworkerFetchData();
        });

        // update values which we're using to limit the tick rate of the request
        const now = Date.now();
        const delta = now - this.then;

        // once a second by default
        let interval = 1000;
        // ... until we're connected
        if (this.isConnected) {
            // ... then use the user defined tickrate
            interval = 1000 / this.config.configTickRate;
        }

        // are we ready for a new fetch yet?
        if (delta > interval) {
            this.then = now - (delta % interval);

            // already fetching? bail
            if (this.fetching) {
                return null;
            }

            // update fetching to true
            this.fetching = true;

            // fetch from CrestWorker
            await this.postMessage(this.CrestWorker, 'fetch'); 
        }
    }

    /**
     * Create the dashboard worker
     */
    async createDashWorker() {
        return this.DashWorker = new DashWorker();
    }

    /**
     * Register the dash board listener
     */
    async createDashWorkerListener() {
        return this.DashWorker.onmessage = async (event) => {
            if (typeof event.data === 'undefined') {
                return console.error('No message supplied');
            }

            if (event.data.name === 'updateview') {
                return await this.returnMessage('updateview-dashdata', event.data.data);
            }
        };
    }

    /**
     * Post relevant data to the dash worker for processing
     * @param {*} data 
     */
    async processDashWorkerData(data) {
        return await this.postMessage(this.DashWorker, 'process', {
            mAntiLockActive: data.carState.mAntiLockActive,
            mAntiLockSetting: data.carState.mAntiLockSetting,
            mTractionControlSetting: data.carState.mTractionControlSetting,
            mBoostActive: data.carState.mBoostActive,
            mBoostAmount: data.carState.mBoostAmount,
            mBrakeBias: data.carState.mBrakeBias,
            mDrsState: data.carState.mDrsState,
            mErsAutoModeEnabled: data.carState.mErsAutoModeEnabled,
            mErsDeploymentMode: data.carState.mErsDeploymentMode,
            mThrottle: data.carState.mThrottle,
            mUnfilteredThrottle: data.unfilteredInput.mUnfilteredThrottle,
            mBrake: data.carState.mBrake,
            mClutch: data.carState.mClutch,
            mNumGears: data.carState.mNumGears,
            mSpeed: data.carState.mSpeed,
            mGear: data.carState.mGear,
            mRpm: data.carState.mRpm,
            mMaxRPM: data.carState.mMaxRPM,
            mRainDensity: data.weather.mRainDensity,
        });
    }

    /**
     * Send message to dash worker to reset the stored lap data
     */
    async resetDashWorkerData() {
        return await this.postMessage(this.DashWorker, 'reset');
    }

    /**
     * Create the lap worker
     */
    async createLapWorker() {
        return this.LapWorker = new LapWorker();
    }

    /**
     * Listen for messages from the lap worker
     */
    async createLapWorkerListener() {
        return this.LapWorker.onmessage = async (event) => {
            if (typeof event.data === 'undefined') {
                return console.error('No message supplied');
            }

            if (event.data.name === 'updateview') {
                return await this.returnMessage('updateview-lapdata', event.data.data);
            }

            if (event.data.name === 'dump') {
                return await this.returnMessage('dump', event.data.data);
            }
        };
    }

    /**
     * Post relevant data to the lap worker for processing
     */
    async processLapWorkerData(driver, data) {
        return await this.postMessage(this.LapWorker, 'process', {
            driver: driver,
            mSessionState: data.gameStates.mSessionState,
            mCurrentLap: driver.mCurrentLap,
            mCurrentLapDistance: driver.mCurrentLapDistance,
            mLapsInvalidated: driver.mLapsInvalidated,
            mLapsCompleted: driver.mLapsCompleted,
            mLastLapTimes: driver.mLastLapTimes,
            mFuelCapacity: data.carState.mFuelCapacity,
            mFuelLevel: data.carState.mFuelLevel,
            mCurrentTime: data.timings.mCurrentTime,
            mLapsInEvent: data.eventInformation.mLapsInEvent,
            mEventTimeRemaining: data.timings.mEventTimeRemaining,
            mSessionAdditionalLaps: data.eventInformation.mSessionAdditionalLaps,
            mFastestLapTimes: driver.mFastestLapTimes,
            mNumParticipants: data.participants.mNumParticipants,
            mRacePosition: driver.mRacePosition,
        });
    }

    /**
     * Send message to lap worker to reset the stored lap data
     */
    async resetLapWorkerData() {
        return await this.postMessage(this.LapWorker, 'reset');
    }

    /**
     * Create standings worker
     */
    async createStandingsWorker() {
        return this.StandingsWorker = new StandingsWorker();
    }

    /**
     * Listen for messages from the standings worker
     */
    async createStandingsWorkerListener() {
        return this.StandingsWorker.onmessage = async (event) => {
            if (typeof event.data === 'undefined') {
                return console.error('No message supplied');
            }

            if (event.data.name === 'updateview') {
                return await this.returnMessage('updateview-standingsdata', event.data.data);
            }
        };
    }

    /**
     * Post relevant data to the standings worker for processing
     */
    async processStandingsWorkerData(user, data) {
        return await this.postMessage(this.StandingsWorker, 'process', {
            user: user,
            mNumParticipants: data.participants.mNumParticipants,
            mParticipantInfo: data.participants.mParticipantInfo,
            mSessionState: data.gameStates.mSessionState,
            mTrackLength: data.eventInformation.mTrackLength,
            timings: data.timings
        });
    }

    /**
     * Send message to lap worker to reset the stored lap data
     */
    async resetStandingsWorkerData() {
        return await this.postMessage(this.StandingsWorker, 'reset');
    }

    /**
     * 
     * @param {*} data 
     * @returns 
     */
    async getUserId(data) {
        if (data.participants.mViewedParticipantIndex < 0) {
            return null;
        }

        return data.participants.mViewedParticipantIndex;
    }

    /**
     * Get currently viewed user data
     * @param {*} data 
     * @returns object
     */
    async getUser(data) {
        const userID = await this.getUserId(data);
        if (userID === null) {
            return null;
        }

        return data.participants.mParticipantInfo[userID];
    }

    /**
     * Create the car state worker
     */
    async createCarStateWorker() {
        return this.CarStateWorker = new CarStateWorker();
    }

    /**
     * Listen for messages from the car state worker
     */
    async createCarStateWorkerListener() {
        return this.CarStateWorker.onmessage = async (event) => {
            if (typeof event.data === 'undefined') {
                return console.error('No message supplied');
            }

            if (event.data.name === 'updateview') {
                return await this.returnMessage('updateview-carstatedata', event.data.data);
            }
        };
    }

    /**
     * Post relavant data to the car state worker for processing
     * @param {*} data 
     */
    async processCarStateWorkerData(data) {
        return await this.postMessage(this.CarStateWorker, 'process', {
            mAeroDamage: data.carDamage.mAeroDamage,
            mEngineDamage: data.carDamage.mEngineDamage,
            mTyreTemp: data.wheelsAndTyres.mTyreTemp,
            mTyreWear: data.wheelsAndTyres.mTyreWear,
            mBrakeDamage: data.wheelsAndTyres.mBrakeDamage,
            mSuspensionDamage: data.wheelsAndTyres.mSuspensionDamage,
            mBrakeTempCelsius: data.wheelsAndTyres.mBrakeTempCelsius,
            mAirPressure: data.wheelsAndTyres.mAirPressure,
            mTyreCompound: data.wheelsAndTyres.mTyreCompound,
            mClutchOverheated: data.carState.mClutchOverheated,
            mClutchSlipping: data.carState.mClutchSlipping,
            mClutchTemp: data.carState.mClutchTemp,
            mClutchWear: data.carState.mClutchWear,
            mWaterTempCelsius: data.carState.mWaterTempCelsius,
            mOilTempCelsius: data.carState.mOilTempCelsius,
        });
    }

    /**
     * Easy method to send a message to a child worker with/without additional data
     * @param {*} data 
     */
    async postMessage(worker, name, data = null) {
        if (!data) {
            return worker.postMessage({
                name
            });
        }

        return worker.postMessage({
            name,
            data
        });
    }

    /**
     * Easy method to send a message back to parent worker with/without additional data
     * @param {*} name 
     * @param {*} data 
     */
    async returnMessage(name, data = null) {
        if (data === null) {
            return this.ParentWorker.postMessage({
                name
            });
        }

        return this.ParentWorker.postMessage({
            name,
            data
        });
    }
}

new ParentWorker;
