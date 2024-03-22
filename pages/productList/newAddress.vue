<template>
  <view class="newAddress">
    <!-- <view class="top">
      <u-icon class="shouh" name="arrow-left" size="20" color="#767676" @click="rightClick"></u-icon>
      新增收获地址
    </view> -->
    <view class="com-form">
      <u--form labelPosition="left" :model="userInfo" :rules="rules" ref="uForm" :labelStyle="labelStyle" labelWidth="94">
        <view class="form-item-box">
          <u-form-item label="收货人" prop="receiverName" borderBottom>
            <u--input v-model="userInfo.receiverName" border="none" maxlength="11" placeholder="请填写收货人姓名" />
          </u-form-item>
          <u-form-item label="手机号码" prop="receiverPhone" borderBottom>
            <u--input v-model="userInfo.receiverPhone" border="none" maxlength="11" placeholder="请填写收货人手机号码" />
            <span class="nums">+86 ></span>
          </u-form-item>
          <u-form-item label="所在地区" prop="columnsName" borderBottom>
            <cityBase ref="cityCase" :label="userInfo.columnsName" :cityCodes="cityCodes" @change="HandleCitychange" class="cityBase"></cityBase>
          </u-form-item>
          <u-form-item label="详细地址" prop="address" borderBottom>
            <u--textarea v-model="userInfo.address" placeholder="街道、小区、楼栋" height="48"></u--textarea>
          </u-form-item>
          <u-form-item label="设为默认收获地址" prop="checked" labelWidth="200" style="position: relative;">
            <u-switch class="seitch" v-model="userInfo.defaultAddress" size="22" active-color="red" inactive-color="#eee" :activeValue="1" :inactiveValue="0"></u-switch>
          </u-form-item>
        </view>
        <view class="address-btn">
          <button :disabled="butDisabled" @click="saveBtn">保存</button>
        </view>
      </u--form>
    </view>
  </view>
</template>
 
<script>
import cityBase from '@/pages/productList/cityBase.vue'
import { getAdress } from '@/api/system/newAddress.js'
export default {
  components: { cityBase },
  data() {
    return {
      butDisabled: false,
      labelStyle: {
        fontSize: '15px',
        fontWeight: 500,
        color: '#282A2A',
      },
      userInfo: {
        receiverName: null,
        receiverPhone: null,
        address: null,
        city: null,
        province: null,
        region: null,
        cityLabel: null,
        provinceLabel: null,
        regionLabel: null,
        defaultAddress: 0,//一开始不选的话默认给后台0
        columnsName: null,
      },
      cityCodes: [],
      rules: {
        receiverName: {
          required: true,
          message: '请填写收货人姓名',
          trigger: ['blur', 'change'],
        },
        // 手机号
        receiverPhone: [
          {
            required: true,
            message: '请填写收货人手机号码',
            trigger: ['blur', 'change'],
          },
          {
            pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
            transform(value) {
              return String(value)
            },
            message: '请填写正确手机号格式',
          },
        ],
        columnsName: {
          required: true,
          message: '请选择所在地区',
          trigger: ['blur', 'change'],
        },
        address: {
          required: true,
          message: '请填写详细地址',
          trigger: ['blur', 'change'],
        },
      },
    }
  },
  //页面初始化
  onLoad(event) {
    if (event.item) {
      this.userInfo = JSON.parse(event.item)
      this.userInfo.columnsName =
        this.userInfo.provinceLabel +
        '/' +
        this.userInfo.cityLabel +
        '/' +
        this.userInfo.regionLabel
      this.cityCodes = [
        this.userInfo.province,
        this.userInfo.city,
        this.userInfo.region,
      ]
    }
  },
  methods: {
    // 返回按钮
    rightClick() {
      this.$tab.navigateBack()
    },
    // 是否设置为默认地址开关
    change(status) {
      if (status) {
        this.defaultAddress = 1
      } else {
        this.defaultAddress = 0
      }
    },
    HandleCitychange(e) {
      console.log(e);
      this.userInfo.city = e.cityCode
      this.userInfo.province = e.provinceCode
      this.userInfo.region = e.areaCode
      this.userInfo.cityLabel = e.cityName
      this.userInfo.provinceLabel = e.provinceName
      this.userInfo.regionLabel = e.areaName
      this.userInfo.columnsName = e.columnsName
    },
    // 点击保存按钮
    saveBtn() {
      this.$refs.uForm
        .validate()
        .then((res) => {
          this.butDisabled = true
          let userInfo = { ...this.userInfo }
          getAdress(userInfo)
            .then((res) => {
              uni.$u.toast('保存成功~')
              this.$tab.navigateBack()
            })
            .finally((r) => {
              this.butDisabled = false
            })
        })
        .catch((errors) => {
          uni.$u.toast('请填写完整在提交哦~~')
        })
    },
  },
}
</script>
 
<style scoped lang="scss">
.phcolor {
  color: #999999;
}

.newAddress {
  .form-item-box {
    height: 100vh;
    .nums {
      font-size: 14px;
      font-family: PingFangSC, PingFang SC;
      font-weight: 400;
      color: #767676;
      line-height: 20px;
    }
  }
  background-color: #f4f5f9;
  height: 100vh;
  overflow: hidden;

  .top {
    position: sticky;
    top: 0;
    width: 100%;
    padding: 48px 20px 14px;
    background-color: #f4f5f9;
    z-index: 4;
    font-size: 20px;
    font-family: PingFangSC, PingFang SC;
    font-weight: 600;
    color: #363636;
    text-align: center;
    .shouh {
      position: absolute;
      left: 14px;
      margin-top: 3px;
    }
  }
}
.address-btn {
  position: absolute;
  bottom: 34px;
  right: 0;
  //   display: flex;
  left: 0;
  height: 56px;
  background: #ffffff;
  padding: 8px 12px;

  button {
    height: 40px;
    background: #de3c31;
    border-radius: 20px;
    border: 1px solid #de3c31;
    color: #fff;
    line-height: 40px;
  }
}
.seitch {
  position: absolute;
  right: 0px;
  top: 19px;
}
</style>