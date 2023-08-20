<script setup>
import { ref } from 'vue';
import NavLink from '@CC/header/NavLink.vue';
import WinStack from '@C/window/template.vue';
import ColorSchemeSwitch from '@CC/header/ColorSchemeSwitch.vue';
import AuthManager, { auth } from './auth';
// Router loading animation
import { router } from '../router';
const loading = ref(false);
router.beforeEach((to, from, next) => {
    loading.value = true;
    next();
});
router.beforeResolve((to, from, next) => {
    loading.value = false;
    next();
});
</script>

<template>
    <v-header :loading="loading">
        <template #title>
            <!-- <img alt="YSYX logo" class="logo" src="@CR/logo/line.png" /> -->
            <h3 class="logo">
                Random Student
            </h3>
            <div style="flex-grow: 1"></div>
            <ColorSchemeSwitch style="margin-right: 8px" />
        </template>
        <template #nav>
            <nav-link
                to="/"
                title="Home"
            >
                <i class="fa fa-home"></i>
                Home
            </nav-link>
            <nav-link
                to="/students"
                title="Students"
            >
                <i class="fa fa-users"></i>
                Students
            </nav-link>
            <nav-link
                to="/records"
                title="Records"
            >
                <i class="fa fa-book"></i>
                Records
            </nav-link>
            <nav-link
                to="/settings"
                title="Settings"
            >
                <i class="fa fa-cog"></i>
                Settings
            </nav-link>
            <AuthManager />
        </template>
    </v-header>
    <WinStack />
    <v-body>
        <router-view v-if="(typeof auth === 'string')" />
    </v-body>
</template>
