export default {
  path: 'fore_okr',
  component: () => import('../../views/foreground/OKR.vue'),
  children: [
    {
      path: 'okr_list',
      name: 'OKRList',
      component: () => import('../../views/foreground/okr/OKRList.vue')
    }
  ]
};
