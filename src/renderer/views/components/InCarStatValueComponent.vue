<template>
    <div class="c-in-car-stat-value" :class="`${ monospace ? 'c-in-car-stat-value--monospace' : '' }`">
        <span class="c-in-car-stat-value__zerofill" v-if="zerofill">{{ zerofilled }}</span>
        <span class="c-in-car-stat-value__value" v-if="value">{{ value }}</span>
        <span class="c-in-car-stat-value__suffix" v-if="suffix">{{ suffix }}</span>
    </div>
</template>

<style lang="scss">
.c-in-car-stat-value {
    padding: 0 em(4);
    border-radius: em(4);
    white-space: nowrap;
    color: inherit;

}

.c-in-car-stat-value--monospace {
    font-family: 'firacode', monospace;

    .c-in-car-stat-value__zerofill,
    .c-in-car-stat-value__value,
    .c-in-car-stat-value__suffix {
        font-size: em(14);
        line-height: 1em;
    }
}

.c-in-car-stat-value__zerofill,
.c-in-car-stat-value__value,
.c-in-car-stat-value__suffix {
    font-size: em(14);
    line-height: 1em;
}

.c-in-car-stat-value__zerofill {
    opacity: 0.1;
}

.c-in-car-stat-value__suffix {
    opacity: 0.4;
}

</style>

<script>
export default {
    props: {
        monospace: false,
        value: null,
        suffix: null,
        zerofill: null,
    },
    computed: {
        zerofilled() {
            const valueString = `${this.value}`;
            return ('00000').substring(0, this.zerofill).slice(valueString.length);
        }
    }
}
</script>


