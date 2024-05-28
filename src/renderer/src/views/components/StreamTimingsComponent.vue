<template>
    <div class="c-stream-timings" v-if="timings">
        <div class="c-stream-timings__content">
            <header class="c-stream-timings__header">
                <h1 class="c-stream-timings__title" v-if="sessionName">{{ sessionName }}</h1>
                <aside class="c-stream-timings__aside">
                    <div class="c-stream-timings__time-remaining" v-if="eventTimeRemaining">
                        <span v-if="eventTimeRemaining">{{ eventTimeRemaining }}</span>
                    </div>
                </aside>
            </header>
            <div class="c-stream-timings__items">
                <div class="c-stream-timings__item" v-for="timing in timings">
                    <span class="c-stream-timings__position">{{ timing.mRacePosition }}</span>
                    <span class="c-stream-timings__class">{{ timing.mCarClassNamesDisplay }}</span>
                    <span class="c-stream-timings__name">{{ timing.mName }}</span>
                    <span class="c-stream-timings__time">{{ timing.mFastestLapTimesDisplay }}</span>
                    <span class="c-stream-timings__state" v-if="timing.mPitModesDisplay">{{ timing.mPitModesDisplay }}</span>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss">
$item_label: 12;
$item_height: 20;
$item_margin: 4;
$content_padding: 12;
$title_size: 24;

.c-stream-timings {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
}

.c-stream-timings__content {
    @include color('background-color', 'pitbox', 0.8);

    padding: em(12);
    border-radius: em(4);
}

.c-stream-timings__header {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    padding-bottom: em(16);
}

.c-stream-timings__title {
    font-family: "qanelassoft";
    font-size: em($title_size);
    line-height: 1em;
    text-transform: capitalize;
}

.c-stream-timings__aside {
    margin: 0 0 0 em(48);
}

.c-stream-timings__time-remaining {
    text-align: right;
    h2 {
        font-family: "qanelassoft";
        font-weight: normal;
        font-size: em(14);
        line-height: 1.4em;
    }

    span {
        font-family: "firacode";
        font-size: em(16);
        line-height: 1em;
    }
}

.c-stream-timings__items {
    display: flex;
    flex-direction: column;
    margin: em(-$item_margin);
}

.c-stream-timings__item {
    display: flex;
    flex-direction: row;
    align-items: center;
    position: relative;
    padding: em($item_margin);
}

.c-stream-timings__position {
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

.c-stream-timings__class {
    @include color('color', 'yellow');

    flex-grow: 0;
    flex-shrink: 0;
    flex-basis: auto;

    padding: 0 0 0 em(16, $item_label);
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: "qanelassoft";
    font-weight: bold;
    font-size: em($item_label);
    line-height: 1em;
}

.c-stream-timings__name {
    @include color('color', 'white');

    flex-grow: 1;
    flex-shrink: 0;
    flex-basis: auto;

    padding: 0 0 0 em(16, $item_label);
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

.c-stream-timings__time {
    @include color('color', 'white');

    flex-grow: 0;
    flex-shrink: 0;
    flex-basis: auto;

    padding: 0 0 0 em(16, $item_label);
    font-family: "firacode";
    font-weight: bold;
    font-size: em($item_label);
    line-height: 1em;
    letter-spacing: em(0.04);
    text-transform: uppercase;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
}

.c-stream-timings__state {
    @include color('background-color', 'pitbox', 0.8);
    @include color('color', 'yellow');

    flex-grow: 0;
    flex-shrink: 0;
    flex-basis: auto;

    display: flex;
    justify-content: center;
    align-items: center;

    position: absolute;
    top: 0;
    left: 100%;
    bottom: 0;
    padding: 0 em(8, $item_label);
    margin: 0 0 0 em($content_padding - $item_margin, $item_label);
    font-family: "firacode";
    font-weight: bold;
    font-size: em($item_label);
    line-height: 1em;
    letter-spacing: em(0.04);
    text-transform: uppercase;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    border-top-right-radius: em(4);
    border-bottom-right-radius: em(4);
}
</style>

<script>
import { inject } from 'vue';

export default {
    setup() {
        const timings = inject('timings');
        const sessionName = inject('sessionName');
        const eventTimeRemaining = inject('eventTimeRemaining');

        return {
            timings,
            sessionName,
            eventTimeRemaining
        }
    }
}
</script>
