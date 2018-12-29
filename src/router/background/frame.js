export default {
  path: 'back_frame',
  component: () => import('../../views/background/Frame.vue'),
  children: [
    {
      path: 'frame_manage',
      name: 'FrameManage',
      component: () => import('../../views/background/frame/FrameManage.vue')
    }
  ]
};
