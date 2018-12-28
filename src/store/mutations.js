// 将types.js里的内容存为types对象
import * as types from './types';

const mutations = {
  [types.SHOW_IMAGE]: (state, data) => {
    state.image_popup = data;
  },
  [types.SELF_INFO]: (state, data) => {
    state.self_info = data;
  }
};

export default mutations;
