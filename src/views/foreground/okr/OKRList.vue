<template>
  <div class="okr-list">
    okr-list
    <button @click="$store.dispatch('setOKRPublish', {status: true})">setOKRPublish</button>
    <button @click="$store.dispatch('setTaskPublish', {status: true})">setTaskPublish</button>
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

