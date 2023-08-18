<script setup>
import Stat from './Stat.vue';
const props = defineProps({
    stat: {
        type: Array,
        default: () => [0, 0]
    }
});
</script>

<template>
    <btn
        class="subject-entry"
        type="seamless gray"
    >
        <span class="name">
            <slot></slot>
        </span>
        <stat
            :total="stat?.[0] ?? 0"
            :credit="stat?.[1] ?? 0"
            style="width: 1.5em"
        />
    </btn>
</template>

<style lang="scss" scoped>
.subject-entry {
    --wb: 1px;
    border-radius: 5px;
    border-color: var(--cb-gray-light);

    &:hover {
        border-color: var(--cb-gray-dark) !important;
    }

    &> :deep(span) {
        width: 14em;
        display: flex;
        justify-content: space-between;
        align-items: center;
        overflow: hidden;
    }

    .name {
        width: 0;
        flex-grow: 1;
        line-height: 1.2;
        text-overflow: ellipsis;
        overflow: hidden;
        margin-right: 0.2em;
    }
}
</style>
