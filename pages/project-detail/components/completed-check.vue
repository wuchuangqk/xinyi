<template>
	<view class="tab-page">
		<uni-collapse accordion="true">
			<uni-collapse-item :showAnimation="true" title="分段验收" class="title-color-type1">
				<view class="expanded-content">
					<view class="list-item" v-for="tender in sectionAcceptance" @click="getDetail(tender)">
						<view class="list-item-title">{{ '(' + tender.contractCode + ') ' + tender.contractName }}</view>
						<view class="info">
							<view class="info-item">
								<view class="icon"><!-- <img src="assets/icon/user.png" alt=""> --></view>
								<text>主持单位:{{ tender.mainDepartment }}</text>
							</view>
							<view class="info-item">
								<view class="icon"><!-- <img src="assets/icon/user2.png" alt=""> --></view>
								<text>参与单位:{{ tender.partakeDepartment }}</text>
							</view>
						</view>
					</view>
				</view>
			</uni-collapse-item>
			<uni-collapse-item :showAnimation="true" title="综合验收" class="title-color-type2">
				<view class="expanded-content">
					<view>
						<text class="label">主持单位：</text>
						<text class="value">{{ comprehensiveAcceptance.mainDepartment }}</text>
					</view>
					<view>
						<text class="label">参与单位：</text>
						<text class="value">{{ comprehensiveAcceptance.partakeDepartment }}</text>
					</view>
					<view>
						<text class="label">验收组成员：</text>
						<text class="value">{{ comprehensiveAcceptance.examineMember }}</text>
					</view>
					<view>
						<text class="label">验收通过情况：</text>
						<text class="value">{{ comprehensiveAcceptance.examineDataConclusion }}</text>
					</view>
					<view>
						<text class="label">验收意见书：</text>
						<text class="value">{{ comprehensiveAcceptance.examineConclusion }}</text>
					</view>
					<view>
						<text class="label">存在问题：</text>
						<text class="value">{{ comprehensiveAcceptance.problem }}</text>
					</view>
					<view>
						<text class="label">验收日期：</text>
						<text class="value">{{ comprehensiveAcceptance.examineTime }}</text>
					</view>
					<view class="file">
						<view class="label">相关附件</view>
						<file-viewer :files="comprehensiveAcceptance.sysFileForms || []" platform="project"></file-viewer>
					</view>
				</view>
			</uni-collapse-item>
			<uni-collapse-item :showAnimation="true" title="财务决算" class="title-color-type3">
				<view class="expanded-content">
					<view>
						<text class="label">核定总投资：</text>
						<text class="value">{{ financialStatements.investmentAll || 0 }} [万元]</text>
					</view>
					<view>
						<text class="label">固定资产交付时间：</text>
						<text class="value">{{ financialStatements.deliverTime }}</text>
					</view>
					<view>
						<text class="label">备注：</text>
						<text class="value">{{ financialStatements.remark }}</text>
					</view>
					<view class="file">
						<view class="label">相关附件</view>
						<file-viewer :files="financialStatements.sysFileForms || []" platform="project"></file-viewer>
					</view>
				</view>
			</uni-collapse-item>
		</uni-collapse>

		<detail-wrapa :show="showModel">
			<view class="detail-mode">
				<view class="detail-mode-head">
					<text class="head-title">{{ sectionAcceptanceDetail.contractName }}</text>
					<uni-icons type="arrowdown" class="close" @click="showModel = false"></uni-icons>
				</view>
				<view class="detail-mode-content">
					<view class="detail-mode-content-item">
						<text class="label">合同码：</text>
						<text class="value">{{ sectionAcceptanceDetail.contractCode }}</text>
					</view>
					<view class="detail-mode-content-item">
						<text class="label">主持单位：</text>
						<text class="value">{{ sectionAcceptanceDetail.mainDepartment }}</text>
					</view>
					<view class="detail-mode-content-item">
						<text class="label">参与单位：</text>
						<text class="value">{{ sectionAcceptanceDetail.partakeDepartment }}</text>
					</view>
					<view class="detail-mode-content-item">
						<text class="label">验收组成员：</text>
						<text class="value">{{ sectionAcceptanceDetail.examineMember }}</text>
					</view>
					<view class="detail-mode-content-item">
						<text class="label">竣工资料审查结论：</text>
						<text class="value">{{ sectionAcceptanceDetail.examineDataConclusion }}</text>
					</view>
					<view class="detail-mode-content-item">
						<text class="label">竣工验收结论：</text>
						<text class="value">{{ sectionAcceptanceDetail.examineConclusion }}</text>
					</view>
					<view class="detail-mode-content-item">
						<text class="label">存在问题：</text>
						<text class="value">{{ sectionAcceptanceDetail.problem }}</text>
					</view>
					<view class="detail-mode-content-item">
						<text class="label">验收日期：</text>
						<text class="value">{{ sectionAcceptanceDetail.examineTime }}</text>
					</view>
					<view class="detail-mode-content-item file">
						<view class="label">相关附件</view>
						<file-viewer :files="sectionAcceptanceDetail.sysFileForms || []" platform="project"></file-viewer>
					</view>
				</view>
			</view>
		</detail-wrapa>
	</view>
</template>

<script>
import { getStagePageList, getStageById, getComprehensive, getFinance } from '@/api/project/completedCheck.js';
import DetailWrapa from './detail-wrap.vue';
import FileViewer from '@/components/file-viewer.vue';
export default {
	props: {
		projectId: {
			type: Number,
			required: true
		}
	},
	components: { DetailWrapa, FileViewer },
	data() {
		return {
			showModel: false,
			nodeDetail: {},
			sectionAcceptance: [], // 分段验收
			sectionAcceptanceDetail: {}, // 分段验收详情
			comprehensiveAcceptance: {}, // 综合验收
			financialStatements: {} // 财务决算
		};
	},
	created() {
		// 分段验收
		getStagePageList(this.projectId).then(res => {
			this.sectionAcceptance = res.records || [];
		});

		// 综合验收
		getComprehensive(this.projectId).then(res => {
			if (res) {
				res.examineTime = res.examineTime ? this.$dayjs(res.examineTime).format('YYYY-MM-DD') : null;
				this.comprehensiveAcceptance = res;
			}
		});

		// 财务决算
		getFinance(this.projectId).then(res => {
			if (res) {
				res.deliverTime = res.deliverTime ? this.$dayjs(res.deliverTime).format('YYYY-MM-DD') : null;
				this.financialStatements = res;
			}
		});
	},
	methods: {
		getDetail({ examineId, contractName, contractCode }) {
			getStageById(examineId).then(res => {
				res.contractName = contractName;
				res.contractCode = contractCode;
				res.examineTime = res.examineTime ? this.$dayjs(res.examineTime).format('YYYY-MM-DD') : null;
				this.sectionAcceptanceDetail = res;
				this.showModel = true;
			});
		}
	}
};
</script>

<style scoped lang="scss">
@import '../style/common.scss';
.list-item {
  //margin: 0.533rem 0.533rem;
  background-color: white;
  border-radius: 6px;
  position: relative;

  &:first-of-type {
    margin-top: 0.107rem;
  }
  .list-item-title {
        font-size: 13px;
        color: #333;
        line-height: 20px;
        padding-top: 15px;
        margin: 0 12px 10px 12px;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
  }

  .info {
    border-top: 1px solid #fafafa;
        font-size: 12px;
        color: #999;
        display: flex;
        padding: 10px 12px;

    .info-item:nth-of-type(1) {
      //width: 24%;
      .icon {
        background-color: #0066ff;
      }
    }

    .info-item:nth-of-type(2) {
      //width: 27%;
      .icon {
        background-color: #ff6600;
      }
    }

    .info-item:nth-of-type(3) {
      //width: 49%;
      .icon {
        background-color: #ff0000;
      }
    }

    .info-item {
      display: flex;
      align-items: center;
      margin:0 0.533rem 0 0;

      .icon {
        width: 0.7rem;
        height: 0.7rem;
        border-radius: 50%;
        //padding: 0.267rem;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-right: 0.213rem;
        flex-shrink: 0;

        img {
          width: 60%;
          height: 60%;
          object-fit: cover;
        }
      }
      span {
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 1;
      }
    }
  }
}
</style>
