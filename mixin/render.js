
const mixin = {
  data() {
    return {
      renderParams: null
    }
  },
  methods: {
    callback({ success, res }) {
      uni.hideLoading();
      if (success) {
        uni.navigateBack();
      } else {
        this.renderParams = null
        this.handleError(res)
      }
    },
  }
}

export default mixin