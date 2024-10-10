/**
 *
 * @param {*} data
 * @returns
 */
export async function isReady(data) {
    if (typeof data === 'undefined') {
        return false;
    }

    if (data === null) {
        return false;
    }

    if (!('gameStates' in data)) {
        return false;
    }

    if (!('mGameState' in data.gameStates)) {
        return false;
    }

    if (data.gameStates.mGameState === 0) {
        return false;
    }

    if (data.gameStates.mGameState === 1) {
        return false;
    }

    if (!('participants' in data)) {
        return false;
    }

    if (!('mViewedParticipantIndex' in data.participants)) {
        return false;
    }

    if (!('mParticipantInfo' in data.participants)) {
        return false;
    }

    return true;
}

/**
 *
 */
// export async function isInPit(data) {
//     if (typeof data === 'undefined') {
//         return false;
//     }

//     if (data === null) {
//         return false;
//     }

//     if (!('gameStates' in data)) {
//         return false;
//     }

//     console.log(data.gameStates);
//     if (data.gameStates.mGameState !== 4) {
//         return false;
//     }

//     const participant = await getActiveParticipant(data);

//     console.log(participant.mPitModes);


//     return true;
// }

/**
 *
 */
export async function isOnCircuit(data) {
    if (typeof data === 'undefined') {
        return false;
    }

    if (data === null) {
        return false;
    }

    if (!('gameStates' in data)) {
        return false;
    }

    if (data.gameStates.mGameState !== 2) {
        return false;
    }

    // if (data.gameStates.mRaceState !== 2) {
    //     return false;
    // }

    return true;
}

/**
 *
 * @param {*} data
 * @returns
 */
export async function hasEventStarted(data) {
    if (!('eventInformation' in data)) {
        return false;
    }

    if (!('mLapsInEvent' in data.eventInformation)) {
        return false;
    }

    if (!('mSessionDuration' in data.eventInformation)) {
        return false;
    }

    if (!('mEventTimeRemaining' in data.eventInformation)) {
        return false;
    }

    // has lapped event not started?
    if (data.eventInformation.mLapsInEvent !== null) {
        const leader = await getParticipantInPostion(data, 1);
        if (leader === null) {
            return false;
        }

        if (leader.mRacingDistance <= 0) {
            return false;
        }
    }

    // has timed event not started
    if (data.eventInformation.mLapsInEvent === null && data.eventInformation.mSessionDuration === data.eventInformation.mEventTimeRemaining) {
        return false;
    }

    return true;
}

/**
 *
 * @param {*} data
 * @returns
 */
export async function hasEventEnded(data) {
    if (!('eventInformation' in data)) {
        return false;
    }

    if (!('mLapsInEvent' in data.eventInformation)) {
        return false;
    }

    if (!('mSessionDuration' in data.eventInformation)) {
        return false;
    }

    if (!('mEventTimeRemaining' in data.eventInformation)) {
        return false;
    }


    // has lapped event not started?
    // if (data.eventInformation.mLapsInEvent !== null) {
    //     const leader = await getParticipantInPostion(data, 1);
    //     if (leader === null) {
    //         return false;
    //     }

    //     if (leader.mRacingDistance <= 0) {
    //         return false;
    //     }
    // }

    // has timed event not started
    if (data.eventInformation.mLapsInEvent === null && data.eventInformation.mEventTimeRemaining === 0) {
        return true;
    }

    return false;
}

/**
 *
 * @param {*} data
 */
export async function isInPitBox(data) {
    const participant = await getActiveParticipant(data);

    if (participant == null) {
        return false;
    }

    if (!('mPitModes' in participant)) {
        return false;
    }

    if (participant.mPitModes !== 4) {
        return false;
    }

    return true;
}

/**
 *
 * @param {*} data
 * @returns
 */
export async function isInMenu(data) {
    if (typeof data === 'undefined') {
        return false;
    }

    if (data === null) {
        return false;
    }

    if (!('gameStates' in data)) {
        return false;
    }

    if (!('mGameState' in data.gameStates)) {
        return false;
    }

    if (data.gameStates.mGameState !== 1) {
        return false;
    }

    return true;
}

/**
 *
 * @param {*} data
 * @returns
 */
export async function isPaused(data) {
    if (typeof data === 'undefined') {
        return false;
    }

    if (data === null) {
        return false;
    }

    if (!('gameStates' in data)) {
        return false;
    }

    if (!('mGameState' in data.gameStates)) {
        return false;
    }

    if (data.gameStates.mGameState !== 3) {
        return false;
    }

    return true;
}

/**
 *
 * @param {*} data
 * @returns
 */
export async function isInMenuTimeTracking(data) {
    if (typeof data === 'undefined') {
        return false;
    }

    if (data === null) {
        return false;
    }

    if (!('gameStates' in data)) {
        return false;
    }

    if (!('mGameState' in data.gameStates)) {
        return false;
    }

    if (data.gameStates.mGameState !== 4) {
        return false;
    }

    return true;
}

/**
 *
 * @param {*} data
 * @returns
 */
export async function getActiveParticipant(data) {
    return data.participants.mParticipantInfo[ data.participants.mViewedParticipantIndex ];
}

/**
 *
 * @param {*} data
 * @param {*} index
 * @returns
 */
export async function getParticipantAtIndex(data, index) {
    return data.participants.mParticipantInfo[ index ];
}

/**
 *
 * @param {*} data
 * @param {*} mRacePosition
 */
export async function getParticipantInPostion(data, mRacePosition) {
    const participant = data.participants.mParticipantInfo.find((participant) => {
        if ('mRacePosition' in participant) {
            return participant.mRacePosition === mRacePosition;
        }
    });

    if (typeof participant === 'undefined') {
        return null;
    }

    return participant;
}

export async function getClassParticipantsSortedByPosition(data, index) {
    const currentParticipant = data.participants.mParticipantInfo[ index ];

    let participantsInClass = [];
    for (let ppi = 0; ppi < data.participants.mParticipantInfo.length; ppi++) {
        const participant = data.participants.mParticipantInfo[ppi];

        if (participant.mCarClassNames !== currentParticipant.mCarClassNames) {
            continue;
        }

        participantsInClass.push(participant);
    }

    // sort by race position
    participantsInClass = participantsInClass.sort((a, b) => {
        return a.mRacePosition - b.mRacePosition;
    });


    // add class position
    for (let pici = 0; pici < participantsInClass.length; pici++) {
        participantsInClass[pici].mCarClassPosition = pici + 1;
    }

    return participantsInClass;
}

/**
 *
 * @param {*} data
 * @param {*} index
 * @param {*} mCarClassPosition
 * @returns
 */
export async function getParticipantInClassPostion(data, index, mCarClassPosition) {
    const participantsInClass = await getClassParticipantsSortedByPosition(data, index);

    return participantsInClass.find((participant) => {
        return participant.mCarClassPosition === mCarClassPosition;
    });
}


/**
 *
 * @param {*} data
 */
export async function getParticipantsSortedByPosition(data) {
    return [].concat(data.participants.mParticipantInfo).sort((a, b) => {
        return a.mRacePosition - b.mRacePosition;
    });
}

/**
 *
 * @param {*} data
 * @returns
 */
export async function getParticipantsSortedByClassPosition(data) {
    let sorted = [].concat(data.participants.mParticipantInfo).sort((a, b) => {
        return a.mRacePosition - b.mRacePosition;
    });

    let classes = Object.groupBy(sorted, ({mCarClassNames}) => {
       return mCarClassNames;
    });

    let participants = [];
    for (const className in classes) {
        participants = participants.concat(classes[className]);
    }

    return participants;
}

/**
 *
 * @param {*} data
 * @returns
 */
export async function getParticipantsSortedIntoClass(data) {
    let sorted = [].concat(data.participants.mParticipantInfo).sort((a, b) => {
        return a.mRacePosition - b.mRacePosition;
    });

    return Object.groupBy(sorted, ({mCarClassName}) => {
       return mCarClassName;
    });
}

/**
 *
 * @param {*} data
 */
export async function getParticipantsSortedByRaceDistance(data) {
    return [].concat(data.participants.mParticipantInfo).sort((a, b) => {
        if (a.mCurrentLapDistance === 0 && a.mCurrentLapDistance === 0) {
            return a.mRacePosition - b.mRacePosition;
        }

        return b.mCurrentLapDistance - a.mCurrentLapDistance;
    });
}