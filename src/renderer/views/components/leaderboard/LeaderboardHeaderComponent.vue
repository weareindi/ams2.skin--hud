<template>
    <div class="c-leaderboard-header">
        <div class="c-leaderboard-header__rows">
            <div class="c-leaderboard-header__row">
                <div class="c-leaderboard-header__items">
                    <div class="c-leaderboard-header__item" v-if="vSessionName">
                        <div class="c-leaderboard-header__session" v-html="vSessionName[0].label"></div>
                    </div>
                    <div class="c-leaderboard-header__item" v-if="vEventTimeRemaining">
                        <div class="c-leaderboard-header__time" v-html="vEventTimeRemaining[0].value"></div>
                    </div>
                </div>
            </div>
            <div class="c-leaderboard-header__row">
                <div class="c-leaderboard-header__items">
                    <div class="c-leaderboard-header__item" v-if="vLaps">
                        <div class="c-leaderboard-header__laps" :state="vLaps[0].state">
                            <div class="c-leaderboard-header__label" v-html="vLaps[0].label"></div>
                            <div class="c-leaderboard-header__current" v-html="vLaps[0].value"></div>
                            <div class="c-leaderboard-header__seperator" v-if="vLaps[0].suffix" v-html="vLaps[0].seperator"></div>
                            <div class="c-leaderboard-header__total" v-if="vLaps[0].suffix" v-html="vLaps[0].suffix"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss">
.c-leaderboard-header {}

.c-leaderboard-header__rows {}

.c-leaderboard-header__row {
    ~ .c-leaderboard-header__row {
        margin: em(8) 0 0;
    }
}

.c-leaderboard-header__items {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.c-leaderboard-header__item {
    flex-grow: 0;
    flex-shrink: 1;
    flex-basis: auto;
    width: 100%;
}

.c-leaderboard-header__session {
    font-family: 'uifont', sans-serif;
    font-size: em(16);
    font-weight: bold;
    letter-spacing: 0;
    line-height: 1em;
}

.c-leaderboard-header__time {
    font-family: 'uifont-mono', sans-serif;
    font-size: em(14);
    font-style: italic;
    letter-spacing: 0;
    line-height: 1em;
    text-align: right;
}

.c-leaderboard-header__laps {
    @include color('border-bottom-color', 'white', 0.1);

    display: flex;
    justify-content: center;
    align-items: center;
    padding: em(12, 14);

    border-bottom-style: solid;
    border-bottom-width: 1px;
}

.c-leaderboard-header__label,
.c-leaderboard-header__current,
.c-leaderboard-header__seperator,
.c-leaderboard-header__total {
    font-family: 'uifont', sans-serif;
    font-size: em(12);
}

.c-leaderboard-header__label {}

.c-leaderboard-header__current {}

.c-leaderboard-header__seperator {}

.c-leaderboard-header__total {}
</style>

<script>

export default {
    props: {
        vSessionName: null,
        vEventTimeRemaining: null,
        vLaps: null,
    }
}
</script>
