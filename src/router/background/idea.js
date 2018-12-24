export default {
  path: 'BackIdea',
  component: () => import('../../views/background/Idea.vue'),
  children: [
    {
      path: 'IdeaListManage',
      name: 'IdeaListManage',
      component: () => import('../../views/background/idea/IdeaListManage.vue')
    }
  ]
};
