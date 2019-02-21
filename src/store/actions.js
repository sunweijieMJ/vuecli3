// 将types.js里的内容存为types对象
import * as types from './types';
import NoticeApi from '../api/Notice';
import UserApi from '../api/User';
import OkrApi from '../api/Okr';
import TaskApi from '../api/Task';

const actions = {
  changeImgPopup: ({commit}, data) => {
    commit(types.SHOW_IMAGE, data);
  },
  getSelfInfo: ({commit}) => {
    UserApi().getUserDetail({}).then(res => {
      if (res.status) commit(types.SELF_INFO, res.data);
    });
  },
  getMessageUnread: ({commit}) => {
    NoticeApi().getMessageUnread({}).then(res => {
      if (res.status) commit(types.UNREAD_MSG, res.data);
    });
  },
  async setOKRPublish({commit}, data) {
    if (data.type === 'edit') {
      let source = {};
      await OkrApi().getBasicInfo({objId: data.okrId}).then(res => {
        source = res.data;
      });
      await OkrApi().getKeyResultList({objId: data.okrId}).then(res => {
        source.key_result = res.data;
      });
      commit(types.OKR_PUBLISH, {status: true, type: 'edit', source});
    } else {
      commit(types.OKR_PUBLISH, data);
    }
  },
  async setTaskPublish({commit}, data) {
    if (data.type === 'edit') {
      let source = {};
      await TaskApi().getBasicInfo({taskId: data.taskId}).then(res => {
        source = res.data;
      });
      commit(types.TASK_PUBLISH, {status: true, type: 'edit', source});
    } else {
      commit(types.TASK_PUBLISH, data);
    }
  },
  setTaskClose: ({commit}, data) => {
    commit(types.TASK_CLOSE, data);
  },
  setTaskFollow: ({commit}, data) => {
    commit(types.TASK_FOLLOW, data);
  },
  setUploadPhoto: ({commit}, data) => {
    commit(types.UPLOAD_PHOTO, data);
  },
  setSendFlag: ({commit}, data) => {
    commit(types.SEND_FLAG, data);
  }
};

export default actions;
