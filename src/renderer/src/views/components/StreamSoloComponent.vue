<template>
    <div class="c-stream-solo">
        <div class="c-stream-solo__items">
            <div class="c-stream-solo__item" v-if="solo">
                <span class="c-stream-solo__info">
                    <span class="c-stream-solo__name">{{ solo.mName }}</span>
                    <span class="c-stream-solo__car">{{ solo.mCarNamesDisplay }}</span>
                </span>
                <span class="c-stream-solo__position">{{ solo.mRacePosition }}</span>
            </div>
        </div>
    </div>
</template>

<style lang="scss">
.c-stream-solo {
    display: flex;
    align-items: center;
    justify-content: center;

    width: 100%;
    max-width: em(1280);
}

.c-stream-solo__items {
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    align-items: flex-start;
    height: em(210);
}

.c-stream-solo__item {
    flex-grow: 0;
    flex-shrink: 0;
    flex-basis: auto;

    display: flex;
    align-items: center;
    justify-content: flex-start;
}

.c-stream-solo__info {
    display: flex;
    flex-direction: column;
    margin: em(8);
    padding: 0 em(128, 48) 0 0;
}

.c-stream-solo__name {
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

.c-stream-solo__car {
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

.c-stream-solo__position {
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
        const solo = inject('solo');

        return {
            solo
        }
    }
}
</script>
