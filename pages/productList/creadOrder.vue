<template>
  <view class="creaBox" v-if="params">
    <view class="addresstop flex-spb align-c" @click="changeAddress(true)">
      <view class="flex align-c">
        <image class="addimg" :src="`${imgBasePath}/static/images/icons/icon-location-circle.png`" />
        <view v-if="params.orderAddress">
          <view class="addtext">{{params.orderAddress.provinceLabel}}{{params.orderAddress.cityLabel}}{{params.orderAddress.regionLabel}}</view>
          <view class="addtitle">{{params.orderAddress.address}}</view>
          <view class="addtext">{{params.orderAddress.receiverName}} {{params.orderAddress.receiverPhone}}</view>
        </view>
      </view>
      <image class="rightimg" :src="`${imgBasePath}/static/images/icons/icon-arrow-right.png`" />
    </view>
    <view class="shopbox" v-for="(item,indes) in params.confirmOrderList" :key="`a${indes}`">
      <view class="flex align-c">
        <image class="storeimg" :src="`${imgBasePath}/static/images/icons/icon-my-shop.png`" />
        <span class="storetitle">{{item.storeName}}</span>
        <image class="rightimg" :src="`${imgBasePath}/static/images/icons/icon-arrow-right.png`" />
      </view>
      <view class="goodlist flex" v-for="(goods,index) in item.confirmOrderItems" :key="`b${index}`">
        <image class="goodimg" :src="`${goods.productPic}`" />
        <view class="gooditem flex-col flex-spb grow1">
          <view>
            <p class="goodtitle">{{goods.productName}}</p>
            <p class="goodinfo">{{setRule(goods.productAttr)}}</p>
          </view>
          <view class="flex-spb  align-c">
            <p class="price">￥{{goods.price}}</p>
            <p>x {{goods.quantity}}</p>
            <!-- <u-number-box v-model="goods.quantity" @change="valChange"></u-number-box> -->
          </view>
        </view>
      </view>
      <view class="goodcomm flex-spb" v-for="(items,index) in list" :key="`c${index}`" @click="openPop(items,item,indes)">
        <p>{{items.name}}</p>
        <p class="flex-spb align-c">
          <span class="ellipsis" v-if="items.value === 4">{{params.confirmOrderList[indes].remark?params.confirmOrderList[indes].remark: '无备注'}}</span>
          <image class="rightimg" :src="`${imgBasePath}/static/images/icons/icon-arrow-right.png`" />
        </p>
      </view>
    </view>
    <view class="priceBox">
      <p class="titel">价格明细</p>
      <view class="priitem flex-spb align-c">
        <p class="ptitle">商品金额</p>
        <p class="nums">￥{{params.paymentVo.totalPrice}}</p>
      </view>
      <view class="priitem flex-spb align-c">
        <p class="ptitle">运费</p>
        <p class="nums">￥{{params.paymentVo.deliverPrice}}</p>
      </view>
    </view>
    <view class="butbox flex-end align-c">
      <p class="hej">合计:<span class="utin">￥</span></p>
      <p class="nums">{{params.paymentVo.totalPrice}}</p>
      <button class="oeder" @click="ordersubmit" :disabled="butDisabled">提交订单</button>
    </view>
    <!-- 弹框 -->
    <pop :title="title" ref="pop">
      <template v-if="title==='选择地址'">
        <!-- 物流 -->
        <view slot="content">
          <view class="wuliu">
            <view class="wl-bottomover" style="height: 400px;">
              <!-- 地址列表弹框 -->
              <selectAddress :replist="replist" @radioChange="radioChange"></selectAddress>
            </view>
          </view>
        </view>
        <button slot="bottom" type="primary" class="combuts" @click="changeAddress(false)">
          确认
        </button>
      </template>
      <template v-if="title==='备注'">
        <!-- 备注 -->
        <view slot="content">
          <view class="wuliu">
            <view class="wl-bottomover">
              <!-- 地址列表弹框 -->
              <u--textarea v-model="taskContent" height="250" placeholder="选填，请填写您的备注信息"></u--textarea>
            </view>
          </view>
        </view>
        <button slot="bottom" type="primary" class="combuts" @click="marketSubmit(false)">
          确定
        </button>
      </template>
    </pop>
  </view>
</template>

<script>
import {
  productsettle,
  ordersubmit,
  basketsettle,
} from '@/api/system/productsList.js'
import { getReceipt } from '@/api/system/newAddress.js'
import pop from './pop.vue'
import selectAddress from './selectAddress.vue'
import { purchaseAgain } from '@/api/system/order.js'
export default {
  components: { pop, selectAddress },
  data() {
    return {
      value: 1,
      list: [
        { value: 1, name: '配送', lable: null },
        { value: 2, name: '运费险', lable: null },
        { value: 3, name: '发票', lable: null },
        { value: 4, name: '备注', lable: '无备注' },
      ],
      carParams: {
        productId: null,
        productSkuId: null,
        quantity: null,
        deliveryAddressId: null,
      }, //购物车参数
      listParams: [], //已选商品列表
      params: null,
      replist: [],
      butDisabled: false, //底部按钮是否禁用
      title: '选择地址',
      taskContent: null,
      downIndex: null,
    }
  },
  onLoad(event) {
    if (event.id) {
      this.purchaseAgain(event.id)
    }
    if (event.carParams) {
      this.carParams = JSON.parse(event.carParams)
      this.getData()
    }
    if (event.listParams) {
      this.listParams = JSON.parse(event.listParams)
      this.getList()
    }
    this.getReceipt()
  },
  methods: {
    marketSubmit() {
      this.params.confirmOrderList[this.downIndex].remark = this.taskContent
      this.$refs.pop.show = false
      console.log(this.params.confirmOrderList)
    },
    openPop(items, item, indes) {
      // 当前操作的商品下标
      // 点击 备注
      if (items.name === '备注') {
        this.downIndex = indes
        this.title = items.name
        this.taskContent = this.params.confirmOrderList[this.downIndex].remark
        this.$refs.pop.show = true
      }
    },
    // 查询我的收货地址列表
    getReceipt() {
      let data = {
        pageNum: 1,
        pageSize: 100,
      }
      getReceipt(data).then((res) => {
        this.replist = res.data.records
      })
    },
    // 单选 地址
    radioChange(e, item) {
      this.carParams.deliveryAddressId = e
      this.params.orderAddress = { ...item }
    },
    changeAddress(istrue) {
      this.title = '选择地址'
      this.$refs.pop.show = istrue
    },
    setRule(item) {
      let arr = JSON.parse(item)
      let str = ''
      arr.forEach((element) => {
        str += element.key + '【' + element.value + '】'
      })
      return str
    },
    // 再买一单 接口函数
    purchaseAgain(id) {
      purchaseAgain(id).then((res) => {
        if (res.code == 200) {
          this.params = res.data
          this.params.settleFrom = 'product-detail'
        }
      })
    },
    ordersubmit() {
      this.butDisabled = true
      ordersubmit(this.params)
        .then((res) => {
          // this.params = res.data
          this.$modal.showToast('订单提交成功！')
          this.$tab.navigateTo('/pages/mine/order/index')
        })
        .finally((r) => {
          this.butDisabled = false
        })
    },
    valChange() {},
    // 从商品详情结算
    getData() {
      productsettle(this.carParams).then((res) => {
        this.params = res.data
        this.params.settleFrom = 'product-detail'
      })
    },
    // 从购物车结算
    getList() {
      basketsettle(this.listParams).then((res) => {
        this.params = res.data
        this.params.settleFrom = 'basket'
      })
    },
  },
}
</script>
<style  scoped lang="scss">
.creaBox {
  padding: 14px 14px 118px;
  background: #f8f9fb;
  .addresstop {
    padding: 16px 12px 16px;
    background: #ffffff;
    border-radius: 8px;
    .addimg {
      flex: 0 0 30px;
      width: 30px;
      height: 30px;
      margin-right: 10px;
    }
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
    .rightimg {
      width: 22px;
      height: 22px;
    }
  }
  .shopbox {
    background: #ffffff;
    border-radius: 8px;
    padding: 16px 12px 0;
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
      p span {
        max-width: 200px;
        color: #767676;
        margin-right: 5px;
      }
    }
  }
  .priceBox {
    padding: 16px 12px 0;
    margin-top: 10px;
    background: #ffffff;
    border-radius: 8px;
    .titel {
      font-size: 16px;
      font-family: PingFangSC, PingFang SC;
      font-weight: 500;
      color: #363636;
      line-height: 16px;
    }
    .priitem {
      padding: 16px 0;
      .ptitle {
        font-size: 15px;
        font-family: PingFangSC, PingFang SC;
        font-weight: 400;
        color: #363636;
        line-height: 16px;
      }
      .nums {
        font-size: 15px;
        font-family: PingFangSC, PingFang SC;
        font-weight: 500;
        color: #363636;
        line-height: 16px;
      }
    }
  }
  .butbox {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 8px 12px 42px;
    background: #ffffff;
    border-top: 1px solid #f0f0f0;
    .hej {
      font-size: 12px;
      font-family: PingFangSC, PingFang SC;
      font-weight: 400;
      color: #363636;
      line-height: 12px;
      .utin {
        color: #de3c31;
      }
    }
    .nums {
      padding-right: 16px;
      font-size: 18px;
      font-family: PingFangSC, PingFang SC;
      font-weight: 600;
      color: #de3c31;
      line-height: 18px;
    }
    .oeder {
      height: 40px;
      width: 112px;
      margin: 0;
      background: #de3c31;
      border-radius: 20px;
      border: 1px solid #de3c31;
      font-size: 14px;
      font-family: PingFangSC, PingFang SC;
      font-weight: 500;
      color: #ffffff;
      line-height: 38px;
      text-align: center;
    }
  }
  .combuts {
    margin: 8px 12px;
    height: 40px;
    background: #de3c31;
    border-radius: 20px;
    border: 1px solid #de3c31;
    font-size: 16px;
    font-family: PingFangSC, PingFang SC;
    font-weight: 500;
    color: #ffffff;
    line-height: 38px;
  }
  ::v-deep .u-number-box__minus,
  ::v-deep .u-number-box__plus {
    width: 24px;
    height: 24px !important;
    padding: 2px !important;
    background: #f8f8f8;
    border-radius: 50%;
  }
  ::v-deep .u-number-box__input {
    background: #ffffff !important;
  }
}
</style>