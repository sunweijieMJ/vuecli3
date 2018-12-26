/**
 * PGS User API 集合类
 * 所有工具相关的接口统一封装
 * 集成Abstract
 * @date 2018-12-20
 */
import Abstract from './Abstract.js';

class User extends Abstract {

  constructor() {
    super();
  }

  /**
   * 用户详情
   */
  getUserDetail(data) {
    return this.getReq('User.UserDetail', data);
  }

  /**
   * 用户信息更新
   * @param {number | required} userId 用户id
   * @param {string} headerPhoto 用户头像
   * @param {string} userName 用户名称
   */
  updateUserMsg(data) {
    return this.postReq('User.UserUpdate', data);
  }

}

// 单列模式返回对象
let instance;
export default () => {
  if (instance) return instance;
  instance = new User();
  return instance;
};
