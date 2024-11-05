import { isReady, getParticipantAtIndex, getActiveParticipant } from '../../utils/CrestUtils';
import { getViewObject } from '../../utils/DataUtils';
import { millisecondsToDelta, millisecondsToTime } from '../../utils/TimeUtils';

/**
 * The asumption with this factory is that all values in data exist.
 * Either as a view ready value or null;
 */
export default class HudViewFactory {
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
            //
        } catch (error) {
            console.error(error);
        }
    }

    /**
     *
     * @param {*} data
     * @returns
     */
    async getData(data) {
        try {
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

        const view = {};

        // we only want to process whats being used by the view

        view.vHudStatus = await this.vHudStatus(data);

        view.vEventTimeRemaining = await this.vEventTimeRemaining(data);
        view.vCurrentLap = await this.vCurrentLap(data);
        view.vCurrentPosition = await this.vCurrentPosition(data);
        view.vClassPosition = await this.vClassPosition(data);

        view.vFuelLevel = await this.vFuelLevel(data);
        view.vFuelInCar = await this.vFuelInCar(data);

        view.vFuelPerLapPit = await this.vFuelPerLapPit(data);
        view.vFuelPerLapInCar = await this.vFuelPerLapInCar(data);
        view.vFuelToEndSessionPit = await this.vFuelToEndSessionPit(data);
        view.vFuelToEndSessionInCar = await this.vFuelToEndSessionInCar(data);
        view.vFuelStopsToEndSessionPit = await this.vFuelStopsToEndSessionPit(data);
        view.vFuelStopsToEndSessionInCar = await this.vFuelStopsToEndSessionInCar(data);
        view.vFuelInStopPit = await this.vFuelInStopPit(data);
        view.vFuelInStopInCar = await this.vFuelInStopInCar(data);

        // view.vFuelPerLap = await this.vFuelPerLap(data);

        // view.vFuelToEndSession = await this.vFuelToEndSession(data);
        // view.vFuelStopsToEndSession = await this.vFuelStopsToEndSession(data);
        // view.vFuelInStop = await this.vFuelInStop(data);

        view.vInputSteering = await this.vInputSteering(data);
        view.vInputClutch = await this.vInputClutch(data);
        view.vInputBrake = await this.vInputBrake(data);
        view.vInputThrottle = await this.vInputThrottle(data);

        view.vTachometer = await this.vTachometer(data);
        view.vKPH = await this.vKPH(data);
        view.vGear = await this.vGear(data);

        view.vABS = await this.vABS(data);
        view.vTC = await this.vTC(data);

        view.vTrackTemperature = await this.vTrackTemperature(data);
        view.vAmbientTemperature = await this.vAmbientTemperature(data);
        view.vWeather = await this.vWeather(data);

        view.vDRS = await this.vDRS(data);
        view.vERS = await this.vERS(data);

        view.vAero = await this.vAero(data);
        view.vClutch = await this.vClutch(data);
        view.vEngine = await this.vEngine(data);

        view.vWaterTemp = await this.vWaterTemp(data);
        view.vOilTemp = await this.vOilTemp(data);

        view.vSuspension0 = await this.vSuspension(data, 0);
        view.vSuspension1 = await this.vSuspension(data, 1);
        view.vSuspension2 = await this.vSuspension(data, 2);
        view.vSuspension3 = await this.vSuspension(data, 3);

        view.vBrake0 = await this.vBrake(data, 0);
        view.vBrake1 = await this.vBrake(data, 1);
        view.vBrake2 = await this.vBrake(data, 2);
        view.vBrake3 = await this.vBrake(data, 3);

        view.vTyre0 = await this.vTyre(data, 0);
        view.vTyre1 = await this.vTyre(data, 1);
        view.vTyre2 = await this.vTyre(data, 2);
        view.vTyre3 = await this.vTyre(data, 3);

        // view.vTrackPositionCarousel = await this.vTrackPositionCarousel(data);
        view.vTrackPosition = await this.vTrackPosition(data);

        view.vSplitTime = await this.vSplitTime(data);
        view.vSplitTimeAhead = await this.vSplitTimeAhead(data);
        view.vSplitTimeBehind = await this.vSplitTimeBehind(data);

        view.vDistanceAhead = await this.vDistanceAhead(data);
        view.vDistanceBehind = await this.vDistanceBehind(data);

        return view;
    }

    /**
     *
     * @param {*} data
     */
    async vDistanceAhead(data) {
        // race hasnt started
        if (data.gameStates.mSessionState !== 5 || data.gameStates.mRaceState !== 2) {
            return null;
        }

        const participant = await getActiveParticipant(data);

        if (participant.mDistanceAhead === null) {
            return null;
        }

        if (participant.mRacingDistance <= 0) {
            return null;
        }

        let value = participant.mDistanceAhead;
        let suffix = '';
        let seperator = '';
        if (typeof participant.mDistanceAhead === 'number') {
            value = participant.mDistanceAhead.toFixed(0);
            suffix = 'm';
            seperator = ' ';
        }
        if (typeof participant.mDistanceAhead === 'string') {
            value = `+${participant.mDistanceAhead}`;
            suffix = 'Laps';
            seperator = ' ';
        }

        return getViewObject([
            {
                label: 'Ahead',
                value: value,
                suffix: suffix,
                seperator: seperator,
            }
        ]);
    }

    /**
     *
     * @param {*} data
     */
    async vDistanceBehind(data) {
        // race hasnt started
        if (data.gameStates.mSessionState !== 5 || data.gameStates.mRaceState !== 2) {
            return null;
        }

        const participant = await getActiveParticipant(data);

        if (participant.mDistanceBehind === null) {
            return null;
        }

        if (participant.mRacingDistance <= 0) {
            return null;
        }

        let value = participant.mDistanceBehind;
        let suffix = '';
        let seperator = '';
        if (typeof participant.mDistanceBehind === 'number') {
            value = participant.mDistanceBehind.toFixed(0);
            suffix = 'm';
            seperator = ' ';
        }
        if (typeof participant.mDistanceBehind === 'string') {
            value = `+${participant.mDistanceBehind}`;
            suffix = 'Laps';
            seperator = ' ';
        }

        return getViewObject([
            {
                label: 'Behind',
                value: value,
                suffix: suffix,
                seperator: seperator,
            }
        ]);
    }

    /**
     *
     * @param {*} data
     */
    async vSplitTime(data) {

        if (data.timings.mSplitTimeDisplay === null) {
            return null;
        }

        if (data.timings.mSplitTimeState === null) {
            return null;
        }

        return getViewObject([
            {
                value: data.timings.mSplitTimeDisplay,
                state: data.timings.mSplitTimeState
            }
        ]);
    }

    /**
     *
     * @param {*} data
     */
    async vSplitTimeAhead(data) {
        // race hasnt started
        if (data.gameStates.mSessionState !== 5 || data.gameStates.mRaceState !== 2) {
            return null;
        }

        const participant = await getActiveParticipant(data);
        if (participant.mRacePosition === 1) {
            return null;
        }

        if (data.timings.mSplitTimeAhead == null) {
            return null;
        }

        let value = data.timings.mSplitTimeAhead;
        let suffix = '';
        let seperator = '';
        let prefix = '+';
        if (typeof data.timings.mSplitTimeAhead === 'number') {
            value = `${prefix}${data.timings.mSplitTimeAhead.toFixed(3)}`;
            suffix = '';
            seperator = '';
        }
        if (typeof data.timings.mSplitTimeAhead === 'string') {
            // value = `${prefix}${data.timings.mSplitTimeAhead}`;
            // suffix = 'Laps';
            // seperator = ' ';

            return null;
        }

        return getViewObject([
            {
                label: 'Ahead',
                value: value,
                suffix: suffix,
                seperator: seperator,
            }
        ]);
    }

    /**
     *
     * @param {*} data
     */
    async vSplitTimeBehind(data) {
        // race hasnt started
        if (data.gameStates.mSessionState !== 5 || data.gameStates.mRaceState !== 2) {
            return null;
        }

        const participant = await getActiveParticipant(data);
        if (participant.mRacePosition === data.participants.mNumActiveParticipants) {
            return null;
        }

        if (data.timings.mSplitTimeBehind == null) {
            return null;
        }

        let value = data.timings.mSplitTimeBehind;
        let suffix = '';
        let seperator = '';
        let prefix = '-';
        if (typeof data.timings.mSplitTimeBehind === 'number') {
            value = `${prefix}${data.timings.mSplitTimeBehind.toFixed(3)}`;
            suffix = '';
            seperator = '';
        }
        if (typeof data.timings.mSplitTimeBehind === 'string') {
            // value = `${prefix}${data.timings.mSplitTimeBehind}`;
            // suffix = 'Laps';
            // seperator = ' ';

            return null;
        }

        return getViewObject([
            {
                label: 'Behind',
                value: value,
                suffix: suffix,
                seperator: seperator,
            }
        ]);
    }

    /**
     *
     * @param {*} data
     * @returns
     */
    async vFuelPerLapPit(data) {
        let value = '&#x231A;&#xfe0e;';
        let suffix = null;

        if (data.fuel.mFuelPerLapPit !== null) {
            value = data.fuel.mFuelPerLapPit.toFixed(2);
            suffix = 'L'
        }

        return getViewObject([
            {
                label: 'Per Lap',
                value: value,
                suffix: suffix,
                seperator: ' '
            }
        ]);
    }

    /**
     *
     * @param {*} data
     * @returns
     */
    async vFuelPerLapInCar(data) {
        let value = '&#x231A;&#xfe0e;';
        let suffix = null;

        if (data.fuel.mFuelPerLapInCar !== null) {
            value = data.fuel.mFuelPerLapInCar.toFixed(2);
            suffix = 'L'
        }

        return getViewObject([
            {
                label: 'Per Lap',
                value: value,
                suffix: suffix,
                seperator: ' ',
            }
        ]);
    }

    /**
     *
     * @param {*} data
     * @returns
     */
    async vFuelToEndSessionPit(data) {
        let value = '&#x231A;&#xfe0e;';
        let suffix = null;

        if (data.fuel.mFuelToEndSessionPit !== null) {
            value = data.fuel.mFuelToEndSessionPit.toFixed(2);
            suffix = 'L'
        }

        return getViewObject([
            {
                label: 'To End',
                value: value,
                suffix: suffix,
                seperator: ' ',
            }
        ]);
    }

    /**
     *
     * @param {*} data
     * @returns
     */
    async vFuelToEndSessionInCar(data) {
        let value = '&#x231A;&#xfe0e;';
        let suffix = null;

        if (data.fuel.mFuelToEndSessionInCar !== null) {
            value = data.fuel.mFuelToEndSessionInCar.toFixed(2);
            suffix = 'L'
        }

        return getViewObject([
            {
                label: 'To End',
                value: value,
                suffix: suffix,
                seperator: ' ',
            }
        ]);
    }

    /**
     *
     * @param {*} data
     * @returns
     */
    async vFuelStopsToEndSessionPit(data) {
        let value = '&#x231A;&#xfe0e;';
        // let suffix = null;

        if (data.fuel.mFuelStopsToEndSessionPit !== null) {
            value = data.fuel.mFuelStopsToEndSessionPit;
            // suffix = 'L'
        }

        return getViewObject([
            {
                label: 'Pit Stops',
                value: value,
                // suffix: suffix,
                seperator: ' ',
            }
        ]);
    }

    /**
     *
     * @param {*} data
     * @returns
     */
    async vFuelStopsToEndSessionInCar(data) {
        let value = '&#x231A;&#xfe0e;';
        // let suffix = null;\

        if (data.fuel.mFuelStopsToEndSessionInCar !== null) {
            value = data.fuel.mFuelStopsToEndSessionInCar;
            // suffix = 'L'
        }

        return getViewObject([
            {
                label: 'Pit Stops',
                value: value,
                // suffix: suffix,
                seperator: ' ',
            }
        ]);
    }

    /**
     *
     * @param {*} data
     * @returns
     */
    async vFuelInStopPit(data) {
        let value = '&#x231A;&#xfe0e;';
        let suffix = null;

        if (data.fuel.mFuelInStopPit !== null) {
            value = Math.ceil(data.fuel.mFuelInStopPit);
            suffix = 'L'
        }

        return getViewObject([
            {
                label: 'Next pit',
                value: value,
                suffix: suffix,
                seperator: ' ',
            }
        ]);
    }

    /**
     *
     * @param {*} data
     * @returns
     */
    async vFuelInStopInCar(data) {
        let value = '&#x231A;&#xfe0e;';
        let suffix = null;

        if (data.fuel.mFuelInStopInCar !== null) {
            value = Math.ceil(data.fuel.mFuelInStopInCar);
            suffix = 'L'
        }

        return getViewObject([
            {
                label: 'Next pit',
                value: value,
                suffix: suffix,
                seperator: ' ',
            }
        ]);
    }



    /**
     *
     * @param {*} data
     * @returns
     */
    async vHudStatus(data) {
        return data.mHudStatus;
    }

    /**
     *
     * @param {*} data
     * @returns
     */
    async vEventTimeRemaining(data) {
        if (data.eventInformation.mEventTimeRemaining === null) {
            return null;
        }

        const time = millisecondsToTime(data.eventInformation.mEventTimeRemaining, false);

        let label = `Remaining`;
        if (data.eventInformation.mAdditionalLap > 0) {
            label += ` [+${data.eventInformation.mAdditionalLap}]`;
        }

        return getViewObject([
            {
                label: label,
                value: time
            }
        ]);
    }

    /**
     *
     * @param {*} data
     * @returns
     */
    async vCurrentLap(data) {
        const participant = await getActiveParticipant(data);

        if (participant.mCurrentLap === null) {
            return null;
        }

        const suffix = data.eventInformation.mLapsInEvent > 0 ? data.eventInformation.mLapsInEvent : null;
        const seperator = data.eventInformation.mLapsInEvent > 0 ? '/' : null;

        return getViewObject([
            {
                label: 'Laps',
                value: participant.mCurrentLap,
                suffix: suffix,
                seperator: seperator
            }
        ]);
    }

    /**
     *
     * @param {*} data
     * @returns
     */
    async vCurrentPosition(data) {
        const participant = await getActiveParticipant(data);

        return getViewObject([
            {
                label: 'Position',
                value: participant.mRacePosition,
                zerofill: data.participants.mNumParticipants.toString().length,
                suffix: data.participants.mNumParticipants - data.participants.mNumNonParticipants,
                seperator: '/'
            }
        ]);
    }x

    /**
     *
     * @param {*} data
     * @returns
     */
    async vClassPosition(data) {
        if (!('mClasses' in data.participants)) {
            return null;
        }

        if (!('mActiveParticipantClassNum' in data.participants)) {
            return null;
        }

        if (Object.keys(data.participants.mClasses).length <= 1) {
            return null;
        }

        const participant = await getActiveParticipant(data);

        if (!('mCarClassPosition' in participant)) {
            return null;
        }

        return getViewObject([
            {
                label: 'Class',
                value: participant.mCarClassPosition,
                zerofill: data.participants.mActiveParticipantClassNum.toString().length,
                suffix: data.participants.mActiveParticipantClassNum,
                seperator: '/'
            }
        ]);
    }

    /**
     *
     * @param {*} data
     * @returns
     */
    async vFuelLevel(data) {
        const participant = await getActiveParticipant(data);
        if (!participant.mIsDriver) {
            return null;
        }

        if (data.fuel.mFuelLevel === null) {
            return null;
        }

        return getViewObject([
            {
                value: data.fuel.mFuelLevel
            }
        ]);
    }

    /**
     *
     * @param {*} data
     * @returns
     */
    async vFuelInCar(data) {
        if (!('mFuelInCar' in data.fuel)) {
            return null;
        }

        if (!('mFuelInCarState' in data.fuel)) {
            return null;
        }

        let value = '&#x231A;&#xfe0e;';
        let suffix = null;

        if (data.fuel.mFuelInCar !== null) {
            value = data.fuel.mFuelInCar.toFixed(2);
            suffix = 'L'
        }

        return getViewObject([
            {
                label: 'In Car',
                value: value,
                suffix: suffix,
                seperator: ' ',
                state: data.fuel.mFuelInCarState
            }
        ]);
    }



    /**
     *
     * @param {*} data
     * @returns
     */
    async vInputSteering(data) {
        const participant = await getActiveParticipant(data);
        if (!participant.mIsDriver) {
            return null;
        }

        if (data.unfilteredInput.mUnfilteredSteering === null) {
            return null;
        }

        if (data.unfilteredInput.mUnfilteredSteeringState === null) {
            return null;
        }

        if (data.unfilteredInput.mUnfilteredSteeringeMax === null) {
            return null;
        }

        return getViewObject([
            {
                value: data.unfilteredInput.mUnfilteredSteering,
                state: data.unfilteredInput.mUnfilteredSteeringState,
                additional: data.unfilteredInput.mUnfilteredSteeringeMax
            }
        ]);
    }

    /**
     *
     * @param {*} data
     * @returns
     */
    async vInputClutch(data) {
        const participant = await getActiveParticipant(data);
        if (!participant.mIsDriver) {
            return null;
        }

        if (data.unfilteredInput.mUnfilteredClutch === null) {
            return null;
        }

        if (data.unfilteredInput.mUnfilteredClutchState === null) {
            return null;
        }

        if (data.unfilteredInput.mUnfilteredClutchMax === null) {
            return null;
        }

        return getViewObject([
            {
                value: data.unfilteredInput.mUnfilteredClutch,
                state: data.unfilteredInput.mUnfilteredClutchState,
                additional: data.unfilteredInput.mUnfilteredClutchMax,
            }
        ]);
    }

    /**
     *
     * @param {*} data
     * @returns
     */
    async vInputBrake(data) {
        const participant = await getActiveParticipant(data);
        if (!participant.mIsDriver) {
            return null;
        }

        if (data.unfilteredInput.mUnfilteredBrake === null) {
            return null;
        }

        if (data.unfilteredInput.mUnfilteredBrakeState === null) {
            return null;
        }

        if (data.unfilteredInput.mUnfilteredBrakeMax === null) {
            return null;
        }

        return getViewObject([
            {
                value: data.unfilteredInput.mUnfilteredBrake,
                state: data.unfilteredInput.mUnfilteredBrakeState,
                additional: data.unfilteredInput.mUnfilteredBrakeMax
            }
        ]);
    }

    /**
     *
     * @param {*} data
     * @returns
     */
    async vInputThrottle(data) {
        const participant = await getActiveParticipant(data);
        if (!participant.mIsDriver) {
            return null;
        }

        if (data.unfilteredInput.mUnfilteredThrottle === null) {
            return null;
        }

        if (data.unfilteredInput.mUnfilteredThrottleState === null) {
            return null;
        }

        if (data.unfilteredInput.mUnfilteredThrottleMax === null) {
            return null;
        }

        return getViewObject([
            {
                value: data.unfilteredInput.mUnfilteredThrottle,
                state: data.unfilteredInput.mUnfilteredThrottleState,
                additional: data.unfilteredInput.mUnfilteredThrottleMax
            }
        ]);
    }

    /**
     *
     * @param {*} data
     * @returns
     */
    async vTachometer(data) {
        const participant = await getActiveParticipant(data);
        if (!participant.mIsDriver) {
            return null;
        }

        if (data.carState.mTachometer === null) {
            return null;
        }

        return getViewObject([
            {
                value: data.carState.mTachometer,
                state: data.carState.mTachometerState
            }
        ]);
    }

    /**
     *
     * @param {*} data
     * @returns
     */
    async vKPH(data) {
        const participant = await getActiveParticipant(data);
        if (!participant.mIsDriver) {
            return null;
        }

        return getViewObject([
            {
                label: 'KPH',
                value: participant.mKPH
            }
        ]);
    }

    /**
     *
     * @param {*} data
     * @returns
     */
    async vGear(data) {
        const participant = await getActiveParticipant(data);
        if (!participant.mIsDriver) {
            return null;
        }

        if (data.carState.mGear === null) {
            return null;
        }

        return getViewObject([
            {
                value: data.carState.mGear
            }
        ]);
    }

    /**
     *
     * @param {*} data
     * @returns
     */
    async vABS(data) {
        const participant = await getActiveParticipant(data);
        if (!participant.mIsDriver) {
            return null;
        }

        if (data.carState.mAntiLockSetting === null) {
            return null;
        }

        if (data.carState.mAntiLockState === null) {
            return null;
        }

        return getViewObject([
            {
                value: data.carState.mAntiLockSetting,
                state: data.carState.mAntiLockState
            }
        ]);
    }

    /**
     *
     * @param {*} data
     * @returns
     */
    async vTC(data) {
        const participant = await getActiveParticipant(data);
        if (!participant.mIsDriver) {
            return null;
        }

        if (data.carState.mTractionControlSetting === null) {
            return null;
        }

        if (data.carState.mTractionControlState === null) {
            return null;
        }

        return getViewObject([
            {
                value: data.carState.mTractionControlSetting,
                state: data.carState.mTractionControlState
            }
        ]);
    }

    /**
     *
     * @param {*} data
     * @returns
     */
    async vTrackTemperature(data) {
        if (data.weather.mTrackTemperature === null) {
            return null;
        }

        return getViewObject([
            {
                value:  data.weather.mTrackTemperature.toFixed(0),
                zerofill: 2,
                suffix: '°'
            }
        ]);
    }


    /**
     *
     * @param {*} data
     * @returns
     */
    async vAmbientTemperature(data) {
        if (data.weather.mAmbientTemperature === null) {
            return null;
        }

        return getViewObject([
            {
                value:  data.weather.mAmbientTemperature.toFixed(0),
                zerofill: 2,
                suffix: '°'
            }
        ]);
    }

    /**
     *
     * @param {*} data
     * @returns
     */
    async vWeather(data) {
        // if (data.weather.mRain === null) {
        //     return null;
        // }

        return getViewObject([
            {
                label: data.weather.mRainDensityLabel,
                value: data.weather.mRainDensity,
                state: data.weather.mRainState
            }
        ]);
    }

    /**
     *
     * @param {*} data
     * @returns
     */
    async vDRS(data) {
        const participant = await getActiveParticipant(data);
        if (!participant.mIsDriver) {
            return null;
        }

        if (data.carState.mDrsState === null) {
            return null;
        }

        if (data.carState.mDrsState === 0) {
            return null;
        }

        return getViewObject([
            {
                label: 'DRS',
                state: data.carState.mDrsState
            }
        ]);
    }

    /**
     *
     * @param {*} data
     * @returns
     */
    async vERS(data) {
        const participant = await getActiveParticipant(data);
        if (!participant.mIsDriver) {
            return null;
        }

        if (data.carState.mErsAvailable === null || data.carState.mErsAvailable === false) {
            return null;
        }

        return getViewObject([
            {
                label: 'ERS',
                value: data.carState.mBoostAmount / 100,
                suffix: data.carState.mErsDeploymentModeLabel,
                state: data.carState.mErsState,
            }
        ]);
    }

    /**
     *
     * @param {*} data
     * @returns
     */
    async vAero(data) {
        const participant = await getActiveParticipant(data);
        if (!participant.mIsDriver) {
            return null;
        }

        if (data.carDamage.mAeroDamageAmount === null) {
            return null;
        }

        if (data.carDamage.mAeroState === null) {
            return null;
        }

        return getViewObject([
            {
                value: data.carDamage.mAeroDamageAmount,
                zerofill: 3,
                suffix: '%',
                state: data.carDamage.mAeroState
            }
        ]);
    }

    /**
     *
     * @param {*} data
     * @returns
     */
    async vClutch(data) {
        const participant = await getActiveParticipant(data);
        if (!participant.mIsDriver) {
            return null;
        }

        if (data.carDamage.mClutchDamageAmount === null) {
            return null;
        }

        return getViewObject([
            {
                value: data.carDamage.mClutchDamageAmount,
                zerofill: 3,
                suffix: '%',
                state: data.carDamage.mClutchState
            }
        ]);
    }
    /**
     *
     * @param {*} data
     * @returns
     */
    async vEngine(data) {
        const participant = await getActiveParticipant(data);
        if (!participant.mIsDriver) {
            return null;
        }

        if (data.carDamage.mEngineDamageAmount === null) {
            return null;
        }

        return getViewObject([
            {
                value: data.carDamage.mEngineDamageAmount,
                zerofill: 3,
                suffix: '%',
                state: data.carDamage.mEngineState
            }
        ]);
    }

    /**
     *
     * @param {*} data
     * @returns
     */
    async vWaterTemp(data) {
        const participant = await getActiveParticipant(data);
        if (!participant.mIsDriver) {
            return null;
        }

        if (data.carState.mWaterTemp === null) {
            return null;
        }

        return getViewObject([
            {
                value: data.carState.mWaterTemp.toFixed(0),
                zerofill: 3,
                suffix: '°',
                state: data.carState.mWaterState
            }
        ]);
    }

    /**
     *
     * @param {*} data
     * @returns
     */
    async vOilTemp(data) {
        const participant = await getActiveParticipant(data);
        if (!participant.mIsDriver) {
            return null;
        }

        if (data.carState.mOilTemp === null) {
            return null;
        }

        return getViewObject([
            {
                value: data.carState.mOilTemp.toFixed(0),
                zerofill: 3,
                suffix: '°',
                state: data.carState.mOilState
            }
        ]);
    }

    /**
     *
     * @param {*} data
     * @returns
     */
    async vSuspension(data, index) {
        const participant = await getActiveParticipant(data);
        if (!participant.mIsDriver) {
            return null;
        }

        if (data.wheelsAndTyres.mSuspensionDamage === null) {
            return null;
        }

        if (data.wheelsAndTyres.mSuspensionDamageState === null) {
            return null;
        }

        return getViewObject([
            {
                value: data.wheelsAndTyres.mSuspensionDamage[index],
                state: data.wheelsAndTyres.mSuspensionDamageState[index]
            }
        ]);
    }

    /**
     *
     * @param {*} data
     * @returns
     */
    async vBrake(data, index) {
        const participant = await getActiveParticipant(data);
        if (!participant.mIsDriver) {
            return null;
        }

        if (data.wheelsAndTyres.mBrakeDamage === null) {
            return null;
        }

        if (data.wheelsAndTyres.mBrakeDamageState === null) {
            return null;
        }

        if (data.wheelsAndTyres.mBrakeTemp === null) {
            return null;
        }

        if (data.wheelsAndTyres.mBrakeTempState === null) {
            return null;
        }

        return getViewObject([
            {
                value: data.wheelsAndTyres.mBrakeDamage[index],
                state: data.wheelsAndTyres.mBrakeDamageState[index]
            },
            {
                value: data.wheelsAndTyres.mBrakeTemp[index].toFixed(0),
                state: data.wheelsAndTyres.mBrakeTempState[index],
                seperator: ' ',
                suffix: '°',
            }
        ]);
    }

    /**
     *
     * @param {*} data
     * @returns
     */
    async vTyre(data, index) {
        const participant = await getActiveParticipant(data);
        if (!participant.mIsDriver) {
            return null;
        }

        if (data.wheelsAndTyres.mTyreWear === null) {
            return null;
        }

        if (data.wheelsAndTyres.mTyreWearState === null) {
            return null;
        }

        if (data.wheelsAndTyres.mTyreCompoundShort === null) {
            return null;
        }

        if (data.wheelsAndTyres.mTyreTemp === null) {
            return null;
        }

        if (data.wheelsAndTyres.mTyreTempState === null) {
            return null;
        }

        if (data.wheelsAndTyres.mAirPressure === null) {
            return null;
        }

        if (data.wheelsAndTyres.mAirPressureState === null) {
            return null;
        }

        return getViewObject([
            {
                value: data.wheelsAndTyres.mTyreWear[index],
                state: data.wheelsAndTyres.mTyreWearState[index]
            },
            {
                value: data.wheelsAndTyres.mTyreCompoundShort[index]
            },
            {
                value: data.wheelsAndTyres.mTyreTemp[index],
                seperator: ' ',
                suffix: '°',
                state: data.wheelsAndTyres.mTyreTempState[index]
            },
            {
                value: data.wheelsAndTyres.mAirPressure[index],
                seperator: ' ',
                suffix: 'B',
                state: data.wheelsAndTyres.mAirPressureState[index]
            }
        ]);
    }

    /**
     *
     * @param {*} data
     * @returns
     */
    async vTrackPosition(data) {
        if (data.trackPosition.length <= 0) {
            return null;
        }

        const activeParticipant = await getActiveParticipant(data);

        const viewObjects = [];

        for (let index = 0; index < data.trackPosition.length; index++) {
            const item = data.trackPosition[index];
            const participant = await getParticipantAtIndex(data, item.mParticipantIndex);

            // show lap time
            let timing = '--:--.---';
            let timing_state = 0;
            if (participant.mLastLapTimes > 0) {
                timing = millisecondsToTime(participant.mLastLapTimes);
            }
            if (participant.mIsNewLap) {
                timing_state = 1;

                if (participant.mLastLapTimes > 0 && participant.mLastLapTimes === participant.mFastestLapTimes) {
                    timing_state = 2;
                }
            }
            if (participant.mOutLap) {
                timing = 'Out Lap';
            }
            if (!participant.mOutLap && participant.mLastLapTimes > 0 && participant.mParticipantIndex == data.participants.mFastestLapParticipantIndex) {
                timing_state = 3;
            }

            // show distance
            let distance = Math.abs(Math.round(item.mDistanceToActiveUser));
            let distance_seperator = ' ';
            let distance_suffix = 'm';
            if (participant.mParticipantIndex === activeParticipant.mParticipantIndex) {
                distance = '';
                distance_seperator = '';
                distance_suffix = '';
            }

            // pit status
            let pit = '';
            if (participant.mPitModes > 0) {
                pit = participant.mPitModesLabel;
            }
            if (participant.mPitSchedules !== 0 && participant.mPitModes === 0) {
                pit = participant.mPitSchedulesLabel;
            }

            viewObjects.push(
                getViewObject([
                    {
                        state: participant.mStatusToUser,
                    },
                    {
                        value: participant.mRacePosition,
                        zerofill: 2,
                    },
                    {
                        label: participant.mNameTag,
                    },
                    {
                        label: participant.mNameShort,
                    },
                    {
                        value: timing,
                        state: timing_state
                    },
                    {
                        value: distance,
                        seperator: distance_seperator,
                        suffix: distance_suffix,
                    },
                    {
                        label: participant.pit,
                    },
                    // {
                    //     label: participant.mNameShort,
                    //     value: participant.mCarClassPosition,
                    //     suffix: participant.mCarClassNamesShort,
                    //     additional: additional,
                    //     additional_seperator: additional_seperator,
                    //     additional_suffix: additional_suffix,
                    //     index: `{${index}}${participant.mParticipantIndex}`,
                    //     state: participant.mStatusToUser,
                    // },
                    // {
                    //     state: item.mStatusToUser
                    // },
                    // {
                    //     label: 'Best',
                    //     value: millisecondsToTime(participant.mFastestLapTimes),
                    // },
                    // {
                    //     label: 'Last',
                    //     value: millisecondsToTime(participant.mLastLapTimes),
                    // },
                    // {
                    //     label: 'Current',
                    //     value: millisecondsToTime(participant.mCurrentLapTimes),
                    // }
                ])
            );
        }

        return viewObjects;
    }

    // /**
    //  *
    //  * @param {*} data
    //  * @returns
    //  */
    // async vTrackPositionCarousel(data) {
    //     if (data.trackPositionCarousel.length <= 0) {
    //         return null;
    //     }

    //     const activeParticipant = await getActiveParticipant(data);

    //     const viewObjects = [];

    //     for (let index = 0; index < data.trackPositionCarousel.length; index++) {
    //         const item = data.trackPositionCarousel[index];
    //         const participant = await getParticipantAtIndex(data, item.mParticipantIndex);

    //         let additional = Math.abs(Math.round(item.mDistanceToActiveUser));
    //         let additional_seperator = ' ';
    //         let additional_suffix = 'm';
    //         if (participant.mParticipantIndex === activeParticipant.mParticipantIndex) {
    //             additional = '';
    //             additional_seperator = '';
    //             additional_suffix = '';
    //         }

    //         viewObjects.push(
    //             getViewObject([
    //                 {
    //                     label: participant.mNameShort,
    //                     value: participant.mCarClassPosition,
    //                     suffix: participant.mCarClassNamesShort,
    //                     additional: additional,
    //                     additional_seperator: additional_seperator,
    //                     additional_suffix: additional_suffix,
    //                     index: `{${index}}${participant.mParticipantIndex}`,
    //                     // state: participant.mCarClassColor,
    //                 },
    //                 {
    //                     state: item.mStatusToUser
    //                 },
    //                 {
    //                     label: 'Best',
    //                     value: millisecondsToTime(participant.mFastestLapTimes),
    //                 },
    //                 {
    //                     label: 'Last',
    //                     value: millisecondsToTime(participant.mLastLapTimes),
    //                 },
    //                 {
    //                     label: 'Current',
    //                     value: millisecondsToTime(participant.mCurrentLapTimes),
    //                 }
    //             ])
    //         );
    //     }

    //     return viewObjects;
    // }

    /**
     *
     * @param {*} data
     * @returns
     */
    async vDirectorShow(data) {
        return null;
    }

    /**
     *
     * @param {*} data
     * @returns
     */
    async vDirectorStatus(data) {
        return null;
    }

    /**
     *
     * @param {*} data
     * @returns
     */
    async vDirectorScene(data) {
        return null;
    }
}