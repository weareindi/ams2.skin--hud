import { createRouter, createWebHashHistory } from 'vue-router';
import DirectorPage from '../views/pages/DirectorPage.vue';

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
                name: '/director/'
            }
        },
        {
            path: '/director/',
            name: '/director/',
            component: DirectorPage,
            meta: {
                title: 'director'
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
