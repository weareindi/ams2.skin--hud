<template>
    <div class="c-in-car-hud">
        <div class="c-in-car-hud__upper">
            <div class="c-in-car-hud__rows">
                <div class="c-in-car-hud__row">
                    <div class="c-in-car-hud__items">
                        <div class="c-in-car-hud__item">
                            <div class="c-in-car-hud__data c-in-car-hud__data--standings"><InCarStandingsComponent /></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="c-in-car-hud__lower">
            <div class="c-in-car-hud__rows">
                <div class="c-in-car-hud__row">
                    <div class="c-in-car-hud__items">
                        <div class="c-in-car-hud__item">
                            <!-- <div class="c-in-car-hud__data c-in-car-hud__data--speedometer"><InCarSpeedometerComponent /></div> -->
                        </div>
                    </div>
                </div>
                <div class="c-in-car-hud__row">
                    <div class="c-in-car-hud__items">
                        <div class="c-in-car-hud__item">
                            <div class="c-in-car-hud__data c-in-car-hud__data--session"><InCarSessionComponent /></div>
                        </div>
                        <div class="c-in-car-hud__item ">
                            <div class="c-in-car-hud__data c-in-car-hud__data--fuel"><InCarFuelComponent /></div>
                        </div>
                        <div class="c-in-car-hud__item">
                           <div class="c-in-car-hud__data c-in-car-hud__data--status"><InCarStatusComponent /></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="c-in-car-hud__float c-in-car-hud__float--br">
            <div class="c-in-car-hud__items">
                <div class="c-in-car-hud__item">
                    <div class="c-in-car-hud__data c-in-car-hud__data--mech"><InCarMechComponent /></div>
                </div>
                <div class="c-in-car-hud__item">
                    <div class="c-in-car-hud__data c-in-car-hud__data--aero"><InCarAeroComponent /></div>
                </div>
                <div class="c-in-car-hud__item">
                    <div class="c-in-car-hud__data c-in-car-hud__data--damagewear"><InCarTyreComponent /></div>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss">
.c-in-car-hud {}

.c-in-car-hud__upper,
.c-in-car-hud__lower {
    .c-in-car-hud__items {
        margin: em(-4);
    }

    .c-in-car-hud__item {
        padding: em(4);
    }
}

.c-in-car-hud__upper {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
}

.c-in-car-hud__lower {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
}

.c-in-car-hud__rows {
    margin: em(-4);
}

.c-in-car-hud__row {
    padding: em(4);
}

.c-in-car-hud__items {
    display: flex;
}

.c-in-car-hud__item {
    display: flex;
}

.c-in-car-hud__data {
    display: flex;
}

.c-in-car-hud__data--standings {
    background-color: transparent;
}

.c-in-car-hud__float {
    position: fixed;
}

.c-in-car-hud__float--tr {
    top: 0;
    right: 0;
}

.c-in-car-hud__float--br {
    bottom: 0;
    right: 0;
}

.c-in-car-hud__float--bl {
    bottom: 0;
    left: 0;
}

.c-in-car-hud__float--tl {
    top: 0;
    left: 0;
}
</style>

<script>
import InCarStandingsComponent from '../components/InCarStandingsComponent.vue';
import InCarStatusComponent from '../components/InCarStatusComponent.vue';
import InCarSpeedometerComponent from '../components/InCarSpeedometerComponent.vue';
import InCarTyreComponent from '../components/InCarTyreComponent.vue';
import InCarAeroComponent from '../components/InCarAeroComponent.vue';
import InCarMechComponent from '../components/InCarMechComponent.vue';
import InCarSessionComponent from '../components/InCarSessionComponent.vue';
import InCarFuelComponent from '../components/InCarFuelComponent.vue';

export default {
    components: {
        InCarStandingsComponent,
        InCarStatusComponent,
        InCarSpeedometerComponent,
        InCarTyreComponent,
        InCarAeroComponent,
        InCarMechComponent,
        InCarSessionComponent,
        InCarFuelComponent
    }
}
</script>
