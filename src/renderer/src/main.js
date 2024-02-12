// App
import { createApp } from 'vue';
import App from './App.vue';

// Router
import router from './router';

// Global Components
import SvgComponent from './views/components/SvgComponent.vue';

// Main CSS
import './assets/scss/_main.scss';

// Workers
import ParentWorkerMainThread from './workers/ParentWorker/ParentWorkerMainThread';

// app
const app = createApp(App);
app.use(router);
app.use(new ParentWorkerMainThread());
app.component('SvgComponent', SvgComponent);
app.mount('#app');
