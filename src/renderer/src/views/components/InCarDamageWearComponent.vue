<template>
    <div class="c-in-car-damagewear">
        <div class="c-in-car-damagewear__rows">
            <div class="c-in-car-damagewear__row">
                <div class="c-in-car-damagewear__items">
                    <div class="c-in-car-damagewear__item" v-if="tyrefl">
                        <InCarStatComponent :icon="`tyre`" :right="tyrefl" />
                    </div>
                    <div class="c-in-car-damagewear__item" v-if="brakefl">
                        <InCarStatComponent :icon="`brake`" :right="brakefl" />
                    </div>
                    <div class="c-in-car-damagewear__item" v-if="suspensionfl">
                        <InCarStatComponent :icon="`suspension`" :right="suspensionfl" />
                    </div>
                    <div class="c-in-car-damagewear__item" v-if="aero">
                        <InCarStatComponent :icon="`aero`" :right="aero" />
                    </div>
                    <div class="c-in-car-damagewear__item" v-if="suspensionfr">
                        <InCarStatComponent :icon="`suspension`" :right="suspensionfr" />
                    </div>
                    <div class="c-in-car-damagewear__item" v-if="brakefr">
                        <InCarStatComponent :icon="`brake`" :right="brakefr" />
                    </div>
                    <div class="c-in-car-damagewear__item" v-if="tyrefr">
                        <InCarStatComponent :icon="`tyre`" :right="tyrefr" />
                    </div>
                </div>
            </div>
            <div class="c-in-car-damagewear__row">
                <div class="c-in-car-damagewear__items">
                    <div class="c-in-car-damagewear__item" v-if="tyrerl">
                        <InCarStatComponent :icon="`tyre`" :right="tyrerl" />
                    </div>
                    <div class="c-in-car-damagewear__item" v-if="brakerl">
                        <InCarStatComponent :icon="`brake`" :right="brakerl" />
                    </div>
                    <div class="c-in-car-damagewear__item" v-if="suspensionrl">
                        <InCarStatComponent :icon="`suspension`" :right="suspensionrl" />
                    </div>
                    <div class="c-in-car-damagewear__item" v-if="engine">
                        <InCarStatComponent :icon="`engine`" :right="engine" />
                    </div>
                    <div class="c-in-car-damagewear__item" v-if="suspensionrr">
                        <InCarStatComponent :icon="`suspension`" :right="suspensionrr" />
                    </div>
                    <div class="c-in-car-damagewear__item" v-if="brakerr">
                        <InCarStatComponent :icon="`brake`" :right="brakerr" />
                    </div>
                    <div class="c-in-car-damagewear__item" v-if="tyrerr">
                        <InCarStatComponent :icon="`tyre`" :right="tyrerr" />
                    </div>
                </div>
            </div>
        </div>
        
    </div>
</template>

<style lang="scss">
    .c-in-car-damagewear {
        @include color('background-color', 'pitbox', 0.8);

        display: flex;
        align-items: center;
        overflow: hidden;
        padding: em(4);
        border-radius: em(8);
    }

    .c-in-car-damagewear__items {
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
        justify-content: center;
    }

    .c-in-car-damagewear__item {
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
         const mSuspensionDamageFrontLeftDisplay = inject('mSuspensionDamageFrontLeftDisplay');
         const mSuspensionDamageFrontRightDisplay = inject('mSuspensionDamageFrontRightDisplay');
         const mSuspensionDamageRearLeftDisplay = inject('mSuspensionDamageRearLeftDisplay');
         const mSuspensionDamageRearRightDisplay = inject('mSuspensionDamageRearRightDisplay');
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
         const mEngineDamageDisplay = inject('mEngineDamageDisplay');
         const mAeroDamageDisplay = inject('mAeroDamageDisplay');

        const skeleton = {
            a: {
                value: null,
                suffix: null,
                monospace: false,
                zerofill: null,
                error: null,
            },
            b: {
                value: null,
                suffix: null,
                monospace: false,
                zerofill: null,
                error: null,
            }
        }

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
            mSuspensionDamageFrontLeftDisplay,
            mSuspensionDamageFrontRightDisplay,
            mSuspensionDamageRearLeftDisplay,
            mSuspensionDamageRearRightDisplay,
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
            mEngineDamageDisplay,
            mAeroDamageDisplay,
            skeleton,
        };
    },
    computed: {
        tyrefl() {
            if (!this.mTyreWearFrontLeftDisplay) {
                return null;
            }
            
            if (!this.mTyreTempFrontLeftDisplay) {
                return null;
            }

            let data = JSON.parse(JSON.stringify(this.skeleton));

            // update data
            data.a.value = this.mTyreWearFrontLeftDisplay;
            data.a.suffix = '%';
            data.a.zerofill = 3;
            data.a.monospace = true;
            data.a.error = this.mTyreWearFrontLeftDisplay <= 0;

            data.b.value = this.mTyreTempFrontLeftDisplay;
            data.b.suffix = '°';
            data.b.zerofill = 3;
            data.b.monospace = true;
            data.a.error = this.mTyreTempFrontLeftDisplay <= 0;

            return {a: data};
        },
        tyrefr() {
            if (!this.mTyreWearFrontRightDisplay) {
                return null;
            }
            
            if (!this.mTyreTempFrontRightDisplay) {
                return null;
            }

            let data = JSON.parse(JSON.stringify(this.skeleton));

            // update data
            data.a.value = this.mTyreWearFrontRightDisplay;
            data.a.suffix = '%';
            data.a.zerofill = 3;
            data.a.monospace = true;
            data.a.error = this.mTyreWearFrontRightDisplay <= 0;

            data.b.value = this.mTyreTempFrontRightDisplay;
            data.b.suffix = '°';
            data.b.zerofill = 3;
            data.b.monospace = true;
            data.a.error = this.mTyreTempFrontRightDisplay <= 0;

            return {a: data};
        },
        tyrerl() {
            if (!this.mTyreWearRearLeftDisplay) {
                return null;
            }
            
            if (!this.mTyreTempRearLeftDisplay) {
                return null;
            }

            let data = JSON.parse(JSON.stringify(this.skeleton));

            // update data
            data.a.value = this.mTyreWearRearLeftDisplay;
            data.a.suffix = '%';
            data.a.zerofill = 3;
            data.a.monospace = true;
            data.a.error = this.mTyreWearRearLeftDisplay <= 0;

            data.b.value = this.mTyreTempRearLeftDisplay;
            data.b.suffix = '°';
            data.b.zerofill = 3;
            data.b.monospace = true;
            data.a.error = this.mTyreTempRearLeftDisplay <= 0;

            return {a: data};
        },
        tyrerr() {
            if (!this.mTyreWearRearRightDisplay) {
                return null;
            }
            
            if (!this.mTyreTempRearRightDisplay) {
                return null;
            }

            let data = JSON.parse(JSON.stringify(this.skeleton));

            // update data
            data.a.value = this.mTyreWearRearRightDisplay;
            data.a.suffix = '%';
            data.a.zerofill = 3;
            data.a.monospace = true;
            data.a.error = this.mTyreWearRearRightDisplay <= 0;

            data.b.value = this.mTyreTempRearRightDisplay;
            data.b.suffix = '°';
            data.b.zerofill = 3;
            data.b.monospace = true;
            data.a.error = this.mTyreTempRearRightDisplay <= 0;

            return {a: data};
        },


        brakefl() {
            if (!this.mBrakeDamageFrontLeftDisplay) {
                return null;
            }
            
            if (!this.mBrakeTempCelsiusFrontLeftDisplay) {
                return null;
            }

            let data = JSON.parse(JSON.stringify(this.skeleton));

            // update data
            data.a.value = this.mBrakeDamageFrontLeftDisplay;
            data.a.suffix = '%';
            data.a.zerofill = 3;
            data.a.monospace = true;

            data.b.value = this.mBrakeTempCelsiusFrontLeftDisplay;
            data.b.suffix = '°';
            data.b.zerofill = 4;
            data.b.monospace = true;

            return {a: data};
        },
        brakefr() {
            if (!this.mBrakeDamageFrontLeftDisplay) {
                return null;
            }
            
            if (!this.mBrakeTempCelsiusFrontRightDisplay) {
                return null;
            }

            let data = JSON.parse(JSON.stringify(this.skeleton));

            // update data
            data.a.value = this.mBrakeDamageFrontRightDisplay;
            data.a.suffix = '%';
            data.a.zerofill = 3;
            data.a.monospace = true;

            data.b.value = this.mBrakeTempCelsiusFrontRightDisplay;
            data.b.suffix = '°';
            data.b.zerofill = 4;
            data.b.monospace = true;

            return {a: data};
        },
        brakerl() {
            if (!this.mBrakeDamageFrontLeftDisplay) {
                return null;
            }
            
            if (!this.mBrakeTempCelsiusRearLeftDisplay) {
                return null;
            }
            
            let data = JSON.parse(JSON.stringify(this.skeleton));

            // update data
            data.a.value = this.mBrakeDamageRearLeftDisplay;
            data.a.suffix = '%';
            data.a.zerofill = 3;
            data.a.monospace = true;

            data.b.value = this.mBrakeTempCelsiusRearLeftDisplay;
            data.b.suffix = '°';
            data.b.zerofill = 4;
            data.b.monospace = true;

            return {a: data};
        },
        brakerr() {
            if (!this.mBrakeDamageRearRightDisplay) {
                return null;
            }

            if (!this.mBrakeTempCelsiusRearRightDisplay) {
                return null;
            }
            
            let data = JSON.parse(JSON.stringify(this.skeleton));

            // update data
            data.a.value = this.mBrakeDamageRearRightDisplay;
            data.a.suffix = '%';
            data.a.zerofill = 3;
            data.a.monospace = true;

            data.b.value = this.mBrakeTempCelsiusRearRightDisplay;
            data.b.suffix = '°';
            data.b.zerofill = 4;
            data.b.monospace = true;

            return {a: data};
        },


        suspensionfl() {
            if (!this.mSuspensionDamageFrontLeftDisplay) {
                return null;
            }
            
            let data = JSON.parse(JSON.stringify(this.skeleton));

            // update data
            data.a.value = this.mSuspensionDamageFrontLeftDisplay;
            data.a.suffix = '%';
            data.a.zerofill = 3;
            data.a.monospace = true;

            return {a: data};
        },
        suspensionfr() {
            if (!this.mSuspensionDamageFrontRightDisplay) {
                return null;
            }
            
            let data = JSON.parse(JSON.stringify(this.skeleton));

            // update data
            data.a.value = this.mSuspensionDamageFrontRightDisplay;
            data.a.suffix = '%';
            data.a.zerofill = 3;
            data.a.monospace = true;

            return {a: data};
        },
        suspensionrl() {
            if (!this.mSuspensionDamageRearLeftDisplay) {
                return null;
            }
            
            let data = JSON.parse(JSON.stringify(this.skeleton));

            // update data
            data.a.value = this.mSuspensionDamageRearLeftDisplay;
            data.a.suffix = '%';
            data.a.zerofill = 3;
            data.a.monospace = true;

            return {a: data};
        },
        suspensionrr() {
            if (!this.mSuspensionDamageRearRightDisplay) {
                return null;
            }
            
            let data = JSON.parse(JSON.stringify(this.skeleton));

            // update data
            data.a.value = this.mSuspensionDamageRearRightDisplay;
            data.a.suffix = '%';
            data.a.zerofill = 3;
            data.a.monospace = true;

            return {a: data};
        },

        engine() {
            if (!this.mEngineDamageDisplay) {
                return null;
            }
            
            let data = JSON.parse(JSON.stringify(this.skeleton));

            // update data
            data.a.value = this.mEngineDamageDisplay;
            data.a.suffix = '%';
            data.a.zerofill = 3;
            data.a.monospace = true;

            return {a: data};
        },

        aero() {
            if (!this.mAeroDamageDisplay) {
                return null;
            }
            
            let data = JSON.parse(JSON.stringify(this.skeleton));

            // update data
            data.a.value = this.mAeroDamageDisplay;
            data.a.suffix = '%';
            data.a.zerofill = 3;
            data.a.monospace = true;

            return {a: data};
        },
    },
    components: {
        InCarStatComponent
    }
}
</script>
