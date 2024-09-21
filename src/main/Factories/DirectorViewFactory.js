import { isReady, getParticipantAtIndex, getActiveParticipant, getParticipantInPostion, getParticipantInClassPostion } from '../../utils/CrestUtils';
import { getViewObject } from '../../utils/DataUtils';
import { millisecondsToTime, millisecondsToDelta } from '../../utils/TimeUtils';

/**
 * The asumption with this factory is that all values in data exist.
 * Either as a view ready value or null;
 */
export default class DirectorViewFactory {
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
        view.vDirectorStatus = await this.vDirectorStatus(data);
        view.vData = await this.vData(data);

        return view;
    }

    /**
     *
     * @param {*} data
     * @returns
     */
    async vDirectorStatus(data) {
        if (data.director.view === 'blank') {
            return 0;
        }

        if (data.director.view === 'solo') {
            return 1;
        }

        if (data.director.view === 'leaderboard') {
            return 2;
        }

        if (data.director.view === 'standings') {
            return 3;
        }

        if (data.director.view === 'battle') {
            return 4;
        }

        return 0;
    }

    /**
     *
     * @param {*} data
     * @returns
     */
    async vData(data) {
        //
        if (data.director.view === 'solo') {
            return {
                vNameShort: await this.vNameShort(data, data.director.data.mParticipantIndex),
                vNameTag: await this.vNameTag(data, data.director.data.mParticipantIndex),
                vCarNames: await this.vCarNames(data, data.director.data.mParticipantIndex),
                vRacePosition: await this.vRacePosition(data, data.director.data.mParticipantIndex)
            };
        }

        //
        if (data.director.view === 'leaderboard') {
            const vTimingMode = await this.vTimingMode();

            return {
                vSessionName: await this.vSessionName(data),
                vEventTimeRemaining: await this.vEventTimeRemaining(data),
                vLaps: await this.vLaps(data),
                vTimingMode: vTimingMode,
                vLeaderboard: await this.vLeaderboard(data, data.director.data.mParticipantIndex, vTimingMode, data.director.data.classes),
            };
        }

        //
        if (data.director.view === 'standings') {
            return {
                vStandings: await this.vStandings(data, data.director.data.mParticipantIndex, data.director.data.standings, data.director.data.classIndex, data.director.data.classPageIndex),
            };
        }

        //
        if (data.director.view === 'battle') {
            return {
                vBattle: await this.vBattle(data),
            };
        }
    }

    async vBattle(data) {
        // console.log(data.battles);

    }

    /**
     *
     * @param {*} data
     * @param {*} mParticipantIndex
     * @param {*} standings
     * @param {*} classIndex
     * @param {*} classPageIndex
     * @returns
     */
    async vStandings(data, mParticipantIndex, standings, classIndex, classPageIndex) {
        const mCarClassName = Object.keys(standings)[classIndex];
        const classStandings = standings[mCarClassName];

        const pageParticipants = [];
        for (let ppi = 0; ppi < classStandings.pages[classPageIndex].length; ppi++) {
            const participant = await getParticipantAtIndex(data, classStandings.pages[classPageIndex][ppi]);

            pageParticipants.push({
                vParticipantIndex: getViewObject([
                    {
                        value: participant.mParticipantIndex,
                        additional: participant.mParticipantIndex === mParticipantIndex // is viewed participant
                    }
                ]),
                vRacePosition: getViewObject([
                    {
                        label: participant.mRacePosition
                    }
                ]),
                vCarClassPosition: getViewObject([
                    {
                        label: participant.mCarClassPosition
                    }
                ]),
                vNameTag: getViewObject([
                    {
                        label: participant.mNameTag
                    }
                ]),
                vNameShort: getViewObject([
                    {
                        label: participant.mNameShort
                    }
                ]),
                vCarNamesMain: getViewObject([
                    {
                        label: participant.mCarNamesMain
                    }
                ]),
            });
        }

        return {
            mCarClassName: getViewObject([
                {
                    label: classStandings.mCarClassName
                }
            ]),
            mCarClassColor: getViewObject([
                {
                    value: classStandings.mCarClassColor
                }
            ]),
            participants: pageParticipants
        }
    }

    /**
     *
     * @param {*} data
     * @param {*} mParticipantIndex
     * @param {*} vTimingMode
     * @param {*} classes
     * @returns
     */
    async vLeaderboard(data, mParticipantIndex, vTimingMode, classes) {
        const group = {};

        // prepare classes
        for (const mCarClassName in classes) {
            // assign class structure
            group[mCarClassName] = {
                mCarClassName: getViewObject([
                    {
                        value: classes[mCarClassName].mCarClassName
                    }
                ]),
                mCarClassColor: getViewObject([
                    {
                        value: classes[mCarClassName].mCarClassColor
                    }
                ]),
                participants: []
            };

            // build participants
            for (let cpi = 0; cpi < classes[mCarClassName].participants.length; cpi++) {
                const participant = await getParticipantAtIndex(data, classes[mCarClassName].participants[cpi]);

                group[mCarClassName].participants.push({
                    vParticipantIndex: getViewObject([
                        {
                            value: participant.mParticipantIndex,
                            additional: participant.mParticipantIndex === mParticipantIndex // is viewed participant
                        }
                    ]),
                    vRacePosition: getViewObject([
                        {
                            value: participant.mRacePosition
                        }
                    ]),
                    vCarClassPosition: getViewObject([
                        {
                            value: participant.mCarClassPosition
                        }
                    ]),
                    vNameTag: getViewObject([
                        {
                            value: participant.mNameTag
                        }
                    ]),
                    vNameShort: getViewObject([
                        {
                            value: participant.mNameShort
                        }
                    ]),
                    vTiming: getViewObject([
                        await this.vTiming(data, participant,vTimingMode)
                    ]),
                    vPitModes: getViewObject([
                        {
                            label: participant.mPitModesLabel,
                            value: participant.mPitModes
                        }
                    ]),
                    vPitSchedules: getViewObject([
                        {
                            label: participant.mPitSchedulesLabel,
                            value: participant.mPitSchedules
                        }
                    ]),
                    vOutLap: getViewObject([
                        {
                            label: participant.mOutLapLabel,
                            value: participant.mOutLap
                        }
                    ]),
                });
            }
        }

        return group;
    }

    /**
     *
     * @param {*} data
     * @param {*} participant
     * @param {*} vTimingMode
     * @returns
     */
    async vTiming(data, participant, vTimingMode) {
        if (vTimingMode === 'fastest') {
            return await this.vTimingLead(data, participant);
        }

        if (vTimingMode === 'position-change') {
            return await this.vTimingPositionChange(data, participant);
        }
    }

    /**
     *
     * @param {*} data
     * @param {*} participant
     * @returns
     */
    async vTimingLead(data, participant) {
        if (participant.mLastLapTimes <= 0) {
            return {
                value: '&#x231A;',
                state: 0
            };
        }

        if (participant.mIsNewLap) {
            return {
                value: millisecondsToTime(participant.mLastLapTimes),
                state: participant.mLastLapTimes === participant.mFastestLapTimes ? 2 : 3
            };
        }

        const leader = await getParticipantInClassPostion(data, participant.mParticipantIndex, 1);
        if (leader.mParticipantIndex === participant.mParticipantIndex && participant.mFastestLapTimes > 0) {
            // display 'leader' if in race, otherwise show time
            return {
                value: millisecondsToTime(participant.mFastestLapTimes),
                // value: data.gameStates.mSessionState === 5 ? 'Leader' : millisecondsToTime(participant.mFastestLapTimes),
                state: 1
            };
        }

        return {
            value: millisecondsToDelta(leader.mFastestLapTimes - participant.mFastestLapTimes),
            state: 0
        };
    }

    /**
     *
     * @param {*} data
     * @param {*} participant
     * @returns
     */
    async vTimingPositionChange(data, participant) {
        let change = null;
        let state = 0;
        if (participant.mCarClassPosition < participant.mCarClassPositionStart) {
            change = `&#x2191; ${Math.abs(participant.mCarClassPosition - participant.mCarClassPositionStart)}`;
            state = 2;
        }
        if (participant.mCarClassPosition > participant.mCarClassPositionStart) {
            change = `&#x2193; ${Math.abs(participant.mCarClassPosition - participant.mCarClassPositionStart)}`;
            state = 3;
        }

        return {
            value: change,
            state: state
        };
    }

    /**
     *
     */
    async vTimingMode() {
        // practice
        // qualifying
        // -- fastest

        // racing
        // -- fastest
        // -- position-change
        return 'fastest';
    }

    /**
     *
     * @param {*} data
     * @returns
     */
    async vSessionName(data) {
        if (data.gameStates.mSessionState === 1) {
            return getViewObject([
                {
                    label: 'Practice'
                }
            ]);
        }

        if (data.gameStates.mSessionState === 3) {
            return getViewObject([
                {
                    label: 'Qualifying'
                }
            ]);
        }

        if (data.gameStates.mSessionState === 5) {
            return getViewObject([
                {
                    label: 'Race'
                }
            ]);
        }

        return null;
    }

    /**
     *
     * @param {*} data
     * @returns
     */
    async vLaps(data) {
        const leader = await getParticipantInPostion(data, 1);
        if (leader === null) {
            return null;
        }

        let state = null;

        // is last lap
        if (leader.mCurrentLap === data.eventInformation.mLapsInEvent) {
            state = 1;
        }

        return getViewObject([
            {
                label: 'Lap',
                value: leader.mCurrentLap,
                seperator: '/',
                suffix: data.eventInformation.mLapsInEvent,
                state: state
            }
        ]);
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

        const time = millisecondsToTime(data.eventInformation.mEventTimeRemaining, true);

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
    async vNameShort(data, mParticipantIndex) {
        const participant = await getParticipantAtIndex(data, mParticipantIndex);

        return getViewObject([
            {
                value: participant.mNameShort
            }
        ]);
    }

    /**
     *
     * @param {*} data
     * @returns
     */
    async vNameTag(data, mParticipantIndex) {
        const participant = await getParticipantAtIndex(data, mParticipantIndex);

        return getViewObject([
            {
                value: participant.mNameTag
            }
        ]);
    }

    /**
     *
     * @param {*} data
     * @returns
     */
    async vCarNames(data, mParticipantIndex) {
        const participant = await getParticipantAtIndex(data, mParticipantIndex);

        return getViewObject([
            {
                value: participant.mCarNamesMain
            }
        ]);
    }

    /**
     *
     * @param {*} data
     * @returns
     */
    async vRacePosition(data, mParticipantIndex) {
        const participant = await getParticipantAtIndex(data, mParticipantIndex);

        return getViewObject([
            {
                value: participant.mCarClassPosition
            }
        ]);
    }
}