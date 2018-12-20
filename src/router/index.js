import Vue from 'vue';
import Router from 'vue-router';
Vue.use(Router);

// 引入二级路由
import Idea from './Idea';
import Mine from './Mine';

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      redirect: '/Foreground/Idea/IdeaList'
    },
    {
      path: '/Foreground',
      component: () => import('../views/Foreground.vue'),
      children: [Idea, Mine]
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
