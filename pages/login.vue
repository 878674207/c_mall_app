<template>
  <view class="normal-login-container">
    <view class="logo-content align-center justify-center flex">
      <image style="width: 300rpx;" src="@/static/logo200.png" mode="widthFix">
      </image>
    </view>
    <!-- 手机号验证码登录 -->
    <view class="login-form-content">
      <view class="input-item flex align-center">
        <view class="iconfont icon-user icon"></view>
        <input v-model="loginForm.phone" class="uni-input input" type="number" placeholder="请输入手机号" maxlength="11" />
      </view>
      <view class="input-item flex align-center" style="width: 60%; margin: 0px" v-if="captchaEnabled">
        <view class="iconfont icon-code icon"></view>
        <input v-model="loginForm.code" type="number" class="input" placeholder="请输入验证码" maxlength="6" />
        <view class="login-code">
          <button @click="getCode" class="login-code-img" type="default" plain="true">
            {{ codetext }}
          </button>
        </view>
      </view>
      <view class="action-btn">
        <button @click="handleLogin" class="login-btn cu-btn block bg-blue-btn lg round">
          登录
        </button>
      </view>
    </view>
    <view class="checkbox text-center flex-spc">
      <u-checkbox-group v-model="isSelect">
        <u-checkbox :name="true" shape="circle" @change="radioChange" size="12"></u-checkbox>
      </u-checkbox-group>
      <view class="text-grey1" @click="radioChange(!isCheack)">阅读</view>
      <view @click="handleUserAgrement" class="text-orange">《用户协议》</view>
      <view class="text-grey1" @click="radioChange(!isCheack)">及
      </view>
      <view @click="handlePrivacy" class="text-orange">《隐私协议》</view>
    </view>
    <view class="texttig">
      <view>本应用由cmall电商提供，账号信息相互关联</view>
    </view>
  </view>
</template>

<script>
import { getToken } from '@/utils/auth'
import { getCodeSms } from '@/api/login'
export default {
  data() {
    return {
      selectInde: 0,
      codeUrl: '',
      captchaEnabled: true,
      globalConfig: getApp().globalData.config,
      loginForm: {
        phone: '',
        code: '',
        certificateCode: '',
        openCode: '',
        openId: '',
        roleCode: '',
      },
      isSelect: [false],
      isCheack: false,
      disabled: true,
      saleDisable: false,
      codeDisable: false,
      codetext: '获取验证码',
      endtime: 60,
      pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
      routerPath: {
        // 不同角色对应的 页面路由
        user: '/pages/index/user', // 普通用户
        sale: '/pages/index/sale', // 销售端用户
        manage: '/pages/index/manage', // 销售管理端用户
      },
      // 通过扫码进入登录页面,拿到销售信息,currentScene
      currentScene: '',
    }
  },
  onLoad(options) {
    console.log('login页面', options)
    if (!!options.scene) {
      this.currentScene = options.scene
    }
    // 进入登录页面 先判断是否登录 如果登录 则跳入相应角色下的 页面
    if (getToken()) {
      this.$tab.reLaunch('/pages/index')
    } else {
      return
    }
  },
  methods: {
    modelogin() {
      this.$tab.reLaunch(this.routerPath[this.$store.state.tabbar.tabrolse])
    },
    handleChanges(item) {
      this.selectInde = item.index
    },
    radioChange(e) {
      this.isSelect = [e]
      this.isCheack = e
      this.disabled = !e
    },
    //隐私协议
    handlePrivacy() {
      let site = this.globalConfig.appInfo.agreements[0]
      this.$tab.navigateTo(
        `/package/commons/pages/common/webview/index?title=${site.title}&url=${site.url}`
      )
    },
    // 用户协议
    handleUserAgrement() {
      let site = this.globalConfig.appInfo.agreements[1]
      this.$tab.navigateTo(
        `/package/commons/pages/common/webview/index?title=${site.title}&url=${site.url}`
      )
    },
    // 获取图形验证码
    getCode() {
      if (this.loginForm.phone) {
        if (!this.pattern.test(this.loginForm.phone)) {
          this.$modal.showToast('输入的手机号格式有误！')
          return
        }
        let tath = this
        if (tath.codeDisable) {
          return false
        }
        tath.codeDisable = true
        let starttime = this.endtime
        tath.codetext = `倒计时${starttime}S`
        tath.handlerGetCodeSms()
        let setInterTime = setInterval(function () {
          if (starttime > 1) {
            starttime = starttime - 1
            tath.codetext = `倒计时${starttime}S`
          } else {
            clearInterval(setInterTime)
            tath.codetext = '获取验证码'
            tath.codeDisable = false
          }
        }, 1000)
      } else {
        this.$modal.showToast('请输入您的手机号~~')
      }
    },
    handlerGetCodeSms() {
      const params = {
        phone: this.loginForm.phone,
      }
      getCodeSms(params).then((res) => {
        this.loginForm.code = res.data
      })
    },
    // 登录方法
    async handleLogin() {
      if (this.loginForm.phone === '') {
        this.$modal.showToast('请输入您的手机号~~')
        return false
      }
      if (this.loginForm.code === '') {
        this.$modal.showToast('请输入验证码')
        return false
      }
      if (this.isCheack) {
        this.pwdLogin()
      } else {
        this.$modal
          .showModal({
            title: '温馨提示',
            content:
              '请您仔细阅读并充分理解相关协议，点击同意即代表您已阅读并同意《用户协议》与《隐私协议》',
            cancelText: '不同意',
            confirmText: '同意',
            confirmColor: '#2f92f8',
          })
          .then(() => {
            this.isSelect = [true]
            this.isCheack = true
            this.pwdLogin()
          })
      }
    },
    // 密码登录
    async pwdLogin() {
      this.loginForm.salesUserId = this.currentScene
      let loginForm = {
        item: this.loginForm,
        rolse: this.selectInde,
      }
      console.log(loginForm)
      this.$store
        .dispatch('Login', loginForm)
        .then((res) => {
          if (res.code === 200) {
            // selectInde 用于判断是用户登录还是销售登录
            if (this.selectInde === 0) {
              // ===0 用户登录
              // user 用户角色 sale 销售角色
              this.$store.dispatch('setTabrolsesActive', 'user')
              // 看 routerPath 中的定义
              this.$tab.reLaunch('/pages/index')
            }
          } else {
            this.$modal.msgError(`${res.message}`)
          }
        })
        .finally((r) => {
          this.saleDisable = false
        })
    },
  },
}
</script>

<style lang="scss">
page {
  background-color: #ffffff;
}

.normal-login-container {
  width: 100%;
  padding: 100rpx 64rpx 0;

  ::v-deep .u-tabs {
    align-items: center !important;
  }

  .logo-content {
    width: 100%;
    font-size: 40rpx;
    text-align: center;

    image {
      border-radius: 8rpx;
    }

    .title {
      margin-left: 20rpx;
    }
  }

  .login-form-content {
    text-align: center;
    margin: 20rpx auto 40rpx;
    width: 80%;

    .input-item {
      margin: 40rpx auto;
      background-color: #f5f6f7;
      height: 90rpx;
      border-radius: 40rpx;

      .icon {
        font-size: 38rpx;
        margin-left: 20rpx;
        color: #999;
      }

      .input {
        width: 100%;
        font-size: 28rpx;
        line-height: 40rpx;
        text-align: left;
        padding-left: 30rpx;
      }
    }

    .login-btn {
      margin-top: 80rpx;
      height: 90rpx;
    }

    .xieyi {
      color: #333;
      margin-top: 40rpx;
    }

    .login-code {
      height: 76rpx;
      float: right;

      .login-code-img {
        height: 76rpx;
        position: absolute;
        margin-left: 20rpx;
        width: 200rpx;
        border-radius: 40rpx;
        font-size: 28rpx;
      }
    }
  }

  .bg-blue-btn {
    color: white;
    background: linear-gradient(to right, #68b9e5, #2f92f8);
  }

  .logo-welcome {
    width: 80%;
    margin: 100rpx auto 0;

    .logo-welcome-text {
      font-size: 40rpx;
      color: #3990ea;
    }
  }
}

.saleLogin {
  margin: 100rpx 0 30rpx;
  height: 84rpx;
  background: #d3d3d3 !important;

  .butText {
    padding-left: 20rpx;
    font-size: 32rpx;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #ffffff;
    line-height: 82rpx;
  }
}

.saleLoginActive {
  background: #fc8d31 !important;
}

.checkbox {
  font-size: 22rpx;
}

.texttig {
  position: absolute;
  bottom: 64rpx;
  left: 64rpx;
  right: 64rpx;
  text-align: center;
  font-size: 24rpx;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #999999;
  line-height: 40rpx;
}

.bottomSale {
  display: inline-block;
  padding: 0rpx;

  .butText {
    font-size: 28rpx;
    padding: 10rpx 14rpx;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #f37b1d;
    line-height: 40rpx;
    background: #fff;
  }
}

.bottomSale::after {
  border: 1rpx solid #fff;
}
</style>
