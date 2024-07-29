<template>
    <div class="c-in-car-stat" :align="align" :valign="valign" :status="status" :highlight="highlight">
        <div class="c-in-car-stat__values c-in-car-stat__values--upper" v-if="valign === 'top'">
            <div class="c-in-car-stat__value c-in-car-stat__value--b" v-if="b">
                <span class="c-in-car-stat__zerofill">{{ b.zerofill }}</span>
                <span class="c-in-car-stat__amount">{{ b.value }}</span>
                <span class="c-in-car-stat__suffix">{{ b.suffix }}</span>
            </div>
            <div class="c-in-car-stat__value c-in-car-stat__value--a" v-if="a">
                <span class="c-in-car-stat__zerofill">{{ a.zerofill }}</span>
                <span class="c-in-car-stat__amount">{{ a.value }}</span>
                <span class="c-in-car-stat__suffix">{{ a.suffix }}</span>
            </div>
        </div>
        <div class="c-in-car-stat__visual" v-if="level">
            <div class="c-in-car-stat__icon" v-if="icon" :class="`${icon ? 'c-in-car-stat__icon--' + icon : ''}`">
                <span class="c-in-car-stat__svg"><SvgComponent :svg="`icon--${icon}`" :flipX="flipX" :flipY="flipY" /></span>
                <span class="c-in-car-stat__icon-overlay" v-if="iconOverlay">{{ iconOverlay.value }}</span>
            </div>
            <div class="c-in-car-stat__meter">
                <InCarLevelComponent :align="align" :value="level.value" />
            </div>
        </div>
        <div class="c-in-car-stat__values c-in-car-stat__values--lower" v-if="valign === 'bottom'">
            <div class="c-in-car-stat__value c-in-car-stat__value--a" v-if="a">
                <span class="c-in-car-stat__zerofill">{{ a.zerofill }}</span>
                <span class="c-in-car-stat__amount">{{ a.value }}</span>
                <span class="c-in-car-stat__suffix">{{ a.suffix }}</span>
            </div>
            <div class="c-in-car-stat__value c-in-car-stat__value--b" v-if="b">
                <span class="c-in-car-stat__zerofill">{{ b.zerofill }}</span>
                <span class="c-in-car-stat__amount">{{ b.value }}</span>
                <span class="c-in-car-stat__suffix">{{ b.suffix }}</span>
            </div>
        </div>
        <span class="c-in-car-stat__highlight"></span>
    </div>
</template>

<style lang="scss">
    .c-in-car-stat {
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        padding: em(12) em(16);

        &[align="right"] {
            align-items: flex-start;

            .c-in-car-stat__values {
                align-items: flex-start;
            }

            .c-in-car-stat__values--upper,
            .c-in-car-stat__values--lower {
                .c-in-car-stat__value {
                    &:after {
                        order: 1;

                        border-right-width: 0;
                        border-left-width: em(2);
                        border-left-style: solid;
                    }
                }
            }

            .c-in-car-stat__visual {
                .c-in-car-stat__meter {
                    order: 1;
                }

                .c-in-car-stat__icon {
                    order: 2;
                    margin: 0 0 0 em(8) ;
                }
            }

            .c-in-car-stat__value {
                &:after {
                    margin: 0 em(4) 0 0;
                }
            }
        }

        &[status="1"] {
            .c-in-car-stat__svg {
                svg {
                    path {
                        @include color('fill', 'green', 1);
                    }
                }
            }
        }

        &[status="2"] {
            .c-in-car-stat__svg {
                svg {
                    path {
                        @include color('fill', 'yellow', 1);
                    }
                }
            }
        }

        &[status="3"] {
            .c-in-car-stat__svg {
                svg {
                    path {
                        @include color('fill', 'red', 1);
                    }
                }
            }
        }

        &[status="4"] {
            .c-in-car-stat__svg {
                svg {
                    path {
                        @include color('fill', 'red', 1);

                        animation-name: destroyed;
                        animation-timing-function: ease-in;
                        animation-duration: 900ms;
                        animation-iteration-count: infinite;
                        animation-fill-mode: forwards;
                        animation-direction: alternate;
                    }
                }
            }
        }

        &[highlight="1"] {
            .c-in-car-stat__highlight {
                @include color('background-color', 'red');
            }
        }

        &[highlight="2"] {
            .c-in-car-stat__highlight {
                @include color('background-color', 'blue');
            }
        }

        &[highlight="3"] {
            .c-in-car-stat__highlight {
                @include color('background-color', 'green');
            }
        }

        &[highlight="4"] {
            .c-in-car-stat__highlight {
                @include color('background-color', 'yellow');
            }
        }
    }

    .c-in-car-stat__values {
        position: relative;
        z-index: 1;
        display: flex;
        flex-direction: column;
        align-items: flex-end;
    }

    .c-in-car-stat__values--upper {
        margin-bottom: em(10);

        .c-in-car-stat__value {
            &:after {                
                @include color('border-color', 'white', 0.1);

                border-top-width: em(2);
                border-top-style: solid;
                border-right-width: em(2);
                border-right-style: solid;
            }
        }
    }

    .c-in-car-stat__values--lower {
        margin-top: em(10);

        .c-in-car-stat__value {
            &:after {
                @include color('border-color', 'white', 0.1);

                border-bottom-width: em(2);
                border-bottom-style: solid;
                border-right-width: em(2);
                border-right-style: solid;
            }
        }
    }

    .c-in-car-stat__value {
        display: flex;
        align-items: center;

        &:after {
            content: '';
            order: 5;
            display: inline-block;
            width: em(8);
            height: em(8);
            margin: 0 0 0 em(4);
        }

        ~ .c-in-car-stat__value {
            margin-top: em(10);
        }
    }

    .c-in-car-stat__zerofill,
    .c-in-car-stat__amount,
    .c-in-car-stat__suffix {
        font-family: 'FiraCode', monospace;
        font-size: em(10);
    }

    .c-in-car-stat__zerofill {
        order: 2;
        opacity: 0.1;
    }

    .c-in-car-stat__amount {
        order: 3;
    }

    .c-in-car-stat__suffix {
        opacity: 0.3;
        order: 4;
        white-space: pre;
    }

    .c-in-car-stat__visual {
        position: relative;
        z-index: 1;
        display: flex;
        flex-direction: row;
        align-items: center;
        height: em(48);
    }

    .c-in-car-stat__meter {
        height: 100%;
    }

    .c-in-car-stat__icon {
        position: relative;
        margin: 0 em(6) 0 0;
    }

    .c-in-car-stat__icon--suspension {
        width: em(12);
    }

    .c-in-car-stat__icon--brake {
        width: em(16);
    }

    .c-in-car-stat__icon--tyre {
        width: em(28);
    }

    .c-in-car-stat__icon--aero {
        width: em(38);
    }

    .c-in-car-stat__icon--engine {
        width: em(36);
    }

    .c-in-car-stat__icon--clutch {
        width: em(36);
    }

    .c-in-car-stat__icon-overlay {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        display: flex;
        font-size: em(11);
        align-items: center;
        justify-content: center;
        font-family: 'firacode', monospace;
        text-align: center;
        vertical-align: text-bottom;
        padding-top: em(2, 11); // align more central
    }

    .c-in-car-stat__highlight {
        position: absolute;
        z-index: 2;
        top: em(8);
        left: em(8);
        right: em(8);
        bottom: em(8);
        border-radius: em(4);
        opacity: 0.25;
        mix-blend-mode: hard-light;
        // opacity: 0;
    }
</style>

<script>
import InCarLevelComponent from './InCarLevelComponent.vue';

export default {
    props: {
        position: null,
        icon: null,
        iconOverlay: null,
        status: null,
        highlight: null,
        level: null,
        a: null,
        b: null,
    },
    components: {
        InCarLevelComponent
    },
    computed: {
        align() { 
            if (this.position == 1 || this.position == 3) {
                return 'right';
            }

            return 'left';
        },
        valign() { 
            if (this.position == 2 || this.position == 3) {
                return 'bottom';
            }

            return 'top';
        },
        flipX() {
            if (this.position == 1 || this.position == 3) {
                return true;
            }

            return false;
        },
        flipY() { 
            if (this.position == 2 || this.position == 3) {
                return true;
            }

            return false;
        }
    }
}
</script>
