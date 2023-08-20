import { ref, watch } from 'vue';
import { alert } from '@win';
import AuthManager from './AuthManager.vue';
import { loginWindow } from './LoginWindow.vue';

export const auth = ref(undefined);

watch(auth, async (val, prev) => {
    if (val instanceof Error) {
        if (val?.code === 401) {
            await loginWindow();
            auth.value = 'SERVER';
        } else {
            alert.title('Error')(val?.toString());
        }
    } else if (val === undefined && prev === 'SERVER') {
        await loginWindow();
        auth.value = 'SERVER';
    }
});
// The component to be included in navbar
export default AuthManager;
