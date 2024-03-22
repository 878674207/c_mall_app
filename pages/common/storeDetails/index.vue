<template>
  <view class="storeDetail">
    <!-- 搜索框 -->
    <view class="top">
      <view class="search">
        <u-icon name="arrow-left" size="20" color="#767676" @click="rightClick"></u-icon>
        <view class="search-content">
          <uni-icons type="search" size="20" color="#9F9F9F" @click="search()"></uni-icons>
          <input placeholder="呼吸机" type="text" v-model="keyword" @input="search()" />
        </view>
      </view>
      <view class="title" v-if="topMassage">
        <image :src="topMassage.logo" style="width: 44px;height: 44px;" mode="aspectFill" :draggable="false" class="img defaimg"></image>
        <view class="storeText">
          <span class="textTop">{{ topMassage.storeName }}</span>
          <view class="textFooter">
            <span class="bqText">标签</span>
            <span>{{ topMassage.fansCount }}万粉丝</span>
            <span>{{ topMassage.repeatCustomerCount }}万回头客</span>
          </view>
        </view>
        <button class="gzBtn" @click="concernBtn" v-if="concern">关注</button>
        <button class="ygzBtn" @click="concernBtn" v-else>已关注</button>
      </view>
      <view class="tabsBox">
        <u-tabs :list="list" class="tabs" @click="clickTab" :activeStyle="{
          color: '#303133',
          fontWeight: 'bold',
          transform: 'scale(1.05)',

        }" :inactiveStyle="{
  color: '#606266',
  transform: 'scale(1)'
}" itemStyle="padding-left: 15px; padding-right: 15px; height: 34px;">
        </u-tabs>
        <button>
          <u-icon name="chat" color="#767676" size="20"></u-icon>在线客服
        </button>

      </view>
    </view>
    <view class="storeContent" v-if="tabIndex == 0">
      <view class="askTab">
        <view class="askTop">
          <view :class="['askItem', activeIndex == index ? 'active' : '']" v-for="(item, index) in cateList" @click="changeActive(index)" :key="index">{{ item.categoryName }}</view>
        </view>
        <view class="askFooter">
        </view>
      </view>
      <!-- 商品展示 -->
      <!-- <u-list @scrolltolower="scrolltolower"> -->
      <view class="itemBox" v-for="(goodItem, goodIndex) in goodList" :key="goodIndex" @click="searchActive(goodItem)">
        <view class="itemImage">
          <image class="defaimg" :src="goodItem.pic" style="height: 120px;width: 120px;"></image>
        </view>
        <view class="itemcontent grow1">
          <view class="tops">
            {{ goodItem.productName }}
          </view>
          <view class="footer">
            <span class="left"><a>￥</a>{{ goodItem.price }}</span>
            <span class="reight">{{ goodItem.sale }}人已付款</span>
          </view>
        </view>
      </view>
      <!-- </u-list> -->
    </view>
    <view class="storeContentTwo" v-else-if="tabIndex == 1">
      <liu-dropdown :menuList="menuList" :dataObj="dataObj" @change="change"></liu-dropdown>
      <!-- 商品展示 -->
      <u-list @scrolltolower="scrolltolower" class="u-list">
        <view class="list-Box">
          <template v-if="productsList.length >= 1">
            <view class="list-container" v-for="(item, index) in productsList" :key="index" @click="searchActive(item)">
              <view class="list-head">
                <view>
                  <image class="pic defaimg" :src="item.pic"></image>
                  <view class="list-title">{{ item.productName }}</view>
                  <view class="list-foot">
                    <span class="price"><a>￥</a>{{ item.price }}</span>
                    <span class="number">{{ '已售' + item.sale }}</span>
                  </view>
                  <view class="originalPrice">{{ item.originalPrice }}</view>
                </view>
              </view>
            </view>
          </template>
          <u-empty mode="data" v-else :icon="`${imgBasePath}/static/images/icons/img-blank-order.png`" textSize="14" width="150" height="150" />
        </view>
      </u-list>
    </view>
    <view class="storeContentThree" v-else>
      <u-collapse>
        <u-collapse-item :title="item.categoryName" v-for="(item, index) in classify" :key="index" :open="item.open" :disabled="item.disabled">
          <view v-for="(itemClassify, index) in item.children" :key="index" class="itemClassify">
            <view class="text" @click="searchActiveTwo(item)">{{ itemClassify.categoryName }}</view>
          </view>
        </u-collapse-item>
      </u-collapse>
    </view>
  </view>
</template>
 
<script>
import {
  getStoreDetails,
  getStoreRecommend,
  getStoreCategory,
} from '@/api/system/storeDetail.js'
import { getProductsList, attentionsave } from '@/api/system/productsList.js'
export default {
  data() {
    return {
      // 搜索框
      keyword: '',
      // 数据源
      productsList: [],
      //菜单信息
      pageNum: 1,
      pageSize: 10,
      id: null,
      sort: null,
      exStoreId: null,
      goodList: [],
      commodityList: [],
      classify: [],
      classifyChildren: [],
      list: [
        {
          name: '推荐',
        },
        {
          name: '商品',
        },
        {
          name: '分类',
        },
      ],
      cateList: [
        {
          index: 1,
          categoryName: '销量榜',
        },
        {
          index: 2,
          categoryName: '收藏榜',
        },
        {
          index: 3,
          categoryName: '浏览榜',
        },
      ],
      //菜单信息
      menuList: [
        {
          id: 1,
          name: '综合排序',
          isMultiple: false, //是否多选
          showType: 3, //下拉框类型(1、2、3、4)
        },
        {
          id: 2,
          name: '价格',
          isMultiple: false, //是否多选
          showType: 3, //下拉框类型(1、2、3、4)
        },
        {
          id: 3,
          name: '筛选',
          isMultiple: true, //是否多选
          showType: 4, //下拉框类型(1、2、3、4)
        },
      ],
      //下拉框数据源
      dataObj: {
        //类型1数据结构
        itemList1: [
          {
            name: '按照距离',
            id: '0',
          },
          {
            name: '按照价格',
            id: '1',
          },
        ],
        //类型2数据结构
        itemList2: [
          {
            name: '0-100',
            id: '0',
          },
          {
            name: '100-500',
            id: '0',
          },
          {
            name: '500-2000',
            id: '0',
          },
          {
            name: '>2000',
            id: '1',
          },
        ],
        //类型2数据结构
        itemList3: [
          {
            id: 0,
            name: '星级',
            childs: [
              {
                id: 1,
                name: '一星',
              },
              {
                id: 2,
                name: '2星',
              },
            ],
          },
        ],
      },
      activeIndex: 0,
      tabIndex: 0,
      concern: false,
      topMassage: null,
      attend: null,
      pageNum: 1,
      pageSize: 10,
      total: 0, //总条数
    }
  },
  //页面初始化
  onLoad(event) {
    if (event.exStoreId) {
      this.exStoreId = event.exStoreId
      this.getStoreDetails()
      // 一开始调用一下推荐的销量榜
      this.getStoreRecommend(this.exStoreId, 0)
    }
  },
  methods: {
    rightClick() {
      this.$tab.navigateBack()
    },
    clickTab(item) {
      if (item.index == 0) {
        this.tabIndex = 0
      } else if (item.index == 1) {
        this.tabIndex = 1
        // 获取店铺商品分类接口数据

        this.getProductsList()
      } else {
        this.tabIndex = 2
        this.getStoreCategory(this.exStoreId)
      }
    },
    // 点击关注
    concernBtn() {
      this.concern = !this.concern
      if (this.concern) {
        this.attend = 0
      } else {
        this.attend = 1
      }
      let datas = {
        storeId: this.exStoreId,
        storeName: this.topMassage.storeName,
        // storeLogo: this.storeLogo,
        attend: this.attend,
      }
      attentionsave(datas).then((res) => {
        if (res.code == 200) {
          this.$forceUpdate()
        }
      })
    },
    // 获取店铺详情头部信息
    getStoreDetails() {
      getStoreDetails(this.exStoreId).then((res) => {
        this.topMassage = res.data
        // 这里返回的id就是点击店铺的id及storId
      })
    },
    // 店铺详情（推荐）
    getStoreRecommend(id, type) {
      getStoreRecommend(id, type).then((res) => {
        this.goodList = res.data && res.data.length > 0 ? res.data : []
      })
    },
    // 店铺详情（商品）
    getProductsList() {
      let data = {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        keyword: this.keyword || null,
        // sort: this.sort || null,
        // productCategoryId: this.id,
        storeId: this.exStoreId || null,
      }
      getProductsList(data).then((res) => {
        this.productsList =
          this.pageNum === 1
            ? res.data.records
            : this.productsList.concat(res.data.records)
        this.total = res.data.total
      })
    },
    // 店铺详情（分类）
    getStoreCategory(data) {
      getStoreCategory(data).then((res) => {
        this.classify = res.data && res.data.length > 0 ? res.data : []
      })
    },
    // 筛选选的条件
    change(field) {
      // console.log('所选字段', field)
      // 在这里发送接口
      // this.getPrdList(field.chooseMenu.id)
    }, //点击推荐的tab
    searchActive(goodItem) {
      console.log(goodItem)
      uni.navigateTo({
        url: '/pages/productList/detail?id=' + goodItem.id,
      })
    },
    // 分类点击跳转
    searchActiveTwo(item) {
      console.log(item)
    },
    search() {
      this.getProductsList()
    },
    //更改点击项的索引号
    changeActive(i) {
      this.activeIndex = i
      // 已经获取到索引号
      // this.goodList = this.cateList[i]
      this.getStoreRecommend(this.exStoreId, i)
    },
    // 分页组件
    scrolltolower() {
      // 通过总条数算出总页数
      let pageNums = Math.ceil(this.total / this.pageSize)
      if (this.pageNum < pageNums) {
        this.pageNum = this.pageNum + 1
        // 再次调用商品界面数据
        this.getProductsList()
      }
    },
    // 获取商品详情
    seeDetails(item) {
      this.$tab.navigateTo(`/pages/productList/detail?id=${item.id}`)
    },
  },
}
</script>
 
<style scoped lang="scss">
* {
  margin: 0;
  padding: 0;
}

::v-deep .uni-app--maxwidth {
  background-color: #fafbfd !important;
}

::v-deep .type-list {
  position: fixed;
  top: 211px;
  left: 0;
  height: 44px !important;
  z-index: 1;
  background-color: #fff;
  // border-radius: 15px;
  border: none !important;
}

::v-deep .item-main {
  position: fixed;
  top: 257px;
  left: 0;
}

.storeDetail {
  background-color: #f8f9fb;
  height: 100vh;
  position: relative;

  .top {
    position: fixed;
    top: 0;
    width: 100%;
    z-index: 1;
    background: #f8f9fb;

    .search {
      width: 100%;
      padding: 54px 12px 8px;
      display: flex;
      align-items: center;
      //   position: fixed;
      //   z-index: 1;
      background-color: #f8f9fb;

      .search-content {
        padding: 0 12px;
        width: 100%;
        margin-left: 18px;
        height: 34px;
        border-radius: 17px;
        display: flex;
        align-items: center;
        box-sizing: border-box;
        background: #ffffff;

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

    .title {
      display: flex;
      justify-content: space-between;
      //   padding-top: 120px;
      padding: 12px 14px;
      align-items: center;

      .storeText {
        display: flex;
        flex-direction: column;
        padding-left: 10px;
        padding-right: 20px;

        .textTop {
          font-size: 16px;
          font-family: PingFangSC, PingFang SC;
          font-weight: 600;
          color: #363636;
        }

        .textFooter {
          font-size: 14px;
          font-family: PingFangSC, PingFang SC;
          font-weight: 400;
          color: #767676;
          margin-top: 6px;

          span {
            margin-right: 10px;
          }

          .bqText {
            display: inline-block;
            border: 1px solid #de3c31;
            width: 40px;
            height: 18px;
            font-weight: 700;
            text-align: center;
            line-height: 1.2;
            color: #de3c31;
            border-radius: 5px;
          }
        }
      }

      .gzBtn {
        background-color: #de3c31;
        width: 60px;
        height: 28px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 14px;
        color: #ffffff;
        font-size: 15px;
        margin-left: 23px;
      }

      .ygzBtn {
        background-color: #c0c0c0;
        width: 60px;
        height: 28px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 14px;
        color: #ffffff;
        font-size: 15px;
        margin-left: 23px;
      }
    }

    .tabsBox {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      padding-bottom: 10px;
      padding-right: 20px;

      button {
        width: 78px;
        height: 24px;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 11px;
        font-family: PingFangSC, PingFang SC;
        font-weight: 400;
        color: #767676;
        border-radius: 10px;
        border: 1px solid #767676;
      }
    }
  }

  .storeContent {
    position: absolute;
    top: 211px;
    width: 100%;
    background-color: #fff;
    height: auto;
    border-top-left-radius: 20px;
    border-top-right-radius: 20px;
    min-height: calc(100vh - 211px);

    .askTab {
      padding: 16px;

      .askTop {
        display: flex;
        justify-content: start;

        .askItem {
          margin-right: 12px;
          width: 80px;
          height: 32px;
          background-color: #f4f4f5;
          border-radius: 80px;
          font-size: 14px;
          font-family: PingFangSC, PingFang SC;
          font-weight: 400;
          color: #6f6f78;
          line-height: 32px;
          text-align: center;
        }

        .askItem.active {
          background-color: #ffeae8;
          color: #de3c31;
          font-weight: 700;
        }
      }
    }

    .itemBox {
      display: flex;
      justify-content: start;
      padding: 0 12px 12px;

      .itemImage {
        width: 120px;
        height: 120px;
        background-color: #fff;
        border-radius: 10px;
        // margin-left: 10px;

        image {
          border-radius: 10px;
        }
      }

      .itemcontent {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        padding: 4px 0 4px 12px;

        .tops {
          //   width: 234px;
          height: 48px;
          font-size: 15px;
          font-family: PingFangSC, PingFang SC;
          font-weight: 700;
          color: #363636;
          line-height: 24px;
        }

        .footer {
          display: flex;
          justify-content: space-between;

          .left {
            font-size: 15px;
            font-family: PingFangSC, PingFang SC;
            font-weight: 700;
            color: #de3c31;
            line-height: 18px;
          }

          .reight {
            height: 18px;
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

  .storeContentTwo {
    position: absolute;
    top: 211px;
    width: 100%;
    background-color: #fff;
    height: auto;
    border-top-left-radius: 20px;
    border-top-right-radius: 20px;
    padding-top: 44px;
    display: flex;

    .u-list {
      .list-Box {
        // position: absolute;
        top: 150px;
        width: 100%;
        padding: 0 6px;
        background: #fff;
        display: flex;
        flex-wrap: wrap;

        .list-container {
          // display: inline-block;
          width: 50%;
          padding: 6px;

          .list-head {
            .pic {
              width: 177px;
              height: 177px;
              border-radius: 5px;
            }

            .originalPrice {
              font-size: 10px;
              font-family: PingFangSC, PingFang SC;
              font-weight: 400;
              color: #b7b7b7;
              text-decoration: line-through;
            }

            .list-title {
              font-size: 15px;
              font-family: PingFangSC, PingFang SC;
              font-weight: 600;
              color: #363636;
            }

            .list-foot {
              display: flex;
              justify-content: space-between;
              padding-left: 4px;
              line-height: 2;
              margin-top: 5px;

              .price {
                font-size: 15px;
                font-family: PingFangSC, PingFang SC;
                font-weight: 600;
                color: #de3c31;
                line-height: 18px;

                a {
                  font-size: 10px;
                }
              }

              .number {
                padding: 0 18px;
                font-size: 13px;
                font-family: PingFangSC, PingFang SC;
                font-weight: 400;
                color: #767676;
                line-height: 18px;
                height: 18px;
                // background: #f4f5f9;
                // border-radius: 12px;
              }
            }
          }
        }
      }
    }
  }

  .storeContentThree {
    position: absolute;
    top: 211px;
    width: 100%;
    background-color: #fff;
    padding: 16px;
    border-radius: 15px;
    min-height: calc(100vh - 211px);

    .u-collapse {
      ::v-deep .u-collapse-item__content__text.content-class {
        display: flex;
        flex-direction: row;
      }

      ::v-deep .u-line {
        border: none !important;
      }

      .u-collapse-item {
        background: #fafbfd;
        border-radius: 5px;
        margin-bottom: 10px;

        .itemClassify {
          width: 106px;
          height: 34px;
          margin-right: 10px;

          .text {
            display: flex;
            align-items: center;
            justify-content: center;
            background: #eff1f6;
            border-radius: 2px;
            width: 106px;
            height: 34px;
            font-size: 14px;
            font-family: PingFangSC, PingFang SC;
            font-weight: 500;
            color: #363636;
          }
        }
      }
    }
  }

  .more {
    background-color: #fff;
    height: auto;

    .foolbox {
      padding-top: 20px;
      padding-bottom: 20px;

      .tigimg {
        display: flex;
        justify-content: center;
        align-items: center;

        .moreText {
          width: 60px;
          height: 15px;
          font-size: 15px;
          font-family: PingFangSC, PingFang SC;
          font-weight: 500;
          color: #363636;
          line-height: 15px;
          margin: 0 15px;
        }

        .noMore {
          width: 105px;
          height: 15px;
          font-size: 15px;
          font-family: PingFangSC, PingFang SC;
          font-weight: 400;
          color: #b7b7b7;
          line-height: 15px;
          margin: 0 15px;
        }
      }
    }

    .list-Box {
      display: flex;
      flex-wrap: wrap;
      .list-container {
        // display: inline-block;
        width: 50%;
        padding: 6px;
        margin-top: 20px;
        margin-bottom: 30px;

        .list-head {
          .pic {
            width: 100%;
            height: 177px;
            border-radius: 5px;
            background-color: pink;
          }

          .list-title {
            font-size: 15px;
            font-family: PingFangSC, PingFang SC;
            font-weight: 600;
            color: #363636;
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
            margin-top: 5px;
            align-items: center;

            .price {
              font-size: 15px;
              font-family: PingFangSC, PingFang SC;
              font-weight: 600;
              color: #de3c31;

              a {
                font-size: 9px;
              }
            }

            .number {
              // padding: 0 18px;
              font-size: 13x;
              font-family: PingFangSC, PingFang SC;
              font-weight: 400;
              color: #767676;
              line-height: 18px;
              height: 18px;
              // background: #f4f5f9;
              border-radius: 12px;
            }
          }
        }
      }
    }
  }
}
</style>