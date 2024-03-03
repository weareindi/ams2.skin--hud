<template>
    <div class="c-in-car-tachometer" v-if="mRpmDisplay !== null">
        <div class="c-in-car-tachometer__body">
            <span class="c-in-car-tachometer__ui" v-if="mRpmPercentage !== null">
                <span class="c-in-car-tachometer__ui-bg"></span>
                <span class="c-in-car-tachometer__ui-amount" :style="{ clipPath: `rect(0 ${ mRpmPercentage.value }% 100% 0)` }"></span>
                <span class="c-in-car-tachometer__ui-limit" :style="{ clipPath: `rect(0 ${ mRpmPercentage.value }% 100% 0)`, opacity: `${mRpmPercentage.value}%` }"></span>
                <span class="c-in-car-tachometer__ui-over" v-if="mRpmHighlight" :style="{ clipPath: `rect(0 ${ mRpmPercentage.value }% 100% 0)`, opacity: `${mRpmPercentage.value}%` }"></span>
            </span>
            <span class="c-in-car-tachometer__value">
                <span class="c-in-car-tachometer__zerofill">{{ mRpmDisplay.zerofill }}</span>
                <span class="c-in-car-tachometer__amount">{{ mRpmDisplay.value }}</span>
            </span>
        </div>
    </div>
</template>

<style lang="scss">
.c-in-car-tachometer {}

.c-in-car-tachometer__body {
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    align-items: flex-end;
}

.c-in-car-tachometer__ui {
    position: relative;
    display: block;
    width: em(310);
    height: em(20);
    mask-image: url('@public/ui/mask--tachometer--604x32.svg');
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

.c-in-car-tachometer__value {
    display: block;
    
}

.c-in-car-tachometer__zerofill {
    opacity: 0.1;
}

.c-in-car-tachometer__amount,
.c-in-car-tachometer__zerofill {
    font-family: 'firecode', monospace;
    font-size: em(12);
    line-height: 1em;
}

.c-in-car-tachometer__amount {}
</style>

<script>
import { inject } from 'vue';

export default {
    setup() {
        const mRpmDisplay = inject('mRpmDisplay');
        const mRpmPercentage = inject('mRpmPercentage');
        const mRpmHighlight = inject('mRpmHighlight');
        
        return {
            mRpmDisplay,
            mRpmPercentage,
            mRpmHighlight,
        }
    },
}
</script>

