import { ref, watch } from 'vue';
import { alert } from '@win';
import AuthManager from './AuthManager.vue';
import { login } from './LoginPrompt.vue';

export const auth = ref(undefined);

watch(auth, async (val, prev) => {
    if (val instanceof Error) {
        if (val?.code === 401) {
            await login();
            auth.value = 'SERVER';
        } else {
            alert.title('Error')(val?.toString());
        }
    } else if (val === undefined && prev === 'SERVER') {
        await login();
        auth.value = 'SERVER';
    }
});

export default AuthManager;
