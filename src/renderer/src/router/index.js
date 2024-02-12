import { createRouter, createWebHashHistory } from 'vue-router';
import HudPage from '../views/pages/HudPage.vue';

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
                name: '/hud/'
            }
        },
        {
            path: '/hud/',
            name: '/hud/',
            component: HudPage,
            meta: {
                title: 'Hud',
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
