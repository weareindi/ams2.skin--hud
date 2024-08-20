import SettingsVariables from '../variables/SettingsVariables';
import { ipcMain } from 'electron';
import { execFile } from 'child_process';
import crest2 from '../../resources/crest2/CREST2.exe?asset';
import MockData from './MockData';
import { isReady, getActiveParticipant } from '../utils/CrestUtils';

import ParticipantsFactory from './Factories/ParticipantsFactory';
import TrackPositionFactory from './Factories/TrackPositionFactory';
import EventTimingsFactory from './Factories/EventTimingsFactory';
import FuelFactory from './Factories/FuelFactory';
import BattleFactory from './Factories/BattleFactory';
import DirectorFactory from './Factories/DirectorFactory';

export default class CrestProcessor {
    constructor() {
        // singleton
        if (typeof global.CrestProcessor !== 'undefined') {
            return global.CrestProcessor;
        }
        global.CrestProcessor = this;

        this.init();
    }

    /**
     * 
     */
    async init() {
        try {
            await this.registerSettingsVariables();
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
        this.EventTimingsFactory = new EventTimingsFactory();
        this.FuelFactory = new FuelFactory();
        this.BattleFactory = new BattleFactory();
        this.DirectorFactory = new DirectorFactory();
    }

    /**
     * 
     */
    async resetProcessors() {
        this.ParticipantsFactory.reset();
        this.TrackPositionFactory.reset();
        this.EventTimingsFactory.reset();
        this.FuelFactory.reset();
        this.BattleFactory.reset();
        this.DirectorFactory.reset();
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
    async registerSettingsVariables() {
        this.SettingsVariables = new SettingsVariables();
    }

    /**
     * 
     */
    async processInitialState() {
        const ExternalCrest = await this.SettingsVariables.get('ExternalCrest');
        if (ExternalCrest) {
            return;
        }

        this.openCrest();
    }

    /**
     * 
     */
    async getVariables() {
        const ExternalCrest = await this.SettingsVariables.get('ExternalCrest');
        const TickRate = await this.SettingsVariables.get('TickRate');
        const IP = ExternalCrest ? await this.SettingsVariables.get('IP') : '127.0.0.1';
        const Port = ExternalCrest ? await this.SettingsVariables.get('Port') : '8881';
        const MockFetch = await this.SettingsVariables.get('MockFetch');
        const MockState = await this.SettingsVariables.get('MockState');

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
            data = await this.fetchMockData(MockState);
        } else {
            data = await this.fetchData(IP, Port);
        }        

        // update connected state
        await this.setConnectedState(data);

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
        const ConnectedCurrent = await this.SettingsVariables.get('Connected');

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
    async fetchMockData(MockState) {
        const json = await (new MockData()).data(MockState);

        // if we got here we should have good data
        return await this.processData( json );
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
        return await this.processData( json );
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
            await this.EventTimingsFactory.reset();
            await this.FuelFactory.reset();
            return null;
        }
        
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

        // Apply better, more usable timings to crest data
        data = await this.EventTimingsFactory.getData(data);

        // Apply fuel calculations (requires participant/mLapsInfo and eventTimings to be populated)
        // - fuel
        // -- mFuelCapacity
        // -- mFuelLevel
        // -- mFuelPerLap
        // -- mFuelToEndSession
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

        // console.log(data.director);
        
        
        return data;
    }
}