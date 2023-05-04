<template>
  <view class="app-page">
    <view class="page-main">
      <scroll-view scroll-y style="height: 100%;">
        <view style="height: 1px;"></view>
        <view class="card">
          <view class="card-title">
            <view class="left"><text>公告内容</text></view>
          </view>
          <view class="input-bg">
            <uni-easyinput type="textarea" autoHeight v-model="formData.comments" placeholder="请输入公告内容"
              :inputBorder="false" :clearable="false" />
          </view>
        </view>
      </scroll-view>
    </view>
    <view class="app-page-footer">
      <button class="btn" @click="submit">保存</button>
    </view>
    <view style="display: none;" :renderParams="renderParams" :change:renderParams="renderModule.change"></view>
    <u-modal v-model="showDialog" content="保存成功" @confirm="doConfirm"></u-modal>
  </view>
</template>

<script>
import renderMixin from '@/mixin/render'

export default {
  mixins: [renderMixin],
  data() {
    return {
      formData: {
        comments: '', // 内容
      },
      showDialog: false,
    };
  },
  onReady() {
    this.getDetail()
  },
  methods: {
    getDetail() {
      uni.showLoading({
        title: '加载中',
        mask: true
      });
      this.doGet('/food/GetNoticeInfo').then(res => {
        this.formData.comments = res.data.title
      }).finally(() => {
        uni.hideLoading();
      })
    },
    submit() {
      if (this.formData.comments.trim() === '') {
        uni.showToast({
          title: '请输入公告内容',
          icon: 'none'
        });
        return
      }
      this.renderParams = this.setPostData(this.formData)
    },
    callback({ success, res }) {
      uni.hideLoading();
      if (success) {
        this.showDialog = true
      } else {
        this.renderParams = null
        this.handleError(res)
      }
    },
    doConfirm() {
      uni.navigateBack();
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
				axiosRequest('/food/UpdateNotice', renderParams, axios).then(res => {
					this.$ownerInstance.callMethod('callback', {
						success: true,
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
.input-bg {
  background-color: #f7f7f7;
  padding: 0 6px;
  border-radius: 2px;
}
</style>
