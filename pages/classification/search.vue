<template>
  <view class="classify">
    <!-- 搜索框 -->
    <view class="search">
      <u-icon name="arrow-left" size="18" color="#767676" @click="rightClick" class="arrow"></u-icon>
      <view class="search-content">
        <!-- 在uni-app官网找的图标 -->
        <uni-icons type="search" size="18" color="#9F9F9F"></uni-icons>
        <!-- <input placeholder="请输入您要搜索的内容" type="text" v-model="params.keyword" @input ="searchBtn()" /> -->
        <input placeholder="请输入您要搜索的内容" type="text" v-model.trim="keyword" @input="searchBtn(keyword)" />
        <button class="searchBox" @click="getsearch(keyword)">
          搜索
        </button>
      </view>
    </view>
    <view class="history">
      <view v-if="!keyword">
        <scroll-view scroll-y @scrolltolower="scrolltolower" style="height: 100%;" refresher-enabled="true">
          <template v-if="historyList.length > 0">
            <view class="h-top">
              <span class="title">搜索记录</span>
              <u-icon class="out" name="trash" size="19" color="#767676" @click="deleteHistory"></u-icon>
            </view>
            <view class="hisList">
              <span v-for="(item, index) in historyList" :key="index" @click="keyword = item, params.pageNum = 1, getsearch(keyword)">{{ item }}</span>
            </view>
          </template>
          <!-- <view style="padding-bottom:30px" v-if="!viewtype">
            <view class="h-top">
              <span class="title titleTwo">搜索发现</span>
              <u-icon class="out titleTwo" name="reload" size="19" color="#767676"></u-icon>
            </view>
            <viwe class="hisFound">
              <span>抹茶玫瑰卷</span>
              <span>瑞幸椰蓉拿铁</span>
              <span>抹茶玫瑰卷</span>
              <span>瑞幸椰蓉拿铁</span>
              <span>抹茶玫瑰卷</span>
              <span>瑞幸椰蓉拿铁</span>
            </viwe>
          </view> -->
          <view class="foolbox" v-if="specialList.length > 0">
            <view v-for="(item, index) in specialList" :key="index" class="tjbox" @click="searchActive(item)">
              <image class="tjheader" :src="item.pic || item.storeLogo || `${imgBasePath}/static/images/icons/img-default.png`" />
              <view class="tjtit">{{ item.productName || item.storeName }}</view>
              <view class="tjprice flex-spb align-c" v-if="item.price">
                <view class="flex"><span>￥</span>{{ item.price }}</view>
              </view>
            </view>
          </view>
          <!-- <u-empty mode="data" v-else :icon="`${imgBasePath}/static/images/icons/img-blank-order.png`" textSize="14"
          width="150" height="150" /> -->
        </scroll-view>
      </view>
      <view v-else>
        <!-- 商品展示 -->
        <u-list @scrolltolower="scrolltolower" v-if="productsList.length > 0">
          <view class="list-Box">
            <template>
              <view class="list-container" v-for="(item, index) in productsList" :key="index">
                <view class="list-head">
                  <view @click="searchActive(item)">
                    <image class="pic" :src="item.pic"></image>
                    <view class="list-title ellipsis">{{ item.productName }}</view>
                    <view class="list-subTitle">{{ item.productCategoryName }}</view>
                    <view class="list-foot">
                      <span class="price"><a>￥</a>{{ item.price }}</span>
                      <span class="number">{{ '已售' + item.sale }}</span>
                    </view>
                  </view>
                </view>
              </view>
            </template>
          </view>
        </u-list>
        <u-empty mode="data" v-else :icon="`${imgBasePath}/static/images/icons/img-blank-search.png`" textSize="14" width="150" height="150" />
      </view>
    </view>
  </view>
</template>
<script>
import { getcollection, getList } from '@/api/system/follow.js'
import { getProductsList } from '@/api/system/productsList.js'
export default {
  data() {
    return {
      keyword: '',
      specialList: [], //关键字搜索回来的数据
      historyList: [], //搜索记录
      // show: 'true', //切换布局
      his: 1,
      viewtype: null,
      params: {
        pageNum: 1,
        pageSize: 10,
      },
      total: 0,
      productsList: [],
    }
  },
  methods: {
    // 返回按钮
    rightClick() {
      this.$tab.navigateBack()
    },
    // 点击二级具体商品进行跳转
    // searchActive(item) {
    //   if (this.viewtype === 'collection') {
    //     uni.navigateTo({
    //       url: '/pages/productList/detail?id=' + item.productId,
    //     })
    //   }
    //   if (this.viewtype === 'follow') {
    //     uni.navigateTo({
    //       url: '/pages/common/storeDetails/index?exStoreId=' + item.storeId,
    //     })
    //   }
    // },
    searchActive(item) {
      console.log(item)
      uni.navigateTo({
        url: '/pages/productList/detail?id=' + item.id,
      })
    },
    scrolltolower() {
      // 通过总条数算出总页数
      let pageNums = Math.ceil(this.total / this.params.pageSize)
      if (this.params.pageNum < pageNums) {
        this.params.pageNum = this.params.pageNum + 1
        // this.params.keyword = this.keyword
        this.getsearch(this.keyword)
      }
    },
    async getsearch(keyword) {
      // 发起接口请求
      if (keyword == '') {
        uni.showModal({
          title: '搜索内容不能为空',
        })
      } else {
        //判断数组里面是否有重复的搜索内容，有的话就删除之前的，把现在搜索的放在数组的前面
        if (this.historyList.includes(keyword)) {
          let i = this.historyList.indexOf(keyword)
          this.historyList.splice(i, 1)
          //把现在搜索的放在数组的前面
          this.historyList.unshift(keyword)
        } else {
          this.historyList.unshift(keyword)
          //
          uni.setStorageSync('searchList', JSON.stringify(this.historyList))
        }
        // if (this.viewtype === 'collection') {
        //   getcollection(this.params).then((res) => {
        //     this.specialList =
        //       this.params.pageNum === 1
        //         ? res.data.records
        //         : this.specialList.concat(res.data.records)
        //     this.total = res.data.total
        //   })
        // }
        // if (this.viewtype === 'follow') {
        //   getList(this.params).then((res) => {
        //     this.specialList =
        //       this.params.pageNum === 1
        //         ? res.data.records
        //         : this.specialList.concat(res.data.records)
        //     this.total = res.data.total
        //   })
        // }
        this.params.pageNum = 1
        this.getPrdList()
      }
    },
    // 删除按钮逻辑
    deleteHistory() {
      // 清楚搜索历史
      uni.showToast({
        title: '已清空',
      })
      uni.removeStorage({
        key: 'searchList',
      })
      this.historyList = []
    },
    //每次进入页面的时候拿到存进去的缓存
    onShow() {
      this.historyList = JSON.parse(uni.getStorageSync('searchList') || '[]')
      // 目前有什么历史记录
      console.log('历史记录', this.historyList)
    },
    // 获取商品列表数据
    getPrdList() {
      let data = {
        pageNum: this.params.pageNum,
        pageSize: this.params.pageSize,
        keyword: this.keyword || null,
        // sort: this.sort || null,
        // productCategoryId: this.id,
      }
      getProductsList(data).then((res) => {
        this.productsList =
          this.params.pageNum === 1
            ? res.data.records
            : this.productsList.concat(res.data.records)
        this.total = res.data.total
      })
    },
    // 输入框的input事件
    searchBtn(keyword) {
      this.params.pageNum = 1
      this.getPrdList()
      if (keyword) {
        if (this.historyList.includes(keyword)) {
          let i = this.historyList.indexOf(keyword)
          this.historyList.splice(i, 1)
          //把现在搜索的放在数组的前面
          this.historyList.unshift(keyword)
        } else {
          this.historyList.unshift(keyword)
          //
          uni.setStorageSync('searchList', JSON.stringify(this.historyList))
        }
      }
    },
  },
  onLoad(options) {
    if (options) {
      // 'collection': 收藏页面进来的
      // 'follow': 关注页面进来的
      this.viewtype = options.type
    }
  },
  watch: {
    // 监听input框是否有文本，没有文本和有文本更换show状态，更换布局
    keyword(newValue, oldValue) {
      if (newValue == '') {
        this.show = true
      } else {
        this.show = false
      }
    },
  },
}
</script>
<style scoped lang="scss">
* {
  margin: 0;
  padding: 0;
}

.classify {
  position: relative;
  min-height: 100vh;
  background-color: #f4f5f9;

  .search {
    position: fixed;
    top: 0;
    width: 100%;
    height: 96px;
    padding: 0 14px;
    display: flex;
    align-items: center;
    justify-content: start;
    background-color: #f4f5f9;
    z-index: 1;

    .arrow {
      width: 24px;
      height: 24px;
      margin-right: 10px;
    }

    .search-content {
      //   margin: 20px 12px 8px;
      padding-left: 12px;
      width: 100%;
      height: 34px;
      background: #ffffff;
      border-radius: 17px;
      display: flex;
      align-items: center;
      box-sizing: border-box;

      input {
        font-size: 14px;
        font-family: PingFangSC, PingFang SC;
        font-weight: 400;
        color: #b7b7b7;
        line-height: 20px;
        margin-left: 6px;
      }
    }
  }

  .searchBox {
    position: absolute;
    right: 16px;
    width: 50px;
    height: 30px;
    padding-top: 4px;
    margin-left: 80px;
    text-align: center;
    color: #fff;
    background-color: #de3c31;
    line-height: 1.5;
    font-size: 15px;
    border-radius: 20px;
  }

  .history {
    background-color: #fff;
    border-radius: 20px;
    height: calc(100vh - 96px);
    padding: 15px;
    position: absolute;
    top: 96px;
    width: 100%;

    .title {
      font-size: 18px;
      font-weight: 600;
    }

    .hisList {
      display: flex;
      justify-content: start;
      margin-top: 16px;
      padding-bottom: 30px;
      span {
        display: block;
        border-radius: 5px;
        width: auto;
        height: 23px;
        text-align: center;
        background-color: #f2f2f2;
        font-size: 13px;
        margin-right: 10px;
        font-weight: 500;
        border: none;
        padding: 0px 8px;
        padding-top: 5px;
        color: #8f8f8f;
      }
    }

    .hisFound {
      font-size: 15px;
      padding-bottom: 30px;

      span {
        display: inline-block;
        width: 50%;
        padding-top: 10px;
        color: #8f8f8f;
      }
    }

    .h-top {
      display: flex;
      justify-content: space-between;

      .out {
        display: inline-block;
        font-size: 10px;
        font-weight: 400;
        text-align: center;
        margin-right: 20px;
      }
    }

    .h-food {
      display: flex;
      justify-content: start;
      margin-top: 15px;
      margin-bottom: 15px;
      margin-right: 20px;
    }

    //商品列表
    .list-Box {
      // position: absolute;
      top: 150px;
      width: 100%;
      padding: 0 6px;
      background: #fff;

      .list-container {
        display: inline-block;
        width: 50%;
        padding: 6px;

        .list-head {
          .pic {
            width: 100%;
            height: 50vw;
            border-radius: 5px;
          }

          .list-title {
            padding: 0 4px;
            font-size: 15px;
            font-family: PingFangSC, PingFang SC;
            font-weight: 500;
            color: #363636;
            line-height: 20px;
          }

          .list-subTitle {
            display: flex;
            justify-content: start;
            padding-left: 4px;
            color: #d9ab89;
            margin-top: 5px;
            font-size: 12px;
            font-weight: 500;
          }

          .list-foot {
            display: flex;
            justify-content: space-between;
            padding-left: 4px;
            line-height: 2;
            margin-top: 5px;

            .price {
              font-size: 18px;
              font-family: PingFangSC, PingFang SC;
              font-weight: 500;
              color: #de3c31;
              line-height: 18px;

              a {
                font-size: 13px;
              }
            }

            .number {
              padding: 0 5px;
              font-size: 13px;
              font-family: PingFangSC, PingFang SC;
              font-weight: 400;
              color: #767676;
              line-height: 18px;
              height: 18px;
              background: #f4f5f9;
              border-radius: 12px;
            }
          }
        }
      }
    }
  }

  .found {
    font-size: 25px;
    font-weight: 700;
  }

  //商品列表
  .foolbox {
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
  }
}
</style>