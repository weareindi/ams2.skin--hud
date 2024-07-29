<template>
    <div class="c-in-car-aero">
        <div class="c-in-car-aero__items">
            <div class="c-in-car-aero__item">
                <InCarStatComponent icon="aero" :status="mAeroStatus" :highlight="mAeroHighlight" :level="mAeroDamageDisplay" />
            </div>
        </div>        
    </div>
</template>

<style lang="scss">
    .c-in-car-aero {
        @include color('background-color', 'pitbox', 0.8);

        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }

    .c-in-car-aero__items {
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
        justify-content: center;
    }

    .c-in-car-aero__items--upper {
        align-items: flex-end;
    }

    .c-in-car-aero__items--lower {
        align-items: flex-start;
    }

    .c-in-car-aero__item {
        display: flex;
    }
</style>

<script>
import { inject } from 'vue';
import InCarStatComponent from '../components/InCarStatComponent.vue';

export default {
    setup() {
        const mAeroDamageDisplay = inject('mAeroDamageDisplay');
        const mAeroStatus = inject('mAeroStatus');
        const mAeroHighlight = inject('mAeroHighlight');

        return {
            mAeroDamageDisplay,
            mAeroStatus,
            mAeroHighlight,
        };
    },
    components: {
        InCarStatComponent
    },
}
</script>
