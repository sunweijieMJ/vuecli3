export default {
  path: 'BackFrame',
  component: () => import('../../views/background/Frame.vue'),
  children: [
    {
      path: 'FrameManage',
      name: 'FrameManage',
      component: () => import('../../views/background/frame/FrameManage.vue')
    }
  ]
};
