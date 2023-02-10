

<template>
  <view class="picker-wrap">
    <view class="picker" @click="show = true">
      <text v-if="!value" class="placeholder">{{ placeholder }}</text>
      <text v-else>{{ value }}</text>
      <u-icon name="arrow-down-fill" color="#c0c4cc" size="24" />
    </view>
    <u-picker mode="time" v-model="show" :params="params" :default-time="defaultTime" @confirm="change"></u-picker>
  </view>
</template>

<script>
export default {
  model: {
    prop: "modelValue",
    event: "update:modelValue",
  },
  props: {
    modelValue: {
      type: String,
      required: true
    },
    defaultTime: {
      type: String,
    },
    placeholder: {
      type: String,
      default: '请选择'
    },
  },
  data() {
    return {
      show: false,
      params: {
        year: true,
        month: true,
        day: true,
        hour: true,
        minute: true,
        second: false
      },
      value: '',
    }
  },
  watch: {
    modelValue() {
      if (this.value === '' && this.modelValue) {
        this.value = this.$dayjs(this.modelValue).format('YYYY-MM-DD HH:mm')
      }
    }
  },
  methods: {
    change(data) {
      this.value = `${data.year}-${data.month}-${data.day} ${data.hour}:${data.minute}`
      this.$emit('update:modelValue', this.value + ':00')
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
