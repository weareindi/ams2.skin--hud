<template>
    <!-- <div class="c-stream-hud" v-if="director && view">
        <div class="c-stream-hud__item c-stream-hud__item--standings" v-if="view === 'standings'">
            <StreamStandingsComponent />
        </div>
        <div class="c-stream-hud__item c-stream-hud__item--solo" v-if="view === 'solo'">
            <StreamSoloComponent />
        </div>
        <div class="c-stream-hud__item c-stream-hud__item--chase" v-if="view === 'chase'">
            <StreamChaseComponent />
        </div>
        <div class="c-stream-hud__item c-stream-hud__item--timings" v-if="view === 'timings'">
            <StreamTimingsComponent />
        </div>
    </div> -->
</template>

<style lang="scss">
// .c-stream-hud {}

// .c-stream-hud__item {}

// .c-stream-hud__item--standings,
// .c-stream-hud__item--chase,
// .c-stream-hud__item--solo {
//     position: fixed;
//     bottom: 0;
//     right: 0;
//     left: 0;
// }

// .c-stream-hud__item--timings {
//     position: fixed;
//     top: 0;
//     bottom: 0;
//     left: 0;
//     padding: em(8) em(8) em(32);
// }

</style>

<script>
// import StreamStandingsComponent from '../components/StreamStandingsComponent.vue';
// import StreamSoloComponent from '../components/StreamSoloComponent.vue';
// import StreamChaseComponent from '../components/StreamChaseComponent.vue';
// import StreamTimingsComponent from '../components/StreamTimingsComponent.vue';
// import { inject } from 'vue';

export default {
    setup() {
        // const director = inject('director');
        // const view = inject('view');

        return {
            // director,
            // view
        }
    },
    components: {
        // StreamStandingsComponent,
        // StreamSoloComponent,
        // StreamChaseComponent,
        // StreamTimingsComponent,
    }
}
</script>
