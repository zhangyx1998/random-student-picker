import { createRouter, createWebHistory } from 'vue-router';
// Compose the router
/**
 * @type {import('vue-router').RouteRecordRaw[]}
 */
export const routes = [
    {
        path: '/',
        component: () => import('./src/Home.vue'),
        meta: { title: 'Random Picker' },
    }, {
        path: '/students',
        component: () => import('./src/Students.vue'),
        meta: { title: 'Students | Random Picker' },
    }, {
        path: '/records',
        component: () => import('./src/Records.vue'),
        meta: { title: 'Records | Random Picker' },
    }, {
        path: '/settings',
        component: () => import('./src/Settings.vue'),
        meta: { title: 'Settings | Random Picker' },
    }, {
        path: '/:code',
        meta: {
        /**
         * @param {import('vue-router').RouteLocationNormalized} to
         * @returns {String}
         */
            title: to => `${/^\d+$/g.test(to.params.code) && to.params.code || '404'} | Random Picker`
        },
        component: () => import('./src/Status.vue')
    }
];

export const router = createRouter({
    history: createWebHistory(),
    routes
});

router.afterEach(to => {
    const title = to?.meta?.title;
    if (typeof title === 'string') document.title = title;
    else if (typeof title === 'function') document.title = title(to);
});
