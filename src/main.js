import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
// import MessageBox from 'components/messagebox';
import 'assets/css/index.scss';
import { resizeRem } from 'util';
resizeRem();
// Vue.prototype.$comfirm = MessageBox.confirm;
Vue.config.productionTip = false;

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app');
