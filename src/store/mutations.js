// 将types.js里的内容存为types对象
import * as types from './types';

const mutations = {
  [types.SHOW_IMAGE]: (state, data) => {
    state.image_popup = data;
  },
  [types.SELF_INFO]: (state, data) => {
    state.self_info = data;
  },
  [types.UNREAD_MSG]: (state, data) => {
    state.unread_msg.num = data.cnt;
  },
  [types.OKR_PUBLISH]: (state, data) => {
    state.okr_publish = data;
  },
  [types.TASK_PUBLISH]: (state, data) => {
    state.task_publish = data;
  }
};

export default mutations;
