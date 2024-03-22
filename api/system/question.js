import upload from '@/utils/upload'
import request from '@/utils/request'
// 关注问题
export function getFocusProblem(id) {
    return request({
        'url': `/c/evaluate/careQuestion?questionId=${id}`,
        method: 'get',
    })
}
// 取消关注问题
export function getnoFocusProblem(id) {
    return request({
        'url': `/c/evaluate/dontCareQuestion?questionId=${id}`,
        method: 'get',
    })
}
// 删除我的提问
export function deleteMyQuestion(data) {
    return request({
        'url': `/c/evaluate/delete/${data}`,
        'method': 'post',
    })
}
// 删除我的回答
export function deleteMyReplay(data) {
    return request({    
        'url': `/c/evaluateReply/delete/${data}`,
        'method': 'post',
    })
}
// 问一问分页查询
export function askQuery(data) {
    return request({
        'url': `/c/evaluate/index`,
        'method': 'post',
        'data': data
    })
}
// 我关注的问题
export function myConcerns() {
    return request({
        'url': `/c/evaluate/myCareQuestion`,
        method: 'get',
    })
}
// 保存提问
export function saveMyQuestion(data) {
    return request({
        'url': `/c/evaluate/save`,
        'method': 'post',
        'data': data
    })
}
// 保存回复
export function saveReply(data) {
    return request({
        'url': `/c/evaluateReply/saveReply`,
        'method': 'post',
        'data': data
    })
}
// 点赞评论
export function likeComments(id) {
    return request({
        'url': `/c/evaluateReply/like?replyId=${id}`,
        method: 'get',
    })
}
// 取消点赞
export function unLikeComments(id) {
    return request({
        'url': `/c/evaluateReply/dontLike?replyId=${id}`,
        method: 'get',
    })
}
// // 回复分页查询
export function replaceList(data) {
    return request({
        'url': `/c/evaluateReply/index`,
        'method': 'post',
        'data': data
    })
}
// 我的提问列表
export function myQuestion() {
    return request({
        'url': `/c/evaluate/myQuestion`,
        method: 'get',
    })
}

// 我的回复列表
export function myReply() {
    return request({
        'url': `/c/evaluate/myReply`,
        method: 'get',
    })
}
// 我的点赞列表
export function myLike() {
    return request({
        'url': `/c/evaluate/myLike`,
        method: 'get',
    })
}
// 根据questionId查询提问信息
export function selectByQuestionId(id) {
    return request({
        'url': `/c/evaluate/selectByQuestionId?questionId=${id}`,
        method: 'get',
    })
}
