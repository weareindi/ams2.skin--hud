<template>
    <div class="c-pit-fuel-calc">
        <div class="c-pit-fuel-calc__heading">
            <PitDataHeadingComponent text="Fuel Estimate" />
        </div>
        <div class="c-pit-fuel-calc__items">
            <div class="c-pit-fuel-calc__item">
                <PitDataValueComponent :data="fuelPerLapDisplay" />
            </div>
            <div class="c-pit-fuel-calc__item">
                <PitDataValueComponent :data="fuelToEndSessionDisplay" />
            </div>
            <div class="c-pit-fuel-calc__item">
                <PitDataValueComponent :data="pitsToEndSessionDisplay" />
            </div>
        </div>
    </div>
</template>

<style lang="scss">

.c-pit-fuel-calc {
    @include color('background-color', 'pitbox', 0.7);

    position: relative;
    padding: em(10) em(10) em(10) em(48);
    border-radius: em(12);
    width: em(336);
}

.c-pit-fuel-calc__heading {
    margin: 0 0 em(12);
}

.c-pit-fuel-calc__items {
    margin: em(-12);
    display: flex;
}

.c-pit-fuel-calc__item {
    padding: em(12);
}

</style>

<script>
import { inject } from 'vue';
import PitDataHeadingComponent from '../components/PitDataHeadingComponent.vue';
import PitDataValueComponent from '../components/PitDataValueComponent.vue';

export default {
    setup() {
        const fuelPerLapDisplay = inject('fuelPerLapDisplay');
        const fuelToEndSessionDisplay = inject('fuelToEndSessionDisplay');
        const pitsToEndSessionDisplay = inject('pitsToEndSessionDisplay');

        return {
            fuelPerLapDisplay,
            fuelToEndSessionDisplay,
            pitsToEndSessionDisplay,
        };
    },
    components: {
        PitDataHeadingComponent,
        PitDataValueComponent
    }
}
</script>
