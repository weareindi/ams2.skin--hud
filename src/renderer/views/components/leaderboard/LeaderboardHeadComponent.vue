<template>
    <div class="s-leaderboard-head">
        <div class="s-leaderboard-head__class">
            <div class="s-leaderboard-head__value" v-html="mCarClassName[0].value"></div>
        </div>
    </div>
</template>

<style lang="scss">

.s-leaderboard-head {
    margin: 0 0 em(8)
}

.s-leaderboard-head__class {
    @include color('color', 'primary');

    .s-leaderboard-head__value {
        font-size: em(14);
        text-transform: uppercase;
    }
}

</style>

<script>

export default {
    props: {
        mCarClassName: null,
    }
}
</script>
