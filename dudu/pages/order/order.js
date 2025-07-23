const api = require('../../utils/api');

Page({
  data: {
    activeTab: 0,  // 0: 全部, 1: 已支付, 2: 已完成, 3: 已取消
    orders: [],
    tabs: [
      { id: null, name: '全部' },
      { id: 1, name: '已支付' },
      { id: 2, name: '已完成' },
      { id: 3, name: '已取消' }
    ],
    loading: false
  },
  
  onLoad: function() {
    this.getOrders();
  },
  
  onShow: function() {
    this.getOrders();
  },
  
  onPullDownRefresh: function() {
    this.getOrders();
    wx.stopPullDownRefresh();
  },
  
  changeTab: function(e) {
    const index = e.currentTarget.dataset.index;
    const tabId = this.data.tabs[index].id;
    
    this.setData({
      activeTab: index
    });
    
    this.getOrders(tabId);
  },
  
  getOrders: function(status = null) {
    this.setData({ loading: true });
    
    wx.showLoading({
      title: '加载中',
    });
    
    api.getOrders(status).then(orders => {
      this.setData({ 
        orders: orders || [],
        loading: false
      });
      wx.hideLoading();
    }).catch(err => {
      console.error('获取订单失败:', err);
      this.setData({ loading: false });
      wx.hideLoading();
    });
  },
  
  // 支付订单
  payOrder: function(e) {
    const orderId = e.currentTarget.dataset.id;
    
    wx.showModal({
      title: '确认支付',
      content: '是否确认支付该订单？',
      success: (res) => {
        if (res.confirm) {
          wx.showLoading({
            title: '支付中',
          });
          
          api.payOrder(orderId).then(() => {
            wx.hideLoading();
            wx.showToast({
              title: '支付成功',
              icon: 'success'
            });
            
            // 刷新订单列表
            this.getOrders(this.data.tabs[this.data.activeTab].id);
          }).catch(err => {
            wx.hideLoading();
            console.error('支付失败:', err);
          });
        }
      }
    });
  },
  
  // 获取订单状态文字
  getOrderStatusText: function(status) {
    const statusMap = {
      0: '待支付',
      1: '已支付',
      2: '已完成',
      3: '已取消'
    };
    return statusMap[status] || '未知状态';
  },
  
  // 获取支付方式文字
  getPayTypeText: function(payType) {
    const payTypeMap = {
      1: '微信支付',
      2: '积分支付'
    };
    return payTypeMap[payType] || '未知方式';
  }
})