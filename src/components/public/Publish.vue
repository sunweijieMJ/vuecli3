<template>
  <div class="publish">
    <slot :input="getUserList"></slot>
    <ul class="user-list" v-if="user.length">
      <li v-for="(item, index) in user" :key="index">{{`${item.user_name}(${item.real_name})`}}</li>
    </ul>
    <ul class="topic-list" v-if="topic">
      <li v-for="(item, index) in topic" :key="index">{{item}}</li>
    </ul>
  </div>
</template>
<script>
  import UserApi from '../../api/User.js';

  export default {
    props: ['user', 'topic'],
    data() {
      return {
        user_list: []
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
    .user-list, .topic-list {
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
