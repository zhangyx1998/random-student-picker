/* eslint-env node, browser */
import '@CR/global.css';
import '@CR/fa/all.min.css';
// Common components setup
import * as componentList from './common';
// Overwrite window API
import * as window_api from '@win';
Object.assign(window, window_api);
// Root App Mount
import { router } from './router';
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './src/App.vue';
const app = createApp(App).use(router).use(createPinia());
Object
    .entries(componentList)
    .forEach(([name, el]) => app.component(name, el));
app.mount('#app');
// Remove pre-load style from html element
setTimeout(
    () => window
        .document
        .querySelector('html')
        .classList
        .toggle('pre-load', false),
    0
);
