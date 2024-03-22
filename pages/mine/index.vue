<template>
  <view class="mine-container" :style="{
      height: `${windowHeight}px`,
      'background-image': 'url(' + imgUrl + ')',
    }">
    <!--顶部个人信息栏-->
    <view class="header-section">
      <view class="header-title"> </view>
      <view class="flex padding justify-between">
        <view class="flex align-center">
          <view v-if="!avatar" class="cu-avatar xl round bg-white">
            <view class="iconfont icon-people text-gray icon"></view>
          </view>
          <image v-if="avatar" @click="handleToAvatar" :src="avatar" class="cu-avatar xl round" mode="widthFix">
          </image>
          <view v-if="!name" @click="handleToLogin" class="login-tip">
            点击登录
          </view>
          <view v-if="name" @click="handleToInfo" class="user-info">
            <view class="u_title">
              {{ name }}
            </view>
          </view>
        </view>
        <view @click="handleToInfo" class="flex align-center">
          <u-icon :name="`${imgBasePath}/static/images/icons/icon-set.png`" size="24"></u-icon>
        </view>
      </view>
    </view>
    <view class="content-section">
      <view class="main-modelOne">
        <view class="mine-actionsOne">
          <view class="grid col-4 text-center">
            <view class="action-item" @click="handleShop('/pages/mine/collection/index')">
              <u-icon :name="`${imgBasePath}/static/images/icons/icon-my-star.png`" size="28"></u-icon>
              <text class="text">收藏</text>
            </view>
            <view class="action-item" @click="handleShop('/pages/mine/follow/index')">
              <u-icon :name="`${imgBasePath}/static/images/icons/icon-my-shop.png`" size="28"></u-icon>
              <text class="text">关注店铺</text>
            </view>
          </view>
        </view>
      </view>
    </view>

    <view class="content-section">
      <view class="main-model">
        <!-- <view class="action-item" @click="handleJiaoLiuQun">
          <view class="iconfont icon-friendfill text-pink icon"></view>
          <text class="text">交流群</text>
        </view>
        <view class="action-item" @click="handleBuilding">
          <view class="iconfont icon-service text-blue icon"></view>
          <text class="text">在线客服</text>
        </view>
        <view class="action-item" @click="handleBuilding">
          <view class="iconfont icon-community text-mauve icon"></view>
          <text class="text">反馈社区</text>
        </view> -->
        <view class="mine-actions">
          <view style="display: flex; justify-content: space-between">
            <text class="mine-text">我的订单</text>
            <view style="
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-right: 11px;
              " @click="viewAll">
              <text class="look" @click="allMyList">查看全部</text>
              <u-icon :name="`${imgBasePath}/static/images/icons/icon-arrow-right.png`" size="12"></u-icon>
            </view>
          </view>
          <view class="grid col-4 text-center">
            <view class="action-item" @click="handleShop('/pages/mine/order/index?type=waiting_pay')">
              <u-icon :name="`${imgBasePath}/static/images/icons/icon-order-pay.png`" size="36"></u-icon>
              <text class="text">待付款</text>
            </view>
            <view class="action-item" @click="handleShop('/pages/mine/order/index?type=waiting_delivery')">
              <!-- <u-badge type="error" max="99" value="101" :offset="[-3, 13]" :absolute="true"></u-badge> -->
              <u-icon :name="`${imgBasePath}/static/images/icons/icon-order-package.png`" size="36">
              </u-icon>
              <text class="text">待发货</text>
            </view>
            <view class="action-item" @click="handleShop('/pages/mine/order/index?type=delivered')">
              <u-icon :name="`${imgBasePath}/static/images/icons/icon-order-delivery.png`" size="36"></u-icon>
              <text class="text">待收货</text>
            </view>
            <view class="action-item" @click="handleShop('/pages/mine/order/index?type=completed')">
              <u-icon :name="`${imgBasePath}/static/images/icons/icon-order-complete.png`" size="36"></u-icon>
              <text class="text">已完成</text>
            </view>
          </view>
        </view>
      </view>
      <view class="main-model">
        <view class="mine-actions">
          <text class="mine-text">更多功能</text>
          <view class="grid col-4 text-center">
            <view class="action-item" @click="handleShop('/pages/productList/receipt')">
              <u-icon :name="`${imgBasePath}/static/images/icons/icon-addressbook.png`" size="36"></u-icon>
              <text class="text">地址管理</text>
            </view>
            <view class="action-item" @click="handleLogout">
              <image style="width:36px;height:36px" src="@/static/images/out.png"></image>
              <text class="text">退出登录</text>
            </view>
          </view>
        </view>
      </view>

      <!-- <view class="menu-list">
        <view class="list-cell list-cell-arrow" @click="handleToEditInfo">
          <view class="menu-item-box">
            <view class="iconfont icon-user menu-icon"></view>
            <view>编辑资料</view>
          </view>
        </view>
        <view class="list-cell list-cell-arrow" @click="handleHelp">
          <view class="menu-item-box">
            <view class="iconfont icon-help menu-icon"></view>
            <view>常见问题</view>
          </view>
        </view>
        <view class="list-cell list-cell-arrow" @click="handleAbout">
          <view class="menu-item-box">
            <view class="iconfont icon-aixin menu-icon"></view>
            <view>关于我们</view>
          </view>
        </view>
        <view class="list-cell list-cell-arrow" @click="handleToSetting">
          <view class="menu-item-box">
            <view class="iconfont icon-setting menu-icon"></view>
            <view>应用设置</view>
          </view>
        </view>
      </view> -->
    </view>
  </view>
</template>

<script>
import storage from '@/utils/storage'

export default {
  data() {
    return {
      name: this.$store.state.user.name,
      version: getApp().globalData.config.appInfo.version,
      imgUrl: require('@/static/images/banner/bg-my.png'),
    }
  },
  onLoad() {},
  computed: {
    avatar() {
      return this.$store.state.user.avatar
    },
    windowHeight() {
      return uni.getSystemInfoSync().windowHeight
    },
  },
  methods: {
    handleLogout() {
      this.$modal.confirm('确定注销并退出系统吗？').then(() => {
        this.$store.dispatch('LogOut').then(() => {
          this.$tab.reLaunch('/pages/login')
        })
      })
    },
    // handleToInfo() {
    //   this.$tab.navigateTo("/pages/mine/info/index");
    // },
    // handleToEditInfo() {
    //   this.$tab.navigateTo("/pages/mine/info/edit");
    // },
    // handleToSetting() {
    //   this.$tab.navigateTo("/pages/mine/setting/index");
    // },
    handleToLogin() {
      this.$tab.reLaunch('/pages/login')
    },
    handleToAvatar() {
      this.$tab.navigateTo('/pages/mine/avatar/index')
    },
    handleLogout() {
      this.$modal.confirm('确定注销并退出系统吗？').then(() => {
        this.$store.dispatch('LogOut').then(() => {
          this.$tab.reLaunch('/pages/index')
        })
      })
    },
    // handleHelp() {
    //   this.$tab.navigateTo("/pages/mine/help/index");
    // },
    // handleAbout() {
    //   this.$tab.navigateTo("/pages/mine/about/index");
    // },
    // handleJiaoLiuQun() {
    //   this.$modal.showToast("QQ群：133713780");
    // },
    // handleBuilding() {},
    handleShop(url) {
      this.$tab.navigateTo(url)
    },
    viewAll() {
      console.log(this.imgUrl)
    },
    // 点击查看全部
    allMyList() {
      this.$tab.navigateTo('/pages/mine/order/index')
    },
  },
}
</script>

<style lang="scss">
page {
  background-color: #f5f6f7;
}

.mine-container {
  width: 100%;
  height: 100%;
  background-size: 100% 100%;
  background-repeat: no-repeat;
  background-position: 0 0;

  .header-section {
    padding: 5px 15px 45px 15px;
    // color: white;

    .header-title {
      padding: 7px 3px;
      color: white;
      text-align: center;
      font-size: 16px;
      font-weight: 700;
    }

    .login-tip {
      font-size: 18px;
      margin-left: 10px;
    }

    .cu-avatar {
      border: 2px solid #eaeaea;

      .icon {
        font-size: 40px;
      }
    }

    .user-info {
      margin-left: 15px;

      .u_title {
        font-size: 18px;
        line-height: 30px;
      }
    }
  }
  .content-two {
    position: relative;
    top: -50px;
    display: flex;
  }

  .content-section {
    position: relative;
    top: -50px;
    .main-modelOne {
      margin: 15px 15px;

      .mine-actionsOne {
        // margin: 15px 15px;
        // padding: 10px 0px;

        .look {
          width: 48px;
          height: 12px;
          font-size: 12px;
          font-family: PingFangSC, PingFang SC;
          font-weight: 400;
          color: #767676;
          line-height: 12px;
        }
        .mine-text {
          width: 64px;
          height: 16px;
          font-size: 16px;
          font-family: PingFangSC, PingFang SC;
          font-weight: 500;
          color: #363636;
          line-height: 16px;
          padding: 16px 0px 16px 16px;
          display: block;
        }

        .action-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: space-between;

          .text {
            width: 56px;
            height: 20px;
            font-size: 14px;
            font-family: PingFangSC, PingFang SC;
            font-weight: 400;
            color: #767676;
            line-height: 20px;
          }
        }
      }
    }
    .main-model {
      margin: 15px 15px;
      border-radius: 8px;
      background-color: white;
      .mine-actions {
        // margin: 15px 15px;
        // padding: 10px 0px;
        border-radius: 8px;
        background-color: white;
        .look {
          width: 48px;
          height: 12px;
          font-size: 12px;
          font-family: PingFangSC, PingFang SC;
          font-weight: 400;
          color: #767676;
          line-height: 12px;
        }
        .mine-text {
          width: 64px;
          height: 16px;
          font-size: 16px;
          font-family: PingFangSC, PingFang SC;
          font-weight: 500;
          color: #363636;
          line-height: 16px;
          padding: 16px 0px 16px 16px;
          display: block;
        }

        .action-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: space-between;
          position: relative;
          .u-badge {
            z-index: 5;
          }

          .text {
            width: 56px;
            height: 20px;
            font-size: 14px;
            font-family: PingFangSC, PingFang SC;
            font-weight: 400;
            color: #767676;
            line-height: 20px;
            margin-bottom: 14px;
          }
        }
      }
    }
  }
}
</style>
