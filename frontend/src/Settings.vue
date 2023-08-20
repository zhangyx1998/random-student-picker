<script setup>
import { alert, confirm } from '@win';
import { logout } from '@/api/app';
import { auth } from './auth/';
import { serverLogWindow } from './settings/ServerLogWindow.vue';
async function confirmLogout() {
    const ack = await confirm
        .title('Confirm logout')
        .props({ confirmColor: 'red', confirmText: 'Logout' })(
            'You are about to logout, password will be required to login again.'
        );
    if (ack) {
        const res = await logout();
        if (res === true) auth.value = undefined;
        else alert.title('Logout Error')(res);
    }
}
</script>

<template>
    <container
        flex-column
        flex-center
        content-left
        flex-grow
    >
        <h1>Settings</h1>
        <btn
            type="outlined gray"
            style="color: var(--ct-blue)"
            @click="serverLogWindow"
        >
            Server Log
        </btn>
        <btn
            type="solid red"
            @click="confirmLogout"
        >
            <i class="fa fa-sign-out-alt"></i>
            Logout
        </btn>
    </container>
</template>
