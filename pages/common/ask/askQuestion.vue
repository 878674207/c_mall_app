<template>
  <view class="askContainer">
    <!-- 搜索框 -->
    <view class="askTital">
      <u-icon name="arrow-left" size="20" color="#767676" @click="rightClick" class="arrow"></u-icon>
      <span class="askTitalTwo">提问题</span>
      <!-- <span>我的回答</span>  -->
      <image class="imgse" @click="MyAnswer" :src="`${imgBasePath}/static/images/icons/icon-myq&a.png`"
        style="width: 28px; height: 28px;" />
    </view>
    <view class="product flex align-c" v-if="params">
      <image :src="params.pic" mode="aspectFill" :draggable="false" class="img"></image>
      <view class="productText">
        {{ params.description }}
      </view>
    </view>
    <view class="askContent">
      <view class="contentItem">
        <u--textarea v-model="text" border="none" placeholder="请提出您的问题，已购买的人会替你解答"></u--textarea>
        <u-radio-group class="checkBox" @change="selected">
          <u-radio name="1" :checked="activeChecked">
            匿名提问
          </u-radio>
        </u-radio-group>
      </view>
      <view class="btnBox">
        <button @click="saveMyQuestion">发布问题</button>
      </view>
    </view>
  </view>
</template>
<script>
import { getproductdetail } from '@/api/system/productsList.js'
import { saveMyQuestion } from '@/api/system/question.js'
export default {
  data() {
    return {
      keyword: '',
      id: null,
      params: {},
      paramsId: null,
      answer: true,
      activeChecked: false,
      isAnonymous: 0,//是否匿名
      text: null,
    }
  },
  // 获取详情界面传递的id
  onLoad(event) {
    if (event) {
      console.log(event.paramsId);
      this.paramsId = event.paramsId
      this.getInfo()
    }
  },
  methods: {
    // 返回按钮
    rightClick() {
      this.$tab.navigateBack()
    },
    // 点击我的
    MyAnswer() {
      this.$tab.navigateTo(`/pages/common/ask/myAnswer?paramsId=${this.paramsId}`)
    },
    //获取资讯信息
    getInfo() {
      getproductdetail(this.paramsId)
        .then((res) => {
          this.params = res.data
          console.log(this.params)
        })
        .finally((r) => {
          this.loading = false
        })
    },
    // 点击问一问详情
    askDetile() {
      this.$tab.navigateTo(`/pages/common/ask/askDetail?id=${this.id}`)
    },
    // 点击我要提问
    askQuestion() {
      this.$tab.navigateTo(`/pages/common/ask/askQuestion`)
    },
    // 点击匿名
    selected() {
      this.activeChecked = !this.activeChecked
      if (this.activeChecked) {
        this.isAnonymous = '1'
      } else {
        this.isAnonymous = '0'
      }
    },
    // 发布问题按钮(保存提问)
    saveMyQuestion() {
      if (!this.text) {
        uni.$u.toast('请输入提问内容')
      } else {
        let data = {
          isAnonymous: this.isAnonymous,
          productId: this.paramsId,
          questionContent: this.text
        }
        saveMyQuestion(data).then(res => {
          if (res.code == 200) {
            uni.$u.toast('发布成功')
            this.text = null
            const pages = getCurrentPages()
            console.log(pages[pages.length - 2])
            uni.navigateBack({
              delta: 1,
              success() {
                //  加这个是为了 刷新页面  调用pageOnLoad方法
                pages[pages.length - 2].$vm.pageOnLoad()
              },
            })
          }
        })
      }
    }
  },
}
</script>
<style scoped lang="scss">
* {
  margin: 0;
  padding: 0;
}

.askContainer {
  background-color: #f4f5f9;
  height: 100vh;
  padding-top: 30px;

  .askTital {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 20px;

    .askTitalTwo {
      font-size: 20px;
      font-family: PingFangSC, PingFang SC;
      font-weight: 700;
      color: black;
      line-height: 20px;
      // margin-left: 50px;
    }

    image {
      margin-top: 10px;
    }
  }

  .product {
    display: flex;
    height: 50px;
    margin-left: 20px;
    margin-top: 20px;
    border-radius: 10px;
    overflow: hidden;
    margin-bottom: 15px;

    .img {
      width: 44px;
      height: 44px;
      border-radius: 8px;
    }

    .productText {
      margin-left: 12px;
      font-size: 18px;
      font-family: PingFangSC, PingFang SC;
      font-weight: 500;
      color: #363636;
      line-height: 18px;
      overflow: hidden; //超出的文本隐藏
      text-overflow: ellipsis; //溢出用省略号显示
      white-space: nowrap; //溢出不换行
    }
  }

  .search {
    padding: 0 12px;
    width: 90%;
    margin-left: 18px;
    height: 34px;
    border-radius: 17px;
    display: flex;
    align-items: center;
    box-sizing: border-box;
    background: #ffffff;

    input {
      font-size: 14px;
      font-family: PingFangSC, PingFang SC;
      font-weight: 400;
      color: #c0c0c0;
      line-height: 20px;
      margin-left: 6px;
    }
  }

  .askContent {
    min-height: calc(100vh - 153px);
    width: 100%;
    border-radius: 18px 18px 0px 0px;
    background-color: #fff;
    margin-top: 14px;
    padding: 16px 12px;

    .btnBox {
      button {
        display: inline-block;
        background-color: #de3c31;
        color: #ffffff;
        // border: 1px solid #DE3C31;
        border-radius: 20px;
        width: 90%;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 15px;
        font-weight: 600;
        margin-right: 50px;
        margin-left: 10px;
        // margin-top: 20px;
      }
    }

    .contentItem {
      height: 400px;
      color: #b7b7b7;
      position: relative;

      .checkBox {
        position: absolute;
        bottom: 30px;
        left: 10px;
      }
    }

    .askFooter {
      display: flex;
      justify-content: center;
      width: 85%;
      margin-top: 15px;
      height: 100px;

      image {
        margin-right: 10px;
      }

      .lastBtn {
        background-color: #fff5f4;
        color: #de3c31;
        border: 1px solid #de3c31;
        border-radius: 20px;
        width: 50%;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 15px;
        font-weight: 600;
        margin-left: 40px;
      }
    }
  }
}</style>