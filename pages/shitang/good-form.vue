<template>
  <view class="app-page">
    <view class="page-main">
      <scroll-view scroll-y style="height: 100%;">
        <view style="height: 1px;"></view>
        <u-form :model="formData" ref="uForm" :error-type="['toast']" label-width="140">
          <view class="card form-card">
            <u-form-item label="名称" prop="MeatName" required>
              <u-input v-model="formData.MeatName" placeholder="请输入名称" />
            </u-form-item>
            <u-form-item label="分类" prop="MeatType" required>
              <option-picker v-model="formData.MeatType" :list="MeatTypeOptions" placeholder="请选择分类" />
            </u-form-item>
            <u-form-item label="单价(元)" prop="MeatPrice" required>
              <u-input v-model="formData.MeatPrice" placeholder="请输入单价" type="number" />
            </u-form-item>
            <u-form-item label="备注">
              <u-input v-model="formData.Remarks" placeholder="请输入备注" />
            </u-form-item>
          </view>
          <view class="card">
            <view class="card-title">
              <view class="left"><text>附件</text></view>
            </view>
            <FileUploader :limit="1" @change="upload"></FileUploader>
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
        MeatName: '', // 名称
        MeatType: '', // 分类
        MeatPrice: 0, // 单价
        Remarks: '', // 备注
        pic: '', // 图片
      },
      files: [], // 附件
      rules: {
        MeatName: [{ required: true, message: '请输入名称', trigger: 'blur' }],
        MeatType: [{ required: true, message: '请选择分类', trigger: 'change' }],
      },
      MeatTypeOptions: [
        { label: '食品', value: '1' },
        { label: '日用品', value: '2' },
      ],
      type: null,
      dataId: null,
    };
  },
  onLoad({ type, dataId }) {
    this.type = type
    this.dataId = dataId
  },
  onReady() {
    this.$refs.uForm.setRules(this.rules);
    if (this.type === 'edit') {
      this.getDetail()
    } else {
      this.formData.MeatType = '1'
    }
  },
  methods: {
    // 回显数据
    getDetail() {
      this.doGet('/food/shushi', { item_id: this.dataId }).then(res => {
        this.formData = res.data[0]
        this.formData.MeatPrice = parseFloat(this.formData.MeatPrice)
      })
    },
    submit() {
      this.$refs.uForm.validate(valid => {
        if (!valid) return
        if ((this.formData.MeatPrice + '').trim() === '') {
          this.$u.toast('请输入单价')
          return
        }
        uni.showLoading({
          title: '正在提交',
          mask: true
        });
        const url = this.type === 'add' ? '/food/add' : '/food/update'
        if (this.files.length) {
          this.uploadFile(url, this.formData, this.files).then(() => {
            uni.navigateBack();
          }).finally(() => {
            uni.hideLoading();
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
