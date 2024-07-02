<template>
    <div class="c-stream-standings" v-if="standings && standings.page >= 0 && standings.pages">
        <div class="c-stream-standings__groups">
            <div class="c-stream-standings__group" v-for="page, pageIndex in standings.pages">
                <div class="c-stream-standings__items" v-if="pageIndex == standings.page">
                    <div class="c-stream-standings__item" v-for="standing in page">
                        <span class="c-stream-standings__position">
                            <span class="c-stream-standings__number">{{ standing.mRacePosition }}</span>
                            <span class="c-stream-standings__class" v-if="standing.mCarClassNamesDisplay">
                                <span class="c-in-car-standings__class-name">{{ standing.mCarClassNamesDisplay }}</span>
                                <span class="c-in-car-standings__class-color" :style="{ 'background-color':standing.mCarClassColorDisplay }"></span>
                            </span>
                        </span>
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
$item_number_label: 42;
$item_class_label: 12;
$item_height: 64;
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
    position: relative;
    width: em($item_height);
    height: em($item_height);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

.c-stream-standings__number {
    @include color('background-color', 'yellow');
    @include color('color', 'black');

    flex-grow: 1;
    flex-shrink: 0;
    flex-basis: auto;

    display: flex;
    align-items: center;
    justify-content: center;
    font-family: "qanelassoft";
    font-weight: bold;
    font-size: em($item_number_label);
    line-height: 1em;
    width: 100%;
}

.c-stream-standings__class {
    flex-grow: 1;
    flex-shrink: 0;
    flex-basis: auto;

    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: "qanelassoft";
    font-weight: bold;
    font-size: em($item_class_label);
    line-height: 1em;
    width: 100%;
}

.c-in-car-standings__class-name {
    @include color('color', 'white');

    position: relative;
    z-index: 2;
    mix-blend-mode: lighten;
}

.c-in-car-standings__class-color {
    position: absolute;
    z-index: 1;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
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
