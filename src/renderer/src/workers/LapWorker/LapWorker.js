import { millisecondsToTime } from '../../utils/TimeUtils';
import localforage from "localforage";
import { display } from "../../utils/DataUtils";

class LapWorker {
    constructor() {
        this.runID = Date.now();
        this.lap = {};
        this.lastlap = {}
        this.initialEventTimeRemaining = null;
        this.init();
    }

    /**
     * Let's do this
     */
    async init() {
        try {
            await this.registerListeners();
        } catch (error) {
            console.error(error);
        }
    }

    /**
     * Register lap worker listeners
     */
    async registerListeners() {
        self.onmessage = async (event) => {
            if (typeof event.data === 'undefined') {
                return console.error('No message supplied');
            }

            if (event.data.name === 'process') {
                const data = await this.prepareData(event.data.data);
                await this.returnMessage('updateview', data);
            }

            if (event.data.name === 'reset') {
                await this.dump();
                await this.deleteLapData();
                await this.returnMessage('resetcomplete');
            }
        };
    }

    /**
     * Dump  data
     */
    async dump() {
        const laps = await localforage.getItem('lapstore');
        await this.returnMessage('dump', laps);
    }

    /**
     * Delete the lapstore
     */
    async deleteLapData() {
        await localforage.removeItem('lapstore');
    }

    /**
     * Check and then work with that's been provided by the parentworker
     * @param {*} data 
     * @returns object Prepared data
     */
    async prepareData(data) {
        if (!('user' in data)) {
            return null;
        }

        if (!('mSessionState' in data)) {
            return null;
        }

        if (!('mCurrentLap' in data)) {
            return null;
        }

        if (!('mCurrentLapDistance' in data)) {
            return null;
        }

        if (!('mCurrentTime' in data)) {
            return null;
        }

        if (!('mLapsInvalidated' in data)) {
            return null;
        }

        if (!('mLastLapTimes' in data)) {
            return null;
        }

        if (!('mFuelCapacity' in data)) {
            return null;
        }

        if (!('mFuelLevel' in data)) {
            return null;
        }

        if (!('mLapsInEvent' in data)) {
            return null;
        }

        if (!('mEventTimeRemaining' in data)) {
            return null;
        }

        if (!('mLapsCompleted' in data)) {
            return null;
        }

        if (!('mSessionAdditionalLaps' in data)) {
            return null;
        }        

        // is the user on the circuit?
        const onCircuit = await this.isOnCircuit(data);

        // ... no?
        if (!onCircuit) {
            // lets update the runID to group our next group of laps
            await this.updateRunID(data);
        }

        // ... yes?
        if (onCircuit) {
            // get current lap data
            const lap = await this.processLap(data);

            // store the lap for future use
            await this.storeLap(lap);
        }

        const lapData = await this.getLapData(data);
        const lapDataDisplay = await this.getLapDataForDisplay(lapData);
        const fuelData = await this.getFuelData(data);
        const fuelDataDisplay = await this.getFuelDataForDisplay(fuelData);

        return {...lapDataDisplay, ...fuelDataDisplay};
    }

    /**
     * Get current lap data
     * @param {*} data 
     * @returns object
     */
    async getLapData(data) {
        const mEventTimeRemaining = await this.getEventTimeRemaining(data.mEventTimeRemaining, data.mCurrentTime);

        return {
            mCurrentLap: data.user.mCurrentLap,
            mLapsInvalidated: data.mLapsInvalidated,
            mLapsInEvent: data.mLapsInEvent,
            mRacePosition: data.user.mRacePosition,
            mNumParticipants: data.mNumParticipants,
            mEventTimeRemaining: mEventTimeRemaining,
            mSessionAdditionalLaps: data.mSessionAdditionalLaps,
            mSessionState: data.mSessionState,
        };
    }

    /**
     * 
     */
    async getEventTimeRemaining(mEventTimeRemaining, mCurrentTime) {
        if (mCurrentTime < 0 && !this.initialEventTimeRemaining) {
            return this.initialEventTimeRemaining = mEventTimeRemaining;
        }

        if (mCurrentTime < 0 && this.initialEventTimeRemaining) {
            return this.initialEventTimeRemaining;
        }

        return mEventTimeRemaining;
    }

    /**
     * Get lap data prepared for the view
     * Note: To keep the UI quick we only want to return to the main thread values which require no additional processing.
     * ... To achieve that we do all the leg work in this worker.
     * @param {*} lapData 
     * @returns object
     */
    async getLapDataForDisplay(lapData) {
        const mCurrentLapDisplay = await this.mCurrentLapDisplay(lapData.mCurrentLap, lapData.mLapsInEvent);
        const mRacePositionDisplay = await this.mRacePositionDisplay(lapData.mRacePosition, lapData.mNumParticipants);
        const mEventTimeRemainingDisplay = await this.mEventTimeRemainingDisplay(lapData.mEventTimeRemaining);
        const mSessionAdditionalLapsDisplay = await this.mSessionAdditionalLapsDisplay(lapData.mSessionAdditionalLaps, lapData.mLapsInEvent, lapData.mSessionState);

        return {
            mCurrentLapDisplay,
            mRacePositionDisplay,
            mEventTimeRemainingDisplay,
            mSessionAdditionalLapsDisplay
        };
    }

    /**
     * Get current lap prepared for the view
     * @param {*} mCurrentLap 
     * @returns number
     */
    async mCurrentLapDisplay(mCurrentLap, mLapsInEvent) {
        let sessionLaps = null;
        if (mLapsInEvent > 0) {
            sessionLaps = `/${mLapsInEvent}`;
        }

        return display(mCurrentLap, null, sessionLaps, `Laps`);
    }

    /**
     * Get laps in event prepared for view
     * @param {*} mLapsInEvent 
     * @returns number
     */
    async mLapsInEventDisplay(mLapsInEvent) {
        if (!mLapsInEvent) {
            return null;
        }

        return display(mLapsInEvent);
    }

    /**
     * Get race position prepared for view
     * @param {*} mRacePosition 
     * @returns number
     */
    async mRacePositionDisplay(mRacePosition, mNumParticipants) {

        let value = mRacePosition;
        if (mNumParticipants > 0) {
            value = `${value}/${mNumParticipants}`;
        }

        return display(value, null, null, `Pos`);
    }

    /**
     * Get time remaining prepared for view
     * @param {*} mEventTimeRemaining 
     * @returns string
     */
    async mEventTimeRemainingDisplay(mEventTimeRemaining) {
        if (!mEventTimeRemaining || mEventTimeRemaining < 0) {
            return null;
        }
        
        return display(millisecondsToTime(mEventTimeRemaining), null, null, 'Remaining');
    }

    /**
     * Get additional laps for display
     * @param {*} mSessionAdditionalLaps 
     * @returns number
     */
    async mSessionAdditionalLapsDisplay(mSessionAdditionalLaps, mLapsInEvent, mSessionState) {
        // the game engine provides this value regardless of it not being required. We only ever need it in the race (mSessionState = 5)
        if (mSessionState !== 5) {
            return null;
        }

        // ...this is already a lapped based race, the additional doesn't count
        if (mLapsInEvent > 0) {
            return null;
        }

        return display(`+${mSessionAdditionalLaps}`, null, null, 'Laps');
    }

    /**
     * Get fuel data
     * @param {*} data 
     * @returns object
     */
    async getFuelData(data) {
        // get stored laps
        let laps = await localforage.getItem('lapstore');

        // ... no laps? create an empty array
        if (!laps) {
            laps = [];
        }

        // get process vars
        const mEventTimeRemaining = await this.getEventTimeRemaining(data.mEventTimeRemaining, data.mCurrentTime);

        // get session laps
        const runLapGroups = await this.getRunLapGroups(laps);
        const fuelCapacity = data.mFuelCapacity / 100;
        const fuel = await this.getFuel(fuelCapacity, data.mFuelLevel);
        const fuelPerLap = await this.getMaxFuelPerLap(runLapGroups);
        const fuelToEndSession = await this.getFuelToEndSession(runLapGroups, fuel, fuelPerLap, data.mLapsInEvent, data.mLapsCompleted, mEventTimeRemaining, data.mSessionAdditionalLaps, data.mCurrentTime);
        const pitsToEndSession = await this.getPitsToEndSession(fuelCapacity, fuel, fuelToEndSession);

        return {
            fuelCapacity,
            fuel,
            fuelPerLap,
            fuelToEndSession,
            pitsToEndSession,
        };
    }

    /**
     * Get fuel in tank
     * @param {*} fuelCapacity 
     * @param {*} mFuelLevel 
     * @returns number
     */
    async getFuel(fuelCapacity, mFuelLevel) {
        return fuelCapacity * mFuelLevel;
    }

    /**
     * Get fuel data prpeared for the view
     * @param {*} fuelData 
     * @returns object
     */
    async getFuelDataForDisplay(fuelData) {
        // const fuelCapacityDisplay = await this.fuelCapacityDisplay(fuelData.fuelCapacity);
        const fuelDisplay = await this.fuelDisplay(fuelData.fuel);
        const fuelPerLapDisplay = await this.fuelPerLapDisplay(fuelData.fuelCapacity, fuelData.fuelPerLap);
        const fuelToEndSessionDisplay = await this.fuelToEndSessionDisplay(fuelData.fuelCapacity, fuelData.fuelToEndSession);
        const pitsToEndSessionDisplay = await this.pitsToEndSessionDisplay(fuelData.pitsToEndSession);

        return {
            // fuelCapacityDisplay,
            fuelDisplay,
            fuelPerLapDisplay,
            fuelToEndSessionDisplay,
            pitsToEndSessionDisplay,
        };
    }

    /**
     * Get current fuel prepared for view
     * @param {*} fuel 
     * @returns string
     */
    async fuelDisplay(fuel) {
        if (!isFinite(fuel)) {
            return null;
        }

        return display((Math.round(fuel * 10000) / 100).toFixed(2), null, 'L', 'In Tank');
    }

    /**
     * Get fuel per lap prepared for view
     * @param {*} fuelPerLap 
     * @returns number
     */
    async fuelPerLapDisplay(fuelCapacity, fuelPerLap) {
        let value = 0;
        let suffix = null;

        if (!isFinite(fuelCapacity) || fuelCapacity === null || !isFinite(fuelPerLap) || fuelPerLap === null) {
            value = 'N/A';
        }

        if (isFinite(fuelCapacity) && fuelCapacity !== null && isFinite(fuelPerLap) && fuelPerLap !== null) {
            value = Math.round((fuelCapacity * fuelPerLap) * 10000) / 100;
            suffix = 'L';
        }

        return display(value, null, suffix, 'Per Lap');
    }

    /**
     * Get predicted fuel to end session preapred for display
     * @param {*} fuelToEndSession 
     * @returns string
     */
    async fuelToEndSessionDisplay(fuelCapacity, fuelToEndSession) {
        let value = 0;
        let suffix = null;

        if (!isFinite(fuelCapacity) || fuelCapacity === null || !isFinite(fuelToEndSession) || fuelToEndSession === null) {
            value = 'N/A';
        }

        if (isFinite(fuelCapacity) && fuelCapacity !== null && isFinite(fuelToEndSession) && fuelToEndSession !== null) {
            value = Math.round((fuelCapacity * fuelToEndSession) * 10000) / 100;
            suffix = 'L';
        }

        return display(value, null, suffix, 'To End');
    }

    /**
     * Get predicted pit stops prepared for view
     * @param {*} pitsToEndSession 
     * @returns 
     */
    async pitsToEndSessionDisplay(pitsToEndSession) {
        let value = 0;

        if (!isFinite(pitsToEndSession) || pitsToEndSession === null) {
            value = 'N/A';
        }

        if (isFinite(pitsToEndSession) && pitsToEndSession !== null) {
            value = pitsToEndSession;
        }

        return display(value, null, null, 'Min. Stops');
    }

    /**
     * getMaxFuelPerLap
     * @param {*} runLapGroups 
     * @returns number
     */
    async getMaxFuelPerLap(runLapGroups = []) {

        // prep max differences array
        // storing the max difference for each for the runLap groups
        let maxDifferences = [];

        // loop through run run groups
        for (const runID in runLapGroups) {
            const runGroup = runLapGroups[runID];

            // get all the fuel levels in the group
            const fuelLevels = [];
            for (let index = 0; index < runGroup.length; index++) {
                const runLap = runGroup[index];

                // push fuelLevel into fuel level array
                fuelLevels.push(runLap.mFuelLevel);
            }

            // get the fuel difference between each item in group
            const runDifferences = [];
            for (let index = 1; index < fuelLevels.length; index++) {
                const fuelLevel = fuelLevels[index];

                // (previous iteration fuel level - this iteration fuel level) = fuel used per lap
                runDifferences.push( fuelLevels[index - 1] - fuelLevel );
            }

            // get maximum value out of the group
            // ... we will introduce an option for the user to decide where we pick 'min, max or average'
            maxDifferences.push( Math.max(...runDifferences) );
        }

        return Math.abs(Math.max(...maxDifferences));
    }

    /**
     * Get fuel required to end session
     * @param {*} runLapGroups 
     * @param {*} fuel 
     * @param {*} fuelPerLap 
     * @param {*} mLapsInEvent 
     * @param {*} mLapsCompleted 
     * @param {*} mEventTimeRemaining 
     * @param {*} mSessionAdditionalLaps 
     * @param {*} mCurrentTime 
     * @returns number
     */
    async getFuelToEndSession(runLapGroups, fuel, fuelPerLap, mLapsInEvent, mLapsCompleted, mEventTimeRemaining, mSessionAdditionalLaps, mCurrentTime) {
        let fuelToEndSession = 0;

        // race by laps
        if (mLapsInEvent > 0) {
            // new lap (or before race start)
            if (typeof this.mLapsCompleted === 'undefined' || mCurrentTime < 0 || this.mLapsCompleted != mLapsCompleted) {
                this.mLapsCompleted = mLapsCompleted;
                this.fuelAtLapStart = fuel;
            }

            // get fuel used this lap
            const fuelUsedThisLap = this.fuelAtLapStart - fuel;

            // estimate fuel for session
            fuelToEndSession = (fuelPerLap * (mLapsInEvent - mLapsCompleted)) - fuelUsedThisLap;
        }

        // race by time
        if (mEventTimeRemaining > 0) {
            const averageLaptime = await this.getAverageLapTime(runLapGroups);

            // get max expected laps, add additional lap if required
            let maxLaps = Math.ceil(mEventTimeRemaining / averageLaptime) + mSessionAdditionalLaps;

            // get expeceted fuel required
            fuelToEndSession = fuelPerLap * maxLaps;
        }

        // session prediction has elapsed, just show 0
        if (fuelToEndSession < 0) {
            fuelToEndSession = 0;
        }

        return fuelToEndSession;
    }

    /**
     * Get average lap time
     * @param {*} runLapGroups 
     * @returns number
     */
    async getAverageLapTime(runLapGroups) {
        // loop through laps and compile array of valid lap times
        const laptimes = [];
        for (const runID in runLapGroups) {
            const runGroup = runLapGroups[runID];

            for (let index = 0; index < runGroup.length; index++) {
                const runLap = runGroup[index];

                // dont add any laps which dont have a valid time
                if (runLap.mCurrentTime === 0) {
                    continue;
                }

                // skip invalidated
                if (runLap.mLapsInvalidated === 1) {
                    continue;
                }

                // push fuelLevel into fuel level array
                laptimes.push(runLap.mCurrentTime);
            }
        }

        // get average lap time first pass
        const averageLapTime = Math.abs(Math.min(...laptimes));

        // loop though averageLaptimes and skip any laps which are over 20% different
        // ... we'll assume these were bad laps and shouldn't be counted

        // const averageLapTimeLowerLimit = averageLapTime * (1 - 0.2);
        const averageLapTimeUpperLimit = averageLapTime * (1 + 0.2);
        const validLapTimes = [];
        for (let index = 0; index < laptimes.length; index++) {
            const laptime = laptimes[index];

            if (laptime > averageLapTimeUpperLimit) {
                continue;
            }

            validLapTimes.push(laptime);
        }
        
        // return the most average lap time from our valid laps
        return Math.abs(Math.min(...validLapTimes));
    }

    /**
     * Get minimum fuel stops required based on total fuel capacity and fuel required to end session
     * @param {*} fuelCapacity 
     * @param {*} fuel 
     * @param {*} fuelToEndSession 
     * @returns number
     */
    async getPitsToEndSession(fuelCapacity, fuel, fuelToEndSession) {
        if (isNaN(fuelToEndSession)) {
            return null;
        }

        let pitsToEndSession = 0;

        const fuelToEndSessionLitres = fuelCapacity * fuelToEndSession;

        if (fuel < fuelToEndSessionLitres) {
            pitsToEndSession = Math.ceil( (fuelToEndSessionLitres - fuel) / fuelCapacity );
        }

        return pitsToEndSession;
    }

    /**
     * Group the laps by their runID
     * @param {*} laps 
     * @returns object
     */
    async getRunLapGroups(laps) {
        const runLaps = {};

        // sort into run groups
        let invalid = 0;
        for (let index = 0; index < laps.length; index++) {
            const lap = laps[index];

            if (lap.mLapsInvalidated) {
                invalid++;

                // skip invalid laps
                continue;
            }

            // using our invalid variable as a unique identifier within the group
            // ther'es no way another run was started with valid laps a millisecond after the previous run, this is safe.
            if (!(lap.runID + invalid in runLaps)) {
                runLaps[lap.runID + invalid] = [];
            }

            // push data into runlaps array
            runLaps[lap.runID + invalid].push(lap);
        }

        // remove runLaps where there is not enough data for comparison
        for (const runID in runLaps) {
            if (runLaps[runID].length < 2) {
                delete runLaps[runID];
            }
        }

        return runLaps;
    }

    /**
     * Store the lap
     * @param {*} lap 
     */
    async storeLap(lap) {
        if (!lap) {
            return null;
        }

        // get all stored laps
        let laps = await localforage.getItem('lapstore');

        // no laps? create empty array so we have something to work with
        if (!laps) {
            laps = []
        }

        // add lap to laps array from store
        laps.push(lap);
        
        // push back into store
        return await localforage.setItem('lapstore', laps);
    }

    /**
     * Get a new run ID
     * @param {*} data 
     * @returns timestamp
     */
    async updateRunID() {
        // nothing complex, just the current timestamp
        // lets add it to the scope whilst we're here for quick reference
        return this.runID = Date.now();
    }

    /**
     * Get currently active run id
     * @param {*} data 
     * @returns timestamp
     */
    async getActiveRunID() {
        return this.runID;
    }

    /**
     * Process lap data
     * @param {*} data 
     * @returns object
     */
    async processLap(data) {
        // return null by default
        let returns = null;

        // get current lap data
        const lap = await this.getLap(data);

        // no lap data
        if (!lap) {
            return returns;
        }

        // current lap is newer than stored 'last lap', we must have just started a new one
        if (lap.mCurrentLap > this.lastlap.mCurrentLap) {
            // ... update returns with last lap data
            returns = this.lastlap;
        }

        // update last lap on every process/request
        this.lastlap = lap;

        return returns;
    }

    /**
     * Are we on the circuit?
     * @param {*} data 
     * @returns boolean
     */
    async isOnCircuit(data) {
        if (!data.user) {
            return false;
        }

        if (data.user.mPitModes) {
            return false;
        }

        return true;
    }
    
    /**
     * Get current lap data
     * @param {*} data 
     * @returns object
     */
    async getLap(data) {
        const runID = await this.getActiveRunID();
        const lap = {
            runID: runID,
            mSessionState: data.mSessionState,
            mLapsInvalidated: data.mLapsInvalidated,
            mCurrentLap: data.mCurrentLap,
            mCurrentTime: data.mCurrentTime,
            mFuelLevel: data.mFuelLevel
        };

        return lap;
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

new LapWorker();
