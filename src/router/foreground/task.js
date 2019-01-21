export default {
  path: 'fore_task',
  component: () => import('../../views/foreground/Task.vue'),
  children: [
    {
      path: 'task_detail/:id',
      name: 'TaskDetail',
      component: () => import('../../views/foreground/task/TaskDetail.vue')
    }
  ]
};
