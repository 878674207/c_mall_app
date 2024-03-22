import upload from '@/utils/upload'
import request from '@/utils/request'

// 分类
export function getClassification() {
    return request({
        'url': '/c/product/category-tree',
        method: 'get',
    })
}
