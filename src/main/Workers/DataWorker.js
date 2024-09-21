import { parentPort } from 'worker_threads';
import { isReady, isInMenu } from '../../utils/CrestUtils';

import ParticipantsFactory from '../Factories/ParticipantsFactory';
import TrackPositionFactory from '../Factories/TrackPositionFactory';
import UnfilteredInputFactory from '../Factories/UnfilteredInputFactory';
import EventInformationFactory from '../Factories/EventInformationFactory';
import CarStateFactory from '../Factories/CarStateFactory';
import CarDamageFactory from '../Factories/CarDamageFactory';
import WeatherFactory from '../Factories/WeatherFactory';
import WheelsAndTyresFactory from '../Factories/WheelsAndTyresFactory';
import FuelFactory from '../Factories/FuelFactory';
import TimingsFactory from '../Factories/TimingsFactory';

class DataWorker {
    constructor() {
        this.worker = parentPort;

        this.init();
    }

    /**
     *
     */
    async init() {
        try {
            await this.registerListeners();
            await this.registerFactories();
        } catch (error) {
            console.error(error);

        }
    }

    /**
     *
     */
    async registerFactories() {
        this.ParticipantsFactory = new ParticipantsFactory();
        this.TrackPositionFactory = new TrackPositionFactory();
        this.UnfilteredInputFactory = new UnfilteredInputFactory();
        this.EventInformationFactory = new EventInformationFactory();
        this.CarStateFactory = new CarStateFactory();
        this.CarDamageFactory = new CarDamageFactory();
        this.WeatherFactory = new WeatherFactory();
        this.WheelsAndTyresFactory = new WheelsAndTyresFactory();
        this.FuelFactory = new FuelFactory();
        this.TimingsFactory = new TimingsFactory();
    }

    /**
     *
     */
    async registerListeners() {
        this.worker.on('message', async (event) => {
            if (event.name === 'setup') {
                await this.returnMessage({
                    name: 'setup',
                    data: await this.processSetup(event.data)
                });
            }

            if (event.name === 'data') {
                await this.returnMessage({
                    name: 'data',
                    data: await this.processData(event.data)
                });
            }
        });
    }

    /**
     *
     */
    async processSetup(data) {
        // if ('defaultDataPath' in data) {
        //     storage.setDataPath(data.defaultDataPath);
        // }
    }

    /**
     *
     * @returns
     */
    async resetData() {
        await this.ParticipantsFactory.reset();
        await this.TrackPositionFactory.reset();
        await this.UnfilteredInputFactory.reset();
        await this.EventInformationFactory.reset();
        await this.CarStateFactory.reset();
        await this.CarDamageFactory.reset();
        await this.WeatherFactory.reset();
        await this.WheelsAndTyresFactory.reset();
        await this.FuelFactory.reset();
        await this.TimingsFactory.reset();
        return null;
    }

    /**
     *
     */
    async clearEventStorage() {
        await this.returnMessage({
            name: 'clearEventStorage'
        });
    }

    /**
     *
     */
    async processData(data) {
        const inMenu = await isInMenu(data);
        if (inMenu) {
            await this.clearEventStorage();
        }

        const ready = await isReady(data);
        if (!ready) {
            return await this.resetData();
        }

        // The aim here to to prepare data for the view:
        // - ensure data is dry
        // - null values are returned if data is not ready for the view

        // A lot of values from shared memory are replaced in the following factories.
        // A lot of values are added to the payload.

        // Apply missing data to participant data directly from crest
        // - participants/mParticipantInfo/Array
        // -- mCurrentLapTimes
        // -- mNameMain (mName with community tag removed)
        // -- mNameShort (short version of mNameDisplay)
        // -- mNameTag (mName extracted from community tag)
        // -- mCarNamesMain
        // -- mCarClassNamesShort
        // -- mCarClassColor
        // -- mIsDriver
        // -- mOutLap
        // -- mLapsInfo
        // --- runID
        // --- mCurrentLap
        // --- mCurrentLapTimes
        // --- mLapsInvalidated
        // --- mFuelLevel
        data = await this.ParticipantsFactory.getData(data);

        // Apply better, more usable input data to crest data
        // console.time('dwui');
        data = await this.UnfilteredInputFactory.getData(data);
        // console.timeEnd('dwui');

        // Apply better, more usable event information to crest data
        data = await this.EventInformationFactory.getData(data);

        // Apply better, more usable car state information to crest data
        data = await this.CarStateFactory.getData(data);

        // Apply better, more usable car damage information to crest data
        data = await this.CarDamageFactory.getData(data);

        // Apply better, more usable weather information to crest data
        data = await this.WeatherFactory.getData(data);

        // Apply better, more usable weather information to crest data
        data = await this.WheelsAndTyresFactory.getData(data);

        // Apply better, more usable timings information to crest data
        data = await this.TimingsFactory.getData(data);

        // Apply fuel calculations (requires participant/mLapsInfo and additional eventInformation to be populated)
        // - fuel
        // -- mFuelCapacity
        // -- mFuelLevel
        // -- mFuelPerLapPit
        // -- mFuelPerLapInCar
        // -- mFuelStopsToEndSessionPit
        // -- mFuelStopsToEndSessionInCar
        // -- mFuelInStopPit
        // -- mFuelInStopInCar
        // -- mPitsToEndSessionPit
        // -- mPitsToEndSessionInCar
        data = await this.FuelFactory.getData(data);

        // Apply placement data to crest data
        // - trackPositionCarousel
        data = await this.TrackPositionFactory.getData(data);


        return data;
    }

    /**
     *
     */
    async returnMessage(data) {
        this.worker.postMessage(data);
    }
}

new DataWorker();