<template>
    <div class="c-in-car-fuel">
        <div class="c-in-car-fuel__items">
            <div class="c-in-car-fuel__item" v-if="fuel">
                <InCarStatComponent icon="fuel" :right="fuel" />
            </div>
            <div class="c-in-car-fuel__item" v-if="fuelPerLap">
                <InCarStatComponent :right="fuelPerLap" />
            </div>
            <div class="c-in-car-fuel__item" v-if="fuelToEndSession">
                <InCarStatComponent :right="fuelToEndSession" />
            </div>
            <div class="c-in-car-fuel__item" v-if="pitsToEndSession">
                <InCarStatComponent :right="pitsToEndSession" />
            </div>
        </div>
    </div>
</template>

<style lang="scss">
    .c-in-car-fuel {
        @include color('background-color', 'pitbox', 0.8);

        display: flex;
        overflow: hidden;
        padding: em(4);
        border-radius: em(8);
    }

    .c-in-car-fuel__items {
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
        justify-content: center;
    }

    .c-in-car-fuel__item {
        display: flex;
    }
</style>

<script>
import { inject } from 'vue';
import InCarStatComponent from '../components/InCarStatComponent.vue';

export default {
    setup() {
        const fuelCapacityDisplay = inject('fuelCapacityDisplay');
        const fuelDisplay = inject('fuelDisplay');
        const fuelPerLapDisplay = inject('fuelPerLapDisplay');
        const fuelToEndSessionDisplay = inject('fuelToEndSessionDisplay');
        const pitsToEndSessionDisplay = inject('pitsToEndSessionDisplay');

        const skeleton = {
            a: {
                value: null,
                suffix: null,
                monospace: false,
                zerofill: null,
            },
            b: {
                value: null,
                suffix: null,
                monospace: false,
                zerofill: null
            }
        }

        return {
            fuelCapacityDisplay,
            fuelDisplay,
            fuelPerLapDisplay,
            fuelToEndSessionDisplay,
            pitsToEndSessionDisplay,
            skeleton,
        };
    },
    components: {
        InCarStatComponent
    },
    computed: {
        fuel() {
            if (!this.fuelDisplay) {
                return null;
            }

            let data = JSON.parse(JSON.stringify(this.skeleton));

            // update data
            data.a.value = this.fuelDisplay;
            data.a.suffix = this.fuelDisplay ? ` L` : '';
            data.a.monospace = true;

            return {a: data};
        },
        fuelPerLap() {
            if (!this.fuelPerLapDisplay) {
                return null;
            }

            let data = JSON.parse(JSON.stringify(this.skeleton));

            // update data
            data.a.value = this.fuelPerLapDisplay;
            data.a.suffix = this.fuelPerLapDisplay ? ` L` : '';
            data.a.monospace = true;
            data.b.value = `Per Lap`;

            return {a: data};
        },
        fuelToEndSession() {
            if (!this.fuelToEndSessionDisplay) {
                return null;
            }

            let data = JSON.parse(JSON.stringify(this.skeleton));

            // update data
            data.a.value = this.fuelToEndSessionDisplay;
            data.a.suffix = this.fuelToEndSessionDisplay ? ` L` : 'Calculating';
            data.a.monospace = true;
            data.b.value = `To End Session`;

            return {a: data};

        },
        pitsToEndSession() {
            if (!this.pitsToEndSessionDisplay) {
                return null;
            }

            let data = JSON.parse(JSON.stringify(this.skeleton));

            // update data
            data.a.value = this.pitsToEndSessionDisplay;
            data.a.suffix = this.pitsToEndSessionDisplay ? ` L` : 'Calculating';
            data.a.monospace = true;
            data.b.value = `Min. Stops`;

            return {a: data};

        },
    },
}
</script>
