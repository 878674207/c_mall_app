<template>
    <view class="contentBox">
        <view class="orderListBox">
            <view>
                <view class="topBox">
                    <view class="two">
                        <image class="img" style="height: 54px;width: 54px;">
                        </image>
                        <view class="reight grow1">
                            <view class="top">
                                <span class="text">商品名称1245678912123</span>
                                <span class="price">￥19.00</span>
                            </view>
                            <view class="bottom grow1">
                                <span>属性值；属性值</span>
                                <span>×2</span>
                            </view>
                        </view>
                    </view>
                    <view class="five">
                        <view class="more">
                        </view>
                    </view>
                </view>
                <view class="functionBox">
                    <p>
                        <span>退货</span>
                        <span>退货收到的商品
                            <image class="img" :src="`${imgBasePath}/static/images/icons/icon-arrow-right.png`"
                                style="height: 15px;width: 15px;" />
                        </span>
                    </p>
                    <p>
                        <span>换货</span>
                        <span>更换收到的商品
                            <image class="img" :src="`${imgBasePath}/static/images/icons/icon-arrow-right.png`"
                                style="height: 15px;width: 15px;" />
                        </span>
                    </p>
                    <p>
                        <span>维修</span>
                        <span>维修收到的商品
                            <image class="img" :src="`${imgBasePath}/static/images/icons/icon-arrow-right.png`"
                                style="height: 15px;width: 15px;" />
                        </span>
                    </p>
                </view>
                <view class="causeBox">
                    <p>
                        <span>售后原因</span>
                        <span>请选择
                            <image class="img" :src="`${imgBasePath}/static/images/icons/icon-arrow-right.png`"
                                style="height: 15px;width: 15px;" />
                        </span>
                    </p>
                    <view class="lineBox">
                    </view>
                    <u--textarea v-model="text" border="none" placeholder="请写问题描述"></u--textarea>
                </view>
                <view class="more">
                    <p>
                        <span>
                            <img src="" alt="">
                            平台服务热线
                        </span>
                        <span>
                            1221211212121
                        </span>
                    </p>
                </view>
                <view class="btnBox">
                    <button>确认提交</button>
                    <u-radio-group v-model="conformSlect">
                        <u-radio @change="radioChange">
                            我已知晓售后服务说明
                        </u-radio>
                    </u-radio-group>
                </view>
            </view>
        </view>

        <!-- <u-empty mode="data" class="emptyBox" v-else
                :icon="`${imgBasePath}/static/images/icons/img-blank-order.png`" textSize="14" width="180"
                height="180" /> -->
    </view>
</template>

<script>

export default {
    data() {
        return {
            text:null,//问题描述
            conformSlect:null
        }
    },
    //页面初始化
    onLoad() {

    },
    methods: {
        // 处理单品信息数据
        setRule(item) {
            let arr = JSON.parse(item)
            let str = ''
            arr.forEach((element) => {
                str += element.key + '【' + element.value + '】'
            })
            return str
        },
        radioChange(e) {
            // console.log(e);
        },

    },
}
</script>

<style scoped lang="scss">
* {
    margin: 0;
    padding: 0;
    background-color: #fff;
}

.contentBox {
    position: absolute;
    top: 2px;
    width: 100%;

    .emptyBox {//空图片
        background-color: #fff;
        position: absolute;
        top: 100px;
        left: 100px;
        margin-right: 200px;
    }

    .orderListBox {
        background: #ffffff;
        margin-top: 10px;
        border-radius: 8px;
        display: flex;
        flex-direction: column;
        padding: 15px;
        margin: 0 14px 10px;
        height: 95vh;
        .one {
            display: flex;
            align-items: center;
            justify-content: space-between;

            .one-box {
                display: flex;
                align-items: center;
            }

            .one-name {
                font-size: 16px;
                font-family: PingFangSC, PingFang SC;
                font-weight: 500;
                color: #363636;
                line-height: 16px;
            }

            .one-status {
                font-size: 16px;
                font-family: PingFangSC, PingFang SC;
                font-weight: 500;
                color: #de3c31;
                line-height: 16px;
            }
        }

        .two {
            margin-top: 12px;
            display: flex;

            .reight {
                display: flex;
                flex-direction: column;
                margin-left: 8px;

                .top {
                    display: flex;
                    justify-content: space-between;
                    margin-top: 8px;

                    .text {
                        font-size: 14px;
                        font-family: PingFangSC, PingFang SC;
                        font-weight: 400;
                        color: #363636;
                        line-height: 14px;
                    }

                    .price {
                        font-size: 10px;
                        font-family: PingFangSC, PingFang SC;
                        font-weight: 400;
                        color: #363636;
                        line-height: 14px;
                        margin-left: 15px;
                    }
                }

                .bottom {
                    display: flex;
                    justify-content: space-between;
                    margin-top: 8px;
                    line-height: 24px;
                    font-weight: 400;
                    font-size: 14px;
                    color: #767676;
                }
            }
        }

        .three {
            display: flex;
            justify-content: end;
            margin-top: 8px;
            font-size: 14px;
            font-family: PingFangSC, PingFang SC;
            font-weight: 400;
            color: #de3c31;
            line-height: 14px;
        }

        .four {
            margin-top: 10px;
            font-size: 15px;
            font-family: PingFangSC, PingFang SC;
            font-weight: 500;
            color: #363636;
            line-height: 18px;
            text-align: right;
        }

        .five {
            margin-top: 16px;
            display: flex;
            justify-content: space-between;
            align-items: center;

            .more {
                font-size: 14px;
                font-family: PingFangSC, PingFang SC;
                font-weight: 400;
                color: #767676;
                line-height: 20px;
            }

            .button {
                span {
                    width: 86px;
                    height: 34px;
                    display: inline-block;
                    border-radius: 17px;
                    border: 1px solid #b7b7b7;
                    text-align: center;
                    font-size: 14px;
                    font-family: PingFangSC, PingFang SC;
                    font-weight: 400;
                    color: #767676;
                    line-height: 32px;
                    margin-left: 10px;
                }
            }
        }

        .functionBox {
            margin-top: 20px;
            border-radius: 6px;
            // background-color:red;
            // height: 150px;
            color: #363636;

            p {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-top: 20px;

                span {
                    display: flex;
                    align-items: center;
                }
            }
        }

        .causeBox {
            margin-top: 40px;
            p {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-top: 20px;
            
                    span {
                        display: flex;
                        align-items: center;
                    }
                }
            .lineBox {
                display: flex;
                justify-content: center;
                    width: 310px;
                    height: 1px;
                    background: #f0f0f0;
                    margin: 10px 0;
                    
                }
        }
        .more{
            p{
                display: flex;
                justify-content: space-between;
            }
        }
                 .btnBox {
                     position: absolute;
                     bottom: 40px;
                     left: 90px;
                     display: flex;
                     flex-direction: column;
                     align-items: center;
        
                     button {
                         background-color: skyblue;
                         border: none;
                         color: #fff;
                         border-radius: 30px;
                         padding: 2px 60px;
                         margin-bottom: 10px;
                     }
                 }
    }
}
</style>