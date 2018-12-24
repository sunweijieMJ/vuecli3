export default {
  path: 'ForeNotice',
  component: () => import('../../views/foreground/Notice.vue'),
  children: [
    {
      path: 'NewsList',
      name: 'NewsList',
      component: () => import('../../views/foreground/notice/NewsList.vue')
    }
  ]
};
