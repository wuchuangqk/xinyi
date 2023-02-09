<script>
export default {
  // 应用启动时调用，应用生命周期里只执行一次
  onLaunch() {
  },
  onShow() {
  },
  data() {
    return {};
  },
  methods: {
  }
};
</script>
<style lang="scss">
@import "uview-ui/index.scss";

html,
body {
  user-select: auto;
  color: #333333;
  font-size: 28rpx;
}

ul {
  padding: 0;
  list-style: none;
  margin: 0;
}

.uni-navbar__content {
  width: 100%;
}

.card {
  padding: 15rpx;
  background-color: white;
  margin: 10rpx;
  border-radius: 8rpx;

  .card-title {
    display: flex;
    justify-content: space-between;
    margin-bottom: 5rpx;

    .left {
      color: #b1b1b1;
    }
  }
}

.rich-text {
  img {
    max-width: 100%;
    height: auto;
  }
}

.app-text-overflow {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  word-break: break-all;
}

.app-flex-between {
  display: flex;
  justify-content: space-between;
}

.app-flex-center {
  display: flex;
  justify-content: center;
  align-items: center;
}

.flex {
  display: flex;
}

page {
  height: 100%;
}

.app-page {
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
  background-color: #f7f7f7;
}

.page-main {
  flex: 1;
  overflow: hidden;
}

.list-wrap {
  padding: 0 10rpx 16rpx;
}

.app-list-item {
  padding: 20rpx 14rpx;
  background: #ffffff;
  border-radius: 10rpx;
  margin-bottom: 16rpx;

  &:last-of-type {
    margin-bottom: 0;
  }

  .primary {
    color: #f3603f;
  }

  .state {
    margin-right: 16rpx;
  }

  .item-title {
    font-size: 30rpx;
    margin-bottom: 20rpx;
  }

  .item-sub {
    font-size: 26rpx;
    display: flex;
    justify-content: space-between;
    margin-bottom: 16rpx;
    word-break: break-all;
    text-align: right;

    .label {
      color: rgba(51, 51, 51, 0.62);
      flex-shrink: 0;
      margin-right: 20rpx;
    }
  }
}

.list-search-wrap {
  background-color: white;
  padding: 5px;
  margin-bottom: 8px;
}
</style>
