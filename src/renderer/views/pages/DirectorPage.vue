<template>
    <div class="p">
        <Suspense>
            <div class="p__main">
                <div class="p__blank" v-if="vDirectorStatus === 0">
                    Blank
                </div>
                <div class="p__solo" v-if="vDirectorStatus === 1">
                    <SoloScene />
                </div>
                <div class="p__leaderboard" v-if="vDirectorStatus === 2">
                    <LeaderboardScene />
                </div>
                <div class="p__standings" v-if="vDirectorStatus === 3">
                    <StandingsScene />
                </div>
                <div class="p__battle" v-if="vDirectorStatus === 4">
                    <BattleScene />
                </div>
            </div>
        </Suspense>
    </div>
</template>

<style lang="scss">
.p,
.p__main,
.p__blank,
.p__solo,
.p__leaderboard,
.p__standings,
.p__battle {
    width: 100%;
    height: 100%;
}
</style>

<script>
import { inject } from 'vue';
import SoloScene from '../scenes/SoloScene.vue';
import LeaderboardScene from '../scenes/LeaderboardScene.vue';
import StandingsScene from '../scenes/StandingsScene.vue';
import BattleScene from '../scenes/BattleScene.vue';

export default {
    setup() {
        const vDirectorStatus = inject('vDirectorStatus');

        return {
            vDirectorStatus
        }
    },
    components: {
        SoloScene,
        LeaderboardScene,
        StandingsScene,
        BattleScene,
    },
}
</script>

