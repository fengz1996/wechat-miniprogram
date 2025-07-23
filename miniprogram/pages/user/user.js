// pages/user/user.js
import config from '../../utils/config.js'

const app = getApp()

Page({
  data: {
    userInfo: null,
    isLoggedIn: false,
    orderCounts: {
      pending: 0,
      processing: 0,
      delivered: 0,
      cancelled: 0
    }
  },

  onLoad: function () {
    
  },
  
  onShow: function () {
    // 检查登录状态并获取用户信息
    const userInfo = wx.getStorageSync('userInfo')
    const isLoggedIn = app.globalData.isLoggedIn
    
    this.setData({
      userInfo: userInfo,
      isLoggedIn: isLoggedIn
    })
    
    if (isLoggedIn) {
      this.fetchOrderCounts()
    }
  },
  
  // 获取不同状态的订单数量
  fetchOrderCounts: function() {
    // 获取JWT Token
    const token = wx.getStorageSync('token')
    
    if (!token) {
      return
    }
    
    wx.request({
      url: `${config.apiBaseUrl}/mp/api/orders/count`,
      method: 'GET',
      header: {
        'Authorization': `Bearer ${token}`
      },
      success: (res) => {
        if (res.data.code === 200) {
          this.setData({
            orderCounts: res.data.data
          })
        }
      }
    })
  },
  
  // 获取用户信息
  getUserProfile: function() {
    app.getUserProfile()
      .then(userInfo => {
        // 更新头像和昵称
        const token = wx.getStorageSync('token')
        
        // 保存到本地
        const currentUserInfo = wx.getStorageSync('userInfo') || {}
        const updatedUserInfo = {
          ...currentUserInfo,
          nickName: userInfo.nickName,
          avatarUrl: userInfo.avatarUrl
        }
        
        wx.setStorageSync('userInfo', updatedUserInfo)
        
        // 更新UI
        this.setData({
          userInfo: updatedUserInfo
        })
        
        // 上传到服务器（可选）
        this.updateUserInfo(token, updatedUserInfo)
      })
      .catch(err => {
        console.error('获取用户信息失败', err)
      })
  },
  
  // 更新用户信息到服务器
  updateUserInfo: function(token, userInfo) {
    if (!token) return
    
    wx.request({
      url: `${config.apiBaseUrl}/mp/api/user/profile`,
      method: 'PUT',
      header: {
        'Authorization': `Bearer ${token}`
      },
      data: {
        nickName: userInfo.nickName,
        avatarUrl: userInfo.avatarUrl
      },
      success: (res) => {
        if (res.data.code === 200) {
          console.log('用户信息更新成功')
        }
      }
    })
  },
  
  // 去登录
  goLogin: function() {
    app.login()
  },
  
  // 查看全部订单
  viewAllOrders: function() {
    this.navigateToOrderList('')
  },
  
  // 查看不同状态的订单
  viewOrders: function(e) {
    const status = e.currentTarget.dataset.status
    this.navigateToOrderList(status)
  },
  
  // 导航到订单列表
  navigateToOrderList: function(status) {
    wx.navigateTo({
      url: `/pages/order-list/order-list?status=${status}`
    })
  },
  
  // 地址管理
  manageAddress: function() {
    wx.navigateTo({
      url: '/pages/address/address'
    })
  },
  
  // 联系客服
  contactService: function() {
    // 调用微信的客服功能，或者显示客服电话
    wx.showModal({
      title: '联系客服',
      content: '客服电话: 400-123-4567',
      confirmText: '拨打',
      success: (res) => {
        if (res.confirm) {
          wx.makePhoneCall({
            phoneNumber: '4001234567'
          })
        }
      }
    })
  },
  
  // 关于我们
  aboutUs: function() {
    wx.showModal({
      title: '巴巴美食',
      content: '巴巴美食，纯手工零食，无任何添加剂。\n\n版本: 1.0.0\n联系电话: 400-123-4567',
      showCancel: false
    })
  }
})