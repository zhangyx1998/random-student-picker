<script setup>
import { useRoute } from 'vue-router';
import { computed } from 'vue';
const LUT = {
        401: 'You need to login to access this service',
        403: 'You do not have permission to access this service',
        404: 'Page not found',
        500: 'Internal server error',
    },
    route = useRoute(),
    code = computed(() =>
        /^\d+$/g.test(route.params.code) && route.params.code
        || 404
    );
</script>

<template>
    <container
        style="
            display: flex;
            flex-grow: 1;
            justify-content: center;
            align-items: center;
        "
        w1280
    >
        <div style="display: flex; align-items: left; flex-direction: column">
            <h1>{{ code }}</h1>
            <h2 v-if="code in LUT">
                {{ LUT[code] }}
            </h2>
            <span
                style="
                    display: flex;
                    flex-direction: row;
                    justify-content: flex-start;
                    margin: 1em 0;
                "
            >
                <btn
                    style="font-size: 1.2rem"
                    type="gray brand"
                    to="/"
                >← BACK TO HOME</btn>
            </span>
        </div>
    </container>
</template>

<style scoped>
* {
  display: block;
  color: var(--ct-gray-light);
}
h1 {
  font-size: 8rem;
}
h2 {
  font-size: 2rem;
}
</style>
