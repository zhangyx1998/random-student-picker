<script setup>
import { computed } from 'vue';
const
    props = defineProps({
        name: {
            type: String,
            default: ''
        },
        bold: {
            type: Number,
            default: 0
        }
    }),
    segments = computed(() => {
        const
            name = props.name || '------',
            segments = name
                .replace(',', ' ')
                .split(' ')
                .map(s => s.trim())
                .filter(s => !!s);
        segments.reverse();
        return segments;
    });
function style(n) {
    return {
        display: 'inline-block',
        fontWeight: n < props.bold ? 'bold' : undefined,
        'margin-left': n > 0 ? '0.2em' : undefined
    };
}
</script>

<template>
    <span>
        <template
            v-for="seg, i in segments"
            :key="i"
        >
            <span
                class="segment"
                :style="style(i)"
            >
                {{ seg }}
            </span>
        </template>
    </span>
</template>
