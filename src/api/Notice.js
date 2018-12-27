/**
 * PGS Notice API 集合类
 * 所有工具相关的接口统一封装
 * 集成Abstract
 * @date 2018-12-20
 */
import Abstract from './Abstract.js';

class Notice extends Abstract {

  constructor() {
    super();
  }

  /**
   * 消息列表
   * @param {waitRead} 只拉取未读信息
   * @param {curPage} 当前页
   * @param {pages} 每页数量
   */
  getMessageList(data){
    return this.getReq('Notice.MessageList', data);
  }

}

// 单列模式返回对象
let instance;
export default () => {
  if (instance) return instance;
  instance = new Notice();
  return instance;
};
