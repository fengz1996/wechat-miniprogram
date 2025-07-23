// custom-tab-bar/index.js
Component({
  data: {
    selected: 0,
    color: "#616161",
    selectedColor: "#E86C00",
    list: [{
      pagePath: "/pages/index/index",
      text: "首页"
    }, {
      pagePath: "/pages/category/category",
      text: "分类"
    }, {
      pagePath: "/pages/cart/cart",
      text: "购物车",
      badge: 0
    }, {
      pagePath: "/pages/user/user",
      text: "我的"
    }]
  },
  lifetimes: {
    attached: function() {
      // 获取购物车数量
      const app = getApp();
      if (app.globalData.cartCount > 0) {
        this.setData({
          'list[2].badge': app.globalData.cartCount
        });
      }
    }
  },
  methods: {
    switchTab(e) {
      const data = e.currentTarget.dataset;
      const url = data.path;
      wx.switchTab({
        url
      });
      this.setData({
        selected: data.index
      });
    },
    
    // 更新购物车数量
    updateCartBadge(count) {
      this.setData({
        'list[2].badge': count
      });
    }
  }
})