<template>
    <div class="c-in-car-session">
        <div class="c-in-car-session__items">
            <div class="c-in-car-session__item">
                <InCarInfoComponent icon="circuit" :a="mRacePositionDisplay" />
            </div>
            <div class="c-in-car-session__item">
                <InCarInfoComponent :a="mCurrentLapDisplay" />
            </div>
            <div class="c-in-car-session__item">
                <InCarInfoComponent :a="mEventTimeRemainingDisplay" :b="mSessionAdditionalLapsDisplay" />
            </div>
        </div>
    </div>
</template>

<style lang="scss">
    .c-in-car-session {
        @include color('background-color', 'pitbox', 0.8);

        display: flex;
        padding: em(12);
    }

    .c-in-car-session__items {
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
        margin: em(-12);
    }

    .c-in-car-session__item {
        display: flex;
        padding: em(12);
    }
</style>

<script>
import { inject } from 'vue';
import InCarInfoComponent from '../components/InCarInfoComponent.vue';

export default {
    setup() {
        const mRacePositionDisplay = inject('mRacePositionDisplay');
        const mNumParticipantsDisplay = inject('mNumParticipantsDisplay');
        const mCurrentLapDisplay = inject('mCurrentLapDisplay');
        const mLapsInEventDisplay = inject('mLapsInEventDisplay');
        const mEventTimeRemainingDisplay = inject('mEventTimeRemainingDisplay');
        const mSessionAdditionalLapsDisplay = inject('mSessionAdditionalLapsDisplay');
        const mFastestLapTimesDisplay = inject('mFastestLapTimesDisplay');
        const mLastLapTimesDisplay = inject('mLastLapTimesDisplay');

        return {
            mRacePositionDisplay,
            mNumParticipantsDisplay,
            mCurrentLapDisplay,
            mLapsInEventDisplay,
            mEventTimeRemainingDisplay,
            mSessionAdditionalLapsDisplay,
            mFastestLapTimesDisplay,
            mLastLapTimesDisplay,
        };
    },
    components: {
        InCarInfoComponent
    }
}
</script>
