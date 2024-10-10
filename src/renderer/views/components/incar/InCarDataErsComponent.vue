<template>
    <div class="c-in-car-data-ers" v-for="item in vERS">
        <span class="c-in-car-data-ers__state" :state="item.state"></span>
        <span class="c-in-car-data-ers__label">{{ item.label }}</span>
        <span class="c-in-car-data-ers__mode" v-if="item.suffix !== null">
            <span class="c-in-car-data-ers__icon">
                <SvgComponent svg="icon--power" />
            </span>
            <span class="c-in-car-data-ers__text">{{ item.suffix }}</span>
        </span>
        <span class="c-in-car-data-ers__level" v-if="item.value !== null">
            <span class="c-in-car-data-ers__amount" :style="`transform: scaleX(${item.value})`">
                <span class="c-in-car-data-ers__charge-status"></span>
            </span>
        </span>
    </div>
</template>

<style lang="scss">
.c-in-car-data-ers {
    position: relative;
    width: em(148);
    height: em(64);

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    clip-path: polygon(
        em(10) em(0),
        em(148) em(0),
        em(148 - 10) em(64),
        em(0) em(64),
    );
}

.c-in-car-data-ers__state {
    @include color('background-color', 'white', 0.2);

    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;

    // Not available
    // &[state="0"] {

    // }

    // Disabled/Charging
    &[state="1"] {
        ~ .c-in-car-data-ers__level {
            .c-in-car-data-ers__charge-status {
                animation-name: charging;
            }
        }
    }

    // Disabled/Depleating
    &[state="2"] {
        ~ .c-in-car-data-ers__level {
            .c-in-car-data-ers__charge-status {
                animation-name: charging;
                animation-duration: 900ms;
                animation-direction: reverse;
            }
        }
    }

    // Disabled/Full
    &[state="3"] {}

    // Enabled/Charging
    &[state="4"] {
        @include color('background-color', 'blue');

        ~ .c-in-car-data-ers__level {
            .c-in-car-data-ers__charge-status {
                animation-name: charging;
            }
        }
    }

    // Enabled/Depleating
    &[state="5"] {
        @include color('background-color', 'blue');

        ~ .c-in-car-data-ers__level {
            .c-in-car-data-ers__charge-status {
                animation-name: charging;
                animation-duration: 900ms;
                animation-direction: reverse;
            }
        }
    }

    // Enabled/Full
    &[state="6"] {
        @include color('background-color', 'blue');
    }
}

.c-in-car-data-ers__label {
    @include color('color', 'white');

    position: relative;
    font-size: em(20);
    line-height: 1em;
    text-transform: uppercase;
}

.c-in-car-data-ers__mode {
    position: relative;
    margin: em(6) 0 0 em(-10);
    display: flex;
    align-items: center;
}

.c-in-car-data-ers__icon {
    width: em(12);
    margin: 0 em(4) 0 0;
}

.c-in-car-data-ers__text {
    font-size: em(12);
    line-height: 1em;
    text-transform: uppercase;
}

.c-in-car-data-ers__level {
    @include color('background-color', 'white', 0.2);

    position: absolute;
    right: em(10);
    bottom: 0;
    left: 0;
    height: em(2);
}

.c-in-car-data-ers__amount {
    @include color('background-color', 'white', 0.5);

    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    overflow: hidden;

    transform: scaleX(0.5);
    transform-origin: 0 0;
}

.c-in-car-data-ers__charge-status {
    @include color('background-color', 'white', 1);

    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;

    transform: scaleX(1);
    transform-origin: 0 0;

    animation-name: none;
    animation-duration: 1800ms;
    animation-timing-function: linear;
    animation-direction: normal;
    animation-fill-mode: forwards;
    animation-iteration-count: infinite;
}


</style>

<script>
import { inject } from 'vue';
import SvgComponent from '../SvgComponent.vue';

export default {
    setup() {
        const vERS = inject('vERS');

        return {
            vERS
        }
    }
}
</script>
