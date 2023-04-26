<template>
  <view class="app-page">
    <view class="page-main">
      <scroll-view v-if="orderList.length" scroll-y style="height: 100%;" @scrolltolower="nextPage">
        <view class="list-wrap">
          <view v-for="item in orderList" :key="item.id" class="app-list-item" @click="navToDetail(item.id)">
            <view class="item-title">
              <text>{{ item.ordername }}</text>
            </view>
            <view class="app-flex-between color-gray item-sub">
              <view>
                <text class="label">下单时间：</text>
                <text class="value">{{ item.time }}</text>
              </view>
              <view>
                <text class="label">合计：</text>
                <text class="value">￥{{ item.price }}</text>
              </view>
            </view>
          </view>
        </view>
      </scroll-view>
      <page-empty v-else />
    </view>
  </view>
</template>

<script>

export default {
  data() {
    return {
      orderList: [], // 商品列表
    };
  },
  onReady() {
    this.getOrderList()
  },
  methods: {
    getOrderList() {
      this.doGet(`/food/myorder`).then(res => {
        this.orderList = (res.data || []).map(val => {
          val.ordername = val.ordername.split(',').join('、');
          val.time = this.$dayjs(val.time).format('YYYY-MM-DD HH:mm:ss')
          return val
        })
      })
    },
    navToDetail(id) {
      uni.navigateTo({
        url: '/pages/shitang/order-detail?dataId=' + id
      });
    }
  }
};
</script>
<style scoped lang="scss">
.item-title {
  -webkit-line-clamp: 2;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
