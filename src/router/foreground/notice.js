export default {
  path: 'fore_notice',
  component: () => import('../../views/foreground/Notice.vue'),
  children: [
    {
      path: 'news_list',
      name: 'NewsList',
      component: () => import('../../views/foreground/notice/NewsList.vue')
    },
    {
      path: 'log_list',
      name: 'LogList',
      component: () => import('../../views/foreground/notice/LogList.vue')
    }
  ]
};
