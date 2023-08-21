<script setup>
import { computed } from 'vue';
import { recordWindow } from '.';
import StudentName from '../student/Name.vue';
const
    props = defineProps({
        name: {
            type: String,
            default: ''
        },
        credited: {
            type: Boolean,
            default: false
        },
        manual: {
            type: Boolean,
            default: false
        },
        timestamp: {
            type: Number,
            default: 0
        },
        token: {
            type: String,
            default: ''
        }
    }),
    emit = defineEmits(['updated']),
    title = computed(() => props.manual
        ? 'Manual Pick Record'
        : 'Random Pick Record'
    ),
    time12 = computed(() => {
        const result = new Date(props.timestamp).toLocaleTimeString(
            'en-us',
            { hour12: true, hour: 'numeric', minute: 'numeric' }
        );
        return result.replace(' ', '').padStart(7, '0');
    });

async function click() {
    await recordWindow.title(title.value)(props.token);
    emit('updated');
}
</script>

<template>
    <container
        responsive
        class="record-entry"
        :class="{ credited }"
        :pad="false"
        @click="click"
    >
        <div class="hang-border"></div>
        <i class="fa fa-award"></i>
        <student-name
            style="flex-grow: 1;"
            :name="name"
            :bold="1"
        />
        <div
            v-if="manual"
            monospace
            class="badge"
        >
            Manual Pick
        </div>
        <div
            monospace
            style="font-size: 0.8em; user-select: none;"
        >
            {{ time12 }}
        </div>
    </container>
</template>

<style lang="scss" scoped>
i.fa-award {
    font-size: 1.2em;
    -webkit-text-stroke-width: 1px;
    transition-duration: 1s !important;
    .credited & {
        color: var(--c-brand);
        -webkit-text-stroke-color: var(--cf-blue);
    }
    -webkit-text-stroke: 3px transparent;
    color: var(--ct-gray-light);
}

.record-entry {
    flex-grow: 1;
    font-size: 1.4em;
    padding: 0.5em;
    display: flex;
    justify-content: center;
    border-radius: 5px;
    margin-left: 16px;
    overflow: visible !important;
    position: relative;
    color: var(--ct-gray-dark);
    .hang-border {
        position: absolute;
        top: 0;
        left: -16px;
        width: 5px;
        height: 100%;
        background-color: var(--cb-gray);
    }
    &:hover .hang-border {
        background-color: var(--ct-gray-dark);
    }

    & > :not(:last-child) {
        margin-right: 1rem;
    }

    z-index: 0;
    transition: all .2s ease-out;
    outline: 1px solid transparent;
    &:hover {
        outline: 1px solid var(--ct-gray);
        z-index: 1;
        color: var(--ct);
        box-shadow: 0 0 5px var(--c-box-shadow);
        background-color: var(--cf-next-next-level);
    }

    & > .badge {
        color: var(--c-brand-contrast);
        padding: 0.2em 0.5em;
        height: 1.5em;
        flex-shrink: 1;
        user-select: none;
        font-size: 0.6em;
        font-weight: bold;
        border-radius: 5px;
        background-color:var(--cf-gray);
        outline: 1px solid var(--cb-gray);
    }
}
</style>
