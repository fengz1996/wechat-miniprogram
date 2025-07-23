Page({
  data: {
    swiperCurrent: 0,
    bannerList: [
      { title: "仙嘟嘟优质鲜鸡蛋", desc: "自然放养 营养健康" },
      { title: "天然生态农场", desc: "无污染 无添加" },
      { title: "产地直供新鲜配送", desc: "从农场到餐桌" }
    ],
    companyInfo: {
      vision: "秉承'自然、健康、安全'的理念，打造优质鸡蛋品牌",
      mission: "为消费者提供最新鲜、最安全、最营养的鸡蛋产品",
      values: [
        { title: "自然放养", desc: "采用自然生态放养方式，让母鸡健康成长" },
        { title: "品质保证", desc: "严格筛选，确保每一颗鸡蛋都符合标准" },
        { title: "技术创新", desc: "引进先进养殖技术，提高产品质量" }
      ]
    }
  },
  
  onLoad: function() {
  },
  
  swiperChange: function(e) {
    this.setData({
      swiperCurrent: e.detail.current
    })
  },
  
  navigateToScan: function() {
    wx.switchTab({
      url: '/pages/scan/scan',
    })
  }
})