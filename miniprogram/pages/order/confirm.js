// pages/order/confirm.js
Page({
  data: {
    orderItems: [],
    address: null,
    totalPrice: 0,
    totalCount: 0,
    remark: '',
    paymentMethod: 'online', // 默认在线支付
    deliveryMethod: 'delivery', // 默认配送
    deliveryFee: 5, // 默认配送费
    minFreeDelivery: 30, // 最低免配送费金额
    discounts: [], // 可用优惠
    appliedDiscount: null, // 已应用的优惠
    finalPrice: 0
  },

  onLoad: function(options) {
    console.log('订单确认页面加载');
  },

  onShow: function() {
    this.loadCheckoutData();
  },

  // 加载结算数据
  loadCheckoutData: function() {
    // 从存储中获取结算商品和地址
    const checkoutItems = wx.getStorageSync('checkoutItems') || [];
    const checkoutAddress = wx.getStorageSync('checkoutAddress');

    // 计算商品总价和数量
    let totalPrice = 0;
    let totalCount = 0;

    checkoutItems.forEach(item => {
      totalPrice += item.price * item.quantity;
      totalCount += item.quantity;
    });

    // 计算配送费
    const deliveryFee = totalPrice >= this.data.minFreeDelivery ? 0 : this.data.deliveryFee;
    
    // 加载可用优惠
    const discounts = this.loadAvailableDiscounts(totalPrice);
    
    // 计算最终价格
    const finalPrice = totalPrice + deliveryFee;

    this.setData({
      orderItems: checkoutItems,
      address: checkoutAddress,
      totalPrice: totalPrice.toFixed(2),
      totalCount,
      deliveryFee: deliveryFee.toFixed(2),
      discounts,
      finalPrice: finalPrice.toFixed(2)
    });
  },

  // 加载可用优惠
  loadAvailableDiscounts: function(totalPrice) {
    // 这里可以根据实际情况从后端获取优惠信息
    // 这里使用模拟数据
    const discounts = [
      {
        id: 'discount1',
        name: '满30减5',
        type: 'minus',
        threshold: 30,
        value: 5,
        available: totalPrice >= 30
      },
      {
        id: 'discount2',
        name: '满50减10',
        type: 'minus',
        threshold: 50,
        value: 10,
        available: totalPrice >= 50
      },
      {
        id: 'discount3',
        name: '满100减20',
        type: 'minus',
        threshold: 100,
        value: 20,
        available: totalPrice >= 100
      }
    ];

    // 筛选可用优惠
    return discounts.filter(item => item.available);
  },

  // 选择优惠
  selectDiscount: function(e) {
    const discountId = e.currentTarget.dataset.id;
    const discounts = this.data.discounts;
    const selectedDiscount = discounts.find(item => item.id === discountId);

    if (selectedDiscount) {
      // 计算应用优惠后的价格
      let finalPrice = parseFloat(this.data.totalPrice) + parseFloat(this.data.deliveryFee) - selectedDiscount.value;
      finalPrice = finalPrice < 0 ? 0 : finalPrice;

      this.setData({
        appliedDiscount: selectedDiscount,
        finalPrice: finalPrice.toFixed(2)
      });
    }
  },

  // 移除应用的优惠
  removeDiscount: function() {
    const finalPrice = parseFloat(this.data.totalPrice) + parseFloat(this.data.deliveryFee);
    
    this.setData({
      appliedDiscount: null,
      finalPrice: finalPrice.toFixed(2)
    });
  },

  // 切换配送方式
  switchDeliveryMethod: function(e) {
    const method = e.currentTarget.dataset.method;
    
    let deliveryFee = 0;
    if (method === 'delivery') {
      // 如果选择配送，计算配送费
      deliveryFee = parseFloat(this.data.totalPrice) >= this.data.minFreeDelivery ? 0 : this.data.deliveryFee;
    }
    
    // 计算最终价格
    let finalPrice = parseFloat(this.data.totalPrice) + deliveryFee;
    if (this.data.appliedDiscount) {
      finalPrice -= this.data.appliedDiscount.value;
      finalPrice = finalPrice < 0 ? 0 : finalPrice;
    }
    
    this.setData({
      deliveryMethod: method,
      deliveryFee: deliveryFee.toFixed(2),
      finalPrice: finalPrice.toFixed(2)
    });
  },

  // 切换支付方式
  switchPaymentMethod: function(e) {
    const method = e.currentTarget.dataset.method;
    this.setData({
      paymentMethod: method
    });
  },

  // 更改备注
  onRemarkInput: function(e) {
    this.setData({
      remark: e.detail.value
    });
  },

  // 提交订单
  submitOrder: function() {
    // 检查地址
    if (!this.data.address) {
      wx.showToast({
        title: '请先选择收货地址',
        icon: 'none'
      });
      return;
    }

    // 检查商品
    if (this.data.orderItems.length === 0) {
      wx.showToast({
        title: '您没有选择任何商品',
        icon: 'none'
      });
      return;
    }

    // 构建订单数据
    const orderData = {
      items: this.data.orderItems,
      address: this.data.address,
      totalPrice: this.data.totalPrice,
      deliveryFee: this.data.deliveryFee,
      discount: this.data.appliedDiscount,
      finalPrice: this.data.finalPrice,
      remark: this.data.remark,
      paymentMethod: this.data.paymentMethod,
      deliveryMethod: this.data.deliveryMethod,
      orderTime: new Date().toISOString(),
      status: 'pending' // 待支付状态
    };

    // 模拟提交订单过程
    wx.showLoading({
      title: '正在提交订单...'
    });

    setTimeout(() => {
      // 生成订单编号
      const orderId = 'ORDER' + Date.now().toString().slice(-8);
      orderData.orderId = orderId;

      // 保存订单到本地存储
      const orders = wx.getStorageSync('orders') || [];
      orders.unshift(orderData);
      wx.setStorageSync('orders', orders);

      // 清空结算数据
      wx.removeStorageSync('checkoutItems');

      // 清空购物车中已结算的商品
      const cart = wx.getStorageSync('cart') || [];
      const newCart = cart.filter(item => !item.selected);
      wx.setStorageSync('cart', newCart);

      wx.hideLoading();

      // 根据支付方式处理
      if (this.data.paymentMethod === 'online') {
        // 在线支付，跳转到支付页面
        wx.navigateTo({
          url: '/pages/payment/payment?orderId=' + orderId + '&amount=' + this.data.finalPrice
        });
      } else {
        // 货到付款，直接显示订单成功
        wx.showToast({
          title: '下单成功',
          icon: 'success'
        });

        // 跳转到订单详情页
        setTimeout(() => {
          wx.redirectTo({
            url: '/pages/order/detail?id=' + orderId
          });
        }, 1500);
      }
    }, 1500);
  },

  // 选择地址
  chooseAddress: function() {
    wx.navigateTo({
      url: '/pages/address/address?from=confirm'
    });
  }
});