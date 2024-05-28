<template>
    <div class="c-stream-chase" v-if="chase">
        <div class="c-stream-chase__items" :count="count">            
            <div class="c-stream-chase__item c-stream-chase__item--participant" v-if="chase.ahead">
                <span class="c-stream-chase__info">
                    <span class="c-stream-chase__gradient"></span>
                    <span class="c-stream-chase__name">{{ chase.ahead.mName }}</span>
                    <span class="c-stream-chase__car">{{ chase.ahead.mCarNamesDisplay }}</span>
                </span>
                <span class="c-stream-chase__position">{{ chase.ahead.mRacePosition }}</span>
            </div>
            <div class="c-stream-chase__item c-stream-chase__item--time" v-if="chase.ahead">
                <span class="c-stream-chase__time">{{ chase.ahead.distanceToUserDisplay }}</span>
            </div>
            <div class="c-stream-chase__item c-stream-chase__item--participant" v-if="chase.user">
                <span class="c-stream-chase__info">
                    <span class="c-stream-chase__gradient"></span>
                    <span class="c-stream-chase__name">{{ chase.user.mName }}</span>
                    <span class="c-stream-chase__car">{{ chase.user.mCarNamesDisplay }}</span>
                </span>
                <span class="c-stream-chase__position">{{ chase.user.mRacePosition }}</span>
            </div>
            <div class="c-stream-chase__item c-stream-chase__item--time" v-if="chase.behind">
                <span class="c-stream-chase__time">{{ chase.behind.distanceToUserDisplay }}</span>
            </div>
            <div class="c-stream-chase__item c-stream-chase__item--participant" v-if="chase.behind">
                <span class="c-stream-chase__info">
                    <span class="c-stream-chase__gradient"></span>
                    <span class="c-stream-chase__name">{{ chase.behind.mName }}</span>
                    <span class="c-stream-chase__car">{{ chase.behind.mCarNamesDisplay }}</span>
                </span>
                <span class="c-stream-chase__position">{{ chase.behind.mRacePosition }}</span>
            </div>
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
    overflow: hidden;
    margin: 0 auto;
}

.c-stream-chase__items {
    display: flex;
    flex-direction: row;
    // flex-wrap: wrap;
    flex-wrap: nowrap;
    align-items: flex-start;
    height: em(210);
}

.c-stream-chase__items[count="1"] {
    .c-stream-chase__item--participant:nth-of-type(1) {
        flex-direction: row-reverse;

        .c-stream-chase__info {
            margin: 0 0 0 em(16);
        }

        .c-stream-chase__gradient {
            background: linear-gradient(90deg, #CFCCBE 0%, #C79700 50%, #0D0B00 100%);
        }

        .c-stream-chase__name {
            padding: 0 0 0 em(32, 42);
            text-align: right;
        }

        
        .c-stream-chase__car {
            padding: 0 0 0 em(32, 24);
            text-align: right;
        }
    }
}

.c-stream-chase__items[count="2"] {
    .c-stream-chase__item--time {
        padding: em(16) em(32);
    }

    .c-stream-chase__item--participant {
        width: em(300);
    }

    .c-stream-chase__info {
        margin: 0 0 0 em(8);
    }

    .c-stream-chase__time {
        font-size: em(24);
    }

    .c-stream-chase__gradient {
        height: em(8);
    }

    .c-stream-chase__name {
        margin: em(16, 28) 0 0;
        padding: 0 em(32, 28) 0 0;
        font-size: em(28);
    }

    .c-stream-chase__car {
        margin: em(8, 22) 0 0;
        padding: 0 em(16, 22) 0 0;
        font-size: em(22);
    }

    .c-stream-chase__position {
        font-size: em(32);
        width: em(48, 32);
        height: em(48, 32);
    }
}

.c-stream-chase__item {
    flex-grow: 0;
    flex-shrink: 0;
    flex-basis: auto;

    display: flex;
    align-items: flex-start;
    justify-content: center;
}

.c-stream-chase__item--participant {
    width: em(428);
}

.c-stream-chase__item--time {
    flex-grow: 1;
    flex-shrink: 0;
    flex-basis: auto;

    padding: em(16) em(96);
}

.c-stream-chase__info {
    flex-grow: 1;
    flex-shrink: 1;
    flex-basis: auto;

    display: flex;
    flex-direction: column;
    margin: 0 em(16) 0 0
}

.c-stream-chase__time {
    @include color('color', 'yellow');

    flex-grow: 0;
    flex-shrink: 0;
    flex-basis: auto;

    font-family: 'firacode', monospace;
    font-size: em(48);
    line-height: 1em;
    letter-spacing: 0.04em;
    white-space: nowrap;
    min-width: 8ch;
    text-align: center;
}

.c-stream-chase__gradient {
    // @include color('background-color', 'white');
    background: linear-gradient(90deg, #0D0B00 0%, #C79700 50%, #CFCCBE 100%);

    flex-grow: 0;
    flex-shrink: 0;
    flex-basis: auto;

    width: 100%;
    height: em(16);
}

.c-stream-chase__name {
    @include color('color', 'white');

    flex-grow: 0;
    flex-shrink: 0;
    flex-basis: auto;

    margin: em(16, 34) 0 0;
    padding: 0 em(32, 34) 0 0;
    width: 100%;
    font-family: "qanelassoft";
    font-weight: bold;
    font-size: em(34);
    line-height: 1em;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    // text-overflow: ellipsis;
    white-space: wrap;
    overflow: hidden;
    word-spacing: 100vw;
}

.c-stream-chase__car {
    @include color('color', 'white', 0.8);

    flex-grow: 1;
    flex-shrink: 1;
    flex-basis: auto;

    margin: em(16, 20) 0 0;
    padding: 0 em(32, 20) 0 0;
    width: 100%;
    font-family: "qanelassoft";
    font-weight: bold;
    font-size: em(20);
    line-height: 1em;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    // text-overflow: ellipsis;
    // white-space: nowrap;
    // overflow: hidden;
    white-space: wrap;
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
    },
    computed: {
        count() {
            let count = 0; 

            if ('ahead' in this.chase && this.chase.ahead !== null) {
                count++;
            }

            if ('behind' in this.chase && this.chase.behind !== null) {
                count++;
            }

            return count;
        }
    }
}
</script>
