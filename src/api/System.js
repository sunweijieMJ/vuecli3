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
