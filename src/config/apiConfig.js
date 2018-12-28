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
    'UserByName': '/user/getUsersbyname' // ETC 用户名获取用户信息
  },
  'Notice': {
    'MessageList': '/com/messagelist', // ETC 消息列表
    'MessagePush': '/com/messagepush' // ETC 推送消息
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
    'CommentThump': '/thinks/commentzan' // ETC 评论点赞
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
