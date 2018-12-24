import Vue from 'vue';
import Router from 'vue-router';
Vue.use(Router);

// foreground
import ForeIdea from './foreground/idea';
import ForeMine from './foreground/mine';
import ForeNotice from './foreground/notice';
// background
import BackIdea from './background/idea';
// system
import System from './system/system';

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
      children: [ForeIdea, ForeMine, ForeNotice]
    },
    {
      path: '/Background',
      component: () => import('../views/Background.vue'),
      children: [BackIdea]
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
