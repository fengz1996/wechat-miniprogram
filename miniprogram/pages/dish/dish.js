// dish.js
const app = getApp();

Page({
  data: {
    id: null,
    product: {},
    quantity: 1,
    cartCount: 0,
    cartTotal: 0
  },

  onLoad: function(options) {
    if (options.id) {
      this.setData({
        id: options.id
      });
      this.loadProductDetail(options.id);
    } else {
      app.showToast('商品ID不存在');
      setTimeout(() => {
        wx.navigateBack();
      }, 1500);
    }
  },
  
  onShow: function() {
    // 更新购物车数据
    this.setData({
      cartCount: app.globalData.cartCount,
      cartTotal: app.globalData.cartTotal.toFixed(2)
    });
  },
  
  // 加载商品详情
  loadProductDetail: function(id) {
    app.showLoading();
    
    wx.request({
      url: app.globalData.apiBaseUrl + '/mp/api/products/' + id,
      method: 'GET',
      success: res => {
        if (res.data.code === 200) {
          this.setData({
            product: res.data.data
          });
        } else {
          app.showToast('获取商品详情失败');
          setTimeout(() => {
            wx.navigateBack();
          }, 1500);
        }
      },
      fail: err => {
        console.error('请求失败:', err);
        app.showToast('网络请求失败');
        setTimeout(() => {
          wx.navigateBack();
        }, 1500);
      },
      complete: () => {
        app.hideLoading();
      }
    });
  },
  
  // 导航回上一页
  navigateBack: function() {
    wx.navigateBack();
  },
  
  // 导航到另一个商品详情
  navigateToProduct: function(e) {
    const productId = e.currentTarget.dataset.id;
    // 使用redirectTo避免页面堆栈过多
    wx.redirectTo({
      url: `/pages/dish/dish?id=${productId}`
    });
  },
  
  // 导航到购物车
  navigateToCart: function() {
    wx.switchTab({
      url: '/pages/cart/cart'
    });
  },
  
  // 增加商品数量
  increaseQuantity: function() {
    // 限制最大购买数量为99
    if (this.data.quantity < 99) {
      this.setData({
        quantity: this.data.quantity + 1
      });
    }
  },
  
  // 减少商品数量
  decreaseQuantity: function() {
    if (this.data.quantity > 1) {
      this.setData({
        quantity: this.data.quantity - 1
      });
    }
  },
  
  // 添加到购物车
  addToCart: function() {
    // 检查商品是否有效
    if (!this.data.product || !this.data.product.id) {
      app.showToast('商品信息不完整');
      return;
    }
    
    // 添加到购物车
    if (app.addToCart(this.data.product, this.data.quantity)) {
      // 更新购物车数据
      this.setData({
        cartCount: app.globalData.cartCount,
        cartTotal: app.globalData.cartTotal.toFixed(2)
      });
      
      // 显示成功提示
      app.showToast('已加入购物车', 'success');
      
      // 重置数量
      this.setData({
        quantity: 1
      });
    }
  },
  
  // 立即购买
  buyNow: function() {
    // 检查商品是否有效
    if (!this.data.product || !this.data.product.id) {
      app.showToast('商品信息不完整');
      return;
    }
    
    // 先清空购物车
    app.clearCart();
    
    // 添加当前商品到购物车
    app.addToCart(this.data.product, this.data.quantity);
    
    // 导航到购物车页面
    wx.switchTab({
      url: '/pages/cart/cart'
    });
  },
  
  // 分享
  onShareAppMessage: function() {
    return {
      title: this.data.product.name,
      path: '/pages/dish/dish?id=' + this.data.id,
      imageUrl: this.data.product.image
    };
  }
})