<script>
import checkUpdate from '@/uni_modules/uni-upgrade-center-app/utils/check-update.js'
export default {
  // 应用启动时调用，应用生命周期里只执行一次
  onLaunch() {
		const platform = uni.getSystemInfoSync().platform
		if (platform === 'android') {
			checkUpdate()
		}
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
  margin: 10px 8px 0;
  border-radius: 8rpx;

  &.form-card {
    padding-left: 24rpx;
  }

  .card-title {
    display: flex;
    justify-content: space-between;
    margin-bottom: 15px;

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

.flex-1 {
  flex: 1;
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
    flex-shrink: 0;
  }

  .item-title {
    font-size: 30rpx;
    margin-bottom: 16rpx;
  }

  .item-sub {
    margin-top: 4px;
  }
}

.list-search-wrap {
  background-color: white;
  padding: 5px;
  margin-bottom: 8px;
}

.color-gray {
  color: #b5b5b5;
  font-size: 26rpx;
}

.app-page-footer {
  padding: 10rpx;

  .btn {
    background-color: #3880ff;
    color: white;
    font-size: 28rpx;
    line-height: 3;
  }
}
</style>
