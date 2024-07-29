import { createRouter, createWebHashHistory } from 'vue-router';
import AutoDirectorPage from '../views/pages/AutoDirectorPage.vue';

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
                name: '/autodirector/'
            }
        },
        {
            path: '/autodirector/',
            name: '/autodirector/',
            component: AutoDirectorPage,
            meta: {
                title: 'autodirector'
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
