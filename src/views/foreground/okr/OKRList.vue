<template>
  <div class="okr-list">
    <button @click="$store.dispatch('setOKRPublish', {status: true, okrId: 20})">setOKRPublish</button>
    <button @click="$store.dispatch('setTaskPublish', {status: true, taskId: 1})">setTaskPublish</button>
    <okr-publish></okr-publish>
    <task-publish></task-publish>
  </div>
</template>
<script>
  import OkrPublish from './OKRPublish.vue';
  import TaskPublish from '../task/TaskPublish.vue';

  export default {
    components: {OkrPublish, TaskPublish}
  };
</script>

