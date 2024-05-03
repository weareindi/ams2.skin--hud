<template>
    <div class="c-stream-chase" v-if="chase">
        <div class="c-stream-chase__items">
            <div v-if="chase.ahead">{{ chase.ahead.mName }}</div>
            <div v-if="chase.user">{{ chase.user.mName }}</div>
            <div v-if="chase.behind">{{ chase.behind.mName }}</div>
            
            <!-- <div class="c-stream-chase__item" v-if="chase">
                <span class="c-stream-chase__info">
                    <span class="c-stream-chase__name">{{ solo.mName }}</span>
                    <span class="c-stream-chase__car">{{ solo.mCarNames }}</span>
                </span>
                <span class="c-stream-chase__position">{{ solo.mRacePosition }}</span>
            </div> -->
        </div>
    </div>
</template>

<style lang="scss">
.c-stream-chase {
    display: flex;
    align-items: center;
    justify-content: center;

    width: 100%;
    max-width: em(1280);
}

.c-stream-chase__items {
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    align-items: flex-start;
    height: em(210);
}

.c-stream-chase__item {
    flex-grow: 0;
    flex-shrink: 0;
    flex-basis: auto;

    display: flex;
    align-items: center;
    justify-content: flex-start;
}

.c-stream-chase__info {
    display: flex;
    flex-direction: column;
    margin: em(8);
    padding: 0 em(128, 48) 0 0;
}

.c-stream-chase__name {
    @include color('color', 'white');

    flex-grow: 1;
    flex-shrink: 1;
    flex-basis: auto;

    padding: 0 em(16, 48) 0 0;
    width: 100%;
    font-family: "qanelassoft";
    font-weight: bold;
    font-size: em(48);
    line-height: 1em;
    letter-spacing: em(0.04);
    text-transform: uppercase;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
}

.c-stream-chase__car {
    @include color('color', 'white', 0.8);

    flex-grow: 1;
    flex-shrink: 1;
    flex-basis: auto;

    margin: em(16, 36) 0 0;
    padding: 0 em(16, 36) 0 0;
    width: 100%;
    font-family: "qanelassoft";
    font-weight: bold;
    font-size: em(36);
    line-height: 1em;
    letter-spacing: em(0.04);
    text-transform: uppercase;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
}

.c-stream-chase__position {
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
    font-size: em(64);
    line-height: 1em;
    width: em(96, 64);
    height: em(96, 64);
}
</style>

<script>
import { inject } from 'vue';

export default {
    setup() {
        const chase = inject('chase');

        return {
            chase
        }
    }
}
</script>
