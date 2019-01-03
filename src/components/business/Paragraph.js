import UserApi from '../../api/User';
import IdeaApi from '../../api/Idea';

export default {
  render(createElement) {
    let that = this;
    if (!that.text) return;
    return createElement(
      'p',
      {
        style: {
          'word-break': 'break-word',
          '-webkit-box-orient': 'vertical'
        }
      },
      [
        that.text.split(/(@[-_0-9a-zA-Z\u4e00-\u9fa5\uac00-\ud7ff\u0800-\u4e00]{1,26})|(#[^@#]+#)|(\r|\n)|(\[.+?\])/g).map((item) => {
          if (!item) return;
          if (item.match(/@[-_0-9a-zA-Z\u4e00-\u9fa5\uac00-\ud7ff\u0800-\u4e00]{1,26}/g)) {
            return createElement(
              'a',
              {
                attrs: {
                  href: 'javascript:;'
                },
                domProps: {
                  innerHTML: item
                },
                on: {
                  click: (e) => {
                    if (that.forbid) return;
                    let userNames = e.target.innerText.substring(1);
                    userNames = userNames.split();
                    UserApi().getUserByName({userNames}).then(res => {
                      if (res.status) {
                        if (!res.data.total) {
                          that.$message({message: '用户不存在', type: 'warning'});
                        } else {
                          const id = Object.values(res.data.list)[0].user_id;
                          that.$router.push({name: 'Profile', params: {id}});
                        }
                      }
                    });
                    e.stopPropagation();
                  }
                }
              }
            );
          } else if (item.match(/#[^@#]+#/g)) {
            return createElement(
              'a',
              {
                attrs: {
                  href: 'javascript:;'
                },
                on: {
                  click: (e) => {
                    if (that.forbid) return;
                    const topicTitles = e.target.innerText.split();
                    IdeaApi().getTopicByTitle({topicTitles}).then(res => {
                      if (res.status) {
                        if (!res.data.length) {
                          that.$message({message: '话题不存在', type: 'warning'});
                        } else {
                          const id = res.data[0].topic_id;
                          that.$router.push({name: 'TopicList', params: {id}});
                        }
                      }
                    });
                    e.stopPropagation();
                  }
                }
              },
              [
                item.split(/^#/g).map((val) => {
                  if (!val) {
                    return createElement(
                      'i',
                      {
                        attrs: {
                          class: 'iconfont icon-search_lb_topic'
                        }
                      }
                    );
                  } else {
                    return createElement(
                      'span',
                      {
                        style: {
                          cursor: 'pointer'
                        },
                        domProps: {
                          innerHTML: item.trim()
                        }
                      }
                    );
                  }
                })
              ]
            );
          } else if (item.match(/\r|\n/g)) {
            return createElement('br');
          } else {
            return createElement(
              'span',
              {
                domProps: {
                  innerHTML: item
                }
              }
            );
          }
        })
      ]
    );
  },
  props: {
    text: {
      type: String,
      required: true
    },
    topic: {
      type: Array,
      required: false
    },
    hangings: {
      type: Object,
      required: false
    },
    forbid: {
      type: Boolean,
      required: false
    }
  }
};
