<template>
  <div class="okr-list">
    <button @click="$store.dispatch('setOKRPublish', {status: true})">创建OKR</button>
    <hr>
    <input type="number" v-model="okrId" :style="{background:'#ccc'}">
    <button @click="$store.dispatch('setOKRPublish', {status: true, okrId})">编辑OKR</button>
    <hr>
    <button @click="$store.dispatch('setTaskPublish', {status: true})">创建Task</button>
    <!-- <hr> -->
    <!-- <button @click="$store.dispatch('setTaskPublish', {status: true})">编辑Task</button> -->
    <hr>
    <button @click="$store.dispatch('setTaskClose', {status: true})">关闭Task</button>
    <hr>
    <button @click="$store.dispatch('setTaskFollow', {status: true})">跟进Task</button>
    <okr-publish></okr-publish>
    <task-publish></task-publish>
    <task-close></task-close>
    <task-follow></task-follow>
  </div>
</template>
<script>
  import OkrPublish from './popup/OKRPublish.vue';
  import TaskClose from './popup/TaskClose.vue';
  import TaskFollow from './popup/TaskFollow.vue';
  import TaskPublish from '../task/TaskPublish.vue';

  export default {
    components: {OkrPublish, TaskPublish, TaskClose, TaskFollow},
    data() {
      return {
        okrId: 5
      };
    }
  };
</script>

