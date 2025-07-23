const api = require('../../utils/api');

Page({
  data: {
    points: 0,
    transactions: [],
    loading: false
  },
  
  onLoad: function() {
    this.getPointInfo();
  },
  
  onPullDownRefresh: function() {
    this.getPointInfo();
    wx.stopPullDownRefresh();
  },
  
  getPointInfo: function() {
    this.setData({ loading: true });
    
    api.getPointsInfo().then(data => {
      this.setData({
        points: data.points || 0,
        transactions: data.transactions || [],
        loading: false
      });
    }).catch(err => {
      console.error('获取积分信息失败:', err);
      this.setData({ loading: false });
    });
  },
  
  navigateToMall: function() {
    wx.switchTab({
      url: '/pages/mall/mall',
    });
  },
  
  // 获取积分类型名称
  getPointTypeName: function(type) {
    const types = {
      1: '获得',
      2: '使用',
      3: '过期'
    };
    return types[type] || '未知';
  }
})