import Vue from 'vue';
import Router from 'vue-router';
Vue.use(Router);

// 引入二级路由
import Idea from './Idea';
import Mine from './Mine';
import Notice from './Notice';
import System from './System';

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      redirect: '/System/InitPage'
    },
    {
      path: '/Foreground',
      component: () => import('../views/Foreground.vue'),
      children: [Idea, Mine, Notice]
    },
    {
      path: '/Background',
      component: () => import('../views/Background.vue'),
      children: []
    },
    {
      path: '/System',
      component: () => import('../views/System.vue'),
      children: [...System]
    },
    {
      path: '*',
      component: () => import('../views/Error.vue')
    }
  ]
});
