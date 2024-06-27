<template>
    <div class="c-in-car-status">
        <div class="c-in-car-status__items">
            <div class="c-in-car-status__item">
                <InCarInfoComponent icon="water-temp" :a="mWaterTempCelsiusDisplay" />
            </div>
            <div class="c-in-car-status__item">
                <InCarInfoComponent icon="pedals" :a="mClutchRawDisplay" :b="mBrakeRawDisplay" :c="mThrottleRawDisplay" />
            </div>
        </div>
    </div>
</template>

<style lang="scss">
    .c-in-car-status {
        @include color('background-color', 'pitbox', 0.8);

        display: flex;
        padding: em(12);
    }

    .c-in-car-status__items {
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
        margin: em(-12);
    }

    .c-in-car-status__item {
        display: flex;
        padding: em(12);
    }
</style>

<script>
import { inject } from 'vue';
import InCarInfoComponent from '../components/InCarInfoComponent.vue';

export default {
    setup() {
        const mWaterTempCelsiusDisplay = inject('mWaterTempCelsiusDisplay');
        const mClutchDisplay = inject('mClutchDisplay');
        const mClutchRawDisplay = inject('mClutchRawDisplay');
        const mBrakeDisplay = inject('mBrakeDisplay');
        const mBrakeRawDisplay = inject('mBrakeRawDisplay');
        const mThrottleDisplay = inject('mThrottleDisplay');
        const mThrottleRawDisplay = inject('mThrottleRawDisplay');

        return {
            mWaterTempCelsiusDisplay,
            mClutchDisplay,
            mClutchRawDisplay,
            mBrakeDisplay,
            mBrakeRawDisplay,
            mThrottleDisplay,
            mThrottleRawDisplay,
        }
    },
    components: {
        InCarInfoComponent
    }
}
</script>
