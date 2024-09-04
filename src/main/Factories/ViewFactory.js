import { isReady, getParticipantAtIndex, getActiveParticipant } from '../../utils/CrestUtils';
import { getViewObject } from '../../utils/DataUtils';
import { millisecondsToTime } from '../../utils/TimeUtils';

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

        view.vHudShow = await this.vHudShow(data);
        view.vHudStatus = await this.vHudStatus(data);

        view.vEventTimeRemaining = await this.vEventTimeRemaining(data);
        view.vCurrentLap = await this.vCurrentLap(data);
        view.vCurrentPosition = await this.vCurrentPosition(data);
        view.vClassPosition = await this.vClassPosition(data);

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
        view.vRain = await this.vRain(data);

        view.vDRS = await this.vDRS(data);
        view.vERS = await this.vERS(data);

        view.vAero = await this.vAero(data);
        view.vClutch = await this.vClutch(data);
        view.vEngine = await this.vEngine(data);

        view.vWaterTemp = await this.vWaterTemp(data);
        view.vOilTemp = await this.vOilTemp(data);

        view.vSuspensionFL = await this.vSuspensionFL(data);
        view.vSuspensionFR = await this.vSuspensionFR(data);
        view.vSuspensionRL = await this.vSuspensionRL(data);
        view.vSuspensionRR = await this.vSuspensionRR(data);

        view.vBrakeFL = await this.vBrakeFL(data);
        view.vBrakeFR = await this.vBrakeFR(data);
        view.vBrakeRL = await this.vBrakeRL(data);
        view.vBrakeRR = await this.vBrakeRR(data);

        view.vTyreFL = await this.vTyreFL(data);
        view.vTyreFR = await this.vTyreFR(data);
        view.vTyreRL = await this.vTyreRL(data);
        view.vTyreRR = await this.vTyreRR(data);

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
    async vHudShow(data) {
        return null;
    }

    /**
     *
     * @param {*} data
     * @returns
     */
    async vHudStatus(data) {
        return 'incar';
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

        const time = millisecondsToTime(data.eventInformation.mEventTimeRemaining);

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

        return getViewObject([
            {
                label: 'Laps',
                value: participant.mCurrentLap,
                suffix: suffix,
                seperator: '/'
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
                suffix: data.participants.mNumParticipants,
                seperator: '/'
            }
        ]);
    }

    /**
     *
     * @param {*} data
     * @returns
     */
    async vClassPosition(data) {
        const participant = await getActiveParticipant(data);

        return getViewObject([
            {
                label: 'Class',
                value: participant.mCarClassPosition,
                zerofill: data.participants.mNumClassParticipants.toString().length,
                suffix: data.participants.mNumClassParticipants,
                seperator: '/'
            }
        ]);
    }

    /**
     *
     * @param {*} data
     * @returns
     */
    async vFuelInCar(data) {
        const participant = await getActiveParticipant(data);
        if (!participant.mIsDriver) {
            return null;
        }

        return getViewObject([
            {
                label: 'In Car',
                value: data.fuel.mFuelInCar
            }
        ]);
    }

    /**
     *
     * @param {*} data
     * @returns
     */
    async vFuelPerLap(data) {
        const participant = await getActiveParticipant(data);
        if (!participant.mIsDriver) {
            return null;
        }

        return getViewObject([
            {
                label: 'Per Lap',
                value: data.fuel.mFuelPerLap
            }
        ]);
    }

    /**
     *
     * @param {*} data
     * @returns
     */
    async vFuelToEndSession(data) {
        const participant = await getActiveParticipant(data);
        if (!participant.mIsDriver) {
            return null;
        }

        return getViewObject([
            {
                label: 'To End',
                value: data.fuel.mFuelToEndSession
            }
        ]);
    }

    /**
     *
     * @param {*} data
     * @returns
     */
    async vFuelStopsToEndSession(data) {
        const participant = await getActiveParticipant(data);
        if (!participant.mIsDriver) {
            return null;
        }

        return getViewObject([
            {
                label: 'Pit Stops',
                value: data.fuel.mFuelStopsToEndSession
            }
        ]);
    }

    /**
     *
     * @param {*} data
     * @returns
     */
    async vFuelInStop(data) {
        const participant = await getActiveParticipant(data);
        if (!participant.mIsDriver) {
            return null;
        }

        return getViewObject([
            {
                label: 'Pit Fuel',
                value: data.fuel.mFuelInStop
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

        return getViewObject([
            {
                value: data.carState.mTachometer
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

        return getViewObject([
            {
                label: 'KPH',
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
        return getViewObject([
            {
                value:  data.weather.mTrackTemperature,
                zerofill: 3,
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
        return getViewObject([
            {
                value:  data.weather.mAmbientTemperature,
                zerofill: 3,
                suffix: '°'
            }
        ]);
    }

    /**
     *
     * @param {*} data
     * @returns
     */
    async vRain(data) {
        return getViewObject([
            {
                label: data.weather.mRain,
                value: data.weather.mRainDensity
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

        return getViewObject([
            {
                label: 'ERS',
                value: data.carState.mBoostAmount,
                suffix: data.carState.mErsDeploymentModeLabel,
                state: data.carState.mErsState
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

        return getViewObject([
            {
                value: data.carDamage.mAeroDamage,
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

        return getViewObject([
            {
                value: data.carDamage.mClutchDamage,
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

        return getViewObject([
            {
                value: data.carDamage.mEngineDamage,
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

        return getViewObject([
            {
                value: data.carState.mWaterTemp,
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

        return getViewObject([
            {
                value: data.carState.mOilTemp,
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
    async vSuspensionFL(data) {
        const participant = await getActiveParticipant(data);
        if (!participant.mIsDriver) {
            return null;
        }

        return getViewObject([
            {
                value: data.wheelsAndTyres.mSuspensionDamage[0],
                zerofill: 3,
                state: data.wheelsAndTyres.mSuspensionDamageState[0]
            }
        ]);
    }

    /**
     *
     * @param {*} data
     * @returns
     */
    async vSuspensionFR(data) {
        const participant = await getActiveParticipant(data);
        if (!participant.mIsDriver) {
            return null;
        }

        return getViewObject([
            {
                value: data.wheelsAndTyres.mSuspensionDamage[1],
                zerofill: 3,
                state: data.wheelsAndTyres.mSuspensionDamageState[1]
            }
        ]);
    }

    /**
     *
     * @param {*} data
     * @returns
     */
    async vSuspensionRL(data) {
        const participant = await getActiveParticipant(data);
        if (!participant.mIsDriver) {
            return null;
        }

        return getViewObject([
            {
                value: data.wheelsAndTyres.mSuspensionDamage[2],
                zerofill: 3,
                state: data.wheelsAndTyres.mSuspensionDamageState[2]
            }
        ]);
    }

    /**
     *
     * @param {*} data
     * @returns
     */
    async vSuspensionRR(data) {
        const participant = await getActiveParticipant(data);
        if (!participant.mIsDriver) {
            return null;
        }

        return getViewObject([
            {
                value: data.wheelsAndTyres.mSuspensionDamage[3],
                zerofill: 3,
                state: data.wheelsAndTyres.mSuspensionDamageState[3]
            }
        ]);
    }

    /**
     *
     * @param {*} data
     * @returns
     */
    async vBrakeFL(data) {
        const participant = await getActiveParticipant(data);
        if (!participant.mIsDriver) {
            return null;
        }

        return getViewObject([
            {
                value: data.wheelsAndTyres.mBrakeDamage[0],
                zerofill: 3,
                state: data.wheelsAndTyres.mBrakeDamageState[0]
            }
        ]);
    }

    /**
     *
     * @param {*} data
     * @returns
     */
    async vBrakeFR(data) {
        const participant = await getActiveParticipant(data);
        if (!participant.mIsDriver) {
            return null;
        }

        return getViewObject([
            {
                value: data.wheelsAndTyres.mBrakeDamage[1],
                zerofill: 3,
                state: data.wheelsAndTyres.mBrakeDamageState[1]
            }
        ]);
    }

    /**
     *
     * @param {*} data
     * @returns
     */
    async vBrakeRL(data) {
        const participant = await getActiveParticipant(data);
        if (!participant.mIsDriver) {
            return null;
        }

        return getViewObject([
            {
                value: data.wheelsAndTyres.mBrakeDamage[2],
                zerofill: 3,
                state: data.wheelsAndTyres.mBrakeDamageState[2]
            }
        ]);
    }

    /**
     *
     * @param {*} data
     * @returns
     */
    async vBrakeRR(data) {
        const participant = await getActiveParticipant(data);
        if (!participant.mIsDriver) {
            return null;
        }

        return getViewObject([
            {
                value: data.wheelsAndTyres.mBrakeDamage[3],
                zerofill: 3,
                state: data.wheelsAndTyres.mBrakeDamageState[3]
            }
        ]);
    }

    /**
     *
     * @param {*} data
     * @returns
     */
    async vTyreFL(data) {
        const participant = await getActiveParticipant(data);
        if (!participant.mIsDriver) {
            return null;
        }

        return getViewObject([
            {
                value: data.wheelsAndTyres.mTyreWear[0],
                zerofill: 3,
                state: data.wheelsAndTyres.mTyreWearState[0]
            }
        ]);
    }

    /**
     *
     * @param {*} data
     * @returns
     */
    async vTyreFR(data) {
        const participant = await getActiveParticipant(data);
        if (!participant.mIsDriver) {
            return null;
        }

        return getViewObject([
            {
                value: data.wheelsAndTyres.mTyreWear[1],
                zerofill: 3,
                state: data.wheelsAndTyres.mTyreWearState[1]
            },
            {
                value: data.wheelsAndTyres.mTyreTemp[1],
                zerofill: 3,
                state: data.wheelsAndTyres.mTyreTempState[1]
            }
        ]);
    }

    /**
     *
     * @param {*} data
     * @returns
     */
    async vTyreRL(data) {
        const participant = await getActiveParticipant(data);
        if (!participant.mIsDriver) {
            return null;
        }

        return getViewObject([
            {
                value: data.wheelsAndTyres.mTyreWear[2],
                zerofill: 3,
                state: data.wheelsAndTyres.mTyreWearState[2]
            }
        ]);
    }

    /**
     *
     * @param {*} data
     * @returns
     */
    async vTyreRR(data) {
        const participant = await getActiveParticipant(data);
        if (!participant.mIsDriver) {
            return null;
        }

        return getViewObject([
            {
                value: data.wheelsAndTyres.mTyreWear[3],
                zerofill: 3,
                state: data.wheelsAndTyres.mTyreWearState[3]
            }
        ]);
    }

    /**
     *
     * @param {*} data
     * @returns
     */
    async vTrackPositionCarousel(data) {
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
                        additional: item.mDistanceToActiveUser
                    },
                    {
                        status: item.mStatusToUser
                    },
                    {
                        label: 'Best',
                        value: participant.mFastestLapTimes,
                    },
                    {
                        label: 'Last',
                        value: participant.mLastLapTimes,
                    },
                    {
                        label: 'Current',
                        value: participant.mCurrentLapTimes,
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