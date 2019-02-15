import UserApi from '../../api/User';
import IdeaApi from '../../api/Idea';
import frequent from '../../mixins/frequent';

export default {
  mixins: [frequent],
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
                          that.pathSkip(`/foreground/fore_mine/profile/${id}`);
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
                    const topicTitles = e.target.innerText.replace(/#/g, '').trim().split(' ');
                    IdeaApi().getTopicByTitle({topicTitles}).then(res => {
                      if (res.status) {
                        if (!res.data.length) {
                          that.$message({message: '话题不存在', type: 'warning'});
                        } else {
                          const id = res.data[0].topic_id;
                          that.pathSkip(`/foreground/fore_idea/topic_list/${id}`);
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
    forbid: {
      type: Boolean,
      required: false
    }
  }
};
