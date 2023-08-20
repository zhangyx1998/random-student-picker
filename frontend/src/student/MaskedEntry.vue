<script setup>
import { ref } from 'vue';
const props = defineProps({
    name: {
        type: String,
        default: ''
    }
});
const toggle = ref(false);
</script>

<template>
    <div class="masked-entry">
        <div class="name">
            {{ name }}
        </div>
        <div class="mono value">
            <span v-if="toggle">
                <slot></slot>
            </span>
            <span
                v-else
                style="user-select: none; opacity: 0.8;"
            >********</span>
        </div>
        <btn
            class="button"
            type="seamless gray compact"
        >
            <i
                :class="['fa', toggle ? 'fa-eye' : 'fa-eye-slash']"
                @click="toggle = !toggle"
            ></i>
        </btn>
    </div>
</template>

<style scoped lang="scss">
.masked-entry {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 0 0.5em;
    &:hover,
    &:active {
        transition-duration: .3s;
        transition-property: background-color;
        background-color: var(--cf-next-level);
        outline: 2px solid var(--cb-gray-light);
    }

    * {
        margin: 0.1em 0;
    }

    .name {
        font-size: 0.9em;
        user-select: none;
        font-weight: bold;
        min-width: 4em;
        text-align: right;
    }

    .value {
        width: 0;
        flex-grow: 1;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        margin: 0 1em;
    }

    .button {
        width: 2em;
        height: 100%;
        padding: 0.2em;
        margin: 0;
        border-radius: 0;
    }
}</style>
