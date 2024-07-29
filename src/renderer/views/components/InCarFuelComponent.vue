<template>
    <div class="c-in-car-fuel">
        <div class="c-in-car-fuel__items">
            <div class="c-in-car-fuel__item">
                <InCarInfoComponent icon="fuel" :a="fuelDisplay" />
            </div>
            <div class="c-in-car-fuel__item">
                <InCarInfoComponent :a="fuelPerLapDisplay" />
            </div>
            <div class="c-in-car-fuel__item">
                <InCarInfoComponent :a="fuelToEndSessionDisplay" />
            </div>
            <div class="c-in-car-fuel__item">
                <InCarInfoComponent :a="pitsToEndSessionDisplay" />
            </div>
        </div>
    </div>
</template>

<style lang="scss">
    .c-in-car-fuel {
        @include color('background-color', 'pitbox', 0.8);

        display: flex;
        padding: em(12);
    }

    .c-in-car-fuel__items {
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
        margin: em(-12);
    }

    .c-in-car-fuel__item {
        display: flex;
        padding: em(12);
    }
</style>

<script>
import { inject } from 'vue';
import InCarInfoComponent from '../components/InCarInfoComponent.vue';

export default {
    setup() {
        const fuelDisplay = inject('fuelDisplay');
        const fuelPerLapDisplay = inject('fuelPerLapDisplay');
        const fuelToEndSessionDisplay = inject('fuelToEndSessionDisplay');
        const pitsToEndSessionDisplay = inject('pitsToEndSessionDisplay');

        return {
            fuelDisplay,
            fuelPerLapDisplay,
            fuelToEndSessionDisplay,
            pitsToEndSessionDisplay,
        };
    },
    components: {
        InCarInfoComponent
    }
}
</script>
