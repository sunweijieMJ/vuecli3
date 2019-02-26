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
   * @param {number | required} userIds 用户id
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

  /**
   * 登陆
   * @param {string} email 邮箱
   * @param {num} passwd 密码
   */
  getLogin(data){
    return this.postReq('User.UserLogin', data);
  }

  /**
   * 用户列表
   * @param {string} keyword 关键字
   */
  getUserList(data){
    return this.getReq('User.UserList', data);
  }

  /**
   * 获取密码
   * @param {num} email 用户邮箱
   */
  getPssword(data){
    return this.postReq('User.UserPass', data);
  }

  /**
   * 用户名获取用户信息
   * @param {array | required} userNames 用户名数组
   */
  getUserByName(data) {
    return this.postReq('User.UserByName', data);
  }

  /**
   * 获取所有部门数据
   */
  getPartList(data) {
    return this.getReq('User.PartList', data);
  }

  /**
   * 根据部门ID获取对应员工信息
   * @param {number} depId 部门ID ,不填写则为全部
   * @param {number} curPage
   * @param {number} pages
   */
  getStaffsByDep(data) {
    return this.getReq('User.StaffsByDep', data);
  }

}

// 单列模式返回对象
let instance;
export default () => {
  if (instance) return instance;
  instance = new User();
  return instance;
};
