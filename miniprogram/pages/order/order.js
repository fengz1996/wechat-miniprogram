Page({
  data: {
    currentTab: 'all',
    orders: []
  },

  onLoad: function (options) {
    
  },

  onShow: function () {
    this.loadOrders();
  },
  
  switchTab: function(e) {
    const tab = e.currentTarget.dataset.tab;
    this.setData({ currentTab: tab });
    this.loadOrders(tab);
  },
  
  loadOrders: function(tab = 'all') {
    // 模拟从数据库加载订单
    const mockOrders = [
      {
        id: 1,
        orderNo: 'DD202503021001',
        status: '配送中',
        dishes: [
          { 
            id: 1, 
            name: '秘制牛肉干(微辣)', 
            price: 63, 
            imageUrl: '../../images/dish1.jpg',
            quantity: 1
          },
          { 
            id: 6, 
            name: '香辣孜然鸡', 
            price: 29, 
            imageUrl: '../../images/dish6.jpg',
            quantity: 2
          }
        ],
        totalQuantity: 3,
        totalAmount: 121,
        createTime: '2025-03-02 15:30'
      },
      {
        id: 2,
        orderNo: 'DD202503011002',
        status: '已完成',
        dishes: [
          { 
            id: 2, 
            name: '麻辣牛肉干', 
            price: 39, 
            imageUrl: '../../images/dish2.jpg',
            quantity: 1
          },
          { 
            id: 13, 
            name: '香辣鱼块', 
            price: 25, 
            imageUrl: '../../images/dish13.jpg',
            quantity: 1
          }
        ],
        totalQuantity: 2,
        totalAmount: 64,
        createTime: '2025-03-01 12:15'
      },
      {
        id: 3,
        orderNo: 'DD202502281003',
        status: '已完成',
        dishes: [
          { 
            id: 10, 
            name: '香辣猪肉干', 
            price: 28, 
            imageUrl: '../../images/dish10.jpg',
            quantity: 2
          },
          { 
            id: 20, 
            name: '罗新满6号', 
            price: 16, 
            imageUrl: '../../images/drink1.jpg',
            quantity: 3
          }
        ],
        totalQuantity: 5,
        totalAmount: 104,
        createTime: '2025-02-28 18:45'
      }
    ];
    
    // 根据选中的标签过滤订单
    let filteredOrders = [];
    if (tab === 'all') {
      filteredOrders = mockOrders;
    } else if (tab === 'pending') {
      filteredOrders = mockOrders.filter(order => order.status === '配送中' || order.status === '待支付');
    } else if (tab === 'completed') {
      filteredOrders = mockOrders.filter(order => order.status === '已完成');
    }
    
    this.setData({ orders: filteredOrders });
  },
  
  navigateToOrderDetail: function(e) {
    const id = e.currentTarget.dataset.id;
    // 实际应用中应该跳转到订单详情页面
    // wx.navigateTo({
    //   url: `/pages/orderDetail/orderDetail?id=${id}`
    // });
    
    // 由于我们没有创建订单详情页，这里先简单提示
    wx.showToast({
      title: '查看订单详情',
      icon: 'none'
    });
  },
  
  payOrder: function(e) {
    const id = e.currentTarget.dataset.id;
    
    // 实际应用中应该调用支付接口
    wx.showToast({
      title: '模拟支付成功',
      icon: 'success',
      duration: 2000,
      success: () => {
        // 更新订单状态
        setTimeout(() => {
          this.loadOrders(this.data.currentTab);
        }, 2000);
      }
    });
  },
  
  confirmReceive: function(e) {
    const id = e.currentTarget.dataset.id;
    
    wx.showModal({
      title: '确认收货',
      content: '确认已收到商品吗？',
      success: (res) => {
        if (res.confirm) {
          // 实际应用中应该调用接口更新订单状态
          wx.showToast({
            title: '收货成功',
            icon: 'success',
            duration: 2000,
            success: () => {
              // 更新订单状态
              setTimeout(() => {
                this.loadOrders(this.data.currentTab);
              }, 2000);
            }
          });
        }
      }
    });
  },
  
  reorder: function(e) {
    const id = e.currentTarget.dataset.id;
    
    // 从订单中找到对应id的订单
    const order = this.data.orders.find(item => item.id === id);
    
    if (order) {
      // 将订单中的商品加入购物车
      const app = getApp();
      app.globalData.cart = [];
      
      order.dishes.forEach(dish => {
        app.globalData.cart.push({
          ...dish,
          quantity: dish.quantity
        });
      });
      
      wx.showToast({
        title: '已加入购物车',
        icon: 'success',
        duration: 2000,
        success: () => {
          // 跳转到购物车页面
          setTimeout(() => {
            wx.switchTab({
              url: '/pages/cart/cart'
            });
          }, 2000);
        }
      });
    }
  },
  
  navigateToMenu: function() {
    wx.switchTab({
      url: '/pages/menu/menu'
    });
  }
})