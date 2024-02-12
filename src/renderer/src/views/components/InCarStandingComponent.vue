<template>
    <div class="c-in-car-standing" :status="standing.status">
        <div class="c-in-car-standing__items">
            <div class="c-in-car-standing__item c-in-car-standing__item--position">
                <div class="c-in-car-standing__position">{{ standing.mRacePosition }}</div>
            </div>
            <div class="c-in-car-standing__item c-in-car-standing__item--car">
                <div class="c-in-car-standing__car">{{ standing.mCarClassNames }}</div>
            </div>
            <div class="c-in-car-standing__item c-in-car-standing__item--name">
                <div class="c-in-car-standing__name">{{ standing.mName }}</div>
            </div>
            <div class="c-in-car-standing__item c-in-car-standing__item--distance">
                <div class="c-in-car-standing__distance">{{ standing.distance }}</div>
            </div>
        </div>
    </div>
</template>

<style lang="scss">
.c-in-car-standing {
    @include color('background-color', 'white', 0.2);

    position: relative;
    padding: em(4) em(12);
    border-radius: em(4);
    margin: 0 0 em(4);

    &[status] {
        border-bottom-left-radius: 0;
        border-bottom-right-radius: 0;

        &:after {
            content: '';
            position: absolute;
            top: 100%;
            right: 0;
            left: 0;
            height: em(4);
            border-bottom-left-radius: em(4);
            border-bottom-right-radius: em(4);
        }
    }

    &[status="hot"] {
        &:after {
            @include color('background-color', 'red', 1);
        }
    }

    &[status="out"] {
        &:after {
            @include color('background-color', 'grey', 1);
        }
    }

    &[status="racing"],
    &[status="ahead"],
    &[status="behind"] {
        &:after {
            @include color('background-color', 'green', 1);
        }
    }

    &[status="backmarker"] {
        &:after {
            @include color('background-color', 'blue', 1);
        }
    }

    &[status="leader"] {
        &:after {
            @include color('background-color', 'red', 1);
        }
    }
}

.c-in-car-standing__items {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    align-items: center;
    margin: em(-6);
}

.c-in-car-standing__item {
    padding: em(6);
    flex-grow: 0;
    flex-shrink: 0;
    flex-basis: auto;
}

.c-in-car-standing__item--position {
    flex-grow: 0;
    flex-shrink: 0;
    flex-basis: auto;
}

.c-in-car-standing__item--car {
    flex-grow: 0;
    flex-shrink: 0;
    flex-basis: auto;
}

.c-in-car-standing__item--name {
    width: 100%;
    flex-grow: 0;
    flex-shrink: 1;
    flex-basis: auto;
    overflow: hidden;
}

.c-in-car-standing__item--distance {
    flex-grow: 0;
    flex-shrink: 0;
    flex-basis: auto;
}

.c-in-car-standing__position {
    width: 2ch;
    font-size: em(22);
    line-height: 1em;
    text-align: center
}

.c-in-car-standing__car {
    @include color('background-color', 'white');
    @include color('color', 'black');

    font-size: em(16);
    line-height: 1em;
    border-radius: em(4, 20);
    padding: em(10, 20) em(8, 20);
}

.c-in-car-standing__name {
    width: 100%;
    font-size: em(16);
    line-height: 1em;
    text-align: left;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
}

.c-in-car-standing__distance {
    padding: 0 0 0 em(32);
    font-family: 'firacode', monospace;
    font-size: em(16);
    line-height: 1em;
}
</style>

<script>
export default {
    props: {
        standing: {},
    }
}
</script>
