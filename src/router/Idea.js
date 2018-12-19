export default {
  path: 'Idea',
  component: () => import('../views/dashboard/Idea.vue'),
  children: [
    {
      path: 'IdeaList',
      name: 'IdeaList',
      component: () => import('../views/dashboard/idea/IdeaList.vue')
    },
    {
      path: 'IdeaDetail',
      name: 'IdeaDetail',
      component: () => import('../views/dashboard/idea/IdeaDetail.vue')
    }
  ]
};
