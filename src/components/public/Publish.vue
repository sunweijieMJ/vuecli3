<template>
  <div class="publish">
    <textarea id="textarea" placeholder="写下你的评论..." v-model="textEnabled.text"
      @propertychange="autoTextarea($event.target, 0, 184)" @input="autoTextarea($event.target, 0, 184)" @focus="textEnabled.status = true"
      ></textarea>
    <ul class="user-list" v-if="user_list.length">
      <li v-for="(item, index) in user_list" :key="index">{{`${item.user_name}(${item.real_name})`}}</li>
    </ul>
    <ul class="topic-list" v-if="topic_list.length">
      <li v-for="(item, index) in topic_list" :key="index">{{item}}</li>
    </ul>
  </div>
</template>
<script>
  import UserApi from '../../api/User.js';
  import {autoTextarea} from '../../utils/business/tools.js';

  export default {
    props: ['textEnabled'],
    data() {
      return {
        autoTextarea,
        user_list: [],
        topic_list: []
      };
    },
    methods: {
      // 用户列表
      getUserList(e) {
        const textarea = this.$el.querySelector('textarea');
        if(e.data === '@') {
          const keyword = e.data;
          UserApi().getUserList({keyword: ''}).then(res => {
            this.user_list = Object.values(res.data.list);
          });
        }
      }
    }
  };
</script>
<style lang="scss" scoped>
  @import '../../assets/scss/_base.scss';

  .publish {
    position: relative;
    textarea {
      box-sizing: border-box;
      width: 100%;
      height: 48px;
      padding: 10px 20px;
      border-radius: 2px;
      font-size: 16px;
      line-height: 25px;
      resize: none;
      border: none;
      background: $backColor;
      &::placeholder {
        font-size: 16px;
        line-height: 28px;
        color: $h3Color;
      }
      &::-webkit-input-placeholder {
        font-size: 16px;
        line-height: 28px;
        color: $h3Color;
      }
      &:-moz-placeholder {
        font-size: 16px;
        line-height: 28px;
        color: $h3Color;
      }
      &::-moz-placeholder {
        font-size: 16px;
        line-height: 28px;
        color: $h3Color;
      }
      &:-ms-input-placeholder {
        font-size: 16px;
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
        font-size: 16px;
        color: $h1Color;
        &:hover {
          background-color: $backColor;
        }
      }
    }
  }
</style>
