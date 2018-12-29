export default {
  path: 'fore_mine',
  component: () => import('../../views/foreground/Mine.vue'),
  children: [
    {
      path: 'profile/:id',
      name: 'Profile',
      component: () => import('../../views/foreground/mine/Profile.vue')
    }
  ]
};
