<template>
    <div class="c-stream-standings">
        <div class="c-stream-standings__groups">
            <div class="c-stream-standings__group" v-for="chunk, chunkIndex in chunks">
                <div class="c-stream-standings__items" v-if="chunkIndex == activeChunk">
                    <div class="c-stream-standings__item" v-for="standing in chunk">
                        <span class="c-stream-standings__position">{{ standing.mRacePosition }}</span>
                        <span class="c-stream-standings__name">{{ standing.mName }}</span>                
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss">
$item_label: 42;
$item_height: 54;
$item_margin: 8;

.c-stream-standings {}

.c-stream-standings__groups {}

.c-stream-standings__group {
    display: flex;
    align-items: center;
    justify-content: center;
}

.c-stream-standings__items {
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;

    width: 100%;
    max-width: em(1280);
    height: em(($item_height * 3) + ($item_margin * 2 * 3));
    align-items: center;
}

.c-stream-standings__item {
    flex-grow: 0;
    flex-shrink: 0;
    flex-basis: auto;

    display: flex;
    align-items: center;
    justify-content: flex-start;

    width: 50%;
    height: em($item_height);
    margin: em($item_margin);
}

.c-stream-standings__position {
    @include color('background-color', 'yellow');
    @include color('color', 'black');

    flex-grow: 0;
    flex-shrink: 0;
    flex-basis: auto;

    display: flex;
    align-items: center;
    justify-content: center;
    font-family: "qanelassoft";
    font-weight: bold;
    font-size: em($item_label);
    line-height: 1em;
    width: em($item_height, $item_label);
    height: em($item_height, $item_label);
}

.c-stream-standings__name {
    @include color('color', 'white');

    flex-grow: 1;
    flex-shrink: 1;
    flex-basis: auto;

    padding: 0 0 0 em(16, $item_label);
    width: 100%;
    font-family: "qanelassoft";
    font-weight: bold;
    font-size: em($item_label);
    line-height: 1em;
    letter-spacing: em(0.04);
    text-transform: uppercase;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
}
</style>

<script>
import { inject } from 'vue';

export default {
    setup() {
        const standings = inject('standings');

        return {
            chunks: standings,
        }
    },
    data() {
        return {
            activeChunk: 0,
            interval: null
        }
    },
    mounted() {
        this.start();
    },
    methods: {
        start() {
            this.stop();
            this.interval = setInterval(() => {
                this.activeChunk++;
                if (this.activeChunk >= this.chunks.length) {
                    this.activeChunk = 0;
                }
            }, 10000);
        },
        stop() {
            clearInterval(this.interval);
        }
    }
}
</script>
