Page({
  data: {
    dish: null,
    recommendDishes: [],
    cartTotal: 0
  },

  onLoad: function (options) {
    const id = parseInt(options.id);
    // 实际应用中应该从数据库获取菜品信息
    // 这里模拟从静态数据中获取
    this.loadDishData(id);
    this.loadRecommendDishes();
  },
  
  onShow: function() {
    this.updateCartTotal();
  },
  
  loadDishData: function(id) {
    // 模拟从所有分类菜品中查找
    const categories = [
      { id: 'beef', name: '牛肉类', dishes: [] },
      { id: 'chicken', name: '鸡肉类', dishes: [] },
      { id: 'pork', name: '猪肉类', dishes: [] },
      { id: 'seafood', name: '水产类', dishes: [] },
      { id: 'vegetable', name: '素菜类', dishes: [] },
      { id: 'drinks', name: '酒水', dishes: [] }
    ];
    
    // 模拟菜品数据
    categories[0].dishes = [
      { 
        id: 1, 
        name: '秘制牛肉干(微辣)', 
        price: 63, 
        imageUrl: '../../images/dish1.jpg',
        weight: '330克',
        sales: 200,
        description: '选用上等牛肉，采用传统工艺精心制作，肉质紧实有嚼劲，辣味适中，回味悠长，是下酒佳品。'
      },
      { 
        id: 2, 
        name: '麻辣牛肉干', 
        price: 39, 
        imageUrl: '../../images/dish2.jpg',
        weight: '180克',
        sales: 180,
        description: '麻辣鲜香，口感独特，采用多种香料熬制，辣而不燥，麻而不木，让人越吃越有味。'
      }
    ];
    
    // 在所有菜品中查找指定ID的菜品
    let foundDish = null;
    for (const category of categories) {
      for (const dish of category.dishes) {
        if (dish.id === id) {
          foundDish = dish;
          break;
        }
      }
      if (foundDish) break;
    }
    
    // 如果找不到指定ID的菜品，使用默认数据
    if (!foundDish) {
      foundDish = {
        id: 1, 
        name: '秘制牛肉干(微辣)', 
        price: 63, 
        imageUrl: '../../images/dish1.jpg',
        weight: '330克',
        sales: 200,
        description: '选用上等牛肉，采用传统工艺精心制作，肉质紧实有嚼劲，辣味适中，回味悠长，是下酒佳品。'
      };
    }
    
    this.setData({ dish: foundDish });
  },
  
  loadRecommendDishes: function() {
    // 模拟推荐菜品数据
    const recommendDishes = [
      { 
        id: 2, 
        name: '麻辣牛肉干', 
        price: 39, 
        imageUrl: '../../images/dish2.jpg'
      },
      { 
        id: 3, 
        name: '五香牛肉干', 
        price: 39, 
        imageUrl: '../../images/dish3.jpg'
      },
      { 
        id: 6, 
        name: '香辣孜然鸡', 
        price: 29, 
        imageUrl: '../../images/dish6.jpg'
      },
      { 
        id: 10, 
        name: '香辣猪肉干', 
        price: 28, 
        imageUrl: '../../images/dish10.jpg'
      },
      { 
        id: 13, 
        name: '香辣鱼块', 
        price: 25, 
        imageUrl: '../../images/dish13.jpg'
      }
    ];
    
    this.setData({ recommendDishes });
  },
  
  updateCartTotal: function() {
    const app = getApp();
    const cart = app.globalData.cart;
    
    let total = 0;
    cart.forEach(item => {
      total += item.quantity;
    });
    
    this.setData({ cartTotal: total });
  },
  
  addToCart: function() {
    const dish = this.data.dish;
    const app = getApp();
    const cart = app.globalData.cart;
    
    // 查找购物车中是否已有该商品
    const index = cart.findIndex(item => item.id === dish.id);
    
    if (index > -1) {
      // 已有该商品，数量+1
      cart[index].quantity += 1;
    } else {
      // 没有该商品，添加到购物车
      cart.push({
        ...dish,
        quantity: 1
      });
    }
    
    this.updateCartTotal();
    
    wx.showToast({
      title: '已加入购物车',
      icon: 'success'
    });
  },
  
  buyNow: function() {
    // 加入购物车并直接跳转到购物车页面
    this.addToCart();
    
    wx.switchTab({
      url: '/pages/cart/cart'
    });
  },
  
  navigateToCart: function() {
    wx.switchTab({
      url: '/pages/cart/cart'
    });
  },
  
  navigateToDish: function(e) {
    const id = e.currentTarget.dataset.id;
    // 如果跳转到当前页面，重新加载数据
    if (id === this.data.dish.id) {
      this.loadDishData(id);
      return;
    }
    
    wx.navigateTo({
      url: `/pages/dish/dish?id=${id}`
    });
  }
})