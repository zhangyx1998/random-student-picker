import { defineConfig } from 'vite';
import { resolve } from 'path';
import vue from '@vitejs/plugin-vue';
function resolveProject(...args) {
    return resolve(__dirname, ...args);
}
// https://vitejs.dev/config/
export default defineConfig(({ command, mode, ssrBuild }) => {
    const
        plugins = [vue()],
        resolve = {
            dedupe: ['vue'],
            alias: {
                '@': resolveProject(),
                '@C': resolveProject('./common'),
                '@CR': resolveProject('./common/res'),
                '@CL': resolveProject('./common/lib'),
                '@CS': resolveProject('./common/store'),
                '@CC': resolveProject('./common/components'),
                '@win': resolveProject('./common/window'),
            },
        };
    if (command === 'serve') {
        const
            backendAPIs = [
                '/auth',
                '/random',
                '/student/',
                '/record/',
                '/log',
            ],
            target = process.env.PROXY ?? 'http://localhost:8080',
            proxy = Object.fromEntries(
                backendAPIs.map(a => [
                    a,
                    { target, ws: true, changeOrigin: true }
                ])
            ),
            server = { proxy };
        console.log('Proxy backend server', target);
        return { plugins, resolve, server };
    } else {
        return { plugins, resolve };
    }
});
