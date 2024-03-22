import request from "@/utils/request";

//
export function getList(data) {
  return request({
    url: "/c/store-attention/page-list",
    method: "post",
    data: data,
  });
}
//
export function delList(data) {
  return request({
    url: "/c/store-attention/batch/cancel-attention",
    method: "post",
    data: data,
  });
}
// 
export function getcollection(data) {
  return request({
    url: "/c/product-collection/page-list",
    method: "post",
    data: data,
  });
}
// 取消收藏
export function cancelcollection(data) {
  return request({
    url: "/c/product-collection/batch/cancel-collect",
    method: "post",
    data: data,
  });
}
// 获取分类
export function getcategory(data) {
  return request({
    url: "/c/product-collection/product-category",
    method: "get",
  });
}
