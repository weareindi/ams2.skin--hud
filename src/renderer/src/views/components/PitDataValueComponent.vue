<template>
    <div class="c-pit-data-value">
        <span class="c-pit-data-value__label">{{ label }}</span>
        <span class="c-pit-data-value__value">{{ value }} <span class="c-pit-data-value__suffix" v-if="suffix">{{ suffix }}</span></span>
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
        data: {},
    },
    computed: {
        label() {
            if (typeof this.data.label === 'undefined') {
                return null;
            }

            return this.data.label;
        },
        value() {
            if (typeof this.data.value === 'undefined') {
                return null;
            }

            return this.data.value;
        },
        suffix() {
            if (typeof this.data.suffix === 'undefined') {
                return null;
            }

            return this.data.suffix;
        },
    }
}
</script>
