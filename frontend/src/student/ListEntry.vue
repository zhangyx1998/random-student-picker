<script setup>
import Stat from './Stat.vue';
import { viewStudent } from './Prompt.vue';
const
    props = defineProps({
        sid: {
            type: String,
            default: ''
        },
        stat: {
            type: Array,
            default: undefined
        }
    }),
    emit = defineEmits(['updated']);

</script>

<template>
    <btn
        class="student-entry"
        type="seamless gray"
        @click="viewStudent(sid).then(() => emit('updated'))"
    >
        <span class="name">
            <slot></slot>
        </span>
        <stat
            :total="stat?.[0] ?? 0"
            :credit="stat?.[1] ?? 0"
            style="width: 1.5em"
            :style="{ opacity: stat ? 1 : 0 }"
        />
    </btn>
</template>

<style lang="scss" scoped>
.student-entry {
    --wb: 1px;
    border-radius: 5px;
    border-color: var(--cb-gray-light);
    flex-grow: 1;

    &:hover {
        border-color: var(--cb-gray-dark) !important;
    }

    &> :deep(span) {
        min-width: 14em;
        flex-grow: 1;
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
