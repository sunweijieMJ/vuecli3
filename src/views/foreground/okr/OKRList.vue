<template>
  <div class="okr-list">
    okr-list
    <button @click="$store.dispatch('setOKRPublish', {status: true})">publish</button>
    <okr-publish></okr-publish>
  </div>
</template>
<script>
  import OkrPublish from './OKRPublish.vue';
  export default {
    components: {OkrPublish}
  };
</script>

