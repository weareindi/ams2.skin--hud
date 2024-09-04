/**
 *
 * @param {*} data
 * @returns
 */
export async function isReady(data) {
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
    return data.participants.mParticipantInfo.find((participant) => {
        return participant.mRacePosition === mRacePosition;
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