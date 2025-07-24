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
    finalPrice: 0,
    paymentOptions: [
      { id: 'online', name: '微信支付', icon: '../../images/wxpay.png' },
      { id: 'cod', name: '货到付款', icon: '../../images/cod.png' }
    ]
  },

  onLoad: function(options) {
    console.log('订单确认页面加载', options);
    // 检查是否从购物车页面传递了地址信息
    if (options.fromCart && options.fromCart === 'true') {
      // 这里会在onShow中处理地址
      console.log('从购物车页面进入');
    }
  },

  onShow: function() {
    // 加载结算数据
    this.loadCheckoutData();
    
    // 获取购物车选择的地址
    const cartAddress = wx.getStorageSync('address');
    if (cartAddress && !this.data.address) {
      console.log('从购物车获取地址信息', cartAddress);
      this.setData({ address: cartAddress });
      // 存储为结算地址
      wx.setStorageSync('checkoutAddress', cartAddress);
    }
  },

  // 加载结算数据
  loadCheckoutData: function() {
    // 从存储中获取结算商品和地址
    const checkoutItems = wx.getStorageSync('checkoutItems') || [];
    const checkoutAddress = wx.getStorageSync('checkoutAddress');
    
    // 如果没有结算商品，尝试从购物车获取已选中的商品
    let finalItems = checkoutItems;
    if (checkoutItems.length === 0) {
      const cart = wx.getStorageSync('cart') || [];
      const selectedItems = cart.filter(item => item.selected);
      if (selectedItems.length > 0) {
        finalItems = selectedItems;
        wx.setStorageSync('checkoutItems', selectedItems);
      }
    }

    // 计算商品总价和数量
    let totalPrice = 0;
    let totalCount = 0;

    finalItems.forEach(item => {
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
      orderItems: finalItems,
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
      status: 'pending', // 待支付状态
      orderDate: this.formatDate(new Date()) // 格式化后的日期，用于显示
    };

    // 模拟提交订单过程
    wx.showLoading({
      title: '正在提交订单...'
    });

    setTimeout(() => {
      // 生成订单编号
      const timestamp = Date.now();
      const randomNum = Math.floor(Math.random() * 1000);
      const orderId = 'WX' + timestamp.toString() + randomNum.toString().padStart(3, '0');
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
        this.processPayment(orderId, parseFloat(this.data.finalPrice));
      } else {
        // 货到付款，直接显示订单成功
        wx.showToast({
          title: '下单成功',
          icon: 'success'
        });

        // 更新订单状态为待发货
        this.updateOrderStatus(orderId, 'awaiting_shipment');
        
        // 跳转到订单列表页
        setTimeout(() => {
          wx.switchTab({
            url: '/pages/order/order'
          });
        }, 1500);
      }
    }, 1000);
  },
  
// 处理支付 - 真实实现版本
processPayment: function(orderId, amount) {
  console.log(`准备支付订单: ${orderId}, 金额: ${amount}`);
  
  // 显示加载提示
  wx.showLoading({
    title: '请求支付中...'
  });
  
  // 获取应用实例
  const app = getApp();
  
  // 从app.js中获取API基础URL
  const apiBaseUrl = app.globalData.apiBaseUrl;
  
  // 将元转换为分 (微信支付以分为单位)
  const totalFee = Math.floor(amount * 100);
  
  // 构建请求数据
  const requestData = {
    order_id: orderId,
    total_fee: totalFee,
    body: '巴巴美食-订单支付',
    openid: app.globalData.userInfo ? app.globalData.userInfo.openid : '',
    trade_type: 'JSAPI'  // 小程序支付类型固定为JSAPI
  };
  
  console.log('发送到后端的支付请求数据:', requestData);
  
  // 请求后端统一下单接口
  wx.request({
    url: apiBaseUrl + '/mp/api/pay/create_order',  // 与Python后端的支付接口路径匹配
    method: 'POST',
    header: {
      'content-type': 'application/json',
      'Authorization': 'Bearer ' + (app.globalData.token || '')
    },
    data: requestData,
    success: (res) => {
      wx.hideLoading();
      
      console.log('支付接口返回数据:', res.data);
      
      if (res.data.code === 200 && res.data.data) {
        // 获取后端返回的支付参数
        const payParams = res.data.data;
        
        // 调用微信支付接口
        wx.requestPayment({
          timeStamp: payParams.timeStamp,
          nonceStr: payParams.nonceStr,
          package: payParams.package,
          signType: payParams.signType || 'MD5',
          paySign: payParams.paySign,
          success: (result) => {
            console.log('支付成功', result);
            
            // 支付成功后，调用支付结果查询接口
            this.checkPaymentResult(orderId);
          },
          fail: (err) => {
            console.log('支付失败或取消', err);
            
            if (err.errMsg !== 'requestPayment:fail cancel') {
              wx.showToast({
                title: '支付失败',
                icon: 'none'
              });
            } else {
              wx.showToast({
                title: '支付已取消',
                icon: 'none'
              });
            }
            
            // 跳转到订单详情页
            setTimeout(() => {
              wx.redirectTo({
                url: '/pages/order-detail/order-detail?id=' + orderId
              });
            }, 1500);
          }
        });
      } else {
        // 处理后端返回的错误
        const errorMsg = res.data.message || '创建支付订单失败';
        wx.showToast({
          title: errorMsg,
          icon: 'none'
        });
        
        console.error('获取支付参数失败:', res.data);
      }
    },
    fail: (error) => {
      wx.hideLoading();
      console.error('请求支付接口失败:', error);
      
      wx.showToast({
        title: '网络请求失败',
        icon: 'none'
      });
    }
  });
},

// 检查支付结果
checkPaymentResult: function(orderId) {
  const app = getApp();
  const apiBaseUrl = app.globalData.apiBaseUrl;
  
  wx.showLoading({
    title: '确认支付结果...'
  });
  
  // 请求后端查询支付结果
  wx.request({
    url: apiBaseUrl + '/mp/api/pay/query',
    method: 'GET',
    header: {
      'Authorization': 'Bearer ' + (app.globalData.token || '')
    },
    data: {
      order_id: orderId
    },
    success: (res) => {
      wx.hideLoading();
      
      if (res.data.code === 200 && res.data.data && res.data.data.trade_state === 'SUCCESS') {
        // 支付成功
        this.updateOrderStatus(orderId, 'paid');
        
        wx.showToast({
          title: '支付成功',
          icon: 'success'
        });
        
        // 跳转到订单列表页
        setTimeout(() => {
          wx.switchTab({
            url: '/pages/order/order'
          });
        }, 1500);
      } else {
        // 支付可能还在处理中或失败
        const message = res.data.data && res.data.data.trade_state_desc 
          ? res.data.data.trade_state_desc 
          : '支付结果确认失败';
        
        wx.showModal({
          title: '支付提示',
          content: '系统正在确认您的支付结果，请稍后在订单页面查看状态',
          showCancel: false,
          success: () => {
            // 跳转到订单详情页
            wx.redirectTo({
              url: '/pages/order-detail/order-detail?id=' + orderId
            });
          }
        });
      }
    },
    fail: (error) => {
      wx.hideLoading();
      console.error('查询支付结果失败:', error);
      
      wx.showModal({
        title: '支付提示',
        content: '系统无法确认您的支付结果，请稍后在订单页面查看状态',
        showCancel: false,
        success: () => {
          // 跳转到订单详情页
          wx.redirectTo({
            url: '/pages/order-detail/order-detail?id=' + orderId
          });
        }
      });
    }
  });
},
  
  // 更新订单状态
  updateOrderStatus: function(orderId, status) {
    const orders = wx.getStorageSync('orders') || [];
    const orderIndex = orders.findIndex(order => order.orderId === orderId);
    
    if (orderIndex >= 0) {
      orders[orderIndex].status = status;
      wx.setStorageSync('orders', orders);
    }
  },
  
  // 格式化日期
  formatDate: function(date) {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hour = date.getHours().toString().padStart(2, '0');
    const minute = date.getMinutes().toString().padStart(2, '0');
    
    return `${year}-${month}-${day} ${hour}:${minute}`;
  },

  // 选择地址 - 优化地址选择体验
  chooseAddress: function() {
    // 先检查是否已有地址列表
    const addressList = wx.getStorageSync('addressList') || [];
    
    if (addressList.length > 0) {
      // 有地址列表，跳转到地址选择页面
      wx.navigateTo({
        url: '/pages/address/address?from=confirm'
      });
    } else {
      // 直接调用微信地址API
      wx.chooseAddress({
        success: (res) => {
          // 创建新地址对象
          const addressId = 'addr_' + Date.now();
          const address = {
            id: addressId,
            userName: res.userName,
            telNumber: res.telNumber,
            provinceName: res.provinceName,
            cityName: res.cityName,
            countyName: res.countyName,
            detailInfo: res.detailInfo,
            postalCode: res.postalCode,
            isDefault: true,
            // 用于显示的完整地址
            fullAddress: `${res.provinceName}${res.cityName}${res.countyName}${res.detailInfo}`
          };
          
          // 保存到地址列表
          const newAddressList = [address];
          wx.setStorageSync('addressList', newAddressList);
          
          // 保存为默认地址
          wx.setStorageSync('defaultAddress', address);
          
          // 保存到结算地址
          wx.setStorageSync('checkoutAddress', address);
          
          // 更新页面数据
          this.setData({
            address: address
          });
          
          wx.showToast({
            title: '地址添加成功',
            icon: 'success'
          });
        },
        fail: (err) => {
          if (err.errMsg !== 'chooseAddress:fail cancel') {
            wx.showToast({
              title: '获取地址失败',
              icon: 'none'
            });
          }
        }
      });
    }
  }
});