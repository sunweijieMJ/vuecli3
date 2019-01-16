<template>
  <div class="publish">
    <textarea id="textarea" placeholder="写下你的评论..." v-model="textEnabled.text"
      @click="getFocus"
      @propertychange="autoTextarea($event.target, 0, 184)" @input="autoTextarea($event.target, 0, 184) || getOffset($event)" @focus="textEnabled.status = true"
      ></textarea>
    <ul class="user-list" v-if="user_list.length" :style="{top: `${offset.top + 25}px`, left: `${offset.left}px`}">
      <li v-for="(item, index) in user_list" :key="index" @click="selectUser(item)">{{`${item.user_name}(${item.real_name})`}}</li>
    </ul>
    <ul class="topic-list" v-if="topic_list.length">
      <li v-for="(item, index) in topic_list" :key="index">{{item}}</li>
    </ul>
  </div>
</template>
<script>
  import UserApi from '../../api/User.js';
  import Cursor from './cursor.js';
  import {autoTextarea} from '../../utils/business/tools.js';

  export default {
    props: ['textEnabled'],
    data() {
      return {
        offset: {}, // ETC 光标位置
        cursor: 0,
        autoTextarea,
        user_list: [],
        topic_list: []
      };
    },
    methods: {
      // 用户列表
      getUserList(keyword) {
        UserApi().getUserList({keyword}).then(res => {
          this.user_list = Object.values(res.data.list);
        });
      },
      // 光标索引
      getFocus(e) {
        this.cursor = Cursor().getFocus(e.target);
      },
      // 光标坐标
      getOffset(e) {
        let that = this;
        const keyword = e.data;
        that.cursor = Cursor().getFocus(e.target);
        that.offset = Cursor().getInputPositon(e.target, that.$el);
        if (keyword === '@') {
          that.getUserList();
        } else if(keyword === ' ') {
          that.user_list = [];
        }
      },
      // 选择用户名
      selectUser(userInfo) {
        let that = this;
        const textarea = that.$el.querySelector('textarea');
        that.textEnabled.text += userInfo.user_name + ' ';
        that.user_list = [];
        textarea.focus();
      }
    }
  };
</script>
<style lang="scss" scoped>
  .publish {
    position: relative;
    textarea {
      box-sizing: border-box;
      width: 100%;
      height: 48px;
      padding: 10px 20px;
      border-radius: 2px;
      font-size: $h3Font;
      line-height: 25px;
      resize: none;
      border: none;
      background: $backColor;
      &::placeholder {
        font-size: $h3Font;
        line-height: 28px;
        color: $h3Color;
      }
      &::-webkit-input-placeholder {
        font-size: $h3Font;
        line-height: 28px;
        color: $h3Color;
      }
      &:-moz-placeholder {
        font-size: $h3Font;
        line-height: 28px;
        color: $h3Color;
      }
      &::-moz-placeholder {
        font-size: $h3Font;
        line-height: 28px;
        color: $h3Color;
      }
      &:-ms-input-placeholder {
        font-size: $h3Font;
        line-height: 28px;
        color: $h3Color;
      }
    }
    .user-list, .topic-list {
      position: absolute;
      width: 275px;
      max-height: 317px;
      overflow-y: auto;
      border-radius: 2px;
      background-color: #fff;
      box-shadow: 0px 0px 10px 0px rgba(0,0,0,0.05);
      li {
        display: flex;
        align-items: center;
        height: 47px;
        padding: 0 16px;
        font-size: $h3Font;
        color: $h1Color;
        &:hover {
          background-color: $backColor;
        }
      }
    }
  }
</style>
