<template>
	<view class="page">
		<view style="height: 56px;"></view>
		<view class="top">
			<uni-search-bar
				class="search-bar"
				ref="search"
				v-model="queryContent"
				clearButton="none"
				:radius="100"
				@confirm="search"
				@cancel="handleCancel"
				placeholder="搜索项目名称"
			></uni-search-bar>
		</view>
		<view class="breadcrumb">
			<text class="link" @click="expendTarget('all')">全部</text>
			<uni-icons v-show="year !== null" type="arrowright"></uni-icons>
			<text class="link" @click="expendTarget('year')">{{ year }}</text>
			<uni-icons v-show="team !== null" type="arrowright"></uni-icons>
			<text>{{ team }}</text>
		</view>
		<view v-show="isGroup">
			<view v-for="item in curDataGroups" @click="expendGroup(item)" class="item-card">
				<view class="coll-title">
					<view class="label">
						<text>{{ item.label }}</text>
						<view class="mark">{{ item.count }}</view>
					</view>
					<uni-icons type="arrowright" class="icon" color="#999"></uni-icons>
				</view>
			</view>
		</view>
		<!-- <view v-show="isGroup" class="group-list">
			<view class="group-item" v-for="item in curDataGroups" @click="expendGroup(item)">
				<text>{{ item.label }}</text>
				<view>
					<text class="sub-title">{{ item.count }}</text>
					<uni-icons type="arrowright" class="icon" color="#999"></uni-icons>
				</view>
			</view>
		</view> -->
		<!-- <view v-show="!isGroup">
			<view v-for="item in curProjectList">{{ item.projectName}}</view>
		</view> -->
		<template v-if="!isGroup">
			<view v-for="(item,index) in modules" class="card" :class="{last: index === modules.length - 1}">
				<uni-collapse>
				    <uni-collapse-item :title="stageLabel[index]" :showAnimation="true" :open="index === 0">
							<template v-slot:title>
								<view class="coll-title">
									<text>{{stageLabel[index]}}</text>
									<view class="mark">{{item.length}}</view>
								</view>
							</template>
				        <view v-for="(data, index) in item" class="info-card" @click="toDetail(data)">
				        	<view class="info-card-title">{{ data.projectName }}</view>
				        	<view class="info-card-footer">
				        		<view class="footer-item">
				        			<view class="footer-item-icon"><image class="img" src="/static/img/user.png" mode="aspectFill" alt=""></view>
				        			<text>项目负责人:{{ data.displayName }}</text>
				        		</view>
				        	</view>
				        </view>
				    </uni-collapse-item>
				</uni-collapse>
			</view>
		</template>

	</view>
</template>

<script>
import { getPageList, getTeamTypeMap } from '@/api/project/myProject.js';
let teamNameMap = {}
export default {
	data() {
		return {
			queryContent: '',
			stageLabel: ['正在施工项目', '已完工项目'],
			year: null, // 所选年份
			team: null, // 所属工程队
			dataGroups: [], // 年份-工程队-项目 的树形结构数据
			curDataGroups: [], // 当前渲染的节点层级
			curProjectList: [],
			isGroup: true,
		};
	},
	computed: {
		modules() {
			if (this.curProjectList.length === 0) {
				return []
			} else {
				return [this.curProjectList.filter(v => v.buildStageType === 0), this.curProjectList.filter(v => v.buildStageType === 1)]
			}
		}
	},
	async created() {
		teamNameMap = await getTeamTypeMap()
		this.fetchData()
	},
	methods: {
		fetchData() {
			const queryContent = this.queryContent === '' ? '' : this.queryContent.value
			getPageList({queryContent, pageIndex: 1, pageSize: 9999}).then(res => {
				// 根据开工日期分组，降序排序
				const group = {};
				(res.records || []).forEach(v => {
					v.displayName = v.displayName || v.headName;
					let year = this.$dayjs(v.startTime).year()
					// 未填写开工日期
					if (!year) {
						year = 0
					}
					// 初始化年份
					if (group[year] === undefined) {
						group[year] = {}
					}
					// 初始化工程队
					if (group[year][v.team] === undefined) {
						group[year][v.team] = []
					}
					group[year][v.team].push(v)
				})
				// 把对象结构转成数组结构用于v-for遍历
				const arr = []
				Object.keys(group).forEach(key => {
					const year = { label: +key === 0 ? '其他' : key + '年', value: key, count: 0, children: [], type: 'year'}
					Object.keys(group[key]).forEach(teamKey => {
						const team = { label: teamNameMap[+teamKey], value: teamKey, count: group[key][teamKey].length, children: group[key][teamKey], type: 'team'}
						year.count += team.count
						year.children.push(team)
					})
					arr.push(year)
				})
				this.dataGroups = arr.sort((a, b) => {
					return b.value - a.value
				})
				this.curDataGroups = this.dataGroups
			})
		},
		// 展开节点层级
		expendGroup(item) {
			if (item.type === 'year') {
				this.year = item.label
				this.curDataGroups = item.children
				this.isGroup = true
			} else {
				this.team = item.label
				this.curProjectList = item.children
				this.isGroup = false
			}
		},
		expendTarget(type) {
			// 全部年份
			if (type === 'all') {
				this.isGroup = true
				this.year = null
				this.team = null
				this.curDataGroups = this.dataGroups
			} else {
				this.team = null
				// 指定年份
				const item = this.dataGroups.find(v => v.label === this.year)
				this.expendGroup(item)
			}
		},
		// 跳转详情页
		toDetail({ projectId, projectName,displayName }) {
			uni.navigateTo({
				url: `/pages/project-detail/project-detail?projectId=${projectId}&projectName=${projectName}&displayName=${displayName}`
			});
		},
		search() {
			this.fetchData();
		},
		handleCancel() {
			this.queryContent = ''
			this.search()
		},
	}
};
</script>

<style scoped lang="scss">
@import '@/pages/project-detail/style/common.scss';

/deep/ .uni-collapse-cell__title {
	padding: 0;
}

/deep/ .uni-collapse-cell {
	border: none;
}

.page {
	min-height: 100%;
	background-color: $-bg-color;
	box-sizing: border-box;
	padding-bottom: 60px;
}
.top {
	background-color: white;
	display: flex;
	flex-direction: column;
	margin-bottom: 10px;
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	z-index: 99;
}
.search-bar {
	margin: 10px;
	background-color: transparent;
	padding: 0;
}

.info-card {
	// margin-left: 10px;
	// margin-right: 10px;
}

.header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	background-color: white;
	padding: 0 10px 0 2px;

	.uni-searchbar {
		flex: 1;
		margin-right: 10px;
	}

	.more {
		color: #1989fa;
	}
}

.top {
	display: flex;
	justify-content: space-between;
	font-size: 15px;

	.item-title {
		flex: 1;
	}

	.state {
		flex-shrink: 0;
	}
}

.bottom {
	color: #adadad;
	font-size: 13px;
	margin-top: 10px;
	display: flex;
	justify-content: space-between;
}

.picker-view-wrap {
	position: absolute;
	bottom: 0;
	left: 0;
	right: 0;
	height: 300px;
	font-size: 15px;

	.picker-item {
		line-height: 30px;
		background-color: white;
		text-align: center;
		font-size: 16px;
		color: #333333;
	}

	.picker-header {
		display: flex;
		justify-content: space-between;
		padding: 10px;
		color: #666666;
		background-color: white;
		font-size: 16px;

		.complete {
			color: #007aff;
		}

		border-bottom: 1px solid #e5e5e5;
	}
}

.picker-view {
	height: 100%;
	background-color: white;
}
.header {
	margin: 20rpx 20rpx;
	border-radius: 20rpx;
}
.pro-info {
	margin: 20rpx 10rpx;
}
.tip {
	margin: 20rpx 10rpx;
}
.tip text {
	margin-left: 35%;
	font-size: 30rpx;
}
.title {
	font-size: 30rpx;
	// font-weight: bold;
	margin-bottom: 10rpx;
}
.info {
	font-size: 28rpx;
	color: #888;
}
.info text {
	margin-right: 10rpx;
}
.mark {
		position: absolute;
		top: 4px;
		right: -25px;
		width: 18px;
		height: 18px;
		border-radius: 50px;
		display: flex;
		justify-content: center;
		align-items: center;
		background-color: #ff2727;
		color: white;
		font-size: 11px;
		font-weight: bold;
	}

	.info-card {
		border-bottom: 1px solid #eee;
		    padding-bottom: 10px;
	}
	.info-card .info-card-title {
		margin: 0;
		padding: 0;
		margin-bottom: 10px;
		font-size: 14px;
	}
	.info-card .info-card-footer {
		border: none;
		padding: 0;
		font-size: 13px;
	}
	.card {
		padding-top: 0;
		&.last {
			// margin-bottom: 60px;
		}
	}
	.coll-title {
		position: relative;
		border-left: 4px solid #1989fa;
		padding-left: 5px;
	}
	
	.link {
		color: #1989fa;
	}
	
	.breadcrumb {
		margin: 15px 15px 0;
	}
	
	.group-list {
		margin: 15px;
		border-radius: 4px;
		background-color: white;
		padding: 0 15px;
		.group-item {
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding: 10px 0;
			border-bottom: 1px solid #eee;
			&:last-of-type {
				border-bottom: 0;
			}
			.sub-title {
				color: #a1a1a1;
				font-size: 14px;
				margin-right: 5px;
			}
		}
	}
	
	.item-card {
		padding: 15px;
		background-color: white;
		margin: 10px;
		border-radius: 4px;
		.coll-title {
			display: flex;
			align-items: center;
			justify-content: space-between;
		} 
		.label {
			position: relative;
		}
		.mark {
			top: 50%;
			transform: translateY(-50%);
		}
	}
</style>
