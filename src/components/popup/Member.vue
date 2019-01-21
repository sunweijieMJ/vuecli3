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
            <input type="text" v-model="keyword" @input="getUserList(keyword)">
            <template v-if="join_list.length || keyword">
              <ul class="list" v-if="user_list.length || join_list.length">
                <li v-for="(item, index) in keyword ? user_list : join_list" :key="index" @click="chooseUser(item)">
                  <div class="name">
                    <img :src="item.header_photo" alt="">
                    <span>{{item.user_name}}</span>
                  </div>
                  <i class="el-icon-circle-check" v-if="!keyword"></i>
                </li>
              </ul>
              <div class="null" v-else>
                <p>Sorry, 好像没有这个同事哦</p>
              </div>
              <div class="btn">
                <el-button class="cancel" @click="member_popover = false">取消</el-button>
                <el-button class="confirm" @click="confirm">确定</el-button>
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

  export default {
    data() {
      return {
        member_popover: false,
        keyword: '',
        join_list: [],
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
      // 选择参与者
      chooseUser(user) {
        let that = this;
        that.keyword = user.user_name;
        that.getUserList(that.keyword);
      },
      // 确认添加
      confirm() {
        let that = this;
        that.member_popover = false;
        if(that.user_list.length === 1) {
          let flag = true;
          for(let i = 0, LEN = that.join_list.length; i < LEN; i++) {
            if(that.join_list[i].user_id === that.user_list[0].user_id) {
              flag = false;
            }
          }
          if(flag) {
            that.join_list.push(that.user_list[0]);
            that.$emit('confirmUser', that.join_list);
          } else {
            that.$message({message: '该用户已存在', type: 'warning'});
          }
          that.keyword = '';
        } else {
          that.$message({message: '请选择参与者', type: 'warning'});
        }
      },
      // 关闭标签
      closeTag(index) {
        this.join_list.splice(index, 1);
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
              border: 2px solid $lineColor;
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

