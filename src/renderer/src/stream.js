// App
import { createApp } from 'vue';
import stream from './stream.vue';

// Router
import router from './router/streamRouter.js';

// Global Components
import SvgComponent from './views/components/SvgComponent.vue';

// Main CSS
import './assets/scss/_main.scss';

// app
const app = createApp(stream);
app.use(router);
app.component('SvgComponent', SvgComponent);
app.mount('#stream');
