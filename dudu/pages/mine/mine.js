const api = require('../../utils/api');
const app = getApp();

Page({
  data: {
    userInfo: null,
    hasUserInfo: false,
    walletInfo: {
      balance: '0.00',
      points: '0'
    },
    teamInfo: {
      totalMembers: 0
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
    // 检查是否已经有用户信息
    const userInfo = wx.getStorageSync('userInfo');
    if (userInfo) {
      this.setData({
        userInfo: userInfo,
        hasUserInfo: true
      });
    }
    
    // 监听登录成功事件
    app.userInfoCallback = (userInfo) => {
      this.setData({
        userInfo: userInfo,
        hasUserInfo: true
      });
      
      // 获取钱包信息和团队信息
      this.getWalletInfo();
      this.getTeamInfo();
    };
  },
  
  onShow: function() {
    if (this.data.hasUserInfo) {
      // 刷新钱包和团队数据
      this.getWalletInfo();
      this.getTeamInfo();
    }
  },
  
  getWalletInfo: function() {
    api.getWalletInfo().then(data => {
      this.setData({
        walletInfo: {
          balance: data.balance.toFixed(2),
          points: wx.getStorageSync('userInfo').points || 0
        }
      });
    }).catch(err => {
      console.error('获取钱包信息失败:', err);
    });
  },
  
  getTeamInfo: function() {
    api.getTeamInfo().then(data => {
      this.setData({
        teamInfo: {
          totalMembers: data.team_count || 0
        }
      });
    }).catch(err => {
      console.error('获取团队信息失败:', err);
    });
  },
  
  getUserProfile: function() {
    wx.getUserProfile({
      desc: '用于完善会员资料',
      success: (res) => {
        // 更新用户信息
        const userInfo = wx.getStorageSync('userInfo') || {};
        userInfo.nickname = res.userInfo.nickName;
        userInfo.avatar_url = res.userInfo.avatarUrl;
        
        // 保存到本地
        wx.setStorageSync('userInfo', userInfo);
        
        // 更新到后端
        api.updateUserInfo({
          nickname: res.userInfo.nickName,
          avatar_url: res.userInfo.avatarUrl
        }).then(() => {
          wx.showToast({
            title: '更新成功',
            icon: 'success'
          });
          
          this.setData({
            userInfo: userInfo,
            hasUserInfo: true
          });
        }).catch(err => {
          console.error('更新用户信息失败:', err);
        });
      }
    });
  },
  
  navigateToMenuItem: function(e) {
    const id = e.currentTarget.dataset.id;
    
    switch(id) {
      case 'orders':
        wx.navigateTo({
          url: '/pages/orders/orders',
        });
        break;
      case 'wallet':
        wx.navigateTo({
          url: '/pages/wallet/wallet',
        });
        break;
      case 'team':
        wx.navigateTo({
          url: '/pages/team/team',
        });
        break;
      case 'points':
        wx.navigateTo({
          url: '/pages/points/points',
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