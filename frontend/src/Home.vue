<script setup>
import { onMounted, ref } from 'vue';
import { alert } from '@win';
import { recordWindow } from './record/Window.vue';
import { createRandomRecord } from '@/api/record';
const flag_active = ref(false);

async function show(token) {
    // Set hash to current token
    if (!location.hash || location.hash.slice(1) !== token) {
        location.hash = token;
    }
    // Show RandResult
    const regenerate = await recordWindow(token, true);
    // Clear hash
    location.hash = '';
    // Unset flag_active
    await new Promise(res => setTimeout(res, 600));
    flag_active.value = false;
    // Regenerate if needed
    if (regenerate) {
        setTimeout(click, 10);
    }
}

async function click() {
    if (flag_active.value) return;
    flag_active.value = true;
    await new Promise(res => setTimeout(res, 1200));
    const res = await createRandomRecord();
    if (res instanceof Error) {
        alert.title('Error')(res);
    } else {
        await show(res);
    }
}

onMounted(() => {
    if (location.hash) {
        flag_active.value = true;
        show(location.hash.slice(1));
    }
});
</script>

<template>
    <container
        flex-column
        flex-center
        content-center
        flex-grow
    >
        <btn
            :type="flag_active ? 'solid gray' : 'solid green'"
            style="width: 6em; height: 6em; border-radius: 3em; font-size: 6vh;"
            :class="{ loading: flag_active }"
            @click="click"
        >
            <svg
                class="icon-refresh"
                xmlns="http://www.w3.org/2000/svg"
                version="1.1"
                y="0px"
                x="0px"
                viewBox="0 0 65 65"
            >
                <g>
                    <path
                        d="m32.5 4.999c-5.405 0-10.444 1.577-14.699 4.282l-5.75-5.75v16.11h16.11l-6.395-6.395c3.18-1.787 6.834-2.82 10.734-2.82 12.171 0 22.073 9.902 22.073 22.074 0 2.899-0.577 5.664-1.599 8.202l4.738 2.762c1.47-3.363 2.288-7.068 2.288-10.964 0-15.164-12.337-27.501-27.5-27.501z"
                    />
                    <path
                        d="m43.227 51.746c-3.179 1.786-6.826 2.827-10.726 2.827-12.171 0-22.073-9.902-22.073-22.073 0-2.739 0.524-5.35 1.439-7.771l-4.731-2.851c-1.375 3.271-2.136 6.858-2.136 10.622 0 15.164 12.336 27.5 27.5 27.5 5.406 0 10.434-1.584 14.691-4.289l5.758 5.759v-16.112h-16.111l6.389 6.388z"
                    />
                </g>
            </svg>
            <span style="font-weight: bolder; z-index: 1; color: var(--ct)">RANDOM</span>
        </btn>
    </container>
</template>

<style scoped lang="scss">
@keyframes arrow-rotate {
    0% {
        transform: rotate(15deg);
    }

    100% {
        transform: rotate(calc(360deg * -5 + 15deg));
    }
}

.loading {
    .icon-refresh {
        animation-name: arrow-rotate;
        animation-duration: 3s;
        animation-timing-function: ease-in;
        transform: rotate(15deg);
    }
}

.icon-refresh {
    position: absolute;
    z-index: -1;
    --margin: 5%;
    top: var(--margin);
    left: var(--margin);
    width: calc(100% - 2 * var(--margin));
    height: calc(100% - 2 * var(--margin));
    pointer-events: none;

    g {
        fill: rgba(0, 0, 0, 25%);
    }
}

:deep([button]) {
    &:hover .icon-refresh {
        transition-duration: .4s !important;
        transform: rotate(15deg);
    }
}
</style>
