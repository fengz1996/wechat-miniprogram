Page({
  data: {
    userInfo: {},
    userPhone: ''
  },

  onLoad: function (options) {
    
  },

  onShow: function () {
    // 获取本地存储的用户信息
    const userInfo = wx.getStorageSync('userInfo');
    const userPhone = wx.getStorageSync('userPhone');
    
    if (userInfo) {
      this.setData({ userInfo });
    }
    
    if (userPhone) {
      this.setData({ userPhone });
    }
  },
  
  getUserProfile: function() {
    // 调用微信接口获取用户信息
    wx.getUserProfile({
      desc: '用于完善会员资料',
      success: (res) => {
        this.setData({
          userInfo: res.userInfo
        });
        
        // 存储到本地
        wx.setStorageSync('userInfo', res.userInfo);
        
        // 如果需要，这里可以调用云函数将用户信息存储到数据库
      },
      fail: (err) => {
        console.log('获取用户信息失败', err);
        wx.showToast({
          title: '获取用户信息失败',
          icon: 'none'
        });
      }
    });
  },
  
  navigateToOrder: function() {
    wx.switchTab({
      url: '/pages/order/order'
    });
  },
  
  navigateToOrderWithStatus: function(e) {
    const status = e.currentTarget.dataset.status;
    
    wx.switchTab({
      url: '/pages/order/order',
      success: function() {
        // 设置全局变量，传递状态参数
        getApp().globalData.orderStatus = status;
      }
    });
  },
  
  navigateToAddress: function() {
    wx.chooseAddress({
      success: (res) => {
        // 保存地址信息
        const address = {
          name: res.userName,
          phone: res.telNumber,
          province: res.provinceName,
          city: res.cityName,
          district: res.countyName,
          detail: res.detailInfo
        };
        
        wx.setStorageSync('address', address);
        
        wx.showToast({
          title: '地址保存成功',
          icon: 'success'
        });
      },
      fail: (err) => {
        if (err.errMsg !== "chooseAddress:fail cancel") {
          wx.showToast({
            title: '获取地址失败',
            icon: 'none'
          });
        }
      }
    });
  },
  
  contact: function() {
    wx.showModal({
      title: '联系客服',
      content: '客服电话：123-4567-8910\n营业时间：9:00-24:00',
      showCancel: false
    });
  },
  
  about: function() {
    wx.showModal({
      title: '关于我们',
      content: '巴巴美食\n纯手工制作，无任何添加剂\n城区花园内满68元免费配送，其他地区满168元顺丰包邮',
      showCancel: false
    });
  }
})