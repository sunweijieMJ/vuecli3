export default {
  path: 'Idea',
  component: () => import('../views/foreground/Idea.vue'),
  children: [
    {
      path: 'IdeaList',
      name: 'IdeaList',
      component: () => import('../views/foreground/idea/IdeaList.vue')
    },
    {
      path: 'IdeaDetail/:id',
      name: 'IdeaDetail',
      component: () => import('../views/foreground/idea/IdeaDetail.vue')
    },
    {
      path: 'NewsList',
      name: 'NewsList',
      component: () => import('../views/foreground/idea/NewsList.vue')
    }
  ]
};
