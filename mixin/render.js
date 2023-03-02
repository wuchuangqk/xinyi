
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