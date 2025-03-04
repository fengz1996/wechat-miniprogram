Page({
  data: {
    cartItems: [],
    totalPrice: 0,
    deliveryFee: 0,
    totalAmount: 0,
    address: null,
    remarks: ''
  },

  onLoad: function (options) {
    
  },

  onShow: function () {
    this.updateCart();
  },
  
  updateCart: function() {
    const app = getApp();
    const cartItems = app.globalData.cart;
    let totalPrice = 0;
    
    cartItems.forEach(item => {
      totalPrice += item.price * item.quantity;
    });
    
    // 计算配送费，满68元免配送费，否则5元
    const deliveryFee = totalPrice >= 68 ? 0 : 5;
    const totalAmount = totalPrice + deliveryFee;
    
    this.setData({
      cartItems,
      totalPrice,
      deliveryFee,
      totalAmount
    });
  },
  
  increaseQuantity: function(e) {
    const id = e.currentTarget.dataset.id;
    const app = getApp();
    const cartItems = app.globalData.cart;
    
    const index = cartItems.findIndex(item => item.id === id);
    if (index > -1) {
      cartItems[index].quantity += 1;
      app.globalData.cart = cartItems;
      this.updateCart();
    }
  },
  
  decreaseQuantity: function(e) {
    const id = e.currentTarget.dataset.id;
    const app = getApp();
    const cartItems = app.globalData.cart;
    
    const index = cartItems.findIndex(item => item.id === id);
    if (index > -1) {
      if (cartItems[index].quantity > 1) {
        cartItems[index].quantity -= 1;
      } else {
        cartItems.splice(index, 1);
      }
      app.globalData.cart = cartItems;
      this.updateCart();
    }
  },
  
  onQuantityInput: function(e) {
    const id = e.currentTarget.dataset.id;
    const quantity = parseInt(e.detail.value);
    const app = getApp();
    const cartItems = app.globalData.cart;
    
    if (isNaN(quantity) || quantity < 1) return;
    
    const index = cartItems.findIndex(item => item.id === id);
    if (index > -1) {
      cartItems[index].quantity = quantity;
      app.globalData.cart = cartItems;
      this.updateCart();
    }
  },
  
  removeItem: function(e) {
    const id = e.currentTarget.dataset.id;
    const app = getApp();
    const cartItems = app.globalData.cart;
    
    const index = cartItems.findIndex(item => item.id === id);
    if (index > -1) {
      cartItems.splice(index, 1);
      app.globalData.cart = cartItems;
      this.updateCart();
    }
  },
  
  clearCart: function() {
    wx.showModal({
      title: '提示',
      content: '确定要清空购物车吗？',
      success: (res) => {
        if (res.confirm) {
          const app = getApp();
          app.globalData.cart = [];
          this.updateCart();
        }
      }
    });
  },
  
  selectAddress: function() {
    wx.chooseAddress({
      success: (res) => {
        this.setData({
          address: {
            name: res.userName,
            phone: res.telNumber,
            province: res.provinceName,
            city: res.cityName,
            district: res.countyName,
            detail: res.detailInfo
          }
        });
      }
    });
  },
  
  onRemarksInput: function(e) {
    this.setData({
      remarks: e.detail.value
    });
  },
  
  navigateToMenu: function() {
    wx.switchTab({
      url: '/pages/menu/menu'
    });
  },
  
  placeOrder: function() {
    if (this.data.cartItems.length === 0) {
      wx.showToast({
        title: '购物车为空',
        icon: 'none'
      });
      return;
    }
    
    if (!this.data.address) {
      wx.showToast({
        title: '请选择收货地址',
        icon: 'none'
      });
      return;
    }
    
    // 这里应该调用云函数创建订单
    // 由于支付接口需要单独申请和配置，我们先模拟下单成功
    wx.showLoading({
      title: '下单中...',
    });
    
    setTimeout(() => {
      wx.hideLoading();
      
      // 清空购物车
      const app = getApp();
      app.globalData.cart = [];
      
      wx.showToast({
        title: '下单成功',
        icon: 'success',
        duration: 2000,
        success: () => {
          // 跳转到订单页
          setTimeout(() => {
            wx.switchTab({
              url: '/pages/order/order'
            });
          }, 2000);
        }
      });
    }, 1500);
  }
})