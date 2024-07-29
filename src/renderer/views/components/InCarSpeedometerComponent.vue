<template>
    <div class="c-in-car-speedometer" :highlight="mRpmHighlight">
        <div class="c-in-car-speedometer__cols">
            <div class="c-in-car-speedometer__col">
                <div class="c-in-car-speedometer__rows">
                    <div class="c-in-car-speedometer__row">
                        <div class="c-in-car-speedometer__items">
                            <div class="c-in-car-speedometer__item c-in-car-speedometer__item--techometer">
                                <InCarTachometerComponent />
                            </div>
                        </div>
                    </div>
                    <div class="c-in-car-speedometer__row">
                        <div class="c-in-car-speedometer__items">
                            <div class="c-in-car-speedometer__item c-in-car-speedometer__item--speed">
                                <InCarSpeedComponent />
                            </div>
                            <div class="c-in-car-speedometer__item c-in-car-speedometer__item--gear">
                                <InCarGearComponent />
                            </div>
                            <div class="c-in-car-speedometer__item c-in-car-speedometer__item--tc">
                                <InCarTCComponent />
                            </div>
                            <div class="c-in-car-speedometer__item c-in-car-speedometer__item--abs">
                                <InCarABSComponent />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="c-in-car-speedometer__col c-in-car-speedometer__col--float-right">
                <div class="c-in-car-speedometer__rows">
                    <div class="c-in-car-speedometer__row" v-if="mDrsStatus">
                        <div class="c-in-car-speedometer__items">
                            <div class="c-in-car-speedometer__item c-in-car-speedometer__item--drs">
                                <InCarDrsComponent />
                            </div>
                        </div>
                    </div>
                    <div class="c-in-car-speedometer__row" v-if="mErsStatus">
                        <div class="c-in-car-speedometer__items">
                            <div class="c-in-car-speedometer__item c-in-car-speedometer__item--ers">
                                <InCarErsComponent />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss">
    .c-in-car-speedometer {
        @include color('background-color', 'pitbox', 0.8);

        position: relative;

        &:after {
            content: '';
            position: absolute;
            z-index: 10;
            top: 0;
            right: 0;
            bottom: 0;
            left: 0;
            // border-radius: em(8);
            mix-blend-mode: overlay;
        }

        &[highlight="1"] {
            &:after {
                @include color('background-color', 'red');
            }
        }
    }

    .c-in-car-speedometer__cols {
        position: relative;
        display: flex;
        flex-direction: row;
    }

    .c-in-car-speedometer__col {
        flex-grow: 0;
        flex-shrink: 0;
        flex-basis: auto;

        display: flex;
        flex-direction: column;
    }

    .c-in-car-speedometer__col--float-right {
        @include color('background-color', 'pitbox', 0.8);

        position: absolute;
        top: 0;
        left: 100%;
        bottom: 0;
    }

    .c-in-car-speedometer__rows {
        flex-grow: 1;
        flex-shrink: 0;
        flex-basis: auto;

        display: flex;
        flex-direction: column;
    }

    .c-in-car-speedometer__row {
        flex-grow: 1;
        flex-shrink: 0;
        flex-basis: auto;

        display: flex;
        flex-direction: column;
    }

    .c-in-car-speedometer__items {
        flex-grow: 1;
        flex-shrink: 0;
        flex-basis: auto;
        
        display: flex;
        flex-direction: row;
    }

    .c-in-car-speedometer__item {
        flex-grow: 1;
        flex-shrink: 0;
        flex-basis: auto;

        display: flex;
        flex-direction: row;
    }

    .c-in-car-speedometer__item--drs,
    .c-in-car-speedometer__item--ers {    }

    .c-in-car-speedometer__item--techometer {
        padding: em(16);
    }

    .c-in-car-speedometer__item--speed {
        flex-grow: 0;
        flex-shrink: 0;
        flex-basis: auto;
        
        padding: 0 em(16) em(16);
    }

    .c-in-car-speedometer__item--gear {
        @include color('border-left-color', 'white', 0.1);

        flex-grow: 1;
        flex-shrink: 0;
        flex-basis: auto;

        border-left-width: 2px;
        border-left-style: solid;
        padding: 0 em(16) em(16);
        align-self: center;
    }

    .c-in-car-speedometer__item--tc {
        flex-grow: 0;
        flex-shrink: 0;
        flex-basis: auto;

        padding: em(16);
    }

    .c-in-car-speedometer__item--abs {
        flex-grow: 0;
        flex-shrink: 0;
        flex-basis: auto;

        padding: em(16);
    }

    .c-in-car-speedometer__item--ers {}
</style>

<script>
import { inject } from 'vue';
import InCarTachometerComponent from '../components/InCarTachometerComponent.vue';
import InCarGearComponent from '../components/InCarGearComponent.vue';
import InCarSpeedComponent from '../components/InCarSpeedComponent.vue';
import InCarDrsComponent from '../components/InCarDrsComponent.vue';
import InCarErsComponent from '../components/InCarErsComponent.vue';
import InCarTCComponent from '../components/InCarTCComponent.vue';
import InCarABSComponent from '../components/InCarABSComponent.vue';

export default {
    setup() {
        const mRpmHighlight = inject('mRpmHighlight');
        const mDrsStatus = inject('mDrsStatus');
        const mErsStatus = inject('mErsStatus');

        return {
            mRpmHighlight,
            mDrsStatus,
            mErsStatus,
        }
    },
    components: {
        InCarTachometerComponent, 
        InCarGearComponent,
        InCarSpeedComponent,
        InCarDrsComponent,
        InCarErsComponent,
        InCarTCComponent,
        InCarABSComponent,
    }
}
</script>
