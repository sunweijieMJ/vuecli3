<template>
  <div class="task-check" v-if="item.status === 1 && (item.task_owner_id === self_info.user_id || (item.participants ? item.participants.includes(self_info.user_id) : false))">
    <li v-for="(menuitem, index) in check_list" :key="index" @click.stop="handleTask(menuitem)"
      v-if="(item.is_key_task && (item.participants && item.participants.includes(self_info.user_id)) && menuitem.name === '添加Task') || (item.task_owner_id === self_info.user_id && menuitem.name !== '添加Task')">
      <i :class="menuitem.icon" class="iconfont"></i>
      <span>{{menuitem.name}}</span>
    </li>
  </div>
</template>
<script>
  import {mapState} from 'vuex';

  export default {
    props: ['item'],
    data() {
      return {
        check_list: [
          {
            name: '跟进',
            icon: 'icon-icon_check_l'
          },
          {
            name: '编辑',
            icon: 'icon-okrziyuan-'
          },
          {
            name: '关闭',
            icon: 'icon-icon_close_l1'
          },
          // {
          //   name: '添加Task',
          //   icon: 'icon-icon_add_l1'
          // }
        ]
      };
    },
    methods: {
      handleTask(item) {
        let that = this;
        switch (item.name) {
          case '跟进':
            that.$store.dispatch('setTaskFollow', {status: true, parent: that.item});
            break;
          case '编辑':
            that.$store.dispatch('setTaskPublish', {status: true, type: 'edit', taskId: that.item.task_id});
            break;
          case '关闭':
            that.$store.dispatch('setTaskClose', {status: true, parent: that.item});
            break;
          case '添加Task':
            that.$store.dispatch('setTaskPublish', {status: true, type: 'create', parent: that.item});
            break;
          default:
            break;
        }
      }
    },
    computed: mapState({
      self_info: store => store.self_info
    })
  };
</script>
<style lang="scss" scoped>
  .task-check {
    transition: all 0.5s;
    position: absolute;
    right: 0;top: 0;
    box-sizing: border-box;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    width: 50%;
    height: 100%;
    padding-right: 35px;
    opacity: 0;
    li {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 70px;
      margin-left: 20px;
      font-weight: normal;
      cursor: pointer;
      @extend %alllight;
      i {
        font-size: 33px;
        line-height: 1;
        color: #000;
      }
      span {
        font-size: $h3Font;
        color: $h1Color;
      }
    }
  }
</style>

