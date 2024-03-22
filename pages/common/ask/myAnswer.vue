<template>
  <view class="askContainer">
    <!-- 搜索框 -->
    <view class="askTital">
      <u-icon name="arrow-left" size="20" color="#767676" @click="rightClick" class="arrow"></u-icon>
      <span class="askTitalTwo">我的回答</span>
    </view>
    <view class="product" v-if="params">
      <image class="userHead" :src="params.pic" style="height: 44px;width: 44px;    border-radius: 50%;"></image>
      <view class="productText">
        <span class="text">用户昵称</span>
      </view>
    </view>
    <view class="askContent">
      <view class="askTab">
        <view class="askTop">
          <view :class="['askItem', activeIndex == index ? 'active' : '']" v-for="(item, index) in cateList" @click="changeActive(index)" :key="index">{{ item.categoryName }}</view>
        </view>
      </view>
      <view class="contentItem">
        <view v-if="contentTab == 1">
          <template v-if="questionList.length>0">
            <view class="contentTabOne" v-for="(item, index) in questionList" :key="index">
              <view class="top flex-spb">
                <view class="flex">
                  <image class="imgse" :src="`${imgBasePath}/static/images/icons/icon-question.png`" style="width: 30px; height: 30px;margin-right: 10px;" />
                  <view class="one">{{item.questionContent }}</view>
                </view>
                <image class="imgse" :src="`${imgBasePath}/static/images/icons/icon-trash.png`" style="height: 18px;flex: 0 0 18px;margin-top:4px" @click="deleteMyQuestionBtn(item.id)" />
              </view>
              <view class="itemtext flex align-c">
                <image class="imgse" :src="`${imgBasePath}/static/images/icons/icon-question.png`" />
                <p>雀巢（Nestle）怡养益护因子A2 β</p>
              </view>
              <view class="flex-spb">
                <p class="date">{{item.createTime}}的提问</p>
                <view class="desc flex-spb align-c" v-if="item.replyNumber.length>0" @click="askDetile(item.id)">
                  {{item.replyNumber}}个回答
                  <image :src="`${imgBasePath}/static/images/icons/icon-arrow-right-red.png`" style="height: 14px;width: 14px;margin-left:4px" />
                </view>
                <view class="date" style="color: #B7B7B7;" v-else>
                  暂无回答
                  <image :src="`${imgBasePath}/static/images/icons/icon-arrow-right-red.png`" style="height: 14px;width: 14px;margin-left:4px" />
                </view>
              </view>
            </view>
          </template>
          <u-empty mode="data" v-else :icon="`${imgBasePath}/static/images/icons/img-blank-order.png`" textSize="14" width="150" height="150" />
        </view>
        <view v-else-if="contentTab == 2">
          <template v-if="replyList.length>0">
            <view class="contentTabOne" v-for="(item, index) in replyList" :key="index">
              <view class="top flex-spb">
                <view class="flex">
                  <image class="imgse" :src="`${imgBasePath}/static/images/icons/icon-answer.png`" style="width: 30px; height: 30px;margin-right: 10px;" />
                  <view class="one">{{ item.firstReply.replyContent}}</view>
                </view>
                <image class="imgse" :src="`${imgBasePath}/static/images/icons/icon-trash.png`" style="height: 18px;flex: 0 0 18px;margin-top:4px" @click="deleteMyReplayBtn(item.firstReply.id)" />
              </view>
              <view class="itemtext flex align-c" style="padding:14px 6px">
                <image class="imgse" :src="`${imgBasePath}/static/images/icons/icon-answer.png`" />
                <view class="grow1 ellipsis">
                  <p class="ellipsis">
                    雀巢（Nestle）怡养益护因子A2雀巢（Nestle）怡养益护因子A2雀巢（Nestle）怡养益护因子A2
                  </p>
                  <p class="teis grow1">
                    <image class="wen" :src="`${imgBasePath}/static/images/icons/icon-question.png`" />
                    <span class="ellipsis">{{ item.questionContent }}</span>
                  </p>
                </view>
              </view>
              <view class="flex-spb">
                <p class="date">{{item.firstReply.createTime}}的回答</p>
              </view>
            </view>
          </template>
          <u-empty mode="data" v-else :icon="`${imgBasePath}/static/images/icons/img-blank-order.png`" textSize="14" width="150" height="150" />
        </view>
        <view v-else-if="contentTab == 3">
          <template v-if="concernsList.length>0">
            <view class="contentTabOne" v-for="(item, index) in concernsList" :key="index">
              <view class="top flex-spb">
                <view class="flex">
                  <image class="imgse" :src="`${imgBasePath}/static/images/icons/icon-question.png`" style="width: 30px; height: 30px;margin-right: 10px;" />
                  <view class="one">{{ item.questionContent}}</view>
                </view>
                <image class="imgse" :src="`${imgBasePath}/static/images/icons/icon-trash.png`" style="height: 18px;flex: 0 0 18px;margin-top:4px" @click="noFocusBtn(item.id)" />
              </view>
              <view class="itemtext flex align-c">
                <image class="imgse" :src="item.userInfo.avatarUrl" />
                <p>雀巢（Nestle）怡养益护因子A2 β</p>
              </view>
              <view class="flex-spb align-c">
                <view class="desc flex-spb align-c" v-if="item.replyNumber.length>0" @click="askDetile(item.id)">
                  {{item.replyNumber}}个回答
                  <image :src="`${imgBasePath}/static/images/icons/icon-arrow-right-red.png`" style="height: 14px;width: 14px;margin-left:4px" />
                </view>
                <p class="date" style="color: #B7B7B7;" v-else>暂无回答</p>
                <view class="quxiaoguanz" v-if="showButton" @click="focusBtn(item.id)">取消关注</view>
                <view class="quxiaoguanz" v-else @click="noFocusBtn(item.id)">已关注</view>
              </view>
            </view>
          </template>
          <u-empty mode="data" v-else :icon="`${imgBasePath}/static/images/icons/img-blank-order.png`" textSize="14" width="150" height="150" />
        </view>
        <view v-else>
          <template v-if="likeList.length>0">
            <view class="contentTabOne" v-for="(item, index) in likeList" :key="index">
              <view class="itemtext flex align-c" style="padding:14px 6px;margin-top:0">
                <image class="imgse" :src="`${imgBasePath}/static/images/icons/icon-answer.png`" />
                <view class="grow1 ellipsis">
                  <p class="ellipsis">
                    <!-- {{  }} -->
                  </p>
                  <p class="teis grow1">
                    <image class="wen" :src="`${imgBasePath}/static/images/icons/icon-question.png`" />
                    <span class="ellipsis">{{ item.questionContent}}</span>
                  </p>
                </view>
              </view>
              <view class="contentItemthree">
                <view class="imageBox">
                  <!-- 目前是网上找的固定的图片 -->
                  <image class="userHead" :src="'khttps://gd-hbimg.huaban.com/07b029c67010c0a17a1c78fcbc92ce612de4cf3ae8dd-Oc4KXC_fw658'" style="height: 38px;width: 38px;"></image>
                </view>
                <view class="reight">
                  <view class="nic">
                    <span class="one">昵称昵称</span>
                    <span class="two">已购礼盒装【585g两罐+玻璃杯】</span>
                  </view>
                  <view class="footer">
                    <span class="one">
                      {{item.firstReply.replyContent}}
                    </span>
                    <view class="two">
                      <span>{{item.firstReply.createTime}}</span>
                      <span @click="likeBtn(item.firstReply.id,item.firstReply.isLike)">
                        <image class="imgse" :src="`${imgBasePath}/static/images/icons/icon-heart-fill.png`" style="width: 14px;height: 14px;" v-show="item.firstReply.isLike==1" />
                        <image class="imgse" :src="`${imgBasePath}/static/images/icons/icon-heart.png`" style="width: 14px;height: 14px;" v-show="item.firstReply.isLike == 0" />
                      </span>
                    </view>
                  </view>
                </view>
              </view>
            </view>
          </template>
          <u-empty mode="data" v-else :icon="`${imgBasePath}/static/images/icons/img-blank-order.png`" textSize="14" width="150" height="150" />
        </view>
      </view>
      <!-- <view class="btnBox">
        <button class="lastBtn">发布问题</button>
      </view> -->
    </view>
  </view>
</template>
<script>
import { getproductdetail } from '@/api/system/productsList.js'
import {
  deleteMyQuestion,
  myConcerns,
  myReply,
  myQuestion,
  deleteMyReplay,
  getFocusProblem,
  getnoFocusProblem,
  myLike,
  unLikeComments,
  likeComments,
} from '@/api/system/question.js'
export default {
  data() {
    return {
      keyword: '',
      id: null,
      params: {},
      like: true, //是否点赞标志位
      contentTab: 1,
      showButton: true, //是否关注
      cateList: [
        {
          index: 0,
          categoryName: '我的提问',
        },
        {
          index: 1,
          categoryName: '我的回答',
        },
        {
          index: 2,
          categoryName: '我的关注',
        },
        {
          index: 3,
          categoryName: '我的点赞',
        },
      ],
      activeIndex: 0,
      questionList: [], //我的提问列表数据源
      replyList: [], //我的回答列表数据源
      concernsList: [], //我的关注列表数据源
      likeList: [], //我的点赞列表数据源
    }
  },
  // 获取详情界面传递的id
  onLoad(event) {
    if (event) {
      this.paramsId = event.paramsId //这个是头部头像需要的id
      this.getInfo()
      this.myQuestion()
    }
  },
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
    // 点击问一问详情
    askDetile(id) {
      this.$tab.navigateTo(
        `/pages/common/ask/askDetail?id=${id}&paramsId=${this.paramsId}`
      )
    },
    // 点赞和取消小红心
    likeBtn(id, like) {
      // this.like = !this.like
      if (like == 0) {
        // 如果like变为true则点赞 发接口
        this.likeComments(id)
        this.myLike()
      } else {
        // 如果点击后 like为false 则取消点赞 发接口
        this.unLikeComments(id)
        this.myLike()
      }
    },
    //更改点击项的索引号
    changeActive(i) {
      this.activeIndex = i
      // 已经获取到索引号
      // this.goodList = this.cateList[i].children
      if (i == 0) {
        this.contentTab = 1
        this.myQuestion()
      } else if (i == 1) {
        this.myReply()
        this.contentTab = 2
      } else if (i == 2) {
        this.contentTab = 3
        this.myConcerns()
      } else {
        this.contentTab = 4
        this.myLike()
      }
    },
    // 点赞评论
    likeComments(id) {
      likeComments(id).then((res) => {
        console.log(res)
      })
    },
    // 取消点赞评论
    unLikeComments(id) {
      unLikeComments(id).then((res) => {
        console.log(res)
      })
    },
    // (删除我的提问)
    deleteMyQuestionBtn(id) {
      deleteMyQuestion(id).then((res) => {
        if (res.code == 200) {
          this.myQuestion()
          uni.$u.toast('删除成功')
          //   const pages = getCurrentPages()
          //   console.log(pages[pages.length - 2])
          // //  加这个是为了 刷新页面  调用pageOnLoad方法
          // pages[pages.length - 2].$vm.pageOnLoad()
        }
      })
    },
    // 删除我的回答
    deleteMyReplayBtn(id) {
      deleteMyReplay(id).then((res) => {
        if (res.code == 200) {
          this.myReply()
          uni.$u.toast('删除成功')
        }
      })
    },
    // 点击我的提问
    myQuestion() {
      myQuestion().then((res) => {
        if (res.code == 200) {
          if (res && res.data) {
            this.questionList = res.data
          }
        }
      })
    },
    // 点击我的回答
    myReply() {
      myReply().then((res) => {
        if (res.code == 200) {
          if (res && res.data) {
            this.replyList = res.data
          }
        }
      })
    },
    // 点击我的关注
    myConcerns() {
      myConcerns().then((res) => {
        if (res.code == 200) {
          if (res && res.data) {
            this.concernsList = res.data
          }
        }
      })
    },
    // 点击我的点赞
    myLike() {
      myLike().then((res) => {
        if (res.code == 200) {
          if (res && res.data) {
            this.likeList = res.data
          }
        }
      })
    },
    // 点击关注问题
    focusBtn(id) {
      this.showButton = !this.showButton
      getFocusProblem(id).then((res) => {
        console.log(res)
      })
    },
    // 取消关注
    noFocusBtn(id) {
      this.showButton = !this.showButton
      getnoFocusProblem(id).then((res) => {
        if (res.code == 200) {
          this.myConcerns()
        }
      })
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
  height: 100vh;
  padding-top: 30px;

  .askTital {
    display: flex;
    justify-content: start;
    align-items: center;
    padding: 0 20px;

    .arrow {
      margin-right: 110px;
    }

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
    align-items: center;
    height: 50px;
    margin-left: 14px;
    margin-top: 12px;
    border-radius: 10px;
    overflow: hidden;
    margin-bottom: 12px;

    .productText {
      display: flex;
      flex-direction: column;
      justify-content: center;
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
    border-radius: 18px 18px 0px 0px;
    background-color: #fff;
    margin-top: 14px;
    position: relative;
    padding: 16px;
    min-height: calc(100vh - 128px);

    .askTab {
      .askTop {
        display: flex;
        justify-content: start;
        height: 50px;

        .askItem {
          margin-right: 12px;
          width: 80px;
          height: 32px;
          background-color: #f4f4f5;
          border-radius: 80px;
          font-size: 14px;
          font-family: PingFangSC, PingFang SC;
          font-weight: 400;
          color: #6f6f78;
          line-height: 32px;
          text-align: center;
        }

        .askItem.active {
          // margin-right: 10px;
          // width: 100px;
          // height: 30px;
          background-color: #ffeae8;
          color: #e9746c;
          font-weight: 500;
          // border-radius: 15px;
          // font-size: 14px;
          // display: flex;
          // align-items: center;
          // justify-content: center;
          // padding-left: 5px;
          // padding-right: 5px;
          // margin-top: 10px;
        }
      }
    }

    .contentItem {
      .contentTabOne {
        padding: 18px 0;
        border-bottom: 1px solid #f0f0f0;

        .top {
          .one {
            width: 81%;
            padding: 2px;
            font-size: 16px;
            font-family: PingFangSC, PingFang SC;
            font-weight: 500;
            color: #363636;
            line-height: 24px;
          }
        }

        .itemtext {
          padding: 6px;
          margin: 16px 0;
          background: #fafbfd;
          border-radius: 8px;

          .imgse {
            flex: 0 0 36px;
            width: 36px;
            height: 36px;
            border-radius: 8px;
            margin-right: 8px;
          }

          p {
            font-size: 13px;
            font-family: PingFangSC, PingFang SC;
            font-weight: 400;
            color: #767676;
            line-height: 14px;
          }

          .wen {
            flex: 0 0 16px;
            width: 16px;
            height: 16px;
            margin-right: 5px;
          }

          .teis {
            display: flex;
            align-items: center;
            margin-top: 11px;
            font-size: 13px;
            font-family: PingFangSC, PingFang SC;
            font-weight: 400;
            color: #363636;
            line-height: 14px;
          }
        }

        .date {
          font-size: 12px;
          font-family: PingFangSC, PingFang SC;
          font-weight: 400;
          color: #767676;
          line-height: 14px;
        }

        .desc {
          font-size: 14px;
          font-family: PingFangSC, PingFang SC;
          font-weight: 400;
          color: #de3c31;
          line-height: 14px;
        }

        .quxiaoguanz {
          width: 74px;
          height: 28px;
          border-radius: 14px;
          border: 1px solid #b7b7b7;
          font-size: 14px;
          font-family: PingFangSC, PingFang SC;
          font-weight: 400;
          color: #767676;
          line-height: 26px;
          text-align: center;
        }
      }

      .contentTabOne:last-child {
        border: none;
      }

      .itemOne {
        position: relative;

        .top {
          display: flex;

          .topText {
            display: flex;
            justify-content: start;
            margin-left: 15px;
            align-items: center;
          }

          .imageBox {
            flex: 0 0 30px;
            width: 30px;
            height: 30px;
            background-color: #eaedee;

            .img {
              width: 30px;
              height: 30px;
              border-radius: 8px;
            }
          }
        }

        .reight {
          margin-left: 5px;
          display: flex;
          flex-direction: column;

          span {
            padding-left: 15px;
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

        .bootom {
          padding-top: 20px;
          display: flex;
          flex-direction: column;

          span {
            margin-bottom: 10px;
          }

          .one {
            font-size: 15px;
            font-weight: 700;
          }

          .two {
            font-size: 13px;
            color: #767676;
          }

          .threeBox {
            display: flex;
            justify-content: space-between;
            align-items: center;

            .three {
              color: #cd9063;
              margin-bottom: 0;
            }
          }
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
      position: fixed;
      right: 0;
      left: 0;
      bottom: 0;
      padding: 8px 12px 42px;
      background: #fff;
      height: 100px;

      .lastBtn {
        height: 40px;
        background: #de3c31;
        border-radius: 20px;
        border: 1px solid #de3c31;
        font-size: 16px;
        font-family: PingFangSC, PingFang SC;
        font-weight: 500;
        color: #ffffff;
        line-height: 38px;
      }
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

      .nic {
        display: flex;
        flex-direction: column;
      }

      .nic .one {
        font-size: 14px;
        font-family: PingFangSC, PingFang SC;
        font-weight: 500;
        color: #363636;
        line-height: 14px;
        margin-bottom: 6px;
      }

      .nic .two {
        font-size: 14px;
        font-family: PingFangSC, PingFang SC;
        font-weight: 400;
        color: #767676;
        line-height: 14px;
      }

      .footer {
        margin-top: 14px;
        background: #fafbfd;
        border-radius: 8px;
        display: flex;
        flex-direction: column;
        padding: 12px 10px;

        .one {
          font-size: 15px;
          font-family: PingFangSC, PingFang SC;
          font-weight: 400;
          color: #363636;
          line-height: 24px;
          margin-bottom: 10px;
        }

        .two {
          display: flex;
          justify-content: space-between;
          font-size: 12px;
          font-family: PingFangSC, PingFang SC;
          font-weight: 400;
          color: #767676;
          line-height: 12px;
        }
      }
    }
  }
}
</style>