<template>
  <view class="proList">
    <!-- 搜索框 -->
    <view class="search flex-spb align-c">
      <u-icon name="arrow-left" size="20" color="#767676" @click="rightClick"></u-icon>
      <view class="search-content">
        <!-- 在uni-app官网找的图标 -->
        <uni-icons type="search" size="20" color="#9F9F9F" @click="search()"></uni-icons>
        <input placeholder="商品名称" type="text" v-model="keyword" @input="search()" />
      </view>
    </view>
    <!-- 筛选按钮组件-->
    <liu-dropdown :menuList="menuList" :dataObj="dataObj" @change="change"></liu-dropdown>
    <!-- 商品展示 -->
    <u-list @scrolltolower="scrolltolower">
      <view class="list-Box">
        <template v-if="productsList.length >= 1">
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
        <u-empty mode="data" v-else :icon="`${imgBasePath}/static/images/icons/img-blank-order.png`" textSize="14" width="150" height="150" />
      </view>
    </u-list>
  </view>
</template>
 
<script>
import { getProductsList } from '@/api/system/productsList.js'
export default {
  data() {
    return {
      // 搜索框
      keyword: '',
      // 数据源
      productsList: [],
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
      pageNum: 1,
      pageSize: 10,
      total: null, //总条数
      id: null,
      sort: null,
    }
  },
  //页面初始化
  onLoad(event) {
    if (event.id || event.sort) {
      this.id = event.id
      this.sort = event.sort
      this.getPrdList()
    }
  },
  methods: {
    scrolltolower() {
      // 通过总条数算出总页数
      let pageNums = Math.ceil(this.total / this.pageSize)
      if (this.pageNum < pageNums) {
        this.pageNum = this.pageNum + 1
        this.getPrdList()
      }
    },
    rightClick() {
      this.$tab.navigateBack()
    },
    // 获取商品列表数据
    getPrdList() {
      let data = {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        keyword: this.keyword || null,
        sort: this.sort || null,
        productCategoryId: this.id,
      }
      getProductsList(data).then((res) => {
        // this.productsList = res.data.records
        this.productsList =
          this.pageNum === 1
            ? res.data.records
            : this.productsList.concat(res.data.records)
        this.total = res.data.total
      })
    },
    // 筛选选的条件
    change(field) {
      // console.log('所选字段', field)
      // 在这里发送接口
      this.getPrdList(field.chooseMenu.id)
    },
    // 点击二级具体商品进行跳转
    searchActive(item) {
      uni.navigateTo({
        url: '/pages/productList/detail?id=' + item.id,
      })
    },
    search() {
      this.pageNum = 1
      this.getPrdList()
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
  background-color: #fff;
  height: 100vh;
  position: relative;

  .search {
    width: 100%;
    padding: 54px 12px 8px;
    display: flex;
    align-items: center;
    position: fixed;
    z-index: 1;
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

  //商品列表
  .list-Box {
    position: absolute;
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
            padding: 0 18px;
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
</style>