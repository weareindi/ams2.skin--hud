<template>
    <div class="c-pit-data-value" v-if="data">
        <div class="c-pit-data-value__item" v-for="item in data">
            <span class="c-pit-data-value__label" v-if="item.label !== null" v-html="item.label"></span>
            <span class="c-pit-data-value__value" v-if="item.value !== null"><span v-html="item.value"></span><span class="c-pit-data-value__seperator" v-if="item.seperator !== null" v-html="item.seperator"></span><span class="c-pit-data-value__suffix" v-if="item.suffix !== null" v-html="item.suffix"></span></span>
        </div>
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

    font-family: 'uifont', sans-serif;
    font-size: em(10);
    letter-spacing: 0;
    line-height: 1em;
    pointer-events: none;
}

.c-pit-data-value__value {
    @include removehighlight();
    @include hideAppearance();

    margin: em(6, 10) 0 0;
    font-family: 'uifont', sans-serif;
    font-size: em(10);
    letter-spacing: 0;
    line-height: 1em;
}

</style>

<script>

export default {
    props: {
        data: null,
    }
}
</script>
