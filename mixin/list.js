
const listMixin = {
  data() {
    return {
      tabItems: [
        {
          name: '申请',
          icon: 'icon-shenqing1',
        },
        {
          name: '待办',
          icon: 'icon-daiban',
        },
        {
          name: '已办',
          icon: 'icon-yibanrenwu',
        },
        {
          name: '流程监控',
          icon: 'icon-liucheng1',
        }
      ],
      activeTabIndex: 0,
      params: {
        title: '', // 标题
        pageindex: 1,
      },
      listData: [],
      hasnext: '0',
    }
  },
  methods: {
    async fetchData() {
      uni.showLoading({
        title: '加载中',
        mask: false
      });
      this.doGet(this.pathList[this.activeTabIndex], this.params).then(res => {
        console.log(res);
        this.listData = this.listData.concat(res.data)
        this.hasnext = res.hasnext
        uni.hideLoading();
      }).catch(() => {
        uni.hideLoading();
      })
    },
    /**
     * 翻页（加载更多）
     */
    nextPage() {
      if (this.hasnext === '1') {
        this.params.pageindex++
        this.fetchData()
      }
    },
    /**
     * 下拉刷新
     */
    refresh() {
      this.params.pageindex = 1
      this.fetchData()
    },
    /**
     * 搜索
     */
    search() {
      this.params.pageindex = 1
      this.fetchData()
    },
    /**
     * 切换tab
     * @param {*} index 
     */
    changeTab(index) {
      this.activeTabIndex = index
      this.listData = []
      this.fetchData()
    }
  }
}

export default listMixin