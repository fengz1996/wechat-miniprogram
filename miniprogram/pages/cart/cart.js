// pages/cart/cart.js
const app = getApp()

Page({
  data: {
    cartItems: [],
    totalPrice: 0,
    selectedCount: 0,
    allSelected: false,
    showEmpty: false
  },

  onLoad: function () {
    
  },
  
  onShow: function () {
    // 每次显示页面时更新购物车数据
    this.loadCartData()
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
    
    // 获取选中的商品
    const selectedItems = this.data.cartItems.filter(item => item.selected)
    
    // 保存到全局变量，方便订单页面使用
    app.globalData.checkoutItems = selectedItems
    app.globalData.checkoutTotal = parseFloat(this.data.totalPrice)
    
    // 跳转到订单确认页面
    wx.navigateTo({
      url: '/pages/order/order'
    })
  },

  // 继续购物
  goShopping: function() {
    wx.switchTab({
      url: '/pages/index/index'
    })
  },

  // 查看商品详情
  viewProduct: function(e) {
    const id = e.currentTarget.dataset.id
    
    wx.navigateTo({
      url: `/pages/product/product?id=${id}`
    })
  }
})