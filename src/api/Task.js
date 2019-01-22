/**
 * PGS User API 集合类
 * 所有工具相关的接口统一封装
 * 集成Abstract
 * @date 2018-12-20
 */
import Abstract from './Abstract.js';

class Task extends Abstract {

  constructor() {
    super();
  }

  /**
   * 创建OKR
   * @param {string | required} taskContent task名称
   * @param {number | required} toUser 发起人id
   * @param {string | required} startTime 开始时间 格式 YYYY-MM-DD
   * @param {string | required} endTime 结束时间
   * @param {array} takeUser 参与者id数组
   * @param {number | required} parentId 父id,无为0
   * @param {array | required} objectIds 管理OKR ID
   */
  createTask(data) {
    return this.postReq('Task.CreateTask', data);
  }

  /**
   * 删除 task 关联 user
   * @param {number | required} taskId
   */
  getBasicInfo(data) {
    return this.getReq('Task.BasicInfo', data);
  }

  /**
   * 删除 task 关联 user
   * @param {number | required} taskId
   * @param {number | required} userId
   */
  deleteUserFromTask(data) {
    return this.postReq('Task.DeleteUserFromTask', data);
  }
  /*
   * task的基础信息
   * @param {num} taskId: 12  * task id
   */
  getTaskBasicInfo(data){
    return this.getReq('Task.BasicInfo', data);
  }

  /**
   * task动态列表
   * @param {num} taskId: 12  * okr id
   * @param {num} currpage: 1 * 当前第几页
   * @param {num} pages: 15 * 每页总数
   * @param {num} lastId: 1 * 最后一条id
   */
  getTaskDynamicList(data){
    return this.getReq('Task.Taskdynamic', data);
  }

  /**
   * 关联task列表
   * @param {num} objId: 12  * okr id
   */
  getTaskList(data){
    return this.getReq('Okr.OkrKeyTask', data);
  }
}

// 单列模式返回对象
let instance;
export default () => {
  if (instance) return instance;
  instance = new Task();
  return instance;
};
