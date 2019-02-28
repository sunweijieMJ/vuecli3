export default {
  path: 'fore_task',
  name: 'ForeTask',
  component: () => import('../../views/foreground/Task.vue'),
  children: [
    {
      path: 'task_list',
      name: 'TaskList',
      component: () => import('../../views/foreground/task/TaskList.vue')
    },
    {
      path: 'task_detail/:id',
      name: 'TaskDetail',
      component: () => import('../../views/foreground/task/TaskDetail.vue')
    },
    {
      path: 'task_logs/:id',
      name: 'TaskLogs',
      component: () => import('../../views/foreground/task/TaskLogs.vue')
    }
  ]
};
