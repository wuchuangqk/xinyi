<template>
  <view class="app-page">
    <view class="page-main">
      <scroll-view scroll-y style="height: 100%;">
        <u-form :model="formData" ref="uForm" :error-type="['toast']">
          <view class="card form-card">
            <u-form-item label="标题" prop="noticetitle" required><u-input v-model="formData.noticetitle"
                placeholder="请输入标题" /></u-form-item>
            <u-form-item label="内容" prop="noticecontent" required><u-input v-model="formData.noticecontent"
                placeholder="请输入内容" type="textarea" auto-height /></u-form-item>
          </view>
          <view class="card">
            <view class="card-title">
              <view class="left"><text>附件</text></view>
            </view>
            <file-viewer @change="upload"></file-viewer>
          </view>
        </u-form>
      </scroll-view>
    </view>
    <view class="app-page-footer">
      <button class="btn" @click="submit">提交</button>
    </view>
  </view>
</template>

<script>
import AppSelect from '@/components/app-select.vue';
import FileViewer from '@/components/file-uploader.vue';

export default {
  components: { AppSelect, FileViewer },
  data() {
    return {
      formData: {
        noticetitle: '', // 标题
        noticecontent: '', // 内容
      },
      files: [], // 附件
      rules: {
        noticetitle: [{ required: true, message: '请输入标题', trigger: 'blur' }],
        noticecontent: [{ required: true, message: '请输入内容', trigger: 'blur' }],
      },
    };
  },
  onReady() {
    this.$refs.uForm.setRules(this.rules);
  },
  methods: {
    submit() {
      this.$refs.uForm.validate(valid => {
        if (!valid) return
        uni.showLoading({
          title: '正在提交',
          mask: true
        });
        this.renderModule.post(this.formData, this.files)
      });
    },
    callback(success, res) {
      uni.hideLoading();
      if (success) {
        uni.navigateBack();
      } else {
        uni.showToast({
          title: res.status === 500 ? '未知错误' : res.data.msg,
          icon: 'none'
        });
      }
    },
    // 上传附件
    upload(files) {
      this.files = files;
    },
  }
};
</script>
<script module="renderModule" lang="renderjs">
import axios from 'axios'
export default {
  methods: {
    post(data, files) {
      this.doPost('/notices/notices_add', data, axios, files).then(res => {
				this.callback(true)
      }).catch(err => {
				this.callback(false, err.response)
      })
    }
  },
}
</script>

<style scoped lang="scss">

</style>
