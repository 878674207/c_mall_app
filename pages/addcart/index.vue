<template>
  <view class="shoopingCart">
    <view class="cardContent">
      <view class="top navtop">
        <view>
          <span class="spanOne">购物车</span>
          <span class="spanTwo">(5)</span>
        </view>
        <view class="manage" @click="manageBtn" v-if="manageFlag">管理</view>
        <view class="manage" @click="complayBtn" v-else>完成</view>
      </view>
      <view v-if="shopList.length > 0" class="contentBox">
        <view class="content" v-for="(item, index) in shopList" :key="index">
          <view class="top" @click="searchActiveshop(item)">
            <u-checkbox-group @change="selectedShop(item)">
              <u-checkbox shape="circle" :checked="item.flag"></u-checkbox>
            </u-checkbox-group>
            <view class="name">
              <span>{{ item.storeName }}</span>
              <image class="img" :src="`${imgBasePath}/static/images/icons/icon-arrow-right.png`" style="height: 20px;width: 20px;" />
            </view>
          </view>
          <view class="footer" v-for="(itemChild, indexs) in item.basketItemList" :key="indexs">
            <u-checkbox-group @change="selected(item, indexs, itemChild)" :disabled="itemChild.expired == 1 && manageFlag">
              <u-checkbox shape="circle" :checked="itemChild.flag2"></u-checkbox>
            </u-checkbox-group>
            <image class="img" :src="itemChild.productPic" style="height: 76px;width: 76px;margin-left:4px" v-if="itemChild.productPic" @click="searchActive(itemChild)" />
            <image class="img" :src="`${imgBasePath}/static/images/icons/img-default.png`" style="height: 76px;width: 76px;margin-left:4px" v-else @click="searchActive(itemChild)" />
            <view class="text grow1 flex-spb">
              <view class="one" @click="searchActive(itemChild)">
                {{ itemChild.productName }}
                <span v-show="itemChild.expired == 1">已失效</span>
              </view>
              <view class="two" @click="searchActive(itemChild)">{{ setRule(itemChild.productAttr) }}</view>
              <view class="bootom">
                <view class="price" @click="searchActive(itemChild)">
                  <span><a>￥</a>{{ itemChild.price }}</span>
                </view>
                <view class="right">
                  <text class="subtract" @click="reduce(item, itemChild)">-</text>
                  <text class="num">{{ itemChild.quantity }}</text>
                  <text @click="add(item, itemChild)" class="add">+</text>
                </view>
              </view>
            </view>
          </view>
        </view>
        <view class="end flex-spb">
          <view class="end-left">
            <u-checkbox-group @change="selectgoods()">
              <label>
                <u-checkbox shape="circle" :checked="allchecked" />全选
              </label>
            </u-checkbox-group>
            <view class="selectNum" v-show="manageFlag">
              已选<text>{{ totalNum }}</text>件
            </view>
            <view v-show="manageFlag" class="totalText flex align-c">
              合计：<text style="color: #DE3C31;font-size:18px;font-weight: 600;"><span class="chat">￥</span> {{ totalPrice
                }}</text>
            </view>
          </view>
          <view class="end-right" v-if="manageFlag" @click="bagBtn">
            立即购买
          </view>
          <!-- <view class="end-right-else" v-else>
          <span class="collection">移入收藏夹</span>
          <span class="delete" @click="deleteShopCard">删除</span>
        </view> -->
          <view class="catBox flex" v-else>
            <view class="add" @click="collection">移入收藏夹</view>
            <view class="goto" @click="deleteShopCard">删除</view>
          </view>
        </view>
      </view>
      <view class="empty" v-else>
        <view class="emptyBox">
          <image class="img" :src="`${imgBasePath}/static/images/icons/img-blank-cart.png`" style="height: 180px;width: 180px;" />
          <view class="empty-text">购物车里空空如也~</view>
          <view class="empty-button" @click="goshopping">随便逛逛</view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import {
  getShopCardList,
  deleteShopCard,
  collectionInto,
} from '@/api/system/shopCard'
import { basketsave } from '@/api/system/productsList.js'
export default {
  data() {
    return {
      shopChecked: false,
      checked: false,
      // show: false,
      allchecked: false,
      shopList: [], //列表数据源
      numFlag: null, //加为true减为false
      manageFlag: true,
      params: {
        pageNum: 1,
        pageSize: 10,
      },
      basketIdList: [],
      shopIdList: [],
      selectedIdList: [],
      //购物车参数
      carParams: {
        productId: 2,
        productSkuId: 251,
        quantity: 4,
        // deliveryAddressId: null,
      },
    }
  },
  //页面初始化
  onShow() {
    this.getShopCardList()
  },
  computed: {
    totalPrice() {
      let totalPrice = 0
      this.shopList.forEach((element) => {
        element.basketItemList.forEach((item) => {
          item.flag2
            ? (totalPrice += item.quantity * item.price)
            : (totalPrice += 0)
        })
      })
      return totalPrice
    },
    totalNum() {
      let totalNum = 0
      this.shopList.forEach((element) => {
        element.basketItemList.forEach((item) => {
          item.flag2 ? (totalNum += Number(item.quantity)) : (totalNum += 0)
        })
      })
      return totalNum
    },
  },
  methods: {
    setRule(item) {
      let arr = JSON.parse(item)
      let str = ''
      arr.forEach((element) => {
        str += element.key + '【' + element.value + '】'
      })
      return str
    },
    // 减号
    reduce(item, itemChild) {
      this.numFlag = false
      let num = itemChild.quantity
      if (Number(num) > 1) {
        num = Number(num) - 1
        this.addCartNum(item, itemChild)
      } else if (num <= 1) {
        uni.showToast({
          title: '宝贝不能减少了',
        })
      }
      itemChild.quantity = num
    },
    // 加号
    add(item, itemChild) {
      this.numFlag = true
      let num = itemChild.quantity
      itemChild.quantity = Number(num) + 1
      this.addCartNum(item, itemChild)
    },
    selectedShop(item) {
      let h = this.shopIdList.some((r) => {
        return r == item.id //看有无一样的id 有一个则返回true 则不推送 一个都没有为false则推送
      })

      if (h) {
        // 如果是重复的话过滤掉之前点击的id
        this.shopIdList = this.shopIdList.filter((r) => {
          return r !== item.id //返回不相同的新数组
        })

        item.basketItemList.forEach((r) => {
          let id = r.id

          this.basketIdList = this.basketIdList.filter((r) => {
            return id !== r
          })
        })
      } else {
        // 如果不是重复的 添加当前点击的id
        this.shopIdList.push(item.id)
        item.basketItemList.forEach((r) => {
          this.basketIdList.push(r.id)
          // 这里剔除有问题
          let idList = null
          idList = r.expired == 1 ? r.id : null
          this.selectedIdList.push(idList)
        })
        let _that = this
        this.basketIdList = this.basketIdList.filter((r) => {
          return _that.selectedIdList.indexOf(r) <= -1
        })
      }
      item.flag = !item.flag
      // 如果点亮店铺的勾选框 对应店铺下面商品勾选都要亮
      if (item.flag) {
        // 如果点击了店铺的勾选框
        item.basketItemList.forEach((item) => {
          if (this.manageFlag) {
            if (this.selectedIdList.indexOf(item.id) <= -1) {
              // 没有匹配到 说明没有失效的
              item.flag2 = true
            } else {
              // 有匹配的 说明有失效的 要禁用一些
              item.flag2 = false
            }
            // 如果点击了管理
          } else {
            item.flag2 = true
          }
        })
      }
      if (!item.flag) {
        this.allchecked = false
        this.checked = false
        item.basketItemList.forEach((item) => {
          item.flag2 = false
        })
      } else {
        let a = this.shopList.every((item) => {
          return item.flag === true
        })
        if (a) {
          this.allchecked = true
        } else {
          this.allchecked = false
        }
      }
    },
    // 商品勾选框change事件
    selected(item, index, itemChild) {
      let h = this.basketIdList.some((item) => {
        return item == itemChild.id //看有无一样的id 有一个则返回true 则不推送 一个都没有为false则推送
      })
      if (h) {
        this.basketIdList = this.basketIdList.filter((item) => {
          return item !== itemChild.id
        })
      } else {
        this.basketIdList.push(itemChild.id)
      }
      //实现 每个商品勾选款和父级店铺勾选框的关系
      item.basketItemList[index].flag2 = !item.basketItemList[index].flag2
      let a = item.basketItemList.every((itemChild) => {
        return itemChild.flag2 == true
      })
      if (a) {
        item.flag = true
      } else {
        item.flag = false
      }
      //实现 每个商品勾选框和全选按钮的关系
      let c = []
      this.shopList.forEach((item) => {
        let b = item.basketItemList.map((itemChild) => {
          return itemChild.flag2
        })
        c.push(b)
      })
      let d = c.flat()
      let result = d.some((ele) => ele === false) //true
      if (result) {
        this.allchecked = false
      } else {
        this.allchecked = true
      }
    },
    // 店铺勾选框change事件
    selectgoods() {
      this.allchecked = !this.allchecked
      if (this.allchecked) {
        // console.log(this.shopList);
        this.shopList.forEach((item) => {
          item.basketItemList.forEach((item2) => {
            // 这里剔除有问题
            let idList = null
            idList = item2.expired == 1 ? item2.id : null
            this.selectedIdList.push(idList)
          })
        })
        // console.log(this.basketIdList);
        console.log(this.selectedIdList)
        this.shopList.map((item) => {
          item.flag = true //店铺全选
          item.basketItemList.map((item) => {
            item.flag2 = true
            this.basketIdList.push(item.id)
            if (this.manageFlag) {
              //如果是购买的状态
              if (this.selectedIdList.indexOf(item.id) <= -1) {
                // 没有匹配到 说明没有失效的
                item.flag2 = true
              } else {
                // 有匹配的 说明有失效的 要禁用一些
                item.flag2 = false
              }
              // 如果点击了管理
            } else {
              item.flag2 = true
            }
          }) //商品全选
        })
      } else {
        this.shopList.map((item) => {
          item.flag = false //店铺全选
          item.basketItemList.map((item) => {
            item.flag2 = false
            this.basketIdList = []
          }) //商品全选
        })
      }
    },
    // 我的购物车列表
    getShopCardList() {
      getShopCardList(this.params).then((res) => {
        if (res.code == 200) {
          if (res && res.data && res.data.records) {
            this.records = res.data.records
            let shopList = []
            res.data.records.forEach((item) => {
              shopList.push(item)
              item.flag = false
              if (item.basketItemList) {
                item.basketItemList.forEach((item2) => {
                  item2.flag2 = false
                })
              }
            })
            this.shopList = shopList
          }
        }
      })
    },
    //加减号接口
    addCartNum(item, itemChild) {
      // 模拟添加到购物车,请替换成你自己的添加到购物车逻辑
      let cartInfo = {
        storeId: item.storeId,
        storeName: item.storeName,
        productId: itemChild.productId,
        productSkuId: itemChild.productSkuId,
        quantity: this.numFlag ? 1 : -1,
      }
      basketsave(cartInfo).then((res) => {
        if (res.code == 200) {
          //  uni.$u.toast('操作成功~')
        }
      })
    },
    // 点击店铺跳转
    searchActiveshop(item) {
      this.$tab.navigateTo(
        `/pages/common/storeDetails/index?exStoreId=${item.storeId}`
      )
    },
    // 点击具体商品进行跳转
    searchActive(item) {
      uni.navigateTo({
        url: '/pages/productList/detail?id=' + item.productId,
      })
    },
    // 管理按钮
    manageBtn() {
      this.manageFlag = false
    },
    complayBtn() {
      this.manageFlag = true
    },
    //删除购物车指定商品接口
    deleteShopCard() {
      if (this.basketIdList.length > 0) {
        let data = {
          basketItemIds: this.basketIdList || [],
        }
        deleteShopCard(data).then((res) => {
          if (res.code == 200) {
            uni.$u.toast('已删除')
            this.getShopCardList()
          }
        })
      } else {
        uni.$u.toast('请选择要删除的商品')
      }
    },
    // 点击立即购买
    bagBtn() {
      if (this.basketIdList.length <= 0) {
        uni.$u.toast('请选择要购买的商品')
      } else {
        // 这里需要跳转订单连接
        let list = this.shopList
          .filter((r) => r.basketItemList.filter((r) => r.flag2).length > 0)
          .map((r) => {
            return {
              basketId: r.id,
              basketItemIds: r.basketItemList
                .filter((r) => r.flag2)
                .map((r) => r.id),
            }
          })
        this.$tab.navigateTo(
          `/pages/productList/creadOrder?listParams=${JSON.stringify(list)}`
        )
      }
    },
    // 点击移入收藏夹
    collection() {
      // 跳转路径
      if (this.basketIdList.length <= 0) {
        uni.$u.toast('请选择要收藏的商品')
      } else {
        let data = {
          basketItemIds: this.basketIdList || [],
        }
        collectionInto(data).then((res) => {
          if (res.code == 200) {
            uni.$u.toast('收藏成功')
          }
        })
        // 这里需要跳转收藏连接（这里跳转有问题）
        this.$tab.switchTab(`/pages/mine/collection/index`)
      }
    },
    // 点击随便逛逛
    goshopping() {
      // 跳转路径(这里应该跳转到哪里)
      this.$tab.switchTab(`/pages/classification/index`)
    },
  },
}
</script>

<style scoped lang="scss">
* {
  margin: 0;
  padding: 0;
}

.shoopingCart {
  display: flex;
  flex-direction: column;
  background: #f9fafd;
  padding-bottom: 48px;
  height: 100vh;

  .cardContent {
    margin-bottom: 50px;

    .grow1 {
      padding: 5px 12px 0px 8px;

      .one {
        font-size: 14px;
        font-family: PingFangSC, PingFang SC;
        font-weight: 400;
        color: #363636;
        display: flex;
        justify-content: space-between;

        span {
          display: inline-block;
          // border: 1px solid red;
          color: #f44545;
          border-radius: 7px;
          font-size: 10px;
          display: flex;
          justify-content: center;
          align-items: center;
        }
      }

      .two {
        font-size: 14px;
        font-family: PingFangSC, PingFang SC;
        font-weight: 400;
        color: #767676;
      }

      .price {
        font-size: 10px;
        font-family: PingFangSC, PingFang SC;
        font-weight: 550;
        color: #de3c31;

        a {
          font-size: 8px;
        }

        span {
          font-size: 18px;
        }
      }
    }

    .navtop {
      position: sticky;
      top: 0;
      padding: 54px 14px 14px 24px;
      background: #f9fafd;
      z-index: 6;
    }

    .top {
      display: flex;
      justify-content: space-between;

      .spanOne {
        font-size: 20px;
        font-family: PingFangSC, PingFang SC;
        font-weight: 600;
        color: #363636;
      }

      .spanTwo {
        font-size: 12px;
        font-family: PingFangSC, PingFang SC;
        font-weight: 400;
        color: #363636;
      }

      .manage {
        font-size: 15px;
        font-family: PingFangSC, PingFang SC;
        font-weight: 400;
        color: #363636;
      }
    }

    .contentBox {
      padding: 0 14px 100px;
      background-color: #f9fafd;

      .content {
        background-color: #fff;
        border-radius: 8px;
        padding: 16px 0;
        margin-bottom: 10px;

        .top {
          display: flex;
          justify-content: start;
          padding-left: 10px;
          font-size: 16px;
          font-family: PingFangSC, PingFang SC;
          font-weight: 600;
          color: #363636;

          .name {
            display: flex;
            align-items: center;
            margin-left: 10px;

            span {
              margin-right: 10px;
            }
          }
        }

        .footer {
          display: flex;
          padding-left: 10px;
          padding-top: 12px;

          .text {
            display: flex;
            flex-direction: column;

            .top {
              display: flex;
              flex-direction: column;

              .top-text {
                display: flex;
                flex-direction: column;
              }
            }

            .bootom {
              display: flex;
              justify-content: space-between;

              .right {
                .subtract {
                  display: inline-block;
                  text-align: center;
                  width: 24px;
                  height: 24px;
                  line-height: 1.5;
                  background: #f8f8f8;
                  border-radius: 50%;
                  color: #b7b7b7;
                  margin-right: 10px;
                }

                .add {
                  display: inline-block;
                  text-align: center;
                  width: 24px;
                  height: 24px;
                  line-height: 1.5;
                  background: #f8f8f8;
                  border-radius: 50%;
                  margin-left: 10px;
                }
              }
            }
          }
        }
      }
    }
  }

  /*  #ifdef  APP-PLUS	  */
  .end {
    width: 100%;
    height: 56px;
    background-color: #fff;
    position: fixed;
    bottom: 0;
    left: 0;
    display: flex;
    align-items: center;
    padding: 20px 0 !important;
    border-top: 1px solid #f0f0f0;
    border-bottom: 1px solid #f0f0f0;
    padding-right: 12px !important;
  }

  /*  #endif  */
  /*  #ifdef  H5	  */
  .end {
    width: 100%;
    height: 56px;
    background-color: #fff;
    position: fixed;
    bottom: 50px;
    left: 0;
    display: flex;
    align-items: center;
    padding: 20px 0 !important;
    border-top: 1px solid #f0f0f0;
    border-bottom: 1px solid #f0f0f0;
    padding-right: 12px !important;
  }

  /*  #endif  */

  .end {
    ::v-deep .uni-label-pointer {
      display: flex;
    }

    &-left {
      display: flex;
      justify-content: space-between;
      // padding: 0 10px;
      padding-left: 10px;
    }

    &-right {
      line-height: 90rpx;
      background-color: #f44545;
      text-align: center;
      color: #fff;
    }

    .end-left {
      display: flex;
      align-items: center;
      justify-content: start;

      .selectNum {
        width: 70px;
        margin-right: 5px;
        margin-left: 12px;
        color: #363636;
      }

      .totalText {
        width: 110px;
        font-size: 12px;
      }

      .chat {
        font-size: 9px;
      }
    }

    .end-right {
      border-radius: 20px;
      width: 112px;
      height: 40px;
      background: #de3c31;
      border-radius: 20px;
      border: 1px solid #de3c31;
      display: flex;
      align-items: center;
      justify-content: center;
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
      margin-left: 75px;

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

  .empty {
    height: 480px;
    background-color: #f9fafd;
    display: flex;
    justify-content: center;
    align-items: center;

    .emptyBox {
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
    }

    .empty-text {
      margin-top: 20px;
      font-size: 15px;
      font-family: PingFangSC, PingFang SC;
      font-weight: 400;
      color: #363636;
    }

    .empty-button {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-top: 20px;
      width: 154px;
      height: 44px;
      background: #fff5f4;
      border-radius: 22px;
      border: 1px solid #de3c31;
      font-size: 16px;
      font-family: PingFangSC, PingFang SC;
      font-weight: 500;
      color: #de3c31;
    }
  }
}
</style>