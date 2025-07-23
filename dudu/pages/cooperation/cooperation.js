Page({
  data: {
    cooperationInfo: {
      title: "招商合作",
      desc: "诚邀全国各地优质合作伙伴，共同打造高品质鸡蛋销售网络",
      advantages: [
        { title: "源头直供", desc: "直接从农场供应，保证鲜度与品质" },
        { title: "高利润空间", desc: "合理的价格体系，确保各方利益" },
        { title: "品牌支持", desc: "提供完善的品牌宣传与市场推广支持" },
        { title: "技术支持", desc: "提供设备安装与维护的技术支持" }
      ],
      levels: [
        { name: "高级合伙人", investment: "50000元起", profit: "享受高级分佣，设备直推奖励500元/台" },
        { name: "中级合伙人", investment: "30000元起", profit: "享受中级分佣，设备直推奖励300元/台" },
        { name: "初级合伙人", investment: "10000元起", profit: "享受初级分佣，设备直推奖励100元/台" }
      ],
      extra: {
        title: "额外收益",
        items: [
          "自有设备销售鸡蛋收益：1.8元/盒",
          "直推设备销售鸡蛋管道收益：0.18元/盒"
        ]
      },
      contact: {
        tel: "400-123-4567",
        address: "湖北省恩施市某某路123号"
      }
    }
  },
  
  callCooperation: function() {
    wx.makePhoneCall({
      phoneNumber: this.data.cooperationInfo.contact.tel
    })
  },
  
  joinNow: function() {
    wx.showModal({
      title: '申请合作',
      content: '感谢您的意向，我们将有专人与您联系，请保持电话畅通',
      showCancel: false,
      confirmText: '确定'
    })
  }
})