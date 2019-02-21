<template>
  <div class="publish">
    <textarea id="textarea" placeholder="写下你的评论..." v-model="textEnabled.text"
      @click="getFocus" @blur="textBlur"
      @propertychange="autoTextarea($event.target, 0, 184)" @input="autoTextarea($event.target, 0, 184) || getOffset($event)" @focus="textEnabled.status = true"
      ></textarea>
    <ul class="user-list" v-if="user_list.length" :style="{left: `${offset.left}px`}">
      <li v-for="(item, index) in user_list" :key="index" @click="selectUser(item)">{{`${item.user_name}(${item.real_name})`}}</li>
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
        user_list: []
      };
    },
    methods: {
      // 用户列表
      getUserList(keyword) {
        UserApi().getUserList({keyword}).then(res => {
          this.user_list = Object.values(res.data.list);
        });
      },
      // @click 光标索引
      getFocus(e) {
        let that = this;
        that.cursor = Cursor().getFocus(e.target);
        that.offset = Cursor().getInputPositon(e.target, that.$el);

        const text = e.target.value;
        if(!text) return;
        const offset_at = text.lastIndexOf('@', that.cursor - 1);
        if(offset_at === -1) return;
        const match_input = text.slice(offset_at, that.cursor);
        if(match_input.indexOf(' ') !== -1 || !match_input) {
          that.user_list = [];
        } else {
          that.getUserList(match_input.slice(1));
        }
      },
      // @input 光标坐标
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

        const text = e.target.value;
        const offset_at = text.lastIndexOf('@', that.cursor - 1);
        if(offset_at === -1) {
          that.user_list = [];
          return;
        }
        const match_input = text.slice(offset_at + 1, that.cursor);
        if(match_input.indexOf(' ') !== -1) return;
        that.getUserList(match_input);
      },
      textBlur() {
        setTimeout(() => {
          this.user_list = [];
        }, 200);
      },
      // 选择用户名
      selectUser(userInfo) {
        let that = this;
        const textarea = that.$el.querySelector('textarea');

        const text = that.textEnabled.text;
        const offset_at = text.lastIndexOf('@', that.cursor - 1);
        const offset_space = text.indexOf(' ', offset_at);
        if(that.cursor === text.length) {
          that.textEnabled.text = that.textEnabled.text.slice(0, offset_at) + '@' + userInfo.user_name + ' ';
        } else {
          if(offset_space === -1) {
            that.textEnabled.text = that.textEnabled.text.slice(0, offset_at) + '@' + userInfo.user_name + ' ' + that.textEnabled.text.slice(offset_at + 1);
          } else {
            that.textEnabled.text = that.textEnabled.text.slice(0, offset_at) + '@' + userInfo.user_name + ' ' + that.textEnabled.text.slice(offset_space + 1);
          }
        }

        that.user_list = [];
        textarea.focus();
      }
    },
    watch: {
      user_list(cur) {
        if(!cur.length) return;
        let that = this;
        that.$nextTick(() => {
          const userEle = that.$el.querySelector('.user-list');
          if(window.innerHeight - that.$el.getBoundingClientRect().bottom < userEle.offsetHeight) {
            userEle.style.top = `${that.offset.top - userEle.offsetHeight}px`;
          } else {
            userEle.style.top = `${that.offset.top + 25}px`;
          }
        });
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
    .user-list {
      position: absolute;
      width: 275px;
      max-height: 282px;
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
        cursor: pointer;
        &:hover {
          background-color: $backColor;
        }
      }
    }
  }
</style>
