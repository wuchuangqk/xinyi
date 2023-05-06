<template>
  <view class="app-page">
    <view class="page-main">
      <scroll-view scroll-y style="height: 100%;">
        <view style="height: 1px;"></view>
        <u-form :model="formData" ref="uForm" :error-type="['toast']" label-width="150">
          <view class="card form-card">
            <u-form-item label="外出时间" prop="StartDate" required>
              <date-picker v-model="formData.StartDate" :defaultTime="formData.StartDate" placeholder="请选择外出时间" />
            </u-form-item>
            <u-form-item label="外出事由" prop="Situation" required>
              <u-input v-model="formData.Situation" placeholder="请输入外出事由" type="textarea" auto-height />
            </u-form-item>
            <u-form-item label="备注">
              <u-input v-model="formData.Beizhu" placeholder="请输入备注" type="textarea" auto-height />
            </u-form-item>
          </view>
          <view class="card">
            <view class="card-title">
              <view class="left"><text>附件</text></view>
            </view>
            <FileUploader @change="upload"></FileUploader>
          </view>
        </u-form>
      </scroll-view>
    </view>
    <view class="app-page-footer">
      <button class="btn" @click="submit">提交</button>
    </view>
    <view style="display: none;" :renderParams="renderParams" :change:renderParams="renderModule.change"></view>
  </view>
</template>

<script>
import FileUploader from '@/components/file-uploader.vue';
import renderMixin from '@/mixin/render'

export default {
  components: { FileUploader },
  mixins: [renderMixin],
  data() {
    return {
      formData: {
        StartDate: '', // 外出时间
        Situation: '', // 事由
        Beizhu: '', // 备注
      },
      files: [], // 附件
      rules: {
        StartDate: [{ required: true, message: '请选择外出时间', trigger: 'change' }],
        Situation: [{ required: true, message: '请输入外出事由', trigger: 'blur' }],
      },
      type: null,
      dataId: null,
      listPath: '/pages/waichu/list',
    };
  },
  onLoad({ dataId, type, from }) {
    this.dataId = dataId
    this.type = type
    this.from = from
  },
  onReady() {
    uni.setNavigationBarTitle({
      title: this.type === 'add' ? '外出申请' : '修改外出申请'
    })
    this.$refs.uForm.setRules(this.rules);
    if (this.type === 'edit') {
      this.doGet('/beout/info', { id: this.dataId }).then(res => {
        this.formData.Id = this.dataId
        this.formData.StartDate = res.data.StartDate
        this.formData.Situation = res.data.Situation
        this.formData.Beizhu = res.data.Beizhu
      })
    } else {
      this.formData.StartDate = this.$dayjs().format('YYYY-MM-DD HH:mm:00')
    }
  },
  methods: {
    submit() {
      this.$refs.uForm.validate(valid => {
        if (!valid) return
        uni.showLoading({
          title: '正在提交',
          mask: true
        });
        const url = this.type === 'add' ? '/beout/add' : '/beout/update'
        if (this.files.length) {
          this.uploadFile(url, this.formData, this.files).then(() => {
            this.back()
          })
        } else {
          this.renderParams = {
            url,
            data: this.setPostData(this.formData)
          }
        }
      });
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
import { axiosRequest } from '@/util/post.js'
export default {
  methods: {
		change(renderParams) {
			if (renderParams !== null) {
				axiosRequest(renderParams.url, renderParams.data, axios).then(res => {
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

<style scoped lang="scss"></style>
