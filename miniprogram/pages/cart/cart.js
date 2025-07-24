const app = getApp();

Page({
  data: {
    cartItems: [],
    totalPrice: 0,
    selectedCount: 0,
    address: null
  },
  onShow() {
    this.loadCartData();
    this.loadAddress();
  },
  loadCartData() {
    const cart = wx.getStorageSync('cart') || [];
    let totalPrice = 0, selectedCount = 0;
    cart.forEach(item => {
      totalPrice += item.price * item.quantity;
      selectedCount += item.quantity;
    });
    this.setData({
      cartItems: cart,
      totalPrice: totalPrice.toFixed(2),
      selectedCount
    });
  },
  loadAddress() {
    const address = wx.getStorageSync('address') || null;
    this.setData({ address });
  },
  decreaseQuantity(e) {
    const index = e.currentTarget.dataset.index;
    const cart = this.data.cartItems;
    if (cart[index].quantity > 1) {
      cart[index].quantity -= 1;
      wx.setStorageSync('cart', cart);
      this.loadCartData();
    }
  },
  increaseQuantity(e) {
    const index = e.currentTarget.dataset.index;
    const cart = this.data.cartItems;
    cart[index].quantity += 1;
    wx.setStorageSync('cart', cart);
    this.loadCartData();
  },
  removeItem(e) {
    const index = e.currentTarget.dataset.index;
    const cart = this.data.cartItems;
    cart.splice(index, 1);
    wx.setStorageSync('cart', cart);
    this.loadCartData();
  },
  goShopping() {
    wx.switchTab({ url: '/pages/index/index' });
  },
  editAddress() {
    wx.navigateTo({ url: '/pages/address-edit/address-edit' });
  },
  checkout() {
    if (!this.data.address) {
      wx.showToast({ title: '请选择收货地址', icon: 'none' });
      return;
    }
    // 结算逻辑参考前文（提交订单到后端）
    wx.navigateTo({ url: '/pages/order/confirm' });
  }
});