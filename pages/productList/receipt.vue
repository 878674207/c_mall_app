<template>
  <view class="newAddress">
    <!-- <view class="top">
      <u-icon class="shouh" name="arrow-left" size="20" color="#767676" @click="rightClick"></u-icon>
      收获地址
    </view> -->
    <template v-if="params.length > 0">
      <view class="contentBox">
        <view class="content" v-for="(item, index) in params" :key="index">
          <view class="content-top flex-spb">
            <view class="flex">
              <u-icon :name="`${imgBasePath}/static/images/icons/icon-home-circle-red.png`" color="#2979ff" size="30"
                v-if="index == radioCurrent"></u-icon>
              <u-icon :name="`${imgBasePath}/static/images/icons/icon-home-circle.png`" color="#2979ff" size="30"
                v-else></u-icon>
              <view class="text">
                <view class="text-top">
                  <span>{{ item.receiverName }}</span>
                  <span style="padding-left:6px">{{ item.receiverPhone }}</span>
                </view>
                <span class="text-bootom">{{ item.provinceLabel + '/' + item.cityLabel + '/' + item.regionLabel + '/' +
      item.address }}</span>
              </view>
            </view>
            <u-icon @click="edit(item)" :name="`${imgBasePath}/static/images/icons/icon-edt.png`" color="#2979ff"
              size="20"></u-icon>
          </view>
          <view class="content-footer">
            <u-checkbox-group @change="changeAdd(item)" shape="circle">
              <u-checkbox activeColor="#DE3C31" size="20" :checked='index == radioCurrent'>设为默认地址</u-checkbox>
            </u-checkbox-group>
            <view @click="cope(item)">
              <u-icon :name="`${imgBasePath}/static/images/icons/icon-copy.png`" color="#2979ff" size="16"></u-icon>
              <span>复制</span>
            </view>
            <view @click="getdeleteReceipt(item.id)" style="margin-left:30px">
              <u-icon :name="`${imgBasePath}/static/images/icons/icon-delete.png`" color="#2979ff" size="16"></u-icon>
              <span style="color: #CD9063;">删除</span>
            </view>
          </view>
        </view>
      </view>
    </template>
    <u-empty mode="data" v-else :icon="`${imgBasePath}/static/images/icons/img-blank-address.png`" textSize="14"
      width="150" height="150" />
    <view class="address-btn">
      <button @click="add">新增地址</button>
    </view>
  </view>
</template>

<script>
import { getReceipt, getdeleteReceipt } from '@/api/system/newAddress.js'
import { getAdress } from '@/api/system/newAddress.js'
export default {
  data() {
    return {
      pageNum: 1,
      pageSize: 10,
      params: [],
      choose: true,
      radioCurrent: 0,
      checkedList: [],
      defaultAddress: null,
    }
  },
  onLoad() {
    this.getReceipt()
  },
  methods: {
    // 返回按钮
    rightClick() {
      this.$tab.navigateBack()
    },
    // 查询我的收货地址列表
    getReceipt() {
      let data = {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
      }
      getReceipt(data).then((res) => {
        // console.log(res)
        if (res.code == 200) {
          if (res.data && res.data.records) {
            this.params = res.data.records
          }
        }
      })
    },
    changeAdd(item) {
      for (let i = 0; i < this.params.length; i++) {
        if (this.params[i].id === item.id) {
          console.log(i);
          this.radioCurrent = i //0,1,2
          // console.log(this.radioCurrent);
          this.defaultAddress = this.params[i].defaultAddress
        }
      }
      let userInfo = {
        id: item.id,
        defaultAddress: item.defaultAddress == 0 ? '1' : '0',//defaultAddress传要变的值
      }
      getAdress(userInfo).then((res) => {
        if (res.code == 200) {
          this.getReceipt()
        //这类改变页面样式为 第一个默认勾选 因为后台返回列表默认第一个是默认地址
          this.radioCurrent = 0 
          uni.$u.toast('保存成功~')
        }
      })
    },
    // 删除收货地址
    getdeleteReceipt(data) {
      // console.log(data)
      getdeleteReceipt([data]).then((res) => {
        if (res.code == 200) {
          uni.$u.toast('删除成功')
          this.getReceipt()
        }
      })
    },
    cope(item) {
      let str = `${item.receiverName} ${item.receiverPhone} 
${item.provinceLabel}/${item.cityLabel}/${item.regionLabel}/${item.address} `
      uni.setClipboardData({
        data: str,
        success(res) {
          // console.log(res)
        },
      })
    },
    // 编辑
    edit(item) {
      uni.navigateTo({
        url: '/pages/productList/newAddress?item=' + JSON.stringify(item),
      })
    },
    // 新增地址
    add() {
      uni.navigateTo({
        url: '/pages/productList/newAddress',
      })
    },
  },
}
</script>

<style scoped lang="scss">
* {
  margin: 0;
  padding: 0;
}

.newAddress {
  background-color: #f4f5f9;
  height: 100vh;
  position: relative;

  ::v-deep .u-empty {
    margin-top: 150px !important;
  }

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

  .contentBox {
    padding: 0 14px 94px;

    .content {
      background-color: #fff;
      border-radius: 10px;
      margin-bottom: 10px;
      display: flex;
      flex-direction: column;
      padding: 16px;

      .content-top {
        display: flex;
        align-items: flex-start;

        .text {
          display: flex;
          flex-direction: column;
          margin-left: 10px;

          .text-top {
            font-size: 16px;
            font-family: PingFangSC, PingFang SC;
            font-weight: 700;
            color: #363636;
          }

          .text-bootom {
            padding-top: 6px;
            font-size: 15px;
            font-family: PingFangSC, PingFang SC;
            font-weight: 400;
            color: #767676;
            line-height: 24px;
          }

          span {
            font-size: 16px;
            font-family: PingFangSC, PingFang SC;
            font-weight: 500;
            color: #363636;
            line-height: 16px;
          }
        }
      }

      .content-footer {
        display: flex;
        padding-top: 20px;
        margin-top: 20px;
        border-top: 1px solid #f0f0f0ed;
        padding-right: 10px;

        u-icon {
          margin-right: 10px;
        }

        view {
          // margin-left: 10px;
          margin-right: 5px;
          display: flex;
        }
      }
    }
  }

  .address-btn {
    position: fixed;
    bottom: 34px;
    right: 0;
    left: 0;
    height: 56px;
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
}
</style>