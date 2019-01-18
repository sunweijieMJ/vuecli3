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
   * okr基础信息
   * @param {required} obj_id okr id
   */
  getOkrBasicinfo(data) {
    return this.getReq('Okr.Basicinfo', data);
  }

  /**
   * okr keyresult 列表
   * @param {required} obj_id okr id
   */
  getOkrKeyResultList(data) {
    return this.getReq('Okr.OkrKeyResult', data);
  }

  /**
   * okr keytask 列表
   * @param {required} obj_id okr id
   * @param {required} key_task : 1 * 或者该值不传
   * @param {required} task_id: 1  * 搜索关联task 列表信息
   * @param {required} currpage: 1 * 当前第几页
   * @param {required} pages: 15 * 每页总数
   * @param {required} last_id: 1 * 最后一条id
   */
  getOkrKeyTaskList(data) {
    return this.getReq('Okr.OkrKeyTask', data);
  }

  /**
   * 创建OKR
   * @param {string | required} okrName okr名称
   * @param {number | required} boUser 发起人id
   * @param {string | required} okrType 类型
   * @param {string | required} startTime 开始时间 格式 YYYY-MM-DD
   * @param {string | required} endTime 结束时间
   * @param {array | required} takeUser 参与者id数组
   * @param {string | required} objectiveName objective
   * @param {array | required} keyResult [{name: 'xx', index: 1}, {name: 'xxx',  'index': 2}]
   */
  createOkr(data) {
    return this.postReq('Okr.CreateOkr', data);
  }
}

// 单列模式返回对象
let instance;
export default () => {
  if (instance) return instance;
  instance = new Okr();
  return instance;
};
