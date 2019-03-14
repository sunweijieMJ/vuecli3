/**
 * PGS Report API 集合类
 * 所有工具相关的接口统一封装
 * 集成Abstract
 * @date 2018-12-19
 */
import Abstract from './Abstract.js';

class Report extends Abstract {

  constructor() {
    super();
  }

  /**
   * 发布周报
   * @param {array | required} recipient 周报接受人
   * @param {array | required} curr_week_list 上周kt列表
   * @param {array | required} next_week_list 下周kt列表
   * @param {object | required} obj_infos
   * @param {string | required} curr_week_other 上周其他工作计划
   * @param {string | required} next_week_other 下周其他工作计划
   * @param {string | required} summary 心得体会
   * @param {string | required} start_day
   * @param {string | required} end_day
   * @param {string | required} action
   * @param {number | required} report_id 周报ID(编辑状态时使用)
   */
  publish(data) {
    return this.postReq('Report.PublishReport', data);
  }

  /**
   * 周报列表
   * @param {string | required} type self | recipient | all
   */
  getReportList(data) {
    return this.getReq('Report.ReportList', data);
  }

  /**
   * 周报详细信息
   * @param {number | required} report_id
   */
  getReportDetail(data) {
    return this.getReq('Report.ReportDetail', data);
  }

  /**
   * 周报默认接收人
   */
  getDefaultUsers(data) {
    return this.getReq('Report.DefaultUsers', data);
  }

  /**
   * 周工作task列表
   * @param {string | required} start_day
   * @param {string | required} end_day
   */
  getWeeklyKtList(data) {
    return this.getReq('Report.WeeklyKtList', data);
  }

  /**
   * 发布周报反馈
   * @param {number | required} report_id
   * @param {string | required} feedback
   * @param {boolean | required} only_self
   */
  publishFeedBack(data) {
    return this.postReq('Report.PublishFeedBack', data);
  }

  /**
   * 是否有未读周报
   */
  getReportUnread(data) {
    return this.getReq('Report.ReportUnread', data);
  }

}

// 单列模式返回对象
let instance;
export default () => {
  if (instance) return instance;
  instance = new Report();
  return instance;
};
