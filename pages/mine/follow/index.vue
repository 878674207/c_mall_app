<template>
  <view class="container">
    <!-- <view>
      <u-navbar
        :safeAreaInsetTop="false"
        title="关注店铺"
        :fixed="false"
        bgColor="#F1F1F1"
        :rightIcon="`${imgBasePath}/static/images/icons/icon-search.png`"
        right-text="管理"
        :autoBack="true"
      >
      </u-navbar>
    </view> -->
    <view class="search flex-spb align-c">
      <view class="wid">
        <u-icon name="arrow-left" size="20" color="#767676" @click="rightClick"></u-icon>
      </view>
      <p class="wid shouc">关注店铺</p>
      <view class="flex-end align-c wid">
        <u-icon name="search" size="24" @click="goto('/pages/classification/search?type=follow')"></u-icon>
        <p @click="complay" style="margin-left: 10px">管理</p>
      </view>
    </view>
    <view class="u-demo-block">
      <view class="u-demo-block__content">
        <u-tabs :list="list6" :scrollable="false" lineWidth="30" lineColor="#f56c6c" :activeStyle="{
            color: '#363636',
            fontWeight: 'bold',
            transform: 'scale(1.05)',
            fontSize: '18px',
          }" :inactiveStyle="{
            color: '#767676',
            transform: 'scale(1)',
            fontSize: '16px',
          }" itemStyle="padding-left: 15px; padding-right: 15px; height: 34px;" @click="changeTabs">
          <!-- <view
            slot="right"
            style="padding-left: 4px; margin-right: 20px"
            @tap="$u.toast('插槽被点击')"
          >
            <u--text
              :suffixIcon="`${imgBasePath}/static/images/icons/icon-screen.png`"
              iconStyle="font-size: 14px"
              text="筛选"
              size="14px"
              lineHeight="18px"
              color="#767676"
            ></u--text>
          </view> -->
        </u-tabs>
      </view>
    </view>
    <view class="interest-list" v-if="tabsIndex === 0">
      <u-empty :icon="`${imgBasePath}/static/images/icons/img-blank-shop.png`" text="还没有关注的店铺" textSize="15px" textColor="#363636" v-if="!indexList.length">
        <u-button size="normal" type="error" :style="{ marginTop: 24 + 'px' }" text="随便逛逛" plain>
        </u-button>
      </u-empty>
      <view>
        <u-checkbox-group v-model="ids" placement="column" @change="checkboxChange">
          <u-list @scrolltolower="scrolltolower">
            <u-list-item v-for="(item, index) in indexList" :key="index">
              <u-checkbox v-if="showids" shape="circle" size="18" activeColor="#DE3C31" :customStyle="{ marginRight: '8px' }" :name="item.id">
              </u-checkbox>
              <u-cell :title="item.storeName" :label="item.createTime" center :border="false">
                <view slot="value" class="u-slot-value">
                  <u-button size="small" type="error" text="去逛逛" shape="circle" plain @click="searchInfo(item)"></u-button>
                </view>
                <u-avatar slot="icon" shape="square" size="44" :src="
                    item.storeLogo
                      ? item.storeLogo
                      : `${imgBasePath}/jpg/2024/1/22/ce765796-448d-49e5-a299-23729a6afd3e.jpg`
                  " customStyle="margin: -3px 5px -3px 0"></u-avatar>
              </u-cell>
            </u-list-item>
          </u-list>
        </u-checkbox-group>
        <view class="cate-right" v-if="indexList.length<=0">
          <u-empty :icon="`${imgBasePath}/static/images/icons/img-blank-shop.png`" text="还没有关注的店铺" textSize="15px" textColor="#363636">
            <u-button size="normal" type="error" :style="{ marginTop: 24 + 'px' }" text="随便逛逛" @click="goshopping" plain>
            </u-button>
          </u-empty>

        </view>
        <view v-if="showids" class="btn-container flex-spb align-c">
          <u-checkbox shape="circle" size="18" activeColor="#DE3C31" v-model="allChecked" label="全选" @change="handleAllChange">
          </u-checkbox>
          <p @click="delChange">取消关注</p>
        </view>
      </view>
    </view>
    <!-- <view class="interest-list" v-if="tabsIndex === 1">
      <view class="u-list">
        <u-collapse
          @change="change"
          @close="close"
          @open="open"
          :border="false"
        >
          <u-collapse-item title="组件全面">
            <u-icon name="tags-fill" size="20" slot="icon"></u-icon>
            <text class="u-collapse-content"
              >众多组件覆盖开发过程的各个需求，组件功能丰富，多端兼容。让您快速集成，开箱即用</text
            >
          </u-collapse-item>
          <u-collapse-item title="组件全面">
            <u-icon name="tags-fill" size="20" slot="icon"></u-icon>
            <text class="u-collapse-content"
              >众多组件覆盖开发过程的各个需求，组件功能丰富，多端兼容。让您快速集成，开箱即用</text
            >
          </u-collapse-item>
          <u-collapse-item title="组件全面">
            <u-icon name="tags-fill" size="20" slot="icon"></u-icon>
            <text class="u-collapse-content"
              >众多组件覆盖开发过程的各个需求，组件功能丰富，多端兼容。让您快速集成，开箱即用</text
            >
          </u-collapse-item>
        </u-collapse>
      </view>
    </view> -->
  </view>
</template>

<script>
import { getList, delList } from '@/api/system/follow.js'
export default {
  data() {
    return {
      list6: [
        {
          name: '全部关注',
        },
        {
          name: '',
          disabled: true,
        },
        {
          name: '',
          disabled: true,
        },
      ],
      indexList: [],
      tabsIndex: 0,
      params: {
        pageNum: 1,
        pageSize: 10,
      },
      total: 0,
      showids: false,
      ids: [],
      allChecked: false,
      allUnchecked: true,
    }
  },
  onLoad() {
    // this.loadmore();
    this.getList()
  },
  methods: {
    // 点击随便逛逛
    goshopping() {
      // 跳转路径(这里应该跳转到哪里)
      this.$tab.switchTab(`/pages/classification/index`)
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
      delList(this.ids).then((res) => {
        this.ids = []
        this.params.pageNum = 1
        this.getList()
      })
    },
    getList() {
      getList(this.params).then((res) => {
        this.indexList =
          this.params.pageNum === 1
            ? res.data.records
            : this.indexList.concat(res.data.records)
        this.total = res.data.total
      })
    },
    checkboxChange() {},
    searchInfo(item) {
      uni.navigateTo({
        url: '/pages/common/storeDetails/index?exStoreId=' + item.storeId,
      })
    },
    changeTabs(item) {
      this.tabsIndex = item.index
    },
    open(e) {
      // console.log('open', e)
    },
    close(e) {
      // console.log('close', e)
    },
    change(e) {
      // console.log('change', e)
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
    goto(url) {
      this.$tab.navigateTo(`${url}`)
    },
    complay() {
      this.showids = !this.showids
    },
    rightClick() {
      this.$tab.navigateBack()
    },
  },
}
</script>

<style lang="scss" scoped>
.container {
  background-color: #f8f9fb;
  .search {
    width: 100%;
    padding: 48px 14px 8px;
    line-height: 48px;
    display: flex;
    align-items: center;
    position: fixed;
    z-index: 3;
    background-color: #f1f1f1;
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
  .u-demo-block {
    padding-top: 13px;
    position: fixed;
    padding-bottom: 10px;
    top: 94px;
    width: 100%;
    z-index: 3;
    background-color: #f1f1f1;
  }
  .interest-list {
    width: 100%;
    height: 100%;
    // height: 100vh;
    // border-radius: 18px 18px 0px 0px;
    .u-empty {
      height: 100%;
    }
    .u-list {
      position: absolute;
      top: 150px;
      min-height: calc(100vh - 142px);
      border-radius: 18px 18px 0px 0px;
      background-color: #ffffff;
      padding: 16px 12px 60px;
      .u-list-item {
        display: flex;
        flex-direction: row;
        // justify-content: space-around;
        .u-cell {
          flex: 1;
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
  }
}
</style>