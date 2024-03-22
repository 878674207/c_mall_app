<template>
  <view class="collecontent">
    <!-- 搜索框 -->
    <view class="search flex-spb align-c">
      <view class="wid">
        <u-icon name="arrow-left" size="20" color="#767676" @click="rightClick"></u-icon>
      </view>
      <p class="wid shouc">我的收藏</p>
      <view class="flex-end align-c wid">
        <u-icon name="search" size="24" @click="goto('/pages/classification/search?type=collection')"></u-icon>
        <p @click="complay()" style="margin-left:10px">管理</p>
      </view>
    </view>
    <view class="type-list">
      <view class="flex-spb" style="padding:13px 24px">
        <p>全部收藏</p>
        <view class="flex">
          <span class="flex align-c" @click="cateshow=!cateshow">
            分类<image class="img" :src="`${imgBasePath}/static/images/icons/icon-stock.png`"></image>
          </span>
          <span class="flex  align-c">
            筛选<image class="img" :src="`${imgBasePath}/static/images/icons/icon-screen.png`"></image>
          </span>
        </view>
      </view>
    </view>
    <view class="cbg" v-if="cateshow" @click="cateshow=!cateshow">
      <view class="categorybox">
        <template v-if="category.length>0">
          <view class="citem" @click.stop="openClass(item)" v-for="(item,index) in category" :key="index">
            {{item.categoryName}}
          </view>
        </template>
        <view class="noclass" v-else>
          暂无分类
        </view>
      </view>
    </view>
    <!-- 筛选按钮组件-->
    <u-checkbox-group v-model="ids" placement="column" @change="checkboxChange">
      <u-list @scrolltolower="scrolltolower">
        <view class="list-Box">
          <template v-if="indexList.length>=1">
            <view class="list-container flex" v-for="(item, index) in indexList" :key="index">
              <u-checkbox v-if="showids" shape="circle" size="18" activeColor="#DE3C31" :customStyle="{marginRight: '8px'}" :name="item.id">
              </u-checkbox>
              <view class="list-head flex" @click="searchActive(item,'/pages/productList/detail?id=','productId')">
                <image class="pic" :src="item.pic"></image>
                <view class="grow1 flex-col flex-spb">
                  <view class="list-title ellipsis2">{{ item.subTitle }}</view>
                  <view class="price"><a>￥</a>{{ item.price }}</view>
                  <view class="fool flex-spb align-c">
                    <p @click.stop="searchActive(item,'/pages/common/storeDetails/index?exStoreId=','storeId')">去店铺</p>
                  </view>
                </view>
              </view>
            </view>
          </template>
          <u-empty mode="data" v-else :icon="`${imgBasePath}/static/images/icons/img-blank-order.png`" textSize="14" width="150" height="150" />
        </view>
      </u-list>
    </u-checkbox-group>
    <view v-if="showids" class="btn-container flex-spb align-c">
      <u-checkbox shape="circle" size="18" activeColor="#DE3C31" v-model="allChecked" label="全选" @change="handleAllChange">
      </u-checkbox>
      <p @click="delChange">删除</p>
    </view>
  </view>
</template>

<script>
import {
  getcollection,
  cancelcollection,
  getcategory,
} from '@/api/system/follow.js'
import uImage from '../../../uni_modules/uview-ui/components/u--image/u--image.vue'
export default {
  components: { uImage },
  data() {
    return {
      list6: [
        {
          name: '全部收藏',
        },
        {
          name: '',
          disabled: true,
        },
      ],
      category: [],
      indexList: [],
      ids: [],
      showids: false,
      allChecked: false,
      cateshow: false,
      tabsIndex: 0,
      params: {
        pageNum: 1,
        pageSize: 5,
        productCategoryId: null,
      },
      total: 0, //总条数
    }
  },
  onLoad() {
    this.getList()
    this.getcategory()
  },
  methods: {
    // 打开分类
    openClass(item) {
      this.params.productCategoryId = item.id
      this.params.pageNum = 1
      this.getList()
      this.cateshow = false
    },
    handleAllChange(val) {
      let arr = JSON.parse(JSON.stringify(this.indexList))
      if (val) {
        // 全选
        this.ids = arr.map((r) => r.id)
        this.allChecked = true
        this.allUnchecked = false
      } else {
        // 全不选
        this.ids = []
        this.allChecked = false
        this.allUnchecked = true
      }
    },
    delChange() {
      console.log(this.ids)
      cancelcollection({ ids: this.ids }).then((res) => {
        this.ids = []
        this.params.pageNum = 1
        this.getList()
      })
    },
    checkboxChange() {},
    complay() {
      this.showids = !this.showids
    },
    // 筛选选的条件
    change(field) {
      // console.log('所选字段', field)
      // 在这里发送接口
      this.getPrdList(field.chooseMenu.id)
    },
    rightClick() {
      this.$tab.navigateBack()
    }, // 点击搜索按钮
    goto(url) {
      this.$tab.navigateTo(`${url}`)
    },
    searchActive(item, url, lable) {
      this.$tab.navigateTo(`${url}${item[lable]}`)
    },
    getList() {
      getcollection(this.params).then((res) => {
        this.indexList =
          this.params.pageNum === 1
            ? res.data.records
            : this.indexList.concat(res.data.records)
        this.total = res.data.total
      })
    },
    getcategory() {
      getcategory().then((res) => {
        this.category = res.data
      })
    },
    scrolltolower() {
      // 通过总条数算出总页数
      let pageNums = Math.ceil(this.total / this.params.pageSize)
      if (this.params.pageNum < pageNums) {
        this.params.pageNum = this.params.pageNum + 1
        // 再次调用商品界面数据
        this.getList()
      }
    },
    searchInfo(item) {
      uni.navigateTo({
        url: `/pages/common/storeDetails/index?exStoreId=${item.storeId}`,
      })
    },
    changeTabs(item) {
      this.tabsIndex = item.index
    },
  },
}
</script>

<style lang="scss" scoped>
.collecontent {
  position: relative;
  height: 100vh;
  overflow: hidden;
  background-color: #f8f9fb;
  .search {
    width: 100%;
    padding: 44px 14px 8px;
    line-height: 48px;
    display: flex;
    align-items: center;
    position: fixed;
    z-index: 1;
    background-color: #f8f9fb;
    .wid {
      flex: 0 0 100px;
      text-align: center;
    }
    .shouc {
      font-size: 20px;
      font-family: PingFangSC, PingFang SC;
      font-weight: 600;
      color: #363636;
      line-height: 20px;
    }
  }
  .type-list {
    position: fixed;
    top: 96px;
    width: 100%;
    min-height: 44px;
    z-index: 1;
    background-color: #f8f9fb;
    line-height: 18px;
    font-family: PingFangSC, PingFang SC;
    p {
      font-size: 18px;
      font-weight: 500;
      color: #363636;
    }
    span {
      margin-left: 30px;
      font-size: 14px;
      color: #767676;
    }
    .img {
      width: 14px;
      height: 14px;
      margin-left: 4px;
    }
  }
  .cbg {
    position: fixed;
    top: 140px;
    bottom: 0;
    z-index: 3;
    width: 100%;
    background: rgba(0, 0, 0, 0.1);
    .categorybox {
      height: 158px;
      background: #ffffff;
      border-radius: 18px;
      padding: 10px 6px;
      .citem {
        display: inline-block;
        width: 33.33%;
        margin: 10px 6px;
        height: 34px;
        background: #eff1f6;
        border-radius: 2px;
        font-size: 14px;
        font-family: PingFangSC, PingFang SC;
        font-weight: 400;
        color: #363636;
        line-height: 34px;
        text-align: center;
      }
    }
  }
  .list-Box {
    position: absolute;
    top: 140px;
    min-height: calc(100vh - 142px);
    width: 100%;
    padding: 16px 12px 60px;
    background: #fff;
    border-radius: 18px 18px 0px 0px;
    .list-container {
      padding-bottom: 12px;
      .list-head {
        .grow1 {
          padding: 4px 0;
        }
        .pic {
          width: 120px;
          height: 120px;
          flex: 0 0 120px;
          margin-right: 12px;
          border-radius: 5px;
        }
        .list-title {
          font-size: 15px;
          font-family: PingFangSC, PingFang SC;
          font-weight: 500;
          color: #363636;
          line-height: 24px;
        }
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
        .fool {
          p {
            padding: 0 10px;
            height: 24px;
            border-radius: 14px;
            border: 1px solid #b7b7b7;
            font-size: 12px;
            font-family: PingFangSC, PingFang SC;
            font-weight: 400;
            color: #767676;
            line-height: 24px;
          }
          .addcat {
            width: 28px;
            height: 28px;
            padding: 5px;
            border-radius: 25px;
            background: #ffe0de;
          }
        }
      }
    }
  }
  .btn-container {
    position: fixed;
    right: 0;
    left: 0;
    bottom: 0;
    padding: 0 14px;
    height: 56px;
    border-top: 1px solid #f0f0f0;
    background: #ffffff;
    p {
      width: 112px;
      height: 34px;
      background: #de3c31;
      border-radius: 20px;
      border: 1px solid #de3c31;
      font-size: 14px;
      font-family: PingFangSC, PingFang SC;
      font-weight: 500;
      color: #ffffff;
      line-height: 32px;
      text-align: center;
    }
  }
  .noclass {
    font-size: 14px;
    color: #767676;
    text-align: center;
    line-height: 138px;
  }
}
</style>