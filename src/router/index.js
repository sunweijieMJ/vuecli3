import Vue from 'vue';
import Router from 'vue-router';
Vue.use(Router);

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      redirect: '/home'
    },
    {
      path: '/home',
      name: 'Home',
      component: () => import('../views/Home.vue')
    },
    {
      path: '/idea',
      name: 'Idea',
      component: () => import('../views/Idea.vue')
    },
    {
      path: '/okr',
      name: 'OKR',
      component: () => import('../views/OKR.vue')
    },
    {
      path: '/message',
      name: 'Message',
      component: () => import('../views/Message.vue')
    },
    {
      path: '/mine',
      name: 'Mine',
      component: () => import('../views/Mine.vue')
    },
    {
      path: '/profile',
      name: 'Profile',
      component: () => import('../views/Profile.vue')
    },
    {
      path: '*',
      redirect: '/home'
    }
  ]
});
