<template>
  <view class="app-page">
    <view class="page-main">
      <view v-html="tableData" class="table-wrap"></view>
    </view>
  </view>
</template>
<script>
import listMixin from '@/mixin/list'
export default {
  mixins: [listMixin],
  data() {
    return {
      tableData: '',
      type: null,
    }
  },
  onLoad({ type }) {
    this.type = type
  },
  onReady() {
    uni.setNavigationBarTitle({
      title: this.type === 'food' ? '食品台账' : '日用品台账'
    })
    this.fetchData()
  },
  methods: {
    fetchData() {
      uni.showLoading({
        title: '加载中',
        mask: false
      });
      const url = this.type === 'food' ? '/food/shushitaizhang' : '/food/dailytaizhang'
      this.doGet(url).then(res => {
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