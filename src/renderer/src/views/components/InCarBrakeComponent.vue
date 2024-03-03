<template>
    <div class="c-in-car-brake" :align="align">
        <div class="c-in-car-brake__icon">
            <SvgComponent svg="icon--brake" :flipX="flipX" :flipY="flipY" />
        </div>
        <div class="c-in-car-brake__meter">
            <InCarLevelComponent :align="align" :value="damage" :status="status" />
        </div>
    </div>
</template>

<style lang="scss">
    .c-in-car-brake {
        display: flex;
        flex-direction: row;
        align-items: center;

        &[align="right"] {
            .c-in-car-brake__meter {
                order: 1;
            }

            .c-in-car-brake__icon {
                order: 2;
                margin: 0 0 0 em(8) ;
            }
        }
    }

    .c-in-car-brake__icon {
        width: em(12);
        margin: 0 em(8) 0 0;
    }
</style>

<script>
import InCarLevelComponent from './InCarLevelComponent.vue';

export default {
    props: {
        position: null,
        damage: null,
        status: null,
    },
    components: {
        InCarLevelComponent
    },
    computed: {
        align() { 
            if (this.position == 1 || this.position == 3) {
                return 'right';
            }

            return 'left';
        },
        flipX() {
            if (this.position == 1 || this.position == 3) {
                return true;
            }

            return false;
        },
        flipY() { 
            if (this.position == 2 || this.position == 3) {
                return true;
            }

            return false;
        }
    }
}
</script>