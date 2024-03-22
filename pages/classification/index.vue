<template>
  <view class="classify">
    <!-- 搜索框 -->
    <view class="search">
      <view class="search-content" @click="goToSearch">
        <!-- 图标 -->
        <uni-icons type="search" size="20" color="#B7B7B7"></uni-icons>
        <span>输入你想找的商品名称</span>
      </view>
    </view>
    <!-- 分类部分 -->
    <view class="cate-container">
      <view class="cate-left">
        <view :class="['cate-item', activeIndex == index ? 'active' : '']" v-for="(item, index) in cateList" :key="index" @click="changeActive(index)">{{ item.categoryName }}</view>
      </view>
      <view class="cate-right" v-if="goodList.length>0">
        <view class="cate-content" v-for="(goodItem, goodIndex) in goodList" :key="goodIndex" @click="SearchActive(goodItem)">
          <view class="imageBox">
            <image :src="goodItem.icon" style="height: 55px;width: ;" v-if="goodItem.icon"></image>
            <!-- 图片为空时给默认图片 -->
            <u-empty mode="data" v-else :icon="`${imgBasePath}/static/images/icons/img-blank-order.png`" width="55px" height="55px" />
          </view>
          <view class="cate-text ellipsis">{{ goodItem.categoryName }}</view>
        </view>

      </view>
      <view class="cate-right" v-else>
        <u-empty mode="data" class="emptyBox" :icon="`${imgBasePath}/static/images/icons/img-blank-order.png`" textSize="14" width="180" height="180" />

      </view>
    </view>
  </view>
</template>
 
<script>
import { getClassification } from '@/api/system/classification.js'
export default {
  data() {
    return {
      // 初始化的分类列表
      cateList: [],
      // 当前点击项的索引号
      activeIndex: 0,
      // 分类下的商品信息
      goodList: [],
    }
  },
  methods: {
    async getcateList() {
      getClassification().then((res) => {
        if (res.code != 200) {
          return uni.showToast({
            title: '加载数据失败',
            duration: 1000,
            icon: 'none',
          })
        } else {
          if (res.data) {
            this.cateList = res.data
            // 获取第一个分类下的商品
            this.goodList =
              res.data && res.data.length > 0 ? res.data[0].children : []
          }
        }
      })
    },
    //更改点击项的索引号
    changeActive(i) {
      this.activeIndex = i
      // 已经获取到索引号
      this.goodList = this.cateList[i].children
    },
    // 点击二级具体商品进行跳转
    SearchActive(item) {
      uni.navigateTo({
        url: `/pages/productList/index?id=${item.id}`,
      })
    },
    //点击搜索框跳转到搜索页面
    goToSearch: function () {
      uni.navigateTo({
        url: '/pages/classification/search',
      })
    },
  },
  onLoad() {
    this.getcateList()
  },
}
</script>
 
<style scoped lang="scss">
* {
  margin: 0;
  padding: 0;
}
::v-deep .uni-app--showtabbar .uni-app--maxwidth {
  background-color: #f4f5f9 !important;
}
.classify {
  background-color: #f8f9fb;

  .search {
    width: 100%;
    display: flex;
    align-items: center;
    position: fixed;
    background-color: #f8f9fb;
    z-index: 1;
    .search-content {
      margin: 54px 12px 8px;
      padding: 0 12px;
      width: 100%;
      height: 34px;
      background: #ffffff;
      border-radius: 17px;
      display: flex;
      align-items: center;
      box-sizing: border-box;
      span {
        font-size: 14px;
        font-family: PingFangSC, PingFang SC;
        font-weight: 400;
        color: #b7b7b7;
        line-height: 20px;
        margin-left: 6px;
      }
    }
  }

  .cate-container {
    position: relative;
    top: 96px;
    width: 100%;
    display: flex;
    background-color: #f2f2f2;
    .cate-left {
      width: 200rpx;
      background-color: #f8f9fb;
      .cate-item {
        width: 100%;
        height: 55px;
        line-height: 55px;
        padding-left: 15px;
        box-sizing: border-box;
        // border-bottom: 1px solid #ababab;
      }

      .active {
        background-color: #fff;
        position: relative;
        padding-left: 15px;
        box-sizing: border-box;
        border-radius: 18px 0px 0px 0px;
        // color: #DE8B17;
        &::before {
          content: '';
          display: block;
          width: 10rpx;
          border-radius: 6rpx;
          height: 15px;
          // background-color: #DE8B17;
          position: absolute;
          left: 0rpx;
          top: 30rpx;
        }
      }
    }

    .cate-right {
      height: calc(100vh - 96px);
      background-color: #fff;
      padding: 24px 0;
      width: 100%;
      .cate-content {
        width: 33%;
        display: inline-block;
        height: 100px;
        text-align: center;
        .imageBox {
          width: 50px;
          height: 50px;
          margin-top: 10px;
          border-radius: 50%;
          background-color: #eaedee;
          overflow: hidden;
          margin: 0 auto;
        }
        .cate-text {
          padding: 10px 0px;
          font-size: 14px;
          font-family: PingFangSC, PingFang SC;
          font-weight: 400;
          color: #363636;
          line-height: 14px;
        }
      }
    }
  }
}
</style>