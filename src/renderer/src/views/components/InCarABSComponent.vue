<template>
    <div class="c-in-car-abs" v-if="mAntiLockSettingDisplay">
        <InCarInfoComponent icon="abs" :highlight="mAntiLockHighlight" :a="mAntiLockSettingDisplay" />
    </div>
</template>

<style lang="scss"></style>

<script>
import { inject } from 'vue';
import InCarInfoComponent from '../components/InCarInfoComponent.vue';

export default {
    setup() {
        const mAntiLockSettingDisplay = inject('mAntiLockSettingDisplay');
        // const mAntiLockActiveDisplay = inject('mAntiLockActiveDisplay');
        const mAntiLockHighlight = inject('mAntiLockHighlight');
        
        return {
            mAntiLockSettingDisplay,
            mAntiLockHighlight,
        }
    },
    components: {
        InCarInfoComponent
    }
}
</script>
