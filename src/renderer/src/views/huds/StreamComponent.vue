<template>
    <div class="c-stream-hud" v-if="viewStates">
        <div class="c-stream-hud__item c-stream-hud__item--standings" v-if="standings">
            <StreamStandingsComponent />
        </div>
        <div class="c-stream-hud__item c-stream-hud__item--solo" v-if="solo">
            <StreamSoloComponent />
        </div>
        <div class="c-stream-hud__item c-stream-hud__item--chase" v-if="chase">
            <StreamChaseComponent />
        </div>
        <div class="c-stream-hud__item c-stream-hud__item--timings" v-if="timings">
            <StreamTimingsComponent />
        </div>
    </div>
</template>

<style lang="scss">
.c-stream-hud {}

.c-stream-hud__item {
}

.c-stream-hud__item--standings,
.c-stream-hud__item--chasing,
.c-stream-hud__item--solo {
    @include color('background-color', 'pitbox', 0.8);

    position: fixed;
    bottom: 0;
    right: 0;
    left: 0;
    padding: em(8) em(8) em(32);
}

.c-stream-hud__item--timings {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    padding: em(8) em(8) em(32);
}

</style>

<script>
import StreamStandingsComponent from '../components/StreamStandingsComponent.vue';
import StreamSoloComponent from '../components/StreamSoloComponent.vue';
import StreamChaseComponent from '../components/StreamChaseComponent.vue';
import StreamTimingsComponent from '../components/StreamTimingsComponent.vue';
import { inject } from 'vue';

export default {
    setup() {
        const viewStates = inject('viewStates');

        return {
            viewStates
        }
    },
    components: {
        StreamStandingsComponent,
        StreamSoloComponent,
        StreamChaseComponent,
        StreamTimingsComponent,
    },
    computed: {
        chase() {
            return this.viewStates.indexOf('chase') >= 0 ? true : false;
        },
        solo() {
            return this.viewStates.indexOf('solo') >= 0 ? true : false;
        },
        standings() {
            return this.viewStates.indexOf('standings') >= 0 ? true : false;
        },
        timings() {
            return this.viewStates.indexOf('timings') >= 0 ? true : false;
        }
    }
}
</script>
