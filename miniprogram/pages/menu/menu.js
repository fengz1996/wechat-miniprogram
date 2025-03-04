Page({
  data: {
    categories: [
      { id: 'beef', name: '牛肉类' },
      { id: 'chicken', name: '鸡肉类' },
      { id: 'pork', name: '猪肉类' },
      { id: 'seafood', name: '水产类' },
      { id: 'vegetable', name: '素菜类' },
      { id: 'drinks', name: '酒水' }
    ],
    currentCategory: 'beef',
    scrollIntoView: 'category-beef',
    searchValue: '',
    totalPrice: 0,
    totalQuantity: 0,
    dishesData: [
      {
        id: 'beef',
        name: '牛肉类',
        dishes: [
          { 
            id: 1, 
            name: '秘制牛肉干(微辣)', 
            price: 63, 
            imageUrl: '../../images/dish1.jpg',
            weight: '330克',
            sales: 200,
            quantity: 0
          },
          { 
            id: 2, 
            name: '麻辣牛肉干', 
            price: 39, 
            imageUrl: '../../images/dish2.jpg',
            weight: '180克',
            sales: 180,
            quantity: 0
          },
          { 
            id: 3, 
            name: '五香牛肉干', 
            price: 39, 
            imageUrl: '../../images/dish3.jpg',
            weight: '180克',
            sales: 150,
            quantity: 0
          },
          { 
            id: 4, 
            name: '香脆牛板筋', 
            price: 39, 
            imageUrl: '../../images/dish4.jpg',
            weight: '180克',
            sales: 120,
            quantity: 0
          },
          { 
            id: 5, 
            name: '五香牛肉干', 
            price: 29, 
            imageUrl: '../../images/dish5.jpg',
            weight: '130克',
            sales: 90,
            quantity: 0
          }
        ]
      },
      {
        id: 'chicken',
        name: '鸡肉类',
        dishes: [
          { 
            id: 6, 
            name: '香辣孜然鸡', 
            price: 29, 
            imageUrl: '../../images/dish6.jpg',
            weight: '160克',
            sales: 220,
            quantity: 0
          },
          { 
            id: 7, 
            name: '香辣鸡翅尖', 
            price: 22, 
            imageUrl: '../../images/dish7.jpg',
            weight: '180克',
            sales: 160,
            quantity: 0
          },
          { 
            id: 8, 
            name: '香辣鸡爪', 
            price: 29, 
            imageUrl: '../../images/dish8.jpg',
            weight: '250克',
            sales: 240,
            quantity: 0
          },
          { 
            id: 9, 
            name: '香卤鸡子翅', 
            price: 25, 
            imageUrl: '../../images/dish9.jpg',
            weight: '200克',
            sales: 130,
            quantity: 0
          }
        ]
      },
      {
        id: 'pork',
        name: '猪肉类',
        dishes: [
          { 
            id: 10, 
            name: '香辣猪肉干', 
            price: 28, 
            imageUrl: '../../images/dish10.jpg',
            weight: '160克',
            sales: 150,
            quantity: 0
          },
          { 
            id: 11, 
            name: '香辣猪肝', 
            price: 20, 
            imageUrl: '../../images/dish11.jpg',
            weight: '200克',
            sales: 100,
            quantity: 0
          },
          { 
            id: 12, 
            name: '香辣猪耳', 
            price: 18, 
            imageUrl: '../../images/dish12.jpg',
            weight: '150克',
            sales: 80,
            quantity: 0
          }
        ]
      },
      {
        id: 'seafood',
        name: '水产类',
        dishes: [
          { 
            id: 13, 
            name: '香辣鱼块', 
            price: 25, 
            imageUrl: '../../images/dish13.jpg',
            weight: '250克',
            sales: 130,
            quantity: 0
          },
          { 
            id: 14, 
            name: '私房虾球', 
            price: 35, 
            imageUrl: '../../images/dish14.jpg',
            weight: '250克',
            sales: 110,
            quantity: 0
          },
          { 
            id: 15, 
            name: '炝炒鱿鱼须', 
            price: 29, 
            imageUrl: '../../images/dish15.jpg',
            weight: '160克',
            sales: 90,
            quantity: 0
          }
        ]
      },
      {
        id: 'vegetable',
        name: '素菜类',
        dishes: [
          { 
            id: 16, 
            name: '麻辣香香豆干', 
            price: 16, 
            imageUrl: '../../images/dish16.jpg',
            weight: '180克',
            sales: 110,
            quantity: 0
          },
          { 
            id: 17, 
            name: '爽口青菜', 
            price: 15, 
            imageUrl: '../../images/dish17.jpg',
            weight: '160克',
            sales: 80,
            quantity: 0
          },
          { 
            id: 18, 
            name: '麻辣香菇', 
            price: 16, 
            imageUrl: '../../images/dish18.jpg',
            weight: '150克',
            sales: 70,
            quantity: 0
          },
          { 
            id: 19, 
            name: '酸辣藕丁', 
            price: 12, 
            imageUrl: '../../images/dish19.jpg',
            weight: '220克',
            sales: 60,
            quantity: 0
          }
        ]
      },
      {
        id: 'drinks',
        name: '酒水',
        dishes: [
          { 
            id: 20, 
            name: '罗新满6号', 
            price: 16, 
            imageUrl: '../../images/drink1.jpg',
            weight: '330ML',
            sales: 80,
            quantity: 0
          },
          { 
            id: 21, 
            name: '罗新满8号', 
            price: 18, 
            imageUrl: '../../images/drink2.jpg',
            weight: '330ML',
            sales: 60,
            quantity: 0
          },
          { 
            id: 22, 
            name: '罗新满10号', 
            price: 20, 
            imageUrl: '../../images/drink3.jpg',
            weight: '330ML',
            sales: 50,
            quantity: 0
          }
        ]
      }
    ]
  },

  onLoad: function() {
    // 检查是否有从其他页面传来的选中分类
    const app = getApp();
    if (app.globalData.selectedCategory) {
      this.setData({
        currentCategory: app.globalData.selectedCategory,
        scrollIntoView: `category-${app.globalData.selectedCategory}`
      });
      // 清除选中分类，避免下次进入仍然跳转
      app.globalData.selectedCategory = null;
    }
    
    // 更新购物车状态
    this.updateCartStatus();
  },
  
  onShow: function() {
    // 页面显示时更新购物车状态
    this.updateCartStatus();
    
    // 更新菜品数量状态
    this.updateDishesQuantity();
  },
  
  switchCategory: function(e) {
    const category = e.currentTarget.dataset.category;
    this.setData({
      currentCategory: category,
      scrollIntoView: `category-${category}`
    });
  },
  
  onSearchInput: function(e) {
    const searchValue = e.detail.value;
    this.setData({ searchValue });
    
    // 实际应用中可以根据搜索值过滤菜品
    if (searchValue) {
      // 这里应该对dishesData进行过滤并更新
    } else {
      // 恢复原始数据
    }
  },
  
  navigateToDish: function(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/dish/dish?id=${id}`
    });
  },
  
  addDish: function(e) {
    const dish = e.currentTarget.dataset.dish;
    
    // 更新购物车
    const app = getApp();
    const cart = app.globalData.cart;
    
    // 查找购物车中是否已有该商品
    const cartIndex = cart.findIndex(item => item.id === dish.id);
    
    if (cartIndex > -1) {
      // 已有该商品，数量+1
      cart[cartIndex].quantity += 1;
    } else {
      // 没有该商品，添加到购物车
      cart.push({
        ...dish,
        quantity: 1
      });
    }
    
    // 更新菜品数量
    const dishesData = [...this.data.dishesData];
    dishesData.forEach(category => {
      const dishIndex = category.dishes.findIndex(item => item.id === dish.id);
      if (dishIndex > -1) {
        category.dishes[dishIndex].quantity = (category.dishes[dishIndex].quantity || 0) + 1;
      }
    });
    
    this.setData({ dishesData });
    
    // 更新购物车状态
    this.updateCartStatus();
    
    wx.showToast({
      title: '已加入购物车',
      icon: 'success'
    });
  },
  
  minusDish: function(e) {
    const id = e.currentTarget.dataset.id;
    
    // 更新购物车
    const app = getApp();
    const cart = app.globalData.cart;
    
    // 查找购物车中的商品
    const cartIndex = cart.findIndex(item => item.id === id);
    
    if (cartIndex > -1) {
      if (cart[cartIndex].quantity > 1) {
        // 数量大于1，减少数量
        cart[cartIndex].quantity -= 1;
      } else {
        // 数量为1，从购物车移除
        cart.splice(cartIndex, 1);
      }
    }
    
    // 更新菜品数量
    const dishesData = [...this.data.dishesData];
    dishesData.forEach(category => {
      const dishIndex = category.dishes.findIndex(item => item.id === id);
      if (dishIndex > -1 && category.dishes[dishIndex].quantity > 0) {
        category.dishes[dishIndex].quantity -= 1;
      }
    });
    
    this.setData({ dishesData });
    
    // 更新购物车状态
    this.updateCartStatus();
  },
  
  updateCartStatus: function() {
    const app = getApp();
    const cart = app.globalData.cart;
    
    let totalQuantity = 0;
    let totalPrice = 0;
    
    cart.forEach(item => {
      totalQuantity += item.quantity;
      totalPrice += item.price * item.quantity;
    });
    
    this.setData({
      totalQuantity,
      totalPrice
    });
    
    app.globalData.totalPrice = totalPrice;
  },
  
  updateDishesQuantity: function() {
    const app = getApp();
    const cart = app.globalData.cart;
    const dishesData = [...this.data.dishesData];
    
    // 重置所有菜品数量
    dishesData.forEach(category => {
      category.dishes.forEach(dish => {
        dish.quantity = 0;
      });
    });
    
    // 根据购物车更新数量
    cart.forEach(cartItem => {
      dishesData.forEach(category => {
        const dishIndex = category.dishes.findIndex(dish => dish.id === cartItem.id);
        if (dishIndex > -1) {
          category.dishes[dishIndex].quantity = cartItem.quantity;
        }
      });
    });
    
    this.setData({ dishesData });
  },
  
  navigateToCart: function() {
    wx.switchTab({
      url: '/pages/cart/cart'
    });
  },
  
  checkout: function() {
    wx.switchTab({
      url: '/pages/cart/cart'
    });
  }
})