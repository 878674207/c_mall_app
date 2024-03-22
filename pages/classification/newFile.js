/* __placeholder__ */
export default (await import('vue')).defineComponent({
data() {
return {
keyword: '',
specialList: [], //关键字搜索回来的数据
historyList: [], //搜索记录
};
},
methods: {
async getsearch(keyword) {
// 发起接口请求
// const res = await request('index/go_search?search=' + keyword + '&limit=10')
// this.specialList = res.data
console.log(this.specialList);
if (keyword == '') {
uni.showModal({
title: '搜索内容不能为空'
});
} else {
//判断数组里面是否有重复的搜索内容，有的话就删除之前的，把现在搜索的放在数组的前面
if (this.historyList.includes(keyword)) {
let i = this.historyList.indexOf(keyword);
this.historyList.splice(i, 1);
//把现在搜索的放在数组的前面
this.historyList.unshift(keyword);
} else {
this.historyList.unshift(keyword);
// 
uni.setStorageSync('searchList', JSON.stringify(this.historyList));
}
}
},

deleteHistory() {
// 清楚搜索历史
uni.showToast({
title: '已清空'
});
uni.removeStorage({
key: 'searchList'
});
this.historyList = [];
},
//每次进入页面的时候拿到存进去的缓存
onShow() {
this.historyList = JSON.parse(uni.getStorageSync('searchList') || '[]');
// 目前有什么历史记录
console.log('历史记录', this.historyList);
},
onLoad() {
},
}
});
