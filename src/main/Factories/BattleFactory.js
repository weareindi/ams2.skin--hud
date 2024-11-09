import { isReady, getParticipantInPostion, getParticipantsSortedByPosition, getActiveParticipant, getParticipantAtIndex } from '../../utils/CrestUtils';

export default class BattleFactory {
    constructor() {
        // paticipants that are within threshold of the car ahead go in here
        this.potentialAhead = {};
        this.potentialBehind = {};

        this.threshold = 15000; // milliseconds
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

        data.battles = await this.processBattles(data);
        data.participantBattle = await this.processParticipantBattle(data, data.battles);

        return data;
    }

    /**
     *
     * @param {*} data
     * @returns
     */
    async processBattles(data) {
        // race hasnt started yet (still in lobby/on grid)
        // if (data.eventInformation.mEventTimeRemaining === data.eventInformation.mSessionDuration) {
        //     return null;
        // }

        data = await this.prepareParticipants(data);

        // race hasnt started yet
        if (data.gameStates.mSessionState !== 5 || data.gameStates.mRaceState !== 2) {
            return null;
        }

        const participants = await this.processParticipants(data);
        return await this.battlesGroups(data, participants);
    }

    /**
     *
     * @param {*} data
     */
    async processParticipantBattle(data, battlesGroups) {
        return await this.participantBattle(data, battlesGroups);
    }

    /**
     *
     * @param {*} data
     * @param {*} battlesGroups
     * @returns
     */
    async participantBattle(data, battlesGroups) {
        const participant = await getActiveParticipant(data);

        let participantBattleGroupId = null;
        for (const groupID in battlesGroups) {
            if (battlesGroups[groupID].indexOf(participant.mParticipantIndex) < 0) {
                continue;
            }

            participantBattleGroupId = groupID;
            break;
        }

        if (participantBattleGroupId === null) {
            return null;
        }

        const battleGroupParticipantIndex = battlesGroups[participantBattleGroupId].indexOf(participant.mParticipantIndex);

        let start = battleGroupParticipantIndex - 1; // 1 ahead
        if (start < 0) {
            start = 0;
        }

        let end = battleGroupParticipantIndex + 2; // participant index + 1 rears
        if (end >= (battlesGroups[participantBattleGroupId].length)) {
            end = battlesGroups[participantBattleGroupId].length;
        }

        return battlesGroups[participantBattleGroupId].slice(start, end);

        // let participants = [];
        // for (let pi = 0; pi < sliced.length; pi++) {
        //     participants.push(await getParticipantAtIndex(data, sliced[pi]));
        // }

        // return participants;
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
        }

        return data;
    }

    /**
     *
     * @param {*} data
     * @param {*} participants
     * @returns
     */
    async battlesGroups(data, participants) {
        // group battles for easy digestion
        const battles = {};

        let battleID = -1;

        // for (let pi = participants.length-1; pi >= 0; pi--) {
        for (let pi = 0; pi < participants.length; pi++) {
            if (participants[pi].mRacePosition === 1) {
                // ... skip
                continue;
            }

            // not in a battle?
            if (!participants[pi].mBattlingParticipantAhead) {
                battleID++;

                // ... skip
                continue;
            }

            const participantAhead = await getParticipantInPostion(data, participants[pi].mRacePosition - 1);

            // increment battleID if participantAhead is not in it already
            if (
                !(battleID in battles)
                || !battles[battleID].includes(participantAhead.mParticipantIndex)
            ) {
                battleID++;
            }

            if (!(battleID in battles)) {
                // ... create array with ID
                battles[battleID] = [];

                // ... add participant ahead to it immediately
                battles[battleID].push(participantAhead.mParticipantIndex);
            }

            battles[battleID].push(participants[pi].mParticipantIndex);
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
        return participants;
    }

    /**
     *
     * @param {*} participants
     */
    async withinThresholdAhead(participants) {
        // get current timestamp
        const now = performance.now();

        // work out if battling participant ahead
        for (let pi = 0; pi < participants.length; pi++) {
            participants[pi].mBattlingParticipantAhead = false;

            // skip if no race position defined
            if (participants[pi].mRacePosition <= 0) {
                continue;
            }

            // is the leader?
            if (participants[pi].mRacePosition === 1) {
                // ... delete from potential
                delete this.potentialAhead[ participants[pi].mName ];

                // ... continue to next iteration
                continue;
            }

            // over the distance threshold?
            if (participants[pi].mRacingDistanceParticipantAhead > this.distance) {
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