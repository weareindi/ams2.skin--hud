<template>
    <div class="c-leaderboard-header">
        <div class="c-leaderboard-header__items">
            <div class="c-leaderboard-header__item" v-if="vSessionName">
                <div class="c-leaderboard-header__session" v-html="vSessionName[0].label"></div>
            </div>
            <div class="c-leaderboard-header__item" v-if="vEventStatus">
                <div class="c-leaderboard-header__status" :state="vEventStatus[0].state">
                    <div class="c-leaderboard-header__label" v-html="vEventStatus[0].label"></div>
                    <div class="c-leaderboard-header__value" v-html="vEventStatus[0].value"></div>
                    <div class="c-leaderboard-header__seperator" v-if="vEventStatus[0].suffix" v-html="vEventStatus[0].seperator"></div>
                    <div class="c-leaderboard-header__suffix" v-if="vEventStatus[0].suffix" v-html="vEventStatus[0].suffix"></div>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss">
.c-leaderboard-header {
    @include color('border-bottom-color', 'primary', 0.2);

    padding: 0 0 em(16);
    margin: 0 0 em(16);

    border-bottom-width: 1px;
    border-bottom-style: solid;
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

.c-leaderboard-header__session,
.c-leaderboard-header__status {
    font-size: em(18);
    line-height: 1em;
    text-transform: uppercase;
}

.c-leaderboard-header__session {
    @include color('color', 'primary');
}

.c-leaderboard-header__status {
    @include color('color', 'primary-alt');

    text-align: right;

    display: flex;
    align-items: center;
    justify-content: flex-end;
}

.c-leaderboard-header__label {
    margin: 0 em(8, 18) 0 0;
}

</style>

<script>

export default {
    props: {
        vSessionName: null,
        vEventStatus: null,
    }
}
</script>
