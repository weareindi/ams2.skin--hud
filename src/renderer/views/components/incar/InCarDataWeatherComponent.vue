<template>
    <div class="c-in-car-data-weather">
        <span class="c-in-car-data-weather__icon">
            <InCarIconComponent :svg="icon" :state="data.state"/>
        </span>
        <span class="c-in-car-data-weather__output">
            <span class="c-in-car-data-weather__label-container">
                <span class="c-in-car-data-weather__label">{{ data.label }}</span>
            </span>
            <span class="c-in-car-data-weather__segments">
                <span class="c-in-car-data-weather__segment" v-for="segment in segments">
                    <span class="c-in-car-data-weather__visual">
                        <span class="c-in-car-data-weather__amount" :style="`transform: scaleX(${segment})`"></span>
                    </span>
                </span>
            </span>
        </span>
    </div>
</template>

<style lang="scss">

.c-in-car-data-weather {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: flex-start;
}

.c-in-car-data-weather__icon {}

.c-in-car-data-weather__output {
    margin: 0 0 0 em(8);
    width: em(116);
}

.c-in-car-data-weather__label-container {
    position: relative;
    display: flex;
    align-items: flex-end;
    margin: 0 0 em(4);
    height: em(14);
}

.c-in-car-data-weather__label {
    display: block;
    font-family: "uifont", sans-serif;
    font-size: em(10);
    line-height: 1.2em;
}

.c-in-car-data-weather__segments {
    display: flex;
    flex-wrap: nowrap;
    margin: em(-2);
}

.c-in-car-data-weather__segment {
    flex-grow: 0;
    flex-shrink: 0;
    flex-basis: auto;
    padding: em(2);
}

.c-in-car-data-weather__visual {
    @include color('background-color', 'white', 0.2);

    position: relative;
    display: block;
    overflow: hidden;
    width: em(20);
    height: em(2);
}

.c-in-car-data-weather__amount {
    @include color('background-color', 'white', 1);

    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    transform: scaleX(0);
    transform-origin: 0 0;
    transition: 150ms transform 0ms ease;
}


</style>

<script>

import InCarIconComponent from './InCarIconComponent.vue';

export default {
    props: {
        data: {},
        icon: {},
    },
    components: {
        InCarIconComponent
    },
    computed: {
        segments: {
            get() {
                // get chunk index for where the devision of 0.2 does not complete
                let unwholeIndex = Math.floor(this.data.value / 0.2);

                // create segments array with a length of 5
                let segments = new Array( 5 );

                // fill all segments with 0
                segments = segments.fill(0);

                // fill everything before unwholeIndex with 1 as they are 100%
                segments = segments.fill(1, 0, unwholeIndex);

                // fill the unwholeIndex segment with the percentage (0-1) of the data.value is within that chunk... this is harder to explain that it is to do
                return segments.fill( ((this.data.value % 0.2) / 0.2), unwholeIndex, unwholeIndex + 1);
            }
        }
    }
}
</script>
