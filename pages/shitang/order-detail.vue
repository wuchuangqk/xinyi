<template>
  <view class="app-page">
    <view class="page-main">
      <scroll-view scroll-y style="height: 100%;">
        <view style="height: 1px;"></view>
        <view v-for="good in goodList" :key="good.key" class="good">
          <image :src="good.pic" class="img" />
          <view class="flex-col">
            <view class="title">
              <text>{{ good.MeatName }}</text>
              <text class="price-wrap">￥<text class="price">{{ good.price }}</text></text>
            </view>
            <view class="content">
              <view class="row-item">数量：{{ good.MeatNum }}</view>
              <view class="row-item">单价：￥{{ good.MeatPrice }}</view>
            </view>
          </view>
        </view>
      </scroll-view>
    </view>
  </view>
</template>

<script>
import mixin from './mixins/index'
import Decimal from 'decimal.js';

export default {
  mixins: [mixin],
  data() {
    return {
      goodList: [], // 商品列表
      dataId: '', // 主键id
    };
  },
  onLoad({ dataId }) {
    this.dataId = dataId
  },
  onReady() {
    this.getDetail()
  },
  methods: {
    getDetail() {
      this.doGet(`/food/myorder/${this.dataId}`, { item_id: this.dataId }).then(res => {
        this.goodList = (res.data || []).map(val => {
          val.pic = this.getFileUrl(val.pic)
          val.price = Decimal.mul(val.MeatPrice, val.MeatNum)
          val.key = Symbol()
          return val
        })
      })
    },
  }
};
</script>
<style scoped lang="scss">
.good {
  display: flex;
  background-color: #fff;
  padding: 10px 14px;
  margin: 10px 0;

  .img {
    width: 90px;
    height: 90px;
    border-radius: 6px;
    flex-shrink: 0;
  }

  .flex-col {
    flex: 1;
    margin-left: 15px;
  }

  .title {
    font-weight: bold;
    font-size: 16px;
    display: flex;
    justify-content: space-between;
  }

  .content {
    font-size: 13px;
    color: #999;
  }

  .row-item {
    margin-top: 6px;
  }
}

.price-wrap {
  color: #FF5500;
  font-size: 13px;
  margin-left: 10px;

  .price {
    font-size: 16px;
  }
}
</style>
