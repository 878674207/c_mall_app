import request from "@/utils/request";

export function queryAllCity(params) {
    return request({
        url: "/custom/wechat/queryAllCity",
        method: "get",
        params,
    });
}
export function queryCity(params) {
    return request({
        url: "/custom/wechat/queryCity",
        method: "get",
        params,
    });
}
export function getList(data) {
    return request({
        url: `/custom/institution/list?pageNum=${data.pageNum}&pageSize=${data.pageSize}`,
        method: "post",
        data: data,
    });
}
export function getInfoList(data) {
    return request({
        url: `/custom/info/page-list?pageNum=${data.pageNum}&pageSize=${data.pageSize}`,
        method: "get",
    });
}
export function getStakeholderList() {
    return request({
        url: "/custom/stakeholder/list",
        method: "get",
    });
}
export function getStakeholderAdd(data) {
    return request({
        url: "/custom/stakeholder/add",
        method: "post",
        data: data,
    });
}
export function getStakeholderDelete(data) {
    return request({
        url: `/custom/stakeholder/delete/${data}`,
        method: "delete",
    });
}
export function getLocationQuery(data) {
    return request({
        url: `/custom/location/query`,
        method: "post",
        data: data,
    });
}
export function setReservationAdd(data) {
    return request({
        url: `/custom/reservation/create`,
        method: "post",
        data: data,
    });
}
export function getPageList(data) {
    return request({
        url: `/custom/intention-order/page-list?pageNum=${data.pageNum}&pageSize=${data.pageSize}`,
        method: "post",
        data: data,
    });
}
export function getOrderDetail(data) {
    return request({
        url: `/custom/intention-order/detail/${data.id}`,
        method: "get",
    });
}
export function getreservaPageList(data) {
    return request({
        url: `/custom/reservation/page-list?pageNum=${data.pageNum}&pageSize=${data.pageSize}`,
        method: "post",
        data: data,
    });
}
export function getintentionDetail(data) {
    return request({
        url: `/custom/reservation/detail/${data.id}`,
        method: "get",
    });
}
export function getintentionCreate(data) {
    return request({
        url: "/custom/intention-order/create",
        method: "post",
        data: data,
    });
}
export function getintentionUpdate(data) {
    return request({
        url: "/custom/intention-order/update",
        method: "post",
        data: data,
    });
}
export function getreservationUpadate(data) {
    return request({
        url: "/custom/reservation/update",
        method: "post",
        data: data,
    });
}
export function getintentionRepay(data) {
    return request({
        url: `/custom/intention-order/repay/${data.orderNo}`,
        method: "get",
    });
}
export function getfavoritePageList(data) {
    return request({
        url: `/custom/institution-favorite/page-list?pageNum=${data.pageNum}&pageSize=${data.pageSize}`,
        method: "post",
        data: data,
    });
}
export function getevaluationadd(data) {
    return request({
        url: `/custom/evaluation/add`,
        method: "post",
        data: data,
    });
}
export function getinstitutionadd(data) {
    return request({
        url: `/custom/institution/add`,
        method: "post",
        data: data,
    });
}
export function getaddread(id) {
    return request({
        url: `/custom/info/add-read/${id}`,
        method: "put",
    });
}
export function getfnoticePageList(data) {
    return request({
        url: `/custom/notice/page-list?pageNum=${data.pageNum}&pageSize=${data.pageSize}`,
        method: "get",
    });
}
export function refOrder(data) {
    return request({
        url: `/custom/intention-order/update`,
        method: "post",
        data: data,
    });
}
export function complaintadd(data) {
    return request({
        url: `/custom/complaint/add`,
        method: "post",
        data: data,
    });
}
export function complaintmyList(data) {
    return request({
        url: `/custom/complaint/my/list`,
        method: "post",
        data: data,
    });
}
