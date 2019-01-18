/**
 * API 相关配置文件
 * API URL Dict api 字典
 */

const urlDict = {
  'System': {
    'GlobalInfo': '/config/global', // ETC 全局变量
    'UploadImg': '/com/upload' // ETC 图片上传
  },
  'User': {
    'UserLogin': '/user/login', // ETC 用户登录
    'UserDetail': '/user/detail', // ETC 用户详情
    'UserUpdate': '/user/update', // ETC 用户信息更新
    'UserList': '/user/list', // ETC 用户列表
    'UserPass': '/user/initpwd', // ETC 密码获取
    'UserByName': '/user/getusersbyname' // ETC 用户名获取用户信息
  },
  'Notice': {
    'MessageList': '/com/messagelist', // ETC 消息列表
    'MessagePush': '/com/messagepush', // ETC 推送消息
    'MessageUnread': '/com/unreadmessagecnt' // ETC 未读信息总数
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
    'StickOrder': '/crules/thinks/settoporder' // ETC 置顶列表排序
  },
  'ManageIdea': {
    'BasicData': 'crules/org/orgbasic', // ETC 组织结构基础数据
    'DepartMentData': 'crules/org/departmentlist', // ETC 部门数据
    'StaffData': 'crules/org/getstaffsbydep' // ETC 员工数据
  },
  'Okr': {
    'Basicinfo': 'okr/okr/basicinfo', // ETC okr 基础信息
    'OkrKeyResult': 'okr/kr/list', // ETC okr keyresult 列表
    'OkrKeyTask': 'okr/task/list', // ETC okr keytask列表
    'CreateOkr': 'okr/okr/create' // ETC 创建OKR
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
