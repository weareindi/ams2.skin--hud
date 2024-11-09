<template>
    <div class="c-pit-fuel-calc">
        <div class="c-pit-fuel-calc__heading">
            <PitDataHeadingComponent text="Fuel Estimate" />
        </div>
        <div class="c-pit-fuel-calc__rows">
            <div class="c-pit-fuel-calc__row">
                <div class="c-pit-fuel-calc__items">
                    <div class="c-pit-fuel-calc__item">
                        <PitDataValueComponent :data="vFuelInCar" />
                    </div>
                    <div class="c-pit-fuel-calc__item">
                        <PitDataValueComponent :data="vFuelPerLapPit" />
                    </div>
                    <div class="c-pit-fuel-calc__item">
                        <PitDataValueComponent :data="vFuelToEndSessionPit" />
                    </div>
                </div>
            </div>
            <div class="c-pit-fuel-calc__row">
                <div class="c-pit-fuel-calc__items">
                    <div class="c-pit-fuel-calc__item">
                        <PitDataValueComponent :data="vFuelStopsToEndSessionPit" />
                    </div>
                    <div class="c-pit-fuel-calc__item">
                        <PitDataValueComponent :data="vFuelInStopPit" />
                    </div>
                </div>
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
    margin: 0 0 em(24);
}

.c-pit-fuel-calc__rows {
    margin: em(-12);
}

.c-pit-fuel-calc__row {
    display: flex;
    margin: em(12);
}

.c-pit-fuel-calc__items {
    display: flex;
    justify-content: space-around;
    margin: em(-12);
    display: flex;
}

.c-pit-fuel-calc__item {
    padding: em(12);
}

</style>

<script>
import { inject } from 'vue';
import PitDataHeadingComponent from './PitDataHeadingComponent.vue';
import PitDataValueComponent from './PitDataValueComponent.vue';

export default {
    setup() {
        const vFuelInCar = inject('vFuelInCar');

        const vFuelPerLapPit = inject('vFuelPerLapPit');
        const vFuelToEndSessionPit = inject('vFuelToEndSessionPit');
        const vFuelStopsToEndSessionPit = inject('vFuelStopsToEndSessionPit');
        const vFuelInStopPit = inject('vFuelInStopPit');

        return {
            vFuelInCar,
            vFuelPerLapPit,
            vFuelToEndSessionPit,
            vFuelStopsToEndSessionPit,
            vFuelInStopPit,
        };
    },
    components: {
        PitDataHeadingComponent,
        PitDataValueComponent
    }
}
</script>
