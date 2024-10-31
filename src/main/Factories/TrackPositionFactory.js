import { isReady, getActiveParticipant, getParticipantsSortedByRaceDistance } from '../../utils/CrestUtils';

export default class TrackPositionFactory {
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

        // data.trackPosition = await this.trackPosition(data);
        data.trackPositionCarousel = await this.trackPositionCarousel(data);

        return data;
    }

    /**
     *
     * @param {*} participants
     * @returns
     */
    // async filterParticipants(data, participants) {
    //     for (let participantIndex = 0; participantIndex < participants.length; participantIndex++) {
    //         const participant = await getParticipantAtIndex(data, participantIndex);

    //         // remove those in pit
    //         if (participant.mPitModes === 4 || participant.mPitModes === 5) {
    //             participants.splice(participantIndex, 1);
    //             continue;
    //         }

    //         // remove safety car
    //         if (participant.mCarClassNames === 'SafetyCar') {
    //             participants.splice(participantIndex, 1);
    //             continue;
    //         }
    //     }

    //     return participants;
    // }

    /**
     * Get track position data in a carousel prepared array with the current user in the center
     * @param {*} data
     * @returns array
     */
    async trackPositionCarousel(data) {
        const participants = await getParticipantsSortedByRaceDistance(data);
        const activeParticipant = await getActiveParticipant(data);

        let aheadA = [];
        let aheadB = [];
        let behindA = [];
        let behindB = [];

        for (let pi = 0; pi < participants.length; pi++) {
            const participant = participants[pi];

            if (participant.mParticipantIndex === activeParticipant.mParticipantIndex) {
                continue;
            }

            if (participant.mCarClassNames === 'SafetyCar') {
                continue;
            }

            // in garage
            if (participant.mPitModes === 4) {
                continue;
            }

            // leaving garage
            if (participant.mPitModes === 5) {
                continue;
            }

            // practice or qualifying
            if (data.gameStates.mSessionState === 1 || data.gameStates.mSessionState === 3) {
                // // driving into pits
                // if (participant.mPitModes === 1) {
                //     continue;
                // }

                // pit box
                if (participant.mPitModes === 2) {
                    continue;
                }

                // // driving out of pits
                // if (participant.mPitModes === 3) {
                //     continue;
                // }
            }

            if (participant.mPlacementIndex < activeParticipant.mPlacementIndex) {
                aheadA.push( {...participant} );
                aheadB.push( {...participant} );
            }

            if (participant.mPlacementIndex > activeParticipant.mPlacementIndex) {
                behindA.push( {...participant} );
                behindB.push( {...participant} );
            }
        }


        // prepend and appends ahead,behind data to aid carousel of data
        let carouselParticipants = [].concat(behindA, aheadA, activeParticipant, behindB, aheadB);

        // get carousel position of active user
        const activeParticipantCarouselIndex = behindA.length + aheadA.length;

        // apply status to user
        carouselParticipants = await this.trackPositionCarouselStatuses(data, carouselParticipants, activeParticipantCarouselIndex);
        carouselParticipants = await this.trackPositionDistances(data, carouselParticipants, activeParticipantCarouselIndex);
        carouselParticipants = await this.reduceDataset(carouselParticipants);

        // reduce to 7 included driver
        carouselParticipants = await this.reduceParticipants(carouselParticipants);


        return carouselParticipants;
    }

    /**
     *
     * @param {*} carouselParticipants
     * @returns
     */
    async reduceParticipants(carouselParticipants) {
        const driverIndex = ((carouselParticipants.length - 1) / 2);

        let middle = [];
        middle[0] = carouselParticipants[driverIndex-3];
        middle[1] = carouselParticipants[driverIndex-2];
        middle[2] = carouselParticipants[driverIndex-1];
        middle[3] = carouselParticipants[driverIndex];
        middle[4] = carouselParticipants[driverIndex+1];
        middle[5] = carouselParticipants[driverIndex+2];
        middle[6] = carouselParticipants[driverIndex+3];

        middle = middle.filter((carouselParticipant) => {
            return typeof carouselParticipant === 'undefined' ? false : true;
        });

        return middle;
    }

    /**
     *
     * @param {*} carouselParticipants
     */
    async reduceDataset(carouselParticipants) {
        return carouselParticipants.map((carouselParticipant) => {
            return {
                mParticipantIndex: carouselParticipant.mParticipantIndex,
                // mName: carouselParticipant.mName,
                mStatusToUser: carouselParticipant.mStatusToUser,
                mDistanceToActiveUser: carouselParticipant.mDistanceToActiveUser,
            };
        });
    }

    /**
     *
     * @param {*} carouselParticipants
     * @param {*} activeParticipantCarouselIndex
     */
    async trackPositionCarouselStatuses(data, carouselParticipants, activeParticipantCarouselIndex) {
        const activeParticipant = await getActiveParticipant(data);

        // 0: driver
        // 1: out
        // 2: hot
        // 3: ahead
        // 4: behind
        // 5: leader
        // 6: backmarker

        for (let cpi = 0; cpi < carouselParticipants.length; cpi++) {
            // current driver
            if (carouselParticipants[cpi].mPlacementIndex === activeParticipant.mPlacementIndex) {
                carouselParticipants[cpi].mStatusToUser = 0;
                continue;
            }

            // practice (1) or qualifying (3)
            if (data.gameStates.mSessionState === 1 || data.gameStates.mSessionState === 3) {
                // mOutLap variable applied in ParticipantFactory
                if (carouselParticipants[cpi].mOutLap) {
                    carouselParticipants[cpi].mStatusToUser = 1;
                    continue;
                }

                // mOutLap variable applied in ParticipantFactory
                if (!carouselParticipants[cpi].mOutLap) {
                    carouselParticipants[cpi].mStatusToUser = 2;
                    continue;
                }
            }

            // race (5)
            // note: some of these comparisons are highly unlikely to occur but I've catered for them anyway
            if (data.gameStates.mSessionState === 5) {
                // driver is lower than the participant in the carousel.
                // driver is behind on race postiion.
                // on the same lap (racing)
                if (cpi < activeParticipantCarouselIndex && carouselParticipants[cpi].mRacePosition < activeParticipant.mRacePosition && carouselParticipants[cpi].mCurrentLap === activeParticipant.mCurrentLap) {
                    carouselParticipants[cpi].mStatusToUser = 3;
                    continue;
                }

                // driver is higher than the participant in the carousel.
                // driver is ahead on race position.
                // on the same lap (racing)
                if (cpi > activeParticipantCarouselIndex && carouselParticipants[cpi].mRacePosition > activeParticipant.mRacePosition && carouselParticipants[cpi].mCurrentLap === activeParticipant.mCurrentLap) {
                    carouselParticipants[cpi].mStatusToUser = 4;
                    continue;
                }

                // driver is lower than the participant in the carousel.
                // driver is beind on race position.
                // driver is a lap(s) behind.
                if (cpi < activeParticipantCarouselIndex && carouselParticipants[cpi].mRacePosition < activeParticipant.mRacePosition && carouselParticipants[cpi].mCurrentLap > activeParticipant.mCurrentLap) {
                    carouselParticipants[cpi].mStatusToUser = 5;
                    continue;
                }

                // driver is higher than the participant in the carousel.
                // driver is beind on race position.
                // on the same lap.
                if (cpi > activeParticipantCarouselIndex && carouselParticipants[cpi].mRacePosition < activeParticipant.mRacePosition && carouselParticipants[cpi].mCurrentLap === activeParticipant.mCurrentLap) {
                    carouselParticipants[cpi].mStatusToUser = 5;
                    continue;
                }

                // driver is higher than the participant in the carousel.
                // driver is beind on race position.
                // driver is a lap(s) behind.
                if (cpi > activeParticipantCarouselIndex && carouselParticipants[cpi].mRacePosition < activeParticipant.mRacePosition && carouselParticipants[cpi].mCurrentLap > activeParticipant.mCurrentLap) {
                    carouselParticipants[cpi].mStatusToUser = 5;
                    continue;
                }

                // driver is lower than the participant in the carousel.
                // driver is ahead on race position.
                // driver is a lap(s) ahead.
                if (cpi < activeParticipantCarouselIndex && carouselParticipants[cpi].mRacePosition > activeParticipant.mRacePosition && carouselParticipants[cpi].mCurrentLap < activeParticipant.mCurrentLap) {
                    carouselParticipants[cpi].mStatusToUser = 6;
                    continue;
                }

                // driver is higher than the participant in the carousel.
                // driver is ahead on race position.
                // driver is a lap(s) ahead.
                if (cpi > activeParticipantCarouselIndex && carouselParticipants[cpi].mRacePosition > activeParticipant.mRacePosition && carouselParticipants[cpi].mCurrentLap < activeParticipant.mCurrentLap) {
                    carouselParticipants[cpi].mStatusToUser = 6;
                    continue;
                }

                // driver is lower than the participant in the carousel.
                // driver is ahead on race position.
                // on the same lap.
                if (cpi < activeParticipantCarouselIndex && carouselParticipants[cpi].mRacePosition > activeParticipant.mRacePosition && carouselParticipants[cpi].mCurrentLap === activeParticipant.mCurrentLap) {
                    carouselParticipants[cpi].mStatusToUser = 6;
                    continue;
                }
            }
        }

        return carouselParticipants;
    }

    /**
     * Get distance to other participants in the carousel
     * @param {*} data
     * @param {*} carouselParticipants
     * @param {*} activeParticipantCarouselIndex
     * @returns
     */
    async trackPositionDistances(data, carouselParticipants, activeParticipantCarouselIndex) {
        const activeParticipant = await getActiveParticipant(data);


        for (let cpi = 0; cpi < carouselParticipants.length; cpi++) {
            // current driver
            if (carouselParticipants[cpi].mPlacementIndex === activeParticipant.mPlacementIndex) {
                carouselParticipants[cpi].mDistanceToActiveUser = null;
                continue;
            }

            // if not on circuit/moving and current lap is 1, probably never left the pits
            if (carouselParticipants[cpi].mCurrentLapDistance <= 0 && carouselParticipants[cpi].mCurrentLap === 1) {
                carouselParticipants[cpi].mDistanceToActiveUser = null;
                continue;
            }

            let diff = 0;

            // if ahead of driver in carousel
            if (cpi < activeParticipantCarouselIndex) {
                // ... and driver is behind participant on track
                if (activeParticipant.mCurrentLapDistance < carouselParticipants[cpi].mCurrentLapDistance) {
                    diff = carouselParticipants[cpi].mCurrentLapDistance - activeParticipant.mCurrentLapDistance;
                }

                // ... and driver is ahead of participant on track
                if (activeParticipant.mCurrentLapDistance > carouselParticipants[cpi].mCurrentLapDistance) {
                    diff = data.eventInformation.mTrackLength - (activeParticipant.mCurrentLapDistance - carouselParticipants[cpi].mCurrentLapDistance);
                }

                carouselParticipants[cpi].mDistanceToActiveUser = diff * -1;
            }

            // if behind driver in carousel
            if (cpi > activeParticipantCarouselIndex) {
                // ... and driver is behind participant on track
                if (activeParticipant.mCurrentLapDistance > carouselParticipants[cpi].mCurrentLapDistance) {
                    diff = activeParticipant.mCurrentLapDistance - carouselParticipants[cpi].mCurrentLapDistance;
                }

                // ... and driver is ahead of participant on track
                if (activeParticipant.mCurrentLapDistance < carouselParticipants[cpi].mCurrentLapDistance) {
                    diff = data.eventInformation.mTrackLength - (carouselParticipants[cpi].mCurrentLapDistance - activeParticipant.mCurrentLapDistance);
                }

                carouselParticipants[cpi].mDistanceToActiveUser = diff;
            }
        }

        return carouselParticipants;
    }
}