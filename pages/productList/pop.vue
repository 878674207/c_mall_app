<template>
  <u-popup :show="show" :round="18" mode="bottom" @close="close" @touchmove.stop.prevent="stopRoll">
    <view class="popcontent">
      <p>{{title}}</p>
      <view class="pform">
        <slot name="content"></slot>
      </view>
      <view class="pbuttom">
        <slot name="bottom">
          <button type="primary" class="buts" @click="close()">
            我知道了
          </button>
        </slot>

      </view>
    </view>
  </u-popup>
</template>
<script>
export default {
  props: {
    // pop标题
    title: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      show: false,
    }
  },
  methods: {
    stopRoll() {
      console.log('阻止滑动')
    },
    close() {
      this.show = !this.show
    },
  },
}
</script>
<style  scoped lang="scss">
.popcontent {
  // height: 628px;
  padding-bottom: 110px;
  p {
    padding: 21px 24px;
    font-size: 18px;
    font-family: PingFangSC, PingFang SC;
    font-weight: 500;
    color: #363636;
    line-height: 18px;
  }
  .pform {
    padding: 0 14px;
  }
  .pbuttom {
    position: fixed;
    right: 0;
    left: 0;
    bottom: 34px;
    border-top: 1px solid #f0f0f0;
    .buts {
      margin: 8px 12px;
      height: 40px;
      background: #ffffff;
      border-radius: 20px;
      border: 1px solid #de3c31;
      font-size: 16px;
      font-family: PingFangSC, PingFang SC;
      font-weight: 500;
      color: #de3c31;
      line-height: 38px;
    }
  }
}
</style>
