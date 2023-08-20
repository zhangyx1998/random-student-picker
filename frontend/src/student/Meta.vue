<template>
    <container
        class="student-meta"
        flex-column
        :pad="false"
    >
        <template
            v-for="val, key in meta"
            :key="key"
        >
            <MaskedEntry :name="key">
                {{ val }}
            </MaskedEntry>
        </template>
    </container>
</template>

<script setup>
import MaskedEntry from './MaskedEntry.vue';
defineProps({
    meta: {
        type: Object,
        default: () => ({})
    }
});
</script>

<style lang="scss" scoped>
.student-meta {
    font-size: 0.9em;
    justify-content: flex-start;
}
</style>
