const api = require('../../utils/api');

Page({
  data: {
    categories: [],
    currentCategory: 0,
    products: [],
    banners: [
      { title: "春季新品上市", desc: "春季特惠，满100减20" },
      { title: "积分兑好礼", desc: "积分商城，好礼兑不停" },
      { title: "新人专享礼", desc: "新用户下单立减10元" }
    ],
    swiperCurrent: 0,
    payMethod: 'cash', // 'cash' 或 'points'
    loading: false,
    page: 1,
    pageSize: 10,
    hasMore: true
  },
  
  onLoad: function() {
    this.getCategories();
    this.getProducts();
  },
  
  onPullDownRefresh: function() {
    this.setData({
      page: 1,
      hasMore: true,
      products: []
    });
    this.getProducts();
    wx.stopPullDownRefresh();
  },
  
  onReachBottom: function() {
    if (this.data.hasMore && !this.data.loading) {
      this.getMoreProducts();
    }
  },
  
  swiperChange: function(e) {
    this.setData({
      swiperCurrent: e.detail.current
    });
  },
  
  getCategories: function() {
    api.getCategories().then(categories => {
      // 在这里添加一个全部分类
      const allCategories = [{ id: 0, name: '全部' }].concat(categories);
      
      this.setData({ categories: allCategories });
      console.log('获取分类成功:', allCategories);
    }).catch(err => {
      console.error('获取分类失败:', err);
    });
  },
  
  getProducts: function() {
    if (this.data.loading) return;
    
    this.setData({ loading: true });
    
    const categoryId = this.data.currentCategory === 0 ? '' : this.data.categories[this.data.currentCategory].id;
    
    api.getProductList(categoryId, 1, this.data.pageSize).then(result => {
      console.log('获取商品数据:', result);
      
      // 确保返回的products字段存在
      const products = result.products || [];
      
      this.setData({
        products: products,
        hasMore: result.page < result.total_pages,
        page: 1,
        loading: false
      });
    }).catch(err => {
      console.error('获取商品失败:', err);
      this.setData({ loading: false });
    });
  },
  
  getMoreProducts: function() {
    if (this.data.loading) return;
    
    this.setData({ loading: true });
    
    const nextPage = this.data.page + 1;
    const categoryId = this.data.currentCategory === 0 ? '' : this.data.categories[this.data.currentCategory].id;
    
    api.getProductList(categoryId, nextPage, this.data.pageSize).then(result => {
      // 确保返回的products字段存在
      const newProducts = result.products || [];
      
      this.setData({
        products: [...this.data.products, ...newProducts],
        hasMore: result.page < result.total_pages,
        page: nextPage,
        loading: false
      });
    }).catch(err => {
      console.error('获取更多商品失败:', err);
      this.setData({ loading: false });
    });
  },
  
  changeCategory: function(e) {
    const index = e.currentTarget.dataset.index;
    
    if (this.data.currentCategory !== index) {
      this.setData({
        currentCategory: index,
        products: [],
        page: 1,
        hasMore: true
      });
      
      this.getProducts();
    }
  },
  
  togglePayMethod: function() {
    const newMethod = this.data.payMethod === 'cash' ? 'points' : 'cash';
    this.setData({
      payMethod: newMethod
    });
  },
  
  viewProductDetail: function(e) {
    const productId = e.currentTarget.dataset.id;
    
    wx.showToast({
      title: '商品详情开发中',
      icon: 'none'
    });
  },
  
  addToCart: function(e) {
    const productId = e.currentTarget.dataset.id;
    
    wx.showToast({
      title: '已加入购物车',
      icon: 'success'
    });
  }
})