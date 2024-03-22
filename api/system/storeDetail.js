import upload from '@/utils/upload'
import request from '@/utils/request'
// 店铺详情
export function getStoreDetails(storeId) {
    return request({
        'url': `/c/store/detail/${storeId}`,
        method: 'get',
    })
}
// 店铺推荐
export function getStoreRecommend(storeId,type) {
    return request({
        'url': `/c/store/recommend/${storeId}/${type}`,
        method: 'get',
    })
}
// 店铺商品分类
export function getStoreCategory(storeId) {
    return request({
        'url': `/c/store/product-category/${storeId}`,
        method: 'get',
    })
}