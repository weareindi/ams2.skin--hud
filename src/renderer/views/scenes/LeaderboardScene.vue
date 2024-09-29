<template>
    <div class="s-leaderboard">
        <div class="s-leaderboard__header">
            <LeaderboardHeaderComponent :vSessionName="vData.vSessionName" :vLaps="vData.vLaps" :vEventTimeRemaining="vData.vEventTimeRemaining" />
        </div>
        <div class="s-leaderboard__body">
            <div class="s-leaderboard__data">
                <div class="s-leaderboard__dgroup" v-for="group in vData.vLeaderboard">
                    <div class="s-leaderboard__dhead">
                        <LeaderboardHeadComponent :mCarClassName="group.mCarClassName" :mCarClassColor="group.mCarClassColor" />
                    </div>
                    <div class="s-leaderboard__dbody" v-for="item in group.participants" :key="item.vParticipantIndex[0].value">
                        <LeaderboardItemComponent :data="item" />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss">
.s-leaderboard {
    @include color('background-color', 'black', 0.8);

    position: absolute;
    // width: em(320);
    top: 50%;
    left: em(32);
    border-radius: em(4);
    padding: 0 0 em(8);
    transform: translateY(-50%);

    // filter: opacity(0);
    // transition: 300ms filter 900ms ease;
}

.s-leaderboard--ready {
    // filter: opacity(1);
}

.s-leaderboard__header {
    padding: em(16);
}

.s-leaderboard__body {}

.s-leaderboard__data {
    position: relative;
    // margin: em(-6);
}

.s-leaderboard__parent {
    position: relative;
}

.s-leaderboard__dgroup {
    position: relative;
}

.s-leaderboard__dhead,
.s-leaderboard__dbody {
    // padding: em(6);
}

.s-leaderboard__dbody {
    // position: relative;
    // display: block;
}

</style>

<script>
import LeaderboardHeaderComponent from '../components/leaderboard/LeaderboardHeaderComponent.vue';
import LeaderboardHeadComponent from '../components/leaderboard/LeaderboardHeadComponent.vue';
import LeaderboardItemComponent from '../components/leaderboard/LeaderboardItemComponent.vue';
import { inject } from 'vue';

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
    // updated() {
    //     // this.resetMagneticParents();
    //     // this.processMagneticParents();
    // },
    // mounted() {
    //     // this.resetMagneticParents();
    //     this.processMagneticParents();
    // },
    // methods: {
    //     resetMagneticParents: function() {
    //         // if (this.TotalParticipants !== this.vData.vLeaderboard.length) {
    //         //     this.$el.classList.remove('s-leaderboard--ready');

    //         //     this.MagneticParentDirectives.forEach((MagneticParentDirective) => {
    //         //         MagneticParentDirective.reset();
    //         //     });
    //         // }
    //     },
    //     processMagneticParents: function() {
    //         // this.TotalParticipants = this.vData.vLeaderboard.length;

    //         this.$el.querySelectorAll('[magnetic-parent]').forEach((surface) => {
    //             new MagneticParentDirective(this.$el, surface);
    //         });

    //         // this.$el.classList.add('s-leaderboard--ready');
    //     }
    // }
}
</script>
