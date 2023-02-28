

<template>
  <view class="picker-wrap">
    <view class="picker" @click="navToSelect">
      <text v-if="selectedUsers.length === 0" class="placeholder">{{ placeholder }}</text>
      <text v-else>{{ selectedUsers.map(v => v.displayname).join('，') }}</text>
      <u-icon v-if="!disabled" name="arrow-right" color="#c0c4cc" size="24" />
    </view>
  </view>
</template>

<script>
export default {
  props: {
    selectedUsers: {
      type: Array,
      required: true
    },
    placeholder: {
      type: String,
      default: '请选择'
    },
    disabled: {
      type: Boolean,
      default: false
    },
    url: {
      type: String,
      default: '/pages/jiaban/select-user'
    }
  },
  data() {
    return {

    }
  },
  methods: {
    navToSelect() {
      if (this.disabled) return
      uni.navigateTo({
        url: this.url
      });
    }
  }
}
</script>

<style scoped lang="scss">
.picker-wrap {
  position: relative;
  flex: 1;
}

.picker {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.placeholder {
  color: #c0c4cc;
}
</style>
