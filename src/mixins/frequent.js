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
    // 大图展示
    showImage(source, index) {
      this.$store.dispatch('changeImgPopup', {status: true, source, index});
    }
  }
};
