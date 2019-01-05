// 将types.js里的内容存为types对象
import * as types from './types';
import NoticeApi from '../api/Notice';

const actions = {
  changeImgPopup: ({commit}, data) => {
    commit(types.SHOW_IMAGE, data);
  },
  getSelfInfo: ({commit}, data) => {
    commit(types.SELF_INFO, data);
  },
  getMessageUnread: ({commit}) => {
    NoticeApi().getMessageUnread({}).then(res => {
      if (res.status) commit(types.UNREAD_MSG, res.data);
    });
  }
};

export default actions;
