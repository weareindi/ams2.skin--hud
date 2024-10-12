<template>
    <div class="c-hud-pit">
        <div class="c-hud-pit__fuel-calc"><PitFuelCalcComponent /></div>
    </div>
</template>

<style lang="scss">
.c-hud-pit {
    position: relative;
    font-family: "secularone";
    width: em(1920);
    height: em(1920);
    margin: auto;
}

.c-hud-pit__fuel-calc {
    position: absolute;
    top: em(792);
    left: em(1506);
    // top: 0%;
    // right: em(161);
    // width: 100px;
    // height: 100px;
    // background-color: blue;
    // top: (math.div(161, 1080) * 100%);
    // right: (math.div(78, 1920) * 100%);
}
</style>

<script>
import PitFuelCalcComponent from '../components/pit/PitFuelCalcComponent.vue';

export default {
    components: {
        PitFuelCalcComponent
    }
}
</script>