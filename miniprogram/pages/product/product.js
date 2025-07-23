// pages/product/product.js
import config from '../../utils/config.js'

Page({
  data: {
    productId: null,
    product: null,
    quantity: 1,
    loading: true
  },

  onLoad: function (options) {
    if (options.id) {
      this.setData({
        productId: options.id
      })
      
      this.fetchProductDetail()
    } else {
      this.showError('商品ID无效')
      setTimeout(() => {
        wx.navigateBack()
      }, 1500)
    }
  },
  
  // 获取商品详情
  fetchProductDetail: function() {
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    
    wx.request({
      url: `${config.apiBaseUrl}/mp/api/products/${this.data.productId}`,
      method: 'GET',
      success: (res) => {
        wx.hideLoading()
        
        if (res.data.code === 200) {
          this.setData({
            product: res.data.data,
            loading: false
          })
          
          // 设置导航栏标题
          wx.setNavigationBarTitle({
            title: res.data.data.name
          })
        } else {
          this.showError('获取商品详情失败')
          setTimeout(() => {
            wx.navigateBack()
          }, 1500)
        }
      },
      fail: () => {
        wx.hideLoading()
        this.showError('网络错误，请重试')
        setTimeout(() => {
          wx.navigateBack()
        }, 1500)
      }
    })
  },
  
  // 减少数量
  decreaseQuantity: function() {
    if (this.data.quantity > 1) {
      this.setData({
        quantity: this.data.quantity - 1
      })
    }
  },
  
  // 增加数量
  increaseQuantity: function() {
    if (this.data.quantity < this.data.product.stock) {
      this.setData({
        quantity: this.data.quantity + 1
      })
    } else {
      this.showError('已达到最大库存')
    }
  },
  
  // 添加到购物车
  addToCart: function() {
    const app = getApp()
    app.addToCart(this.data.product, this.data.quantity)
    
    wx.showToast({
      title: '已加入购物车',
      icon: 'success'
    })
  },
  
  // 立即购买
  buyNow: function() {
    const app = getApp()
    app.addToCart(this.data.product, this.data.quantity)
    
    wx.switchTab({
      url: '/pages/cart/cart'
    })
  },
  
  // 查看相似商品
  viewSimilarProduct: function(e) {
    const productId = e.currentTarget.dataset.id
    
    wx.redirectTo({
      url: `/pages/product/product?id=${productId}`
    })
  },
  
  // 分享商品
  onShareAppMessage: function() {
    if (this.data.product) {
      return {
        title: this.data.product.name,
        path: `/pages/product/product?id=${this.data.productId}`
      }
    }
    
    return {
      title: '巴巴美食',
      path: '/pages/index/index'
    }
  },
  
  // 显示错误提示
  showError: function(message) {
    wx.showToast({
      title: message,
      icon: 'none'
    })
  }
})