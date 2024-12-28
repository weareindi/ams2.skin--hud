<template>
    <div class="c-pit-data-heading">
        <span class="c-pit-data-heading__label">{{ text }}</span>
    </div>
</template>

<style lang="scss">
.c-pit-data-heading {}

.c-pit-data-heading__label {
    @include removehighlight();
    @include color('color', 'white', 1);

    font-size: em(14);
    font-weight: normal;
    pointer-events: none;
    // text-transform: uppercase;
}

</style>

<script>

export default {
    props: {
        text: {
            type: String,
            default: ''
        }
    }
}
</script>
