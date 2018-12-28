export default {
  path: 'ForeIdea',
  component: () => import('../../views/foreground/Idea.vue'),
  children: [
    {
      path: 'IdeaList',
      name: 'IdeaList',
      component: () => import('../../views/foreground/idea/IdeaList.vue')
    },
    {
      path: 'IdeaDetail/:id',
      name: 'IdeaDetail',
      component: () => import('../../views/foreground/idea/IdeaDetail.vue')
    },
    {
      path: 'TopicList/:id',
      name: 'TopicList',
      component: () => import('../../views/foreground/idea/TopicList.vue')
    }
  ]
};
