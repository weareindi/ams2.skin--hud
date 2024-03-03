<template>
    <div class="c-in-car-tyre">
        <div class="c-in-car-tyre__items c-in-car-tyre__items--upper">
            <div class="c-in-car-tyre__item">
                <InCarStatComponent position="0" icon="suspension" :status="mSuspensionFrontLeftStatus" :highlight="mSuspensionFrontLeftHighlight" :level="mSuspensionDamageFrontLeftDisplay" />
            </div>
            <div class="c-in-car-tyre__item">
                <InCarStatComponent  position="0" icon="brake" :level="mBrakeDamageFrontLeftDisplay" :status="mBrakeFrontLeftStatus" :highlight="mBrakeFrontLeftHighlight" :a="mBrakeTempCelsiusFrontLeftDisplay" />
            </div>
            <div class="c-in-car-tyre__item">
                <InCarStatComponent  position="0" icon="tyre" :icon-overlay="mTyreCompoundFrontLeftDisplay" :level="mTyreWearFrontLeftDisplay" :status="mTyreFrontLeftStatus" :highlight="mTyreFrontLeftHighlight" :a="mTyreTempFrontLeftDisplay" :b="mAirPressureFrontLeftDisplay"   />
            </div>
            <div class="c-in-car-tyre__item">
                <InCarStatComponent  position="1" icon="tyre" :icon-overlay="mTyreCompoundFrontRightDisplay" :level="mTyreWearFrontRightDisplay" :status="mTyreFrontRightStatus" :highlight="mTyreFrontRightHighlight" :a="mTyreTempFrontRightDisplay" :b="mAirPressureFrontRightDisplay"   />
            </div>
            <div class="c-in-car-tyre__item">
                <InCarStatComponent  position="1" icon="brake" :level="mBrakeDamageFrontRightDisplay" :status="mBrakeFrontRightStatus" :highlight="mBrakeFrontRightHighlight" :a="mBrakeTempCelsiusFrontRightDisplay" />
            </div>
            <div class="c-in-car-tyre__item">
                <InCarStatComponent position="1" icon="suspension" :level="mSuspensionDamageFrontRightDisplay" :status="mSuspensionFrontRightStatus" :highlight="mSuspensionFrontRightHighlight" />
            </div>
        </div>
        <div class="c-in-car-tyre__items c-in-car-tyre__items--lower">
            <div class="c-in-car-tyre__item">
                <InCarStatComponent position="2" icon="suspension" :status="mSuspensionRearLeftStatus" :highlight="mSuspensionRearLeftHighlight" :level="mSuspensionDamageRearLeftDisplay" />
            </div>
            <div class="c-in-car-tyre__item">
                <InCarStatComponent  position="2" icon="brake" :level="mBrakeDamageRearLeftDisplay" :status="mBrakeRearLeftStatus" :highlight="mBrakeRearLeftHighlight" :a="mBrakeTempCelsiusRearLeftDisplay" />
            </div>
            <div class="c-in-car-tyre__item">
                <InCarStatComponent  position="2" icon="tyre" :icon-overlay="mTyreCompoundRearLeftDisplay" :level="mTyreWearRearLeftDisplay" :status="mTyreRearLeftStatus" :highlight="mTyreRearLeftHighlight" :a="mTyreTempRearLeftDisplay" :b="mAirPressureRearLeftDisplay"   />
            </div>
            <div class="c-in-car-tyre__item">
                <InCarStatComponent  position="3" icon="tyre" :icon-overlay="mTyreCompoundRearRightDisplay" :level="mTyreWearRearRightDisplay" :status="mTyreRearRightStatus" :highlight="mTyreRearRightHighlight" :a="mTyreTempRearRightDisplay" :b="mAirPressureRearRightDisplay"   />
            </div>
            <div class="c-in-car-tyre__item">
                <InCarStatComponent  position="3" icon="brake" :level="mBrakeDamageRearRightDisplay" :status="mBrakeRearRightStatus" :highlight="mBrakeRearRightHighlight" :a="mBrakeTempCelsiusRearRightDisplay" />
            </div>
            <div class="c-in-car-tyre__item">
                <InCarStatComponent position="3" icon="suspension" :level="mSuspensionDamageRearRightDisplay" :status="mSuspensionRearRightStatus" :highlight="mSuspensionRearRightHighlight" />
            </div>
        </div>
        
    </div>
</template>

<style lang="scss">
    .c-in-car-tyre {
        @include color('background-color', 'pitbox', 0.8);

        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .c-in-car-tyre__items {
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
        justify-content: center;
    }

    .c-in-car-tyre__items--upper {
        align-items: flex-end;
    }

    .c-in-car-tyre__items--lower {
        align-items: flex-start;
    }

    .c-in-car-tyre__item {
        display: flex;
    }
</style>

<script>
import { inject } from 'vue';
import InCarStatComponent from '../components/InCarStatComponent.vue';

export default {
    setup() {
        const mAirPressureFrontLeftDisplay = inject('mAirPressureFrontLeftDisplay');
        const mAirPressureFrontRightDisplay = inject('mAirPressureFrontRightDisplay');
        const mAirPressureRearLeftDisplay = inject('mAirPressureRearLeftDisplay');
        const mAirPressureRearRightDisplay = inject('mAirPressureRearRightDisplay');

        const mBrakeDamageFrontLeftDisplay = inject('mBrakeDamageFrontLeftDisplay');
        const mBrakeDamageFrontRightDisplay = inject('mBrakeDamageFrontRightDisplay');
        const mBrakeDamageRearLeftDisplay = inject('mBrakeDamageRearLeftDisplay');
        const mBrakeDamageRearRightDisplay = inject('mBrakeDamageRearRightDisplay');

        const mBrakeTempCelsiusFrontLeftDisplay = inject('mBrakeTempCelsiusFrontLeftDisplay');
        const mBrakeTempCelsiusFrontRightDisplay = inject('mBrakeTempCelsiusFrontRightDisplay');
        const mBrakeTempCelsiusRearLeftDisplay = inject('mBrakeTempCelsiusRearLeftDisplay');
        const mBrakeTempCelsiusRearRightDisplay = inject('mBrakeTempCelsiusRearRightDisplay');

        const mBrakeFrontLeftStatus = inject('mBrakeFrontLeftStatus');
        const mBrakeFrontRightStatus = inject('mBrakeFrontRightStatus');
        const mBrakeRearLeftStatus = inject('mBrakeRearLeftStatus');
        const mBrakeRearRightStatus = inject('mBrakeRearRightStatus');

        const mBrakeFrontLeftHighlight = inject('mBrakeFrontLeftHighlight');
        const mBrakeFrontRightHighlight = inject('mBrakeFrontRightHighlight');
        const mBrakeRearLeftHighlight = inject('mBrakeRearLeftHighlight');
        const mBrakeRearRightHighlight = inject('mBrakeRearRightHighlight');

        const mSuspensionDamageFrontLeftDisplay = inject('mSuspensionDamageFrontLeftDisplay');
        const mSuspensionDamageFrontRightDisplay = inject('mSuspensionDamageFrontRightDisplay');
        const mSuspensionDamageRearLeftDisplay = inject('mSuspensionDamageRearLeftDisplay');
        const mSuspensionDamageRearRightDisplay = inject('mSuspensionDamageRearRightDisplay');

        const mSuspensionFrontLeftStatus = inject('mSuspensionFrontLeftStatus');
        const mSuspensionFrontRightStatus = inject('mSuspensionFrontRightStatus');
        const mSuspensionRearLeftStatus = inject('mSuspensionRearLeftStatus');
        const mSuspensionRearRightStatus = inject('mSuspensionRearRightStatus');

        const mSuspensionFrontLeftHighlight = inject('mSuspensionFrontLeftHighlight');
        const mSuspensionFrontRightHighlight = inject('mSuspensionFrontRightHighlight');
        const mSuspensionRearLeftHighlight = inject('mSuspensionRearLeftHighlight');
        const mSuspensionRearRightHighlight = inject('mSuspensionRearRightHighlight');

        const mTyreCompoundFrontLeftDisplay = inject('mTyreCompoundFrontLeftDisplay');
        const mTyreCompoundFrontRightDisplay = inject('mTyreCompoundFrontRightDisplay');
        const mTyreCompoundRearLeftDisplay = inject('mTyreCompoundRearLeftDisplay');
        const mTyreCompoundRearRightDisplay = inject('mTyreCompoundRearRightDisplay');

        const mTyreTempFrontLeftDisplay = inject('mTyreTempFrontLeftDisplay');
        const mTyreTempFrontRightDisplay = inject('mTyreTempFrontRightDisplay');
        const mTyreTempRearLeftDisplay = inject('mTyreTempRearLeftDisplay');
        const mTyreTempRearRightDisplay = inject('mTyreTempRearRightDisplay');

        const mTyreWearFrontLeftDisplay = inject('mTyreWearFrontLeftDisplay');
        const mTyreWearFrontRightDisplay = inject('mTyreWearFrontRightDisplay');
        const mTyreWearRearLeftDisplay = inject('mTyreWearRearLeftDisplay');
        const mTyreWearRearRightDisplay = inject('mTyreWearRearRightDisplay');

        const mTyreFrontLeftStatus = inject('mTyreFrontLeftStatus');
        const mTyreFrontRightStatus = inject('mTyreFrontRightStatus');
        const mTyreRearLeftStatus = inject('mTyreRearLeftStatus');
        const mTyreRearRightStatus = inject('mTyreRearRightStatus');

        const mTyreFrontLeftHighlight = inject('mTyreFrontLeftHighlight');
        const mTyreFrontRightHighlight = inject('mTyreFrontRightHighlight');
        const mTyreRearLeftHighlight = inject('mTyreRearLeftHighlight');
        const mTyreRearRightHighlight = inject('mTyreRearRightHighlight');

        return {
            mAirPressureFrontLeftDisplay,
            mAirPressureFrontRightDisplay,
            mAirPressureRearLeftDisplay,
            mAirPressureRearRightDisplay,

            mBrakeDamageFrontLeftDisplay,
            mBrakeDamageFrontRightDisplay,
            mBrakeDamageRearLeftDisplay,
            mBrakeDamageRearRightDisplay,

            mBrakeTempCelsiusFrontLeftDisplay,
            mBrakeTempCelsiusFrontRightDisplay,
            mBrakeTempCelsiusRearLeftDisplay,
            mBrakeTempCelsiusRearRightDisplay,

            mBrakeFrontLeftStatus,
            mBrakeFrontRightStatus,
            mBrakeRearLeftStatus,
            mBrakeRearRightStatus,

            mBrakeFrontLeftHighlight,
            mBrakeFrontRightHighlight,
            mBrakeRearLeftHighlight,
            mBrakeRearRightHighlight,

            mSuspensionDamageFrontLeftDisplay,
            mSuspensionDamageFrontRightDisplay,
            mSuspensionDamageRearLeftDisplay,
            mSuspensionDamageRearRightDisplay,

            mSuspensionFrontLeftStatus,
            mSuspensionFrontRightStatus,
            mSuspensionRearLeftStatus,
            mSuspensionRearRightStatus,
            
            mSuspensionFrontLeftHighlight,
            mSuspensionFrontRightHighlight,
            mSuspensionRearLeftHighlight,
            mSuspensionRearRightHighlight,

            mTyreCompoundFrontLeftDisplay,
            mTyreCompoundFrontRightDisplay,
            mTyreCompoundRearLeftDisplay,
            mTyreCompoundRearRightDisplay,

            mTyreTempFrontLeftDisplay,
            mTyreTempFrontRightDisplay,
            mTyreTempRearLeftDisplay,
            mTyreTempRearRightDisplay,

            mTyreWearFrontLeftDisplay,
            mTyreWearFrontRightDisplay,
            mTyreWearRearLeftDisplay,
            mTyreWearRearRightDisplay,

            mTyreFrontLeftStatus,
            mTyreFrontRightStatus,
            mTyreRearLeftStatus,
            mTyreRearRightStatus,

            mTyreFrontLeftHighlight,
            mTyreFrontRightHighlight,
            mTyreRearLeftHighlight,
            mTyreRearRightHighlight
        };
    },
    components: {
        InCarStatComponent
    },
}
</script>
