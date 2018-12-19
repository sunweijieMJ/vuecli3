import Vue from 'vue';
import Router from 'vue-router';
Vue.use(Router);

// 引入二级路由
import Idea from './Idea';

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      redirect: '/DashBoard/Idea/IdeaList'
    },
    {
      path: '/DashBoard',
      component: () => import('../views/DashBoard.vue'),
      children: [Idea]
    },
    {
      path: '/System',
      component: () => import('../views/System.vue'),
      children: []
    },
    {
      path: '*',
      component: () => import('../views/Error.vue')
    }
  ]
});
