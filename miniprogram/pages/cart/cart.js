const app = getApp()

Page({
  data: {
    cartItems: [],
    totalPrice: 0,
    selectedCount: 0,
    allSelected: false,
    showEmpty: false,
    address: null,  // 添加地址属性
    showAddressModal: false  // 用于控制地址选择模态框
  },

  onLoad: function () {
    
  },
  
  onShow: function () {
    // 每次显示页面时更新购物车数据
    this.loadCartData()
    
    // 获取地址信息
    this.loadAddress()
  },

  // 加载用户地址
  loadAddress: function() {
    // 从本地存储获取默认地址
    const address = wx.getStorageSync('defaultAddress')
    if (address) {
      this.setData({
        address: address
      })
    }
  },

  // 选择地址
  chooseAddress: function() {
    wx.chooseAddress({
      success: (res) => {
        const address = {
          userName: res.userName,
          telNumber: res.telNumber,
          provinceName: res.provinceName,
          cityName: res.cityName,
          countyName: res.countyName,
          detailInfo: res.detailInfo,
          postalCode: res.postalCode
        }
        
        // 保存地址
        wx.setStorageSync('defaultAddress', address)
        this.setData({
          address: address
        })
        
        wx.showToast({
          title: '地址设置成功',
          icon: 'success'
        })
      },
      fail: (err) => {
        if (err.errMsg !== 'chooseAddress:fail cancel') {
          wx.showToast({
            title: '获取地址失败',
            icon: 'none'
          })
        }
      }
    })
  },

  // 加载购物车数据
  loadCartData: function() {
    const cart = wx.getStorageSync('cart') || []
    
    // 计算选中商品价格和数量
    let totalPrice = 0
    let selectedCount = 0
    let allSelected = cart.length > 0
    
    cart.forEach(item => {
      if (item.selected) {
        totalPrice += item.price * item.quantity
        selectedCount += item.quantity
      } else {
        allSelected = false
      }
    })
    
    this.setData({
      cartItems: cart,
      totalPrice: totalPrice.toFixed(2),
      selectedCount: selectedCount,
      allSelected: allSelected,
      showEmpty: cart.length === 0
    })
  },

  // 商品数量增加
  increaseQuantity: function(e) {
    const index = e.currentTarget.dataset.index
    const cart = this.data.cartItems
    
    cart[index].quantity += 1
    
    // 更新购物车
    wx.setStorageSync('cart', cart)
    this.updateCart(cart)
  },

  // 商品数量减少
  decreaseQuantity: function(e) {
    const index = e.currentTarget.dataset.index
    const cart = this.data.cartItems
    
    if (cart[index].quantity > 1) {
      cart[index].quantity -= 1
      
      // 更新购物车
      wx.setStorageSync('cart', cart)
      this.updateCart(cart)
    }
  },

  // 删除商品
  removeItem: function(e) {
    const index = e.currentTarget.dataset.index
    const cart = this.data.cartItems
    
    // 从购物车中移除商品
    cart.splice(index, 1)
    
    // 更新购物车
    wx.setStorageSync('cart', cart)
    this.updateCart(cart)
  },

  // 切换商品选中状态
  toggleItemSelect: function(e) {
    const index = e.currentTarget.dataset.index
    const cart = this.data.cartItems
    
    cart[index].selected = !cart[index].selected
    
    // 更新购物车
    wx.setStorageSync('cart', cart)
    this.updateCart(cart)
  },

  // 切换全选状态
  toggleAllSelect: function() {
    const cart = this.data.cartItems
    const newState = !this.data.allSelected
    
    // 更新所有商品的选中状态
    cart.forEach(item => {
      item.selected = newState
    })
    
    // 更新购物车
    wx.setStorageSync('cart', cart)
    this.updateCart(cart)
  },

  // 更新购物车数据和界面
  updateCart: function(cart) {
    // 计算选中商品价格和数量
    let totalPrice = 0
    let selectedCount = 0
    let allSelected = cart.length > 0
    
    cart.forEach(item => {
      if (item.selected) {
        totalPrice += item.price * item.quantity
        selectedCount += item.quantity
      } else {
        allSelected = false
      }
    })
    
    this.setData({
      cartItems: cart,
      totalPrice: totalPrice.toFixed(2),
      selectedCount: selectedCount,
      allSelected: allSelected,
      showEmpty: cart.length === 0
    })
  },

  // 结算
  checkout: function() {
    if (this.data.selectedCount === 0) {
      wx.showToast({
        title: '请选择商品',
        icon: 'none'
      })
      return
    }
    
    // 检查是否已选择地址
    if (!this.data.address) {
      wx.showModal({
        title: '提示',
        content: '请先选择收货地址',
        confirmText: '选择地址',
        success: (res) => {
          if (res.confirm) {
            this.chooseAddress()
          }
        }
      })
      return
    }
    
    // 确认支付
    wx.showModal({
      title: '确认支付',
      content: `需支付 ¥${this.data.totalPrice}，是否继续？`,
      confirmText: '确认支付',
      success: (res) => {
        if (res.confirm) {
          this.payOrder()
        }
      }
    })
  },

  // 支付订单
  payOrder: function() {
    if (this.data.selectedCount === 0) {
      wx.showToast({ title: '请选择商品', icon: 'none' })
      return
    }
    
    if (!this.data.address) {
      wx.showModal({
        title: '提示',
        content: '请先选择收货地址',
        confirmText: '选择地址',
        success: (res) => {
          if (res.confirm) {
            this.chooseAddress()
          }
        }
      })
      return
    }

    wx.showLoading({ title: '支付中...' })

    // 获取选中的商品
    const selectedItems = this.data.cartItems.filter(item => item.selected)

    // 调用云函数统一下单获取支付参数
    wx.cloud.callFunction({
      name: 'payOrder', // 云函数名
      data: {
        cart: selectedItems,
        address: this.data.address,
        totalAmount: parseFloat(this.data.totalPrice)
      },
      success: res => {
        const payment = res.result.payment
        wx.requestPayment({
          ...payment, // timeStamp, nonceStr, package, signType, paySign
          success: payRes => {
            // 支付成功后处理
            this.handlePaymentSuccess(selectedItems)
          },
          fail: err => {
            if (err.errMsg !== 'requestPayment:fail cancel') {
              wx.showToast({ title: '支付失败', icon: 'none' })
            } else {
              wx.showToast({ title: '取消支付', icon: 'none' })
            }
          }
        })
      },
      fail: err => {
        wx.showToast({ 
          title: '支付失败：' + (err.errMsg || '未知错误'), 
          icon: 'none' 
        })
      },
      complete: () => {
        wx.hideLoading()
      }
    })
  },
  
  // 支付成功后的处理
  handlePaymentSuccess: function(paidItems) {
    // 从购物车中移除已购买商品
    let cart = wx.getStorageSync('cart') || []
    const paidItemIds = paidItems.map(item => item.id)
    
    cart = cart.filter(item => !paidItemIds.includes(item.id) || !item.selected)
    
    // 更新购物车
    wx.setStorageSync('cart', cart)
    
    // 保存订单信息
    const orderInfo = {
      id: 'ORDER' + Date.now(),
      items: paidItems,
      totalAmount: parseFloat(this.data.totalPrice),
      address: this.data.address,
      createTime: new Date().getTime(),
      status: 'paid'
    }
    
    // 保存到订单列表
    let orders = wx.getStorageSync('orders') || []
    orders.unshift(orderInfo)
    wx.setStorageSync('orders', orders)
    
    // 更新页面数据
    this.loadCartData()
    
    wx.showToast({ 
      title: '支付成功', 
      icon: 'success',
      duration: 1500,
      success: () => {
        // 延迟跳转，让用户看到成功提示
        setTimeout(() => {
          wx.navigateTo({
            url: '/pages/order/order?id=' + orderInfo.id
          })
        }, 1500)
      }
    })
  },

  // 继续购物
  goShopping: function() {
    wx.switchTab({
      url: '/pages/index/index'
    })
  },
  onShow: function() {
    // 每次显示页面时更新购物车数据
    this.loadCartData()
    
    // 检查是否有选中的地址
    const selectedAddress = wx.getStorageSync('selectedAddress')
    if (selectedAddress) {
      this.setData({
        address: selectedAddress
      })
      // 清除临时选中的地址
      wx.removeStorageSync('selectedAddress')
    } else {
      // 加载默认地址
      this.loadAddress()
    }
  },

  // 加载用户地址
  loadAddress: function() {
    // 从本地存储获取默认地址
    const address = wx.getStorageSync('defaultAddress')
    if (address) {
      this.setData({
        address: address
      })
    }
  },

  // 选择地址
  chooseAddress: function() {
    // 检查是否有地址列表
    const addressList = wx.getStorageSync('addressList') || [];
    if (addressList.length > 0) {
      // 如果已经有地址，跳转到地址选择页面
      wx.navigateTo({
        url: '/pages/address/address?from=cart'
      });
    } else {
      // 如果没有地址，直接调用微信地址API添加
      wx.chooseAddress({
        success: (res) => {
          // 生成一个唯一ID
          const addressId = 'addr_' + Date.now();
          
          // 构建地址对象
          const address = {
            id: addressId,
            userName: res.userName,
            telNumber: res.telNumber,
            provinceName: res.provinceName,
            cityName: res.cityName,
            countyName: res.countyName,
            detailInfo: res.detailInfo,
            postalCode: res.postalCode,
            isDefault: true
          };
          
          // 添加到地址列表
          const addressList = [address];
          wx.setStorageSync('addressList', addressList);
          
          // 设置为默认地址
          wx.setStorageSync('defaultAddress', address);
          
          // 更新当前页面的地址
          this.setData({
            address: address
          });
          
          wx.showToast({
            title: '添加成功',
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
  },
  // 查看商品详情
  viewProduct: function(e) {
    const id = e.currentTarget.dataset.id
    
    wx.navigateTo({
      url: `/pages/product/product?id=${id}`
    })
  }
})