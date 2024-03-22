<template>
  <view class="creaBox" v-if="dataList">
    <view class="shopbox" v-for="(item, index) in dataList.orderItemList" :key="`a${index}`">
      <view class="flex align-c">
        <image class="storeimg" :src="`${imgBasePath}/static/images/icons/icon-my-shop.png`" style="width: 16px; height: 16px" />
        <span class="storetitle" @click="searchActiveshop">{{ dataList.storeName }}</span>
        <image class="rightimg" :src="`${imgBasePath}/static/images/icons/icon-arrow-right.png`" style="width: 14px; height: 14px" />
      </view>
      <view class="goodlist flex" @click="goodesFun(item)">
        <image class="goodimg" :src="item.productPic" />
        <view class="gooditem flex-col flex-spb grow1">
          <view>
            <p class="goodtitle">{{ item.productName }}</p>
            <p class="goodinfo">{{ setRule(item.productAttr) }}</p>
          </view>
          <view class="flex-spb align-c">
            <p class="price">￥{{ item.productPrice }}</p>
            <p>x {{ item.quantity }}</p>
            <!-- <u-number-box v-model="goods.quantity" @change="valChange"></u-number-box> -->
          </view>
        </view>
      </view>
      <view class="goodcomm flex-spb" v-for="(itemTwo, index) in list" :key="`b${index}`" v-show="moreFlag">
        <p>{{ itemTwo.name }}</p>
        <p v-show="itemTwo.name == '应付款'" class="payment">
          ￥{{ item.productPrice * item.quantity }}.00
        </p>
        <view v-show="itemTwo.name == '收货信息'" class="goodcommBox">
          <view>{{ dataList.orderAddress.receiverName }}
            {{ dataList.orderAddress.receiverPhone }}
          </view>
          <view>{{ dataList.orderAddress.province }}{{ dataList.orderAddress.city
                        }}{{ dataList.orderAddress.region }}</view>
          <view>{{ dataList.orderAddress.address }}</view>
        </view>
        <view v-show="itemTwo.name == '订单编号'" class="dingdanBox">{{ dataList.orderNo }}
          <p></p>
          <a @click="cope" class="copeText">复制</a>
        </view>
      </view>
      <view class="goodcomm flex-spb" v-for="(itemTwo, index) in listone" :key="`c${index}`" v-show="!moreFlag">
        <p>{{ itemTwo.name }}</p>
        <p v-show="itemTwo.name == '商品金额'" class="payment">￥{{ item.productPrice }}</p>
        <p v-show="itemTwo.name == '运费'">暂无</p>
        <p v-show="itemTwo.name == '需付款'" class="payment">￥{{ item.productPrice * item.quantity }}.00</p>
        <p v-show="itemTwo.name == '备注'">暂无</p>
      </view>
      <!-- 分割线 -->
      <view class="lineBox" v-show="!moreFlag"></view>
      <view class="goodcomm flex-spb" v-for="(itemTwo, index) in listTwo" :key="`d${index}`" v-show="!moreFlag">
        <p>{{ itemTwo.name }}</p>
        <view v-show="itemTwo.name == '收货信息'" class="goodcommBox">
          <view>{{ dataList.orderAddress.receiverName }}
            {{ dataList.orderAddress.receiverPhone }}
          </view>
          <view>{{ dataList.orderAddress.province }}{{ dataList.orderAddress.city
                        }}{{ dataList.orderAddress.region }}</view>
          <view>{{ dataList.orderAddress.address }}</view>
        </view>
        <p v-show="itemTwo.name == '配送方式'">暂无</p>
        <view v-show="itemTwo.name == '订单编号'" class="dingdanBox">{{ dataList.orderNo }}
          <p></p>
          <a @click="cope" class="copeText">复制</a>
        </view>
        <p v-show="itemTwo.name == '创建时间'">{{ item.createTime }}</p>
        <p v-show="itemTwo.name == '支付时间'">{{ item.createTime }}</p>
        <p v-show="itemTwo.name == '支付方式'">暂无</p>
      </view>
      <view class="textBox" v-if="moreFlag" @click="moreFlagfunction(item.id)">
        查看更多
        <image class="rightimg" :src="`${imgBasePath}/static/images/icons/icon-arrow-down.png`" style="width: 14px; height: 14px " />
      </view>
      <view class="textBox" v-else @click="moreFlagfunction(item.id)">
        收起
        <image class="rightimg" :src="`${imgBasePath}/static/images/icons/icon-arrow-up.png`" style="width: 14px; height: 14px " />
      </view>
    </view>
    <view class="invoiceBox">
      <view class="invoiceBoxLine" v-for="(itemTwo, index) in listThree" :key="index">
        <p>{{ itemTwo.name }}</p>
        <p v-show="itemTwo.name == '发票类型'">暂无</p>
        <p v-show="itemTwo.name == '开票方式'">暂无</p>
        <p v-show="itemTwo.name == '单位名称'">暂无</p>
      </view>
    </view>
    <view class="questionBox">
      <view>遇到问题？</view>
      <view class="contactBtn">
        <image class="rightimg" :src="`${imgBasePath}/static/images/icons/icon-service-color.png`" style="width: 22px; height: 22px" />
        联系卖家
      </view>
    </view>
    <view class="butbox flex-end align-c">
      <view class="btnBox">
        <button class="oederOne" @click="deleteOrder">删除订单</button>
        <button class="oederTwo" @click="buyNow">加入购物车</button>
      </view>
    </view>
    <!-- 弹框 -->
    <pop title="选择地址" ref="pop">
      <!-- 物流 -->
      <view class="wuliu" slot="content" v-if="replist.length > 0">
        <view class="wl-bottomover">
          <!-- 地址列表弹框 -->
          <selectAddress :replist="replist" @radioChange="radioChange"></selectAddress>
        </view>
      </view>
      <button slot="bottom" type="primary" class="combuts" @click="changeAddress(false)">
        确认
      </button>
    </pop>
  </view>
</template>

<script>
import {
  orderDetail,
  orderAddresse,
  cancelOrder,
  deleteOrder,
} from '@/api/system/order.js'
import { productsettle } from '@/api/system/productsList.js'
import pop from './pop'
import selectAddress from './selectAddress.vue'
import { getReceipt } from '@/api/system/newAddress.js'
import { basketsave } from '@/api/system/productsList.js'
export default {
  components: { pop, selectAddress },
  data() {
    return {
      dataList: null, //总数据源 res.data
      show: true,
      replist: [], //收货列表
      moreFlag: true,
      list: [
        { value: 1, name: '应付款' },
        { value: 1, name: '收货信息' },
        { value: 1, name: '订单编号' },
      ],
      listone: [
        { value: 1, name: '商品金额' },
        { value: 1, name: '运费' },
        { value: 1, name: '需付款' },
        { value: 1, name: '备注' },
      ],
      listTwo: [
        { value: 1, name: '收货信息' },
        { value: 1, name: '配送方式' },
        { value: 1, name: '订单编号' },
        { value: 1, name: '创建时间' },
        { value: 1, name: '支付时间' },
        { value: 1, name: '支付方式' },
      ],
      listThree: [
        { value: 1, name: '发票类型' },
        { value: 1, name: '开票方式' },
        { value: 1, name: '单位名称' },
      ],
      //修改地址返回的参数
      deliveryAddressId: null,
      deliveryAddress: {},
      params: {},
    }
  },
  onLoad(event) {
    if (event && event.id) {
      orderDetail(event.id).then((res) => {
        console.log(res)
        if (res.code == 200) {
          if (res && res.data) {
            this.dataList = res.data
          }
        }
      })
      this.getReceipt()
    }
  },
  methods: {
    changeAddress(istrue) {
      this.$refs.pop.show = istrue
      this.orderAddresse()
    },
    setRule(item) {
      let arr = JSON.parse(item)
      let str = ''
      arr.forEach((element) => {
        str += element.key + '【' + element.value + '】'
      })
      return str
    },
    // 复制
    cope() {
      let orderNo = this.dataList.orderNo
      let str = `${orderNo}`
      uni.setClipboardData({
        data: str,
        success(res) {
          console.log(res, '复制成功')
        },
      })
    },
    // 修改地址
    orderAddresse() {
      let params = {
        orderId: this.dataList.id,
        receiverName: this.deliveryAddress.receiverName,
        receiverPhone: this.deliveryAddress.receiverPhone,
        province: this.dataList.orderAddress.province,
        city: this.deliveryAddress.cityLabel,
        region: this.deliveryAddress.regionLabel,
        address: this.deliveryAddress.address,
      }
      orderAddresse(params).then((res) => {
        console.log(res)
      })
    },
    // 查询我的收货地址列表
    getReceipt() {
      let data = {
        pageNum: 1,
        pageSize: 100,
      }
      getReceipt(data).then((res) => {
        if (res.code == 200) {
          if (res.data) {
            this.replist = res.data.records
          }
        }
      })
    },
    // 删除订单
    deleteOrder() {
      let self = this
      return new Promise((resolve, reject) => {
        uni.showModal({
          title: '',
          content: '是否确认取消订单',
          cancelText: '取消',
          confirmText: '确定',
          success: function (res) {
            if (res.confirm) {
              deleteOrder(self.dataList.id).then((res) => {
                console.log(res)
                if (res.code == 200) {
                  self.$tab.navigateBack()
                }
              })
            }
          },
        })
      })
    },
    // 查看 收起 控制函数contentBox
    moreFlagfunction(id) {
      console.log(id);
      this.dataList.orderItemList.forEach(item=>{
        if (item.id == id){
          this.moreFlag = !this.moreFlag
        }
      })
    },
    // 单选 地址
    radioChange(e, item) {
      this.deliveryAddressId = e
      this.deliveryAddress = item
      // console.log(item);
      // console.log(this.deliveryAddressId, this.deliveryAddress);
    },
    // 加入购物车 
    buyNow() {
      let self = this
      this.dataList.orderItemList.forEach(item=>{
        let cartInfo = {
          storeId: self.dataList.storeId,
          storeName: self.dataList.storeName,
          productId: item.productId,
          productSkuId: item.productSkuId,
          quantity: item.quantity,
        }
        basketsave(cartInfo).then((res) => {
          if (res.code == 200) {
             uni.$u.toast('操作成功~')
            this.$tab.switchTab(`/pages/addcart/index`)
          }
        })
      })
    },
    // 点击店铺跳转
    searchActiveshop() {
      this.$tab.navigateTo(
        `/pages/common/storeDetails/index?exStoreId=${this.dataList.storeId}`
      )
    },
    // 点击具体商品跳转
    goodesFun(item) {
      uni.navigateTo({
        url: `/pages/productList/detail?id=${item.productId}`,
      })
    },
  },
}
</script>

<style scoped lang="scss">
// ::v-deep .uni-page-head{
//     background-color: #F4F5F9 !important;
// }
.creaBox {
  display: flex;
  flex-direction: column;
  padding: 10px 14px;
  background-color: #f9fafd;

  .CustomerInformation {
    background-color: #ffffff;
    display: flex;
    align-items: center;
    padding: 16px 12px;
    justify-content: space-between;
    border-radius: 8px;

    .rightBox {
      display: flex;
      align-items: center;

      .addimg {
        margin-right: 20px;
      }

      .informationText {
        .addtext {
          font-size: 14px;
          font-family: PingFangSC, PingFang SC;
          font-weight: 400;
          color: #767676;
          line-height: 14px;
        }

        .addtitle {
          padding: 4px 0;
          font-size: 16px;
          font-family: PingFangSC, PingFang SC;
          font-weight: 500;
          color: #363636;
          line-height: 24px;
        }
      }
    }

    .reviseBtn {
      button {
        padding: 5px 20px;
        border-radius: 17px;
        border: 1px solid #b7b7b7;
        font-family: PingFangSC, PingFang SC;
        font-weight: 400;
        font-size: 15px;
        color: #767676;
        line-height: 20px;
        text-align: center;
        font-style: normal;
      }
    }
  }

  .shopbox {
    background-color: #ffffff;
    border-radius: 8px;
    padding: 12px 12px;
    margin-top: 10px;

    .storeimg {
      width: 16px;
      height: 16px;
    }

    .storetitle {
      padding: 0 6px;
      font-size: 16px;
      font-family: PingFangSC, PingFang SC;
      font-weight: 500;
      color: #363636;
      line-height: 16px;
    }

    .rightimg {
      width: 14px;
      height: 14px;
    }

    .goodlist {
      padding: 14px 0;

      .goodimg {
        width: 100px;
        height: 100px;
        margin-right: 10px;
        border-radius: 5px;

        background-image: url('@/static/images/img-default.png');
        background-size: 100% 100%;
        background-position: center;
      }

      .gooditem {
        padding: 6px 0;

        .goodtitle {
          font-size: 15px;
          font-family: PingFangSC, PingFang SC;
          font-weight: 400;
          color: #363636;
          line-height: 16px;
        }

        .goodinfo {
          padding-top: 10px;
          font-size: 14px;
          font-family: PingFangSC, PingFang SC;
          font-weight: 400;
          color: #767676;
          line-height: 14px;
        }

        .price {
          font-size: 14px;
          font-family: PingFangSC, PingFang SC;
          font-weight: 500;
          color: #363636;
          line-height: 14px;
        }
      }
    }

    .goodcomm {
      padding: 16px 0;
      font-size: 15px;
      font-family: PingFangSC, PingFang SC;
      font-weight: 400;
      color: #363636;
      line-height: 16px;

      .payment {
        font-family: PingFangSC, PingFang SC;
        font-weight: 500;
        font-size: 15px;
        color: #de3c31;
        line-height: 16px;
        text-align: left;
        font-style: normal;
      }

      .goodcommBox {
        font-family: PingFangSC, PingFang SC;
        font-weight: 400;
        font-size: 15px;
        color: #363636;
        line-height: 24px;
        text-align: right;
        font-style: normal;

        view {
          display: flex;
          justify-content: end;
        }
      }

      .dingdanBox {
        display: flex;
        font-size: 13px;

        .copeText {
          font-family: PingFangSC, PingFang SC;
          font-weight: 400;
          font-size: 15px;
          color: #767676;
          line-height: 16px;
          text-align: right;
          font-style: normal;
        }

        p {
          width: 3px;
          height: 16px;
          font-family: PingFangSC, PingFang SC;
          font-weight: 400;
          font-size: 15px;
          background-color: #f0f0f0;
          line-height: 16px;
          text-align: right;
          font-style: normal;
          margin-left: 10px;
          margin-right: 10px;
        }

        a {
          color: #767676;
        }
      }
    }

    .textBox {
      display: flex;
      justify-content: center;
      align-items: center;
      font-family: PingFangSC, PingFang SC;
      font-weight: 400;
      font-size: 14px;
      color: #767676;
      line-height: 14px;
      text-align: right;
      font-style: normal;

      image {
        margin-left: 8px;
      }
    }

    .lineBox {
      width: 338px;
      height: 1px;
      background: #f0f0f0;
      margin: 10px 0;
    }
  }

  .invoiceBox {
    background-color: #ffffff;
    border-radius: 8px;
    padding: 16px 10px;
    margin-top: 10px;
    display: flex;
    flex-direction: column;

    .invoiceBoxLine {
      display: flex;
      justify-content: space-between;
      margin: 9px 5px;
    }
  }

  .questionBox {
    padding: 16px 12px;
    margin-top: 10px;
    background: #ffffff;
    border-radius: 8px;
    margin-bottom: 100px;
    display: flex;
    justify-content: space-between;

    .contactBtn {
      display: flex;
      justify-content: center;
      align-items: center;
      font-family: PingFangSC, PingFang SC;
      font-weight: 400;
      font-size: 15px;
      color: #cd9063;
      line-height: 16px;
      text-align: left;
      font-style: normal;

      .rightimg {
        margin-right: 10px;
      }
    }
  }

  .butbox {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 15px 12px 30px;
    background: #ffffff;
    display: flex;
    justify-content: end;

    .btnBox {
      display: flex;
      flex-direction: row;

      button {
        width: 86px;
        height: 34px;
        border-radius: 17px;
        border: 1px solid #b7b7b7;
        display: flex;
        justify-content: center;
        align-items: center;
        font-family: PingFangSC, PingFang SC;
        font-weight: 400;
        font-size: 14px;
        color: #767676;
        line-height: 20px;
        text-align: left;
        font-style: normal;
        margin-left: 5px;
      }

      .oederOne {
        background-color: #fff;
      }

      .oederTwo {
        width: 100px;
        height: 34px;
        border-radius: 17px;
        border: 1px solid #de3c31;
        font-family: PingFangSC, PingFang SC;
        font-weight: 400;
        font-size: 14px;
        color: #de3c31;
        line-height: 20px;
        text-align: center;
        font-style: normal;
        background-color: #fff;
      }
    }

    .cancelOrder {
      font-family: PingFangSC, PingFang SC;
      font-weight: 400;
      font-size: 14px;
      color: #767676;
      line-height: 14px;
      text-align: left;
      font-style: normal;
    }
  }

  .wuliu {
    .wl-bottomover {
      height: 200px;
      overflow: hidden;
    }
  }
}
</style>