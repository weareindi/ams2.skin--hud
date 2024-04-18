<template>
    <div class="c-stream-hud">
        <div class="c-stream-hud__item c-stream-hud__item--standings" v-if="active == 'standings'">
            <StreamStandingsComponent />
        </div>
        <div class="c-stream-hud__item c-stream-hud__item--solo" v-if="active == 'solo'">
            <StreamSoloComponent />
        </div>
    </div>
</template>

<style lang="scss">
.c-stream-hud {}

.c-stream-hud__item {
    @include color('background-color', 'pitbox', 0.8);

    position: fixed;
    bottom: 0;
    right: 0;
    left: 0;
    padding: em(8) em(8) em(32);
}

.c-stream-hud__item--standings {}

.c-stream-hud__item--chasing {}

.c-stream-hud__item--solo {}

</style>

<script>
import StreamStandingsComponent from '../components/StreamStandingsComponent.vue';
import StreamSoloComponent from '../components/StreamSoloComponent.vue';

export default {
    components: {
        StreamStandingsComponent,
        StreamSoloComponent,
    },
    data() {
        return {
            active: null,
            interval: null
        }
    },
    mounted() {
        this.start();
    },
    methods: {
        start() {
            this.stop();
            // this.interval = setInterval(() => {
            //     this.activeChunk++;
            //     if (this.activeChunk >= this.chunks.length) {
            //         this.activeChunk = 0;
            //     }
            // }, 10000);
        },
        stop() {
            clearInterval(this.interval);
        }
    }
}
</script>
