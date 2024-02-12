<template>
    <div class="c-settings-toggle" @click="click">
        <span class="c-settings-toggle__icon" v-if="icon"><SvgComponent :svg="`icon--${icon}`" /></span>
        <span class="c-settings-toggle__field">
            <span class="c-settings-toggle__label">{{ label }}</span>
            <span class="c-settings-toggle__value">{{ value }}</span>
        </span>
    </div>
</template>

<style lang="scss">
.c-settings-toggle {
    display: flex;
    align-items: center;
}

.c-settings-toggle--readonly {
    pointer-events: none;
}

.c-settings-toggle__icon {
    display: block;
    width: em(22);
    height: em(22);
    margin: 0 em(12) 0 0; 
}

.c-settings-toggle__field {
    @include color('background-color', 'white', 0);

    padding: em(4) em(8);
    border-radius: em(4);
    transition: 150ms background-color 0ms ease;
    cursor: pointer;

    &.active {
        @include color('background-color', 'white', 0.2);
    }

    &:hover {
        @include color('background-color', 'white', 0.2);
    }
}

.c-settings-toggle__label,
.c-settings-toggle__value {
    display: block;
    width: 100%;
    text-transform: uppercase;
    white-space: nowrap;
}

.c-settings-toggle__label {
    @include removehighlight();
    @include color('color', 'white', 0.6);

    font-size: em(12);
    pointer-events: none;
}

.c-settings-toggle__value {
    @include removehighlight();
    @include hideAppearance();

    height: 1em;
    font-size: em(18);
    line-height: 1em;
    letter-spacing: 0;
    border: 0;
    margin: 0;
    padding: 0;
    outline: 0;

    &[valid="true"] {
        @include color('color', 'green', 1);
    }

    &[valid="false"] {
        @include color('color', 'red', 1);
    }
}
</style>

<script>
export default {
    props: [
        'modelValue',
        'icon',
        'label',
        'options'
    ],
    data() {
        const option = this.options.find((option) => {
            return option.value === this.modelValue;
        });

        let label = typeof option !== 'undefined' ? option.label : '';

        return {
            model: this.modelValue,
            value: label
        }
    },
    methods: {
        click(event) {
            const option = this.options.find((option, index) => {
                return option.value === this.modelValue;
            });

            // get current index
            let index = this.options.indexOf(option);

            // increment/cycle it to next option
            index++;
            if (index > (this.options.length-1)) {
                index = 0;
            }

            const { label, value } = this.options[index];
            this.value = label;
            this.$emit("update:modelValue", value);
        }
    }
}
</script>
