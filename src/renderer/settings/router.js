import { createRouter, createWebHashHistory } from 'vue-router';
import SettingsPage from '../views/pages/SettingsPage.vue';

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
                name: '/settings/'
            }
        },
        {
            path: '/settings/',
            name: '/settings/',
            component: SettingsPage,
            meta: {
                title: 'Settings'
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
