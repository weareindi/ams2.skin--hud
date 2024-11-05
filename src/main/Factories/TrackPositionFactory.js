import { isReady, getActiveParticipant, getParticipantsSortedByLapDistance } from '../../utils/CrestUtils';

export default class TrackPositionFactory {
    constructor() {
        this.limit = 10;

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

        data.trackPosition = await this.trackPosition(data);
        // data.trackPositionCarousel = await this.trackPositionCarousel(data);

        return data;
    }

    /**
     * Get nearest 6 drivers
     * @param {*} data
     */
    async trackPosition(data) {
        let participants = await getParticipantsSortedByLapDistance(data);
        const activeParticipant = await getActiveParticipant(data);

        // reduce to active participants
        participants = participants.filter((participant) => {
            // if is driver, definitely keep
            if (participant.mParticipantIndex === activeParticipant.mParticipantIndex) {
                return true;
            }

            // remove if safety car
            if (participant.mCarClassNames === 'SafetyCar') {
                return false;
            }

            // remove if in garage or leaving garage
            if (participant.mPitModes === 4 || participant.mPitModes === 5) {
                return false;
            }

            // if p or q
            if (data.gameStates.mSessionState === 1 || data.gameStates.mSessionState === 3) {
                // ... and participant entering pit box
                if (participant.mPitModes === 1) {
                    return false;
                }

                // ... and participant in pit box
                if (participant.mPitModes === 2) {
                    return false;
                }

                // ... and participant leaving pit box
                if (participant.mPitModes === 3) {
                    return false;
                }
            }

            return true;
        });

        const activeParticipantIndex = participants.findIndex((participant) => {
            if (participant.mParticipantIndex !== activeParticipant.mParticipantIndex) {
                return false;
            }

            return true;
        });

        // get all drivers ahead on circuit
        const ahead = participants.slice(0, activeParticipantIndex);

        // get all driver behind on circuit
        const behind = participants.slice(activeParticipantIndex+1);

        // combine them, cars behind first
        const combined = behind.concat(ahead);

        // get 3 cars ahead, then active participant, then 3 cars behind
        participants = combined.slice(-(this.limit/2)).concat(activeParticipant).concat(combined.slice(0, (this.limit/2)));

        // apply track statuses
        participants = await this.trackPositionStatuses(data, participants, activeParticipant);

        // apply track distances
        participants = await this.trackPositionDistances(data, participants, activeParticipant);

        return participants;
    }

    /**
     *
     * @param {*} participants
     * @param {*} activeParticipant
     */
    async trackPositionStatuses(data, participants, activeParticipant) {
        const activeParticipantIndex = participants.findIndex((participant) => {
            return participant == activeParticipant;
        });

        // 0: driver
        // 1: out
        // 2: hot
        // 3: ahead
        // 4: behind
        // 5: leader
        // 6: backmarker

        for (let pi = 0; pi < participants.length; pi++) {
            // current driver
            if (participants[pi].mPlacementIndex === activeParticipant.mPlacementIndex) {
                participants[pi].mStatusToUser = 0;
                continue;
            }

            // practice (1) or qualifying (3)
            if (data.gameStates.mSessionState === 1 || data.gameStates.mSessionState === 3) {
                // mOutLap variable applied in ParticipantFactory
                if (participants[pi].mOutLap) {
                    participants[pi].mStatusToUser = 1;
                    continue;
                }

                // mOutLap variable applied in ParticipantFactory
                if (!participants[pi].mOutLap) {
                    participants[pi].mStatusToUser = 2;
                    continue;
                }
            }

            // race (5)
            // note: some of these comparisons are highly unlikely to occur but I've catered for them anyway
            if (data.gameStates.mSessionState === 5) {
                // driver is lower than the participant in the carousel.
                // driver is behind on race postiion.
                // on the same lap (racing)
                if (pi < activeParticipantIndex && participants[pi].mRacePosition < activeParticipant.mRacePosition && participants[pi].mCurrentLap === activeParticipant.mCurrentLap) {
                    participants[pi].mStatusToUser = 3;
                    continue;
                }

                // driver is higher than the participant in the carousel.
                // driver is ahead on race position.
                // on the same lap (racing)
                if (pi > activeParticipantIndex && participants[pi].mRacePosition > activeParticipant.mRacePosition && participants[pi].mCurrentLap === activeParticipant.mCurrentLap) {
                    participants[pi].mStatusToUser = 4;
                    continue;
                }

                // driver is lower than the participant in the carousel.
                // driver is beind on race position.
                // driver is a lap(s) behind.
                if (pi < activeParticipantIndex && participants[pi].mRacePosition < activeParticipant.mRacePosition && participants[pi].mCurrentLap > activeParticipant.mCurrentLap) {
                    participants[pi].mStatusToUser = 5;
                    continue;
                }

                // driver is higher than the participant in the carousel.
                // driver is beind on race position.
                // on the same lap.
                if (pi > activeParticipantIndex && participants[pi].mRacePosition < activeParticipant.mRacePosition && participants[pi].mCurrentLap === activeParticipant.mCurrentLap) {
                    participants[pi].mStatusToUser = 5;
                    continue;
                }

                // driver is higher than the participant in the carousel.
                // driver is beind on race position.
                // driver is a lap(s) behind.
                if (pi > activeParticipantIndex && participants[pi].mRacePosition < activeParticipant.mRacePosition && participants[pi].mCurrentLap > activeParticipant.mCurrentLap) {
                    participants[pi].mStatusToUser = 5;
                    continue;
                }

                // driver is lower than the participant in the carousel.
                // driver is ahead on race position.
                // driver is a lap(s) ahead.
                if (pi < activeParticipantIndex && participants[pi].mRacePosition > activeParticipant.mRacePosition && participants[pi].mCurrentLap < activeParticipant.mCurrentLap) {
                    participants[pi].mStatusToUser = 6;
                    continue;
                }

                // driver is higher than the participant in the carousel.
                // driver is ahead on race position.
                // driver is a lap(s) ahead.
                if (pi > activeParticipantIndex && participants[pi].mRacePosition > activeParticipant.mRacePosition && participants[pi].mCurrentLap < activeParticipant.mCurrentLap) {
                    participants[pi].mStatusToUser = 6;
                    continue;
                }

                // driver is lower than the participant in the carousel.
                // driver is ahead on race position.
                // on the same lap.
                if (pi < activeParticipantIndex && participants[pi].mRacePosition > activeParticipant.mRacePosition && participants[pi].mCurrentLap === activeParticipant.mCurrentLap) {
                    participants[pi].mStatusToUser = 6;
                    continue;
                }
            }
        }

        return participants;
    }

    /**
     * Get distance to other participants in the carousel
     * @param {*} data
     * @param {*} participants
     * @param {*} activeParticipant
     * @returns
     */
    async trackPositionDistances(data, participants, activeParticipant) {
        const activeParticipantIndex = participants.findIndex((participant) => {
            return participant == activeParticipant;
        });


        for (let pi = 0; pi < participants.length; pi++) {
            // current driver
            if (participants[pi].mPlacementIndex === activeParticipant.mPlacementIndex) {
                participants[pi].mDistanceToActiveUser = null;
                continue;
            }

            // if not on circuit/moving and current lap is 1, probably never left the pits
            if (participants[pi].mCurrentLapDistance <= 0 && participants[pi].mCurrentLap === 1) {
                participants[pi].mDistanceToActiveUser = null;
                continue;
            }

            let diff = 0;

            // if ahead of driver in carousel
            if (pi < activeParticipantIndex) {
                // ... and driver is behind participant on track
                if (activeParticipant.mCurrentLapDistance < participants[pi].mCurrentLapDistance) {
                    diff = participants[pi].mCurrentLapDistance - activeParticipant.mCurrentLapDistance;
                }

                // ... and driver is ahead of participant on track
                if (activeParticipant.mCurrentLapDistance > participants[pi].mCurrentLapDistance) {
                    diff = data.eventInformation.mTrackLength - (activeParticipant.mCurrentLapDistance - participants[pi].mCurrentLapDistance);
                }

                participants[pi].mDistanceToActiveUser = diff * -1;
            }

            // if behind driver in carousel
            if (pi > activeParticipantIndex) {
                // ... and driver is behind participant on track
                if (activeParticipant.mCurrentLapDistance > participants[pi].mCurrentLapDistance) {
                    diff = activeParticipant.mCurrentLapDistance - participants[pi].mCurrentLapDistance;
                }

                // ... and driver is ahead of participant on track
                if (activeParticipant.mCurrentLapDistance < participants[pi].mCurrentLapDistance) {
                    diff = data.eventInformation.mTrackLength - (participants[pi].mCurrentLapDistance - activeParticipant.mCurrentLapDistance);
                }

                participants[pi].mDistanceToActiveUser = diff;
            }
        }

        return participants;
    }
}