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
  }
};

export default state;
