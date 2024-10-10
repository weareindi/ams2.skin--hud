<template>
    <div class="c-standings-header">
        <div class="c-standings-header__name" v-if="vCarClassName[0]" v-html="vCarClassName[0].label"></div>
    </div>
</template>

<style lang="scss">
.c-standings-header {
    position: relative;
}

.c-standings-header__name {
    @include color('color', 'primary');

    font-size: em(32);
    text-transform: uppercase;
}
</style>

<script>

export default {
    props: {
        vCarClassName: null,
    }
}
</script>
