const mixin = {
  methods: {
    handleTodo(item) {
      const { id, activityname } = item
      let url = ''
      let isReject = ''
      switch (activityname) {
        // 请假审批
        case 'qingjiado':
          url = '/qingjia/shenpi_detail'
          break
        // 加班审批
        case 'jiabando':
          url = '/jiaban/shenpi_detail'
          break
        // 综合审批
        case 'zhspdo':
          url = '/zhsp/zhsp_detail'
          break
        // 资产购置审批
        case 'zhigou':
          url = '/zhigou/zhigou_detail'
          break
        // 用章审批
        case 'yysp':
          url = '/ying/detail'
          isReject = '1'
          break
        // 出差审批
        case 'chucawdo':
          url = '/waichu/shenpi_detail'
          break
        // 接待审批
        case 'chucawdo':
          url = '/jiedai/detail'
          break
      }
      uni.navigateTo({
        url: `/pages/leave-list/leave-detail?dataId=${id}&url=${url}&isApprove=1&&isReject=${isReject}`,
      });
    }
  }
}

export default mixin