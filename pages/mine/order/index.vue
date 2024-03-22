<template>
  <view class="proList">
    <!-- 搜索框 -->
    <view class="searchBox">
      <!-- 上面的搜索框 -->
      <view class="topBox">
        <u-icon name="arrow-left" size="20" color="#767676" @click="rightClick"></u-icon>
        <view class="search-content">
          <!-- 在uni-app官网找的图标 -->
          <uni-icons type="search" size="20" color="#9F9F9F" @click="search()"></uni-icons>
          <input placeholder="呼吸机" type="text" v-model="params.keyword" @input="search()" />
        </view>
        <!-- 筛选 -->
        <view @click="filterBtn" class="filterBox">
          <span class="filter">筛选</span>
          <image class="img" :src="`${imgBasePath}/static/images/icons/icon-screen.png`" style="height: 15px;width: 15px;" />
        </view>
      </view>
      <!-- 下面的tab框 -->
      <view class="tabBox">
        <u-tabs :list="list" :current="current" @change="change" active-color="#363636" inactive-color="#767676"></u-tabs>
      </view>
    </view>
    <!-- 商品展示 -->
    <!-- 全部 -->
    <u-list @scrolltolower="scrolltolower">
      <view class="contentBox" v-if="current == 0">
        <template v-if="orderList.length>0">
          <view v-for="(item, index) in orderList" :key="index" class="orderListBox">
            <view class="one">
              <view class="one-box" @click="searchActiveshop(item)">
                <span class="one-name">{{ item.storeName }}</span>
                <image class="img" :src="`${imgBasePath}/static/images/icons/icon-arrow-right.png`" style="height: 15px;width: 15px;" />
              </view>
              <span class="one-status" @click="witingPayFunction(item)">{{
          switchFunction(item.orderStatus) }}</span>
            </view>
            <view class="two" v-for="(itemChild, indexChild) in item.orderItemList" :key="indexChild" @click="witingPayFunction(item)">
              <!-- <image class="img" :src="`${imgBasePath}/static/images/icons/img-default.png`"
            style="height: 54px;width: 54px;" /> -->
              <image class="img" :src="itemChild.productPic" style="height: 54px;width: 54px;"></image>
              <view class="reight grow1">
                <view class="top">
                  <span class="text">{{ itemChild.productName }}</span>
                  <span class="price">￥{{ itemChild.productPrice }}</span>
                </view>
                <view class="bottom grow1">
                  <span>{{ setRule(itemChild.productAttr) }}</span>
                  <span>×{{ itemChild.quantity }}</span>
                </view>
              </view>
            </view>
            <!-- <view class="three">
          退款成功
        </view> -->
            <view class="four">
              实付款￥{{ item.totalAmount }}
            </view>
            <view class="five">
              <!-- 更多的下拉框 -->
              <!-- <u-dropdown>
          <u-dropdown-item title="更多"  v-model="value1" :options="options"></u-dropdown-item>
        </u-dropdown> -->
              <view class="more">
                <!-- <span>更多</span> -->
              </view>
              <view class="button" v-show="item.orderStatus == 'waiting_pay'">
                <span @click="modifyAddress(item.id)">修改地址</span>
                <span @click="moreBtn">继续付款</span>
              </view>
              <view class="button" v-show="item.orderStatus == 'waiting_delivery'">
                <span @click="modifyAddress(item.id)">修改地址</span>
                <span>继续付款</span>
              </view>
              <view class="button" v-show="item.orderStatus == 'delivered'">
                <span>确认收货</span>
                <span>查看物流</span>
                <span @click="purchaseAgainFun(item)">再买一单</span>
              </view>
              <view class="button" v-show="item.orderStatus == 'completed'">
                <span @click="afterSales">申请售后</span>
                <span>查看物流</span>
                <span @click="purchaseAgainFun(item)">再买一单</span>
              </view>
              <view class="button" v-show="item.orderStatus == 'closed'">
                <span @click="deleteOrder(item.id)">删除订单</span>
                <span @click="purchaseAgainFun(item)">再买一单</span>
              </view>
            </view>
          </view>
        </template>
        <u-empty mode="data" class="emptyBox" v-else :icon="`${imgBasePath}/static/images/icons/img-blank-order.png`" textSize="14" width="180" height="180" />
      </view>
    </u-list>
    <!-- 待付款 -->
    <view class="contentBox" v-if="current == 1">
      <template v-if="orderList.length>0">
        <u-list @scrolltolower="scrolltolower(current)">
          <view v-for="(item, index) in orderList" :key="index" class="orderListBox" v-show="item.orderStatus == 'waiting_pay'">
            <view class="one">
              <view class="one-box" @click="searchActiveshop(item)">
                <span class="one-name">{{ item.storeName }}</span>
                <image class="img" :src="`${imgBasePath}/static/images/icons/icon-arrow-right.png`" style="height: 15px;width: 15px;" />
              </view>
              <!-- 跳转待付款页面 -->
              <span class="one-status" @click="witingPayFunction(item)">{{ switchFunction(item.orderStatus)
                }}</span>
            </view>
            <view class="two" v-for="(itemChild, indexChild) in item.orderItemList" :key="indexChild" @click="witingPayFunction(item)">
              <!-- <image class="img" :src="`${imgBasePath}/static/images/icons/img-default.png`"
            style="height: 54px;width: 54px;" /> -->
              <image class="img" :src="itemChild.productPic" style="height: 54px;width: 54px;"></image>
              <view class="reight grow1">
                <view class="top">
                  <span class="text">{{ itemChild.productName }}</span>
                  <span class="price">￥{{ itemChild.productPrice }}</span>
                </view>
                <view class="bottom grow1">
                  <span>{{ setRule(itemChild.productAttr) }}</span>
                  <span>×{{ itemChild.quantity }}</span>
                </view>
              </view>
            </view>
            <!-- <view class="three">
            退款成功
          </view> -->
            <view class="four">
              实付款￥{{ item.totalAmount }}
            </view>
            <view class="five">
              <!-- 更多的下拉框 -->
              <!-- <u-dropdown>
          <u-dropdown-item title="更多"  v-model="value1" :options="options"></u-dropdown-item>
        </u-dropdown> -->
              <view class="more">
              </view>
              <view class="button">
                <span @click="modifyAddress(item.id)">修改地址</span>
                <span>继续付款</span>
              </view>
            </view>
          </view>
        </u-list>
      </template>
      <u-empty mode="data" class="emptyBox" v-else :icon="`${imgBasePath}/static/images/icons/img-blank-order.png`" textSize="14" width="180" height="180" />
    </view>
    <!-- 待发货 -->
    <view class="contentBox" v-if="current == 2">

      <template v-if="orderList.length>0">
        <u-list @scrolltolower="scrolltolower(current)">
          <view v-for="(item, index) in orderList" :key="index" class="orderListBox" v-show="item.orderStatus == 'waiting_delivery'">
            <view class="one">
              <view class="one-box" @click="searchActiveshop(item)">
                <span class="one-name">{{ item.storeName }}</span>
                <image class="img" :src="`${imgBasePath}/static/images/icons/icon-arrow-right.png`" style="height: 15px;width: 15px;" />
              </view>
              <span class="one-status" @click="witingPayFunction(item)">{{ switchFunction(item.orderStatus)
                }}</span>
            </view>
            <view class="two" v-for="(itemChild, indexChild) in item.orderItemList" :key="indexChild" @click="witingPayFunction(item)">
              <!-- <image class="img" :src="`${imgBasePath}/static/images/icons/img-default.png`"
            style="height: 54px;width: 54px;" /> -->
              <image class="img" :src="itemChild.productPic" style="height: 54px;width: 54px;"></image>
              <view class="reight grow1">
                <view class="top">
                  <span class="text">{{ itemChild.productName }}</span>
                  <span class="price">￥{{ itemChild.productPrice }}</span>
                </view>
                <view class="bottom grow1">
                  <span>{{ setRule(itemChild.productAttr) }}</span>
                  <span>×{{ itemChild.quantity }}</span>
                </view>
              </view>
            </view>
            <!-- <view class="three">
            退款成功
          </view> -->
            <view class="four">
              实付款￥{{ item.totalAmount }}
            </view>
            <view class="five">
              <!-- 更多的下拉框 -->
              <!-- <u-dropdown>
          <u-dropdown-item title="更多"  v-model="value1" :options="options"></u-dropdown-item>
        </u-dropdown> -->
              <view class="more">
                <!-- <span>更多</span> -->
              </view>
              <view class="button">
                <span>查看物流</span>
              </view>
            </view>
          </view>
        </u-list>
      </template>
      <u-empty mode="data" class="emptyBox" v-else :icon="`${imgBasePath}/static/images/icons/img-blank-order.png`" textSize="14" width="180" height="180" />
    </view>
    <!-- 待收货 -->
    <view class="contentBox" v-if="current == 3">

      <template v-if="orderList.length>0">
        <u-list @scrolltolower="scrolltolower(current)">
          <view v-for="(item, index) in orderList" :key="index" class="orderListBox" v-show="item.orderStatus == 'waiting_delivery'">
            <view class="one">
              <view class="one-box" @click="searchActiveshop(item)">
                <span class="one-name">{{ item.storeName }}</span>
                <image class="img" :src="`${imgBasePath}/static/images/icons/icon-arrow-right.png`" style="height: 15px;width: 15px;" />
              </view>
              <span class="one-status" @click="witingPayFunction(item)">{{ switchFunction(item.orderStatus)
                }}</span>
            </view>
            <view class="two" v-for="(itemChild, indexChild) in item.orderItemList" :key="indexChild" @click="witingPayFunction(item)">
              <!-- <image class="img" :src="`${imgBasePath}/static/images/icons/img-default.png`"
            style="height: 54px;width: 54px;" /> -->
              <image class="img" :src="itemChild.productPic" style="height: 54px;width: 54px;"></image>
              <view class="reight grow1">
                <view class="top">
                  <span class="text">{{ itemChild.productName }}</span>
                  <span class="price">￥{{ itemChild.productPrice }}</span>
                </view>
                <view class="bottom grow1">
                  <span>{{ setRule(itemChild.productAttr) }}</span>
                  <span>×{{ itemChild.quantity }}</span>
                </view>
              </view>
            </view>
            <!-- <view class="three">
            退款成功
          </view> -->
            <view class="four">
              实付款￥{{ item.totalAmount }}
            </view>
            <view class="five">
              <!-- 更多的下拉框 -->
              <!-- <u-dropdown>
          <u-dropdown-item title="更多"  v-model="value1" :options="options"></u-dropdown-item>
        </u-dropdown> -->
              <view class="more">
                <!-- <span>更多</span> -->
              </view>
              <view class="button">
                <span>确认收货</span>
                <span>查看物流</span>
                <span @click="purchaseAgainFun(item)">再买一单</span>
              </view>
            </view>
          </view>
        </u-list>
      </template>
      <u-empty mode="data" class="emptyBox" v-else :icon="`${imgBasePath}/static/images/icons/img-blank-order.png`" textSize="14" width="180" height="180" />
    </view>
    <!-- 已完成 -->
    <view class="contentBox" v-if="current == 4">
      <template v-if="orderList.length>0">
        <u-list @scrolltolower="scrolltolower(current)">
          <view v-for="(item, index) in orderList" :key="index" class="orderListBox" v-show="item.orderStatus == 'completed'">
            <view>
              <view class="one">
                <view class="one-box" @click="searchActiveshop(item)">
                  <span class="one-name">{{ item.storeName }}</span>
                  <image class="img" :src="`${imgBasePath}/static/images/icons/icon-arrow-right.png`" style="height: 15px;width: 15px;" />
                </view>
                <span class="one-status" @click="witingPayFunction(item)">{{ switchFunction(item.orderStatus)
                  }}</span>
              </view>
              <view class="two" v-for="(itemChild, indexChild) in item.orderItemList" :key="indexChild" @click="witingPayFunction(item)">
                <!-- <image class="img" :src="`${imgBasePath}/static/images/icons/img-default.png`"
            style="height: 54px;width: 54px;" /> -->
                <image class="img" :src="itemChild.productPic" style="height: 54px;width: 54px;"></image>
                <view class="reight grow1">
                  <view class="top">
                    <span class="text">{{ itemChild.productName }}</span>
                    <span class="price">￥{{ itemChild.productPrice }}</span>
                  </view>
                  <view class="bottom grow1">
                    <span>{{ setRule(itemChild.productAttr) }}</span>
                    <span>×{{ itemChild.quantity }}</span>
                  </view>
                </view>
              </view>
              <!-- <view class="three">
            退款成功
          </view> -->
              <view class="four">
                实付款￥{{ item.totalAmount }}
              </view>
              <view class="five">
                <!-- 更多的下拉框 -->
                <!-- <u-dropdown>
          <u-dropdown-item title="更多"  v-model="value1" :options="options"></u-dropdown-item>
        </u-dropdown> -->
                <view class="more">
                  <!-- <span>更多</span> -->
                </view>
                <view class="button">
                  <span @click="afterSales">申请售后</span>
                  <span>查看物流</span>
                  <span @click="purchaseAgainFun(item)">再买一单</span>
                </view>
              </view>
            </view>
          </view>
        </u-list>
      </template>
      <u-empty mode="data" class="emptyBox" v-else :icon="`${imgBasePath}/static/images/icons/img-blank-order.png`" textSize="14" width="180" height="180" />
    </view>
    <!-- 已关闭 -->
    <view class="contentBox" v-if="current == 5">
      <template v-if="orderList.length>0">
        <u-list @scrolltolower="scrolltolower(current)">
          <view v-for="(item, index) in orderList" :key="index" class="orderListBox" v-show="item.orderStatus == 'closed'">
            <view v-if="item.orderStatus == 'closed'">
              <view class="one">
                <view class="one-box" @click="searchActiveshop(item)">
                  <span class="one-name">{{ item.storeName }}</span>
                  <image class="img" :src="`${imgBasePath}/static/images/icons/icon-arrow-right.png`" style="height: 15px;width: 15px;" />
                </view>
                <span class="one-status" @click="witingPayFunction(item)">{{ switchFunction(item.orderStatus)
                  }}</span>
              </view>
              <view class="two" v-for="(itemChild, indexChild) in item.orderItemList" :key="indexChild" @click="witingPayFunction(item)">
                <!-- <image class="img" :src="`${imgBasePath}/static/images/icons/img-default.png`"
            style="height: 54px;width: 54px;" /> -->
                <image class="img" :src="itemChild.productPic" style="height: 54px;width: 54px;"></image>
                <view class="reight grow1">
                  <view class="top">
                    <span class="text">{{ itemChild.productName }}</span>
                    <span class="price">￥{{ itemChild.productPrice }}</span>
                  </view>
                  <view class="bottom grow1">
                    <span>{{ setRule(itemChild.productAttr) }}</span>
                    <span>×{{ itemChild.quantity }}</span>
                  </view>
                </view>
              </view>
              <!-- <view class="three">
            退款成功
          </view> -->
              <view class="four">
                实付款￥{{ item.totalAmount }}
              </view>
              <view class="five">
                <!-- 更多的下拉框 -->
                <!-- <u-dropdown>
          <u-dropdown-item title="更多"  v-model="value1" :options="options"></u-dropdown-item>
        </u-dropdown> -->
                <view class="more">
                  <!-- <span>更多</span> -->
                </view>
                <view class="button">
                  <span @click="deleteOrder(item.id)">删除订单</span>
                  <span @click="purchaseAgainFun(item)">再买一单</span>
                </view>
              </view>
            </view>
          </view>
        </u-list>
      </template>
      <u-empty mode="data" class="emptyBox" v-else :icon="`${imgBasePath}/static/images/icons/img-blank-order.png`" textSize="14" width="180" height="180" />

    </view>
    <!-- 待评价 -->
    <view class="contentBox" v-if="current == 6">
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
import uSwipeActionItem from '../../../uni_modules/uview-ui/components/u-swipe-action-item/u-swipe-action-item.vue'
import {
  getOrderList,
  deleteOrder,
  orderDetail,
  purchaseAgain,
  orderAddresse,
} from '@/api/system/order.js'
import { getReceipt } from '@/api/system/newAddress.js'
import selectAddress from './selectAddress.vue'
import pop from './pop'
export default {
  components: { uSwipeActionItem, pop, selectAddress },
  data() {
    return {
      // 搜索框
      // keyword: '',
      // 数据源
      productsList: [],
      //菜单信息
      //下拉框数据源
      params: {
        pageNum: 1,
        pageSize: 10,
        orderStatus: '',
        keyword: null,
      },
      total: null, //总条数
      id: null,
      sort: null,
      current: 0,
      list: [
        {
          name: '全部',
        },
        {
          name: '待付款',
        },
        {
          name: '待发货',
        },
        {
          name: '待收货',
        },
        {
          name: '已完成',
        },
        {
          name: '已关闭',
        },
        // {
        //   name: '待评价',
        // },
      ],
      // 更多下拉框选项
      value1: 1,
      value2: 2,
      options: [
        {
          label: '默认排序',
          value: 1,
        },
        {
          label: '距离优先',
          value: 2,
        },
        {
          label: '价格优先',
          value: 3,
        },
      ],
      replist: [], //收货列表
      orderList: [], //数据源
      allFlag: false,
      waiting_payFlag: false,
      waiting_deliveryFlag: false,
      deliveredFlag: false,
      completedFlag: false,
      closedFlag: false,
      //修改地址返回的参数
      deliveryAddressId: null,
      deliveryAddress: {},
      itemId: null, //点击修改地址后对应的id
    }
  },
  //页面初始化
  onLoad(event) {
    if (event.type) {
      let obj = {
        waiting_pay: 1,
        waiting_delivery: 2,
        delivered: 3,
        completed: 4,
      }
      this.current = obj[event.type]
      this.getOrderList(event.type)
    } else {
      this.getOrderList()
    }
    this.getReceipt()
  },
  methods: {
    // 处理单品信息数据
    setRule(item) {
      let arr = JSON.parse(item)
      let str = ''
      arr.forEach((element) => {
        str += element.key + '【' + element.value + '】'
      })
      return str
    },
    scrolltolower(index) {
      // console.log(index);
      // 通过总条数算出总页数
      let pageNums = Math.ceil(this.total / this.params.pageSize)
      if (this.params.pageNum < pageNums) {
        this.params.pageNum = this.params.pageNum + 1
        // 分页这里也需要进行判断给参数值
        switch (index) {
          case undefined: //全部
            this.getOrderList()
            break
          case 1:
            this.getOrderList('waiting_pay')
            break
          case 2:
            this.getOrderList('waiting_delivery')
            break
          case 3:
            this.getOrderList('delivered')
            break
          case 4:
            this.getOrderList('completed')
            break
          case 5:
            this.getOrderList('closed')
            break
          // case '5':
          //   this.getOrderList(null)
          //   break
        }
      }
    },
    search() {
      // 这里应该加一个防抖
      this.params.pageNum = 1 //在搜索时候 应为第一页
      this.getOrderList()
    },
    rightClick() {
      this.$tab.navigateBack()
    },
    // 单选 地址
    radioChange(e, item) {
      this.deliveryAddressId = e
      this.deliveryAddress = item
    },
    // 修改地址
    orderAddresse() {
      let params = {
        orderId: this.itemId,
        receiverName: this.deliveryAddress.receiverName,
        receiverPhone: this.deliveryAddress.receiverPhone,
        province: this.deliveryAddress.provinceLabel,
        city: this.deliveryAddress.cityLabel,
        region: this.deliveryAddress.regionLabel,
        address: this.deliveryAddress.address,
      }
      orderAddresse(params).then((res) => {
        console.log(res)
      })
    },
    // 点击修改地址弹框的确定按钮 发起修改地址接口
    changeAddress(istrue) {
      this.$refs.pop.show = istrue
      this.orderAddresse()
    },
    // 点击筛选按钮
    filterBtn() {},
    // 点击顶部tab
    change(params) {
      this.current = params.index
      this.params.pageNum = 1 //点击tab其他页面重置为1页码
      switch (params.index) {
        case 0:
          this.getOrderList()
          break
        case 1:
          this.getOrderList('waiting_pay')
          break
        case 2:
          this.getOrderList('waiting_delivery')
          break
        case 3:
          this.getOrderList('delivered')
          break
        case 4:
          this.getOrderList('completed')
          break
        case 5:
          this.getOrderList('closed')
          break
      }
    },
    //接口请求函数封装
    getOrderList(status) {
      this.params.orderStatus = status || null
      getOrderList(this.params).then((res) => {
        if (res.code == 200) {
          if (res.data && res.data.records) {
            this.orderList =
              this.params.pageNum === 1
                ? res.data.records
                : this.orderList.concat(res.data.records)
            this.total = res.data.total
            if (this.orderList.length > 0) {
              this.allFlag = true //控制全部的状态
            } else {
              this.allFlag = false //控制全部的状态
            }
          }
        }
        console.log(this.orderList)
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
    // 删除订单按钮
    deleteOrder(id) {
      let self = this
      return new Promise((resolve, reject) => {
        uni.showModal({
          title: '',
          content: '是否确认取消订单',
          cancelText: '取消',
          confirmText: '确定',
          success: function (res) {
            if (res.confirm) {
              deleteOrder(id).then((res) => {
                if (res.code == 200) {
                  self.params.pageNum = 1 //在删除后调用函数更新页面 应为第一页
                  self.getOrderList()
                }
              })
            }
          },
        })
      })
    },
    // 订单状态管理  判断是否为空
    switchFunction(status) {
      switch (status) {
        case 'waiting_pay':
          this.waiting_payFlag = true
          return '待付款'
        case 'waiting_delivery':
          this.waiting_deliveryFlag = true
          return '待发货'
        case 'delivered':
          this.deliveredFlag = true
          return '已发货'
        case 'completed':
          this.completedFlag = true
          return '已完成'
        case 'closed':
          this.closedFlag = true
          return '已关闭'
        // default:
        //   // 如果前面的都不满足就执行default里面的内容
        //   // default是可选的
        //   return("")
        //   break
      }
    },
    // 点击店铺跳转
    searchActiveshop(item) {
      this.$tab.navigateTo(
        `/pages/common/storeDetails/index?exStoreId=${item.storeId}`
      )
    },
    // 点击具体商品进行跳转
    // searchActive(item) {
    //   uni.navigateTo({
    //     url: '/pages/productList/detail?id=' + item.productId,
    //   })
    // },
    // 点击全部 里面的具体店铺选择性跳转到三个页面
    witingPayFunction(item) {
      switch (item.orderStatus) {
        case 'waiting_pay':
          uni.navigateTo({
            url: `/pages/mine/order/waitPayment?id=${item.id}`,
          })
          break
        case 'waiting_delivery':
          break
        case 'delivered':
          break
        case 'closed':
          uni.navigateTo({
            url: `/pages/mine/order/transactionClosed?id=${item.id}`,
          })
          break
        case 'completed':
          uni.navigateTo({
            url: `/pages/mine/order/transactionCompleted?id=${item.id}`,
          })
          break
        default:
          break
      }
    },
    modifyAddress(id) {
      this.itemId = id
      this.$refs.pop.show = true
    },
    //申请售后跳转
    afterSales() {
      uni.navigateTo({
        url: `/pages/mine/order/afterSales`,
      })
    },
    // 再买一单 接口函数
    purchaseAgainFun(item) {
      uni.navigateTo({
        url: `/pages/productList/creadOrder?id=${item.id}`,
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

.proList {
  background-color: #f8f9fb;
  // height: 100vh;
  position: relative;
  display: flex;

  .searchBox {
    width: 100%;
    padding: 54px 12px 8px;
    display: flex;
    flex-direction: column;
    align-items: center;
    position: fixed;
    z-index: 1;
    background-color: #f8f9fb;

    .topBox {
      display: flex;
      width: 100%;
      align-items: center;

      .search-content {
        padding: 0 12px;
        width: 75%;
        margin-left: 10px;
        margin-right: 10px;
        height: 34px;
        border-radius: 17px;
        display: flex;
        align-items: center;
        box-sizing: border-box;
        background: #ffffff;

        .filterBox {
          .filter {
            font-size: 13px;
            font-family: PingFangSC, PingFang SC;
            font-weight: 400;
            color: #767676;
            line-height: 18px;
          }
        }
      }
    }
  }

  .contentBox {
    position: absolute;
    top: 140px;
    width: 100%;

    .emptyBox {
      position: absolute;
      top: 100px;
      left: 100px;
      margin-right: 200px;
    }

    .orderListBox {
      background: #ffffff;
      margin-top: 10px;
      border-radius: 8px;
      display: flex;
      flex-direction: column;
      padding: 15px;
      margin: 0 14px 10px;

      .one {
        display: flex;
        align-items: center;
        justify-content: space-between;

        .one-box {
          display: flex;
          align-items: center;
        }

        .one-name {
          font-size: 16px;
          font-family: PingFangSC, PingFang SC;
          font-weight: 500;
          color: #363636;
          line-height: 16px;
        }

        .one-status {
          font-size: 16px;
          font-family: PingFangSC, PingFang SC;
          font-weight: 500;
          color: #de3c31;
          line-height: 16px;
        }
      }

      .two {
        margin-top: 12px;
        display: flex;

        .reight {
          display: flex;
          flex-direction: column;
          margin-left: 8px;

          .top {
            display: flex;
            justify-content: space-between;
            margin-top: 8px;

            .text {
              font-size: 14px;
              font-family: PingFangSC, PingFang SC;
              font-weight: 400;
              color: #363636;
              line-height: 14px;
            }

            .price {
              font-size: 10px;
              font-family: PingFangSC, PingFang SC;
              font-weight: 400;
              color: #363636;
              line-height: 14px;
              margin-left: 15px;
            }
          }

          .bottom {
            display: flex;
            justify-content: space-between;
            margin-top: 8px;
            line-height: 24px;
            font-weight: 400;
            font-size: 14px;
            color: #767676;
          }
        }
      }

      .three {
        display: flex;
        justify-content: end;
        margin-top: 8px;
        font-size: 14px;
        font-family: PingFangSC, PingFang SC;
        font-weight: 400;
        color: #de3c31;
        line-height: 14px;
      }

      .four {
        margin-top: 10px;
        font-size: 15px;
        font-family: PingFangSC, PingFang SC;
        font-weight: 500;
        color: #363636;
        line-height: 18px;
        text-align: right;
      }

      .five {
        margin-top: 16px;
        display: flex;
        justify-content: space-between;
        align-items: center;

        .more {
          font-size: 14px;
          font-family: PingFangSC, PingFang SC;
          font-weight: 400;
          color: #767676;
          line-height: 20px;
        }

        .button {
          span {
            width: 86px;
            height: 34px;
            display: inline-block;
            border-radius: 17px;
            border: 1px solid #b7b7b7;
            text-align: center;
            font-size: 14px;
            font-family: PingFangSC, PingFang SC;
            font-weight: 400;
            color: #767676;
            line-height: 32px;
            margin-left: 10px;
          }
        }
      }
    }
  }

  // 穿透搜索框的placeholder样式（未生效）
  ::v-deep .uni-input-input {
    font-family: PingFangSC, PingFang SC;
    font-weight: 400;
    font-size: 14px;
    color: #767676;
    line-height: 20px;
    // text-align: center;
    font-style: normal;
  }

  ::v-deep .type-list {
    position: fixed;
    top: 96px;
    height: 44px !important;
    z-index: 1;
    background-color: #fff;
  }

  ::v-deep .item-main {
    position: fixed;
    top: 140px;
  }
}
</style>