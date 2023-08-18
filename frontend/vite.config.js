import { defineConfig } from 'vite';
import { resolve } from 'path';
import vue from '@vitejs/plugin-vue';
const
    backendAPIs = [
        '/auth',
        '/random',
        '/students',
        '/requests',
        '/log',
    ],
    backendServer = process.env.PROXY ?? 'http://localhost:8080';
console.log('Proxy backend server', backendServer);
// https://vitejs.dev/config/
export default defineConfig({
    plugins: [vue()],
    server: {
        proxy: Object.fromEntries(
            backendAPIs.map(a => [
                a, {
                    target: backendServer,
                    ws: true,
                    changeOrigin: true
                }
            ])
        )
    },
    resolve: {
        dedupe: ['vue'],
        alias: {
            '@': resolve(__dirname),
            '@C': resolve(__dirname, './common'),
            '@CR': resolve(__dirname, './common/res'),
            '@CL': resolve(__dirname, './common/lib'),
            '@CS': resolve(__dirname, './common/store'),
            '@CC': resolve(__dirname, './common/components'),
            '@win': resolve(__dirname, './common/window'),
        },
    },
});
