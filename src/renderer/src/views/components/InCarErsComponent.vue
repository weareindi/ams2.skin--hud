<template>
    <div class="c-in-car-ers" :state="state" v-if="isErsAvailableDisplay">
        <div class="c-in-car-ers__widget">
            <div class="c-in-car-ers__label">ERS</div>
            <div class="c-in-car-ers__state" v-if="mErsDeploymentModeDisplay != 'Auto'">
                <span class="c-in-car-ers__state-icon"><SvgComponent svg="icon--power" /></span>
                <span class="c-in-car-ers__state-text">{{ mErsDeploymentModeDisplay }}</span>
            </div>
        </div>
        <div class="c-in-car-ers__amount" :style="{ width: `${mBoostAmountDisplay}%` }"></div>
    </div>
</template>

<style lang="scss">
.c-in-car-ers {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    padding: em(12);
    border-radius: em(3);
    overflow: hidden;

    &:before {
        @include color('background-color', 'blue', 1);

        content: '';
        position: absolute;
        z-index: 1;
        top: em(4);
        right: em(4);
        bottom: em(4);
        left: em(4);
        border-radius: em(2);
        opacity: 0;
        transition: 300ms opacity 0ms linear;
    }

    &[state="disabled-charging"] {
        .c-in-car-ers__amount {
            @include color('background-color', 'blue', 0.4);

            &:after {
                @include color('background-color', 'blue', 1);

                animation-name: charging;
                animation-duration: 900ms;
                animation-timing-function: linear;
                animation-iteration-count: infinite;
            }
        }
    }

    &[state="enabled-charging"] {
        &:before {
            opacity: 1;
        }

        .c-in-car-ers__widget {
            // @include color('border-color', 'blue', 0);
            @include color('color', 'white', 1);
        }

        svg {
            path {
                @include color('fill', 'white', 1);
            }
        }

        .c-in-car-ers__amount {
            @include color('background-color', 'white', 0.4);

            transform: translateX(-50%) translateY(em(-(4 + 8))) scaleX(0.8);

            &:after {
                @include color('background-color', 'white', 1);

                animation-name: charging;
                animation-duration: 900ms;
                animation-timing-function: linear;
                animation-iteration-count: infinite;
            }
        }
    }

    &[state="disabled-depleating"] {
        &:before {
            opacity: 1;
        }

        .c-in-car-ers__widget {
            @include color('color', 'white', 1);

            // &:before {
            //     opacity: 0;
            //     transform: scale(1);
            // }
        }

        svg {
            path {
                @include color('fill', 'white', 1);
            }
        }

        .c-in-car-ers__amount {
            @include color('background-color', 'white', 0.6);

            transform: translateX(-50%) translateY(em(-(4 + 8))) scaleX(0.8);

            &:after {
                @include color('background-color', 'white', 1);

                animation-name: charging;
                animation-duration: 900ms;
                animation-timing-function: linear;
                animation-iteration-count: infinite;
                animation-direction: reverse;
            }
        }
    }

    &[state="enabled-depleating"] {
        &:before {
            opacity: 1;
        }

        .c-in-car-ers__widget {
            @include color('color', 'white', 1);

            // &:before {
            //     opacity: 0;
            //     transform: scale(1);
            // }
        }

        svg {
            path {
                @include color('fill', 'white', 1);
            }
        }

        .c-in-car-ers__amount {
            @include color('background-color', 'white', 0.6);

            transform: translateX(-50%) translateY(em(-(4 + 8))) scaleX(0.8);

            &:after {
                @include color('background-color', 'white', 1);

                animation-name: charging;
                animation-duration: 900ms;
                animation-timing-function: linear;
                animation-iteration-count: infinite;
                animation-direction: reverse;
            }
        }
    }

    &[state="enabled-full"] {
        &:before {
            opacity: 1;
        }

        .c-in-car-ers__widget {
            @include color('color', 'white', 1);
        }

        svg {
            path {
                @include color('fill', 'white', 1);
            }
        }

        .c-in-car-ers__amount {
            @include color('background-color', 'white', 1);

            transform: translateX(-50%) translateY(em(-(4 + 8))) scaleX(0.8);
        }
    }
}

.c-in-car-ers__widget {
    @include color('color', 'white', 0.2);

    position: relative;
    z-index: 2;
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    padding: em(4) em(10); 
    width: em(120);
    height: em(48);
}

.c-in-car-ers__label {
    font-family: 'firacode', monospace;
    font-size: em(18);
    line-height: 1em;
    letter-spacing: 0.1em;
    text-transform: uppercase;
}

.c-in-car-ers__state {
    margin-top: em(2);
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
}

.c-in-car-ers__state-icon {
    margin-right: em(4);
    width: em(12);
    height: em(12);
    flex-grow: 0;
    flex-shrink: 0;
    flex-basis: auto;
}

.c-in-car-ers__state-text {
    font-family: 'firacode', monospace;
    font-size: em(12);
    line-height: 1em;
    text-transform: uppercase;
    flex-grow: 0;
    flex-shrink: 0;
    flex-basis: auto;
}

.c-in-car-ers__amount {
    @include color('background-color', 'blue', 0.4);

    position: absolute;
    bottom: 0;
    left: 50%;
    z-index: 2;
    overflow: hidden;
    width: 100%;
    height: em(4);
    border-radius: em(2);
    transform: translateX(-50%) translateY(0) scaleX(1);
    transition:
        150ms transform 0ms linear,
        50ms clip-path 0ms linear;

    will-change: auto;

    &:after {
        @include color('background-color', 'white', 0.4);

        content: '';
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        width: 100%;
        transform: translateX(-100%);
        transform-origin: 0 0;
        opacity: 1;
        will-change: auto;
    }
}

</style>

<script>
import { inject } from 'vue';

export default {
    setup() {
        const mBoostActiveDisplay = inject('mBoostActiveDisplay');
        const mBoostAmountDisplay = inject('mBoostAmountDisplay');
        const mErsAutoModeEnabledDisplay = inject('mErsAutoModeEnabledDisplay');
        const mErsDeploymentModeDisplay = inject('mErsDeploymentModeDisplay');
        const boostStatusDisplay = inject('boostStatusDisplay');
        const isErsAvailableDisplay = inject('isErsAvailableDisplay');


        return {
            mBoostActiveDisplay,
            mBoostAmountDisplay,
            mErsAutoModeEnabledDisplay,
            mErsDeploymentModeDisplay,
            boostStatusDisplay,
            isErsAvailableDisplay,
        }
    },
    computed: {
        state() {
            let state = null;
            
            if (this.mBoostActiveDisplay === false && this.boostStatusDisplay === 2) {
                state = 'disabled-charging';
            }
            
            if (this.mBoostActiveDisplay === false && this.boostStatusDisplay === 1) {
                state = 'disabled-depleating';
            }
            
            if (this.mBoostActiveDisplay === false && this.boostStatusDisplay === 0) {
                state = 'disabled-full';
            }

            if (this.mBoostActiveDisplay === true && this.boostStatusDisplay === 2) {
                state = 'enabled-charging';
            }

            if (this.mBoostActiveDisplay === true && this.boostStatusDisplay === 1) {
                state = 'enabled-depleating';
            }

            if (this.mBoostActiveDisplay === true && this.boostStatusDisplay === 0) {
                state = 'enabled-full';
            }

            return state;
        }
    },
}
</script>
