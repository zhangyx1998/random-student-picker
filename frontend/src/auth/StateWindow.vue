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
export default defineComponent({
    setup() {
        const password = ref(''), err = ref(false);
        watch(password, val => {
            if (err.value?.code === 401 && val.length > 0) err.value = undefined;
        });
        return { password, err };
    }
});
</script>
