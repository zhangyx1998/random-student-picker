<script>
import { ref } from 'vue';
export const auth = ref(undefined);
</script>

<script setup>
import { onMounted, watch } from 'vue';
import NavLink from '@CC/header/NavLink.vue';
import { ChasingCircle } from '@CC';
import { checkAuthState } from '@/src/api';
import { alert, confirm } from '@win';
import { login } from './Login.vue';
import { logout } from '@/src/api';
watch(auth, async val => {
    if (val instanceof Error) {
        if (val?.code === 401) {
            await login();
            auth.value = 'OK';
        } else {
            alert.title('Error')(val?.toString());
        }
    }
});
onMounted(async () => {
    auth.value = await checkAuthState();
});
async function confirmLogout() {
    const ack = await confirm
        .title('Confirm logout')
        .props({ confirmColor: 'red', confirmText: 'Logout' })(
            'You are about to logout, password will be required to login again.'
        );
    if (ack) {
        const res = await logout();
        // eslint-disable-next-line no-self-assign
        if (res === true) location.href = location.href;
        else alert.title('Logout Error')(res);
    }
}
</script>

<template>
    <nav-link v-if="auth === undefined">
        <ChasingCircle />
    </nav-link>
    <!-- Server Mode -->
    <nav-link
        v-else-if="auth === 'OK'"
        title="Logout"
        @click="confirmLogout"
    >
        <i class="fa fa-sign-out-alt"></i>
        Logout
    </nav-link>
    <!-- WEBAPP Mode -->
    <nav-link v-else-if="auth === 'WEBAPP'">
        <i class="fa fa-shield"></i>
        WebApp Mode
    </nav-link>
    <!-- Pending Authenticate -->
    <nav-link v-else>
        <i class="fa fa-lock"></i>
    </nav-link>
</template>
