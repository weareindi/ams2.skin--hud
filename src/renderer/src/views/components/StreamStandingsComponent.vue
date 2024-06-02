<template>
    <div class="c-stream-standings" v-if="standings && standings.page >= 0 && standings.pages">
        <div class="c-stream-standings__groups">
            <div class="c-stream-standings__group" v-for="page, pageIndex in standings.pages">
                <div class="c-stream-standings__items" v-if="pageIndex == standings.page">
                    <div class="c-stream-standings__item" v-for="standing in page">
                        <span class="c-stream-standings__position">{{ standing.mRacePosition }}</span>
                        <span class="c-stream-standings__details">
                            <span class="c-stream-standings__name">{{ standing.mNameShort }}</span>
                            <span class="c-stream-standings__tag" v-if="standing.mNameTag">{{ standing.mNameTag }}</span>
                            
                        </span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss">
$item_label: 42;
$item_sub_label: 18;
$item_position_label: 42;
$item_height: 54;
$item_margin: 8;

.c-stream-standings {
    @include color('background-color', 'pitbox', 0.8);
    
    padding: em(8) em(8) em(32);
}

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
    align-items: flex-start;
    justify-content: flex-start;
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
    font-size: em($item_position_label);
    line-height: 1em;
    width: em($item_height, $item_position_label);
    height: em($item_height, $item_position_label);
}

.c-stream-standings__details {
    flex-grow: 1;
    flex-shrink: 1;
    flex-basis: auto;

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    height: em($item_height);
    overflow: hidden;
}

.c-stream-standings__name {
    @include color('color', 'white');

    padding: 0 0 0 em(16, $item_label);
    width: 100%;
    font-family: "qanelassoft";
    font-weight: bold;
    font-size: em($item_label);
    line-height: 1em;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
}

.c-stream-standings__tag {
    @include color('color', 'yellow');

    flex-grow: 1;
    flex-shrink: 1;
    flex-basis: auto;

    margin-top: em(4, $item_sub_label);
    padding: 0 0 0 em(16, $item_sub_label);
    width: 100%;
    font-family: "qanelassoft";
    font-weight: bold;
    font-size: em($item_sub_label);
    line-height: 1em;
    letter-spacing: 0.04em;
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
            standings
        }
    }
}
</script>
