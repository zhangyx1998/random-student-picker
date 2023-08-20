<script setup>
import { computed } from 'vue';
const props = defineProps({
    total: {
        type: Number,
        default: 0
    },
    credit: {
        type: Number,
        default: 0
    },
    skipped: {
        type: Number,
        default: 0
    },
    button: {
        type: Boolean,
        default: false
    }
});
const
    RADIUS = 18,
    WIDTH = 4,
    viewBox = computed(() => {
        const size = RADIUS * 2 + WIDTH;
        return `0 0 ${size} ${size}`;
    }),
    C = RADIUS + WIDTH / 2;
function circleStyle(value, total, offset = 0) {
    total = total > 0 ? total : 1;
    value /= total;
    offset /= total;
    return {
        strokeDasharray: `${value} ${1 - value}`,
        strokeDashoffset: offset + 0.25,
    };
}
</script>

<template>
    <svg
        :viewBox="viewBox"
        :class="{ button }"
    >
        <circle
            pathLength="1"
            class="total"
            :r="RADIUS"
            :cx="C"
            :cy="C"
        />
        <circle
            pathLength="1"
            class="credit"
            :r="RADIUS"
            :cx="C"
            :cy="C"
            :style="circleStyle(credit, total)"
        />
        <circle
            pathLength="1"
            class="skipped"
            :r="RADIUS"
            :cx="C"
            :cy="C"
            :style="circleStyle(skipped, total, credit)"
        />
        <text
            monospace
            dominant-baseline="central"
            x="50%"
            y="50%"
        >{{ total }}</text>
    </svg>
</template>

<style lang="scss" scoped>
svg {
    fill: var(--ct);
    color: var(--ct);
    user-select: none;

    &.button {
        cursor: pointer;
        &:hover {
            transform: scale(1.1);
            box-shadow: 0 0 5px var(--ct);
        }
    }

    circle {
        fill: none;
        stroke-width: 4;
        stroke-linecap: none;
        stroke-linejoin: none;

        &.total {
            stroke: var(--cb-gray);
        }

        &.credit {
            stroke: var(--cb-green);
            /* You can change this to any color you like for the credit segment */
        }

        &.skipped {
            stroke: var(--cb-red);
            /* You can change this to any color you like for the skipped segment */
        }
    }

    text {
        font-size: 24px;
        text-anchor: middle;
    }
}
</style>
