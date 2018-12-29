/**
 * PGS System API 集合类
 * 所有工具相关的接口统一封装
 * 集成Abstract
 * @date 2018-12-19
 */
import Abstract from './Abstract.js';

class ManageIdea extends Abstract {

  constructor() {
    super();
  }

  /**
   * 组织结构基础信息
   */
  getBasicData(data) {
    return this.getReq('ManageIdea.BasicData', data);
  }

  /**
   * 获取所有部门数据
   */
  getDepartMentData(data){
    return this.getReq('ManageIdea.DepartMentData', data);
  }

  /**
   * 根据部门ID 获取对应员工信息
   * @param {num} depId * 部门ID ,不填写则为全部
   * @param {num} curPage * 当前第几页
   * @param {num} pages * 每页显示总数
   */
  getStaffData(data){
    return this.getReq('ManageIdea.StaffData', data);
  }
}

// 单列模式返回对象
let instance;
export default () => {
  if (instance) return instance;
  instance = new ManageIdea();
  return instance;
};
