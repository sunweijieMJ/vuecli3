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
            <input type="text" v-model="keyword" @input="getUserList(keyword)" placeholder="请输入昵称">
            <template v-if="keyword">
              <ul class="list" v-if="user_list.length">
                <li v-for="(item, index) in user_list" :key="index" @click="addUserList(item)">
                  <div class="name">
                    <img :src="item.header_photo" alt="">
                    <span>{{item.user_name}} ({{item.real_name}})</span>
                  </div>
                  <i class="el-icon-circle-check" v-if="item.isExist"></i>
                </li>
              </ul>
              <div class="null" v-else>
                <p>Sorry, 好像没有这个同事哦</p>
              </div>
              <div class="btn">
                <el-button class="cancel" @click="member_popover = false">取消</el-button>
                <el-button class="confirm" @click="addUserList(false)">确定</el-button>
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

  export default {
    props: ['member_list'],
    data() {
      return {
        member_popover: false,
        keyword: '',
        user_list: []
      };
    },
    methods: {
      // 搜索member
      getUserList(keyword) {
        UserApi().getUserList({keyword}).then(res => {
          this.user_list = res.data.list;
        });
      },
      judgeUser(user) {
        let [that, flag] = [this, true];
        for(let i = 0, LEN = that.join_list.length; i < LEN; i++) {
          if(that.join_list[i].user_id === user.user_id) {
            flag = false;
            break;
          }
        }
        if(flag) {
          that.join_list.push(user);
          that.$emit('confirmUser', that.join_list);
        } else {
          that.$message({message: '该用户已存在', type: 'warning'});
        }
      },
      // 添加参与者
      addUserList(user) {
        let that = this;
        if(user) {
          that.judgeUser(user);
        } else {
          if(that.user_list.length === 1) {
            that.judgeUser(that.user_list[0]);
          } else {
            that.$message({message: '请选择参与者', type: 'warning'});
          }
        }
        that.member_popover = false;
      },
      // 关闭标签
      closeTag(index) {
        let that = this;
        const objId = that.$store.state.okr_publish.source && that.$store.state.okr_publish.source.obj_id;
        const userId = that.join_list[index].user_id;
        if(objId) {
          OkrApi().deleteUserFromOkr({objId, userId}).then(res => {
            if(res.status) {
              that.join_list.splice(index, 1);
            } else {
              that.$message({message: '该用户不能删除', type: 'warning'});
            }
          });
        } else {
          that.join_list.splice(index, 1);
        }
      }
    },
    computed: {
      join_list() {
        return this.member_list || [];
      }
    },
    watch: {
      user_list(cur) {
        if(!cur.length) return;
        let that = this;
        for(let i = 0, ILEN = that.user_list.length; i < ILEN; i++) {
          for(let j = 0, JLEN = that.join_list.length; j < JLEN; j++) {
            if(that.user_list[i].user_id === that.join_list[j].user_id) {
              that.user_list[i].isExist = true;
            }
          }
        }
      },
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
  .okr-member {
    display: flex;
    align-items: center;
    h4 {
      width: 46px;
      margin-bottom: 12px;
      font-size: $h3Color;
      font-weight: 400;
      color: $h2Color;
    }
    .content {
      flex: 1;
      margin-left: 37px;
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
              background-color: $themeColor;
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
      padding: 28px 37px;
      h4 {
        font-size: $h1Font;
        font-weight: $h1Weight;
        line-height: 30px;
        color: $themeColor;
      }
      input {
        box-sizing: border-box;
        width: 329px;
        height: 40px;
        padding-left: 20px;
        margin-top: 22px;
        border-radius: 2px;
        background-color: $backColor;
      }
      .list {
        max-height: 270px;
        overflow-y: auto;
        padding: 28px 0;
        li {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
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
            font-size: 28px;
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

