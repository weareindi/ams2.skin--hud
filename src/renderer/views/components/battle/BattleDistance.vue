<template>
    <div class="s-battle-distance" v-for="item in data">
        <div class="s-battle-distance__value s-battle-distance__value--zerofill" v-html="item.zerofill"></div>
        <div class="s-battle-distance__value" v-html="item.label"></div>
        <div class="s-battle-distance__value" v-html="item.suffix"></div>
    </div>
</template>

<style lang="scss">
.s-battle-distance {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: em(32);
}

.s-battle-distance__value {
    @include color('color', 'yellow');

    font-size: em(28);
}

.s-battle-distance__value--zerofill {
    opacity: 0.1;
}

</style>

<script>

export default {
    props: {
        data: null,
    }
}
</script>
