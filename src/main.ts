import { createApp } from 'vue'
import { i18n } from './i18n/i18n';
import router from './router';
import App from './App.vue'

import './assets/css/base.less';
import './assets/css/antd.less';

if (import.meta.env.MODE === 'development') {
  import('./modules/index/mocks/index');
}

const app = createApp(App);

app.use(i18n);
app.use(router);
app.mount('#app');
