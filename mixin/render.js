
const mixin = {
  data() {
    return {
      from: '',
      renderParams: null
    }
  },
  methods: {
    callback({ success, res }) {
      uni.hideLoading();
      if (success) {
        this.back()
      } else {
        this.renderParams = null
        this.handleError(res)
      }
    },
    back() {
      // 如果是从快捷申请进来的，返回的时候跳到列表页面
      if (this.from && this.from === 'shortcut') {
        uni.redirectTo({
          url: this.listPath
        });
      } else {
        uni.navigateBack();
      }
    }
  }
}

export default mixin