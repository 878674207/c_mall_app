<template>
  <view class="work-container">
    <view class="header-section">
      <uni-swiper-dot class="uni-swiper-dot-box" :info="data" :current="current" field="content" :dots-styles="dotsStyles">
        <swiper class="swiper-box" :current="swiperDotIndex" @change="changeSwiper" :autoplay="true">
          <swiper-item v-for="(item, index) in data" :key="index">
            <view class="swiper-item" @click="clickBannerItem(item)">
              <image :src="item.image" mode="aspectFill" :draggable="false" />
            </view>
          </swiper-item>
        </swiper>
      </uni-swiper-dot>
    </view>
  </view>
</template>

<script>
export default {
  created() {},
  onLoad() {
    this.data = [
      {
        image: require('@/static/images/banner/banner.png'),
      },
      {
        image: require('@/static/images/banner/banner.png'),
      },
    ]
  },
  data() {
    return {
      current: 0,
      swiperDotIndex: 0,
      data: [],
      dotsStyles: {
        bottom: 10,
        backgroundColor: 'rgba(255,255,255,0.6)',
        border: '1px rgba(255,255,255,0.6) solid',
        color: '#fff',
        selectedBackgroundColor: '#FFFFFF',
        selectedBorder: '1px rgba(83, 200, 249,0.9) solid',
      },
      gridList: [
        {
          icon: '/static/images/icons/icon-building@2x.png',
          name: '养老机构',
          path: '/package/homes/pages/home/nursingHome/index',
        },
        {
          icon: '/static/images/icons/icon-news@2x.png',
          name: '资讯信息',
          path: '/package/homes/pages/home/news/index',
        },
        {
          icon: '/static/images/icons/icon-notice@2x.png',
          name: '通知公告',
          path: '/package/homes/pages/home/announceMents/index',
        },
        {
          icon: '/static/images/icons/icon-settled@2x.png',
          name: '入驻平台',
          path: '/package/homes/pages/home/entryPlatform/index',
        },
      ],
    }
  },
  mounted() {},
  methods: {
    clickBannerItem(item) {
      console.info(item)
    },
    changeSwiper(e) {
      this.current = e.detail.current
    },
  },
}
</script>

<style lang="scss" scoped>
/* #ifndef APP-NVUE */
page {
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  background-color: #f4f5f9;
  min-height: 100%;
  height: auto;
}
.work-container {
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: #fafafa;
  background-image: url('@/static/index.png');
  background-size: 100% auto;
  background-position: 0% 0%;
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
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 50px;
  overflow: hidden;

  .uni-swiper__warp {
    width: 100%;
    z-index: 3;
  }

  .swiper-box {
    height: 260px;
  }

  .swiper-item {
    /* #ifndef APP-NVUE */
    display: flex;
    /* #endif */
    flex-direction: column;
    justify-content: center;
    align-items: center;
    color: #fff;
    height: 260px;
    line-height: 260px;
  }
}
</style>

