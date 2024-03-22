<template>
  <view class="askContainer">
    <!-- 搜索框 -->
    <view class="askTital">
      <u-icon name="arrow-left" size="20" color="#767676" @click="rightClick" class="arrow"></u-icon>
      <span class="askTitalTwo">问一问</span>
      <!-- <span>我的回答</span>  -->
      <image @click="MyAnswer" class="imgse" :src="`${imgBasePath}/static/images/icons/icon-myq&a.png`" style="width: 28px; height: 28px;" />
    </view>
    <view class="product" v-if="params">
      <image class="img" :src="params.pic" mode="aspectFill" :draggable="false" />
      <view class="productText">
        <span class="text">{{ params.description }}</span>
        <span class="textTwo">{{ params.productCategoryName }}</span>
      </view>
    </view>
    <view class="search">
      <!-- 在uni-app官网找的图标 -->
      <uni-icons type="search" size="20" color="#9F9F9F"></uni-icons>
      <input placeholder="搜索已有提问" type="text" v-model="keyword" @input="search()" />
    </view>
    <view class="askContent">
      <template v-if="records.length>0">
        <view class="contentItem" v-for="(item, index) in records" :key="index">
          <view class="itemOne">
            <image class="imgse" :src="`${imgBasePath}/static/images/icons/icon-question.png`" style="height:28px;width:28px;" />
            <span>{{ item.questionContent}}</span>
          </view>
          <view v-if="item.firstReply">
            <view class="itemTwo">
              <image class="imgse" :src="`${imgBasePath}/static/images/icons/icon-answer.png`" style="height:28px;width:28px;" />
              <span>{{ item.firstReply.replyContent}}</span>
              <span></span>
            </view>
            <span class="lastItem" @click="askDetile(item.id)">全部{{item.replyNumber}}条回答</span>
          </view>
          <view v-else @click="goAnswer(item.id)">
            <button>去回答</button>
          </view>
        </view>
      </template>
      <u-empty mode="data" v-else :icon="`${imgBasePath}/static/images/icons/img-blank-order.png`" textSize="14" width="150" height="150" />
      <view class="askFooter" @click="askQuestion()">
        <button class="lastBtn">
          <image class="imgse" :src="`${imgBasePath}/static/images/icons/icon-edit-red.png`" style="width: 25px; height: 25px;" />我要提问
        </button>
      </view>
    </view>
  </view>
</template>
<script>
import { getproductdetail } from '@/api/system/productsList.js'
import { askQuery } from '@/api/system/question.js'
export default {
  data() {
    return {
      keyword: '',
      paramsId: null,
      params: {},
      answer: true,
      records: [], //数据源
      // productId:null
    }
  },
  // 获取详情界面传递的id
  onLoad(event) {
    if (event.paramsId) {
      this.paramsId = event.paramsId
      this.getInfo()
      // this.getFocusProblem()
      this.askQuery()
    }
  },
  methods: {
    pageOnLoad() {
      this.askQuery()
    },
    // 返回按钮
    rightClick() {
      this.$tab.navigateBack()
    },
    //获取资讯信息
    getInfo() {
      getproductdetail(this.paramsId)
        .then((res) => {
          this.params = res.data
        })
        .finally((r) => {
          this.loading = false
        })
    },
    // 点击问一问详情
    askDetile(id) {
      this.$tab.navigateTo(
        `/pages/common/ask/askDetail?id=${id}&paramsId=${this.paramsId}`
      )
    },
    // 点击我要提问
    askQuestion() {
      this.$tab.navigateTo(
        `/pages/common/ask/askQuestion?paramsId=${this.paramsId}`
      )
    },
    // 点击我的回答进行跳转
    MyAnswer() {
      this.$tab.navigateTo(
        `/pages/common/ask/myAnswer?paramsId=${this.paramsId}`
      )
    },
    // 问一问分页查询
    askQuery() {
      let data = {
        productId: this.paramsId,
        questionContent: this.keyword || '',
      }
      askQuery(data).then((res) => {
        if (res.code == 200) {
          if (res.data && res.data.records) {
            this.records = res.data.records
          }
        }
      })
    },
    // 点击去回答
    goAnswer(id) {
      this.$tab.navigateTo(
        `/pages/common/ask/reply?questionId=${id}&paramsId=${this.paramsId}`
      )
    },
    // 搜索框搜索刷新
    search() {
      this.askQuery()
    },
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
  margin-bottom: 100px;

  .askTital {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 14px;
    padding-top: 30px;

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
    justify-content: start;
    height: 44px;
    margin-left: 14px;
    margin-top: 20px;
    margin-bottom: 12px;
    .img {
      width: 44px;
      height: 44px;
      border-radius: 8px;
    }
    .productText {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      margin-left: 12px;

      .textTwo {
        font-size: 15px;
        color: #8f8f8f;
      }

      .text {
        width: 280px;
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
  }
  .search {
    padding: 0 12px;
    margin: 0 14px;
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
    border-radius: 18px 18px 0px 0px;
    background-color: #fff;
    margin-top: 12px;
    padding: 14px 14px 114px;
    min-height: calc(100vh - 191px);
    .contentItem {
      height: auto;
      background-color: #fafbfd;
      border-radius: 8px;
      padding: 16px 12px;
      margin-bottom: 10px;
      .itemOne {
        display: flex;
        align-items: center;
        margin-bottom: 10px;
        span {
          padding-left: 14px;
          font-size: 15px;
          font-family: PingFangSC, PingFang SC;
          font-weight: 500;
          color: #363636;
          line-height: 24px;
        }
      }

      .itemTwo {
        display: flex;
        align-items: center;
        margin-bottom: 10px;

        span {
          padding-left: 14px;
          font-size: 15px;
          font-family: PingFangSC, PingFang SC;
          font-weight: 400;
          color: #767676;
          line-height: 24px;
        }
      }

      .lastItem {
        padding-left: 42px;
        color: #de3c31;
      }
      button {
        background-color: none;
        color: #de3c31;
        border: 1px solid #de3c31;
        border-radius: 20px;
        width: 30%;
        height: 30px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 15px;
        font-weight: 600;
        margin-left: 40px;
      }
    }
    .askFooter {
      position: fixed;
      right: 0;
      left: 0;
      bottom: 0;
      padding: 8px 12px 42px;
      background: #fff;
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
        margin: 0 auto;
      }
    }
  }
}
</style>