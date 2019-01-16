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

}

// 单列模式返回对象
let instance;
export default () => {
  if (instance) return instance;
  instance = new Task();
  return instance;
};
