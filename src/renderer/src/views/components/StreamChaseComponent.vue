<template>
    <div class="c-stream-chase" v-if="chase">
        <div class="c-stream-chase__items" :count="count"> 
                      
            <div class="c-stream-chase__item c-stream-chase__item--participant" v-if="chase.ahead">
                <span class="c-stream-chase__info">
                    <span class="c-stream-chase__gradient"></span>
                    <span class="c-stream-chase__name">
                        <span class="c-stream-chase__label">{{ chase.ahead.mNameShort }}</span>
                    </span>
                    <span class="c-stream-chase__tag" v-if="chase.ahead.mNameTag">
                        <span class="c-stream-chase__label">{{ chase.ahead.mNameTag }}</span>
                    </span>
                </span>
                <span class="c-stream-chase__position">
                    <span class="c-stream-chase__label">{{ chase.ahead.mRacePosition }}</span>
                </span>
            </div>

            <div class="c-stream-chase__item c-stream-chase__item--time" v-if="chase.ahead">
                <span class="c-stream-chase__time">
                    <span class="c-stream-chase__label">{{ chase.ahead.distanceToUserDisplay }}</span>
                </span>
            </div>

            <div class="c-stream-chase__item c-stream-chase__item--participant" v-if="chase.user">
                <span class="c-stream-chase__info">
                    <span class="c-stream-chase__gradient"></span>
                    <span class="c-stream-chase__name">
                        <span class="c-stream-chase__label">{{ chase.user.mNameShort }}</span>
                    </span>
                    <span class="c-stream-chase__tag" v-if="chase.user.mNameTag">
                        <span class="c-stream-chase__label">{{ chase.user.mNameTag }}</span>
                    </span>
                </span>
                <span class="c-stream-chase__position">
                    <span class="c-stream-chase__label">{{ chase.user.mRacePosition }}</span>
                </span>
            </div>

            <div class="c-stream-chase__item c-stream-chase__item--time" v-if="chase.behind">
                <span class="c-stream-chase__time">
                    <span class="c-stream-chase__label">{{ chase.behind.distanceToUserDisplay }}</span>
                </span>
            </div>

            <div class="c-stream-chase__item c-stream-chase__item--participant" v-if="chase.behind">
                <span class="c-stream-chase__info">
                    <span class="c-stream-chase__gradient"></span>
                    <span class="c-stream-chase__name">
                        <span class="c-stream-chase__label">{{ chase.behind.mNameShort }}</span>
                    </span>
                    <span class="c-stream-chase__tag" v-if="chase.behind.mNameTag">
                        <span class="c-stream-chase__label">{{ chase.behind.mNameTag }}</span>
                    </span>
                </span>
                <span class="c-stream-chase__position">
                    <span class="c-stream-chase__label">{{ chase.behind.mRacePosition }}</span>
                </span>
            </div>

        </div>
    </div>
</template>

<style lang="scss">
.c-stream-chase {
    @include color('background-color', 'pitbox', 0.8);
    
    padding: em(16) em(16) em(32);

    display: flex;
    align-items: center;
    justify-content: center;
}

.c-stream-chase__items {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;

    width: 100%;
    max-width: em(1280);
    overflow: hidden;
}

.c-stream-chase__item {
    flex-grow: 0;
    flex-shrink: 0;
    flex-basis: auto;

    display: flex;
    flex-direction: row;
    overflow: hidden;
}

.c-stream-chase__item--participant {
    width: em(428);
}

.c-stream-chase__item--time {
    flex-grow: 1;

    padding: em(24);

    align-items: center;
    justify-content: center;
}

.c-stream-chase__time {
    @include color('color', 'yellow');

    // flex-grow: 1;
    // flex-shrink: 1;
    // flex-basis: auto;

    .c-stream-chase__label {
        font-family: 'firacode', monospace;
        font-size: em(48);
        min-width: 8ch;
        text-align: center;
    }
}

.c-stream-chase__info {
    flex-grow: 0;
    flex-shrink: 1;
    flex-basis: auto;

    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    margin: 0 em(16) 0 0;
    width: calc(100% - em(96 + 16));
}

.c-stream-chase__gradient,
.c-stream-chase__name,
.c-stream-chase__tag,
.c-stream-chase__car {
    flex-grow: 0;
    flex-shrink: 0;
    flex-basis: auto;

    width: 100%;
}

.c-stream-chase__gradient {
    background: linear-gradient(90deg, #0D0B00 0%, #C79700 50%, #CFCCBE 100%);

    width: 100%;
    height: em(16);
}

.c-stream-chase__name,
.c-stream-chase__tag,
.c-stream-chase__car {
    display: flex;
    align-items: flex-start;
    justify-content: flex-start;
}

.c-stream-chase__name {
    @include color('color', 'white');

    margin: em(8) 0 0;

    .c-stream-chase__label {
        font-size: em(42);
    }
}

.c-stream-chase__tag {
    @include color('border-color', 'white', 0.4);
    @include color('color', 'yellow');

    margin: em(4) 0 0;
    padding: em(8) 0 0 0;

    border-top-width: em(2, 36);
    border-top-style:dotted;

    .c-stream-chase__label {
        font-size: em(20);
    }
}

.c-stream-chase__car {
    @include color('color', 'white', 0.8);

    flex-grow: 1;

    margin: em(32) 0 0;
    display: flex;
    align-items: flex-end;

    .c-stream-chase__label {
        font-size: em(20);
    }
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
    
    width: em(96);
    height: em(96);

    .c-stream-chase__label {
        font-size: em(64);
    }
}

.c-stream-chase__label {
    font-family: "qanelassoft";
    display: block;
    font-weight: bold;
    line-height: 1em;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
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

        .c-stream-chase__name,
        .c-stream-chase__tag,
        .c-stream-chase__car {
            justify-content: flex-end;
        }
    }
}

.c-stream-chase__items[count="2"] {
    max-width: em(1600);

    .c-stream-chase__item--participant {
        width: em(320);
    }

    .c-stream-chase__info {
        width: calc(100% - em(64 + 16));
    }

    .c-stream-chase__time {
        .c-stream-chase__label {
            font-size: em(36);
        }
    }

    .c-stream-chase__name {
        .c-stream-chase__label {
            font-size: em(36);
        }
    }

    .c-stream-chase__tag {
        .c-stream-chase__label {
            font-size: em(18);
        }
    }

    .c-stream-chase__car {
        .c-stream-chase__label {
            font-size: em(18);
        }
    }

    .c-stream-chase__position {
        width: em(64);
        height: em(64);

        .c-stream-chase__label {
            font-size: em(36);
        }
    }

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
