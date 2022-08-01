import { createApp } from 'vue';
import router from './router';
import App from './App.vue';
import http from '@/http'

import LoginService from './services/LoginService';

import 'admin-lte/dist/css/adminlte.min.css';
import 'admin-lte/plugins/fontawesome-free/css/all.min.css';
import 'admin-lte/plugins/jquery/jquery.js';
import 'admin-lte/plugins/bootstrap/js/bootstrap.bundle.min.js';
import 'admin-lte/dist/js/adminlte.min.js';

const app = createApp(App)
app.use(router)

app.config.globalProperties.$http = http;

const loginService = new LoginService(http);

app.config.globalProperties.$loginService = loginService;


app.mount('#app');
