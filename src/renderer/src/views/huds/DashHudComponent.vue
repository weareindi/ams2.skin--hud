<template>
    <div class="c-hud-dash">
        <div class="c-hud-dash__upper">
            <div class="c-hud-dash__rows">
                <div class="c-hud-dash__row">
                    <div class="c-hud-dash__items">
                        <div class="c-hud-dash__item">
                            <div class="c-hud-dash__data c-hud-dash__data--standings"><InCarStandingsComponent /></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="c-hud-dash__lower">
            <div class="c-hud-dash__rows">
                <div class="c-hud-dash__row">
                    <div class="c-hud-dash__items">
                        <div class="c-hud-dash__item">
                            <div class="c-hud-dash__data c-hud-dash__data--speedometer"><InCarSpeedometerComponent /></div>
                        </div>
                        <div class="c-hud-dash__item">
                            <div class="c-hud-dash__data c-hud-dash__data--damagewear"><InCarDamageWearComponent /></div>
                        </div>
                    </div>
                </div>
                <div class="c-hud-dash__row">
                    <div class="c-hud-dash__items">
                        <div class="c-hud-dash__item">
                            <div class="c-hud-dash__data c-hud-dash__data--session"><InCarSessionComponent /></div>
                        </div>
                        <div class="c-hud-dash__item ">
                            <div class="c-hud-dash__data c-hud-dash__data--fuel"><InCarFuelComponent /></div>
                        </div>
                        <div class="c-hud-dash__item">
                           <div class="c-hud-dash__data c-hud-dash__data--status"><InCarStatusComponent /></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss">
.c-hud-dash {}

.c-hud-dash__upper {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    padding: em(10);
}

.c-hud-dash__lower {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    padding: em(10);
}

.c-hud-dash__rows {
    margin: em(-8);
}

.c-hud-dash__row {
    padding: em(8);
}

.c-hud-dash__items {
    display: flex;
    justify-content: center;
    margin: em(-8);
}

.c-hud-dash__item {
    display: flex;
    padding: em(8);
}

.c-hud-dash__data {
    display: flex;
}

.c-hud-dash__data--standings {
    background-color: transparent;
}
</style>

<script>
import InCarStandingsComponent from '../components/InCarStandingsComponent.vue';
import InCarStatusComponent from '../components/InCarStatusComponent.vue';
import InCarSpeedometerComponent from '../components/InCarSpeedometerComponent.vue';
import InCarDamageWearComponent from '../components/InCarDamageWearComponent.vue';
import InCarSessionComponent from '../components/InCarSessionComponent.vue';
import InCarFuelComponent from '../components/InCarFuelComponent.vue';

export default {
    components: {
        InCarStandingsComponent,
        InCarStatusComponent,
        InCarSpeedometerComponent,
        InCarDamageWearComponent,
        InCarSessionComponent,
        InCarFuelComponent
    }
}
</script>
