<template>
    <div class="s-leaderboard">
        <div class="s-leaderboard__header">
            <LeaderboardHeaderComponent :vSessionName="vData.vSessionName" :vEventStatus="vData.vEventStatus" />
        </div>
        <div class="s-leaderboard__body" autoscroll>
            <div class="s-leaderboard__data">
                <div class="s-leaderboard__dgroup">
                    <div class="s-leaderboard__dbody" v-for="item in vData.vLeaderboard" :key="item.vParticipantIndex[0].value">
                        <LeaderboardItemComponent :data="item" />
                    </div>
                </div>
                <div class="s-leaderboard__dgroup" v-for="group in vData.vLeaderboardMulticlass">
                    <div class="s-leaderboard__dhead" v-if="group.mCarClassName">
                        <LeaderboardHeadComponent :mCarClassName="group.mCarClassName" />
                    </div>
                    <div class="s-leaderboard__dbody" v-if="group.participants" v-for="item in group.participants" :key="item.vParticipantIndex[0].value">
                        <LeaderboardItemComponent :data="item" />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss">
.s-leaderboard {
    @include color('background-color', 'secondary', 0.8);

    position: absolute;
    width: em(360);
    top: 0;
    left: 0;
    bottom: 0;
    display: flex;
    flex-direction: column;
}

.s-leaderboard__header {
    flex-grow: 0;
    flex-shrink: 0;
    flex-basis: auto;

    padding: em(32) em(32) 0;
}

.s-leaderboard__body {
    @include scrollbars();

    position: relative;
    overflow-x: hidden;
    overflow-y: scroll;
    padding: 0 em(32) em(32);
    width: 100vw;
}

.s-leaderboard__data {
    position: relative;
    width: em(360 - (32 * 2));
}

.s-leaderboard__dgroup {
    position: relative;

    ~ .s-leaderboard__dgroup {
        margin: em(16) 0 0;
    }
}

</style>

<script>
import LeaderboardHeaderComponent from '../components/leaderboard/LeaderboardHeaderComponent.vue';
import LeaderboardHeadComponent from '../components/leaderboard/LeaderboardHeadComponent.vue';
import LeaderboardItemComponent from '../components/leaderboard/LeaderboardItemComponent.vue';
import { inject } from 'vue';
// import AutoScrollDirective from '../../assets/js/Directives/AutoScrollDirective/AutoScrollDirective.js';

export default {
    setup() {
        const vData = inject('vData');

        return {
            vData,
        }
    },
    components: {
        LeaderboardHeaderComponent,
        LeaderboardHeadComponent,
        LeaderboardItemComponent,
    },
    mounted() {
        // new AutoScrollDirective(this.$el.querySelector('[autoscroll]'));
    },
}
</script>
