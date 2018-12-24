export default {
  path: 'ForeMine',
  component: () => import('../../views/foreground/Mine.vue'),
  children: [
    {
      path: 'Profile',
      name: 'Profile',
      component: () => import('../../views/foreground/mine/Profile.vue')
    }
  ]
};
