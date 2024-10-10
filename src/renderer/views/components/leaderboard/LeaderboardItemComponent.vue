<template>
    <div class="s-leaderboard-item" :active="`${data.vParticipantIndex[0].additional ? 'true' : 'false'}`">
        <div class="s-leaderboard-item__body" magnetic-parent>
            <div class="s-leaderboard-item__items">
                <div class="s-leaderboard-item__item s-leaderboard-item__item--position" v-if="data.vCarClassPosition">
                    <div class="s-leaderboard-item__value" v-if="data.vCarClassPosition[0].value" v-html="data.vCarClassPosition[0].value"></div>
                </div>
                <div class="s-leaderboard-item__item s-leaderboard-item__item--position" v-if="data.vRacePosition">
                    <div class="s-leaderboard-item__value" v-if="data.vRacePosition[0].value" v-html="data.vRacePosition[0].value"></div>
                </div>
                <div class="s-leaderboard-item__item s-leaderboard-item__item--tag" v-if="data.vNameTag">
                    <div class="s-leaderboard-item__value" v-html="data.vNameTag[0].value"></div>
                </div>
                <div class="s-leaderboard-item__item s-leaderboard-item__item--name" v-if="data.vNameShort">
                    <div class="s-leaderboard-item__value" v-if="data.vNameShort[0].value" v-html="data.vNameShort[0].value"></div>
                </div>
                <div class="s-leaderboard-item__item s-leaderboard-item__item--timing" v-if="data.vTiming">
                    <div class="s-leaderboard-item__value" v-if="data.vTiming[0].value" :state="data.vTiming[0].state" v-html="data.vTiming[0].value"></div>
                </div>
            </div>
            <div class="s-leaderboard-item__statuses">
                <div class="s-leaderboard-item__status" v-if="data.vPitModes[0].value > 0">
                    <div class="s-leaderboard-item__value" v-html="data.vPitModes[0].label"></div>
                </div>
                <div class="s-leaderboard-item__status" v-if="data.vPitSchedules[0].value != 0 && data.vPitModes[0].value == 0">
                    <div class="s-leaderboard-item__value" v-html="data.vPitSchedules[0].label"></div>
                </div>
                <div class="s-leaderboard-item__status" v-if="data.vPitModes[0].value == 0 && data.vPitSchedules[0].value != 1 && data.vOutLap[0].value == true">
                    <div class="s-leaderboard-item__value" v-html="data.vOutLap[0].label"></div>
                </div>
            </div>
            <div class="s-leaderboard-item__fastestlap">
                <div class="s-leaderboard-item__value" v-html="data.vIsFastestLap[0].label"></div>
            </div>
        </div>
    </div>
</template>

<style lang="scss">

.s-leaderboard-item {
    &[active="true"] {
        .s-leaderboard-item__items {
            @include color('background-color', 'primary');
            @include color('color', 'secondary');

            &:before {
                content: '';
                position: absolute;
                top: 0;
                right: em(-32);
                bottom: 0;
                left: em(-32);
                background-color: inherit;
                z-index: 1;
            }
        }

        .s-leaderboard-item__item--position,
        .s-leaderboard-item__item--name,
        .s-leaderboard-item__item--timing {
            @include color('color', 'secondary');
        }

        .s-leaderboard-item__status {
            @include color('background-color', 'primary');
            @include color('color', 'secondary');
        }

        .s-leaderboard-item__item--timing {
            .s-leaderboard-item__value {
                &[state="1"] {
                    @include color('color', 'secondary');
                }

                &[state="2"] {
                    @include color('color', 'secondary');
                }

                &[state="3"] {
                    @include color('color', 'secondary');
                }
            }
        }
    }
}

.s-leaderboard-item__body {
    position: relative;
}

.s-leaderboard-item__items {
    display: flex;
    margin: 0 em(-4);
}

.s-leaderboard-item__item {
    position: relative;
    padding: em(1) 0;
    z-index: 2;
}

.s-leaderboard-item__value {
    width: 100%;
    white-space: nowrap;
    overflow: hidden;
    text-transform: uppercase;
    font-size: em(14);
    line-height: 1em;
    padding: em(4, 14) em(6, 14);
}

.s-leaderboard-item__item--position {
    @include color('color', 'primary');

    width: em(29);

    .s-leaderboard-item__value {
        text-align: center;
    }
}

.s-leaderboard-item__item--tag {
    position: relative;
    width: em(48);

    .s-leaderboard-item__value {
        @include color('color', 'secondary');

        position: relative;
        z-index: 2;
        text-transform: uppercase;
        text-align: center;

        &:before {
            @include color('background-color', 'primary');

            content: '';
            position: absolute;
            z-index: -1;
            top: 0;
            right: 0;
            bottom: 0;
            left: 0;
            border-radius: em(2);
            overflow: hidden;
        }
    }

    + .s-leaderboard-item__item--name {
        width: em(100);
    }
}

.s-leaderboard-item__item--name {
    @include color('color', 'primary');

    width: em(100 + 48);

    .s-leaderboard-item__value {
        text-align: left;
        text-overflow: ellipsis;
    }
}

.s-leaderboard-item__item--timing {
    flex-grow: 1;
    flex-shrink: 0;
    flex-basis: auto;

    .s-leaderboard-item__value {
        text-align: right;

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

.s-leaderboard-item__fastestlap {
    @include color('color', 'primary');

    position: absolute;
    top: 0;
    right: 100%;
}

.s-leaderboard-item__statuses {
    position: absolute;
    top: 0;
    left: calc(100% + em(32));
    display: flex;
    flex-wrap: nowrap;
    overflow: hidden;
}

.s-leaderboard-item__status {
    @include color('background-color', 'black', 0.8);
    @include color('color', 'yellow');

    position: relative;
    overflow: hidden;
    padding: em(1) em(8) em(1) em(1);
    clip-path: polygon(-1% 0%, 100% 0%, calc(100% - em(8)) 100%, -1% 100%);
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
