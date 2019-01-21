<template>
  <div class="okr-list">
    <button @click="$store.dispatch('setOKRPublish', {status: true, okrId: 8})">setOKRPublish</button>
    <hr>
    <button @click="$store.dispatch('setTaskPublish', {status: true})">setTaskPublish</button>
    <hr>
    <button @click="$store.dispatch('setTaskClose', {status: true})">setTaskClose</button>
    <hr>
    <button @click="$store.dispatch('setTaskFollow', {status: true})">setTaskFollow</button>
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
    components: {OkrPublish, TaskPublish, TaskClose, TaskFollow}
  };
</script>

