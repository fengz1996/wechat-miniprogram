Page({
  data: {
    userInfo: null,
    hasUserInfo: false,
    walletInfo: {
      balance: '0.00',
      points: '0'
    },
    teamInfo: {
      totalMembers: 0,
      directMembers: 0,
      indirectMembers: 0
    },
    menuItems: [
      { id: 'orders', name: '我的订单', icon: 'order-icon' },
      { id: 'wallet', name: '我的钱包', icon: 'wallet-icon' },
      { id: 'team', name: '我的团队', icon: 'team-icon' },
      { id: 'points', name: '我的积分', icon: 'points-icon' },
      { id: 'about', name: '关于我们', icon: 'about-icon' },
      { id: 'settings', name: '设置', icon: 'settings-icon' }
    ]
  },
  
  onLoad: function() {
    this.checkUserInfo();
  },
  
  checkUserInfo: function() {
    const userInfo = wx.getStorageSync('userInfo');
    if (userInfo) {
      this.setData({
        userInfo: userInfo,
        hasUserInfo: true
      });
    }
  },
  
  getUserProfile: function() {
    wx.getUserProfile({
      desc: '用于完善会员资料',
      success: (res) => {
        wx.setStorageSync('userInfo', res.userInfo);
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        });
      }
    });
  },
  
  navigateToMenuItem: function(e) {
    const id = e.currentTarget.dataset.id;
    
    switch(id) {
      case 'orders':
      case 'wallet':
      case 'team':
      case 'points':
        wx.navigateTo({
          url: `/pages/mine/${id}/${id}`,
        });
        break;
      case 'about':
        wx.showModal({
          title: '关于我们',
          content: '仙嘟嘟鸡蛋销售平台，提供优质新鲜的生态鸡蛋。',
          showCancel: false
        });
        break;
      case 'settings':
        wx.showToast({
          title: '功能开发中',
          icon: 'none'
        });
        break;
    }
  }
})