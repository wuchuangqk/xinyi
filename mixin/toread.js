const mixin = {
  methods: {
    handleTodo(item) {
      const { id, activityname } = item
      switch (activityname) {
        // 通知公告
        case 'message':
          uni.navigateTo({
            url: `/pages/notice/detail?dataId=${id}`,
          });
          break
        default:
          this.$u.toast('该功能正在开发中')
      }
    }
  }
}

export default mixin