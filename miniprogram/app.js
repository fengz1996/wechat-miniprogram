// app.js
App({
  onLaunch: function () {
    // 检查用户登录状态
    const token = wx.getStorageSync('token');
    if (token) {
      this.globalData.isLoggedIn = true;
      this.globalData.token = token;
      this.globalData.userInfo = wx.getStorageSync('userInfo') || {};
    }
    
    // 获取系统信息
    const systemInfo = wx.getSystemInfoSync();
    this.globalData.statusBarHeight = systemInfo.statusBarHeight;
    
    // 设置主题色
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: '#E86C00'
    });
  },
  
  // 登录方法
  login: function(callback) {
    const that = this;
    wx.login({
      success: res => {
        if (res.code) {
          // 发送 code 到后台换取 token
          wx.request({
            url: this.globalData.apiBaseUrl + '/mp/api/login',
            method: 'POST',
            data: {
              code: res.code
            },
            success: function(response) {
              if (response.data.code === 200) {
                const data = response.data.data;
                wx.setStorageSync('token', data.token);
                wx.setStorageSync('userInfo', data.user);
                that.globalData.isLoggedIn = true;
                that.globalData.token = data.token;
                that.globalData.userInfo = data.user;
                
                if (callback) callback(true);
              } else {
                console.error('登录失败:', response.data.message);
                if (callback) callback(false);
              }
            },
            fail: function(error) {
              console.error('请求登录失败:', error);
              if (callback) callback(false);
            }
          });
        } else {
          console.error('获取code失败:', res.errMsg);
          if (callback) callback(false);
        }
      }
    });
  },
  
  // 显示加载提示
  showLoading: function(title = '加载中') {
    wx.showLoading({
      title: title,
      mask: true
    });
  },
  
  // 隐藏加载提示
  hideLoading: function() {
    wx.hideLoading();
  },
  
  // 显示消息提示
  showToast: function(title, icon = 'none') {
    wx.showToast({
      title: title,
      icon: icon,
      duration: 2000
    });
  },
  
  // 全局数据
  globalData: {
    isLoggedIn: false,
    token: '',
    userInfo: null,
    statusBarHeight: 20,
    apiBaseUrl: 'http://43.139.235.149:5004',  // 小程序API基础URL
    cart: [],  // 购物车数据
    cartTotal: 0,  // 购物车总价格
    cartCount: 0   // 购物车商品数量
  },
  
  // 添加商品到购物车
  addToCart: function(product, quantity = 1) {
    let cart = this.globalData.cart;
    let found = false;
    
    // 检查商品是否已在购物车中
    for (let i = 0; i < cart.length; i++) {
      if (cart[i].id === product.id) {
        cart[i].quantity += quantity;
        found = true;
        break;
      }
    }
    
    // 如果是新商品，添加到购物车
    if (!found) {
      cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: quantity
      });
    }
    
    // 更新购物车数据
    this.updateCartData();
    
    return true;
  },
  
  // 从购物车移除商品
  removeFromCart: function(productId) {
    let cart = this.globalData.cart;
    
    // 过滤掉指定ID的商品
    this.globalData.cart = cart.filter(item => item.id !== productId);
    
    // 更新购物车数据
    this.updateCartData();
  },
  
  // 更新购物车数量
  updateCartQuantity: function(productId, quantity) {
    let cart = this.globalData.cart;
    
    for (let i = 0; i < cart.length; i++) {
      if (cart[i].id === productId) {
        cart[i].quantity = quantity;
        if (quantity <= 0) {
          // 如果数量减至0或以下，移除该商品
          this.removeFromCart(productId);
          return;
        }
        break;
      }
    }
    
    // 更新购物车数据
    this.updateCartData();
  },
  
  // 清空购物车
  clearCart: function() {
    this.globalData.cart = [];
    this.updateCartData();
  },
  
  // 更新购物车统计数据
  updateCartData: function() {
    let cart = this.globalData.cart;
    let totalPrice = 0;
    let totalCount = 0;
    
    for (let i = 0; i < cart.length; i++) {
      totalPrice += cart[i].price * cart[i].quantity;
      totalCount += cart[i].quantity;
    }
    
    this.globalData.cartTotal = totalPrice;
    this.globalData.cartCount = totalCount;
    
    // 将购物车数据保存到本地存储
    wx.setStorageSync('cart', cart);
    wx.setStorageSync('cartTotal', totalPrice);
    wx.setStorageSync('cartCount', totalCount);
  }
})