/**
 * PGS Idea API 集合类
 * 所有工具相关的接口统一封装
 * 集成Abstract
 * @date 2018-12-20
 */
import Abstract from './Abstract.js';

class Idea extends Abstract {

  constructor() {
    super();
  }

  /**
   * 想法列表
   * @param {number} extendTop 是否需要精华点评
   * @param {number} userId 用户ID,获取该用户所有的想法列表
   * @param {number} topicId 话题ID,获取该话题下的想法列表
   * @param {number} qTop 查询置顶数据
   * @param {number} curPage 页码
   * @param {number} pages 每页数
   * @param {string} keyword 搜索,目前支持thinksId
   * @param {number} lastId 最后一个lastId
   */
  getIdeaList(data) {
    return this.getReq('Idea.IdeaList', data);
  }

  /**
   * 想法详情
   * @param {number | required} thinksId 想法id
   */
  getIdeaDetail(data) {
    return this.getReq('Idea.IdeaDetail', data);
  }

  /**
   * 评论列表
   * @param {number | required} thinksId 想法id
   * @param {number} curPage 页码
   * @param {number} pages 每页数
   */
  getCommentList(data) {
    return this.getReq('Idea.CommentList', data);
  }

  /**
   * 点赞用户列表
   * @param {number | required} thinksId 想法id
   */
  getThumpList(data) {
    return this.getReq('Idea.ThumpList', data);
  }

  /**
   * 话题列表
   * @param {string} keywords 关键字
   */
  getTopicList(data){
    return this.getReq('Idea.TopicList', data);
  }

  /**
   * 发布想法
   * @param {string}
   */
  PublishFor(data){
    return this.postReq('Idea.IdeaPublish', data);
  }

  /**
   * 发布评论
   * @param {number} thinksId 想法id
   * @param {number} commentId 评论id
   * @param {number} rootParenId 一级评论id
   * @param {string} commentContent 评论内容
   */
  PubishComment(data) {
    return this.postReq('Idea.PubishComment', data);
  }

  /**
   * 想法点赞
   * @param {number | required} thinksId 想法id
   */
  thumpIdea(data) {
    return this.postReq('Idea.IdeaThump', data);
  }

  /**
   * 评论点赞
   * @param {number | required} commentId 评论id
   */
  thumpComment(data) {
    return this.postReq('Idea.CommentThump', data);
  }

  /**
   * 想法单页单页浏览量
   * @param {number | required} thinksId 想法id
   */
  sendIdeaView(data) {
    return this.postReq('Idea.IdeaView', data);
  }

  /**
   * 话题title获取话题信息
   * @param {array | required} topicTitles 话题title
   */
  getTopicByTitle(data) {
    return this.postReq('Idea.TopicByTitle', data);
  }

  /**
   * 删除想法
   * @param {number} thinksId 想法id
   * @param {boolean} doDel
   */
  deleteIdea(data) {
    return this.postReq('Idea.IdeaDelete', data);
  }

  /**
   * 想法设置为置顶,或取消
   * @param {number} thinksId 想法id
   * @param {boolean} currTop 当前is_top 的状态
   */
  stickIdea(data) {
    return this.postReq('Idea.IdeaStick', data);
  }

  /**
   * 置顶列表排序
   * @param {array} orderlist 置顶列表(id)
   */
  orderStick(data) {
    return this.postReq('Idea.StickOrder', data);
  }

  /**
   * 删除自己的想法
   * @param {number |required} thinksId
   * @param {number} doDel 1执行删除
   */
  deleteSelfIdea(data) {
    return this.postReq('Idea.SelfIdeaDelete', data);
  }

  /**
   * 删除自己的评论
   * @param {number | required} commentId
   */
  deleteSelfComment(data) {
    return this.postReq('Idea.SelfCommentDelete', data);
  }
}

// 单列模式返回对象
let instance;
export default () => {
  if (instance) return instance;
  instance = new Idea();
  return instance;
};
