<template>
    <div class="c-in-car-drs" v-if="mDrsStatus && mDrsHighlight" :status="mDrsStatus" :highlight="mDrsHighlight">
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
    height: 100%;
    overflow: hidden;

    &:before {
        content: '';
        position: absolute;
        z-index: 1;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
    }

    &[highlight="disabled"] {
        &:before {
            @include color('background-color', 'yellow', 1);
        }

        .c-in-car-drs__widget {
            @include color('color', 'black', 1);
        }
    }

    &[highlight="inactive"] {
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

    &[highlight="active"] {
        &:before {
            @include color('background-color', 'yellow', 1);
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
    // height: em(48);
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
        const mDrsStatus = inject('mDrsStatus');
        const mDrsHighlight = inject('mDrsHighlight');

        return {
            mDrsStateDisplay,
            mDrsStatus,
            mDrsHighlight,
        }
    },
}
</script>
