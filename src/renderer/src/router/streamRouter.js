import { createRouter, createWebHashHistory } from 'vue-router';
import StreamPage from '../views/pages/StreamPage.vue';

// preapre the router
const router = createRouter({
    history: createWebHashHistory(),
    routes: []
});

// add dynamic routes when store (pinia) is ready
router.isReady().then(() => {
    // main routes
    const routes = [
        {
            path: '/',
            name: '/',
            redirect: {
                name: '/stream/'
            }
        },
        {
            path: '/stream/',
            name: '/stream/',
            component: StreamPage,
            meta: {
                title: 'Stream',
                depth: 1,
                animate: false,
            },
        }
    ]

    routes.forEach((route) => {
        router.addRoute(route);
    });

    // now the dynamic routes are applied, reload current route
    router.replace(router.currentRoute);
});

export default router;
