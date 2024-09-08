<template>
    <div class="c-in-car-wheels-tyres">
        <div class="c-in-car-wheels-tyres__rows">
            <div class="c-in-car-wheels-tyres__row">
                <div class="c-in-car-wheels-tyres__items c-in-car-wheels-tyres__items--alignend">
                    <div class="c-in-car-wheels-tyres__item">
                        <InCarDataSuspensionComponent index="0" :data="vSuspension0" />
                    </div>
                    <div class="c-in-car-wheels-tyres__item">
                        <InCarDataBrakeComponent index="0" :data="vBrake0" />
                    </div>
                    <div class="c-in-car-wheels-tyres__item">
                        <InCarDataTyreComponent index="0" :data="vTyre0" />
                    </div>
                    <div class="c-in-car-wheels-tyres__item">
                        <InCarDataTyreComponent index="1" :data="vTyre1" />
                    </div>
                    <div class="c-in-car-wheels-tyres__item">
                        <InCarDataBrakeComponent index="1" :data="vBrake1" />
                    </div>
                    <div class="c-in-car-wheels-tyres__item">
                        <InCarDataSuspensionComponent index="1" :data="vSuspension1" />
                    </div>
                </div>
            </div>
            <div class="c-in-car-wheels-tyres__row">
                <div class="c-in-car-wheels-tyres__items c-in-car-wheels-tyres__items--alignstart">
                    <div class="c-in-car-wheels-tyres__item">
                        <InCarDataSuspensionComponent index="2" :data="vSuspension2" />
                    </div>
                    <div class="c-in-car-wheels-tyres__item">
                        <InCarDataBrakeComponent index="2" :data="vBrake2" />
                    </div>
                    <div class="c-in-car-wheels-tyres__item">
                        <InCarDataTyreComponent index="2" :data="vTyre2" />
                    </div>
                    <div class="c-in-car-wheels-tyres__item">
                        <InCarDataTyreComponent index="3" :data="vTyre3" />
                    </div>
                    <div class="c-in-car-wheels-tyres__item">
                        <InCarDataBrakeComponent index="3" :data="vBrake3" />
                    </div>
                    <div class="c-in-car-wheels-tyres__item">
                        <InCarDataSuspensionComponent index="3" :data="vSuspension3" />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss">
.c-in-car-wheels-tyres {}

.c-in-car-wheels-tyres__rows {
    margin: em(-8) 0;
}

.c-in-car-wheels-tyres__row {
    padding: em(8) 0;
}

.c-in-car-wheels-tyres__items {
    display: flex;
    margin: 0 em(-16);
}

.c-in-car-wheels-tyres__items--alignend {
    align-items: flex-end;
}

.c-in-car-wheels-tyres__items--alignstart {
    align-items: flex-start;
}

.c-in-car-wheels-tyres__item {
    padding: 0 em(16);
}

</style>

<script>
import { inject } from 'vue';
import InCarDataSuspensionComponent from './InCarDataSuspensionComponent.vue';
import InCarDataBrakeComponent from './InCarDataBrakeComponent.vue';
import InCarDataTyreComponent from './InCarDataTyreComponent.vue';

export default {
    setup() {
        const vTyre0 = inject('vTyre0');
        const vTyre1 = inject('vTyre1');
        const vTyre2 = inject('vTyre2');
        const vTyre3 = inject('vTyre3');
        const vBrake0 = inject('vBrake0');
        const vBrake1 = inject('vBrake1');
        const vBrake2 = inject('vBrake2');
        const vBrake3 = inject('vBrake3');
        const vSuspension0 = inject('vSuspension0');
        const vSuspension1 = inject('vSuspension1');
        const vSuspension2 = inject('vSuspension2');
        const vSuspension3 = inject('vSuspension3');

        return {
            vTyre0,
            vTyre1,
            vTyre2,
            vTyre3,
            vBrake0,
            vBrake1,
            vBrake2,
            vBrake3,
            vSuspension0,
            vSuspension1,
            vSuspension2,
            vSuspension3,
        }
    },
    components: {
        InCarDataSuspensionComponent,
        InCarDataBrakeComponent,
        InCarDataTyreComponent,
    }
}
</script>
