/**
 * API 相关配置文件
 * API URL Dict api 字典
 */

const urlDict = {
  'System': {
    'GlobalInfo': '/config/global', // ETC 全局变量
    'UploadImg': '/com/upload', // ETC 图片上传
    'UserAction': '/user_action_log?app=pgs-lanehub' // ETC 数据埋点
  },
  'User': {
    'UserLogin': '/user/login', // ETC 用户登录
    'UserDetail': '/user/detail', // ETC 用户详情
    'UserUpdate': '/user/update', // ETC 用户信息更新
    'UserList': '/user/list', // ETC 用户列表
    'UserPass': '/user/initpwd', // ETC 密码获取
    'UserByName': '/user/getusersbyname', // ETC 用户名获取用户信息
    'PartList': '/org/departmentlist', // ETC 获取所有部门数据
    'StaffsByDep': '/org/getstaffsbydep' // ETC 根据部门ID获取对应员工信息
  },
  'Notice': {
    'MessageList': '/com/messagelist', // ETC 消息列表
    'MessagePush': '/com/messagepush', // ETC 推送消息
    'MessageUnread': '/com/unreadmessagecnt', // ETC 未读信息总数
    'LogList': '/com/loglist', // ETC 日志列表
    'TodoList': '/com/todolist' // ETC ETC 未读消息数
  },
  'Idea': {
    'IdeaPublish': '/thinks/publish', // ETC 发布信息
    'IdeaList': '/thinks/list', // ETC 想法列表
    'IdeaDetail': '/thinks/detail', // ETC 想法详情
    'PubishComment': '/thinks/publishcomment', // ETC 发布评论
    'CommentList': '/thinks/commentlist', // ETC 评论列表
    'TopicList': '/thinks/topiclist', // ETC 话题列表
    'IdeaView': '/thinks/thinksview', // ETC 单页浏览量
    'ThumpList': '/thinks/zanlist', // ETC 点赞用户列表
    'IdeaThump': '/thinks/thinkszan', // ETC 想法点赞
    'CommentThump': '/thinks/commentzan', // ETC 评论点赞
    'TopicByTitle': '/thinks/gettopicbytitle', // ETC 话题title获取话题信息
    'IdeaDelete': '/crules/thinks/setdel', // ETC 删除想法
    'IdeaStick': '/crules/thinks/setistop', // ETC 设置为置顶，或取消
    'StickOrder': '/crules/thinks/settoporder', // ETC 置顶列表排序
    'SelfIdeaDelete': '/thinks/delthinks', // ETC 删除自己的想法
    'SelfCommentDelete': '/thinks/delcomments' // ETC 删除自己的评论
  },
  'Okr': {
    'CreateOkr': '/okr/okr/create', // ETC 创建OKR
    'UpdateOkr': '/okr/okr/update', // ETC 编辑OKR
    'BasicInfo': '/okr/okr/basicinfo', // ETC okr 基础信息
    'KeyResultList': '/okr/kr/list', // ETC okr keyresult 列表
    'KeyTaskList': '/okr/task/list', // ETC okr keytask列表
    'SimpleList': '/okr/okr/simplelist', // ETC 获取okr简洁版列表
    'DeleteKrFromOkr': '/okr/okr/delkr', // ETC 删除 OKR 关联 KR
    'DeleteUserFromOkr': '/okr/okr/deluser', // ETC 删除 OKR 关联 User
    'KindList': '/okr/okr/typelist', // ETC okr type
    'OkrList': '/okr/okr/list', // ETC okr list
    'Description': '/okr/okr/updatecolumns', // ETC okr描述
    'OkrDynamic': 'okr/okr/progresslist', // ETC okr动态
    'DeleteOkr': '/okr/okr/delokr' // ETC okr删除
  },
  'Task': {
    'CreateTask': '/okr/task/create', // ETC 创建Task
    'UpdateTask': '/okr/task/update', // ETC 编辑Task
    'BasicInfo': '/okr/task/basicinfo', // ETC 获取task 基础信息
    'DeleteUserFromTask': '/okr/task/deluser', // ETC 删除 task 关联 user
    'OkrKeyTask': '/okr/task/list', // ETC okr keytask列表 关联task列表
    'Taskdynamic': '/okr/task/progresslist', // ETC task动态
    'TaskList': '/okr/task/categorylist', // ETC task list
    'TaskCheck': '/okr/task/check', // ETC check task 任务
    'TaskFinish': '/okr/task/finish', // ETC finish task 任务
    'TaskClose': '/okr/task/close', // ETC 关闭 task 任务
    'TaskFeedback': '/okr/task/feedback', // ETC task feedback
    'GroupList': 'okr/task/grouplist' // ETC okr/task聚合
  },
  'Report': {
    'PublishReport': '/report/weeklywork/publish', // ETC 发布周报
    'ReportList': '/report/weeklywork/list', // ETC 周报列表
    'ReportDetail': '/report/weeklywork/detail', // ETC 周报详细信息
    'DefaultUsers': '/user/weekly/defaultusers', // ETC 周报默认接收人
    'WeeklyKtList': '/report/weeklywork/worklist', // ETC 周工作task列表
    'PublishFeedBack': '/report/weeklywork/publishfeedback', // ETC 发布周报反馈
    'ReportUnread': 'report/weeklywork/waitread' // ETC 是否有未读周报
  }
};

const getUrl = (biz, UrlName) => {
  try {
    if (!biz || !UrlName) {
      throw new Error('getUrl Must input Biz And UrlName');
    }
    let bizKeys = Object.keys(urlDict);
    if (bizKeys.indexOf(biz) < 0) {
      throw new Error('getUrl biz Not in Dict');
    }
    if (!urlDict[biz][UrlName]) {
      throw new Error('getUrl the url name not in Dict');
    }
    return urlDict[biz][UrlName];
  } catch (err) {
    console.error(err);
  }
};

export default {
  getUrl
};
