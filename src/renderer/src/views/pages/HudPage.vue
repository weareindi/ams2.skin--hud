<template>
    <div class="p">
        <div class="p__settings">
            <Suspense>
                <SettingsModalComponent v-if="isSettingsReady" />
            </Suspense>
        </div>
        <div class="p__hud">
            <PitHudComponent v-if="isHudPitComponentVisible" />
            <DashHudComponent v-if="isHudDashComponentVisible" />
        </div>
    </div>
</template>

<style lang="scss">

.p {}

.p__settings {
    position: fixed;
    z-index: 2;
    top: 0;
    left: 0;
    right: 0;
}

.p__hud {
    position: relative;
    z-index: 1;
}

</style>

<script>
import { inject } from 'vue';
import SettingsModalComponent from '../modals/SettingsModalComponent.vue';
import PitHudComponent from '../huds/PitHudComponent.vue';
import DashHudComponent from '../huds/DashHudComponent.vue';

export default {
    setup() {
        // settings state
        const configIp = inject('configIp');
        const configPort = inject('configPort');
        const configTickRate = inject('configTickRate');
        const configActiveMainDisplay = inject('configActiveMainDisplay');
        const configActiveStreamDisplay = inject('configActiveStreamDisplay');
        const configStartVisible = inject('configStartVisible');

        // game state
        const mGameState = inject('mGameState');
        const mSessionState = inject('mSessionState');
        const mSessionIsPrivate = inject('mSessionIsPrivate');
        const mRaceState = inject('mRaceState');
        const mEventTimeRemainingDisplay = inject('mEventTimeRemainingDisplay');
        const mLapsInEventDisplay = inject('mLapsInEventDisplay');
        
        return {
            configIp,
            configPort,
            configTickRate,
            configActiveMainDisplay,
            configActiveStreamDisplay,
            configStartVisible,
            mGameState,
            mSessionState,
            mSessionIsPrivate,
            mRaceState,
            mEventTimeRemainingDisplay,
            mLapsInEventDisplay,
        }
    },
    components: {
        SettingsModalComponent,
        PitHudComponent,
        DashHudComponent,
    },
    computed: {
        isSettingsReady() {
            if (this.configIp === null) {
                return false;
            }

            if (this.configPort === null) {
                return false;
            }

            if (this.configTickRate === null) {
                return false;
            }

            if (this.configActiveMainDisplay === null) {
                return false;
            }

            if (this.configActiveStreamDisplay === null) {
                return false;
            }

            if (this.configStartVisible === null) {
                return false;
            }

            return true;
        },
        isHudPitComponentVisible() {
            if (!this.mGameState) {
                return false;
            }

            if (this.mGameState !== 4) {
                return false;
            }

            if (!this.mEventTimeRemainingDisplay && !this.mLapsInEventDisplay) {
                return false;
            }

            if (this.mRaceState !== 1 && this.mRaceState !== 3) {
                return false;
            }

            return true;
        },
        isHudDashComponentVisible() {
            if (!this.mGameState) {
                return false;
            }

            if (this.mGameState !== 2) {
                return false;
            }

            return true;
        },
    },
}

</script>

