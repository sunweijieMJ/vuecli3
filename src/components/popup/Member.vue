<template>
  <div class="okr-member">
    <h4>参与者</h4>
    <div class="content">
      <div class="list">
        <el-tag v-for="(item, index) in join_list" :key="index" closable @close="closeTag(index)">
          {{item.user_name}}
        </el-tag>
        <el-popover
          v-model="member_popover"
          placement="right"
          width="400"
          trigger="click">
          <el-button class="add" slot="reference">添加</el-button>
          <div class="popover-member">
            <h4>参与者</h4>
            <el-input class="custom-input" type="text" v-model="keyword" @input="getUserList(keyword)" placeholder="请输入昵称"></el-input>
            <template v-if="keyword">
              <ul class="list" v-if="user_list.length">
                <li v-for="(item, index) in user_list" :key="index" @click="chooseUser(item, index)">
                  <div class="name">
                    <img :src="item.header_photo" alt="">
                    <span>{{item.user_name}} ({{item.real_name}})</span>
                  </div>
                  <i class="icon-btn_checked1 iconfont" v-if="item.isExist"></i>
                </li>
              </ul>
              <div class="null" v-else>
                <p>Sorry, 好像没有这个同事哦</p>
              </div>
            </template>
          </div>
        </el-popover>
      </div>
    </div>
  </div>
</template>
<script>
  import UserApi from '../../api/User.js';
  import OkrApi from '../../api/Okr.js';
  import TaskApi from '../../api/Task.js';

  export default {
    props: ['value'],
    data() {
      return {
        member_popover: false,
        keyword: '',
        user_list: [], // ETC 搜索列表
        join_list: [] // ETC 参与者列表
      };
    },
    created() {
      let that = this;
      that.join_list = that.value;
    },
    methods: {
      // 搜索member
      getUserList(keyword) {
        if(keyword) {
          UserApi().getUserList({keyword}).then(res => {
            this.user_list = res.data.list;
          });
        } else {
          this.user_list = [];
        }
      },
      // 判断用户是否已存在
      judgeUser(item) {
        let [that, flag] = [this, false];
        for(let i = 0, LEN = that.join_list.length; i < LEN; i++) {
          if(that.join_list[i].user_id === item.user_id) {
            flag = i;
            break;
          }
        }
        return flag;
      },
      chooseUser(item, index) {
        let that = this;
        if(that.judgeUser(item) !== false) {
          if(that.join_list[that.judgeUser(item)].isNew) {
            that.join_list.splice(that.judgeUser(item), 1);
            that.user_list[index].isExist = !that.user_list[index].isExist;
          } else {
            that.deleteUser(item).then(res => {
              if(res.status) {
                that.join_list.splice(that.judgeUser(item), 1);
                that.user_list[index].isExist = !that.user_list[index].isExist;
              } else {
                that.$message({message: '该用户不能删除', type: 'warning'});
              }
            });
          }
        } else {
          item.isNew = true;
          that.join_list.push(item);
          that.user_list[index].isExist = !that.user_list[index].isExist;
        }
      },
      async deleteUser(item) {
        let that = this;
        const objId = that.$store.state.okr_publish.source && that.$store.state.okr_publish.source.obj_id;
        const taskId = that.$store.state.okr_publish.source && that.$store.state.okr_publish.source.task_id;
        if(objId) {
          return await OkrApi().deleteUserFromOkr({objId, userId: item.user_id});
        } else {
          return await TaskApi().deleteUserFromTask({taskId, userId: item.user_id});
        }
      },
      // 关闭标签
      closeTag(index) {
        let that = this;
        const objId = that.$store.state.okr_publish.source && that.$store.state.okr_publish.source.obj_id;
        const taskId = that.$store.state.okr_publish.source && that.$store.state.okr_publish.source.task_id;
        const userId = that.join_list[index].user_id;
        if(that.join_list[index].isNew) {
          that.join_list.splice(index, 1);
        } else {
          if(objId) {
            OkrApi().deleteUserFromOkr({objId, userId}).then(res => {
              if(res.status) {
                that.join_list.splice(index, 1);
              } else {
                that.$message({message: '该用户不能删除', type: 'warning'});
              }
            });
          } else {
            TaskApi().deleteUserFromTask({taskId, userId}).then(res => {
              if(res.status) {
                that.join_list.splice(index, 1);
              } else {
                that.$message({message: '该用户不能删除', type: 'warning'});
              }
            });
          }
        }
      }
    },
    watch: {
      // 同步父组件
      join_list(cur) {
        this.$emit('input', cur);
      },
      // 判断搜索列表已添加用户
      user_list(cur) {
        if(!cur.length) return;
        let that = this;
        for(let i = 0, ILEN = cur.length; i < ILEN; i++) {
          for(let j = 0, JLEN = that.join_list.length; j < JLEN; j++) {
            if(cur[i].user_id === that.join_list[j].user_id) {
              that.user_list[i].isExist = true;
            }
          }
        }
      },
      // 聚焦input
      member_popover(cur) {
        let that = this;
        if(cur) {
          that.$nextTick(() => {
            document.querySelector('.popover-member input').focus();
          });
        } else {
          that.keyword = '';
        }
      }
    }
  };
</script>
<style lang="scss">
  $left-right: 37px;
  $up-down: 24px;

  .okr-member {
    display: flex;
    align-items: center;
    h4 {
      width: 46px;
      margin-bottom: 12px;
      font-size: $h3Font;
      font-weight: 400;
      color: $h2Color;
    }
    .content {
      flex: 1;
      margin-left: $left-right;
      .list {
        display: flex;
        flex-wrap: wrap;
        .el-tag {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 36px;
          padding: 0 30px;
          margin: 0 12px 12px 0;
          border-radius: 20px;
          background-color: $backColor;
          font-size: $h3Font;
          color: $h1Color;
          border: none;
          .el-tag__close {
            top: 0;
            color: $linkBlue;
            &:hover {
              color: #fff;
              background-color: $linkBlue;
            }
          }
        }
      }
      .add {
        margin-bottom: 12px;
      }
    }
  }
  .el-popover {
    .popover-member {
      padding: $up-down $left-right;
      h4 {
        margin-bottom: $up-down;
        font-size: $h1Font;
        font-weight: $h1Weight;
        line-height: 100%;
        color: $themeColor;
      }
      input {
        height: 40px;
      }
      .list {
        max-height: 290px;
        overflow-y: auto;
        margin-top: $up-down;
        li {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
          cursor: pointer;
          &:hover {
            background-color: $backColor;
          }
          &:last-child {
            margin-bottom: 0;
          }
          .name {
            display: flex;
            align-items: center;
            img {
              box-sizing: border-box;
              width: 38px;
              height: 38px;
              border-radius: 50%;
              border: 1px solid $lineColor;
            }
            span {
              margin-left: 10px;
              font-size: $h3Font;
              color: $h1Color;
            }
          }
          i {
            font-size: 26px;
          }
        }
      }
      .null {
        padding: 35px 0;
        p {
          font-size: $h3Font;
          line-height: 20px;
          color: $h3Color;
          text-align: center;
        }
      }
      .btn {
        text-align: right;
      }
    }
  }
</style>

