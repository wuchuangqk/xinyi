<template>
  <view class="app-page">
    <view class="page-main">
      <view v-html="tableData" class="table-wrap"></view>
    </view>
    <list-tabbar :tab-items="tabItems" @change="changeTab" />
  </view>
</template>
<script>
import listMixin from '@/mixin/list'
export default {
  mixins: [listMixin],
  data() {
    return {
      pathList: [
        '/food/shushitaizhang',
        '/food/dailytaizhang',
      ],
      tabItems: [
        {
          name: '食品',
          icon: 'icon-shenqing1',
        },
        {
          name: '日用品',
          icon: 'icon-daiban',
        },
      ],
      tableData: '',
    }
  },
  onShow() {
    this.tableData = ''
    this.fetchData()
  },
  methods: {
    async fetchData() {
      uni.showLoading({
        title: '加载中',
        mask: false
      });
      this.doGet(this.pathList[this.activeTabIndex]).then(res => {
        this.tableData = res.data
        uni.hideLoading();
      }).catch(() => {
        uni.hideLoading();
      })
    },
  }
}
</script>
<style scoped lang="scss">
/deep/ .table-wrap {
  overflow: auto;
  padding: 50px 10px;
  background-color: #fff;

  table,
  th,
  td {
    border: 1px solid #d7d7d7;
  }

  table {
    border-collapse: collapse;
    font-size: 13px;
    line-height: 40px;
    text-align: center;
    min-width: 100%;
  }

  td:first-of-type {
    min-width: 200px;
  }

  td {
    min-width: 100px;
  }
}
</style>