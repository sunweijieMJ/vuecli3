import Vue from 'vue';
import Router from 'vue-router';
Vue.use(Router);

// foreground
import ForeIdea from './foreground/idea';
import ForeOkr from './foreground/okr';
import ForeMine from './foreground/mine';
import ForeNotice from './foreground/notice';
// background
import BackIdea from './background/idea';
import BackFrame from './background/frame';
// system
import System from './system/system';

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      redirect: '/system/login'
    },
    {
      path: '/foreground',
      component: () => import('../views/Foreground.vue'),
      children: [ForeIdea, ForeOkr, ForeMine, ForeNotice]
    },
    {
      path: '/background',
      component: () => import('../views/Background.vue'),
      children: [BackFrame, BackIdea]
    },
    {
      path: '/system',
      component: () => import('../views/System.vue'),
      children: [...System]
    },
    {
      path: '*',
      component: () => import('../views/Error.vue')
    }
  ]
});
