<template>
    <span class="c-svg" :class="'c-svg--' + name">
        <span class="c-svg__image" v-html="raw"></span>
    </span>
</template>

<style lang="scss">

// svg sizing mixin
@mixin svg($width, $height) {
    @include impheight($width, $height);

    .c-svg__image {
        $offset-x: -((math.div(100%, $width)));
        $offset-y: -((math.div(100%, $height)));

        top: $offset-y;
        right: $offset-x;
        bottom: $offset-y;
        left: $offset-x;
    }
}

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

.c-svg--icon--abs,
.c-svg--icon--aero,
.c-svg--icon--auto,
.c-svg--icon--brake,
.c-svg--icon--circuit,
.c-svg--icon--display,
.c-svg--icon--engine,
.c-svg--icon--eye,
.c-svg--icon--fuel,
.c-svg--icon--network,
.c-svg--icon--oil,
.c-svg--icon--pedals,
.c-svg--icon--suspension,
.c-svg--icon--tc,
.c-svg--icon--tyre,
.c-svg--icon--water-temp,
.c-svg--icon--wipers,
.c-svg--icon--power,
.c-svg--icon--scale {
    @include svg(48, 48);
}
</style>

<script>
import SvgIconAbs from '/src/assets/svg/icon--abs--48x48.svg';
import SvgIconAero from '/src/assets/svg/icon--aero--48x48.svg';
import SvgIconAuto from '/src/assets/svg/icon--auto--48x48.svg';
import SvgIconBrake from '/src/assets/svg/icon--brake--48x48.svg';
import SvgIconCircuit from '/src/assets/svg/icon--circuit--48x48.svg';
import SvgIconDisplay from '/src/assets/svg/icon--display--48x48.svg';
import SvgIconEngine from '/src/assets/svg/icon--engine--48x48.svg';
import SvgIconEye from '/src/assets/svg/icon--eye--48x48.svg';
import SvgIconFuel from '/src/assets/svg/icon--fuel--48x48.svg';
import SvgIconNetwork from '/src/assets/svg/icon--network--48x48.svg';
import SvgIconOil from '/src/assets/svg/icon--oil--48x48.svg';
import SvgIconPedals from '/src/assets/svg/icon--pedals--48x48.svg';
import SvgIconSuspension from '/src/assets/svg/icon--suspension--48x48.svg';
import SvgIconTc from '/src/assets/svg/icon--tc--48x48.svg';
import SvgIconTyre from '/src/assets/svg/icon--tyre--48x48.svg';
import SvgIconWaterTemp from '/src/assets/svg/icon--water-temp--48x48.svg';
import SvgIconWipers from '/src/assets/svg/icon--wipers--48x48.svg';
import SvgIconPower from '/src/assets/svg/icon--power--48x48.svg';
import SvgIconScale from '/src/assets/svg/icon--scale--48x48.svg';

export default {
    computed: {
        raw: {
            get() {
                if (this.$attrs.svg === 'icon--abs') {
                    return SvgIconAbs;
                }

                if (this.$attrs.svg === 'icon--aero') {
                    return SvgIconAero;
                }

                if (this.$attrs.svg === 'icon--auto') {
                    return SvgIconAuto;
                }

                if (this.$attrs.svg === 'icon--brake') {
                    return SvgIconBrake;
                }

                if (this.$attrs.svg === 'icon--circuit') {
                    return SvgIconCircuit;
                }

                if (this.$attrs.svg === 'icon--display') {
                    return SvgIconDisplay;
                }

                if (this.$attrs.svg === 'icon--engine') {
                    return SvgIconEngine;
                }

                if (this.$attrs.svg === 'icon--eye') {
                    return SvgIconEye;
                }

                if (this.$attrs.svg === 'icon--fuel') {
                    return SvgIconFuel;
                }

                if (this.$attrs.svg === 'icon--network') {
                    return SvgIconNetwork;
                }

                if (this.$attrs.svg === 'icon--oil') {
                    return SvgIconOil;
                }

                if (this.$attrs.svg === 'icon--pedals') {
                    return SvgIconPedals;
                }

                if (this.$attrs.svg === 'icon--suspension') {
                    return SvgIconSuspension;
                }

                if (this.$attrs.svg === 'icon--tc') {
                    return SvgIconTc;
                }

                if (this.$attrs.svg === 'icon--tyre') {
                    return SvgIconTyre;
                }

                if (this.$attrs.svg === 'icon--water-temp') {
                    return SvgIconWaterTemp;
                }

                if (this.$attrs.svg === 'icon--wipers') {
                    return SvgIconWipers;
                }

                if (this.$attrs.svg === 'icon--power') {
                    return SvgIconPower;
                }

                if (this.$attrs.svg === 'icon--scale') {
                    return SvgIconScale;
                }
            }
        },
        name: {
            get() {
                return this.$attrs.svg;
            }
        },
    }
}
</script>
