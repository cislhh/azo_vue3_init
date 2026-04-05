import { createPinia } from 'pinia';
import { createApp } from 'vue';
import App from './App.vue';
import { router } from './app/router';
import './style.css';

const app = createApp(App);
app.use(createPinia());
app.use(router);
app.mount('#app');

// 类型检查测试
const testString: string = 123;
const testUndefined = undefinedVariable;
const testFunction = (a: string, b: string): number => {
    return a + b;
};
