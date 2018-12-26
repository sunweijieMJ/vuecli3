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
   * @param {string} userName 用户名称
   */
  uploadImg(data) {
    return this.postReq('System.UploadImg', data);
  }
}

// 单列模式返回对象
let instance;
export default () => {
  if (instance) return instance;
  instance = new System();
  return instance;
};
