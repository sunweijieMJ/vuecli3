import Vue from 'vue';
import Router from 'vue-router';
Vue.use(Router);

// 引入二级路由
import Idea from './Idea';
import Mine from './Mine';
import notice from './notice';

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'initPage',
      redirect: 'InitPage'
    },
    {
      path: 'init',
      name: 'Init',
      component: resolve => require(['../views/Init'], resolve),
      meta: {
        pageTitle: '',
        requireAuth: false
      },
      children: [
        {
          path: '/initPage',
          name: 'InitPage',
          component: resolve => require(['../views/init/InitPage'], resolve),
          meta: {
            pageTitle: '登录',
            requireAuth: false
          }
        }
      ]
    },
    {
      path: '/Foreground',
      component: () => import('../views/Foreground.vue'),
      children: [Idea, Mine, notice]
    },
    {
      path: '/Background',
      component: () => import('../views/Background.vue'),
      children: []
    },
    {
      path: '*',
      component: () => import('../views/Error.vue')
    }
  ]
});
