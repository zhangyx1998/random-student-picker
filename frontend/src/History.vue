<script setup>
import { serverLog } from './components/ServerLog.vue';
</script>

<template>
    <container
        flex-column
        flex-center
        content-center
        flex-grow
    >
        <h1>HISTORY</h1>
        <btn
            type="link"
            style="color: var(--ct-blue)"
            @click="serverLog"
        >
            Server Log
        </btn>
    </container>
</template>
