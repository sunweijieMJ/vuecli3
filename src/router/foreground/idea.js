export default {
  path: 'fore_idea',
  name: 'ForeIdea',
  component: () => import('../../views/foreground/Idea.vue'),
  children: [
    {
      path: 'idea_list',
      name: 'IdeaList',
      component: () => import('../../views/foreground/idea/IdeaList.vue')
    },
    {
      path: 'idea_detail/:id',
      name: 'IdeaDetail',
      component: () => import('../../views/foreground/idea/IdeaDetail.vue')
    },
    {
      path: 'topic_list/:id',
      name: 'TopicList',
      component: () => import('../../views/foreground/idea/TopicList.vue')
    }
  ]
};
