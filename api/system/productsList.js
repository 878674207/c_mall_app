import upload from '@/utils/upload'
import request from '@/utils/request'

// 商品列表页面
export function getProductsList(data) {
    return request({
        'url': '/c/product/page-list',
        'method': 'post',
        'data': data
    })
}
// 商品详情
export function getproductdetail(id) {
    return request({
        'url': `/c/product/detail/${id}`,
        method: 'get',
    })
}
// 商品收藏
export function collectionsave(data) {
    return request({
        'url': '/c/product-collection/save',
        'method': 'post',
        'data': data
    })
}
// 店铺关注
export function attentionsave(data) {
    return request({
        'url': '/c/store-attention/save',
        'method': 'post',
        'data': data
    })
}
// 加入购物车
export function basketsave(data) {
    return request({
        'url': '/c/basket/save',
        'method': 'post',
        'data': data
    })
}
// 商品详情发起结算
export function productsettle(data) {
    return request({
        'url': '/c/product/settle',
        'method': 'post',
        'data': data
    })
}
// 提交订单接口
export function ordersubmit(data) {
    return request({
        'url': '/c/order/submit',
        'method': 'post',
        'data': data
    })
}
// 购物车发起结算
export function basketsettle(data) {
    return request({
        'url': `/c/basket/settle`,
        'method': 'post',
        'data': data
    })
}