const api = require('../../utils/api');

Page({
  data: {
    scanSuccess: false,
    deviceInfo: null,
    products: [],
    selectedProduct: null,
    quantity: 1,
    totalPrice: "0.00"
  },
  
  onLoad: function() {
    // 获取设备可售商品
    this.getDeviceProducts();
  },
  
  getDeviceProducts: function() {
    api.getDeviceProducts().then(products => {
      if (products && products.length > 0) {
        const selectedProduct = products[0];
        selectedProduct.selected = true;
        
        this.setData({
          products: products,
          selectedProduct: selectedProduct,
          totalPrice: this.calculateTotal(selectedProduct.price, this.data.quantity)
        });
      }
    }).catch(err => {
      console.error('获取商品失败:', err);
    });
  },
  
  scanCode: function() {
    wx.scanCode({
      success: (res) => {
        const deviceCode = res.result;
        
        // 调用后端API获取设备信息
        api.getDeviceInfo(deviceCode).then(deviceInfo => {
          this.setData({
            scanSuccess: true,
            deviceInfo: deviceInfo
          });
        }).catch(err => {
          wx.showToast({
            title: '设备信息获取失败',
            icon: 'none'
          });
        });
      },
      fail: (error) => {
        wx.showToast({
          title: '扫码失败',
          icon: 'none'
        });
      }
    });
  },

  // 模拟扫码功能（开发用）
  mockScan: function(e) {
    const deviceCode = e.currentTarget.dataset.code;
    
    // 调用后端API获取设备信息
    api.getDeviceInfo(deviceCode).then(deviceInfo => {
      this.setData({
        scanSuccess: true,
        deviceInfo: deviceInfo
      });
    }).catch(err => {
      wx.showToast({
        title: '设备信息获取失败',
        icon: 'none'
      });
    });
  },
  
  selectProduct: function(e) {
    const index = e.currentTarget.dataset.index;
    let products = this.data.products;
    let selectedProduct = null;
    
    products.forEach((item, i) => {
      item.selected = i === index;
      if (i === index) {
        selectedProduct = item;
      }
    });
    
    this.setData({ 
      products,
      selectedProduct,
      totalPrice: this.calculateTotal(selectedProduct.price, this.data.quantity)
    });
  },
  
  changeQuantity: function(e) {
    const type = e.currentTarget.dataset.type;
    let quantity = this.data.quantity;
    
    if (type === 'minus' && quantity > 1) {
      quantity--;
    } else if (type === 'plus' && quantity < 99) {
      quantity++;
    }
    
    this.setData({ 
      quantity,
      totalPrice: this.calculateTotal(this.data.selectedProduct.price, quantity)
    });
  },
  
  calculateTotal: function(price, quantity) {
    return (parseFloat(price) * quantity).toFixed(2);
  },
  
  submitOrder: function() {
    if (!this.data.deviceInfo || !this.data.selectedProduct) {
      wx.showToast({
        title: '请先扫描设备并选择商品',
        icon: 'none'
      });
      return;
    }
    
    // 创建订单
    api.createOrder(
      this.data.deviceInfo.id,
      this.data.selectedProduct.id,
      this.data.quantity
    ).then(orderData => {
      // 显示支付确认
      wx.showModal({
        title: '支付确认',
        content: `需支付 ${orderData.total_amount} 元，确认购买吗？`,
        success: (res) => {
          if (res.confirm) {
            // 模拟支付过程
            wx.showLoading({
              title: '支付中',
            });
            
            // 通知后端支付成功
            api.payOrder(orderData.order_id).then(() => {
              wx.hideLoading();
              wx.showToast({
                title: '支付成功',
                icon: 'success'
              });
              
              // 模拟出蛋过程
              wx.showLoading({
                title: '正在出蛋',
                mask: true
              });
              
              setTimeout(() => {
                wx.hideLoading();
                wx.showModal({
                  title: '取蛋成功',
                  content: '请从设备中取出您的商品',
                  showCancel: false,
                  success: (res) => {
                    if (res.confirm) {
                      this.resetScan();
                    }
                  }
                });
              }, 3000);
            }).catch(err => {
              wx.hideLoading();
              console.error('支付失败:', err);
            });
          }
        }
      });
    }).catch(err => {
      console.error('创建订单失败:', err);
    });
  },
  
  resetScan: function() {
    this.setData({
      scanSuccess: false,
      deviceInfo: null,
      quantity: 1
    });
  }
})