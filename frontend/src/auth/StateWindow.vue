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
const component = defineComponent({
    setup() {
        const password = ref(''), err = ref(false);
        watch(password, val => {
            if (err.value?.code === 401 && val.length > 0) err.value = undefined;
        });
        return { password, err };
    }
});
// Export Window Launcher
import Win from '@win';
export const authStateWindow = Win(component, 'Application Mode', true, {});
</script>
