<template>
    <div class="c-in-car-drs" :state="state" v-if="isDrsAvailableDisplay">
        <div class="c-in-car-drs__widget">
            <span class="c-in-car-drs__label">DRS</span>
        </div>
    </div>
</template>

<style lang="scss">
.c-in-car-drs {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: em(12);
    border-radius: em(3);
    overflow: hidden;

    &:before {
        content: '';
        position: absolute;
        z-index: 1;
        top: em(4);
        right: em(4);
        bottom: em(4);
        left: em(4);
        border-radius: em(2);
    }

    &[state="disabled"],
    &[state="inactive"] {
        &:before {
            @include color('background-color', 'yellow', 1);
        }

        .c-in-car-drs__widget {
            @include color('color', 'black', 1);
        }
    }

    &[state="active"] {
        &:before {
            @include color('background-color', 'yellow', 1);

            animation-name: flash; 
            animation-timing-function: linear;
            animation-iteration-count: infinite;
            animation-duration: 300ms;
        }

        .c-in-car-drs__widget {
            @include color('color', 'black', 1);
        }
    }
}

.c-in-car-drs__widget {
    @include color('color', 'white', 0.2);

    position: relative;
    z-index: 2;
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    padding: em(4) em(10); 
    width: em(120);
    height: em(48);
}

.c-in-car-drs__label {
    font-family: 'firacode', monospace;
    font-size: em(18);
    line-height: 1em;
    letter-spacing: 0.1em;
    text-transform: uppercase;
}
</style>

<script>
import { inject } from 'vue';

export default {
    setup() {
        const mDrsStateDisplay = inject('mDrsStateDisplay');
        const isDrsAvailableDisplay = inject('isDrsAvailableDisplay');

        return {
            mDrsStateDisplay,
            isDrsAvailableDisplay,
        }
    },
    computed: {
        state() {
            let state = null;

            if (this.mDrsStateDisplay === 1) { // not allowed to open
                state = 'disabled';
            }

            if (this.mDrsStateDisplay === 3) { // not in drs/active zone
                state = 'enabled';
            }

            if (this.mDrsStateDisplay === 11) { // allowed to open
                state = 'inactive';
            }

            if (this.mDrsStateDisplay === 17 || this.mDrsStateDisplay === 27) { // open
                state = 'active';
            }

            return state;
        }
    },
}
</script>
