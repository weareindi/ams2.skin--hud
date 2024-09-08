<template>
    <div class="c-in-car-data-tachometer" v-for="item in vTachometer">
        <span class="c-in-car-data-tachometer__total"></span>
        <span class="c-in-car-data-tachometer__amount" :style="`transform: scaleX(${item.value})`" :state="item.state"></span>
    </div>
</template>

<style lang="scss">
.c-in-car-data-tachometer {
    position: relative;
    width: em(330);
    height: em(30);
    mask: url('@public/masks/tachometer-mask.svg');
    mask-size: 100% 100%;
}

.c-in-car-data-tachometer__total,
.c-in-car-data-tachometer__amount {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
}

.c-in-car-data-tachometer__total {
    @include color('background-color', 'white', 0.2);
}

.c-in-car-data-tachometer__amount {
    @include color('background-color', 'white', 1);

    transform: scaleX(0);
    transform-origin: 0 0;

    &[state="0"] {
        // same as default
    }

    // &[state="1"] {
    //     @include color('background-color', 'blue', 1);
    // }

    // &[state="2"] {
    //     @include color('background-color', 'green', 1);
    // }

    // &[state="3"] {
    //     @include color('background-color', 'red', 1);
    // }

    &[state="4"] {
        @include color('background-color', 'red', 1);

        // animation-name: flash;
        // animation-duration: 150ms;
        // animation-timing-function: linear;
        // animation-direction: alternate;
        // animation-fill-mode: forwards;
        // animation-iteration-count: infinite;
    }
}

</style>

<script>
import { inject } from 'vue';

export default {
    setup() {
        const vTachometer = inject('vTachometer');

        return {
            vTachometer,
        };
    },
}
</script>
