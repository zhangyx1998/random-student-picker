<template>
    <container
        flex-column
        content-center
        frame-prompt
        :pad="false"
    >
        <div><i class="fa fa-shield-halved"></i></div>
    </container>
</template>

<script>
import { defineComponent, ref, watch } from 'vue';
import Win from '@win';
const component = defineComponent({
    setup(mode = 'SERVER') {
        const password = ref(''), err = ref(false);
        watch(password, val => {
            if (err.value?.code === 401 && val.length > 0) err.value = undefined;
        });
        return { password, err };
    }
});
export default component;
// Export functional API
export const login = Win(component, 'Login Required', false, {});
</script>
