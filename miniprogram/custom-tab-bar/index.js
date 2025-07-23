Component({
  data: {
    selected: 0,
    color: "#757575",
    selectedColor: "#E86C00",
    animation: {},
    cartCount: 0,
    list: [{
      pagePath: "/pages/index/index",
      text: "首页"
    }, {
      pagePath: "/pages/category/category",
      text: "分类"
    }, {
      pagePath: "/pages/cart/cart",
      text: "购物车"
    }, {
      pagePath: "/pages/user/user",
      text: "我的"
    }]
  },
  lifetimes: {
    attached: function() {
      this.updateCartCount();
    },
    ready: function() {
      // 获取当前页面路径
      const pages = getCurrentPages();
      const currentPage = pages[pages.length - 1];
      const route = currentPage.route;
      
      // 根据路径设置选中项
      const index = this.data.list.findIndex(item => {
        return route.includes(item.pagePath.substring(1));
      });
      
      if (index !== -1) {
        this.setData({
          selected: index
        });
      }
    }
  },
  pageLifetimes: {
    show: function() {
      this.updateCartCount();
    }
  },
  methods: {
    switchTab(e) {
      const data = e.currentTarget.dataset;
      const url = data.path;
      
      // 设置选中的动画
      this.setData({
        selected: data.index
      });
      
      // 创建转场动画
      this.createAnimations(data.index);
      
      wx.switchTab({
        url
      });
    },
    
    // 更新购物车数量
    updateCartCount() {
      const cart = wx.getStorageSync('cart') || [];
      let count = 0;
      
      cart.forEach(item => {
        count += item.quantity;
      });
      
      this.setData({
        cartCount: count
      });
    },
    
    // 创建动画效果
    createAnimations(index) {
      // 创建一个动画实例
      const animation = wx.createAnimation({
        duration: 300,
        timingFunction: 'ease',
      });
      
      animation.scale(1.2).step();
      animation.scale(1.0).step();
      
      // 更新动画数据
      this.setData({
        animation: animation.export()
      });
    }
  }
});