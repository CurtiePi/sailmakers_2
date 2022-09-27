import { createApp } from 'vue';
import vSelect from 'vue-select';
import 'vue-select/dist/vue-select.css';
import App from './App.vue';
import router from './router';
import store from './store/index';

import 'devextreme/dist/css/dx.light.css';
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap"

createApp(App)
    .component('v-select', vSelect)
    .use(router)
    .use(store)
    .mount('#app')

