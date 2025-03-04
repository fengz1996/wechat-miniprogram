Page({
  data: {
    banners: [
      { id: 1, imageUrl: '../../images/banner1.jpg' },
      { id: 2, imageUrl: '../../images/banner2.jpg' },
      { id: 3, imageUrl: '../../images/banner3.jpg' }
    ],
    hotDishes: [
      { 
        id: 1, 
        name: '秘制牛肉干(微辣)', 
        price: 63, 
        imageUrl: '../../images/dish1.jpg',
        weight: '330克',
        category: '牛肉类',
        sales: 200,
        description: '纯手工制作，无任何添加剂'
      },
      { 
        id: 2, 
        name: '麻辣牛肉干', 
        price: 39, 
        imageUrl: '../../images/dish2.jpg',
        weight: '180克',
        category: '牛肉类',
        sales: 180,
        description: '选用上等牛肉，麻辣可口'
      },
      { 
        id: 3, 
        name: '香辣鸡爪', 
        price: 29, 
        imageUrl: '../../images/dish3.jpg',
        weight: '250克',
        category: '鸡肉类',
        sales: 150,
        description: '酥脆入味，回味无穷'
      },
      { 
        id: 4, 
        name: '金牌猪肝', 
        price: 26, 
        imageUrl: '../../images/dish4.jpg',
        weight: '180克',
        category: '猪肉类',
        sales: 120,
        description: '鲜嫩多汁，营养丰富'
      }
    ],
    categories: [
      { id: 'beef', name: '牛肉类', imageUrl: '../../images/category1.jpg' },
      { id: 'chicken', name: '鸡肉类', imageUrl: '../../images/category2.jpg' },
      { id: 'pork', name: '猪肉类', imageUrl: '../../images/category3.jpg' },
      { id: 'seafood', name: '水产类', imageUrl: '../../images/category4.jpg' },
      { id: 'vegetable', name: '素菜类', imageUrl: '../../images/category5.jpg' },
      { id: 'drinks', name: '酒水', imageUrl: '../../images/category6.jpg' }
    ]
  },

  onLoad: function() {
    // 从云数据库加载数据
    // this.loadBanners();
    // this.loadHotDishes();
    // this.loadCategories();
  },

  navigateToDish: function(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/dish/dish?id=${id}`
    });
  },

  navigateToMenu: function(e) {
    const category = e.currentTarget.dataset.category;
    wx.switchTab({
      url: '/pages/menu/menu',
      success: function() {
        // 全局存储当前选中分类，以便菜单页面使用
        getApp().globalData.selectedCategory = category;
      }
    });
  },

  addToCart: function(e) {
    const item = e.currentTarget.dataset.item;
    const app = getApp();
    const cart = app.globalData.cart;
    
    // 查找购物车中是否已有该商品
    const index = cart.findIndex(cartItem => cartItem.id === item.id);
    
    if (index > -1) {
      // 已有该商品，数量+1
      cart[index].quantity += 1;
    } else {
      // 没有该商品，添加到购物车
      cart.push({
        ...item,
        quantity: 1
      });
    }
    
    // 更新总价
    this.updateTotalPrice();
    
    wx.showToast({
      title: '已加入购物车',
      icon: 'success'
    });
  },
  
  updateTotalPrice: function() {
    const app = getApp();
    const cart = app.globalData.cart;
    let total = 0;
    
    cart.forEach(item => {
      total += item.price * item.quantity;
    });
    
    app.globalData.totalPrice = total;
  }
})