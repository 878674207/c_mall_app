<template>
  <view class="wl-bottom">
    常用地址
    <u-radio-group v-model="deliveryAddressId" placement="column" v-if="replist.length>0">
      <view class="wlbotitem flex-spb" v-for="(item,index) in replist" :key="index">
        <view>
          <view class="flex align-c">
            {{item.receiverName}}
            <span>{{item.receiverPhone}}</span>
            <span class="active" v-if="item.defaultAddress===1">默认</span>
          </view>
          <p>{{item.provinceLabel}}{{item.cityLabel}}{{item.regionLabel}}{{item.address}}</p>
        </view>
        <u-radio :name="item.id" @change="radioChange($event,item)" />
      </view>
    </u-radio-group>
    <u-empty mode="data" v-else :icon="`${imgBasePath}/static/images/icons/img-blank-order.png`" textSize="14" width="150" height="150" />
  </view>
</template>

<script>
export default {
  props: {
    replist: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      deliveryAddressId: null, //购物车参数
    }
  },
  methods: {
    // 单选 地址
    radioChange(e, item) {
      this.$emit('radioChange', e, item)
    },
  },
}
</script>


<style  scoped lang="scss">
.wl-bottom {
  height: 100%;
  overflow: auto;
  padding: 18px 0;
  font-size: 16px;
  font-family: PingFangSC, PingFang SC;
  font-weight: 500;
  color: #363636;
  line-height: 16px;
  .wlbotitem {
    padding: 12px;
    margin-top: 10px;
    background: #ffffff;
    border-radius: 4px;
    border: 1px solid #f0f0f0;
    font-size: 15px;
    font-family: PingFangSC, PingFang SC;
    font-weight: 500;
    color: #363636;
    line-height: 20px;
    span {
      font-weight: 400;
      margin-left: 6px;
    }
    .active {
      margin-left: 6px;
      padding: 0 8px;
      height: 18px;
      background: #fcd9d6;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 400;
      color: #de3c31;
      line-height: 18px;
    }
    p {
      padding-top: 10px;
      font-weight: 400;
      color: #767676;
      line-height: 20px;
    }
  }
}
</style>
