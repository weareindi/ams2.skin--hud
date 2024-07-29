<template>
    <div class="p">
        <Suspense>
            <SettingsSection />
        </Suspense>
    </div>
</template>

<style lang="scss">
.p {
    width: 100%;
    height: 100%;
}
</style>

<script>
import SettingsSection from '../sections/SettingsSection.vue';

export default {
    components: {
        SettingsSection,
    },
}
</script>

