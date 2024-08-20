<template>
    <div class="c-settings-keypress" :class="`${readonly ? 'c-settings-keypress--readonly' : ''}`">
        <span class="c-settings-keypress__icon" v-if="icon"><SvgComponent :svg="`icon--${icon}`" /></span>
        <span class="c-settings-keypress__field" @click="inputfocus">
            <span class="c-settings-keypress__label">{{ label }}</span>
            <input class="c-settings-keypress__value" :type="type" :readonly="readonly" :valid="valid" v-model="model" @focus="focus" @blur="blur" @input="input" @change="change">
        </span>
    </div>
</template>

<style lang="scss">
.c-settings-keypress {
    display: flex;
    align-items: center;
}

.c-settings-keypress--readonly {
    pointer-events: none;
}

.c-settings-keypress__icon {
    display: block;
    width: em(22);
    height: em(22);
    margin: 0 em(12) 0 0; 
}

.c-settings-keypress__field {
    @include color('background-color', 'white', 0);

    padding: em(4) em(10);
    border-radius: em(4);
    transition: 150ms background-color 0ms ease;
    cursor: text;

    &.active {
        @include color('background-color', 'white', 0.2);
    }

    &:hover {
        @include color('background-color', 'white', 0.2);
    }
}

.c-settings-keypress__label,
.c-settings-keypress__value {
    display: block;
    width: 100%;
    text-transform: uppercase;
    white-space: nowrap;
}

.c-settings-keypress__label {
    @include removehighlight();
    @include color('color', 'white', 0.6);

    font-size: em(12);
    pointer-events: none;
}

.c-settings-keypress__value {
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
import { debounce } from 'throttle-debounce';
import autosize from 'autosize-input';

export default {
    props: {
        modelValue: {
            default: ''
        },
        icon: {
            type: String,
            default: null
        },
        label: {
            type: String,
            default: null
        },
        type: {
            type: String,
            default: 'text'
        },
        readonly: {
            type: String,
            default: null
        },
        valid: {
            type: [String, Boolean],
            default: null
        },
    },
    computed:{
        model:{
            get() {
                return this.modelValue;
            },
            set(value) {
                this.$emit("update:modelValue", value);
            }
        }
    },
    mounted() {
        this.triggerAutosize();

        // has scale been changed?
        electron.ipcRenderer.on('updateScale', async () => {
            await this.triggerAutosize();
        });
    },
    methods: {
        inputfocus(event) {
            const element = event.target.parentNode.querySelector('.c-settings-keypress__value');
            element.focus();
        },
        focus(event) {
            const element = event.target.closest(".c-settings-keypress__field");
            element.classList.add('active');
        },
        blur(event) {
            const element = event.target.closest(".c-settings-keypress__field");
            element.classList.remove('active');
        },
        input() {
            this.triggerAutosize();
        },
        triggerAutosize() {
            // delay the autosize on content change from "outside" as it triggers before the content has actually changed
            debounce(100, () => {
                const valueSurface = this.$el.querySelector('.c-settings-keypress__value');
                autosize(valueSurface);
            })();
        }
    }
}
</script>
