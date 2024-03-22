<template>
  <view class="askContainer">
    <!-- 搜索框 -->
    <view class="askTital">
      <u-icon name="arrow-left" size="20" color="#767676" @click="rightClick" class="arrow"></u-icon>
      <span class="askTitalTwo">问题详情</span>
      <!-- <span>我的回答</span>  -->
      <!-- <image class="imgse" :src="`${imgBasePath}/static/images/icons/icon-myq&a.png`" style="width: 28px; height: 28px;" /> -->
    </view>
    <!-- 如果这里无 params 该如何展示-->
    <view class="product" v-if="params">
      <image :src="params.pic" mode="aspectFill" :draggable="false" class="img"></image>
      <view class="productText">
        <span class="text">{{ params.description }}</span>
        <span class="textTwo">{{ params.productCategoryName }}</span>
      </view>
    </view>
    <view class="askContent">
      <view class="contentItem">
        <view class="itemOne" v-if="questionList">
          <image class="imgse" :src="`${imgBasePath}/static/images/icons/icon-question.png`"
            style="height: 30px;width: 30px;" />
          <view class="imageBox">

            <image class="userHead" :src="questionList.userInfo.avatarUrl" style="height: 38px;width: 38px;"></image>
          </view>
          <view class="reight">
            <span>{{ questionList.userInfo.nickname }}</span>
            <span class="reightTwo">{{ questionList.questionContent }}</span>
            <span class="reightThree"></span>
          </view>
          <button @click="focusBtn(questionList.id)" v-if="showButton">关注问题</button>
          <button @click="noFocusBtn(questionList.id)" class="concer" v-else>已关注</button>
        </view>
      </view>
      <!-- 显示答的条数-->
      <view class="contentItemTwo">
        <image class="imgse" :src="`${imgBasePath}/static/images/icons/icon-answer.png`"
          style="height: 30px;width: 30px;" />
        <span>共{{ total }}条回答</span>
      </view>
      <!-- 下面为答 -->
      <view class="contentItemthree" v-for="(item, index) in records" :key=index>
        <view class="imageBox">

          <image class="userHead" :src="item.replyUserInfo.avatarUrl" style="height: 30px;width: 30px;"></image>
        </view>
        <view class="reight">
          <view class="top">
            <span class="one">{{ item.replyUserInfo.nickname }}</span>
            <span class="two">已购礼盒装【585g两罐+玻璃杯】</span>
          </view>
          <view class="footer">
            <span class="one">
              {{ item.replyContent }}
            </span>
            <view class="two">
              <span>{{ item.replyUserInfo.createdAt }}</span>
              <span @click="likeBtn(item.id,item.isLike)">
                <image class="imgse" :src="`${imgBasePath}/static/images/icons/icon-heart-fill.png`"
                  style="width: 10px;height: 10px;" v-show="item.isLike==1"/>
                <image class="imgse" :src="`${imgBasePath}/static/images/icons/icon-heart.png`"
                  style="width: 10px;height: 10px;" v-show="item.isLike==0"/>
              </span>
            </view>
          </view>
        </view>
      </view>
      <view class="btnBox">
        <span @click="saveMyQuestion">去回答</span>
      </view>
    </view>
  </view>
</template>
<script>
import { getproductdetail } from '@/api/system/productsList.js'
import { getFocusProblem, getnoFocusProblem, unLikeComments, likeComments, replaceList, selectByQuestionId } from '@/api/system/question.js'
export default {
  data() {
    return {
      keyword: '',
      id: null,
      params: {},
      like: false, //是否点赞标志位
      showButton: null,
      pageSize: 10,
      pageNum: 1,
      records: [],
      paramsId: null,
      total: null,
      questionList: null
    }
  },
  // 获取详情界面传递的id
  onLoad(event) {
    if (event) {
      this.id = event.id//这个id是点击详情传过来的后端的id
      this.paramsId = event.paramsId//这个是头部头像需要的id  
      this.getInfo()
      this.selectByQuestionId(event.id)
      this.replaceList()
    }
  },
  // mounted(){
  //   this.replaceList()
  // },
  methods: {
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
    // 列表查询
    replaceList() {
      let data = {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        questionId: this.id
      }
      replaceList(data).then(res => {
        if (res.code == 200) {
          if (res.data && res.data.records) {
            this.records = res.data.records
            this.total = res.data.total
            // res.data.records.forEach(item => {
            //   // this.like = item.isLike == 1 ? true : false
            // });
          }
        }
      })
    },
    // 点击问一问详情
    askDetile() {
      this.$tab.navigateTo(`/pages/common/ask/askDetail`)
    },
    // 点赞和取消小红心
    likeBtn(id,like) {
      // this.like = !this.like
      if (like==0) {
        // 如果like变为true则点赞 发接口
        this.likeComments(id)
      } else {
        // 如果点击后 like为false 则取消点赞 发接口
        this.unLikeComments(id)
      }
    },
    // 点击关注问题
    focusBtn(id) {
      this.showButton = false
      getFocusProblem(id).then(res => {
        console.log(res);
      })
    },
    // 取消关注
    noFocusBtn(id) {
      this.showButton = true
      getnoFocusProblem(id).then(res => {
        if (res.code == 200) {

        }
      })
    },
    // 点赞评论
    likeComments(id) {
      likeComments(id).then(res => {
        console.log(res);
        this.replaceList()
      })
    },
    // 取消点赞评论
    unLikeComments(id) {
      unLikeComments(id).then(res => {
        console.log(res);
        this.replaceList()
      })
    },
    // 根据questionId查询提问信息
    selectByQuestionId(id) {
      selectByQuestionId(id).then(res => {
        if (res.code == 200) {
          if (res && res.data) {
            this.questionList = res.data
            if (res.data.isCare) {
              //得到关注的状态
              this.showButton = res.data.isCare == 0 ? true : false
            }
          }
        }
      })
    },
    // 去回答
    saveMyQuestion() {
      this.$tab.navigateTo(`/pages/common/ask/reply?questionId=${this.questionList.id}&paramsId=${this.paramsId}`)
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
      margin-right: 120px;
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
    margin-left: 14px;
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
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      margin-left: 10px;

      .textTwo {
        font-size: 15px;
        color: #8f8f8f;
      }

      .text {
        display: block;
        width: 280px;
        font-weight: 700;
        font-size: 18px;
        overflow: hidden; //超出的文本隐藏
        text-overflow: ellipsis; //溢出用省略号显示
        white-space: nowrap; //溢出不换行
      }
    }
  }

  .askContent {
    position: relative;
    min-height: calc(100vh - 148px);
    border-radius: 18px 18px 0px 0px;
    background-color: #fff;
    margin-top: 14px;
    padding: 14px;

    .contentItem {
      background-color: #fafbfd;
      border-radius: 8px;
      padding: 15px 20px;
      margin-top: 10px;

      .itemOne {
        display: flex;
        width: 100%;
        position: relative;

        .imgse {
          position: absolute;
          top: -25px;
          left: -25px;
        }

        button {
          margin-left: 80px;
        }

        .reight {
          margin-left: 12px;
          display: flex;
          flex-direction: column;

          span {
            color: #363636;
            font-weight: 500;
            font-size: 13px;
            margin-top: 10px;
          }

          span.reightTwo {
            font-size: 15px;
            font-weight: 700;
          }

          span.reightThree {
            font-size: 11px;
            font-weight: 500;
            color: #767676;
          }
        }
      }

      .itemTwo {
        display: flex;
        align-items: center;
        margin-bottom: 10px;

        span {
          width: 80%;
          padding-left: 20px;
          color: #8d8d8e;
          font-size: 15px;
        }
      }

      .lastItem {
        padding-left: 50px;
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

    .contentItemTwo {
      margin-top: 20px;
      display: flex;
      align-items: center;

      span {
        margin-left: 15px;
        color: #767676;
      }
    }

    .contentItemthree {
      margin-top: 20px;
      display: flex;
      justify-content: start;

      .reight {
        display: flex;
        flex-direction: column;
        padding-left: 15px;
        width: 84%;

        .top {
          display: flex;
          flex-direction: column;
        }

        .top .one {
          font-weight: 600;
        }

        .top .two {
          font-weight: 600;
          color: #7f7f7f;
        }

        .footer {
          margin-top: 10px;
          background-color: #fafbfd;
          height: auto;
          width: 100%;
          border-radius: 10px;
          display: flex;
          flex-direction: column;
          padding: 15px 12px;

          .one {
            font-weight: 700;
            color: #696969;
            font-size: 14px;
            margin-bottom: 10px;
          }

          .two {
            display: flex;
            justify-content: space-between;
            font-size: 11px;
            color: #7c7c7c;
          }
        }
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

    .btnBox {
      display: flex;
      justify-content: center;
      align-items: center;
      margin-top: 20px;
      width: 60%;
      height: 44px;
      background: #FFF5F4;
      border-radius: 22px;
      border: 1px solid #DE3C31;
      font-size: 16px;
      font-family: PingFangSC, PingFang SC;
      font-weight: 500;
      color: #DE3C31;
      margin-left: 60px;
    }
  }
}
</style>