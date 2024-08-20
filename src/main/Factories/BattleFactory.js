import { isReady, getParticipantInPostion, getParticipantsSortedByPosition } from '../../utils/CrestUtils';

export default class BattleFactory {
    constructor() {
        // paticipants that are within threshold of the car ahead go in here
        this.potentialAhead = {};
        this.potentialBehind = {};

        this.threshold = 10000; // milliseconds
        this.distance = 100; // meters

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
            // console.log(this.db);
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

        data.battles = await this.processBattles(data);

        return data;
    }

    /**
     * 
     * @param {*} data 
     * @returns 
     */
    async processBattles(data) {
        // race hasnt started yet (still in lobby/on grid)
        // if (data.eventTimings.mEventTimeRemaining === data.eventInformation.mSessionDuration) {
        //     return null;
        // }

        data = await this.prepareParticipants(data);

        // race hasnt started yet
        if (data.gameStates.mSessionState !== 5 || data.gameStates.mRaceState !== 2) {
            return null;
        }

        const participants = await this.processParticipants(data);
        return await this.battles(data, participants);
    }

    /**
     * 
     * @param {*} data 
     * @returns 
     */
    async prepareParticipants(data) {
        for (let ppi = 0; ppi < data.participants.mParticipantInfo.length; ppi++) {
            // apply vars
            data.participants.mParticipantInfo[ppi].mBattlingParticipantAhead = null;
            data.participants.mParticipantInfo[ppi].mBattlingParticipantBehind = null;
        }

        return data;
    }

    /**
     * 
     * @param {*} data 
     * @param {*} participants 
     * @returns 
     */
    async battles(data, participants) {
        // group battles for easy digestion
        const battles = [];

        for (let pi = 0; pi < participants.length; pi++) {
            // is the leader?
            if (participants[pi].mRacePosition === 1) {
                // ... skip
                continue;
            }

            // not in a battle?
            if (!participants[pi].mBattlingParticipantAhead) {
                // ... skip
                continue;
            }

            // get participant ahead
            const participantAhead = await getParticipantInPostion(data, participants[pi].mRacePosition - 1);

            // get current timestamp
            const now = Date.now();

            // populate battles
            // battles.push([participantAhead.mRacePosition, participants[pi].mRacePosition, participants[pi].mRacingDistance]);
            battles.push({
                // ahead: {
                //     mParticipantIndex: participantAhead.mParticipantIndex,
                //     mRacePosition: participantAhead.mRacePosition,
                //     // mName: participantAhead.mName,
                // },
                // behind: {
                //     mParticipantIndex: participants[pi].mParticipantIndex,
                //     // mRacePosition: participants[pi].mRacePosition,
                //     // mName: participants[pi].mName,
                // },
                aheadParticipantIndex: participantAhead.mParticipantIndex,
                behindParticipantIndex: participants[pi].mParticipantIndex,
                distance: participants[pi].mRacingDistance,
                duration: Date.now() - this.potentialAhead[ participants[pi].mName ]
            });
        }

        return battles;
    }

    /**
     * 
     * @param {*} data 
     * @returns 
     */
    async processParticipants(data) {
        let participants = await getParticipantsSortedByPosition(data);
        participants = await this.filterParticipants(participants);
        participants = await this.withinThresholdAhead(participants);
        participants = await this.withinThresholdBehind(data, participants);

        return participants;
    }

    /**
     * 
     * @param {*} participants 
     */
    async withinThresholdAhead(participants) {
        // get current timestamp
        const now = Date.now();

        // work out if battling participant ahead
        for (let pi = 0; pi < participants.length; pi++) {
            participants[pi].mBattlingParticipantAhead = false;

            // is the leader?
            if (participants[pi].mRacePosition === 1) {
                // ... delete from potential
                delete this.potentialAhead[ participants[pi].mName ];

                // ... continue to next iteration
                continue;
            }

            // over the distance threshold?
            if (participants[pi].mRacingDistance > this.distance) {
                // ... delete from potential
                delete this.potentialAhead[ participants[pi].mName ];

                // ... continue to next iteration
                continue;
            }

            // in potential?
            if (participants[pi].mName in this.potentialAhead) {
                // ... and the stored timestamp is older than the threshold?
                if (this.potentialAhead[ participants[pi].mName ] < (now - this.threshold)) {
                    // ... battle!
                    participants[pi].mBattlingParticipantAhead = true;
                }

                // ... continue to next iteration
                continue;
            }

            // must be within distance threshold, add user to potential battle list
            this.potentialAhead[ participants[pi].mName ] = now;
        }

        return participants;
    }

    /**
     * 
     * @param {*} participants 
     */
    async withinThresholdBehind(data, participants) {
        // get current timestamp
        const now = Date.now();

        // work out if battling participant ahead
        for (let pi = 0; pi < participants.length; pi++) {
            participants[pi].mBattlingParticipantBehind = false;

            // is last?
            if (participants[pi].mRacePosition === participants.length) {
                // ... delete from potential
                delete this.potentialBehind[ participants[pi].mName ];

                // ... continue to next iteration
                continue;
            }

            const participantBehind = await getParticipantInPostion(data, (participants[pi].mRacePosition + 1));

            // over the distance threshold?
            if (participantBehind.mRacingDistance > this.distance) {
                
                // ... delete from potential
                delete this.potentialBehind[ participants[pi].mName ];

                // ... continue to next iteration
                continue;
            }

            // in potential?
            if (participants[pi].mName in this.potentialBehind) {
                // ... and the stored timestamp is older than the threshold?
                if (this.potentialBehind[ participants[pi].mName ] < (now - this.threshold)) {
                    // ... battle!
                    participants[pi].mBattlingParticipantBehind = true;
                }

                // ... continue to next iteration
                continue;
            }

            // must be within distance threshold, add user to potential battle list
            this.potentialBehind[ participants[pi].mName ] = now;
        }

        return participants;
    }

    /**
     * 
     * @param {*} participants 
     */
    async filterParticipants(participants) {
        for (let pi = 0; pi < participants.length; pi++) {
            // remove safety car
            if (participants[pi].mCarClassNames === 'SafetyCar') {
                participants.splice(pi, 1);
                continue;
            }
        }

        return participants;
    }
}