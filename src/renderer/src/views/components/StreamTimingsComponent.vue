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
            <div class="c-stream-timings__items" :count="count">
                <div class="c-stream-timings__item" v-for="timing in timings">
                    <div class="c-stream-timings__driver" :class="timing.isUser ? 'c-stream-timings__driver--user' : ''">
                        <div class="c-stream-timings__position">
                            <span class="c-stream-timings__label">{{ timing.mRacePosition }}</span>
                        </div>
                        <div class="c-stream-timings__class" :style="{ 'background-color':timing.mCarClassColorDisplay }">
                            <span class="c-stream-timings__label" v-if="timing.mCarClassNamesDisplay">{{ timing.mCarClassNamesDisplay }}</span>
                        </div>
                        <div class="c-stream-timings__tag">
                            <span class="c-stream-timings__label" v-if="timing.mNameTag">{{ timing.mNameTag }}</span>
                        </div>
                        <div class="c-stream-timings__name">
                            <span class="c-stream-timings__label">{{ timing.mNameShort }}</span>
                        </div>
                        <div class="c-stream-timings__time" v-if="sessionName === 'practice' || sessionName === 'qualifying'">
                            <span class="c-stream-timings__label">{{ timing.mFastestLapTimesDisplay ? timing.mFastestLapTimesDisplay : 'No Time'  }}</span>
                        </div>
                        <div class="c-stream-timings__time" v-if="sessionName === 'race'">
                            <span class="c-stream-timings__label">{{ timing.mLastLapTimeDisplay ? timing.mLastLapTimeDisplay : 'No Time' }}</span>
                        </div>
                        <div class="c-stream-timings__state" v-if="timing.mPitModesDisplay">
                            <span class="c-stream-timings__label">{{ timing.mPitModesDisplay }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss">
$content_padding: 8;
$title_size: 24;

$item_spacing: 4;
$item_height: 20;

$item_gap: 8;

$item_position_label: 14;
$item_tag_label: 14;
$item_name_label: 14;
$item_time_label: 14;
$item_state_label: 14;

// // $item_position_height: 20;
// $item_class_label: 15;

// $item_name_label: 20;
// $item_name_height: 22;

// $item_label: 20;
// $item_height: 22;
// $item_spacing: 4;
// // $item_margin: 4;
// $item_state_label: 18;
// $item_state_height: 18;
// $item_state_padding: 8;

.c-stream-timings {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
}

.c-stream-timings__content {
    @include color('background-color', 'pitbox', 0.8);

    padding: em($content_padding);
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
    margin: em(-$item_spacing);
}

.c-stream-timings__item {
    padding: em($item_spacing);
}

.c-stream-timings__driver {
    position: relative;
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    align-content: center;
    justify-content: flex-start;
}

.c-stream-timings__driver--user {
    @include color('background-color', 'yellow');
    @include color('color', 'black');

    margin: em(0) em(-$content_padding);
    padding: em($content_padding);

    .c-stream-timings__state {
        margin-left: 0;
    }

    .c-stream-timings__position,
    .c-stream-timings__class,
    .c-stream-timings__tag,
    .c-stream-timings__name,
    .c-stream-timings__time,
    .c-stream-timings__state {
        @include color('background-color', 'yellow');
        @include color('color', 'black');
    }
}

.c-stream-timings__position,
.c-stream-timings__class,
.c-stream-timings__tag,
.c-stream-timings__name,
.c-stream-timings__time,
.c-stream-timings__state {
    flex-grow: 0;
    flex-shrink: 0;
    flex-basis: auto;

    display: flex;
    align-items: center;
    justify-content: flex-start;

    line-height: 1em;
    letter-spacing: 0em;
}

.c-stream-timings__position {
    @include color('background-color', 'yellow');
    @include color('color', 'black');

    display: flex;
    align-items: center;
    justify-content: center;

    width: em($item_height);
    height: em($item_height);

    border-radius: em(2);

    .c-stream-timings__label {
        font-size: em($item_position_label);
        font-family: 'firacode', monospace;
    }
}

.c-stream-timings__class {    
    margin-left: em($item_gap);

    flex-grow: 0;
    flex-shrink: 1;
    flex-basis: auto;

    border-radius: em(2);

    .c-stream-timings__label {
        @include color('color', 'white');

        font-size: em($item_tag_label);
        font-family: 'firacode', monospace;
        width: 5ch;
        text-align: center;
        mix-blend-mode: lighten;
    }
}

.c-stream-timings__tag {
    margin-left: em($item_gap);

    flex-grow: 0;
    flex-shrink: 1;
    flex-basis: auto;

    .c-stream-timings__label {
        font-size: em($item_tag_label);
        font-family: 'firacode', monospace;
        width: 5ch;
        text-align: center;
    }
}

.c-stream-timings__name {
    @include color('color', 'yellow');

    flex-grow: 1;
    flex-shrink: 0;
    flex-basis: auto;

    margin-left: em($item_gap);

    .c-stream-timings__label {
        font-size: em($item_name_label);
        font-family: 'firacode', monospace;
        width: 14ch;
    }
}

.c-stream-timings__time {
    margin-left: em($item_gap);

    .c-stream-timings__label {
        font-size: em($item_time_label);
        font-family: 'firacode', monospace;
        min-width: 10ch;
        text-align: center
    }
}

.c-stream-timings__state {
    @include color('background-color', 'pitbox', 0.8);

    position: absolute;
    top: 0;
    left: 100%;
    height: 100%;
    margin-left: em($content_padding);
    padding: em($item_spacing * 2);
    border-top-right-radius: em(4);
    border-bottom-right-radius: em(4);

    .c-stream-timings__label {
        width: 100%;
        max-width: 10ch;
        font-size: em($item_state_label);
        font-family: 'firacode', monospace;
    }
}

.c-stream-timings__label {
    display: block;
    text-transform: uppercase;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    line-height: 1em;
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
    },
    computed: {
        count() {
            return 99;
        }
    }
}
</script>
