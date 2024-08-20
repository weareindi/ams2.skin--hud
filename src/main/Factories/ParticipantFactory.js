import { isReady, getParticipantAtIndex } from '../../utils/CrestUtils';
import stc from "string-to-color";

export default class ParticipantFactory {
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
            this.driverIndex = null;   
            this.hasDriven = false;
            this.hasExitedPitOnce = false;
            this.hasReturnedToGarage = false;
            this.runID = null;
            this.isOutLap = false;
            this.lap = {
                runID: null,
                mCurrentLap: null,
                mCurrentLapTimes: null,
                mLapsInvalidated: null,
                mFuelLevel: null,
            };
            this.laps = [];
        } catch (error) {
            console.error(error);
        }
    }

    /**
     * 
     * @param {*} data 
     * @param {*} mParticipantIndex 
     * @returns 
     */
    async getData(data, mParticipantIndex) {
        try {
            // console.log(this.db);
            return await this.prepareData(data, mParticipantIndex);
        } catch (error) {
            console.error(error);
        }
    }

    /**
     * 
     * @param {*} data 
     * @param {*} mParticipantIndex 
     * @returns 
     */
    async prepareData(data, mParticipantIndex) {        
        const ready = await isReady(data);
        if (!ready) {
            return null;
        }

        let participant = await getParticipantAtIndex(data, mParticipantIndex);
        await this.processHasDriven(data, mParticipantIndex);
        await this.processHasExitedPitLaneState(data, mParticipantIndex);
        await this.processHasReturnedToGarageState(data, mParticipantIndex);
        await this.processCurrentLapState(data, mParticipantIndex);

        participant.mParticipantIndex = mParticipantIndex;

        participant.mCurrentLapTimes = await this.mCurrentLapTimes(data, mParticipantIndex);
        participant.mNameMain = await this.mNameMain(data, mParticipantIndex);
        participant.mNameShort = await this.mNameShort(data, mParticipantIndex);
        participant.mNameTag = await this.mNameTag(data, mParticipantIndex);

        participant.mCarNamesMain = await this.mCarNames(data, mParticipantIndex);
        participant.mCarClassNamesShort = await this.mCarClassNamesShort(data, mParticipantIndex);
        participant.mCarClassColor = await this.mCarClassColor(data, mParticipantIndex);

        participant.mIsDriver = await this.mIsDriver();
        participant.mOutLap = await this.mOutLap();
        participant.mLapsInfo = await this.mLapsInfo();        

        return participant;
    }

    /**
     * 
     * @param {*} data 
     * @param {*} mParticipantIndex 
     */
    async mCarClassNamesShort(data, mParticipantIndex) {
        let participant = await getParticipantAtIndex(data, mParticipantIndex);        

        // split name underscore
        const parts = participant.mCarClassNames.split('_');

        let name = participant.mCarClassNames;
        if (parts) {
            // use first part of name
            name = parts[0];
        }

        // create shortname from first 3 characters of first item 
        let shortname = name.slice(0, 3);

        if (parts) { 
            // remove first part as we've used it 
            parts.shift(); 
 
            // any more parts? add the first character from the next part only 
            if (parts.length) { 
                if (shortname.length === 1) { 
                    shortname += parts[0].slice(0, 3); 
                }
            } 
        }
        
        // make it uppercase
        return shortname.toUpperCase();
    }

    /**
     * 
     * @param {*} data 
     * @param {*} mParticipantIndex 
     */
    async mCarNames(data, mParticipantIndex) {
        let participant = await getParticipantAtIndex(data, mParticipantIndex);  
        
        // split name at capitalscv
        const parts = participant.mCarNames.split('-');

        if (parts) {
            return parts[0].trim();
        }

        return mCarNames;
    }

    /**
     * 
     * @param {*} data 
     * @param {*} mParticipantIndex 
     */
    async mCarClassColor(data, mParticipantIndex) {
        let participant = await getParticipantAtIndex(data, mParticipantIndex);  

        return stc(participant.mCarClassNames);
    }

    /**
     * 
     * @param {*} data 
     * @param {*} mParticipantIndex 
     * @returns 
     */
    async mNameParts(data, mParticipantIndex) {
        let participant = await getParticipantAtIndex(data, mParticipantIndex);

        // extract tag
        const regex = /([\[|\(|\{].*?[\]|\)|\}])/g;

        // prep tag
        let tag = '';

        // get matches
        let matches = regex.exec(participant.mName);
        if (matches !== null) {
            // update tag with match
            tag = matches[0];
        }

        // prepare name
        let name = participant.mName
            .replace(tag, '')
            .replace(/^[-_]+/, '') // remove leading _ or - chars
            .replace(/[-_]+$/, '') // remove trailing _ or - chars
            .replace(/[-_]+/, ' ') // replace underscore in names with space
            ;

        // trim surrounding white space
        name = name.trim();

        return {
            name,
            tag
        }
    }

    /**
     * 
     * @param {*} data 
     * @param {*} mParticipantIndex 
     * @returns 
     */
    async mNameMain(data, mParticipantIndex) {
        const mNameParts = await this.mNameParts(data, mParticipantIndex);

        return mNameParts.name;
    }

    /**
     * 
     * @param {*} data 
     * @param {*} mParticipantIndex 
     * @returns 
     */
    async mNameShort(data, mParticipantIndex) {
        const mNameParts = await this.mNameParts(data, mParticipantIndex);
        const nameSplit = mNameParts.name.split(' ');
        
        let nameShort = '';
        for (let index = 0; index < nameSplit.length - 1; index++) {
            const nameSplitPart = nameSplit[index];
            nameShort += `${nameSplitPart[0]}. `;
        }

        nameShort += nameSplit[nameSplit.length-1];

        return nameShort;
    }

    /**
     * 
     * @param {*} data 
     * @param {*} mParticipantIndex 
     * @returns 
     */
    async mNameTag(data, mParticipantIndex) {
        const mNameParts = await this.mNameParts(data, mParticipantIndex);

        const mNameTag = mNameParts.tag.slice(1, -1);

        if (!mNameTag.length) {
            return null;
        }

        return mNameTag;
    }

    /**
     * 
     * @param {*} data 
     * @returns 
     */ 
    async processHasDriven(data, mParticipantIndex) {
        if (data.participants.mViewedParticipantIndex !== mParticipantIndex) {
            return this.hasDriven = false;
        }

        // update driver index when ever we are in the car
        if (
            data.unfilteredInput.mUnfilteredThrottle !== 0
            || data.unfilteredInput.mUnfilteredBrake !== 1
            // || data.unfilteredInput.mUnfilteredSteering !== 0
            || data.unfilteredInput.mUnfilteredClutch !== 0
        ) {            
            this.driverIndex = data.participants.mViewedParticipantIndex;
        }

        // if we have a driver index and driver index is same as participant
        if (this.driverIndex !== null && this.driverIndex === data.participants.mViewedParticipantIndex) {
            // ... its almost certainly the current driver rather than a monitored driver
            return this.hasDriven = true;
        }

        return this.hasDriven = false;
    }

    /**
     * 
     */
    async mIsDriver() {
        return this.hasDriven;
    }

    /**
     * 
     * @param {*} data 
     * @param {*} mParticipantIndex 
     */
    async processHasExitedPitLaneState(data, mParticipantIndex) {
        if (this.hasExitedPitOnce) {
            return this.hasExitedPitOnce;
        }

        const currentLap = await this.getCurrentLap(data, mParticipantIndex);        

        if (currentLap.mCurrentLapTimes < 0) {
            return this.hasExitedPitOnce;
        }

        return this.hasExitedPitOnce = true;
    }


    /**
     * 
     * @param {*} data 
     * @param {*} mParticipantIndex 
     */
    async processHasReturnedToGarageState(data, mParticipantIndex) {
        const participant = await getParticipantAtIndex(data, mParticipantIndex);

        if (!this.hasExitedPitOnce) {
            return this.hasReturnedToGarage;
        }

        if (participant.mPitModes === 4 || participant.mPitModes === 5) {
            return this.hasReturnedToGarage = true;
        }

        return this.hasReturnedToGarage;
    }

    /**
     * 
     * @param {*} data 
     * @param {*} mParticipantIndex 
     */
    async processCurrentLapState(data, mParticipantIndex) {
        const participant = await getParticipantAtIndex(data, mParticipantIndex);
        const currentLap = await this.getCurrentLap(data, mParticipantIndex);

        // if in the garage
        if (participant.mPitModes === 4 || participant.mPitModes === 5) {
            this.isOutLap = true;
        }

        // if participant has exited the pit
        // and has not returned to circuit (first time out)
        // and is on the circuit
        // and the current lap is the same as stored lap despite going over the line (this happens on the first flying lap)
        // and the lap is not invalid (laps are invalid when leaving the pits for first time)
        if (
            this.hasExitedPitOnce
            && !this.hasReturnedToGarage
            && participant.mPitModes === 0
            && currentLap.mCurrentLap === this.lap.mCurrentLap
            && !currentLap.mLapsInvalidated
        ) {
            // ... set outlap to false
            this.isOutLap = false;
        }

        // if participant has exited the pit
        // and has returned to circuit (second+ time out)
        // and is on the circuit
        // and the current lap is greater than stored lap (starting a new lap)
        // and the lap is not invalid
        if (
            this.hasExitedPitOnce
            && this.hasReturnedToGarage
            && participant.mPitModes === 0
            && currentLap.mCurrentLap > this.lap.mCurrentLap
            && !currentLap.mLapsInvalidated
        ) {
            // ... set outlap to false
            this.isOutLap = false;
        }

        if (
            this.runID !== null
            && this.lap.mCurrentLap !== null
            && currentLap.mCurrentLap > this.lap.mCurrentLap
        ) {
            // add stored lap to laps array
            this.laps.push( this.lap );
        }
        
        // update stored lap with current lap data
        this.lap = currentLap;
    }

    /**
     * 
     * @param {*} data 
     * @param {*} mParticipantIndex 
     */
    async getCurrentLap(data, mParticipantIndex) {
        const participant = await getParticipantAtIndex(data, mParticipantIndex);       

        return {
            runID: await this.getRunID(data, mParticipantIndex),
            mCurrentLap: participant.mCurrentLap,
            mCurrentLapTimes: await this.mCurrentLapTimes(data, mParticipantIndex),
            mLapsInvalidated: participant.mLapsInvalidated,
            mFuelLevel: await this.mFuelLevel(data, mParticipantIndex),
        }
    }

    /**
     * 
     * @param {*} data 
     */
    async mFuelLevel(data) {
        if (this.driverIndex !== null && this.driverIndex === data.participants.mViewedParticipantIndex) {
            return data.carState.mFuelLevel;
        } 

        return null;
    }

    /**
     * 
     * @param {*} data 
     * @param {*} mParticipantIndex 
     */
    async getRunID(data, mParticipantIndex) {
        const participant = await getParticipantAtIndex(data, mParticipantIndex);

        if (participant.mPitModes !== 0) {       
            return await this.generateRunID(participant);
        }

        if (this.runID === null) {            
            return await this.generateRunID(participant);
        }
        
        return this.runID;
    }

    /**
     * Get a new run ID
     * @returns 
     */
    async generateRunID(participant) {        
        // nothing complex, just the current timestamp
        return this.runID = Date.now();
    }

    /**
     * 
     * @param {*} data 
     * @param {*} mParticipantIndex 
     */
    async mCurrentLapTimes(data, mParticipantIndex) {
        const participant = await getParticipantAtIndex(data, mParticipantIndex);

        const mCurrentSectorTimes = [
            participant.mCurrentSector1Times,
            participant.mCurrentSector2Times,
            participant.mCurrentSector3Times,
        ];

        let mCurrentLapTimes = 0;
        for (let csti = 0; csti <= participant.mCurrentSector; csti++) {
            mCurrentLapTimes += mCurrentSectorTimes[csti];
        }

        if (mCurrentLapTimes < 0) {
            return -1;
        }

        return mCurrentLapTimes;
        
    }

    /**
     * 
     */
    async mLapsInfo() {
       return this.laps;
    }

    /**
     * 
     */
    async mOutLap() {
       return this.isOutLap;
    }
}