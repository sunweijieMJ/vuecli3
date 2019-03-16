/**
 * PGS System API 集合类
 * 所有工具相关的接口统一封装
 * 集成Abstract
 * @date 2018-12-19
 */
import Abstract from './Abstract.js';

class System extends Abstract {

  constructor() {
    super();
  }

  /**
   * 图片上传
   * @param {object | required} formdata
   */
  uploadImg(data) {
    return this.postReq('System.UploadImg', data);
  }

  /**
   * 组织结构基础信息
   */
  getOrgBasic(data) {
    return this.getReq('System.OrgBasic', data);
  }

  /**
   * 获取所有部门数据
   */
  getDepartMentList(data) {
    return this.getReq('System.DepartMentList', data);
  }

  /**
   * 根据部门ID 获取对应员工信息
   * @param {num} depId * 部门ID ,不填写则为全部
   * @param {num} curPage * 当前第几页
   * @param {num} pages * 每页显示总数
   */
  getStaffsByDep(data) {
    return this.getReq('System.StaffsByDep', data);
  }

  /**
   * 数据埋点
   * @param {array} actions
   * http://git.release.weiheinc.com/joe/api-doc/blob/master/Infrastracture/LanehubDataRequest.md
   */
  sendUserAction(data) {
    return this.postReq('System.UserAction', data);
  }
}

// 单列模式返回对象
let instance;
export default () => {
  if (instance) return instance;
  instance = new System();
  return instance;
};
