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
    
    // 页面加载时立即检查登录状态
    this.checkAndLogin();
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
  
// 检查登录状态并自动登录
checkAndLogin: function() {
  // 检查是否已登录
  if (!this.getToken()) {
      console.log('未检测到登录状态，准备登录');
      
      // 尝试登录
      this.doLogin(() => {
          console.log('登录回调执行');
      });
  } else {
      console.log('已登录状态');
  }
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

  // 由于后端登录问题，临时模拟订单提交成功
  wx.showLoading({
      title: '正在提交订单...'
  });
  
  setTimeout(() => {
      wx.hideLoading();
      
      // 订单创建"成功"
      const orderId = 'ORDER_' + Date.now();
      
      // 清空结算数据
      wx.removeStorageSync('checkoutItems');

      // 清空购物车中已结算的商品
      const cart = wx.getStorageSync('cart') || [];
      const newCart = cart.filter(item => !this.data.orderItems.some(orderItem => orderItem.id === item.id));
      wx.setStorageSync('cart', newCart);
      
      // 更新app中的购物车数据
      const app = getApp();
      app.globalData.cart = newCart;
      if (app.updateCartData) {
          app.updateCartData();
      }

      if (this.data.paymentMethod === 'online') {
          // 模拟支付成功
          wx.showToast({
              title: '模拟支付成功',
              icon: 'success'
          });
          
          setTimeout(() => {
              wx.switchTab({
                  url: '/pages/order/order'
              });
          }, 1500);
      } else {
          // 货到付款
          wx.showToast({
              title: '下单成功',
              icon: 'success'
          });
          
          setTimeout(() => {
              wx.switchTab({
                  url: '/pages/order/order'
              });
          }, 1500);
      }
  }, 1500);
},
  
  // 执行登录
  doLogin: function(callback) {
    wx.showLoading({
      title: '登录中...'
    });
    
    const app = getApp();
    
    // 调用app.js中的登录方法
    app.login(function(success) {
      wx.hideLoading();
      
      if (success) {
        console.log('登录成功');
        if (callback) callback();
      } else {
        console.log('登录失败');
        wx.showToast({
          title: '登录失败，请重试',
          icon: 'none'
        });
      }
    });
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

    // 检查是否已登录，如未登录则先登录再提交订单
    if (!this.getToken()) {
      wx.showToast({
        title: '正在为您登录...',
        icon: 'none'
      });
      
      this.doLogin(() => {
        // 登录成功后继续提交订单
        this.submitOrderAfterLogin();
      });
      return;
    }
    
    // 已登录状态，直接提交订单
    this.submitOrderAfterLogin();
  },
  
  // 登录后提交订单的实际执行函数
  submitOrderAfterLogin: function() {
    // 构建订单数据
    const orderData = {
      items: this.data.orderItems.map(item => ({
        id: item.id,
        quantity: item.quantity
      })),
      customerName: this.data.address.userName,
      phone: this.data.address.telNumber,
      address: `${this.data.address.provinceName}${this.data.address.cityName}${this.data.address.countyName}${this.data.address.detailInfo}`,
      remark: this.data.remark
    };

    // 显示加载提示
    wx.showLoading({
      title: '正在提交订单...'
    });

    // 获取应用实例和token
    const app = getApp();
    const token = this.getToken();
    
    // 再次检查token（以防登录过程中出现问题）
    if (!token) {
      wx.hideLoading();
      wx.showToast({
        title: '登录状态异常，请重试',
        icon: 'none'
      });
      return;
    }

    console.log('提交订单使用的token:', token);

    // 请求后端创建订单
    wx.request({
      url: app.globalData.apiBaseUrl + '/mp/api/orders',
      method: 'POST',
      header: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
      data: orderData,
      success: (res) => {
        wx.hideLoading();
        
        if (res.data.code === 200) {
          // 订单创建成功
          const orderResult = res.data.data;
          
          // 清空结算数据
          wx.removeStorageSync('checkoutItems');

          // 清空购物车中已结算的商品
          const cart = wx.getStorageSync('cart') || [];
          const newCart = cart.filter(item => !this.data.orderItems.some(orderItem => orderItem.id === item.id));
          wx.setStorageSync('cart', newCart);
          
          // 更新app中的购物车数据
          app.globalData.cart = newCart;
          app.updateCartData();

          // 根据支付方式处理
          if (this.data.paymentMethod === 'online') {
            this.processPayment(orderResult.orderId, parseFloat(this.data.finalPrice));
          } else {
            // 货到付款，直接显示订单成功
            wx.showToast({
              title: '下单成功',
              icon: 'success'
            });
            
            // 跳转到订单列表页
            setTimeout(() => {
              wx.switchTab({
                url: '/pages/order/order'
              });
            }, 1500);
          }
        } else {
          // 处理订单创建失败
          wx.showToast({
            title: res.data.message || '创建订单失败',
            icon: 'none'
          });
        }
      },
      fail: (error) => {
        wx.hideLoading();
        console.error('提交订单失败:', error);
        
        wx.showToast({
          title: '网络请求失败，请重试',
          icon: 'none'
        });
      }
    });
  },
  
  // 获取token的辅助方法
  getToken: function() {
    const app = getApp();
    // 首先尝试从全局变量获取token
    let token = app.globalData.token;
    
    // 如果全局变量中没有token，尝试从本地存储获取
    if (!token) {
      token = wx.getStorageSync('token');
      
      // 如果从本地存储获取到了token，更新全局变量
      if (token) {
        app.globalData.token = token;
      }
    }
    
    return token;
  },
  
  // 处理支付
processPayment: function(orderId, amount) {
  console.log(`准备支付订单: ${orderId}, 金额: ${amount}`);
  
  // 显示加载提示
  wx.showLoading({
    title: '处理中...'
  });
  
  // 模拟支付成功
  setTimeout(() => {
    wx.hideLoading();
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
  }, 1500);
},
  
  // 登录后处理支付的实际执行函数
  processPaymentAfterLogin: function(orderId, amount) {
    // 显示加载提示
    wx.showLoading({
      title: '请求支付中...'
    });
    
    // 获取应用实例
    const app = getApp();
    
    // 获取token
    const token = this.getToken();
    
    // 再次检查token
    if (!token) {
      wx.hideLoading();
      wx.showToast({
        title: '登录状态异常，请重试',
        icon: 'none'
      });
      return;
    }
    
    // 将元转换为分 (微信支付以分为单位)
    const totalFee = Math.floor(amount * 100);
    
    // 构建请求数据
    const requestData = {
      order_id: orderId,
      total_fee: totalFee,
      body: '巴巴美食-订单支付'
    };
    
    console.log('发送到后端的支付请求数据:', requestData);
    console.log('支付请求使用的token:', token);
    
    // 请求后端统一下单接口
    wx.request({
      url: app.globalData.apiBaseUrl + '/mp/api/pay/create_order',
      method: 'POST',
      header: {
        'content-type': 'application/json',
        'Authorization': 'Bearer ' + token
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
    
    // 获取token
    const token = this.getToken();
    
    if (!token) {
      wx.showToast({
        title: '登录状态异常，请重试',
        icon: 'none'
      });
      return;
    }
    
    wx.showLoading({
      title: '确认支付结果...'
    });
    
    // 请求后端查询支付结果
    wx.request({
      url: app.globalData.apiBaseUrl + '/mp/api/pay/query',
      method: 'GET',
      header: {
        'Authorization': 'Bearer ' + token
      },
      data: {
        order_id: orderId
      },
      success: (res) => {
        wx.hideLoading();
        
        if (res.data.code === 200 && res.data.data && res.data.data.trade_state === 'SUCCESS') {
          // 支付成功
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