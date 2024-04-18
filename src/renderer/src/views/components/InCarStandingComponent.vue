<template>
    <div class="c-in-car-standing">
        <div class="c-in-car-standing__rows">
            <div class="c-in-car-standing__row">
                <div class="c-in-car-standing__frame" :status="standing.status">
                    <div class="c-in-car-standing__items">
                        <div class="c-in-car-standing__item c-in-car-standing__item--position">
                            <div class="c-in-car-standing__position">{{ standing.mRacePosition }}</div>
                        </div>
                        <div class="c-in-car-standing__item c-in-car-standing__item--car">
                            <div class="c-in-car-standing__car">{{ standing.mCarClassNames }}</div>
                        </div>
                        <div class="c-in-car-standing__item c-in-car-standing__item--name">
                            <div class="c-in-car-standing__name">{{ standing.mName }}</div>
                        </div>
                        <div class="c-in-car-standing__item c-in-car-standing__item--distance" v-if="!standing.isUser">
                            <div class="c-in-car-standing__distance">{{ standing.distance }}</div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="c-in-car-standing__row" v-if="standing.mBestLapTime">
                <div class="c-in-car-standing__frame">
                    <div class="c-in-car-standing__items">
                        <div class="c-in-car-standing__item c-in-car-standing__item--label">
                            <div class="c-in-car-standing__label">Best</div>
                        </div>
                        <div class="c-in-car-standing__item c-in-car-standing__item--time c-in-car-standing__item--best">
                            <span class="c-in-car-standing__delta" v-if="standing.bestLapSectorDeltaVisible" :positive="standing.bestLapSectorDeltaPositive ? true : false">{{ standing.bestLapSectorDelta }}</span>
                            <span class="c-in-car-standing__time">{{ standing.mBestLapTime }}</span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="c-in-car-standing__row" v-if="standing.mLastLapTime">
                <div class="c-in-car-standing__frame">
                    <div class="c-in-car-standing__items">
                        <div class="c-in-car-standing__item c-in-car-standing__item--label">
                            <div class="c-in-car-standing__label">Last</div>
                        </div>
                        <div class="c-in-car-standing__item c-in-car-standing__item--time c-in-car-standing__item--last">
                            <span class="c-in-car-standing__delta" v-if="standing.lastLapSectorDeltaVisible" :positive="standing.lastLapSectorDeltaPositive ? true : false">{{ standing.lastLapSectorDelta }}</span>
                            <span class="c-in-car-standing__time">{{ standing.mLastLapTime }}</span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="c-in-car-standing__row" v-if="standing.mCurrentTime">
                <div class="c-in-car-standing__frame">
                    <div class="c-in-car-standing__items">
                        <div class="c-in-car-standing__item c-in-car-standing__item--label">
                            <div class="c-in-car-standing__label">Current</div>
                        </div>
                        <div class="c-in-car-standing__item c-in-car-standing__item--time c-in-car-standing__item--current">
                            <div class="c-in-car-standing__time">{{ standing.mCurrentTime }}</div>
                        </div>
                    </div>
                </div>
            </div>
            <!-- <div class="c-in-car-standing__row" v-if="standing.deltaVisible">
                <div class="c-in-car-standing__frame" :status="standing.deltaStatus">
                    <div class="c-in-car-standing__items">
                        <div class="c-in-car-standing__item c-in-car-standing__item--label">
                            <div class="c-in-car-standing__label">Delta</div>
                        </div>
                        <div class="c-in-car-standing__item c-in-car-standing__item--delta">
                            <div class="c-in-car-standing__delta">{{ standing.delta }}</div>
                        </div>
                    </div>
                </div>
            </div> -->
        </div>
    </div>
</template>

<style lang="scss">
.c-in-car-standing {}

.c-in-car-standing__rows {}

.c-in-car-standing__row {
    ~ .c-in-car-standing__row {
        margin-top: em(2);
    }

    &:nth-of-type(1) {
        .c-in-car-standing__frame {
            border-top-left-radius: 0;
            border-top-right-radius: 0;
        }
    }
}

.c-in-car-standing__frame {
    @include color('background-color', 'pitbox', 0.8);

    position: relative;
    padding: em(4) em(12);
    border-radius: em(4);
    // margin: 0 0 em(4);

    &[status="hot"],
    &[status="out"],
    &[status="racing"],
    &[status="ahead"],
    &[status="behind"],
    &[status="backmarker"],
    &[status="leader"] {
        border-bottom-left-radius: 0;
        border-bottom-right-radius: 0;

        &:after {
            content: '';
            position: absolute;
            top: 100%;
            right: 0;
            left: 0;
            height: em(4);
            border-bottom-left-radius: em(4);
            border-bottom-right-radius: em(4);
        }
    }

    &[status="hot"] {
        &:after {
            @include color('background-color', 'red', 1);
        }
    }

    &[status="out"] {
        &:after {
            @include color('background-color', 'grey', 1);
        }
    }

    &[status="racing"],
    &[status="ahead"],
    &[status="behind"] {
        &:after {
            @include color('background-color', 'green', 1);
        }
    }

    &[status="backmarker"] {
        &:after {
            @include color('background-color', 'blue', 1);
        }
    }

    &[status="leader"] {
        &:after {
            @include color('background-color', 'red', 1);
        }
    }
    
    &[status="negative"] {
        .c-in-car-standing__delta {
            @include color('color', 'green');
        }
    }

    &[status="positive"] {
        .c-in-car-standing__delta {
            @include color('color', 'red');
        }
    }
}

.c-in-car-standing__items {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    align-items: center;
    margin: em(-6);
}

.c-in-car-standing__item {
    padding: em(6);
    flex-grow: 0;
    flex-shrink: 0;
    flex-basis: auto;
}

.c-in-car-standing__item--position {
    flex-grow: 0;
    flex-shrink: 0;
    flex-basis: auto;
}

.c-in-car-standing__item--car {
    flex-grow: 0;
    flex-shrink: 0;
    flex-basis: auto;
}

.c-in-car-standing__item--name {
    width: 100%;
    flex-grow: 0;
    flex-shrink: 1;
    flex-basis: auto;
    overflow: hidden;
}

.c-in-car-standing__item--distance {
    flex-grow: 0;
    flex-shrink: 0;
    flex-basis: auto;
}

.c-in-car-standing__item--label {
    flex-grow: 1;
    flex-shrink: 0;
    flex-basis: auto;
}

.c-in-car-standing__item--time {
    flex-grow: 1;
    flex-shrink: 0;
    flex-basis: auto;
    text-align: right;
}

.c-in-car-standing__item--best,
.c-in-car-standing__item--last {
    .c-in-car-standing__time {
        opacity: 0.5;
    }
}

.c-in-car-standing__item--delta {
    flex-grow: 1;
    flex-shrink: 0;
    flex-basis: auto;
    text-align: right;
}

.c-in-car-standing__position {
    width: 2ch;
    font-size: em(22);
    line-height: 1em;
    text-align: center
}

.c-in-car-standing__car {
    @include color('background-color', 'white');
    @include color('color', 'black');

    font-size: em(16);
    line-height: 1em;
    border-radius: em(4, 20);
    padding: em(10, 20) em(8, 20);
}

.c-in-car-standing__name {
    width: 100%;
    font-size: em(16);
    line-height: 1em;
    text-align: left;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
}

.c-in-car-standing__distance {
    padding: 0 0 0 em(32);
    font-family: 'firacode', monospace;
    font-size: em(16);
    line-height: 1em;
}

.c-in-car-standing__label {
    opacity: 0.5;
}

.c-in-car-standing__label,
.c-in-car-standing__time,
.c-in-car-standing__delta, {
    font-family: 'firacode', monospace;
    font-size: em(14);
    line-height: 1em;
}

.c-in-car-standing__delta {
    @include color('color', 'green');

    margin-right: em(16);

    &[positive="true"] {
        @include color('color', 'red');
    }
}
</style>

<script>
export default {
    props: {
        standing: {},
    }
}
</script>
