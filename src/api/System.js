/**
 * LaneHub 工具 API 集合类
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
   * 获取全局变量
   */
  getGlobalInfo() {
    return this.getReq('System.GlobalInfo', {});
  }

}

// 单列模式返回对象
let instance;
export default () => {
  if (instance) return instance;
  instance = new System();
  return instance;
};
