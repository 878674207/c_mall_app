<template>
	<view class="work-container">
		<!-- 轮播图 -->
		<uni-swiper-dot class="uni-swiper-dot-box" :info="data" :current="current" field="content">
			<swiper class="swiper-box" :current="swiperDotIndex" @change="changeSwiper">
				<swiper-item v-for="(item, index) in data" :key="index">
					<view class="swiper-item" @click="clickBannerItem(item)">
						<image :src="item.image" mode="aspectFill" :draggable="false" />
					</view>
				</swiper-item>
			</swiper>
		</uni-swiper-dot>
		<view class="work-title">系统管理</view>
		<view class="work-icongroup">
			<view class="work-icongroup-block" v-for="(item, index) in list.system" :index="index" :key="index">
				<view>
					<image :src="item.icon" class="top-image" mode="widthFix"></image>
				</view>
				<view>
					{{item.title}}
				</view>
			</view>
		</view>
		<view class="work-title">菜单管理</view>
		<view class="work-icongroup">
			<view class="work-icongroup-block" v-for="(item, index) in list.unit" :index="index" :key="index">
				<view>
					<image :src="item.icon" class="top-image" mode="widthFix"></image>
				</view>
				<view>
					{{item.title}}
				</view>
			</view>
		</view>
		<view class="work-title">菜单名称</view>
		<view class="work-icongroup">
			<view class="work-icongroup-block" v-for="(item, index) in list.unitname" :index="index" :key="index">
				<view>
					<image :src="item.icon" class="top-image" mode="widthFix"></image>
				</view>
				<view>
					{{item.title}}
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				current: 0,
				swiperDotIndex: 0,
				data: [{
						image: '/static/images/banner/img1.png'
					},
					{
						image: '/static/images/banner/img2.png'
					},
					{
						image: '/static/images/banner/img3.png'
					}
				],
				list: {
					system: [
						{title: '用户管理', icon: '../../static/images/work/system/icon-user.png'},
						{title: '角色管理', icon: '../../static/images/work/system/icon-role.png'},
						{title: '菜单管理', icon: '../../static/images/work/system/icon-document.png'},
						{title: '部门管理', icon: '../../static/images/work/system/icon-layer.png'},
						{title: '岗位管理', icon: '../../static/images/work/system/icon-post.png'},
						{title: '字典管理', icon: '../../static/images/work/system/icon-todo.png'},
						{title: '参数管理', icon: '../../static/images/work/system/icon-layer.png'},
					],
					unit: [
						{title: '菜单名称', icon: '../../static/images/work/unit/icon-folder.png'},
						{title: '菜单名称', icon: '../../static/images/work/unit/icon-message.png'},
						{title: '菜单名称', icon: '../../static/images/work/unit/icon-news.png'},
						{title: '菜单名称', icon: '../../static/images/work/unit/icon-tag.png'}
					],
					unitname: [
						{title: '菜单名称', icon: '../../static/images/work/system/icon-user.png'},
						{title: '菜单名称', icon: '../../static/images/work/system/icon-role.png'},
						{title: '菜单名称', icon: '../../static/images/work/system/icon-document.png'},
						{title: '菜单名称', icon: '../../static/images/work/system/icon-layer.png'},
						{title: '菜单名称', icon: '../../static/images/work/system/icon-post.png'},
						{title: '菜单名称', icon: '../../static/images/work/system/icon-todo.png'},
						{title: '菜单名称', icon: '../../static/images/work/system/icon-layer.png'},
					],
				}
			}
		},
		methods: {
			clickBannerItem(item) {
				console.info(item)
			},
			changeSwiper(e) {
				this.current = e.detail.current
			},
			changeGrid(e) {
				this.$modal.showToast('模块建设中~')
			}
		}
	}
</script>

<style lang="scss">
	/* #ifndef APP-NVUE */
	page {
		display: flex;
		flex-direction: column;
		box-sizing: border-box;
		background-color: #fff;
		min-height: 100%;
		height: auto;
	}

	view {
		font-size: 14px;
		line-height: inherit;
	}

	/* #endif */

	.text {
		text-align: center;
		font-size: 26rpx;
		margin-top: 10rpx;
	}


	.uni-margin-wrap {
		width: 690rpx;
		width: 100%;
		;
	}

	.swiper {
		height: 300rpx;
	}

	.swiper-box {
		height: 150px;
	}

	.swiper-item {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: column;
		justify-content: center;
		align-items: center;
		color: #fff;
		height: 300rpx;
		line-height: 300rpx;
	}
	.work-title{
		font-size: 32rpx;
		font-weight: 600;
		padding: 40rpx 4% 20rpx;
	}
	.work-icongroup{
		display: flex;
		flex-wrap: wrap;
		width: 90%;
		margin: auto;
	}
	.work-icongroup-block{
		width: 25%;
		height: 168rpx;
		text-align: center;
		padding: 10rpx;
	}
	.top-image{
		width: 90rpx;
		height: 90rpx;
	}
	@media screen and (min-width: 500px) {
		.uni-swiper-dot-box {
			width: 400px;
			/* #ifndef APP-NVUE */
			margin: 0 auto;
			/* #endif */
			margin-top: 8px;
		}

		.image {
			width: 100%;
		}
	}
</style>
