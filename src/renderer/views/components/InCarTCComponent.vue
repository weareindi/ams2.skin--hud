<template>
    <div class="c-in-car-tc" v-if="mTractionControlSettingDisplay">
        <InCarInfoComponent icon="tc" :highlight="mTractionControlHighlight" :a="mTractionControlSettingDisplay" />
    </div>
</template>

<style lang="scss"></style>

<script>
import { inject } from 'vue';
import InCarInfoComponent from '../components/InCarInfoComponent.vue';

export default {
    setup() {
        const mTractionControlSettingDisplay = inject('mTractionControlSettingDisplay');
        const mTractionControlHighlight = inject('mTractionControlHighlight');
        // const isTractionControlActiveDisplay = inject('isTractionControlActiveDisplay');
        
        return {
            mTractionControlSettingDisplay,
            mTractionControlHighlight,
            // isTractionControlActiveDisplay,
        }
    },
    components: {
        InCarInfoComponent
    }
}
</script>
