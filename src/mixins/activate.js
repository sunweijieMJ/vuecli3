export default {
  // 激活keep-alive
  activated() {
    this.disabled = false;
  },
  // 停用keep-alive
  deactivated() {
    this.disabled = true;
  }
};
