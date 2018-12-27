export default {
  path: 'BackIdea',
  component: () => import('../../views/background/Idea.vue'),
  children: [
    {
      path: 'IdeaManage',
      name: 'IdeaManage',
      component: () => import('../../views/background/idea/IdeaManage.vue')
    }
  ]
};
