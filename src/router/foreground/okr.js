export default {
  path: 'ForeOKR',
  component: () => import('../../views/foreground/OKR.vue'),
  children: [
    {
      path: 'OKRList',
      name: 'OKRList',
      component: () => import('../../views/foreground/okr/OKRList.vue')
    }
  ]
};
