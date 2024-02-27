<template>
    <div class="c-pit-data-value">
        <span class="c-pit-data-value__label" v-if="data.label !== null">{{ data.label }}</span>
        <span class="c-pit-data-value__value" v-if="data.value !== null">{{ data.value }} <span class="c-pit-data-value__suffix" v-if="data.suffix !== null">{{ data.suffix }}</span></span>
    </div>
</template>

<style lang="scss">
.c-pit-data-value {}

.c-pit-data-value__label,
.c-pit-data-value__value {
    display: block;
    white-space: nowrap;
}

.c-pit-data-value__label {
    @include removehighlight();
    @include color('color', 'white', 0.6);

    font-size: em(16);
    line-height: 1em;
    pointer-events: none;
}

.c-pit-data-value__value {
    @include removehighlight();
    @include hideAppearance();

    font-family: 'firacode', monospace;
    font-size: em(15);
    line-height: 1em;
    letter-spacing: 0;
}

</style>

<script>

export default {
    props: {
        data: null,
    }
}
</script>
