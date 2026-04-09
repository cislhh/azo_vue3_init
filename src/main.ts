import { createApp } from 'vue';
import App from './App.vue';
import { router } from './app/router';
import { pinia, useUserStore } from './app/stores';
import './style.css';

const app = createApp(App);

useUserStore(pinia).restoreSession();

app.use(pinia);
app.use(router);
app.mount('#app');
