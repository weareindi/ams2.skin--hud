<template>
    <div class="c-in-car-info" :status="status" :highlight="highlight">
        <div class="c-in-car-info__visual">
            <div class="c-in-car-info__icon" v-if="icon" :class="`${icon ? 'c-in-car-info__icon--' + icon : ''}`">
                <span class="c-in-car-info__svg"><SvgComponent :svg="`icon--${icon}`" /></span>
            </div>
        </div>
        <div class="c-in-car-info__values">
            <div class="c-in-car-info__value c-in-car-info__value--a" v-if="a">
                <span class="c-in-car-info__zerofill">{{ a.zerofill }}</span>
                <span class="c-in-car-info__amount">{{ a.value }}</span>
                <span class="c-in-car-info__suffix">{{ a.suffix }}</span>
                <span class="c-in-car-info__label">{{ a.label }}</span>
            </div>
            <div class="c-in-car-info__value c-in-car-info__value--b" v-if="b">
                <span class="c-in-car-info__zerofill">{{ b.zerofill }}</span>
                <span class="c-in-car-info__amount">{{ b.value }}</span>
                <span class="c-in-car-info__suffix">{{ b.suffix }}</span>
                <span class="c-in-car-info__label">{{ b.label }}</span>
            </div>
            <div class="c-in-car-info__value c-in-car-info__value--c" v-if="c">
                <span class="c-in-car-info__zerofill">{{ c.zerofill }}</span>
                <span class="c-in-car-info__amount">{{ c.value }}</span>
                <span class="c-in-car-info__suffix">{{ c.suffix }}</span>
                <span class="c-in-car-info__label">{{ c.label }}</span>
            </div>
        </div>
        <span class="c-in-car-info__highlight"></span>
    </div>
</template>

<style lang="scss">
.c-in-car-info {
    display: flex;
    position: relative;
    align-items: center;

    &[status="1"] {
        .c-in-car-info__svg {
            svg {
                path {
                    @include color('fill', 'red', 1);
                }
            }
        }
    }

    &[status="2"] {
        .c-in-car-info__svg {
            svg {
                path {
                    @include color('fill', 'red', 1);
                }
            }
        }
    }

    &[status="3"] {
        .c-in-car-info__svg {
            svg {
                path {
                    @include color('fill', 'red', 1);
                }
            }
        }
    }

    &[status="4"] {
        .c-in-car-info__svg {
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
        .c-in-car-info__highlight {
            @include color('background-color', 'red');
        }
    }

    &[highlight="2"] {
        .c-in-car-info__highlight {
            @include color('background-color', 'blue');
        }
    }

    &[highlight="3"] {
        .c-in-car-info__highlight {
            @include color('background-color', 'green');
        }
    }

    &[highlight="4"] {
        .c-in-car-info__highlight {
            @include color('background-color', 'yellow');
        }
    }
}

.c-in-car-info__visual {
    position: relative;
    z-index: 1;
}

.c-in-car-info__icon {
    width: em(24);
    margin:  0 em(12) 0 0;
}

.c-in-car-info__svg {}

.c-in-car-info__values {
    display: flex;
    margin: em(-4);
}

.c-in-car-info__value {
    padding: em(4);
}

.c-in-car-info__value--a {}

.c-in-car-info__value--b {}

.c-in-car-info__value--c {}

.c-in-car-info__zerofill,
.c-in-car-info__amount,
.c-in-car-info__suffix {
    display: inline-block;
    font-family: 'firacode', monospace;
    font-size: em(12);
    line-height: 1em;
}

.c-in-car-info__zerofill {
    opacity: 0.1;
}

.c-in-car-info__amount {}

.c-in-car-info__suffix {
    opacity: 0.4;
}

.c-in-car-info__label {
    display: block;
    opacity: 0.6;
    font-size: em(12);
    line-height: 1em;
}

.c-in-car-info__highlight {
    position: absolute;
    z-index: 2;
    top: em(-8);
    left: em(-8);
    right: em(-8);
    bottom: em(-8);
    border-radius: em(2);
    opacity: 0.25;
    mix-blend-mode: hard-light;
}
</style>

<script>
import InCarLevelComponent from './InCarLevelComponent.vue';

export default {
    props: {
        icon: null,
        status: null,
        highlight: null,
        a: null,
        b: null,
        c: null,
    },
    components: {
        InCarLevelComponent
    }
}
</script>
