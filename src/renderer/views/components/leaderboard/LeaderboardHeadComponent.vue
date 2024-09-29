<template>
    <div class="s-leaderboard-head">
        <div class="s-leaderboard-head__class">
            <div class="s-leaderboard-head__value" v-html="mCarClassName[0].value" :style="`background-color: ${mCarClassColor[0].value}`"></div>
        </div>
    </div>
</template>

<style lang="scss">

.s-leaderboard-head {
    padding: 0 em(16);
}

.s-leaderboard-head__class {
    // padding: em(4) em(8);

    .s-leaderboard-head__value {
        position: relative;
        overflow: hidden;
        padding: em(8, 10) em(8, 10);
        font-family: 'uifont', sans-serif;
        font-size: em(10);
        line-height: 1em;
        text-align: center;
        border-radius: em(4, 10);

        &:before {
            content: '';
            position: absolute;
            z-index: -1;
            top: 0;
            right: 0;
            bottom: 0;
            left: 0;
        }
    }
}

.s-leaderboard-head__value {
    width: 100%;
    white-space: nowrap;
    overflow: hidden;
    text-align: center;
    text-overflow: ellipsis;
}

</style>

<script>

export default {
    props: {
        mCarClassName: null,
        mCarClassColor: null,
    }
}
</script>
