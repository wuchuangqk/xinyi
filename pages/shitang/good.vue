<template>
  <view class="app-page">
    <view class="notice">{{ notice }}</view>
    <view class="page-main">
      <scroll-view scroll-y style="height: 100%;">
        <view style="height: 1px;"></view>
        <view v-for="good in goodList" :key="good.id" class="good">
          <image :src="good.pic" class="img" />
          <view class="flex-col">
            <view class="title">{{ good.MeatName }}</view>
            <view class="flex-between">
              <text class="price-wrap">￥<text class="price">{{ good.MeatPrice }}</text></text>
              <view class="app-flex-center">
                <view v-show="good.num > 0" class="btn default" @click="good.num--">-</view>
                <view v-show="good.num > 0" class="count">{{ good.num }}</view>
                <view class="btn default" @click="good.num++">+</view>
              </view>
            </view>
          </view>
        </view>
      </scroll-view>
    </view>
    <view class="app-page-footer">
      <view class="p1">
        <text>总价：</text>
        <text class="price-wrap">￥<text class="price">{{ totalPrice }}</text></text>
      </view>
      <view class="btn1" :class="{ disabled: !canSubscribe }" @click="submit">
        <text>{{ canSubscribe ? '预约' : '暂不可预约' }}</text>
        <text v-show="totalCount > 0">({{ totalCount }})</text>
      </view>
    </view>
    <u-modal v-model="showDialog" content="预约成功" @confirm="doConfirm"></u-modal>
    <view style="display: none;" :renderParams="renderParams" :change:renderParams="renderModule.change"></view>
  </view>
</template>

<script>
import mixin from './mixins/index'
import renderMixin from '@/mixin/render'
import Decimal from 'decimal.js';

export default {
  mixins: [mixin, renderMixin],
  data() {
    return {
      goodList: [], // 商品列表
      type: null,
      canSubscribe: false, // 是否可以预约
      notice: null, // 通知
      showDialog: false,
      orderId: null,
    };
  },
  computed: {
    totalPrice() {
      return this.goodList.reduce((sum, val) => {
        return Decimal.add(sum, Decimal.mul(val.MeatPrice, val.num))
      }, 0)
    },
    totalCount() {
      return this.goodList.reduce((sum, val) => {
        return sum + val.num
      }, 0)
    }
  },
  onLoad({ type }) {
    this.type = type
  },
  onReady() {
    uni.setNavigationBarTitle({
      title: this.type === 'food' ? '食品' : '日用品'
    })
    this.getNotice()
  },
  onShow() {
    this.getList()
  },
  methods: {
    getNotice() {
      this.doGet('/food/notice').then(res => {
        this.notice = res.data.title;
      })
    },
    getList() {
      uni.showLoading({
        title: '加载中',
        mask: false
      });
      const url = this.type === 'food' ? '/food/shushibuy' : '/food/dailybuy'
      this.doGet(url).then(res => {
        this.goodList = (res.data.data || []).map(val => {
          val.pic = this.getFileUrl(val.pic)
          val.num = 0
          val.checked = true
          val.totalPrice = 0
          return val
        })
        this.canSubscribe = res.data.hasright;
      }).finally(() => {
        uni.hideLoading();
      })
    },
    submit() {
      if (!this.canSubscribe) {
        return
      }
      if (this.totalCount === 0) {
        uni.showToast({
          title: '请选择商品',
          icon: 'none'
        });
        return
      }
      uni.showLoading({
        title: '正在提交',
        mask: true,
      });
      const data = this.goodList.filter(val => {
        val.totalPrice = Decimal.mul(val.MeatPrice, val.num)
        return val.num > 0
      })
      this.renderParams = {
        url: this.type === 'food' ? '/food/shushiorder' : '/food/dailyorder',
        data: this.setPostData({
          data: JSON.stringify(data)
        })
      }
    },
    callback({ success, res }) {
      uni.hideLoading();
      if (success) {
        this.orderId = res.data.id
        this.showDialog = true
      } else {
        this.renderParams = null
        this.handleError(res)
      }
    },
    // 跳转到详情
    doConfirm() {
      uni.navigateTo({
        url: '/pages/shitang/order-detail?dataId=' + this.orderId
      });
    }
  }
};
</script>
<script module="renderModule" lang="renderjs">
import axios from 'axios'
import { axiosRequest } from '@/util/post.js'
export default {
  methods: {
		change(renderParams) {
			if (renderParams !== null) {
				axiosRequest(renderParams.url, renderParams.data, axios).then(res => {
					this.$ownerInstance.callMethod('callback', {
						success: true,
            res
					})
				}).catch(err => {
					this.$ownerInstance.callMethod('callback', {
						success: false,
						res: err
					})
				})
			}
		}
  },
}
</script>
<style scoped lang="scss">
.notice {
  background: #fdf6ec;
  color: #ff9900;
  padding: 9px 12px;
  font-size: 13px;
}

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
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    margin-left: 15px;
  }

  .title {
    font-weight: bold;
    font-size: 16px;
  }

  .flex-between {
    display: flex;
    justify-content: space-between;
  }

  .count {
    margin: 0 15px;
  }

  .btn {
    width: 22px;
    height: 22px;
    border-radius: 6px;
    font-size: 22px;
    text-align: center;
    line-height: 19px;

    &.primary {
      background-color: #f5ca49;
    }

    &.default {
      border: 1px solid #ccc;
    }
  }
}

.app-page-footer {
  background-color: #fff;
  padding: 6px 10px;
  display: flex;
  justify-content: space-between;
  height: 50px;
  align-items: center;
  box-shadow: 0 -1px 5px rgba(0, 0, 0, 0.1);
  z-index: 1;

  .btn1 {
    height: 100%;
    background-color: #ff5500;
    color: #fff;
    padding: 0 20px;
    font-size: 16px;
    display: flex;
    align-items: center;
    border-radius: 40px;

    &.disabled {
      background-color: #999;
    }
  }
}

.price-wrap {
  color: #FF5500;
  font-size: 13px;

  .price {
    font-size: 18px;
  }
}
</style>
