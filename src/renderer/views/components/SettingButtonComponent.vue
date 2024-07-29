<template>
    <button class="c-button" :class="`${'c-button--' + color}`" :disabled="disabled">
        <span class="c-button__label">{{ label }}</span>
    </button>
</template>

<style lang="scss">
.c-button {
    @include color('color', 'white');
    @include color('background-color', 'black');

    padding: em(12);
    border-radius: em(4);
    cursor: pointer;
    transition: 150ms background-color 0ms ease;

    &:hover {
        @include color('background-color', 'white', 0.9);
    }

    &[disabled] {
        @include color('color', 'black');
        @include color('background-color', 'white', 0.1);
        pointer-events: none;

        &:hover {
            @include color('color', 'black');
            @include color('background-color', 'white', 0.1);
        }
    }
}

.c-button--yellow {
    @include color('color', 'black');
    @include color('background-color', 'yellow');

    &:hover {
        @include color('background-color', 'yellow', 0.9);
    }
}

.c-button--red {
    @include color('color', 'white');
    @include color('background-color', 'red');

    &:hover {
        @include color('background-color', 'red', 0.9);
    }
}

.c-button--green {
    @include color('color', 'white');
    @include color('background-color', 'green');

    &:hover {
        @include color('background-color', 'green', 0.9);
    }
}

.c-button--blue {
    @include color('color', 'white');
    @include color('background-color', 'blue');

    &:hover {
        @include color('background-color', 'blue', 0.9);
    }
}

.c-button__label {
    @include removehighlight();

    font-size: em(14);
    line-height: 1em;
    text-transform: uppercase;
    white-space: nowrap;
}
</style>

<script>
export default {
    props: {
        color: {
            type: String,
            default: 'default'
        },
        label: {
            type: String,
            default: 'Button Label'
        },
        disabled: {
            type: Boolean,
            default: false
        }
    },
    setup() {},
}
</script>
