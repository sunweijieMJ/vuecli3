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
   * 创建Task
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
   * 编辑Task
   * @param {number | required} taskId task id
   * @param {string | required} taskContent task名称
   * @param {number | required} toUser 发起人id
   * @param {string | required} startTime 开始时间 格式 YYYY-MM-DD
   * @param {string | required} endTime 结束时间
   * @param {array} takeUser 参与者id数组
   * @param {number | required} parentId 父id,无为0
   * @param {array | required} objectIds 管理OKR ID
   */
  updateTask(data) {
    return this.postReq('Task.UpdateTask', data);
  }

  /**
   * 获取task 基础信息
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
  getOkrKeyTask(data){
    return this.getReq('Task.OkrKeyTask', data);
  }

  /**
   * task list
   * @param {number} qtype create 我的| take 参与|team 团队|all 全部
   * @param {number} qdep_id 部门id
   * @param {number} quser_id 用户id
   * @param {number} lastId 最后一条id
   * @param {number} curPage 当前页
   * @param {number} pages 每页总数
   */
  getTaskList(data) {
    return this.getReq('Task.TaskList', data);
  }

  /**
   * check task 任务
   * @param {number | required} taskId
   * @param {array | required} objId
   * @param {string | required} remark 备注信息
   * @param {number | required} speedTime 花费时间
   * @param {number | required} progress 进度
   * @param {number | required} feel 满意程度从1 ~4 升序
   * @param {number | required} type 1:跟进，2：完成
   */
  checkTask(data) {
    return this.postReq('Task.TaskCheck', data);
  }

  /**
   * finish task 任务
   * @param {number | required} taskId
   * @param {array | required} objId
   * @param {string | required} remark 备注信息
   * @param {number | required} speedTime 花费时间
   * @param {number | required} progress 进度
   * @param {number | required} selfComments 几颗星
   */
  finishTask(data) {
    return this.postReq('Task.TaskFinish', data);
  }

  /**
   * 关闭 task 任务(暂无使用)
   * @param {number | required} taskId
   * @param {string | required} remark 备注信息
   */
  closeTask(data) {
    return this.postReq('Task.TaskClose', data);
  }

  /**
   * okr/Task聚合
   */
  getGroupList(data){
    return this.getReq('Task.GroupList', data);
  }
}

// 单列模式返回对象
let instance;
export default () => {
  if (instance) return instance;
  instance = new Task();
  return instance;
};
