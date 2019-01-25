<template>
  <div class="task-check">
    <li v-for="(item, index) in check_list" :key="index" @click="handleTask(item)">
      <i :class="item.icon"></i>
      <span>{{item.name}}</span>
    </li>
  </div>
</template>
<script>
  export default {
    props: ['item'],
    data() {
      return {
        check_list: [
          {
            name: '跟进',
            icon: 'el-icon-edit-outline'
          },
          {
            name: '编辑',
            icon: 'el-icon-edit-outline'
          },
          {
            name: '完成',
            icon: 'el-icon-edit-outline'
          },
          {
            name: '添加Task',
            icon: 'el-icon-edit-outline'
          }
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
          case '完成':
            that.$store.dispatch('setTaskClose', {status: true, parent: that.item});
            break;
          case '添加Task':
            that.$store.dispatch('setTaskPublish', {status: true, type: 'create', parent: that.item});
            break;
          default:
            break;
        }
      }
    }
  };
</script>
<style lang="scss" scoped>
  .task-check {
    transition: all 0.5s;
    position: absolute;
    right: 0;top: 0;
    display: flex;
    align-items: center;
    height: 100%;
    padding: 0 35px 0 130px;
    opacity: 0;
    &:hover {
      opacity: 1;
      background: linear-gradient(to right, rgba(255,255,255,0) 0%, rgba(255,255,255,1) 30%);
    }
    li {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 70px;
      margin-left: 20px;
      cursor: pointer;
      i {
        font-size: 33px;
        color: #000;
      }
      span {
        font-size: $h3Font;
        color: $h1Color;
      }
    }
  }
</style>

