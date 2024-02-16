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

        const mBrakeDamageFrontLeftStateColor = inject('mBrakeDamageFrontLeftStateColor');
        const mBrakeDamageFrontRightStateColor = inject('mBrakeDamageFrontRightStateColor');
        const mBrakeDamageRearLeftStateColor = inject('mBrakeDamageRearLeftStateColor');
        const mBrakeDamageRearRightStateColor = inject('mBrakeDamageRearRightStateColor');

        const mBrakeDamageFrontLeftStateAmount = inject('mBrakeDamageFrontLeftStateAmount');
        const mBrakeDamageFrontRightStateAmount = inject('mBrakeDamageFrontRightStateAmount');
        const mBrakeDamageRearLeftStateAmount = inject('mBrakeDamageRearLeftStateAmount');
        const mBrakeDamageRearRightStateAmount = inject('mBrakeDamageRearRightStateAmount');

         const mBrakeTempCelsiusFrontLeftDisplay = inject('mBrakeTempCelsiusFrontLeftDisplay');
         const mBrakeTempCelsiusFrontRightDisplay = inject('mBrakeTempCelsiusFrontRightDisplay');
         const mBrakeTempCelsiusRearLeftDisplay = inject('mBrakeTempCelsiusRearLeftDisplay');
         const mBrakeTempCelsiusRearRightDisplay = inject('mBrakeTempCelsiusRearRightDisplay');

        const mBrakeTempCelsiusFrontLeftStateColor = inject('mBrakeTempCelsiusFrontLeftStateColor');
        const mBrakeTempCelsiusFrontRightStateColor = inject('mBrakeTempCelsiusFrontRightStateColor');
        const mBrakeTempCelsiusRearLeftStateColor = inject('mBrakeTempCelsiusRearLeftStateColor');
        const mBrakeTempCelsiusRearRightStateColor = inject('mBrakeTempCelsiusRearRightStateColor');

        const mBrakeTempCelsiusFrontLeftStateAmount = inject('mBrakeTempCelsiusFrontLeftStateAmount');
        const mBrakeTempCelsiusFrontRightStateAmount = inject('mBrakeTempCelsiusFrontRightStateAmount');
        const mBrakeTempCelsiusRearLeftStateAmount = inject('mBrakeTempCelsiusRearLeftStateAmount');
        const mBrakeTempCelsiusRearRightStateAmount = inject('mBrakeTempCelsiusRearRightStateAmount');

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

         const mTyreTempFrontLeftStateColor = inject('mTyreTempFrontLeftStateColor');
         const mTyreTempFrontRightStateColor = inject('mTyreTempFrontRightStateColor');
         const mTyreTempRearLeftStateColor = inject('mTyreTempRearLeftStateColor');
         const mTyreTempRearRightStateColor = inject('mTyreTempRearRightStateColor');

        const mTyreTempFrontLeftStateAmount = inject('mTyreTempFrontLeftStateAmount');
        const mTyreTempFrontRightStateAmount = inject('mTyreTempFrontRightStateAmount');
        const mTyreTempRearLeftStateAmount = inject('mTyreTempRearLeftStateAmount');
        const mTyreTempRearRightStateAmount = inject('mTyreTempRearRightStateAmount');

         const mTyreWearFrontLeftDisplay = inject('mTyreWearFrontLeftDisplay');
         const mTyreWearFrontRightDisplay = inject('mTyreWearFrontRightDisplay');
         const mTyreWearRearLeftDisplay = inject('mTyreWearRearLeftDisplay');
         const mTyreWearRearRightDisplay = inject('mTyreWearRearRightDisplay');

        const mTyreWearFrontLeftStateColor = inject('mTyreWearFrontLeftStateColor');
        const mTyreWearFrontRightStateColor = inject('mTyreWearFrontRightStateColor');
        const mTyreWearRearLeftStateColor = inject('mTyreWearRearLeftStateColor');
        const mTyreWearRearRightStateColor = inject('mTyreWearRearRightStateColor');

        const mTyreWearFrontLeftStateAmount = inject('mTyreWearFrontLeftStateAmount');
        const mTyreWearFrontRightStateAmount = inject('mTyreWearFrontRightStateAmount');
        const mTyreWearRearLeftStateAmount = inject('mTyreWearRearLeftStateAmount');
        const mTyreWearRearRightStateAmount = inject('mTyreWearRearRightStateAmount');

         const mEngineDamageDisplay = inject('mEngineDamageDisplay');
         const mAeroDamageDisplay = inject('mAeroDamageDisplay');

        const skeleton = {
            a: {
                value: null,
                suffix: null,
                monospace: false,
                zerofill: null,
                state: null,
                stateAmount: null,
            },
            b: {
                value: null,
                suffix: null,
                monospace: false,
                zerofill: null,
                state: null,
                stateAmount: null,
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

            mBrakeDamageFrontLeftStateColor,
            mBrakeDamageFrontRightStateColor,
            mBrakeDamageRearLeftStateColor,
            mBrakeDamageRearRightStateColor,

            mBrakeDamageFrontLeftStateAmount,
            mBrakeDamageFrontRightStateAmount,
            mBrakeDamageRearLeftStateAmount,
            mBrakeDamageRearRightStateAmount,

            mBrakeTempCelsiusFrontLeftDisplay,
            mBrakeTempCelsiusFrontRightDisplay,
            mBrakeTempCelsiusRearLeftDisplay,
            mBrakeTempCelsiusRearRightDisplay,

            mBrakeTempCelsiusFrontLeftStateColor,
            mBrakeTempCelsiusFrontRightStateColor,
            mBrakeTempCelsiusRearLeftStateColor,
            mBrakeTempCelsiusRearRightStateColor,

            mBrakeTempCelsiusFrontLeftStateAmount,
            mBrakeTempCelsiusFrontRightStateAmount,
            mBrakeTempCelsiusRearLeftStateAmount,
            mBrakeTempCelsiusRearRightStateAmount,

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

            mTyreTempFrontLeftStateColor,
            mTyreTempFrontRightStateColor,
            mTyreTempRearLeftStateColor,
            mTyreTempRearRightStateColor,

            mTyreTempFrontLeftStateAmount,
            mTyreTempFrontRightStateAmount,
            mTyreTempRearLeftStateAmount,
            mTyreTempRearRightStateAmount,

            mTyreWearFrontLeftDisplay,
            mTyreWearFrontRightDisplay,
            mTyreWearRearLeftDisplay,
            mTyreWearRearRightDisplay,

            mTyreWearFrontLeftStateColor,
            mTyreWearFrontRightStateColor,
            mTyreWearRearLeftStateColor,
            mTyreWearRearRightStateColor,

            mTyreWearFrontLeftStateAmount,
            mTyreWearFrontRightStateAmount,
            mTyreWearRearLeftStateAmount,
            mTyreWearRearRightStateAmount,

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
            data.a.state = this.mTyreWearFrontLeftStateColor;
            data.a.stateAmount = this.mTyreWearFrontLeftStateAmount;

            data.b.value = this.mTyreTempFrontLeftDisplay;
            data.b.suffix = '°';
            data.b.zerofill = 3;
            data.b.monospace = true;
            data.b.state = this.mTyreTempFrontLeftStateColor;
            data.b.stateAmount = this.mTyreTempFrontLeftStateAmount;

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
            data.a.state = this.mTyreWearFrontRightStateColor;
            data.a.stateAmount = this.mTyreWearFrontRightStateAmount;

            data.b.value = this.mTyreTempFrontRightDisplay;
            data.b.suffix = '°';
            data.b.zerofill = 3;
            data.b.monospace = true;
            data.b.state = this.mTyreTempFrontRightStateColor;
            data.b.stateAmount = this.mTyreTempFrontRightStateAmount;

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
            data.a.state = this.mTyreWearRearLeftStateColor;
            data.a.stateAmount = this.mTyreWearRearLeftStateAmount;

            data.b.value = this.mTyreTempRearLeftDisplay;
            data.b.suffix = '°';
            data.b.zerofill = 3;
            data.b.monospace = true;
            data.b.state = this.mTyreTempRearLeftStateColor;
            data.b.stateAmount = this.mTyreTempRearLeftStateAmount;

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
            data.a.state = this.mTyreWearRearRightStateColor;
            data.a.stateAmount = this.mTyreWearRearRightStateAmount;

            data.b.value = this.mTyreTempRearRightDisplay;
            data.b.suffix = '°';
            data.b.zerofill = 3;
            data.b.monospace = true;
            data.b.state = this.mTyreTempRearRightStateColor;
            data.b.stateAmount = this.mTyreTempRearRightStateAmount;

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
            data.a.state = this.mBrakeDamageFrontLeftStateColor;
            data.a.stateAmount = this.mBrakeDamageFrontLeftStateAmount;

            data.b.value = this.mBrakeTempCelsiusFrontLeftDisplay;
            data.b.suffix = '°';
            data.b.zerofill = 4;
            data.b.monospace = true;
            data.b.state = this.mBrakeTempCelsiusFrontLeftStateColor;
            data.b.stateAmount = this.mBrakeTempCelsiusFrontLeftStateAmount;

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
            data.a.state = this.mBrakeDamageFrontRightStateColor;
            data.a.stateAmount = this.mBrakeDamageFrontRightStateAmount;

            data.b.value = this.mBrakeTempCelsiusFrontRightDisplay;
            data.b.suffix = '°';
            data.b.zerofill = 4;
            data.b.monospace = true;
            data.b.state = this.mBrakeTempCelsiusFrontRightStateColor;
            data.b.stateAmount = this.mBrakeTempCelsiusFrontRightStateAmount;

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
            data.a.state = this.mBrakeDamageRearLeftStateColor;
            data.a.stateAmount = this.mBrakeDamageRearLeftStateAmount;

            data.b.value = this.mBrakeTempCelsiusRearLeftDisplay;
            data.b.suffix = '°';
            data.b.zerofill = 4;
            data.b.monospace = true;
            data.b.state = this.mBrakeTempCelsiusRearLeftStateColor;
            data.b.stateAmount = this.mBrakeTempCelsiusRearLeftStateAmount;

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
            data.a.state = this.mBrakeDamageRearRightStateColor;
            data.a.stateAmount = this.mBrakeDamageRearRightStateAmount;

            data.b.value = this.mBrakeTempCelsiusRearRightDisplay;
            data.b.suffix = '°';
            data.b.zerofill = 4;
            data.b.monospace = true;
            data.b.state = this.mBrakeTempCelsiusRearRightStateColor;
            data.b.stateAmount = this.mBrakeTempCelsiusRearRightStateAmount;

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
