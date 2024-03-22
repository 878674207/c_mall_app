import upload from '@/utils/upload'
import request from '@/utils/request'

// 我的购物车列表
export function getShopCardList(data) {
    return request({
        'url': `/c/basket/list`,
        'method': 'post',
        'data': data
    })
}
// 删除购物车指定商品
export function deleteShopCard(data) {
    return request({
        'url': `/c/basket/delete`,
        'method': 'post',
        'data': data
    })
}
// 移入收藏夹
export function collectionInto(data) {
    return request({
        'url': `/c/basket/transfer-collection`,
        'method': 'post',
        'data': data
    })
}
