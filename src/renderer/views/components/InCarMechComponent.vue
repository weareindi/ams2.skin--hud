<template>
    <div class="c-in-car-mech">
        <div class="c-in-car-mech__items c-in-car-mech__items--upper">
            <div class="c-in-car-mech__item">
                <InCarStatComponent icon="engine" :status="mEngineStatus" :highlight="mEngineHighlight" :level="mEngineDamageDisplay" :a="mOilTempCelsiusDisplay" />
            </div>
        </div>
        <div class="c-in-car-mech__items c-in-car-mech__items--lower">
            <div class="c-in-car-mech__item">
                <InCarStatComponent icon="clutch" position="2" :status="mClutchStatus" :highlight="mClutchHighlight" :level="mClutchWearDisplay" :a="mClutchTempDisplay" />
            </div>
        </div>  
    </div>
</template>

<style lang="scss">
    .c-in-car-mech {
        @include color('background-color', 'pitbox', 0.8);

        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }

    .c-in-car-mech__items {
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
        justify-content: center;
    }

    .c-in-car-mech__items--upper {
        align-items: flex-end;
    }

    .c-in-car-mech__items--lower {
        align-items: flex-start;
    }

    .c-in-car-mech__item {
        display: flex;
    }
</style>

<script>
import { inject } from 'vue';
import InCarStatComponent from '../components/InCarStatComponent.vue';

export default {
    setup() {
        const mOilTempCelsiusDisplay = inject('mOilTempCelsiusDisplay');
        const mEngineDamageDisplay = inject('mEngineDamageDisplay');
        const mEngineStatus = inject('mEngineStatus');
        const mEngineHighlight = inject('mEngineHighlight');
        const mClutchTempDisplay = inject('mClutchTempDisplay');
        const mClutchWearDisplay = inject('mClutchWearDisplay');
        const mClutchStatus = inject('mClutchStatus');
        const mClutchHighlight = inject('mClutchHighlight');

        return {
            mOilTempCelsiusDisplay,
            mEngineDamageDisplay,
            mEngineStatus,
            mEngineHighlight,
            mClutchTempDisplay,
            mClutchWearDisplay,
            mClutchStatus,
            mClutchHighlight,
        };
    },
    components: {
        InCarStatComponent
    },
}
</script>
