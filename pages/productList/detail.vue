<template>
  <u-transition :show="show" mode="slide-right">
    <view class="work-container">
      <scroll-view scroll-y @scrolltolower="scrolltolower" style="height: 100%;" refresher-enabled="true">
        <!-- 搜索框 -->
        <view class="search flex-spb align-c">
          <image class="imgse" :src="`${imgBasePath}/static/images/icons/icon-back-circle.png`" @click="rightClick" />
        </view>
        <view class="uni-swiper-pos">
          <uni-swiper-dot class="uni-swiper-dot-box" :info="params.carouselImages" :current="current" field="content" :dots-styles="dotsStyles">
            <swiper class="swiper-box" :current="swiperDotIndex" @change="changeSwiper" :autoplay="true">
              <swiper-item v-for="(item, index) in params.carouselImages" :key="index">
                <view class="swiper-item" @click="clickBannerItem(item)">
                  <image :src="item.fileUrl" mode="aspectFill" :draggable="false" />
                </view>
              </swiper-item>
            </swiper>
          </uni-swiper-dot>
        </view>
        <view class="content-box">
          <view class="bga">
            <view class="infotitle">{{params.description}}</view>
            <view class="infotig">{{params.productName}}</view>
            <view class="flex-spb  align-c">
              <view class="price"><span>￥</span>{{ params.price }} <span class="dec">￥{{params.originalPrice}}</span>
              </view>
              <view class="yshou">已售{{params.sale}}</view>
            </view>
            <view class="seeinfo flex align-c">
              <view class="text  flex align-c">
                <image class="imgse" :src="`${imgBasePath}/static/images/icons/icon-view.png`" />
                浏览量：{{params.visitCount}}
              </view>
              <view class="line"></view>
              <view class="text  flex align-c" style="padding-left:29px">
                <image class="imgse" :src="`${imgBasePath}/static/images/icons/icon-stock.png`" />库存：{{params.stock}}
              </view>
            </view>

            <view class="shopbox">
              <view class="shopbox-title">店铺信息</view>
              <view class="flex align-c" @click="openDetails(1)">
                <image class="imgse" :src="`${imgBasePath}/static/images/icons/icon-van.png`" />
                <view class="flex grow1 shop-item">
                  <view class="shopinfotitle">
                    {{params.deliveryVo?params.deliveryVo.deliveryFrom:''}}
                  </view>
                  <view class="shopinfotig">
                    免运费
                  </view>
                  <image class="imgse" :src="`${imgBasePath}/static/images/icons/icon-arrow-right.png`" />
                </view>
              </view>
              <view class="flex align-c" @click="openDetails(2)">
                <image class="imgse" :src="`${imgBasePath}/static/images/icons/icon-goods.png`" />
                <view class="flex grow1 shop-item">
                  <view class="shopinfotitle">
                    商品参数
                  </view>
                  <image class="imgse" :src="`${imgBasePath}/static/images/icons/icon-arrow-right.png`" />
                </view>
              </view>
              <view class="flex align-c" @click="openDetails(3)">
                <image class="imgse" :src="`${imgBasePath}/static/images/icons/icon-service.png`" />
                <view class="flex grow1 shop-item" style="border:none">
                  <view class="shopinfotitle">
                    服务
                  </view>
                  <view class="shopinfotig">
                    无忧退货・快速退款
                  </view>
                  <image class="imgse" :src="`${imgBasePath}/static/images/icons/icon-arrow-right.png`" />
                </view>
              </view>
            </view>
            <!-- 评价 -->
            <view class="evaluate">
              <view class="title flex-spb align-c">评价（200+）
                <image class="imgse" :src="`${imgBasePath}/static/images/icons/icon-arrow-right.png`" />
              </view>
              <view class="evaluate-item flex">
                <image class="header" :src="`${imgBasePath}/static/images/icons/icon-service.png`" />
                <view class="item-box">
                  <view class="flex ellipsis">
                    <view class="nice">一个可爱</view>
                    <view class="nice ellipsis">一个可爱的昵称口味:礼盒装（750g*2罐+赠口味50g*2罐+赠口味</view>
                  </view>
                  <view class="dec ellipsis2">持后积高并亲下知当也目成式象写类同展过之的明状始十相正更张能八活口身究下求采片类式必准…</view>
                </view>
              </view>
              <view class="evaluate-item flex">
                <image class="header" :src="`${imgBasePath}/static/images/icons/icon-service.png`" />
                <view class="item-box">
                  <view class="flex ellipsis">
                    <view class="nice">一个可爱的昵称</view>
                    <view class="nice ellipsis">口味:礼盒装（750g*2罐+赠口味50g*2罐+赠口味</view>
                  </view>
                  <view class="dec ellipsis2">已经第二次回购了，一如既往的好~</view>
                </view>
              </view>
            </view>
            <!-- 问一问 -->
            <view class="evaluate wenyiwen" @click="askBtn">
              <view class="title flex-spb align-c">问一问（{{aksTotal}}）
                <image class="imgse" :src="`${imgBasePath}/static/images/icons/icon-arrow-right.png`" />
              </view>
              <view class="flex-spb align-c" v-if="aksTotal==0" style="font-size: 13px;">暂无回答
              </view>
              <view class="evaluate-item flex align-c" v-else v-for="(item,index) in askRecords" :key="index">
                <image class="header" :src="`${imgBasePath}/static/images/icons/icon-question.png`" />
                <view class="dec" style="margin:0">{{item.questionContent }}</view>
                <view class="nice">{{item.replyNumber }}个回答</view>
              </view>

            </view>
            <!-- 分割线 -->
            <view class="stip"></view>
            <!-- 店铺 -->
            <view class="shopstore">
              <!-- 店铺信息 -->
              <view class="flex-spb align-c">
                <view class="flex" @click="seeShopDetails(params)">
                  <image class="shopheader defaimg" :src="params.storeInfoVo?params.storeInfoVo.logo:null" />
                  <view class="flex-spa flex-col">
                    <view class="shopname">{{params.storeName}}</view>
                    <view class="flex align-c">
                      <view class="shoptig">标签</view>
                      <view class="shopnum">{{params.storeInfoVo?params.storeInfoVo.fansCount:'0'}}万粉丝</view>
                      <view class="shopnum">{{params.storeInfoVo?params.storeInfoVo.repeatCustomerCount:'0'}}万回头客</view>
                    </view>
                  </view>
                </view>
                <view class="shopygz" @click="storeAttention" v-if="params.storeAttention&&params.storeAttention.attend==1">已关注</view>
                <view class="shopgz" @click="storeAttention" v-else>关注</view>
              </view>
              <!-- 店铺推荐 -->
              <view class="shopname tjtitle">店铺推荐</view>
              <view v-for="(item,index) in params.storeRecommend" :key="index" class="tjbox" @click="seeDetails(item)">
                <image class="defaimg tjheader" :src="item.pic" />
                <view class="tjtit ellipsis">{{item.productName}}</view>
                <view class="tjprice"><span>￥</span>{{item.price}}</view>
              </view>
            </view>
            <!-- 分割线 -->
            <view class="stip"></view>
            <view class="goodinfo">
              <view class="tigimg flex-spc align-c">
                <image class="img" :src="`${imgBasePath}/static/images/icons/divider-left-red.png`" />
                <span>商品详情</span>
                <image class="img" :src="`${imgBasePath}/static/images/icons/divider-right-red.png`" />
              </view>
              <rich-text class="rich-textcontent" :nodes="params.detailHtml"></rich-text>
            </view>
          </view>
          <!-- 底部推荐商品 -->
          <view class="foolbox" v-if="productsList.length>0">
            <view class="tigimg flex-spc align-c">
              <image class="img" :src="`${imgBasePath}/static/images/icons/divider-left-red.png`" />
              <span>看了又看</span>
              <image class="img" :src="`${imgBasePath}/static/images/icons/divider-right-red.png`" />
            </view>
            <view v-for="(item,index) in productsList" :key="index" class="tjbox" @click="seeDetails(item)">
              <image class="tjheader defaimg" :src="item.pic" />
              <view class="tjtit">{{item.productName}}</view>
              <view class="tjprice flex-spb align-c">
                <view class="flex"><span>￥</span>{{item.price}}</view>
                <p>{{item.sale}}人已付款</p>
              </view>
              <view class="dec">￥{{item.originalPrice}}</view>
            </view>
          </view>
        </view>
      </scroll-view>
      <view class="but-bottom flex-spb">
        <p class="flex-col" @click="storeDetails">
          <image class="img" :src="`${imgBasePath}/static/images/icons/icon-shop.png`" />店铺
        </p>
        <p class="flex-col" @click="storeCollection">
          <image v-if="params.productCollection&&params.productCollection.collected === 1" class="img" :src="`${imgBasePath}/static/images/icons/icon-star-fill.png`" />
          <image v-else class="img" :src="`${imgBasePath}/static/images/icons/icon-star.png`" />
          收藏
        </p>
        <p class="flex-col" @click="gotoCart()">
          <image class="img" :src="`${imgBasePath}/static/images/icons/icon-cart.png`" />购物车
        </p>
        <view class="catBox flex">
          <view class="add" @click="openSkuPopup(2)">加入购物车</view>
          <view class="goto" @click="openSkuPopup(3)">立即购买</view>
        </view>
      </view>
      <vk-data-goods-sku-popup ref="skuPopup" v-model="skuKey" border-radius="20" :localdata="goodsInfo" :mode="skuMode" :amountType="0" @open="onOpenSkuPopup" @close="onCloseSkuPopup" @add-cart="addCart" @buy-now="buyNow">
        <view slot="selAddress" @click="openDetails(4)" v-if="skuMode===3">
          <view class="addressBox flex align-c" v-if="params.deliveryVo&& params.deliveryVo.deliveryTo!=null">
            <image class="img" :src="`${imgBasePath}/static/images/icons/icon-location-circle.png`" />
            <view class="ellipsis">{{params.deliveryVo.deliveryTo.receiverName}}
              {{`${params.deliveryVo.deliveryTo.provinceLabel}${params.deliveryVo.deliveryTo.cityLabel}${params.deliveryVo.deliveryTo.address}`}}
            </view>
            <image class="rimg" :src="`${imgBasePath}/static/images/icons/icon-arrow-right.png`" />
          </view>
          <view class="addressBox flex align-c" v-else>
            无地址
          </view>
        </view>
      </vk-data-goods-sku-popup>

      <!-- 弹框 -->
      <pop :title="title" ref="pop">
        <!-- 物流 -->
        <view slot="content" v-if="poptype === 1">
          <view class="wuliu">
            <view class="wl-top">
              <view class="wltopitem flex">
                <image class="iconimg" :src="`${imgBasePath}/static/images/icons/icon-origin-red.png`" />
                <view @click="delivery">发货地</view>
                <span>{{params.deliveryVo.deliveryFrom}}</span>
              </view>
              <view class="flex" v-if="params.deliveryVo.deliveryTo">
                <image class="iconimg" :src="`${imgBasePath}/static/images/icons/icon-location-red.png`" />
                <view @click="receipt">收货地</view>
                <span>{{`${params.deliveryVo.deliveryTo.provinceLabel}${params.deliveryVo.deliveryTo.cityLabel}`}}</span>
              </view>
              <view class="address" v-if="params.deliveryVo.deliveryTo">
                <view>{{params.deliveryVo.deliveryTo.receiverName}} {{params.deliveryVo.deliveryTo.receiverPhone}}
                </view>
                {{`${params.deliveryVo.deliveryTo.provinceLabel} ${params.deliveryVo.deliveryTo.cityLabel}
                  ${params.deliveryVo.deliveryTo.regionLabel} ${params.deliveryVo.deliveryTo.address}`}}
                <view class="tigs">快递费：免费</view>
              </view>
            </view>
            <view class="wl-bottomover">
              <!-- 地址列表弹框 -->
              <selectAddress :replist="replist" @radioChange="radioChange"></selectAddress>
            </view>
          </view>
        </view>
        <button v-if="poptype === 1||poptype === 4" slot="bottom" type="primary" class="combuts" @click="changeAddress()">
          确认
        </button>
        <!-- 商品参数 -->
        <template slot="content" v-if="poptype === 2">
          <view class="paramsinfo flex" v-for="(ittem,index) in params.productAttributeValueList" :key="index">
            <span class="flex1">{{ittem.productAttributeName}}</span>
            <view class="flex2">{{ittem.value}}</view>
          </view>
        </template>
        <!-- 保障 -->
        <view slot="content" v-if="poptype === 3">
          <view class="params3" v-for="(ittem,index) in popOptions3" :key="index">
            <view class="text">{{ittem.name}}
              <image class="img" :src="`${imgBasePath}/static/images/icons/divider-right-red.png`" />
            </view>
            <view>{{ittem.value}}</view>
          </view>
        </view>
        <view slot="content" v-if="poptype === 4">
          <view class="wuliu">
            <view class="wl-bottomover" style="height: 400px;">
              <!-- 地址列表弹框 -->
              <selectAddress :replist="replist" @radioChange="radioChange"></selectAddress>
            </view>
          </view>
        </view>
      </pop>
    </view>
  </u-transition>

</template>

<script>
import {
  getproductdetail,
  getProductsList,
  collectionsave,
  attentionsave,
  basketsave,
} from '@/api/system/productsList.js'
import { getReceipt } from '@/api/system/newAddress.js'
import { askQuery } from '@/api/system/question.js'
import pop from './pop'
import selectAddress from './selectAddress.vue'

export default {
  components: { pop, selectAddress },
  data() {
    return {
      // 窗口高度
      wh: 0,
      ww: 0,
      show: true,
      background: 'rgba(255,255,255,1)',
      leftIconColor: '#fff',
      current: 0,
      swiperDotIndex: 0,
      searchValue: '', //搜索内容
      data: [],
      dotsStyles: {
        bottom: 35, //轮播点位置
      },
      tabsCurrent: 0,
      params: {},
      id: null,
      title: '商品参数',
      poptype: null,
      popOptions3: [
        {
          name: '退换无忧',
          value:
            '由象月采老即满传器法海更西立多布满小线叫产育论知看争么集历产只查员数存大矿阶才解气因文务六金列么象标去',
        },
        {
          name: '物流信息',
          value:
            '据开交重他引度接速住今高表实速放今几合例号些回部地用次么毛光听最持特例技马叫打格白较商造速处持平决成青。太个到上史历制海况后史电难说决比今员门比命此确海间',
        },
      ],
      myaddress: [
        {
          name: '退换无忧',
          value: 1,
        },
        {
          name: '退换无忧',
          value: 2,
        },
        {
          name: '退换无忧',
          value: 3,
        },
      ],
      value: null,
      productsList: [],
      formData: {
        pageNum: 1,
        pageSize: 6,
        productCategoryId: null,
        exStoreId: null,
      },
      total: 0,
      // 是否打开SKU弹窗
      skuKey: false,
      // SKU弹窗模式
      skuMode: 3,
      // 后端返回的商品信息
      goodsInfo: {},
      askRecords: null, //问一问信息
      aksTotal: 0, //问一问总条数
      replist: [], //收货列表
      carParams: {
        productId: null,
        productSkuId: null,
        quantity: null,
        deliveryAddressId: null,
      }, //购物车参数
    }
  },
  onLoad(event) {
    if (event.id) {
      this.id = event.id
      this.getInfo()
      this.getReceipt()
      this.askQuery()
    }
  },
  methods: {
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
      this.params.deliveryVo.deliveryTo = { ...item }
    },
    changeAddress() {
      this.$refs.pop.show = false
    },
    gotoCart() {
      this.$tab.switchTab(`/pages/addcart/index`)
    },
    // 获取商品信息，并打开sku弹出
    openSkuPopup(skuMode) {
      let that = this
      /**
       * 获取商品信息
       * 这里可以看到每次打开SKU都会去重新请求商品信息,为的是每次打开SKU组件可以实时看到剩余库存
       */
      // 此处写接口请求，并将返回的数据进行处理成goodsInfo的数据格式，
      // goodsInfo是后端返回的数据
      let infoitem = this.params.skuStockList.map((r) => {
        console.log(r.price)
        return {
          _id: r.id,
          goods_id: r.productId,
          goods_name: this.params.productName,
          image: r.pic,
          price: r.price,
          sku_name_arr: JSON.parse(r.spData).map((r) => r.value),
          stock: Number(r.stock),
        }
      })
      that.goodsInfo = {
        _id: this.params.id,
        name: this.params.productName,
        goods_thumb: this.params.pic,
        sku_list: [...infoitem],
        spec_list: [...this.params.productAttribute],
      }
      that.skuMode = skuMode
      that.skuKey = true
      console.log(that.goodsInfo)
    }, // sku组件 开始-----------------------------------------------------------
    onOpenSkuPopup() {
      console.log('监听 - 打开sku组件')
    },
    onCloseSkuPopup() {
      console.log('监听 - 关闭sku组件')
    }, // 加入购物车前的判断
    addCartFn(obj) {
      let { selectShop } = obj
      // 模拟添加到购物车,请替换成你自己的添加到购物车逻辑
      let cartInfo = {
        storeId: this.params.storeId,
        storeName: this.params.storeName,
        productId: selectShop.goods_id,
        productSkuId: selectShop._id,
        quantity: selectShop.buy_num,
      }
      basketsave(cartInfo).then((res) => {
        obj.success(res)
      })
    },
    // 加入购物车按钮
    addCart(selectShop) {
      let that = this
      that.addCartFn({
        selectShop: selectShop,
        success: function (res) {
          // 实际业务时,请替换自己的加入购物车逻辑
          that.toast('添加成功')
          setTimeout(function () {
            that.skuKey = false
            that.$tab.switchTab(`/pages/addcart/index`)
          }, 300)
        },
      })
    },
    // 立即购买
    buyNow(selectShop) {
      let that = this
      that.carParams.productId = selectShop.goods_id
      that.carParams.quantity = selectShop.buy_num
      that.carParams.productSkuId = selectShop._id
      that.skuKey = false
      that.$tab.navigateTo(
        `/pages/productList/creadOrder?carParams=${JSON.stringify(
          that.carParams
        )}`
      )
    },
    toast(msg) {
      uni.showToast({
        title: msg,
        icon: 'none',
      })
    },
    scrolltolower() {
      // 通过总条数算出总页数
      let pageNums = Math.ceil(this.total / this.formData.pageSize)
      if (this.formData.pageNum < pageNums) {
        this.formData.pageNum = this.formData.pageNum + 1
        this.getProductsList()
      }
    },
    // 获取商品详情
    seeDetails(item) {
      this.$tab.navigateTo(`/pages/productList/detail?id=${item.id}`)
    },
    seeShopDetails(item) {
      this.$tab.navigateTo(
        `/pages/common/storeDetails/index?exStoreId=${item.storeId}`
      )
    },
    // 返回按钮
    rightClick() {
      this.$tab.navigateBack()
    },
    openDetails(type) {
      this.$refs.pop.show = true
      this.poptype = type
      if (type == 1) {
        this.title = '物流'
      } else if (type == 2) {
        this.title = '商品参数'
      } else if (type == 3) {
        this.title = '保障'
      } else if (type == 4) {
        this.title = '选择地址'
      }
    },
    //获取资讯信息
    getInfo() {
      getproductdetail(this.id)
        .then((res) => {
          res.data.detailHtml = res.data.detailHtml.replace(
            /\<img/gi,
            '<img style="max-width:100%;height:auto" '
          )
          this.params = res.data
          this.getProductsList()
        })
        .finally((r) => {
          this.loading = false
        })
    },
    getProductsList() {
      //   查询推荐商品
      this.formData.productCategoryId = this.params.productCategoryId
      this.formData.exStoreId = this.params.storeId
      getProductsList(this.formData).then((res) => {
        this.productsList =
          this.formData.pageNum === 1
            ? res.data.records
            : this.productsList.concat(res.data.records)
        this.total = res.data.total
      })
    },
    // 问一问信息查询
    askQuery() {
      let data = {
        productId: this.id,
      }
      askQuery(data).then((res) => {
        if (res.code == 200) {
          if (res.data && res.data.records) {
            this.askRecords = res.data.records.slice(0, 2)
            this.aksTotal = res.data.total || 0
          }
        }
      })
    },
    // 问一问跳转
    askBtn() {
      this.$tab.navigateTo(`/pages/common/ask/index?paramsId=${this.id}`)
    },
    // 发货地址跳转
    delivery() {
      this.$tab.navigateTo(`/pages/productList/newAddress`)
    },
    // 收货地址跳转
    receipt() {
      this.$tab.navigateTo(`/pages/productList/receipt`)
    },
    clickBannerItem(item) {
      console.info(item)
    },
    changeSwiper(e) {
      this.current = e.detail.current
    },
    search() {
      this.$tab.navigateTo(`/package/homes/pages/home/searchInfo/index`)
    },
    storeDetails() {
      this.$tab.navigateTo(
        `/pages/common/storeDetails/index?exStoreId=${this.formData.exStoreId}`
      )
    },
    // 店铺收藏
    storeCollection() {
      let datas = {}
      if (this.params.productCollection) {
        let datas = { ...this.params.productCollection }
        datas.collected = datas.collected === 1 ? 0 : 1
        collectionsave(datas).then((res) => {
          if (res.code == 200) {
            this.params.productCollection = { ...datas }
            this.$forceUpdate()
          }
        })
      } else {
        datas = {
          productId: this.params.id,
          productName: this.params.productName,
          subTitle: this.params.subTitle,
          storeId: this.params.storeId,
          productCategoryId: this.params.productCategoryId,
          pic: this.params.pic,
          price: this.params.price,
          collected: 1,
        }
        collectionsave(datas).then((res) => {
          if (res.code == 200) {
            this.params.productCollection = { ...datas }
            this.$forceUpdate()
          }
        })
      }
    },
    // 店铺关注
    storeAttention() {
      let datas = {}
      if (this.params.storeAttention) {
        let datas = { ...this.params.storeAttention }
        datas.attend = datas.attend === 1 ? 0 : 1
        attentionsave(datas).then((res) => {
          if (res.code == 200) {
            this.params.storeAttention = { ...datas }
            this.$forceUpdate()
          }
        })
      } else {
        datas = {
          storeId: this.params.storeId,
          storeName: this.params.storeName,
          storeLogo: this.params.storeInfoVo.logo,
          attend: 1,
        }
        attentionsave(datas).then((res) => {
          if (res.code == 200) {
            this.params.storeAttention = { ...datas }
            this.$forceUpdate()
          }
        })
      }
    },
  },
}
</script>

<style  scoped lang="scss">
.work-container {
  position: relative;
  height: 100vh;
  font-family: PingFangSC, PingFang SC;
  .search {
    width: 100%;
    padding: 54px 12px 8px;
    display: flex;
    align-items: center;
    position: fixed;
    z-index: 1;
    background-color: transparent;
    .imgse {
      width: 30px;
      height: 30px;
      opacity: 0.82;
    }
  }
  .title {
    height: 48rpx;
    font-size: 34rpx;
    font-weight: 500;
    color: #ffffff;
    line-height: 48rpx;
    color: #ffffff;
    .imgse {
      width: 14px;
      height: 14px;
    }
  }
  .nav-top {
    width: 100%;
    height: 260rpx;
    position: fixed;
    top: 0;
    // background-image: linear-gradient(to right, #3dba92, #3dba92);
    z-index: 2;
  }

  .uni-swiper__warp {
    width: 100%;
    z-index: 0;
  }

  .swiper-box {
    height: 390px;
  }

  .swiper-item {
    /* #ifndef APP-NVUE */
    display: flex;
    /* #endif */
    flex-direction: column;
    justify-content: center;
    align-items: center;
    color: #fff;
    height: 390px;
    line-height: 390px;
  }
  .uni-swiper-pos {
    position: relative;
    .bgf2 {
      position: absolute;
      width: 100%;
      left: 0;
      right: 0;
      top: 552rpx;
      height: 60rpx;
      // z-index: 9;
    }
    .u-nav-slot {
      position: absolute;
      left: 0;
      right: 0;
      top: 100rpx;
      padding: 0 30rpx;
      color: #fff;
      .left-nav {
        position: absolute;
        left: 30rpx;
        bottom: 5rpx;
      }

      .text {
        line-height: 40rpx;
        font-size: 26rpx;
      }
    }
  }

  @media screen and (min-width: 1000rpx) {
    .uni-swiper-dot-box {
      position: sticky;
      top: -150rpx;
      width: 100%;
      /* #ifndef APP-NVUE */
      margin: 0 auto;
      /* #endif */
      margin-top: 16rpx;
    }
  }

  .content-box {
    position: absolute;
    left: 0;
    right: 0;
    top: 372px;
    background: #f4f5f9;
    border-radius: 18px 18px 0px 0px;
    padding-bottom: 92px;
    .bga {
      background: #ffffff;
      padding: 16px 14px;
      border-radius: 18px 18px 0px 0px;
    }
    .infotitle {
      font-size: 18px;
      font-weight: 500;
      color: #363636;
      line-height: 25px;
    }
    .infotig {
      padding: 10px 0;
      font-size: 14px;
      font-weight: 400;
      color: #cd9063;
      line-height: 14px;
    }
    .price {
      font-size: 26px;
      font-weight: 500;
      color: #de3c31;
      line-height: 26px;
      span {
        font-size: 14px;
      }
      .dec {
        margin-left: 6px;
        text-decoration: line-through;
        font-size: 12px;
        font-family: PingFangSC, PingFang SC;
        font-weight: 400;
        color: #b7b7b7;
        line-height: 15px;
      }
    }
    .yshou {
      font-size: 14px;
      font-weight: 400;
      color: #767676;
      line-height: 14px;
    }
    .seeinfo {
      margin-top: 12px;
      height: 40px;
      padding: 10px 13px;
      background: #fafbfd;
      border-radius: 4px;
      box-sizing: border-box;
      .line {
        width: 1px;
        height: 20px;
        background: #e5e5e5;
        box-sizing: border-box;
      }
      .text {
        padding-right: 30px;
        font-size: 14px;
        font-family: PingFangSC, PingFang SC;
        font-weight: 400;
        color: #767676;
        line-height: 14px;
        .imgse {
          width: 14px;
          height: 14px;
          margin-right: 8px;
        }
      }
    }
    .shopbox {
      padding-top: 18px;
      .shop-item {
        position: relative;
        height: 48px;
        line-height: 48px;
        border-bottom: 1px solid #e8e8e8;
        .imgse {
          width: 14px;
          height: 14px;
          position: absolute;
          right: 0;
          top: 17px;
          margin-right: 0;
        }
      }
      .shopbox-title {
        margin-bottom: 6px;
        font-size: 16px;
        font-weight: 500;
        color: #363636;
        line-height: 16px;
      }
      .shopinfotitle {
        min-width: 70px;
        padding-right: 12px;
        font-size: 14px;
        font-weight: 400;
        color: #363636;
      }
      .shopinfotig {
        font-size: 14px;
        font-weight: 400;
        color: #767676;
      }
      .imgse {
        width: 24px;
        height: 24px;
        margin-right: 6px;
      }
    }
    .evaluate {
      margin-top: 10px;
      padding: 18px 10px 14px;
      background: #fafbfd;
      border-radius: 4px;
      .title {
        padding-bottom: 18px;
        font-size: 16px;
        font-family: PingFangSC, PingFang SC;
        font-weight: 500;
        color: #363636;
        line-height: 16px;
      }
      .evaluate-item {
        font-size: 14px;
        font-family: PingFangSC, PingFang SC;
        font-weight: 400;
        line-height: 20px;
        .header {
          width: 26px;
          height: 26px;
          flex: 0 0 26px;
          margin-right: 8px;
          border-radius: 50%;
        }
        .item-box {
          margin-bottom: 12px;
          padding-bottom: 12px;
          width: calc(100% - 34px);
          border-bottom: 1px solid #e8e8e8;
        }
        .nice {
          color: #767676;
          padding-right: 12px;
        }
        .dec {
          color: #363636;
          margin-top: 8px;
        }
      }
    }
    .evaluate .evaluate-item:last-child :nth-child(2) {
      border-bottom: none;
      margin-bottom: 0;
      padding-bottom: 0;
    }
    .wenyiwen .evaluate-item {
      padding-bottom: 10px;
    }
    .wenyiwen .dec {
      margin: 0;
      padding-right: 12px;
    }
    .wenyiwen .evaluate-item:last-child {
      padding-bottom: 0;
    }
  }
  .stip {
    width: calc(100% + 28px);
    margin: 16px 0 16px -14px;
    height: 10px;
    background: #f4f5f9;
  }
  .shopstore {
    .shopheader {
      width: 44px;
      height: 44px;
      margin-right: 8px;
      border-radius: 6px;
      border: 1px solid #f0f0f0;
    }
    .shopname {
      font-size: 16px;
      font-family: PingFangSC, PingFang SC;
      font-weight: 500;
      color: #363636;
      line-height: 16px;
    }
    .shoptig {
      padding: 0 8px;
      height: 18px;
      border-radius: 4px;
      border: 1px solid #de3c31;
      font-size: 12px;
      font-family: PingFangSC, PingFang SC;
      font-weight: 400;
      color: #de3c31;
      line-height: 16px;
    }
    .shopnum {
      padding-left: 8px;
      font-size: 14px;
      font-family: PingFangSC, PingFang SC;
      font-weight: 400;
      color: #767676;
      line-height: 14px;
    }
    .shopgz {
      height: 28px;
      padding: 0 16px;
      background: #de3c31;
      border-radius: 14px;
      font-size: 14px;
      font-family: PingFangSC, PingFang SC;
      font-weight: 500;
      color: #ffffff;
      line-height: 28px;
    }
    .shopygz {
      height: 28px;
      padding: 0 16px;
      background: #ffffff;
      border-radius: 14px;
      font-size: 14px;
      font-family: PingFangSC, PingFang SC;
      font-weight: 500;
      color: #de3c31;
      border: 1px solid #de3c31;
      line-height: 26px;
    }
    .tjtitle {
      padding: 18px 0;
    }
    .tjbox {
      display: inline-block;
      width: 33.33%;
      padding: 0 5px;
      .tjheader {
        width: 100%;
        height: calc(33.33vw - 10px);
        border-radius: 8px;
      }
      .tjtit {
        padding: 4px;
        font-size: 14px;
        font-family: PingFangSC, PingFang SC;
        font-weight: 500;
        color: #363636;
        line-height: 20px;
      }
      .tjprice {
        padding-left: 4px;
        font-size: 18px;
        font-weight: 400;
        color: #de3c31;
        line-height: 26px;
        span {
          font-size: 14px;
        }
      }
    }
  }
  .goodinfo {
    .rich-textcontent div,
    .rich-textcontent img,
    .rich-textcontent p {
      width: 100%;
    }
  }
  .tigimg {
    margin-bottom: 18px;
    .img {
      width: 118px;
      height: 9px;
    }
    span {
      display: inline-block;
      padding: 0 12px;
      font-size: 15px;
      font-family: PingFangSC, PingFang SC;
      font-weight: 400;
      color: #363636;
      line-height: 15px;
    }
  }
  .wuliu {
    .wl-top {
      padding: 16px 14px;
      background: #fafbfd;
      border-radius: 4px;
      font-size: 15px;
      font-family: PingFangSC, PingFang SC;
      font-weight: 500;
      color: #363636;
      line-height: 20px;
      .wltopitem {
        position: relative;
        padding-bottom: 30px;
        ::after {
          content: '';
          position: absolute;
          top: 24px;
          left: 9px;
          width: 1px;
          height: 22px;
          border-left: 1px dotted #e8e8e8;
        }
      }
      .iconimg {
        width: 20px;
        height: 20px;
        margin-right: 12px;
      }
      span {
        font-weight: 400;
        color: #363636;
        padding-left: 16px;
      }
      .address {
        padding: 4px 0px 4px 32px;
        font-size: 13px;
        font-weight: 400;
        color: #b7b7b7;
        .tigs {
          font-size: 15px;
          color: #cd9063;
        }
      }
    }
    .wl-bottomover {
      height: 200px;
      overflow: hidden;
    }
  }
  .paramsinfo {
    height: 48px;
    font-size: 15px;
    font-family: PingFangSC, PingFang SC;
    font-weight: 400;
    color: #767676;
    line-height: 48px;
    span {
      font-weight: 500;
      color: #363636;
    }
  }
  .params3 {
    font-size: 15px;
    font-family: PingFangSC, PingFang SC;
    font-weight: 400;
    color: #767676;
    line-height: 20px;
    .text {
      font-weight: 500;
      color: #363636;
      line-height: 15px;
      margin: 30px 0 12px;
      .img {
        margin-left: 8px;
        width: 106px;
        height: 9px;
      }
    }
  }
  .foolbox {
    padding: 18px 7px 0;
    .tjbox {
      display: inline-block;
      width: 50%;
      padding: 0 5px 16px;
      .tjheader {
        width: 100%;
        height: calc(50vw - 10px);
        border-radius: 8px;
      }
      .tjtit {
        padding: 4px;
        font-size: 15px;
        font-family: PingFangSC, PingFang SC;
        font-weight: 500;
        color: #363636;
        line-height: 20px;
      }
      .tjprice {
        padding-left: 4px;
        font-size: 14px;
        font-weight: 500;
        color: #de3c31;
        line-height: 26px;
        span {
          font-size: 10px;
        }
        p {
          font-size: 13px;
          font-family: PingFangSC, PingFang SC;
          font-weight: 400;
          color: #767676;
          line-height: 18px;
        }
      }
    }
    .dec {
      padding-left: 4px;
      text-decoration: line-through;
      font-size: 10px;
      font-family: PingFangSC, PingFang SC;
      font-weight: 400;
      color: #b7b7b7;
      line-height: 18px;
    }
  }
  .but-bottom {
    p {
      font-size: 12px;
      font-family: PingFangSC, PingFang SC;
      font-weight: 400;
      color: #767676;
      line-height: 12px;
      .img {
        width: 24px;
        height: 24px;
      }
    }
    .catBox {
      background: #de3c31;
      border-radius: 21px;
      border: 1px solid #de3c31;
      font-size: 14px;
      font-family: PingFangSC, PingFang SC;
      font-weight: 500;
      line-height: 40px;
      text-align: center;
      .add {
        width: 112px;
        height: 40px;
        background: #ffffff;
        border-radius: 20px 0px 20px 20px;
        color: #de3c31;
      }
      .goto {
        width: 112px;
        height: 40px;
        color: #ffffff;
      }
    }
  }
  .addressBox {
    position: relative;
    padding: 0 30px 0 10px;
    margin-bottom: 24px;
    font-size: 15px;
    font-family: PingFangSC, PingFang SC;
    font-weight: 400;
    color: #767676;
    line-height: 20px;
    height: 44px;
    background: #ffffff;
    border-radius: 4px;
    border: 1px solid #f0f0f0;
    .img {
      flex: 0 0 16px;
      height: 16px;
      margin-right: 8px;
    }
    .rimg {
      position: absolute;
      right: 10px;
      top: 13px;
      width: 14px;
      height: 14px;
      margin-left: 10px;
    }
    .ellipsis {
      display: inline-block;
    }
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
</style>
