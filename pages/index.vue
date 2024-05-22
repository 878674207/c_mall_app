<template>
  <view class="work-container">
    <scroll-view scroll-y @scrolltolower="scrolltolower" style="height: 100%;" :refresher-enabled="false">
      <view class="header-section">
        <uni-swiper-dot class="uni-swiper-dot-box" :info="data" :current="current" field="content" :dots-styles="dotsStyles">
          <swiper class="swiper-box" :current="swiperDotIndex" @change="changeSwiper" :autoplay="false">
            <swiper-item v-for="(item, index) in data" :key="index">
              <view class="swiper-item" @click="clickBannerItem(item)">
                <image :src="item.image" mode="aspectFill" :draggable="false" style="border-bottom-left-radius: 10px;border-bottom-right-radius: 50px;" />
              </view>
            </swiper-item>
          </swiper>
        </uni-swiper-dot>

        <view class="nav" @click="goSearch">
          <u-search :showAction="false" v-model="searchValue" searchIconSize="32rpx" bgColor="rgba(255,255,255,1)" radius="14" searchIconColor="#B7B7B7" placeholderColor="#B7B7B7">
          </u-search>
          <image @click.stop="clickNotice" :src="`${imgBasePath}/static/images/app/icon-bell.png`" class="images" />
        </view>
      </view>
      <view class="foolbox">
        <p class="tjtitle">热门推荐</p>
        <view v-for="(item,index) in productsList" :key="index" class="tjbox" @click="seeDetails(item)">
          <image class="tjheader defaimg" :src="item.pic" />
          <view class="tjtit ellipsis2">{{item.productName}}</view>
          <view class="tjprice flex">
            <span>￥</span>
            <p>{{item.price}}</p>
          </view>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script>
import { getProductsList, purchasehomepage } from '@/api/system/productsList.js'
export default {
  onLoad() {
    this.data = [
      {
        image: require('@/static/images/banner/img1.png'),
      },
      {
        image: require('@/static/images/banner/img2.png'),
      },
      {
        image: require('@/static/images/banner/img3.png'),
      }
    ]
    this.getProductsList()
  },
  onShow() {
    this.getpurchasehomepage()
  },
  data() {
    return {
      searchValue: null,
      current: 0,
      swiperDotIndex: 0,
      data: [],
      formData: {
        pageNum: 1,
        pageSize: 6,
        sort: 2,
      },
      productsList: [],
      purParams: null, // 采购单列表
      total: 0,
      dotsStyles: {
        bottom: 10,
        backgroundColor: 'rgba(255,255,255,0.6)',
        border: '1px rgba(255,255,255,0.6) solid',
        color: '#fff',
        selectedBackgroundColor: '#FFFFFF',
        selectedBorder: '1px rgba(83, 200, 249,0.9) solid',
      }
    }
  },
  methods: {
    // 返回3条
    getpurList(list) {
      return list.slice(0, 3)
    },
    // 去复购
    gotoProcure(path, type) {
      if (type == 'tab') {
        this.$tab.switchTab(path)
        return
      }
      this.$tab.navigateTo(path)
    },
    goSearch() {
      this.$tab.navigateTo(`/pages/classification/search?type=follow`)
    },
    handleCleanTmp(item) {
      if (item.name === '养老政策') {
        this.gotoProcure('/pages/common/news/index')
        return
      } else if (item.name === '入驻平台') {
        this.gotoProcure('/pages/nursingHome/index')
        return
      }
      this.$modal.showToast('模块建设中~')
    },
    // 获取商品详情
    seeDetails(item) {
      this.$tab.navigateTo(`/pages/productList/detail?id=${item.id}`)
    },
    scrolltolower() {
      // 通过总条数算出总页数
      let pageNums = Math.ceil(this.total / this.formData.pageSize)
      if (this.formData.pageNum < pageNums) {
        this.formData.pageNum = this.formData.pageNum + 1
        this.getProductsList()
      }
    },
    // 获取采购购列表
    getpurchasehomepage() {
      purchasehomepage().then((res) => {
        this.purParams = res.data
      })
    },
    // 获取商品列表
    getProductsList() {
      getProductsList(this.formData).then((res) => {
        this.productsList =
            this.formData.pageNum === 1
                ? res.data.records
                : this.productsList.concat(res.data.records)
        this.total = res.data.total
      })
    },
    clickBannerItem(item) {
      console.info(item)
    },
    changeSwiper(e) {
      this.current = e.detail.current
    },
    clickNotice() {
      this.gotoProcure('/pages/notice/index')
    },
  },
}
</script>

<style lang="scss" scoped>
page {
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}

.work-container {
  /*  #ifdef  APP-PLUS	  */
  height: 100vh;
  /*  #endif  */
  /*  #ifdef  H5	  */
  height: calc(100vh - 50px);
  /*  #endif  */
  background: linear-gradient(180deg, #ffffff 0%, #f4f5f9 100%);

  .infoList {
    padding: 12px 0;

    .grid-item-box {
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: space-evenly;
      align-items: center;
      color: #878b8b;

      .text {
        margin: 14rpx 0rpx;
        font-family: PingFangSC, PingFang SC;
        font-weight: 400;
        font-size: 33rpx;
        color: #363636;
        line-height: 46rpx;
        text-align: center;
      }
    }
  }

  .content-jinqi {
    position: relative;
    min-height: 212rpx;
    margin: 16px 12px 0;
    padding: 20px 14px 14px;
    border-radius: 8rpx;
    background: linear-gradient(
            180deg,
            rgba(222, 60, 49, 0.12) 0%,
            rgba(222, 60, 49, 0) 36%,
            #ffffff
    );
    font-family: PingFangSC, PingFang SC;
    font-weight: 500;
    font-size: 35rpx;
    color: #363636;
    line-height: 35rpx;

    .images {
      position: absolute;
      top: -30rpx;
      left: 12rpx;
      width: 84.62rpx;
      height: 84.62rpx;
    }

    .rifht {
      width: 23rpx;
      height: 23rpx;
      margin-left: 11rpx;
    }

    .buts {
      width: 131rpx;
      height: 46rpx;
      margin: 19rpx 0 7rpx;
      background: #fdf5f0;
      border-radius: 23rpx;
      font-weight: 400;
      font-size: 23rpx;
      color: #cd9063;
      line-height: 46rpx;
    }

    .shopimg {
      margin-left: 23rpx;
      width: 146rpx;
      height: 146rpx;
      border-radius: 10rpx;
    }

    .noneCss {
      // padding-top: 30rpx;
      font-family: PingFangSC, PingFang SC;
      font-weight: 500;
      font-size: 35rpx;
      color: #363636;
    }

    .tigs {
      padding-top: 26rpx;
      font-weight: 400;
      font-size: 27rpx;
      color: #767676;
      line-height: 27rpx;
    }

    .purbox .buts {
      margin: 0;
    }

    .purimg {
      position: absolute;
      top: 0;
      left: 246rpx;
      width: 300rpx;
      height: 100%;
    }
  }

  .waiting {
    position: relative;
    margin: -19rpx 12px 0;
    height: 62rpx;
    background: linear-gradient(180deg, #ff897a 0%, #ea493e 100%);
    border-radius: 0rpx 0rpx 8rpx 8rpx;
    font-family: PingFangSC, PingFang SC;
    font-weight: 400;
    font-size: 27rpx;
    color: #ffffff;
    line-height: 60rpx;
    z-index: 2;

    .rifht {
      width: 46rpx;
      height: 46rpx;
      margin-right: 19rpx;
      animation: yaobai 500ms ease-in-out infinite;
    }

    @keyframes yaobai {
      0% {
        transform: rotate(-30deg);
      }

      2% {
        transform: rotate(30deg);
      }

      4% {
        transform: rotate(-18deg);
      }

      6% {
        transform: rotate(18deg);
      }

      8% {
        transform: rotate(-30deg);
      }

      10% {
        transform: rotate(30deg);
      }

      12% {
        transform: rotate(-18deg);
      }

      14% {
        transform: rotate(18deg);
      }

      16% {
        transform: rotate(-20deg);
      }

      18% {
        transform: rotate(12deg);
      }

      20% {
        transform: rotate(0deg);
      }
    }
  }

  .foolbox {
    padding: 39rpx 12rpx 0;

    .tjtitle {
      margin-bottom: 23rpx;
      padding: 0 5px;
      font-family: PingFangSC, PingFang SC;
      font-weight: 500;
      font-size: 35rpx;
      color: #363636;
      line-height: 35rpx;
    }

    .tjbox {
      display: inline-block;
      width: 50%;
      padding: 0 12rpx 30rpx;

      .tjheader {
        width: 100%;
        height: calc(50vw - 10px);
        border-radius: 8px;
      }

      .tjtit {
        height: 80rpx;
        padding: 4px;
        font-weight: 500;
        font-size: 29rpx;
        color: #363636;
        line-height: 38rpx;
      }

      .tjprice {
        padding-left: 4px;
        padding-top: 15rpx;
        font-size: 14px;
        font-weight: 500;
        color: #de3c31;
        align-items: baseline;

        span {
          display: block;
          color: rgba(222, 60, 49, 1);
          font-size: 10px;
          font-family: PingFangSC-Medium;
          font-weight: 500;
          text-align: left;
          white-space: nowrap;
          line-height: 18px;
        }

        p {
          overflow-wrap: break-word;
          color: rgba(222, 60, 49, 1);
          font-size: 18px;
          font-family: PingFangSC-Semibold;
          font-weight: 600;
          text-align: left;
          white-space: nowrap;
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
}

::v-deep .uni-swiper__dots-box {
  width: 30% !important;
}

::v-deep .uni-swiper__dots-bar {
  border-radius: 2px !important;
}

.header-section {
  width: 100%;
  color: white;
  position: relative;
  // border-bottom-left-radius: 10px;
  // border-bottom-right-radius: 50px;
  // overflow: hidden;

  .uni-swiper__warp {
    width: 100%;
    z-index: 3;
  }

  .swiper-box {
    height: 500rpx;
  }

  .swiper-item {
    /* #ifndef APP-NVUE */
    display: flex;
    /* #endif */
    flex-direction: column;
    justify-content: center;
    align-items: center;
    color: #fff;
    height: 500rpx;
    line-height: 500rpx;
  }

  .nav {
    position: absolute;
    top: 104rpx;
    display: flex;
    align-items: center;
    padding: 0 30rpx;
    width: 100%;
    z-index: 3;

    .images {
      width: 46rpx;
      height: 46rpx;
      margin-left: 23rpx;
    }

    ::v-deep input {
      background-color: transparent !important;
    }

    .u-search {
      flex: 1;

      .u-search__content {
        height: 56rpx;

        .u-search__content__input {
          background: none !important;
        }
      }
    }
  }
}
</style>
