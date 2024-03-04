<template>
    <div class="c-in-car-tachometer" v-if="mRpmDisplay !== null">
        <div class="c-in-car-tachometer__body">
            <span class="c-in-car-tachometer__ui" v-if="mRpmPercentage !== null">
                <span class="c-in-car-tachometer__ui-bg"><SvgComponent svg="mask--tachometer" /></span>
                <span class="c-in-car-tachometer__ui-amount"v-if="!mRpmHighlight" :style="{ clipPath: `inset(0 ${ 100 - mRpmPercentage.value }% 0 0)` }"><SvgComponent svg="mask--tachometer" /></span>
                <span class="c-in-car-tachometer__ui-over" v-if="mRpmHighlight" :style="{ clipPath: `inset(0 ${ 100 - mRpmPercentage.value }% 0 0)` }"><SvgComponent svg="mask--tachometer" /></span>
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
    width: em(312);
    height: em(18);    
}

.c-in-car-tachometer__ui-bg {
    position: absolute;
    z-index: 1;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    clip-path: inset(0 0 0 0);

    svg {
        path {
            @include color('fill', 'white', 0.1);
        }
    }
}

.c-in-car-tachometer__ui-amount {
    position: absolute;
    z-index: 2;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    clip-path: inset(0 0 0 0);
    transition: 50ms clip-path 0ms linear;
    will-change: auto;

    svg {
        path {
            @include color('fill', 'white', 1);
        }
    }
}

.c-in-car-tachometer__ui-over {
    // @include color('background-color', 'red');

    position: absolute;
    z-index: 4;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    clip-path: inset(0 0 0 0);
    transition: 50ms clip-path 0ms linear;
    will-change: auto;

    svg {
        path {
            @include color('fill', 'red', 1);
        }
    }
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
import SvgComponent from './SvgComponent.vue';

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

