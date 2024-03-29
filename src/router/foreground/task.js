export default {
  path: 'fore_task',
  name: 'ForeTask',
  component: () => import('../../views/foreground/Task.vue'),
  children: [
    {
      path: 'task_box',
      name: 'TaskBox',
      component: () => import('../../views/foreground/task/TaskBox.vue'),
      children: [
        {
          path: 'task_list',
          name: 'TaskList',
          component: () => import('../../views/foreground/task/TaskList.vue')
        },
        {
          path: 'report_list',
          name: 'ReportList',
          component: () => import('../../views/foreground/task/ReportList.vue')
        }
      ]
    },
    {
      path: 'task_detail/:id',
      name: 'TaskDetail',
      component: () => import('../../views/foreground/task/TaskDetail.vue')
    },
    {
      path: 'report_redact/:id?',
      name: 'ReportRedact',
      component: () => import('../../views/foreground/task/ReportRedact.vue')
    }
  ]
};
