<template>
    <div class="c-in-car-speedometer" :state="state">
        <div class="c-in-car-speedometer__items">
            <div class="c-in-car-speedometer__item">
                <InCarTachometerComponent />
            </div>
            <div class="c-in-car-speedometer__item">
                <InCarGearComponent />
            </div>
            <div class="c-in-car-speedometer__item">
                <InCarSpeedComponent />
            </div>
            <div class="c-in-car-speedometer__item c-in-car-speedometer__item--drs">
                <InCarDrsComponent />
            </div>
            <div class="c-in-car-speedometer__item c-in-car-speedometer__item--ers">
                <InCarErsComponent />
            </div>
        </div>            
    </div>
</template>

<style lang="scss">
    .c-in-car-speedometer {
        @include color('background-color', 'pitbox', 0.8);
        
        position: relative;
        display: flex;
        overflow: hidden;
        padding: em(8);
        border-radius: em(8);

        &:after {
            content: '';
            position: absolute;
            z-index: 10;
            top: 0;
            right: 0;
            bottom: 0;
            left: 0;
            border-radius: em(8);
            mix-blend-mode: multiply;
        }

        &[state="limit"] {
            &:after {
                @include color('background-color', 'red');
            }
        }
    }

    .c-in-car-speedometer__items {
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
        justify-content: center;
    }

    .c-in-car-speedometer__item {
        display: flex;
    }

    .c-in-car-speedometer__item--drs,
    .c-in-car-speedometer__item--ers {
        z-index: 11;
    }
</style>

<script>
import { inject } from 'vue';
import InCarTachometerComponent from '../components/InCarTachometerComponent.vue';
import InCarGearComponent from '../components/InCarGearComponent.vue';
import InCarSpeedComponent from '../components/InCarSpeedComponent.vue';
import InCarDrsComponent from '../components/InCarDrsComponent.vue';
import InCarErsComponent from '../components/InCarErsComponent.vue';

export default {
    setup() {
        const mRpmPercentage = inject('mRpmPercentage');

        return {
            mRpmPercentage
        }
    },
    components: {
        InCarTachometerComponent, 
        InCarGearComponent,
        InCarSpeedComponent,
        InCarDrsComponent,
        InCarErsComponent,
    },
    computed: {
        state() {
            return this.mRpmPercentage >= 97 ? 'limit' : '';
        }
    }
}
</script>
