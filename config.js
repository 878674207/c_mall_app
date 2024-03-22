// 应用全局配置
module.exports = {
  baseUrl: 'http://localhost:8082',//百川
  // baseUrl: 'http://172.23.0.157:8082',  //李帅
  // baseUrl: 'http://172.23.0.60:8082',   //李帅
  // baseUrl: 'https://yylpt.cjbang.com.cn/yylpt',//测试
  // 应用信息
  appInfo: {
    // 应用名称
    name: "ruoyi-app",  
    // 应用版本
    version: "1.1.0",
    // 应用logo
    logo: "/static/logo.png",
    // 官方网站
    site_url: "http://ruoyi.vip",
    // 政策协议
    agreements: [{
      title: "隐私政策",
      url: "https://ruoyi.vip/protocol.html"
    },
    {
      title: "用户服务协议",
      url: "https://ruoyi.vip/protocol.html"  
    }
    ]
  }
}
