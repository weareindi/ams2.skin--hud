<template>
    <div class="c-in-car-bias" v-if="mBrakeBiasDisplay">
        <InCarInfoComponent icon="bias" :a="mBrakeBiasDisplay" />
    </div>
</template>

<style lang="scss"></style>

<script>
import { inject } from 'vue';
import InCarInfoComponent from '../components/InCarInfoComponent.vue';

export default {
    setup() {
        const mBrakeBiasDisplay = inject('mBrakeBiasDisplay');
        
        return {
            mBrakeBiasDisplay,
        }
    },
    components: {
        InCarInfoComponent
    }
}
</script>
