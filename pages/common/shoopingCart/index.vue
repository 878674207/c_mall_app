<template>
  <view class="shoopingCart">
    <view v-if="show">
      <view class="top">
        <view>
          <span class="spanOne">购物车</span>
          <span class="spanTwo">(5)</span>
        </view>
        <view class="manage">管理</view>
      </view>
      <view class="content" v-for="(item, index) in goods" :key="index">
        <view class="top">
          <u-checkbox-group>
            <u-checkbox v-model="checked" shape="circle"></u-checkbox>
          </u-checkbox-group>
          <view class="name">
            <span>店铺名称</span>
            <image class="img" :src="`${imgBasePath}/static/images/icons/icon-arrow-right.png`" style="height: 20px;width: 20px;" />
          </view>
        </view>
        <view class="footer">
          <u-checkbox-group>
            <u-checkbox v-model="checked" shape="circle"></u-checkbox>
          </u-checkbox-group>
          <image class="img" :src="`${imgBasePath}/static/images/icons/img-default.png`" style="height: 100px;width: 100px;" />
          <view class="text">
            <view class="top">
              <span class="one">雀巢（Nestle）怡养益护因子A2 β</span>
              <span class="two">礼盒装【850g2罐+玻璃杯】</span>
            </view>
            <view class="bootom">
              <view class="price">
                {{ item.price }}
                <span>.00</span>
              </view>
              <view class="right">
                <text class="subtract" @click="reduce(item)">-</text>
                <text class="num">{{ item.num }}</text>
                <text @click="add(item)" class="add">+</text>
              </view>
            </view>
          </view>
        </view>
      </view>
      <view class="end">
        <view class="end-left">
          <u-checkbox-group>
            <label>
              <u-checkbox v-model="checked" shape="circle" />全选
            </label>
          </u-checkbox-group>
          <view>
            总计：<text style="color: #f00;font-weight: bold;">￥ {{ }}</text>
          </view>
        </view>
        <view class="end-right">
          结算({{ }})
        </view>
      </view>
    </view>
    <view class="empty" v-else>
      <image src="https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fpic.51yuansu.com%2Fpic3%2Fcover%2F01%2F82%2F40%2F596fa6dc00bb4_610.jpg&refer=http%3A%2F%2Fpic.51yuansu.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1633499781&t=d37222e32213957ddbdd01d62e071309" mode="widthFix" style="width: 400rpx;"></image>
      <view class="empty-text">空空如也的购物</view>
      <view class="empty-button" @click="goshopping">去选购</view>
    </view>
  </view>
</template>
 
<script>
export default {
  data() {
    return {
      checked: null,
      show: true,
      goods: [
        {
          size: '女款-M',
          num: 1,
          flag: true,
          price: 149,
          goodsImage:
            'https://img0.baidu.com/it/u=4158246207,3235707994&fm=26&fmt=auto&gp=0.jpg',
        },
        {
          size: '女款-xs',
          num: 1,
          flag: true,
          price: 219,
          goodsImage:
            'https://img0.baidu.com/it/u=811765333,1656843554&fm=11&fmt=auto&gp=0.jpg',
        },
        {
          size: '女款-L',
          num: 1,
          flag: true,
          price: 240,
          goodsImage:
            'https://img1.baidu.com/it/u=233755383,2522308225&fm=26&fmt=auto&gp=0.jpg',
        },
        {
          size: '女款-XXL',
          num: 1,
          flag: true,
          price: 410,
          goodsImage:
            'https://img0.baidu.com/it/u=3894000947,2570065196&fm=26&fmt=auto&gp=0.jpg',
        },
        {
          size: '女款-XXL',
          num: 1,
          flag: true,
          price: 500,
          goodsImage:
            'https://img2.baidu.com/it/u=1001625387,3275765924&fm=26&fmt=auto&gp=0.jpg',
        },
      ],
    }
  },
  //页面初始化
  onLoad() {},
  methods: {
    reduce(item) {
      let num = item.num
      if (num > 1) {
        num -= 1
      } else if ((num = 1)) {
        uni.showToast({
          title: '该宝贝不能减少了哟~',
        })
      }
      item.num = num
    },
    add(item) {
      let num = item.num
      item.num = num + 1
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
  padding: 20px 0;
  display: flex;
  flex-direction: column;
  .top {
    display: flex;
    justify-content: space-between;
    padding-bottom: 20px;
    padding-left: 10px;
    padding-right: 20px;
    align-items: center;

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

  .content {
    width: 350px;
    background: #ffffff;
    border-radius: 8px;
    margin-left: 13px;
    padding: 10px 0;

    .top {
      display: flex;
      justify-content: start;
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

      .text {
        display: flex;
        flex-direction: column;

        .top {
          display: flex;
          flex-direction: column;

          .one {
            font-size: 14px;
            font-family: PingFangSC, PingFang SC;
            font-weight: 400;
            color: #363636;
          }

          .two {
            font-size: 14px;
            font-family: PingFangSC, PingFang SC;
            font-weight: 400;
            color: #767676;
          }
        }

        .bootom {
          display: flex;
          justify-content: space-between;
          padding: 0 20px;

          .price {
            font-size: 15px;
            font-family: PingFangSC, PingFang SC;
            font-weight: 600;
            color: #de3c31;

            span {
              font-size: 10px;
            }
          }
        }
      }
    }
  }

  .end {
    display: flex;

    // flex-direction: row;
    .end-left {
      display: flex;
    }

    .end-right {
      display: flex;
    }
  }
}
</style>