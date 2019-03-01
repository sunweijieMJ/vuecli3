export default {
  methods: {
    // 返回
    back() {
      this.$router.back();
    },
    // query传值
    querySkip(name, query) {
      this.$router.push({name, query});
    },
    // params传值
    paramsSkip(name, params) {
      this.$router.push({name, params});
    },
    // path
    pathSkip(url) {
      window.open(url, '_blank');
    },
    // 大图展示
    showImage(source, index) {
      this.$store.dispatch('changeImgPopup', {status: true, source, index});
    }
  }
};
