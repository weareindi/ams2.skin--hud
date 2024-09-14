<template>
    <div class="c-pit-data-heading">
        <span class="c-pit-data-heading__label">{{ text }}</span>
    </div>
</template>

<style lang="scss">
.c-pit-data-heading {
    position: relative;

    &:before {
        @include color('background-color', 'ams2_red', 1);

        content: '';
        position: absolute;
        top: em(4);
        left: em(-34);
        width: em(20);
        height: em(4);
        border-top-left-radius: em(2);
        border-bottom-left-radius: em(2);
    }
}

.c-pit-data-heading__label {
    @include removehighlight();
    @include color('color', 'white', 0.6);

    font-size: em(17);
    pointer-events: none;
    text-transform: uppercase;
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
