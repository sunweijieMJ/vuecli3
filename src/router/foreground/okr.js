export default {
  path: 'fore_okr',
  name: 'ForeOkr',
  component: () => import('../../views/foreground/OKR.vue'),
  children: [
    {
      path: 'list',
      component: () => import('../../views/foreground/okr/List.vue'),
      children: [
        {
          path: 'okr_list',
          name: 'OKRList',
          component: () => import('../../views/foreground/okr/list/OKRList.vue')
        },
        {
          path: 'task_list',
          name: 'TaskList',
          component: () => import('../../views/foreground/okr/list/TaskList.vue')
        }
      ]
    },
    {
      path: 'okr_detail/:id',
      name: 'OKRDetail',
      component: () => import('../../views/foreground/okr/OKRDetail.vue')
    }
  ]
};
