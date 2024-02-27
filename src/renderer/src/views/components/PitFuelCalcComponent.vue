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
        // const fuelCapacityDisplay = inject('fuelCapacityDisplay');
        // const fuelDisplay = inject('fuelDisplay');
        const fuelPerLapDisplay = inject('fuelPerLapDisplay');
        const fuelToEndSessionDisplay = inject('fuelToEndSessionDisplay');
        const pitsToEndSessionDisplay = inject('pitsToEndSessionDisplay');

        console.log(fuelPerLapDisplay);
        console.log(fuelToEndSessionDisplay);
        console.log(pitsToEndSessionDisplay);

        // const skeleton = {
        //     label: null,
        //     value: null,
        //     suffix: null
        // }

        return {
            // fuelCapacityDisplay,
            // fuelDisplay,
            fuelPerLapDisplay,
            fuelToEndSessionDisplay,
            pitsToEndSessionDisplay,
            // skeleton,
        };
    },
    components: {
        PitDataHeadingComponent,
        PitDataValueComponent
    },
    computed: {
        // fuelPerLap() {
        //     let data = JSON.parse(JSON.stringify(this.skeleton));

        //     data.label = 'Per Lap';

        //     if (!this.fuelPerLapDisplay) {
        //         data.value = 'N/A';
        //     }

        //     if (this.fuelPerLapDisplay) {
        //         data.value = this.fuelPerLapDisplay;
        //         data.suffix = 'L';
        //     }

        //     return data;
        // },
        // fuelToEndSession() {
        //     let data = JSON.parse(JSON.stringify(this.skeleton));

        //     data.label = 'Session';

        //     if (!this.fuelToEndSessionDisplay) {
        //         data.value = 'N/A';
        //     }
        //     if (this.fuelToEndSessionDisplay) {
        //         data.value = this.fuelToEndSessionDisplay;
        //         data.suffix = 'L';
        //     }

        //     return data;

        // },
        // pitsToEndSession() {
        //     let data = JSON.parse(JSON.stringify(this.skeleton));

        //     data.label = 'Min. Stops';

        //     if (this.pitsToEndSessionDisplay >= 0) {
        //         data.value = `${this.pitsToEndSessionDisplay}`;
        //     }

        //     if (this.pitsToEndSessionDisplay === null) {
        //         data.value = 'N/A';
        //     }

        //     return data;
        // },
    },
}
</script>
