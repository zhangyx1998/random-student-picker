<script setup>
import { onMounted } from 'vue';
import { alert } from '@win';
import NavLink from '@CC/header/NavLink.vue';
import { AlternatingDots } from '@/common';
import { checkAuthState } from '@/api/app';
import { auth } from './index.js';
onMounted(async () => {
    const res = await checkAuthState();
    if (res === 'OK') auth.value = 'SERVER';
    else auth.value = res;
});
</script>

<template>
    <nav-link
        class="auth-state"
        @click="alert.title('Mode')(auth)"
    >
        <AlternatingDots v-if="auth === undefined" />
        <template v-else-if="auth === 'SERVER'">
            <!-- Backend server mode -->
            <i class="fa fa-cloud"></i>
        </template>
        <template v-else-if="auth === 'WEBAPP'">
            <!-- Standalone WebAPP mode -->
            <i class="fa fa-desktop"></i>
        </template>
        <template v-else>
            <!-- Awaiting Authentication -->
            <i class="fa fa-lock"></i>
        </template>
    </nav-link>
</template>

<style lang="scss" scoped>
.auth-state {
    &, * {
        opacity: 1 !important;
        color: var(--c-brand) !important;
        margin: 0 !important;
    }
}
</style>
