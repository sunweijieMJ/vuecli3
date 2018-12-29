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
   * @param {number} curPage 页码
   * @param {number} pages 每页数
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

}

// 单列模式返回对象
let instance;
export default () => {
  if (instance) return instance;
  instance = new Idea();
  return instance;
};
