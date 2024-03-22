import upload from '@/utils/upload'
import request from '@/utils/request'

// 我的订单 分页查询
export function getOrderList(data) {
    return request({
        'url': '/c/order/page-list',
        'method': 'post',
        'data': data
    })
}
// 订单详情接口
export function orderDetail(id) {
    return request({
        url: `/c/order/detail/${id}`,
        method: "get",
    });
}
// 删除订单
export function deleteOrder(id) {
    return request({
        url: `/c/order/delete/${id}`,
        method: "delete",
    });
}
// 取消订单
export function cancelOrder(id) {
    return request({
        url: `/c/order/cancel/${id}`,
        method: "put",
    });
}
// 修改地址
export function orderAddresse(data) {
    return request({
        url: `/c/order/address/save`,
        method: "post",
        data: data,
    });
}
// 再来一单
export function purchaseAgain(id) {
    return request({
        url: `/c/order/purchase-again/${id}`,
        method: "get",
    });
}