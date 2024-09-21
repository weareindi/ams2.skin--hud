<template>
    <div class="c-standings-header">
        <div class="c-standings-header__name" v-if="mCarClassName[0]" v-html="mCarClassName[0].label"></div>
        <div class="c-standings-header__color" v-if="mCarClassColor[0]"></div>
    </div>
</template>

<style lang="scss">
.c-standings-header {
    position: relative;
}

.c-standings-header__name {
    @include color('color', 'black');

    position: relative;
    z-index: 2;
    width: em((1280 + 32), 24);
    margin: 0 auto;
    padding: em(16, 24);

    font-family: 'uifont', sans-serif;
    font-size: em(24);
    font-weight: bold
}

.c-standings-header__color {
    @include color('background-color', 'yellow');

    position: absolute;
    z-index: 1;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    mask-image: linear-gradient(300deg, transparent, #000000);
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
