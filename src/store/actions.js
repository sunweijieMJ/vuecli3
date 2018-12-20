// 将types.js里的内容存为types对象
import * as types from './types';

const actions = {
  changeImgPopup: ({commit}, data) => {
    commit(types.SHOW_IMAGE, data);
  }
};

export default actions;
