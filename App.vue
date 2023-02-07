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
html,
body {
  user-select: auto;
}

page {
  height: 100%;
  color: #333333;
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
  padding: 15px;
  background-color: white;
  margin: 10px;
  border-radius: 8px;

  .card-title {
    display: flex;
    justify-content: space-between;
    margin-bottom: 5px;

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
</style>
