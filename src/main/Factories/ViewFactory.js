import { isReady, getParticipantAtIndex, getActiveParticipant } from '../../utils/CrestUtils';
import { getViewObject } from '../../utils/DataUtils';
import { millisecondsToTime } from '../../utils/TimeUtils';
import { ipcMain } from 'electron';

/**
 * The asumption with this factory is that all values in data exist.
 * Either as a view ready value or null;
 */
export default class ViewFactory {
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
            // console.log('ViewFactory reset');
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

        //
        // ipcMain.emit('dump', data);

        const view = {};

        // we only want to process whats being used by the view

        view.vHudStatus = await this.vHudStatus(data);

        view.vEventTimeRemaining = await this.vEventTimeRemaining(data);
        view.vCurrentLap = await this.vCurrentLap(data);
        view.vCurrentPosition = await this.vCurrentPosition(data);
        view.vClassPosition = await this.vClassPosition(data);

        view.vFuelLevel = await this.vFuelLevel(data);
        view.vFuelInCar = await this.vFuelInCar(data);
        view.vFuelPerLap = await this.vFuelPerLap(data);
        view.vFuelToEndSession = await this.vFuelToEndSession(data);
        view.vFuelStopsToEndSession = await this.vFuelStopsToEndSession(data);
        view.vFuelInStop = await this.vFuelInStop(data);

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

        view.vTrackPositionCarousel = await this.vTrackPositionCarousel(data);

        // view.vDirectorShow = await this.vDirectorShow(data);
        // view.vDirectorStatus = await this.vDirectorStatus(data);
        // view.vDirectorScene = await this.vDirectorScene(data);


        return view;
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
        if (data.eventInformation.mSessionAdditionalLaps > 0) {
            label += ` [+${data.eventInformation.mSessionAdditionalLaps}]`;
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
        if (Object.keys(data.participants.mClasses).length <= 1) {
            return null;
        }

        const participant = await getActiveParticipant(data);

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
        let value = '&#x231A;';
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
            }
        ]);
    }

    /**
     *
     * @param {*} data
     * @returns
     */
    async vFuelPerLap(data) {
        let value = '&#x231A;';
        let suffix = null;

        if (data.fuel.mFuelPerLap !== null) {
            value = data.fuel.mFuelPerLap.toFixed(2);
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
    async vFuelToEndSession(data) {
        let value = '&#x231A;';
        let suffix = null;

        if (data.fuel.mFuelToEndSession !== null) {
            value = (Math.ceil(data.fuel.mFuelToEndSession * 100) / 100).toFixed(2);
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
    async vFuelStopsToEndSession(data) {
        let value = '&#x231A;';

        if (data.fuel.mFuelStopsToEndSession !== null) {
            value = data.fuel.mFuelStopsToEndSession;
        }

        return getViewObject([
            {
                label: 'Pit Stops',
                value: value
            }
        ]);
    }

    /**
     *
     * @param {*} data
     * @returns
     */
    async vFuelInStop(data) {
        let value = '&#x231A;';
        let suffix = null;

        if (data.fuel.mFuelInStop !== null) {
            value = Math.ceil(data.fuel.mFuelInStop);
            suffix = 'L'
        }

        return getViewObject([
            {
                label: 'Next Pit',
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
    async vInputClutch(data) {
        const participant = await getActiveParticipant(data);
        if (!participant.mIsDriver) {
            return null;
        }

        if (data.unfilteredInput.mUnfilteredClutch === null) {
            return null;
        }

        return getViewObject([
            {
                value: data.unfilteredInput.mUnfilteredClutch
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

        return getViewObject([
            {
                value: data.unfilteredInput.mUnfilteredBrake
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

        return getViewObject([
            {
                value: data.unfilteredInput.mUnfilteredThrottle
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

        return getViewObject([
            {
                value: data.carState.mAntiLockSetting,
                state: data.carState.mAntiLockActive
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

        return getViewObject([
            {
                value: data.carState.mTractionControlSetting,
                state: data.carState.mTractionControlActive
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
                value: data.wheelsAndTyres.mTyreTemp[index].toFixed(0),
                seperator: ' ',
                suffix: '°',
                state: data.wheelsAndTyres.mTyreTempState[index]
            },
            {
                value: data.wheelsAndTyres.mAirPressure[index].toFixed(2),
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
    async vTrackPositionCarousel(data) {
        if (data.trackPositionCarousel.length <= 0) {
            return null;
        }

        const viewObjects = [];

        for (let index = 0; index < data.trackPositionCarousel.length; index++) {
            const item = data.trackPositionCarousel[index];
            const participant = await getParticipantAtIndex(data, item.mParticipantIndex);

            viewObjects.push(
                getViewObject([
                    {
                        label: participant.mNameShort,
                        value: participant.mCarClassPosition,
                        suffix: participant.mCarClassNamesShort,
                        additional: Math.abs(Math.round(item.mDistanceToActiveUser)),
                        additional_seperator: ' ',
                        additional_suffix: 'm',
                        index: `{${index}}${participant.mParticipantIndex}`,
                        state: participant.mCarClassColor,
                    },
                    {
                        state: item.mStatusToUser
                    },
                    {
                        label: 'Best',
                        value: millisecondsToTime(participant.mFastestLapTimes),
                    },
                    {
                        label: 'Last',
                        value: millisecondsToTime(participant.mLastLapTimes),
                    },
                    {
                        label: 'Current',
                        value: millisecondsToTime(participant.mCurrentLapTimes),
                    }
                ])
            );
        }

        return viewObjects;
    }

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