class StandingsWorker {
    constructor() {
        this.init();
    }

    /**
     * Go, go, go!
     */
    async init() {
        try {
            await this.registerListeners();
        } catch (error) {
            console.error(error);
        }
    }

    /**
     * Register listeners for messages from parent worker
     */
    async registerListeners() {
        return self.onmessage = async (event) => {
            if (typeof event.data === 'undefined') {
                return console.error('No message supplied');
            }

            if (event.data.name === 'process') {
                const data = await this.prepareData(event.data.data);
                await this.returnMessage('updateview', data);
            }
        };
    }

    /**
     * Prepare data for the view
     * @param {*} data 
     * @returns 
     */
    async prepareData(data) {
        // do we have what we need?
        if (!('user' in data)) {
            return null;
        }

        if (!('mNumParticipants' in data)) {
            return null;
        }

        if (!('mParticipantInfo' in data)) {
            return null;
        }

        if (!('mSessionState' in data)) {
            return null;
        }

        if (!('mTrackLength' in data)) {
            return null;
        }

        let user = data.user;
        const sortedParticipantData = await this.getSortedParticipants(data.mParticipantInfo);
        const participantData = await this.setParticipantsIndexes(sortedParticipantData);      
        user = await this.updateUser(user, sortedParticipantData);
        const standingsData = await this.getStandingsData(user, participantData);
        const userIndex = standingsData.indexOf(user);
        const standingsDataDisplay = await this.getStandingsDataForDisplay(user, userIndex, standingsData, data.mSessionState, data.mTrackLength);
        
        return {standingsDisplay: standingsDataDisplay};
    }

    /**
     * Get the user data which has been sorted and processed
     * @param {*} user 
     * @param {*} sortedParticipantData 
     * @returns object
     */
    async updateUser(user, sortedParticipantData) {
        let participantUser = null;
        for (const participantIndex in sortedParticipantData) {
            const participant =  sortedParticipantData[participantIndex];
            
            if (participant.mRacePosition !== user.mRacePosition) {
                continue;
            }

            participantUser = participant;
            break;
        }

        return participantUser;
    }

    /**
     * Get a full stack of standings prepared for the view
     * @param {*} user 
     * @param {*} userIndex 
     * @param {*} standingsData 
     * @param {*} mSessionState 
     * @param {*} mTrackLength 
     * @returns array
     */
    async getStandingsDataForDisplay(user, userIndex, standingsData, mSessionState, mTrackLength) {
        // the number if total standings we want to return
        // they dont all show at once so lets limit the data that is returned to the view
        // ... this may be moved to a user defined option hense the use of this variable
        let limit = 6;

        // .. ensure its an even number
        if ((limit % 2)) {
            limit = 2 * Math.round(limit / 2);
        }

        // standings
        let standings = [];
        for (const index in standingsData) {
            const participantData = standingsData[index];
            const status = await this.statusDisplay(index, participantData, userIndex, user, mSessionState);
            const distance = await this.distanceDisplay(index, participantData, userIndex, user, mTrackLength);
            // const visible = await this.visibilityDisplay(index, participantData, userIndex, user);
            const mNameDisplay = await this.mNameDisplay(participantData.mName);
            const mCarClassNamesDisplay = await this.mCarClassNamesDisplay(participantData.mCarClassNames);

            standings.push({
                positionIndex: participantData.positionIndex,
                status: status,
                distance: distance,
                // visible: visible,
                mRacePosition: participantData.mRacePosition,
                mName: participantData.mName,
                mCarClassNames: mCarClassNamesDisplay,
            });
        }

        // slice standings from the current users position, outwards as per limit
        return [].concat(standings.slice(userIndex - (limit / 2), userIndex), standings[userIndex], standings.slice(userIndex + 1, userIndex + 1 + (limit / 2)));
    }

    /**
     * Get participant name
     * @param {*} mName 
     * @returns string
     */
    async mNameDisplay(mName) {
        return mName;
    }

    /**
     * Prepare car class name for standing in view
     * @param {*} mCarClassNames 
     * @returns string
     */
    async mCarClassNamesDisplay(mCarClassNames) {
        // split name at capitals
        const parts = mCarClassNames.match(/[A-Z][a-z]+|[A-Z]|[0-9]+/g);

        // create shortname from first 3 characters of first item
        let shortname = parts[0].slice(0, 3);

        // remove first part as we've used it
        parts.shift();

        // any more parts? add the first character from the next part only
        if (parts.length) {
            if (shortname.length === 1) {
                shortname += parts[0].slice(0, 3);
            } else {
                shortname += parts[0].slice(0, 1);
            }
        }

        // make it uppercase
        return shortname.toUpperCase();        
    }

    /**
     * Get participant status prepared for the view
     * @param {*} index 
     * @param {*} participant 
     * @param {*} userIndex
     * @param {*} user
     * @param {*} mSessionState 
     * @returns string
     */
    async statusDisplay(index, participant, userIndex, user, mSessionState) {
        // skip if its current driver
        if (participant.positionIndex === user.positionIndex) {
            return null
        }

        if (mSessionState === 1 || mSessionState === 3) { // practice (1) or qualifying (3)
            if (participant.mRaceStates === 1) {
                return 'out';
            }

            if (participant.mRaceStates === 2) {
                return 'hot';
            }
        }

        if (mSessionState === 5) { // race (5)
            // participant ahead on same lap (racing)
            if (index < userIndex && participant.mRacePosition < user.mRacePosition && participant.mCurrentLap === user.mCurrentLap) {
                return 'ahead';
            }

            // participant behind on same lap (racing)
            if (index > userIndex && participant.mRacePosition > user.mRacePosition && participant.mCurrentLap === user.mCurrentLap) {
                return 'behind';
            }

            // participant ahead on higher lap, better position
            if (index < userIndex && participant.mRacePosition < user.mRacePosition && participant.mCurrentLap > user.mCurrentLap) {
                return 'leader';
            }

            // participant behind on same lap, better position 
            if (index > userIndex && participant.mRacePosition < user.mRacePosition && participant.mCurrentLap === user.mCurrentLap) {
                return 'leader';
            }

            // participant behind on higher lap, better position
            if (index > userIndex && participant.mRacePosition < user.mRacePosition && participant.mCurrentLap > user.mCurrentLap) {
                return 'leader';
            }

            // participant ahead on lower lap, lower position
            if (index < userIndex && participant.mRacePosition > user.mRacePosition && participant.mCurrentLap < user.mCurrentLap) {
                return 'backmarker';
            }

            // participant ahead on lower lap, lower position
            if (index > userIndex && participant.mRacePosition > user.mRacePosition && participant.mCurrentLap < user.mCurrentLap) {
                return 'backmarker';
            }

            // participant ahead on lower lap, lower position
            if (index < userIndex && participant.mRacePosition > user.mRacePosition && participant.mCurrentLap === user.mCurrentLap) {
                return 'backmarker';
            }
        }

        // no match?
        return null
    }

    /**
     * Get distance to other participants prepared for the view
     * @param {*} index 
     * @param {*} participantData 
     * @param {*} userIndex 
     * @param {*} user 
     * @param {*} mTrackLength 
     * @returns string
     */
    async distanceDisplay(index, participantData, userIndex, user, mTrackLength) {
        if (participantData.mCurrentLapDistance <= 0 && participantData.mCurrentLap === 1) {
            return null;
        }

        let symbol = '±';
        let diff = 0;

        // if ahead of current player on circuit
        if (index < userIndex) {
            symbol = '+';
            
            if (user.mCurrentLapDistance < participantData.mCurrentLapDistance) {
                diff = participantData.mCurrentLapDistance - user.mCurrentLapDistance;
            }
            
            if (user.mCurrentLapDistance > participantData.mCurrentLapDistance) {
                diff = mTrackLength - (user.mCurrentLapDistance - participantData.mCurrentLapDistance);
            }
        }

        // if behind current player on circuit
        if (index > userIndex) {
            symbol = '-';

            // racing
            if (user.mCurrentLapDistance > participantData.mCurrentLapDistance) {
                diff = user.mCurrentLapDistance - participantData.mCurrentLapDistance;
            }

            // leaders
            if (user.mCurrentLapDistance < participantData.mCurrentLapDistance) {
                diff = mTrackLength - (participantData.mCurrentLapDistance - user.mCurrentLapDistance);
            }
        }

        diff = Math.abs(diff);

        return `${symbol}${diff.toFixed(2)}m`;
    }

    /**
     * Can we hide the participant at index
     * @param {*} participant 
     * @param {*} user 
     * @returns boolean
     */
    async visibilityDisplay(index, participantData, userIndex, user) {
        // if (user.mCurrentLap === participantData.mCurrentLap && index < userIndex) {
        //     // return false;
        // }

        // if (participantData.mCurrentLapDistance === 0 && participantData !== user) {
        //     // return false;
        // }

        return true;
    }

    /**
     * Get standings data in a carousel prepared array with the current user in the center
     * @param {*} user 
     * @param {*} sortedParticipantData 
     * @returns array
     */
    async getStandingsData(user, sortedParticipantData) {
        // get participants ahead
        const ahead = sortedParticipantData.slice(0, user.positionIndex);

        // get participants behind
        const behind = sortedParticipantData.slice(user.positionIndex + 1, sortedParticipantData.length);

        // prepend and appends ahead,behind data to aid carousel of data
        return [].concat(behind, ahead, user, behind, ahead);
    }

    /**
     * Apply participants position index
     * @param {*} participantsData 
     * @returns object
     */
    async setParticipantsIndexes(participantsData) {
        for (const index in participantsData) {
            // set original index
            participantsData[index].positionIndex = parseFloat(index);
        }

        return participantsData;
    }

    /**
     * Sort participants by lap distance, leader first
     * @param {*} participantsData 
     * @returns array
     */
    async getSortedParticipants(participantsData) {
        return [].concat(participantsData).sort((a, b) => {
            if (a.mCurrentLapDistance === 0 && a.mCurrentLapDistance === 0) {
                return a.mRacePosition - b.mRacePosition;
            }

            return b.mCurrentLapDistance - a.mCurrentLapDistance;
        });
    }

    /**
     * Easy method to send a message back to parent worker with/without additional data
     * @param {*} name 
     * @param {*} data 
     */
    async returnMessage(name, data = null) {
        if (!data) {
            return self.postMessage({
                name
            });
        }

        return self.postMessage({
            name,
            data
        });
    }
}

new StandingsWorker();
