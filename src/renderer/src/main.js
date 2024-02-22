// App
import { createApp } from 'vue';
import main from './main.vue';

// Router
import mainRouter from './router/mainRouter.js';

// Global Components
import SvgComponent from './views/components/SvgComponent.vue';

// Main CSS
import './assets/scss/_main.scss';

// Workers
import ParentWorkerMainThread from './workers/ParentWorker/ParentWorkerMainThread';

// app
const app = createApp(main);
app.use(mainRouter);
app.use(new ParentWorkerMainThread());
app.component('SvgComponent', SvgComponent);
app.mount('#main');
