import upload from '@/utils/upload'
import request from '@/utils/request'

// 新增收获地址页面 保存收货地址
export function getAdress(data) {
    return request({
        'url': '/c/address/save',
        'method': 'post',
        'data': data
    })
}
// 查询我的收货地址列表
export function getReceipt(data) {
    return request({
        'url': '/c/address/page-list',
        'method': 'post',
        'data': data
    })
}
// 删除收货地址
export function getdeleteReceipt(data) {
    return request({
        'url': '/c/address/delete',
        'method': 'post',
        'data': data
    })
}