<template>
    <div class="p">
        <Suspense>
            <p>Hud</p>
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

export default {
    setup() {
        const vHudShow = inject('vHudShow');
        const vHudStatus = inject('vHudStatus');
        
        return {
            vHudShow,
            vHudStatus,
        };
    }
}
</script>

