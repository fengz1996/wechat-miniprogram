const app = getApp()

Page({
  data: {
    cartItems: [],
    totalPrice: 0,
    selectedCount: 0,
    allSelected: false,
    showEmpty: false,
    address: null  // 添加地址属性
  },

  onLoad: function () {
    console.log('购物车页面加载');
  },
  
  onShow: function () {
    console.log('购物车页面显示');
    // 每次显示页面时更新购物车数据
    this.loadCartData();
    
    // 检查是否有选中的地址
    const selectedAddress = wx.getStorageSync('selectedAddress');
    if (selectedAddress) {
      this.setData({
        address: selectedAddress
      });
      // 清除临时选中的地址
      wx.removeStorageSync('selectedAddress');
    } else {
      // 加载默认地址
      this.loadAddress();
    }
  },

  // 加载用户地址
  loadAddress: function() {
    // 从本地存储获取默认地址
    const address = wx.getStorageSync('defaultAddress');
    if (address) {
      this.setData({
        address: address
      });
      console.log('已加载默认地址', address);
    } else {
      console.log('没有默认地址');
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

  // 加载购物车数据
  loadCartData: function() {
    const cart = wx.getStorageSync('cart') || [];
    console.log('加载购物车数据', cart);
    
    // 计算选中商品价格和数量
    let totalPrice = 0;
    let selectedCount = 0;
    let allSelected = cart.length > 0;
    
    cart.forEach(item => {
      if (item.selected) {
        totalPrice += item.price * item.quantity;
        selectedCount += item.quantity;
      } else {
        allSelected = false;
      }
    });
    
    // 设置是否显示空购物车
    const showEmpty = cart.length === 0;
    
    // 更新数据
    this.setData({
      cartItems: cart,
      totalPrice: totalPrice.toFixed(2),
      selectedCount: selectedCount,
      allSelected: allSelected,
      showEmpty: showEmpty
    });
  },

  // 切换商品选中状态
  toggleItemSelect: function(e) {
    const index = e.currentTarget.dataset.index;
    let cartItems = this.data.cartItems;
    cartItems[index].selected = !cartItems[index].selected;
    
    // 重新计算总价和选中数量
    this.calculateTotal(cartItems);
    
    // 更新购物车数据
    wx.setStorageSync('cart', cartItems);
  },

  // 切换全选
  toggleSelectAll: function() {
    let cartItems = this.data.cartItems;
    const newSelectState = !this.data.allSelected;
    
    // 更新所有商品的选中状态
    cartItems.forEach(item => {
      item.selected = newSelectState;
    });
    
    // 重新计算总价和选中数量
    this.calculateTotal(cartItems);
    
    // 更新购物车数据
    wx.setStorageSync('cart', cartItems);
  },

  // 增加商品数量
  increaseQuantity: function(e) {
    const index = e.currentTarget.dataset.index;
    let cartItems = this.data.cartItems;
    cartItems[index].quantity += 1;
    
    // 重新计算总价和选中数量
    this.calculateTotal(cartItems);
    
    // 更新购物车数据
    wx.setStorageSync('cart', cartItems);
  },

  // 减少商品数量
  decreaseQuantity: function(e) {
    const index = e.currentTarget.dataset.index;
    let cartItems = this.data.cartItems;
    
    if (cartItems[index].quantity > 1) {
      cartItems[index].quantity -= 1;
      
      // 重新计算总价和选中数量
      this.calculateTotal(cartItems);
      
      // 更新购物车数据
      wx.setStorageSync('cart', cartItems);
    }
  },

  // 移除商品
  removeItem: function(e) {
    const index = e.currentTarget.dataset.index;
    let cartItems = this.data.cartItems;
    
    wx.showModal({
      title: '提示',
      content: '确定要删除这个商品吗？',
      success: (res) => {
        if (res.confirm) {
          cartItems.splice(index, 1);
          
          // 检查购物车是否为空
          const showEmpty = cartItems.length === 0;
          
          // 重新计算总价和选中数量
          this.calculateTotal(cartItems);
          
          // 更新数据和存储
          this.setData({
            cartItems: cartItems,
            showEmpty: showEmpty
          });
          
          wx.setStorageSync('cart', cartItems);
          
          wx.showToast({
            title: '删除成功',
            icon: 'success'
          });
        }
      }
    });
  },

  // 查看商品详情
  viewProduct: function(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/product/product?id=${id}`
    });
  },

  // 跳转到首页购物
  goShopping: function() {
    wx.switchTab({
      url: '/pages/index/index'
    });
  },

  // 计算总价和选中数量
  calculateTotal: function(cartItems) {
    let totalPrice = 0;
    let selectedCount = 0;
    let allSelected = cartItems.length > 0;
    
    cartItems.forEach(item => {
      if (item.selected) {
        totalPrice += item.price * item.quantity;
        selectedCount += item.quantity;
      } else {
        allSelected = false;
      }
    });
    
    // 保留两位小数
    totalPrice = parseFloat(totalPrice.toFixed(2));
    
    this.setData({
      cartItems: cartItems,
      totalPrice: totalPrice,
      selectedCount: selectedCount,
      allSelected: allSelected
    });
  },

  // 处理结算按钮点击
// 在cart.js中修改checkout函数

  checkout: function() {
    // 检查是否有选中的商品
    if (this.data.selectedCount <= 0) {
      wx.showToast({
        title: '请先选择商品',
        icon: 'none',
        duration: 2000
      });
      return;
    }

    // 检查是否有选择地址
    if (!this.data.address) {
      wx.showToast({
        title: '请选择收货地址',
        icon: 'none',
        duration: 2000
      });
      return;
    }

    // 获取选中的商品
    const selectedItems = this.data.cartItems.filter(item => item.selected);
    
    // 存储到缓存，以便在确认订单页面使用
    wx.setStorageSync('checkoutItems', selectedItems);
    wx.setStorageSync('checkoutAddress', this.data.address);
    
    // 跳转到订单确认页面
    wx.navigateTo({
      url: '/pages/order/confirm'
    });
  }
});