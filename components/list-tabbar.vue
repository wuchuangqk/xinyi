<template>
  <view class="app-tab-bar">
    <view class="tab-item" v-for="(item, index) in tabItems" :key="index" :class="{ active: index === activeTabIndex }"
      @click="change(index)">
      <icon-font :icon="item.icon" class="tab-icon"></icon-font>
      <text class="tab-name">{{ item.name }}</text>
    </view>
  </view>
</template>

<script>
import IconFont from '@/components/icon-font.vue';
export default {
  name: "list-tabbar",
  components: { IconFont },
  props: {
    tabIndex: {
      type: Number,
      default: 0
    },
    tabItems: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      activeTabIndex: 0,
    };
  },
  created() {
    this.activeTabIndex = this.tabIndex
  },
  methods: {
    change(tabIndex) {
      this.activeTabIndex = tabIndex
      this.$emit('change', tabIndex)
    },
  }
}
</script>

<style lang="scss" scoped>
.app-tab-bar {
  display: flex;
  border-top: 1px solid #dadada;
  height: 50px;
  box-sizing: border-box;
  background-color: white;

  .tab-item {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    color: #a5a5a7;

    &.active {

      .tab-name,
      .tab-icon {
        color: #1989fa;
      }
    }
  }

  .tab-icon {
    font-size: 18px;
  }

  .tab-name {
    color: rgb(153, 153, 153);
    font-size: 10px;
    margin-top: 3px;
  }
}
</style>
