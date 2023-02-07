<template>
	<view class="tab-page">
		<uni-collapse accordion="true">
			<uni-collapse-item :showAnimation="true" title="基本信息" class="title-color-type1">
				<view class="expanded-content">
					<view>
						<text class="label">项目名称：</text>
						<text class="value">{{ projectInfo.projectName }}</text>
					</view>
					<view>
						<text class="label">项目分类：</text>
						<text class="value">{{ projectInfo.projectType }}</text>
					</view>
					<view>
						<text class="label">工程性质：</text>
						<text class="value">{{ projectInfo.programmeTypes }}</text>
					</view>
					<view>
						<text class="label">总投资：</text>
						<text class="value">{{ projectInfo.allInvest || 0 }} [万元]</text>
					</view>
					<view>
						<text class="label">工程概算：</text>
						<text class="value">{{ projectInfo.budget || 0 }} [万元]</text>
					</view>
					<view>
						<text class="label">资金来源：</text>
						<text class="value">{{ projectInfo.capitalSource }}</text>
					</view>
					<view>
						<text class="label">建设阶段：</text>
						<text class="value">{{ projectInfo.buildStageType }}</text>
					</view>
					<view>
						<text class="label">建设性质：</text>
						<text class="value">{{ projectInfo.buildNatureType }}</text>
					</view>
					<view>
						<text class="label">建设迄止年限：</text>
						<text class="value">{{ projectInfo.buildStopYear }}</text>
					</view>
					<view>
						<text class="label">建筑面积：</text>
						<text class="value">{{ projectInfo.builtArea || 0 }} [m²]</text>
					</view>
					<view>
						<text class="label">占地面积：</text>
						<text class="value">{{ projectInfo.coveredArea || 0 }} [m²]</text>
					</view>
					<view>
						<text class="label">结构形式：</text>
						<text class="value">{{ projectInfo.structuralStyle }}</text>
					</view>
					<view>
						<text class="label">开工日期：</text>
						<text class="value">{{ projectInfo.startTime }}</text>
					</view>
					<view>
						<text class="label">竣工日期：</text>
						<text class="value">{{ projectInfo.endTime }}</text>
					</view>
					<view>
						<text class="label">经度：</text>
						<text class="value">{{ projectInfo.longitude }}</text>
					</view>
					<view>
						<text class="label">纬度：</text>
						<text class="value">{{ projectInfo.latitude }}</text>
					</view>
					<view class="multi-line">
						<text class="label">工程地址：</text>
						<text class="value">{{ projectInfo.projectAddress }}</text>
					</view>
					<view class="multi-line">
						<text class="label">建设规模及内容：</text>
						<text class="value">{{ projectInfo.content }}</text>
					</view>
				</view>
			</uni-collapse-item>
			<uni-collapse-item :showAnimation="true" title="项目协调小组" class="title-color-type2">
				<view class="expanded-content">
					<view v-for="item in projectInfo.xmProjectCoordinateForms">
						<view class="label">{{ item.coordinateName }}：</view>
						<view>
							<view v-for="name in (item.userNames || '').split(',')" class="name-phone">
								<view v-if="name !== ''" class="value">
									{{ name.split('-')[0] }} [
									<text v-if="name.split('-')[1]" style="color:#6fa3ff;">{{ name.split('-')[1] }}</text>
									]
								</view>
							</view>
						</view>
					</view>
				</view>
			</uni-collapse-item>
			<uni-collapse-item :showAnimation="true" title="单位信息" class="title-color-type3">
				<view class="expanded-content">
					<template v-for="item in projectInfo.xmCompanyForms">
						<view>
							<text class="label title">单位类型：</text>
							<text class="value">{{ item.type }}</text>
						</view>
						<view>
							<text class="label">单位名称：</text>
							<text class="value">{{ item.name }}</text>
						</view>
						<view>
							<text class="label">备注：</text>
							<text class="value">{{ item.remark }}</text>
						</view>
						<template v-for="user in item.xmCompanyContactForms">
							<view>
								<text class="label">联系人：</text>
								<text class="value">{{ user.userName }}</text>
							</view>
							<view>
								<text class="label">联系电话：</text>
								<text class="value" style="color:#6fa3ff;">{{ user.userPhone }}</text>
							</view>
						</template>
					</template>
				</view>
			</uni-collapse-item>
			<uni-collapse-item :showAnimation="true" title="批复情况" class="title-color-type4">
				<view class="expanded-content files">
					<view>
						<text class="label">项目建议书批复文号：</text>
						<text class="value one-line">{{ projectInfo.proposalTitle }}</text>
					</view>
					<view class="file">
						<view class="label">附件：</view>
						<file-viewer :files="projectInfo.proposalFile ? [projectInfo.proposalFile] : []" platform="project"></file-viewer>
					</view>
					<view>
						<text class="label">项目可行性研究批复文号：</text>
						<text class="value one-line">{{ projectInfo.studyTitle }}</text>
					</view>
					<view class="file">
						<view class="label">附件：</view>
						<file-viewer :files="projectInfo.studyFile ? [projectInfo.studyFile] : []" platform="project"></file-viewer>
					</view>
					<view>
						<text class="label">项目初步设计批复文号：</text>
						<text class="value one-line">{{ projectInfo.designTitle }}</text>
					</view>
					<view class="file">
						<view class="label">附件：</view>
						<file-viewer :files="projectInfo.designFile ? [projectInfo.designFile] : []" platform="project"></file-viewer>
					</view>
					<view>
						<text class="label">项目实施方案批复文号：</text>
						<text class="value one-line">{{ projectInfo.schemeTitle }}</text>
					</view>
					<view class="file">
						<view class="label">附件：</view>
						<file-viewer :files="projectInfo.schemeFile ? [projectInfo.schemeFile] : []" platform="project"></file-viewer>
					</view>
					<view>
						<text class="label">项目财政评审批复文号：</text>
						<text class="value one-line">{{ projectInfo.assessTitle }}</text>
					</view>
					<view class="file">
						<view class="label">附件：</view>
						<file-viewer :files="projectInfo.assessFile ? [projectInfo.assessFile] : []" platform="project"></file-viewer>
					</view>
				</view>
			</uni-collapse-item>
			<uni-collapse-item :showAnimation="true" title="考核计划" class="title-color-type5">
				<view class="expanded-content">
					<template v-for="item in projectInfo.xmAnnualAssessmentForms">
						<view>
							<text class="label title">{{ item.years }}年</text>
						</view>
						<view>
							<text class="label">形象进度：</text>
							<text class="value">{{ item.progress }}</text>
						</view>
						<view>
							<text class="label">投资数：</text>
							<text class="value">{{ item.investment || 0 }} [万元]</text>
						</view>
						<view>
							<text class="label">财务数：</text>
							<text class="value">{{ item.finance || 0 }} [万元]</text>
						</view>
						<view>
							<text class="label">备注：</text>
							<text class="value">{{ item.remark }}</text>
						</view>
					</template>
				</view>
			</uni-collapse-item>
		</uni-collapse>
	</view>
</template>

<script>
import { getById, getProjectTypeList, getNatureTypeMap, getStageTypeMap, getXmCompanyTypeMap, getProgrammeTypeMap } from '@/api/project/basicInfo.js';
import FileViewer from '@/components/file-viewer.vue';
export default {
	components: { FileViewer },
	props: {
		projectId: {
			type: Number,
			required: true
		}
	},
	data() {
		return {
			item: {},
			user: {},
			projectInfo: {},
			unitType: [],
		};
	},
	async created() {
		this.unitType = await getXmCompanyTypeMap();
		this.fetchData();
	},
	methods: {
		open(mode) {
			this.show = !this.show;
		},
		fetchData() {
			getById(this.projectId).then(res => {
				res.projectDutyPerson = res.xmProjectCoordinateForms[0].userNames.split('-')[0];
				res.xmCompanyForms = res.xmCompanyForms.map(v => {
					v.type = this.unitType.find(val => val.value === v.type).label;
					return v;
				});
				res.buildStopYear = this.getBuildStopYear(res.buildStopYear);
				res.startTime = this.$dayjs(res.startTime).format('YYYY-MM-DD');
				res.endTime = this.$dayjs(res.endTime).format('YYYY-MM-DD');
				this.projectInfo = res;
				this.$emit('projectInfo', this.projectInfo);
				this.formatData();
			});
		},
		formatData() {
			getProjectTypeList().then(res => {
				this.projectInfo.projectType = res.find(v => v.value === this.projectInfo.projectType).label;
			});
			getNatureTypeMap().then(res => {
				this.projectInfo.buildNatureType = res[this.projectInfo.buildNatureType];
			});
			getStageTypeMap().then(res => {
				this.projectInfo.buildStageType = res[this.projectInfo.buildStageType];
			});
			getProgrammeTypeMap().then(res => {
				this.projectInfo.programmeTypes = this.projectInfo.programmeTypes
					.split(',')
					.map(v => res[v])
					.join(',');
			});
		},
		getBuildStopYear(yearArr) {
			if (!yearArr) {
				return null;
			}
			const arr = yearArr.split(','),
				date1 = new Date(arr[0]),
				date2 = new Date(arr[1]);
			return date1.getFullYear() + '年' + (date1.getMonth() + 1) + '月' + '\t~\t' + date2.getFullYear() + '年' + (date2.getMonth() + 1) + '月';
		}
	}
};
</script>

<style scoped lang="scss">
@import '../style/common.scss';
.expanded-content > .multi-line {
	display: block;
	.label {
		display: block;
		margin-bottom: 6px;
	}
	.value {
		display: block;
		text-indent: 2em;
	}
}
.name-phone {
	text-align: right;
	margin-bottom: 5px;
}
.files {
	.file {
		display: block;
		padding-bottom: 0;
		.label {
			margin-bottom: 5px;
		}
	}
}
</style>
