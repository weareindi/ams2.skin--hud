import { isReady } from '../../utils/CrestUtils';
import { ipcMain } from 'electron';
import { execFile } from 'child_process';
import crest2 from '../../../resources/crest2/CREST2.exe?asset';

import SettingsController from './SettingsController';
import MockDataController from './MockDataController';

import ParticipantsFactory from '../Factories/ParticipantsFactory';
import TrackPositionFactory from '../Factories/TrackPositionFactory';
import EventInformationFactory from '../Factories/EventInformationFactory';
import CarStateFactory from '../Factories/CarStateFactory';
import CarDamageFactory from '../Factories/CarDamageFactory';
import WeatherFactory from '../Factories/WeatherFactory';
import WheelsAndTyresFactory from '../Factories/WheelsAndTyresFactory';
import FuelFactory from '../Factories/FuelFactory';
import BattleFactory from '../Factories/BattleFactory';
import DirectorFactory from '../Factories/DirectorFactory';
import ViewFactory from '../Factories/ViewFactory';

export default class CrestController {
    constructor() {
        // singleton
        if (typeof global.CrestController !== 'undefined') {
            return global.CrestController;
        }
        global.CrestController = this;

        this.init();
    }

    /**
     *
     */
    async init() {
        try {
            await this.registerSettingsController();
            await this.processInitialState();
            await this.registerFactories();
            await this.doTimer();
        } catch (error) {
            console.log(error);
        }
    }

    /**
     *
     */
    async registerFactories() {
        this.ParticipantsFactory = new ParticipantsFactory();
        this.TrackPositionFactory = new TrackPositionFactory();
        this.EventInformationFactory = new EventInformationFactory();
        this.CarStateFactory = new CarStateFactory();
        this.CarDamageFactory = new CarDamageFactory();
        this.WeatherFactory = new WeatherFactory();
        this.WheelsAndTyresFactory = new WheelsAndTyresFactory();
        this.FuelFactory = new FuelFactory();
        this.BattleFactory = new BattleFactory();
        this.DirectorFactory = new DirectorFactory();
        this.ViewFactory = new ViewFactory();
    }

    /**
     *
     */
    async resetProcessors() {
        this.ParticipantsFactory.reset();
        this.TrackPositionFactory.reset();
        this.EventInformationFactory.reset();
        this.CarStateFactory.reset();
        this.CarDamageFactory.reset();
        this.WeatherFactory.reset();
        this.WheelsAndTyresFactory.reset();
        this.FuelFactory.reset();
        this.BattleFactory.reset();
        this.DirectorFactory.reset();
        this.ViewFactory.reset();
    }

    /**
     *
     * @param {*} ExternalCrest
     * @returns
     */
    async toggle(ExternalCrest) {
        if (!ExternalCrest) {
            return await this.openCrest();
        }

        return await this.closeCrest();
    }

    /**
     *
     */
    async registerSettingsController() {
        this.SettingsController = new SettingsController();
    }

    /**
     *
     */
    async processInitialState() {
        const ExternalCrest = await this.SettingsController.get('ExternalCrest');
        if (ExternalCrest) {
            return;
        }

        this.openCrest();
    }

    /**
     *
     */
    async getVariables() {
        const ExternalCrest = await this.SettingsController.get('ExternalCrest');
        const TickRate = await this.SettingsController.get('TickRate');
        const IP = ExternalCrest ? await this.SettingsController.get('IP') : '127.0.0.1';
        const Port = ExternalCrest ? await this.SettingsController.get('Port') : '8881';
        const MockFetch = await this.SettingsController.get('MockFetch');
        const MockState = await this.SettingsController.get('MockState');

        return {
            TickRate,
            IP,
            Port,
            MockFetch,
            MockState,
        }
    }

    /**
     *
     */
    async doTimer() {
        const { TickRate, IP, Port, MockFetch, MockState } = await this.getVariables();

        let data = {};

        if (MockFetch) {
            data = await this.fetchMockDataController(MockState);
        } else {
            data = await this.fetchData(IP, Port);
        }

        // update connected state
        await this.setConnectedState(data);

        //
        ipcMain.emit('data', data);

        // handle sleep/delay before next iteration

        // let interval = 2000;
        let interval = 1000 / TickRate;
        if (data === null) {
            interval = 1000;
        }
        await this.sleep(interval);

        // do next iteration
        await this.doTimer();

    }

    /**
     *
     */
    async setConnectedState(data) {
        const ConnectedCurrent = await this.SettingsController.get('Connected');

        let Connected = false;
        if (data !== null) {
            Connected = true;
        }

        // if already stored, do nothing
        if (Connected === ConnectedCurrent) {
            return;
        }

        ipcMain.emit('setSetting', 'Connected', Connected);
    }

    /**
     *
     * @param {*} ms
     */
    async sleep(ms) {
        await new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     *
     * @param {*} MockState
     */
    async fetchMockDataController(MockState) {
        const json = await (new MockDataController()).data(MockState);

        // if we got here we should have good data
        const data = await this.processData( json );
        return await this.processView(data);
    }

    /**
     * Fetch data from crest worker
     */
    async fetchData(IP, Port) {
        if (!IP) {
            return null;
        }

        if (!Port) {
            return null;
        }

        // init fetch request
        const url = `http://${IP}:${Port}/crest2/v1/api`;

        // fetch the data
        const response = await fetch(url,
            {
                signal: AbortSignal.timeout(1000),
                // headers: {
                    // "Content-Type": "application/json",
                    // 'Accept-Encoding': 'gzip'
                // }
            }).catch(async (error) => {
                return null;
            });

        // no response?
        if (!response) {
            // .. bail and return a message to parent
            return null;
        }

        // validate response
        const valid = await this.validate(response);

        if (!valid) {
            // .. bail and return a message to parent
            return null;
        }

        const json = await this.getJson(response);

        // if we got here we should have good data
        const data = await this.processData( json );
        return await this.processView(data);
    }

    /**
     * Do we have valid data?
     * @param {*} fetchResponse
     * @returns boolean
     */
    async validate(fetchResponse) {
        // clone the response to main so our events in this method don't contaminate main thread
        const response = fetchResponse.clone();

        if (response.status !== 200) {
            return false;
        }

        // get text from response
        let textResponse = await response.text();

        // prep for json
        let passedJson;

        // is it json?
        try {
            passedJson = JSON.parse( textResponse.replace(/(?:\r\n|\r|\n)/g, '') );
        } catch (e) {
            return false;
        }

        // do we have a timestamp in the response? probably valid then
        if (!('timestamp' in passedJson)) {
            return false;
        }

        return true;
    }

    /**
     *
     */
    async getJson(fetchResponse) {
        const response = fetchResponse.clone();

        if (response.status !== 200) {
            return false;
        }

        // get text from response
        let textResponse = await response.text();

        return await JSON.parse( textResponse.replace(/(?:\r\n|\r|\n)/g, '') );
    }

    /**
     * Open Crest2
     */
    async openCrest() {
        if (process.platform === 'win32') {
            try {
                if (typeof this.crest !== 'undefined') {
                    await this.closeCrest();
                }

                const { Port } = await this.getVariables();

                return this.crest = execFile(crest2, ['-p', Port]);
            } catch (error) {
                console.error(error);
                return null;
            }
        }
    }

    /**
     * Close Crest2
     */
    async closeCrest() {
        this.crest.kill();
        delete this.crest;
        return;
    }

    /**
     * Prepare data for all frontend views
     * @param {*} data
     * @returns
     */
    async processData(data) {

        const ready = await isReady(data);
        if (!ready) {
            await this.ParticipantsFactory.reset();
            await this.EventInformationFactory.reset();
            await this.CarStateFactory.reset();
            await this.FuelFactory.reset();
            await this.TrackPositionFactory.reset();
            await this.BattleFactory.reset();
            await this.DirectorFactory.reset();
            return null;
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

        // Apply fuel calculations (requires participant/mLapsInfo and additional eventInformation to be populated)
        // - fuel
        // -- mFuelCapacity
        // -- mFuelLevel
        // -- mFuelPerLap
        // -- mFuelStopsToEndSession
        // -- mFuelInStop
        // -- mPitsToEndSession
        data = await this.FuelFactory.getData(data);

        // Apply placement data to crest data
        // - trackPositionCarousel
        // - participants/mParticipantInfo/Array
        // -- mRacingDistance
        // -- mPlacementIndex
        // -- mDistanceToActiveUser
        data = await this.TrackPositionFactory.getData(data);

        // Apply on track battle data to crest data
        // - battle
        // -- aheadParticipantIndex
        // -- behindParticipantIndex
        // -- distance
        // -- duration
        // - participants/mParticipantInfo/Array
        // -- mBattlingParticipantAhead
        // -- mBattlingParticipantBehind
        data = await this.BattleFactory.getData(data);

        // Director
        // - Director
        data = await this.DirectorFactory.getData(data);

        return data;
    }

    /**
     *
     * @param {*} data
     */
    async processView(data) {
        const ready = await isReady(data);
        if (!ready) {
            await this.ViewFactory.reset();
            return null;
        }

        return await this.ViewFactory.getData(data);
    }
}