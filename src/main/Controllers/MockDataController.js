import DisconnectedJson from '../../../resources/mock/disconnected.json?json';
import MenuJson from '../../../resources/mock/menu.json?json';
import PracticeDrivingJson from '../../../resources/mock/practice-driving.json?json';
import PracticePitJson from '../../../resources/mock/practice-pit.json?json';
import QualifyingDrivingJson from '../../../resources/mock/qualifying-driving.json?json';
import QualifyingPitJson from '../../../resources/mock/qualifying-pit.json?json';
import QualifyingStandingsJson from '../../../resources/mock/qualifying-standings.json?json';
import RaceChequeredFlagJson from '../../../resources/mock/race-chequered-flag.json?json';
import RaceDrivingLap1Json from '../../../resources/mock/race-driving-lap-1.json?json';
import RaceDrivingLap4Json from '../../../resources/mock/race-driving-lap-4.json?json';
import RaceLeadersOverStartLineJson from '../../../resources/mock/race-leaders-over-start-line.json?json';
import RaceLobbyJson from '../../../resources/mock/race-lobby.json?json';
import RaceStandingsJson from '../../../resources/mock/race-standings.json?json';
import RaceStartJson from '../../../resources/mock/race-start.json?json';
import ReplayChequredFlagJson from '../../../resources/mock/replay-chequered-flag?json';
import ReplayDrivingLap1Json from '../../../resources/mock/replay-driving-lap-1.json?json';
import ReplayDrivingLap4Json from '../../../resources/mock/replay-driving-lap-4.json?json';
import ReplayLeadersOverStartLineJson from '../../../resources/mock/replay-leaders-over-start-line.json?json';
import ReplayStartJson from '../../../resources/mock/replay-start.json?json';

export default class MockDataController {
    data(state) {
        if (state === 'disconnected.json') {
            return DisconnectedJson;
        }

        if (state === 'menu.json') {
            return MenuJson;
        }

        if (state === 'practice-driving.json') {
            return PracticeDrivingJson;
        }

        if (state === 'practice-pit.json') {
            return PracticePitJson;
        }

        if (state === 'qualifying-driving.json') {
            return QualifyingDrivingJson;
        }

        if (state === 'qualifying-pit.json') {
            return QualifyingPitJson;
        }

        if (state === 'qualifying-standings.json') {
            return QualifyingStandingsJson;
        }

        if (state === 'race-chequered-flag.json') {
            return RaceChequeredFlagJson;
        }

        if (state === 'race-driving-lap-1.json') {
            return RaceDrivingLap1Json;
        }

        if (state === 'race-driving-lap-4.json') {
            return RaceDrivingLap4Json;
        }

        if (state === 'race-leaders-over-start-line.json') {
            return RaceLeadersOverStartLineJson;
        }

        if (state === 'race-lobby.json') {
            return RaceLobbyJson;
        }

        if (state === 'race-standings.json') {
            return RaceStandingsJson;
        }

        if (state === 'race-start.json') {
            return RaceStartJson;
        }

        if (state === 'replay-chequered-flag.json') {
            return ReplayChequredFlagJson;
        }

        if (state === 'replay-driving-lap-1.json') {
            return ReplayDrivingLap1Json;
        }

        if (state === 'replay-driving-lap-4.json') {
            return ReplayDrivingLap4Json;
        }

        if (state === 'replay-leaders-over-start-line.json') {
            return ReplayLeadersOverStartLineJson;
        }

        if (state === 'replay-start.json') {
            return ReplayStartJson;
        }

        return null;
    }
}