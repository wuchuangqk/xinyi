<template>
  <view class="empty">
    <image src="/static/img/empty.png" class="empty-img"></image>
    <view>
      {{text}}
    </view>
  </view>
</template>

<script>
export default {
  name: "Empty",
  props: {
    text: {
      type: String,
      default: "暂无数据",
    },
  },
  data() {
    return {};
  },
  methods: {},
};
</script>

<style lang="scss">
.empty {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #999;
  padding-bottom: 30%;
  box-sizing: border-box;
  .empty-img {
    width: 400rpx;
    height: 400rpx;
  }
}
</style>