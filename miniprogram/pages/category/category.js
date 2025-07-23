// pages/category/category.js
import config from '../../utils/config.js'

Page({
  data: {
    categories: [],
    currentCategoryId: 0,
    products: [],
    pagination: {
      current: 1,
      pageSize: 10,
      total: 0
    },
    loading: true,
    loadingMore: false,
    isHotFilterActive: false,
    isNewFilterActive: false
  },

  onLoad: function (options) {
    // 获取分类数据
    this.fetchCategories()
  },
  
  onShow: function () {
    // 检查是否有来自首页的分类选择
    const app = getApp()
    
    if (app.globalData.selectedCategoryId) {
      this.setData({
        currentCategoryId: app.globalData.selectedCategoryId
      })
      
      // 清除全局变量，避免影响下次进入
      app.globalData.selectedCategoryId = 0
      
      // 加载对应分类商品
      this.fetchProducts()
    } else if (app.globalData.viewHotProducts) {
      // 如果从首页点击"更多爆款"
      this.setData({
        currentCategoryId: 0,
        isHotFilterActive: true,
        isNewFilterActive: false
      })
      
      // 加载热销商品
      this.fetchHotProducts()
      
      app.globalData.viewHotProducts = false
    } else if (app.globalData.viewNewProducts) {
      // 如果从首页点击"更多新品"
      this.setData({
        currentCategoryId: 0,
        isHotFilterActive: false,
        isNewFilterActive: true
      })
      
      // 加载新品
      this.fetchNewProducts()
      
      app.globalData.viewNewProducts = false
    } else if (!this.data.products.length) {
      // 初次加载默认显示所有商品
      this.fetchProducts()
    }
  },

  // 获取分类列表
  fetchCategories: function() {
    wx.request({
      url: `${config.apiBaseUrl}/mp/api/categories`,
      method: 'GET',
      success: (res) => {
        if (res.data.code === 200) {
          this.setData({
            categories: res.data.data
          })
        } else {
          this.showError('获取分类失败')
        }
      },
      fail: () => {
        this.showError('网络错误，请重试')
      }
    })
  },

  // 获取商品列表
  fetchProducts: function(loadMore = false) {
    const { current, pageSize } = this.data.pagination
    
    // 如果是加载更多，则页码+1
    const page = loadMore ? current + 1 : 1
    
    this.setData({
      loading: !loadMore,
      loadingMore: loadMore
    })
    
    wx.request({
      url: `${config.apiBaseUrl}/mp/api/products/category/${this.data.currentCategoryId}`,
      method: 'GET',
      data: {
        page: page,
        page_size: pageSize
      },
      success: (res) => {
        if (res.data.code === 200) {
          const { products, pagination } = res.data.data
          
          this.setData({
            products: loadMore ? [...this.data.products, ...products] : products,
            pagination: pagination,
            loading: false,
            loadingMore: false,
            // 重置筛选条件
            isHotFilterActive: false,
            isNewFilterActive: false
          })
        } else {
          this.showError('获取商品失败')
        }
      },
      fail: () => {
        this.showError('网络错误，请重试')
      },
      complete: () => {
        wx.stopPullDownRefresh()
      }
    })
  },

  // 获取热销商品
  fetchHotProducts: function() {
    // 清空当前商品列表
    this.setData({
      products: [],
      loading: true,
      pagination: {
        current: 1,
        pageSize: 20,
        total: 0
      }
    })
    
    wx.request({
      url: `${config.apiBaseUrl}/mp/api/products/category/0`, // 使用通用商品API
      method: 'GET',
      data: {
        page: 1,
        page_size: 20,
        is_hot: 1 // 添加热销筛选
      },
      success: (res) => {
        if (res.data.code === 200) {
          const { products, pagination } = res.data.data
          
          this.setData({
            products: products,
            pagination: pagination,
            loading: false
          })
        } else {
          this.showError('获取热销商品失败')
        }
      },
      fail: () => {
        this.showError('网络错误，请重试')
      }
    })
  },

  // 获取新品商品
  fetchNewProducts: function() {
    // 清空当前商品列表
    this.setData({
      products: [],
      loading: true,
      pagination: {
        current: 1,
        pageSize: 20,
        total: 0
      }
    })
    
    wx.request({
      url: `${config.apiBaseUrl}/mp/api/products/category/0`, // 使用通用商品API
      method: 'GET',
      data: {
        page: 1,
        page_size: 20,
        sort: 'newest' // 按照最新时间排序
      },
      success: (res) => {
        if (res.data.code === 200) {
          const { products, pagination } = res.data.data
          
          this.setData({
            products: products,
            pagination: pagination,
            loading: false
          })
        } else {
          this.showError('获取新品商品失败')
        }
      },
      fail: () => {
        this.showError('网络错误，请重试')
      }
    })
  },

  // 切换分类
  switchCategory: function(e) {
    const categoryId = e.currentTarget.dataset.id
    
    if (categoryId === this.data.currentCategoryId) {
      return
    }
    
    this.setData({
      currentCategoryId: categoryId,
      products: []
    })
    
    this.fetchProducts()
  },

  // 查看商品详情
  viewProduct: function(e) {
    const productId = e.currentTarget.dataset.id
    
    wx.navigateTo({
      url: `/pages/product/product?id=${productId}`
    })
  },

  // 添加到购物车
  addToCart: function(e) {
    e.stopPropagation() // 阻止冒泡
    
    const productId = e.currentTarget.dataset.id
    const product = this.data.products.find(p => p.id === productId)
    
    if (product) {
      const app = getApp()
      app.addToCart(product)
      
      wx.showToast({
        title: '已加入购物车',
        icon: 'success'
      })
    }
  },

  // 切换筛选 - 爆款
  toggleHotFilter: function() {
    if (this.data.isHotFilterActive) {
      // 如果已经激活，则取消筛选
      this.setData({
        isHotFilterActive: false
      })
      this.fetchProducts()
    } else {
      this.setData({
        isHotFilterActive: true,
        isNewFilterActive: false
      })
      this.fetchHotProducts()
    }
  },

  // 切换筛选 -, - 新品
  toggleNewFilter: function() {
    if (this.data.isNewFilterActive) {
      // 如果已经激活，则取消筛选
      this.setData({
        isNewFilterActive: false
      })
      this.fetchProducts()
    } else {
      this.setData({
        isNewFilterActive: true,
        isHotFilterActive: false
      })
      this.fetchNewProducts()
    }
  },

  // 下拉刷新
  onPullDownRefresh: function() {
    if (this.data.isHotFilterActive) {
      this.fetchHotProducts()
    } else if (this.data.isNewFilterActive) {
      this.fetchNewProducts()
    } else {
      this.fetchProducts()
    }
  },

  // 上拉加载更多
  onReachBottom: function() {
    const { current, pageSize, total } = this.data.pagination
    
    // 检查是否还有更多数据
    if (current * pageSize < total && !this.data.loadingMore) {
      this.fetchProducts(true)
    }
  },

  // 显示错误提示
  showError: function(message) {
    wx.showToast({
      title: message,
      icon: 'none'
    })
  }
})