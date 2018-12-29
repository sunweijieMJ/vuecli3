export default {
  path: 'back_idea',
  component: () => import('../../views/background/Idea.vue'),
  children: [
    {
      path: 'idea_manage',
      name: 'IdeaManage',
      component: () => import('../../views/background/idea/IdeaManage.vue')
    }
  ]
};
