<template>
    <div class="p">
        <div class="p__stream">
            <StreamComponent />
        </div>
    </div>
</template>

<style lang="scss">
.p {}

.p__stream {
    position: relative;
    z-index: 1;
}
</style>

<script>
import StreamComponent from '../huds/StreamComponent.vue';

export default {
    setup() {        
        return {}
    },
    components: {
        StreamComponent,
    },
}

</script>

