<template>
  <view class="app-page">
    <view class="page-main">
      <scroll-view scroll-y style="height: 100%;">
        <view style="height: 1px;"></view>
        <view v-for="good in goodList" :key="good.id" class="good">
          <image :src="good.pic" class="img" />
          <view class="flex-col">
            <view class="title-wrap">
              <view class="title">{{ good.MeatName }}</view>
              <u-button class="btn" plain size="mini" type="primary" @click="navToEdit(good.id)">编辑</u-button>
            </view>
            <view class="content">
              <view class="row-item">
                <view class="tag">{{ good.MeatType }}</view>
              </view>
              <view class="row-item">
                <view class="price">￥{{ good.MeatPrice }}</view>
              </view>
              <view class="row-item">
                <text>添加人&nbsp;&nbsp;{{ good.creator }}</text>
              </view>
            </view>
          </view>
        </view>
      </scroll-view>
    </view>
    <float-button @click="navToAdd" />
  </view>
</template>

<script>
import mixin from './mixins/index'
import renderMixin from '@/mixin/render'

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
  onShow() {
    this.getList()
  },
  methods: {
    getList() {
      uni.showLoading({
        title: '加载中',
        mask: false
      });
      this.doGet('/food/shushi').then(res => {
        this.goodList = (res.data || []).map(val => {
          val.pic = this.getFileUrl(val.pic)
          return val
        })
      }).finally(() => {
        uni.hideLoading();
      })
    },
    navToAdd() {
      uni.navigateTo({
        url: '/pages/shitang/good-form?type=add'
      });
    },
    navToEdit(id) {
      uni.navigateTo({
        url: '/pages/shitang/good-form?type=edit&dataId=' + id
      });
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
    flex: 1;
  }

  .flex-between {
    display: flex;
    justify-content: space-between;
  }
}

.content {
  font-size: 13px;
  color: #999;

  .row-item {
    margin-top: 4px;
  }

  .price {
    color: #FF5500;
  }

  .tag {
    display: inline-block;
    // background-color: #ff671c;
    // color: #fff;
    border: 1px solid #ff671c;
    color: #ff671c;
    padding: 1px 5px;
    border-radius: 4px;
    font-size: 12px;
  }
}

.title-wrap {
  position: relative;

  .btn {
    position: absolute;
    right: 0;
    top: 0;
  }
}
</style>
