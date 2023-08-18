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
        path: '/manage',
        component: () => import('./src/Manage.vue'),
        meta: { title: 'Manage | Random Picker' },
    }, {
        path: '/history',
        component: () => import('./src/History.vue'),
        meta: { title: 'History | Random Picker' },
    }, {
        path: '/:code',
        meta: {
        /**
         * @param {import('vue-router').RouteLocationNormalized} to
         * @returns {String}
         */
            title: to => `${/^\d+$/g.test(to.params.code) && to.params.code || '404'} | Random Picker`
        },
        component: () => import('./src/status.vue')
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
