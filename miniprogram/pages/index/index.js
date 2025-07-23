// index.js
const app = getApp();

Page({
  data: {
    statusBarHeight: 20,
    navHeight: 116, // 状态栏高度 + 导航栏高度
    banners: [],
    categories: [],
    hotProducts: [],
    newProducts: [],
    notice: '欢迎光临巴巴美食，新品上市中！',
    businessHours: '9:00-24:00',
    cartCount: 0,
    currentSwiper: 0,
    hotScrollIndicatorWidth: 60,
    hotScrollIndicatorLeft: 0
  },

  onLoad: function() {
    // 获取系统信息
    this.setData({
      statusBarHeight: app.globalData.statusBarHeight,
      navHeight: app.globalData.statusBarHeight + 96 // 96rpx是导航内容高度
    });
    
    // 加载首页数据
    this.loadHomeData();
    
    // 设置页面滚动监听
    wx.createIntersectionObserver()
      .relativeToViewport({bottom: 50})
      .observe('#hot-section', (res) => {
        if (res.intersectionRatio > 0) {
          // 当热销商品区域进入视图时，添加滚动动画
          const hotItems = wx.createSelectorQuery().selectAll('.hot-item');
          hotItems.fields({
            dataset: true,
            rect: true
          }, (rects) => {
            rects.forEach((rect, index) => {
              this.animate(`.hot-item-wrapper[data-index="${index}"]`, [
                { opacity: 0, transform: 'translateX(60rpx)' },
                { opacity: 1, transform: 'translateX(0)' }
              ], 600, index * 100, 'ease-out');
            });
          }).exec();
        }
      });
  },
  
  onShow: function() {
    // 更新购物车数量
    this.setData({
      cartCount: app.globalData.cartCount || 0
    });
  },
  
  // 加载首页数据
  loadHomeData: function() {
    app.showLoading();
    
    wx.request({
      url: app.globalData.apiBaseUrl + '/mp/api/home',
      method: 'GET',
      success: res => {
        if (res.data.code === 200) {
          const data = res.data.data;
          
          // 处理轮播图数据，添加渐变色和其他UI元素
          const banners = data.banners.map(banner => {
            if (!banner.gradientStart) {
              banner.gradientStart = this.getRandomGradient().start;
            }
            if (!banner.gradientEnd) {
              banner.gradientEnd = this.getRandomGradient().end;
            }
            if (!banner.rotation) {
              banner.rotation = Math.floor(Math.random() * 20) - 10;
            }
            return banner;
          });
          
          // 处理分类数据，确保每个分类有合适的图标
          const categories = data.categories.map(category => {
            if (!category.iconClass) {
              category.iconClass = this.getCategoryIcon(category.name);
            }
            return category;
          });
          
          this.setData({
            banners: banners,
            categories: categories,
            hotProducts: data.hotProducts,
            newProducts: data.newProducts,
            notice: data.notice || '欢迎光临巴巴美食，新品上市中！',
            businessHours: data.businessHours || '9:00-24:00'
          });
        } else {
          app.showToast('获取数据失败');
          
          // 加载模拟数据（如果API请求失败）
          this.loadMockData();
        }
      },
      fail: err => {
        console.error('请求失败:', err);
        app.showToast('网络请求失败');
        
        // 加载模拟数据（如果API请求失败）
        this.loadMockData();
      },
      complete: () => {
        app.hideLoading();
      }
    });
  },
  
  // 加载模拟数据（当API请求失败时使用）
  loadMockData: function() {
    const mockBanners = [
      {
        id: 1,
        title: '秘制牛肉干',
        description: '纯手工制作，限时8折优惠',
        image: '/images/banner/beef.jpg',
        link: 'product:1',
        gradientStart: '#E86C00',
        gradientEnd: '#A83A31',
        iconClass: 'icon-beef',
        rotation: 5
      },
      {
        id: 2,
        title: '香辣鸡翅',
        description: '新品上市，买二送一',
        image: '/images/banner/chicken.jpg',
        link: 'category:2',
        gradientStart: '#E55D2D',
        gradientEnd: '#B04B33',
        iconClass: 'icon-chicken',
        rotation: -5
      }
    ];
    
    const mockCategories = [
      { id: 1, name: '牛肉类', iconClass: 'icon-beef' },
      { id: 2, name: '鸡肉类', iconClass: 'icon-chicken' },
      { id: 3, name: '猪肉类', iconClass: 'icon-pork' },
      { id: 4, name: '水产类', iconClass: 'icon-seafood' },
      { id: 5, name: '素菜类', iconClass: 'icon-vegetable' }
    ];
    
    const mockHotProducts = [
      {
        id: 1,
        name: '秘制牛肉干（微辣）',
        price: 68.00,
        original_price: 88.00,
        image: '/images/products/beef_spicy.jpg',
        weight: 250,
        unit: 'g',
        sold: 2580,
        category_id: 1
      },
      {
        id: 2,
        name: '夜光牛肉干',
        price: 39.00,
        original_price: 49.00,
        image: '/images/products/beef_original.jpg',
        weight: 200,
        unit: 'g',
        sold: 1860,
        category_id: 1
      },
      {
        id: 3,
        name: '香辣掌中宝',
        price: 29.00,
        original_price: 35.00,
        image: '/images/products/chicken_spicy.jpg',
        weight: 150,
        unit: 'g',
        sold: 3420,
        category_id: 2
      }
    ];
    
    const mockNewProducts = [
      {
        id: 4,
        name: '五香牛肉干',
        price: 29.00,
        original_price: 39.00,
        image: '/images/products/beef_five_spice.jpg',
        weight: 180,
        unit: 'g',
        sold: 980,
        category_id: 1
      },
      {
        id: 5,
        name: '香辣鸡翅尖',
        price: 22.00,
        original_price: 26.00,
        image: '/images/products/chicken_wings.jpg',
        weight: 130,
        unit: 'g',
        sold: 1240,
        category_id: 2
      },
      {
        id: 6,
        name: '牛板筋',
        price: 15.00,
        original_price: 18.00,
        image: '/images/products/beef_tendon.jpg',
        weight: 100,
        unit: 'g',
        sold: 860,
        category_id: 1
      },
      {
        id: 7,
        name: '麻辣小黄鱼',
        price: 26.00,
        original_price: 32.00,
        image: '/images/products/seafood_fish.jpg',
        weight: 120,
        unit: 'g',
        sold: 750,
        category_id: 4
      }
    ];
    
    this.setData({
      banners: mockBanners,
      categories: mockCategories,
      hotProducts: mockHotProducts,
      newProducts: mockNewProducts
    });
  },
  
  // 轮播图切换事件
  onSwiperChange: function(e) {
    this.setData({
      currentSwiper: e.detail.current
    });
  },
  
  // 热门商品滚动事件，更新滚动指示器
  onHotScroll: function(e) {
    const scrollLeft = e.detail.scrollLeft;
    const scrollWidth = e.detail.scrollWidth;
    const clientWidth = e.detail.scrollWidth - 750; // rpx单位下视口宽度
    
    if (clientWidth <= 0) return;
    
    // 计算滚动指示器宽度和位置
    const ratio = 750 / scrollWidth;
    const indicatorWidth = Math.max(60, ratio * 750);
    const maxLeft = 750 - indicatorWidth;
    const indicatorLeft = Math.min(maxLeft, scrollLeft * ratio);
    
    this.setData({
      hotScrollIndicatorWidth: indicatorWidth,
      hotScrollIndicatorLeft: indicatorLeft
    });
  },
  
  // 根据分类名获取合适的图标类名
  getCategoryIcon: function(name) {
    const iconMap = {
      '牛肉类': 'icon-beef',
      '牛肉': 'icon-beef',
      '鸡肉类': 'icon-chicken',
      '鸡肉': 'icon-chicken',
      '鸡翅': 'icon-chicken',
      '猪肉类': 'icon-pork',
      '猪肉': 'icon-pork',
      '水产类': 'icon-seafood',
      '水产': 'icon-seafood',
      '海鲜': 'icon-seafood',
      '素菜类': 'icon-vegetable',
      '素菜': 'icon-vegetable',
      '蔬菜': 'icon-vegetable'
    };
    
    // 基于分类名的部分匹配
    for (const key in iconMap) {
      if (name.includes(key) || key.includes(name)) {
        return iconMap[key];
      }
    }
    
    // 默认图标
    return 'icon-food';
  },
  
  // 获取随机渐变色
  getRandomGradient: function() {
    const gradients = [
      { start: '#E86C00', end: '#A83A31' },
      { start: '#E55D2D', end: '#B04B33' },
      { start: '#E74C3C', end: '#C0392B' },
      { start: '#FF7043', end: '#D84315' },
      { start: '#FF5722', end: '#BF360C' }
    ];
    
    return gradients[Math.floor(Math.random() * gradients.length)];
  },
  
  // 搜索框点击
  onSearchTap: function() {
    wx.navigateTo({
      url: '/pages/menu/menu?search=true'
    });
  },
  
  // 轮播图点击
  onBannerTap: function(e) {
    const link = e.currentTarget.dataset.link;
    if (link) {
      // 处理链接跳转，可能是商品ID或其他
      if (link.startsWith('product:')) {
        const productId = link.split(':')[1];
        this.navigateToProduct({
          currentTarget: {
            dataset: { id: productId }
          }
        });
      } else if (link.startsWith('category:')) {
        const categoryId = link.split(':')[1];
        this.navigateToCategory({
          currentTarget: {
            dataset: { id: categoryId }
          }
        });
      } else {
        // 其他类型的链接处理
        wx.navigateTo({
          url: link
        });
      }
    }
  },
  
  // 导航到分类页面
  navigateToCategory: function(e) {
    const categoryId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/menu/menu?categoryId=' + categoryId
    });
  },
  
  // 导航到商品详情页
  navigateToProduct: function(e) {
    const productId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/dish/dish?id=' + productId
    });
  },
  
  // 导航到购物车页面
  navigateToCart: function() {
    wx.switchTab({
      url: '/pages/cart/cart'
    });
    
    // 触发购物车按钮点击动画
    this.animate('.cart-float-3d', [
      { transform: 'translateZ(50rpx) rotateY(0deg) rotateX(0deg)' },
      { transform: 'translateZ(40rpx) rotateY(15deg) rotateX(-15deg) scale(0.9)' },
      { transform: 'translateZ(50rpx) rotateY(0deg) rotateX(0deg)' }
    ], 500, function() {});
  },
  
  // 添加商品到购物车
  addToCart: function(e) {
    e.stopPropagation(); // 阻止事件冒泡，防止触发商品点击事件
    
    const product = e.currentTarget.dataset.product;
    
    // 添加到购物车 (假设app.js中有addToCart方法)
    if (app.addToCart) {
      app.addToCart(product);
      
      // 更新购物车图标
      this.setData({
        cartCount: app.globalData.cartCount || this.data.cartCount + 1
      });
      
      // 显示成功提示
      wx.showToast({
        title: '已加入购物车',
        icon: 'success',
        duration: 1500
      });
      
      // 触发添加按钮3D旋转动画
      const target = e.currentTarget;
      const selector = target.dataset.btnSelector || '.add-btn-3d';
      
      try {
        this.animate(selector, [
          { transform: 'translateZ(30rpx) rotateY(0deg)' },
          { transform: 'translateZ(30rpx) rotateY(180deg)' },
          { transform: 'translateZ(30rpx) rotateY(360deg)' }
        ], 500, function() {});
      } catch (error) {
        console.log('动画执行失败', error);
      }
    } else {
      // 如果全局方法不可用，则本地更新购物车数量
      this.setData({
        cartCount: this.data.cartCount + 1
      });
      
      wx.showToast({
        title: '已加入购物车',
        icon: 'success',
        duration: 1500
      });
    }
  },
  
  // 下拉刷新
  onPullDownRefresh: function() {
    this.loadHomeData();
    setTimeout(() => {
      wx.stopPullDownRefresh();
    }, 1000);
  },
  
  // 触底加载更多
  onReachBottom: function() {
    // 这里可以加载更多商品，如果需要的话
    // 暂时不实现加载更多逻辑
    wx.showToast({
      title: '已经到底啦~',
      icon: 'none',
      duration: 1500
    });
  },
  
  // 分享
  onShareAppMessage: function() {
    return {
      title: '巴巴美食 - 纯手工美食，品质保证',
      path: '/pages/index/index',
      imageUrl: '/images/share-cover.jpg' // 应准备一张分享封面图
    };
  },
  
  // 页面滚动
  onPageScroll: function(e) {
    // 滚动时可以添加一些视差效果
    const scrollTop = e.scrollTop;
    
    // 这里可以根据滚动位置添加元素动画
    // 比如当滚动到某个位置时显示某些元素等
    
    // 例如，滚动超过100px时，导航栏背景加深
    if (scrollTop > 100) {
      // 如果需要修改导航栏样式，可以在这里处理
    } else {
      // 还原导航栏样式
    }
  },
  
  // 数学辅助函数
  Math: {
    floor: Math.floor
  }
});