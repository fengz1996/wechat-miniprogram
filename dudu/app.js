const api = require('./utils/api');

App({
  onLaunch: function () {
    wx.getSystemInfo({
      success: e => {
        this.globalData.StatusBar = e.statusBarHeight;
        this.globalData.CustomBar = e.platform == 'android' ? e.statusBarHeight + 50 : e.statusBarHeight + 45;
        this.globalData.windowHeight = e.windowHeight;
        this.globalData.windowWidth = e.windowWidth;
      }
    });
    
    // 检查登录状态
    this.checkLogin();
  },
  
  // 检查登录状态
  checkLogin: function() {
    const token = wx.getStorageSync('token');
    if (!token) {
      // 无token，执行登录
      this.login();
    } else {
      // 有token，获取用户信息
      this.getUserInfo();
    }
  },
  
  // 登录
  login: function() {
    wx.login({
      success: (res) => {
        if (res.code) {
          // 发送 code 到后台
          api.login(res.code).then(data => {
            // 保存token
            wx.setStorageSync('token', data.token);
            wx.setStorageSync('userInfo', data.user_info);
            
            this.globalData.userInfo = data.user_info;
            
            // 触发登录成功事件
            if (this.loginCallback) {
              this.loginCallback(data.user_info);
            }
          }).catch(err => {
            console.error('登录失败:', err);
          });
        } else {
          console.error('微信登录失败！' + res.errMsg);
        }
      }
    });
  },
  
  // 获取用户信息
  getUserInfo: function() {
    api.getUserInfo().then(data => {
      wx.setStorageSync('userInfo', data);
      this.globalData.userInfo = data;
      
      // 触发获取用户信息成功事件
      if (this.userInfoCallback) {
        this.userInfoCallback(data);
      }
    }).catch(err => {
      console.error('获取用户信息失败:', err);
      // 如果是401错误，会在request中处理
    });
  },
  
  globalData: {
    userInfo: null,
    StatusBar: 0,
    CustomBar: 0,
    windowHeight: 0,
    windowWidth: 0
  }
})