// vuex的数据中心
const state = {
  image_popup: { // ETC 查看大图
    status: false,
    source: '',
    index: 0
  },
  self_info: {}, // ETC 用户个人信息
  unread_msg: { // ETC 未读消息数
    num: 0,
    show: false
  },
  okr_publish: { // ETC OKR发布框
    status: false,
    source: ''
  },
  task_publish: { // ETC Task发布框
    status: false,
    source: ''
  },
  task_follow: { // ETC Task跟进框
    status: false,
    source: ''
  },
  task_close: { // ETC Task关闭框
    status: false,
    source: ''
  },
  task_feedback: { // ETC Task反馈框
    status: true,
    source: ''
  },
  upload_photo: { // ETC 修改头像框
    status: false,
    source: ''
  },
  send_flag: false
};

export default state;
