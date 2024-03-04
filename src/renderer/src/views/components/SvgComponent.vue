<template>
    <span class="c-svg" :class="'c-svg--' + svg" v-if="item" :style="`padding-top: ${item.impheight};`">
        <span class="c-svg__image" :style="`top: ${item.offsetY}; right: ${item.offsetX}; bottom: ${item.offsetY}; left: ${item.offsetX};`" v-html="item.file"></span>
    </span>
</template>

<style lang="scss">

// svg sizing mixin
// @mixin svg($width, $height) {
//     @include impheight($width, $height);

//     .c-svg__image {
//         $offset-x: -((math.div(100%, $width)));
//         $offset-y: -((math.div(100%, $height)));

//         top: $offset-y;
//         right: $offset-x;
//         bottom: $offset-y;
//         left: $offset-x;
//     }
// }

.c-svg {
    position: relative;
    display: block;
    overflow: visible;
    pointer-events: none;
}

.c-svg__image {
    position: absolute;
    z-index: 10;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    display: block;

    > svg {
        position: absolute;
        top: 0;
        left: 0;
        overflow: visible;
        width: 100%;
        height: 100%;
        margin: 0;
        padding: 0;
        border: 0;
    }
}
</style>

<script>
import { inject } from 'vue';

export default {
    setup() {
        const items = inject('svgcollection');

        return {
            items
        }
    },
    props: {
        svg: null,
        fill: false,
    },
    computed: {
        item: {
            get() {
                if (!this.items) {
                    return null;
                }

                const item = this.items.find((item) => {
                    return item.id === this.svg;
                });

                return item;
            }
        }
    }
}
</script>
