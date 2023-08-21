import { ref, watch } from 'vue';
import Win, { alert } from '@win';
import AuthManager from './AuthManager.vue';
import LoginWindow from './LoginWindow.vue';
import StateWindow from './StateWindow.vue';

export const
    auth = ref(undefined),
    loginWindow = Win(LoginWindow, 'Login Required', false, {}),
    stateWindow = Win(StateWindow, 'Application Mode', true, {});

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
