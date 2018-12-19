import Vue from 'vue';
import App from './App.vue';
import router from './router/index';
import store from './store/index';

Vue.config.productionTip = false;

// 引入element
import ElementUI from 'element-ui';
Vue.use(ElementUI);

// 全局注册自定义的过滤器
import filters from './utils/filters/index';
for (let key in filters) {
  Vue.filter(key, (...val) => {
    return filters[key](...val);
  });
}

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
