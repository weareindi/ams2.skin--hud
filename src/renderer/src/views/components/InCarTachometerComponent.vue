<template>
    <div class="c-in-car-tachometer" v-if="mRpmDisplay !== null">
        <div class="c-in-car-tachometer__body">
            <span class="c-in-car-tachometer__value">
                <span class="c-in-car-tachometer__zerofill">{{ zerofill }}</span>
                <span class="c-in-car-tachometer__amount">{{ mRpmDisplay }}</span>
            </span>
            <span class="c-in-car-tachometer__ui" v-if="mRpmPercentage !== null">
                <span class="c-in-car-tachometer__ui-bg"></span>
                <span class="c-in-car-tachometer__ui-amount" :style="{ clipPath: `rect(0 ${ mRpmPercentage }% 100% 0)` }"></span>
                <span class="c-in-car-tachometer__ui-limit" :style="{ clipPath: `rect(0 ${ mRpmPercentage }% 100% 0)`, opacity: `${mRpmPercentage}%` }"></span>
                <span class="c-in-car-tachometer__ui-over" v-if="mRpmPercentage >= 97" :style="{ clipPath: `rect(0 ${ mRpmPercentage }% 100% 0)`, opacity: `${mRpmPercentage}%` }"></span>
            </span>
        </div>
    </div>
</template>

<style lang="scss">
.c-in-car-tachometer {
    display: flex;
    align-items: center;
    border-radius: em(3);
}

.c-in-car-tachometer__body {
    position: relative;
    padding: em(4);
}

.c-in-car-tachometer__value {
    position: absolute;
    top: em(4);
    left: em(4);
}

.c-in-car-tachometer__zerofill {
    opacity: 0.1;
}

.c-in-car-tachometer__amount {}

.c-in-car-tachometer__ui {
    position: relative;
    display: block;
    width: em(198);
    height: em(52);
    mask-image: url('@public/ui/ui--tachometer--198x52.svg');
    mask-size: 100% 100%;
}

.c-in-car-tachometer__ui-bg {
    @include color('background-color', 'white');

    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0.1;
}

.c-in-car-tachometer__ui-amount {
    @include color('background-color', 'white');

    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    clip-path: rect(0 0% 100% 0);
    transition: 50ms clip-path 0ms linear;
    will-change: auto;
}

.c-in-car-tachometer__ui-limit {
    @include linearGradient('blue', 0, 50%, 'blue', 1, 100%);

    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    clip-path: rect(0 0% 100% 0);
    transition:
        50ms clip-path 0ms linear,
        50ms opacity 0ms linear;
    will-change: auto;
}

.c-in-car-tachometer__ui-over {
    @include color('background-color', 'red');

    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    clip-path: rect(0 0% 100% 0);
    transition:
        50ms clip-path 0ms linear,
        50ms opacity 0ms linear;
    will-change: auto;
}
</style>

<script>
import { inject } from 'vue';

export default {
    setup() {
        const mRpmDisplay = inject('mRpmDisplay');
        const mRpmPercentage = inject('mRpmPercentage');

        return {
            mRpmDisplay,
            mRpmPercentage,
        }
    },
    computed: {
        zerofill() {
            return ('00000').substring(0, 5).slice(`${this.mRpmDisplay}`.length);
        }
    }
}
</script>

