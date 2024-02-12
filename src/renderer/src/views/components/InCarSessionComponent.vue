<template>
    <div class="c-in-car-session">
        <div class="c-in-car-session__items">
            <div class="c-in-car-session__item" v-if="position">
                <InCarStatComponent :icon="`circuit`" :right="position" />
            </div>
            <div class="c-in-car-session__item" v-if="laps">
                <InCarStatComponent :right="laps" />
            </div>
            <div class="c-in-car-session__item" v-if="timeremaining">
                <InCarStatComponent :right="timeremaining" />
            </div>
            <div class="c-in-car-session__item" v-if="fastestlap">
                <InCarStatComponent :right="fastestlap" />
            </div>
            <div class="c-in-car-session__item" v-if="previouslap">
                <InCarStatComponent :right="previouslap" />
            </div>
        </div>
    </div>
</template>

<style lang="scss">
    .c-in-car-session {
        @include color('background-color', 'pitbox', 0.8);

        display: flex;
        overflow: hidden;
        padding: em(4);
        border-radius: em(8);
    }

    .c-in-car-session__items {
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
        justify-content: center;
    }

    .c-in-car-session__item {
        display: flex;
        // align-items: center;
    }
</style>

<script>
import { inject } from 'vue';
import InCarStatComponent from '../components/InCarStatComponent.vue';

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
        
        const skeleton = {
            a: {
                value: null,
                suffix: null,
                monospace: false,
                zerofill: null,
            },
            b: {
                value: null,
                suffix: null,
                monospace: false,
                zerofill: null
            }
        }

        return {
            mRacePositionDisplay,
            mNumParticipantsDisplay,
            mCurrentLapDisplay,
            mLapsInEventDisplay,
            mEventTimeRemainingDisplay,
            mSessionAdditionalLapsDisplay,
            mFastestLapTimesDisplay,
            mLastLapTimesDisplay,
            skeleton,
        };
    },
    components: {
        InCarStatComponent
    },
    computed: {
        position() {
            if (!this.mRacePositionDisplay) {
                return null;
            }

            let data = JSON.parse(JSON.stringify(this.skeleton));

            // update data
            data.a.value = this.mRacePositionDisplay;
            if (this.mNumParticipantsDisplay) {
                data.a.suffix = this.mNumParticipantsDisplay ? `/${this.mNumParticipantsDisplay}` : null;
            }
            data.a.monospace = true;
            data.a.zerofill = 2;
            data.b.value = `Pos`;

            return {a: data};
        },
        laps() {
            if (!this.mCurrentLapDisplay) {
                return null;
            }

            let data = JSON.parse(JSON.stringify(this.skeleton));

            // update data
            data.a.value = this.mCurrentLapDisplay;
            if (this.mLapsInEventDisplay) {
                data.a.suffix = this.mLapsInEventDisplay ? `/${this.mLapsInEventDisplay}` : null;
            }
            data.a.monospace = true;
            data.a.zerofill = 1;
            if (this.mLapsInEventDisplay) {
                data.a.zerofill = `${this.mLapsInEventDisplay}`.length;
            }
            data.b.value = `Lap`;

            return {a: data};
        },
        timeremaining() {
            if (!this.mEventTimeRemainingDisplay) {
                return null;
            }

            let data = JSON.parse(JSON.stringify(this.skeleton));

            // update data
            data.a.value = this.mEventTimeRemainingDisplay;
            data.a.monospace = true;
            data.b.value = `Remaining`;
            if (this.mSessionAdditionalLapsDisplay >= 1) {
                data.b.value += ` (+${this.mSessionAdditionalLapsDisplay} lap)`;
            }

            return {a: data};
        },
        fastestlap() {
            if (!this.mFastestLapTimesDisplay) {
                return null;
            }

            let data = JSON.parse(JSON.stringify(this.skeleton));

            // update data
            data.a.value = this.mFastestLapTimesDisplay;
            data.a.monospace = true;
            data.b.value = `Fastest Lap`;

            return {a: data};
        },
        previouslap() {
            if (!this.mLastLapTimesDisplay) {
                return null;
            }

            let data = JSON.parse(JSON.stringify(this.skeleton));

            // update data
            data.a.value = this.mLastLapTimesDisplay;
            data.a.monospace = true;
            data.b.value = `Previous Lap`;

            return {a: data};
        },
    },
}
</script>
