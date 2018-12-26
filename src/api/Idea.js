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
   */
  getIdeaList(data) {
    return this.getReq('Idea.IdeaList', data);
  }

  /**
   * 想法详情
   */
  getIdeaDetail(data) {
    return this.getReq('Idea.IdeaDetail', data);
  }

  /**
   * 评论列表
   */
  getCommentList(data) {
    return this.getReq('Idea.CommentList', data);
  }

  /**
   * 点赞用户列表
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
   * 
   */
  PublishFor(data){
    return this.postReq('Idea.IdeaPublish', data);
  }
}

// 单列模式返回对象
let instance;
export default () => {
  if (instance) return instance;
  instance = new Idea();
  return instance;
};
