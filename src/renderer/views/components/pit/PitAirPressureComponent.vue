<template>
    <div class="c-pit-air-pressure">
        <div class="c-pit-air-pressure__rows">
            <div class="c-pit-air-pressure__row">
                <div class="c-pit-air-pressure__items">
                    <div class="c-pit-air-pressure__item">
                        <span class="c-pit-air-pressure__value" v-if="vTyrePressure0" v-html="vTyrePressure0"></span>
                    </div>
                    <div class="c-pit-air-pressure__item">
                        <span class="c-pit-air-pressure__value" v-if="vTyrePressure1"  v-html="vTyrePressure1"></span>
                    </div>
                </div>
            </div>
            <div class="c-pit-air-pressure__row">
                <div class="c-pit-air-pressure__items">
                    <div class="c-pit-air-pressure__item">
                        <span class="c-pit-air-pressure__value" v-if="vTyrePressure2"  v-html="vTyrePressure2"></span>
                    </div>
                    <div class="c-pit-air-pressure__item">
                        <span class="c-pit-air-pressure__value" v-if="vTyrePressure3"  v-html="vTyrePressure3"></span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss">

.c-pit-air-pressure {
    // position: relative;
    // padding: em(12) em(18);
    // border-radius: em(10);
    // width: em(336);
    // min-height: em(135);
}

.c-pit-air-pressure__rows {
    margin: em(-17);
}

.c-pit-air-pressure__row {
    display: flex;
    margin: em(17);
}

.c-pit-air-pressure__items {
    display: flex;
    justify-content: space-around;
    margin: em(-100);
    display: flex;
}

.c-pit-air-pressure__item {
    padding: em(100);
}

.c-pit-air-pressure__value {
    @include color('background-color', 'white', 1);
    @include color('color', 'black', 1);

    line-height: 1em;
    padding: em(1, 14);
    margin: 0;
    display: block;
    font-size: em(14);
    border-radius: em(2, 14);
}

</style>

<script>
import { inject } from 'vue';
import PitDataHeadingComponent from './PitDataHeadingComponent.vue';
import PitDataValueComponent from './PitDataValueComponent.vue';

export default {
    setup() {
        const vTyre0 = inject('vTyre0');
        const vTyre1 = inject('vTyre1');
        const vTyre2 = inject('vTyre2');
        const vTyre3 = inject('vTyre3');


        return {
            vTyre0,
            vTyre1,
            vTyre2,
            vTyre3,
        };
    },
    components: {
        PitDataHeadingComponent,
        PitDataValueComponent
    },
    computed: {
        vTyrePressure0() {
            if (this.vTyre0 === null) {
                return null;
            }

            return this.vTyre0[4].value;
        },
        vTyrePressure1() {
            if (this.vTyre1 === null) {
                return null;
            }

            return this.vTyre1[4].value;
        },
        vTyrePressure2() {
            if (this.vTyre2 === null) {
                return null;
            }

            return this.vTyre2[4].value;
        },
        vTyrePressure3() {
            if (this.vTyre3 === null) {
                return null;
            }

            return this.vTyre3[4].value;
        }
    }
}
</script>
