import { isReady, getActiveParticipant } from '../../utils/CrestUtils';

export default class FuelFactory {
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
            // console.log('FuelFactory reset');

            this.mLapsCompleted = null;
            this.fuelAtLapStart = null;
            this.fuel = {
                mFuelCapacity: null,
                mFuelLevel: null,
                mFuelInCar: null,
                mFuelPerLap: null,
                mLapsToEnd: null,
                mFuelToEndSession: null,
                mFuelStopsToEndSession: null,
                mFuelInStop: null,
            };
        } catch (error) {
            console.error(error);
        }
    }

    /**
     *
     * @returns
     */
    async inflate() {
        let storedData = await new Promise((resolve, reject) => {
            storage.get('FuelFactory', function(error, data) {
                if (error) {
                    reject(error);
                }

                resolve(data);
            });
        });

        return storedData;
    }

    /**
     *
     * @param {*} data
     */
    async storeData(data) {
        return storage.set('FuelFactory', data);
    }

    /**
     *
     * @param {*} data
     * @returns
     */
    async getData(data) {
        try {
            // console.log(this.db);
            return await this.prepareData(data);
        } catch (error) {
            console.error(error);
        }
    }

    /**
     *
     * @param {*} data
     * @returns
     */
    async prepareData(data) {
        const ready = await isReady(data);
        if (!ready) {
            return null;
        }

        if (!('fuel' in data)) {
            data.fuel = this.fuel;
        }

        data.fuel.mFuelCapacity = await this.mFuelCapacity(data);
        data.fuel.mFuelInCar = await this.mFuelInCar(data);

        const participant = await getActiveParticipant(data);
        if (!participant.mIsDriver) {
            return data;
        }

        data.fuel.mFuelLevel = await this.mFuelLevel(data);
        data.fuel.mFuelPerLap = await this.mFuelPerLap(data);
        data.fuel.mLapsToEnd = await this.mLapsToEnd(data);
        data.fuel.mFuelToEndSession = await this.mFuelToEndSession(data);
        data.fuel.mFuelStopsToEndSession = await this.mFuelStopsToEndSession(data);
        data.fuel.mFuelInStop = await this.mFuelInStop(data);

        return data;
    }

    /**
     *
     * @param {*} data
     */
    async mFuelCapacity(data) {
        return data.carState.mFuelCapacity;
    }

    /**
     *
     * @param {*} data
     */
    async mFuelLevel(data) {
        return data.carState.mFuelLevel;
    }

    /**
     *
     * @param {*} data
     * @returns
     */
    async mFuelInCar(data) {
        return data.carState.mFuelCapacity * data.carState.mFuelLevel;
    }

    /**
     *
     * @param {*} runLapGroups
     * @returns number
     */
    async mFuelPerLap(data) {
        const lapRuns = await this.lapRuns(data);

        // prep max differences array
        // storing the max difference for each for the runLap groups
        let maxDifferences = [];

        // loop through run run groups
        for (const runID in lapRuns) {
            const lapRun = lapRuns[runID];

            // get all the fuel levels in the group
            const fuelLevels = [];
            for (let index = 0; index < lapRun.length; index++) {
                const runLap = lapRun[index];

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

        const maxDifference = Math.abs(Math.max(...maxDifferences));

        if (!isFinite(maxDifference)) {
            return null;
        }

        return maxDifference * data.carState.mFuelCapacity;
    }

    /**
     * Group the laps by their runID
     * @param {*} data
     * @returns object
     */
    async lapRuns(data) {
        const participant = await getActiveParticipant(data);
        const lapRuns = {};

        // sort into run groups
        let invalid = 0;
        for (let index = 0; index < participant.mLapsInfo.length; index++) {
            const lap = participant.mLapsInfo[index];

            if (lap.mLapsInvalidated) {
                invalid++;

                // skip invalid laps
                continue;
            }

            // using our invalid variable as a unique identifier within the group
            // ther'es no way another run was started with valid laps a millisecond after the previous run, this is safe.
            if (!(lap.runID + invalid in lapRuns)) {
                lapRuns[lap.runID + invalid] = [];
            }

            // push data into runlaps array
            lapRuns[lap.runID + invalid].push(lap);
        }

        // remove lapRuns where there is not enough data for comparison
        for (const runID in lapRuns) {
            if (lapRuns[runID].length < 2) {
                delete lapRuns[runID];
            }
        }

        return lapRuns;
    }

    /**
     *
     * @param {*} data
     * @returns
     */
    async mLapsToEnd(data) {
        const participant = await getActiveParticipant(data);

        // if laps based event
        if (data.eventInformation.mLapsInEvent > 0) {
            return data.eventInformation.mLapsInEvent - participant.mLapsCompleted;
        }

        // if time based event
        if (data.eventInformation.mEventTimeRemaining > 0) {
            const mAverageLapTIme = await this.mAverageLapTIme(data);
            // console.log(mAverageLapTIme);

            // const mAverageLapTIme = 25.977059999999998;
            if (mAverageLapTIme === null) {
                return null;
            }

            // get max expected laps, add additional lap if required
            return (Math.ceil(data.eventInformation.mSessionDuration / mAverageLapTIme) + data.eventInformation.mSessionAdditionalLaps) - participant.mLapsCompleted;
        }

        return null;
    }

    /**
     *
     * @param {*} data
     * @returns
     */
    async mFuelToEndSession(data) {
        const participant = await getActiveParticipant(data);

        let fuelToEndSession = 0;

        // new lap (or before race start) (probably a more elegant way of doing this without the this.mLapsCompleted)
        if (this.mLapsCompleted === null || participant.mCurrentTime < 0 || this.mLapsCompleted != participant.mLapsCompleted) {
            this.mLapsCompleted = participant.mLapsCompleted;
            this.fuelAtLapStart = data.carState.mFuelLevel;
        }

        // // get fuel used this lap
        // const fuelUsedThisLap = this.fuelAtLapStart - data.carState.mFuelLevel;

        // no laps to end defined?
        if (data.fuel.mLapsToEnd === null) {
            return null;
        }

        // no fuel per lap defined?
        if (data.fuel.mFuelPerLap === null) {
            return null;
        }

        // fuelToEndSession = ((data.fuel.mLapsToEnd * data.fuel.mFuelPerLap) - fuelUsedThisLap) - data.fuel.mFuelInCar;
        fuelToEndSession = data.fuel.mLapsToEnd * data.fuel.mFuelPerLap;

        // session prediction has elapsed, just show 0
        if (fuelToEndSession < 0) {
            fuelToEndSession = 0;
        }

        return fuelToEndSession;
    }

    /**
     *
     * @param {*} data
     * @returns
     */
    async mFuelStopsToEndSession(data) {
        if (data.fuel.mFuelToEndSession === null) {
            return null;
        }

        // // get fuel used this lap
        // const fuelUsedThisLap = this.fuelAtLapStart - data.carState.mFuelLevel;

        // get fuel required to end session, minus fuel in car
        const calculatedFuel = data.fuel.mFuelToEndSession - data.fuel.mFuelInCar;

        if (calculatedFuel < 0) {
            return 0;
        }

        return Math.ceil( calculatedFuel / data.fuel.mFuelCapacity );
    }

    /**
     *
     * @param {*} data
     */
    async mFuelInStop(data) {
        if (data.fuel.mFuelToEndSession === null) {
            return null;
        }

        const difference = data.fuel.mFuelToEndSession - data.fuel.mFuelInCar;

        if (difference < 0) {
            return 0;
        }

        if (difference > data.fuel.mFuelCapacity) {
            return data.fuel.mFuelCapacity;
        }

        return difference;
    }

    /**
     * Get average lap time
     * @param {*} data
     * @returns number
     */
    async mAverageLapTIme(data) {
        const participant = await getActiveParticipant(data);
        const lapRuns = await this.lapRuns(data);

        // loop through laps and compile array of valid lap times
        const laptimes = [];
        for (const runID in lapRuns) {
            const lapRun = lapRuns[runID];

            for (let lri = 0; lri < lapRun.length; lri++) {
                const lap = lapRun[lri];

                // dont add any laps which dont have a valid time
                if (lap.mCurrentLapTimes === 0) {
                    continue;
                }

                // skip invalidated
                if (lap.mLapsInvalidated === 1) {
                    continue;
                }

                // skip if current lap
                if (lap.mCurrentLap === participant.mCurrentLap) {
                    continue;
                }

                // skip if not fastest lap or slower
                // cant remeber why i did this, i think it was to avoid lap currently being driven but i've covered that above
                // if (lap.mCurrentLapTimes < participant.mFastestLapTimes) {
                //     continue;
                // }

                // push
                laptimes.push(lap.mCurrentLapTimes);
            }
        }

        // get average lap time first pass
        let averageLapTime = Math.abs(Math.min(...laptimes));
        if (laptimes.length === 1) {
            return averageLapTime;
        }

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

        averageLapTime = Math.abs(Math.min(...validLapTimes));

        if (!isFinite(averageLapTime)) {
            return null;
        }

        // return the most average lap time from our valid laps
        return averageLapTime;
    }

    /**
     *
     * @param {*} data
     */
    // async mPitsToEndSession(data) {
    //     const fuelToEndSession = await this.mFuelStopsToEndSession(data);

    //     if (isNaN(fuelToEndSession) || fuelToEndSession === null) {
    //         return null;
    //     }

    //     const mFuelCapacity = await this.mFuelCapacity(data);
    //     const mFuelLevel = await this.mFuelLevel(data);

    //     let pitsToEndSession = 0;

    //     const fuelToEndSessionLitres = mFuelCapacity * fuelToEndSession;

    //     if (mFuelLevel < fuelToEndSessionLitres) {
    //         pitsToEndSession = Math.ceil( (fuelToEndSessionLitres - mFuelLevel) / mFuelCapacity );
    //     }

    //     return pitsToEndSession;
    // }
}