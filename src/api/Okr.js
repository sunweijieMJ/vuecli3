/**
 * PGS User API 集合类
 * 所有工具相关的接口统一封装
 * 集成Abstract
 * @date 2018-12-20
 */
import Abstract from './Abstract.js';

class Okr extends Abstract {

  constructor() {
    super();
  }

  /**
   * 创建OKR
   * @param {string | required} okrName okr名称
   * @param {number | required} boUser 发起人id
   * @param {string | required} okrType 类型
   * @param {string | required} startTime 开始时间 格式 YYYY-MM-DD
   * @param {string | required} endTime 结束时间
   * @param {array} takeUser 参与者id数组
   * @param {string | required} objectiveName objective
   * @param {array | required} keyResult [{name: 'xx', index: 0}, {name: 'xxx',  'index': 100}]
   */
  createOkr(data) {
    return this.postReq('Okr.CreateOkr', data);
  }

  /**
   * 编辑OKR
   * @param {number | required} objId objId
   * @param {string | required} okrName okr名称
   * @param {number | required} boUser 发起人id
   * @param {string | required} okrType 类型
   * @param {string | required} startTime 开始时间 格式 YYYY-MM-DD
   * @param {string | required} endTime 结束时间
   * @param {array} takeUser 参与者id数组
   * @param {string | required} objectiveName objective
   * @param {array | required} keyResult [{name: 'xx', index: 0}, {name: 'xxx',  'index': 100}]
   */
  updateOkr(data) {
    return this.postReq('Okr.UpdateOkr', data);
  }

  /**
   * okr基础信息
   * @param {number | required} obj_id
   */
  getBasicInfo(data) {
    return this.getReq('Okr.BasicInfo', data);
  }

  /**
   * okr keyresult 列表
   * @param {number | required} obj_id
   */
  getKeyResultList(data) {
    return this.getReq('Okr.KeyResultList', data);
  }

  /**
   * okr keytask 列表
   * @param {number | required} obj_id
   * @param {number | required} key_task 或者该值不传
   * @param {number | required} task_id 搜索关联task 列表信息
   * @param {number | required} currpage 当前第几页
   * @param {number} pages 每页总数
   * @param {number} last_id 最后一条id
   */
  getKeyTaskList(data) {
    return this.getReq('Okr.KeyTaskList', data);
  }

  /**
   * 获取okr简洁版列表
   * @param {string | required} keyword
   */
  getSimpleList(data) {
    return this.getReq('Okr.SimpleList', data);
  }

  /**
   * 删除 OKR 关联 KR
   * @param {number | required} objId
   * @param {number | required} krId key result id
   */
  deleteKrFromOkr(data) {
    return this.postReq('Okr.DeleteKrFromOkr', data);
  }

  /**
   * 删除 OKR 关联 User
   * @param {number | required} objId
   * @param {number | required} userId
   */
  deleteUserFromOkr(data) {
    return this.postReq('Okr.DeleteUserFromOkr', data);
  }

  /**
   * okr类型
   */
  getKindList(data){
    return this.getReq('Okr.KindList', data);
  }

  /**
   * okr 列表
   * @param {number | required} qtype create 创建| take 参与|team 团队|all 全部
   * @param {number | required} qdep_id 部门id查询
   * @param {number | required} quser_id 用户id查询
   * @param {number | required} okr_type 1 ~ 4
   * @param {number} last_id 最后一条id
   * @param {number} currPage: 当前页
   * @param {number} pages: 每页总数
   */
  getOkrList(data){
    return this.getReq('Okr.OkrList', data);
  }

  deleteOkr(data){
    return this.postReq('Okr.DeleteOkr', data);
  }
}

// 单列模式返回对象
let instance;
export default () => {
  if (instance) return instance;
  instance = new Okr();
  return instance;
};
