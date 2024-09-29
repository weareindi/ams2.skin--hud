<template>
    <div class="s-leaderboard-item">
        <div class="s-leaderboard-item__body" magnetic-parent>
            <div class="s-leaderboard-item__items">
                <div class="s-leaderboard-item__item s-leaderboard-item__item--position">
                    <div class="s-leaderboard-item__value" v-if="data.vCarClassPosition[0].value" v-html="data.vCarClassPosition[0].value"></div>
                </div>
                <div class="s-leaderboard-item__item s-leaderboard-item__item--name">
                    <div class="s-leaderboard-item__value" v-if="data.vNameShort[0].value" v-html="data.vNameShort[0].value"></div>
                </div>
                <div class="s-leaderboard-item__item s-leaderboard-item__item--tag">
                    <div class="s-leaderboard-item__value" v-if="data.vNameTag[0].value" v-html="data.vNameTag[0].value"></div>
                </div>
                <div class="s-leaderboard-item__item s-leaderboard-item__item--timing">
                    <div class="s-leaderboard-item__value" v-if="data.vTiming[0].value" :state="data.vTiming[0].state" v-html="data.vTiming[0].value"></div>
                </div>
            </div>
            <div class="s-leaderboard-item__statuses">
                <div class="s-leaderboard-item__status" v-if="data.vPitModes[0].value > 0">
                    <div class="s-leaderboard-item__tag">
                        <div class="s-leaderboard-item__value" v-html="data.vPitModes[0].label"></div>
                    </div>
                </div>
                <div class="s-leaderboard-item__status" v-if="data.vPitSchedules[0].value != 0 && data.vPitModes[0].value == 0">
                    <div class="s-leaderboard-item__tag">
                        <div class="s-leaderboard-item__value" v-html="data.vPitSchedules[0].label"></div>
                    </div>
                </div>
                <div class="s-leaderboard-item__status" v-if="data.vPitModes[0].value == 0 && data.vPitSchedules[0].value != 1 && data.vOutLap[0].value == true">
                    <div class="s-leaderboard-item__tag">
                        <div class="s-leaderboard-item__value" v-html="data.vOutLap[0].label"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss">

.s-leaderboard-item {}

.s-leaderboard-item__body {}

.s-leaderboard-item__items {
    display: grid;
    grid-template-columns: em(36) em(100) em(56) em(100);
    padding: em(4) em(8);
}

.s-leaderboard-item__item {
    // position: relative;
    height: em(16);
    overflow: hidden;
    border-radius: em(4);
    padding: 0 em(8);
}

.s-leaderboard-item__value {
    font-family: 'uifont-mono', monospace;
    width: 100%;
    white-space: nowrap;
    overflow: hidden;
    text-align: left;
    text-overflow: ellipsis;
    font-size: em(9);
    line-height: em(16, 9);
}

.s-leaderboard-item__item--position {
    .s-leaderboard-item__value {
        text-align: center;
    }
}

.s-leaderboard-item__item--name {
    .s-leaderboard-item__value {
        @include color('color', 'yellow');
    }
}

.s-leaderboard-item__item--tag {
    position: relative;

    .s-leaderboard-item__value {
        @include color('color', 'black');

        text-align: center;

        &:before {
            @include color('background-color', 'yellow');

            content: '';
            position: absolute;
            z-index: -1;
            top: 0;
            right: 0;
            bottom: 0;
            left: 0;
        }
    }
}

.s-leaderboard-item__item--timing {
    .s-leaderboard-item__value {
        text-align: center;

        &[state="1"] {
            @include color('color', 'yellow');
        }

        &[state="2"] {
            @include color('color', 'green');
        }

        &[state="3"] {
            @include color('color', 'red');
        }
    }
}

.s-leaderboard-item__statuses {
    position: absolute;
    top: 0;
    left: 100%;
    display: flex;
    flex-wrap: nowrap;
    overflow: hidden;
}

.s-leaderboard-item__status {
    ~ .s-leaderboard-item__status {
        margin: 0 0 0 em(-6);
        padding: em(4) em(16) em(4) em(16);
        clip-path: polygon(em(8) 0%, 100% 0%, calc(100% - em(8)) 100%, 0% 100%);
    }
}

.s-leaderboard-item__tag {
    @include color('background-color', 'black', 0.8);
    @include color('color', 'yellow');

    position: relative;
    height: em(24);
    overflow: hidden;
    padding: em(4) em(16) em(4) em(8);
    clip-path: polygon(0% 0%, 100% 0%, calc(100% - em(8)) 100%, 0% 100%);
}

</style>

<script>
import MagneticParentDirective from '../../../assets/js/Directives/MagneticParentDirective/MagneticParentDirective.js';

export default {
    props: {
        data: null,
        mode: null,
    },
    mounted() {
        new MagneticParentDirective(this.$el.querySelector('[magnetic-parent]').parentNode.parentNode.parentNode, this.$el.querySelector('[magnetic-parent]'));
    }
}
</script>
