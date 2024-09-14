<template>
    <div>
        <Suspense>
            <div class="p">
                <div class="p__pit" v-if="vHudStatus === 1">
                    <PitHud />
                </div>
                <div class="p__car" v-if="vHudStatus === 2">
                    <InCarHud />
                </div>
            </div>
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
import { inject } from 'vue';
import PitHud from '@renderer/views/huds/PitHud.vue';
import InCarHud from '@renderer/views/huds/InCarHud.vue';

export default {
    setup() {
        const vHudStatus = inject('vHudStatus');

        return {
            vHudStatus,
        };
    },
    components: {
        PitHud,
        InCarHud
    }
}
</script>

