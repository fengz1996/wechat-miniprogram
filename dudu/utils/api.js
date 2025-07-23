// 统一API请求模块

const BASE_URL = 'http://192.168.2.2:5000'; // 您的后端服务器地址

// 获取token
const getToken = () => {
  return wx.getStorageSync('token') || '';
};

// 统一请求方法
const request = (url, method = 'GET', data = {}) => {
  return new Promise((resolve, reject) => {
    console.log(`发起请求: ${method} ${url}`, data);
    
    wx.showLoading({
      title: '加载中',
      mask: true
    });

    wx.request({
      url: `${BASE_URL}${url}`,
      method,
      data,
      header: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`
      },
      success: (res) => {
        console.log(`请求成功: ${url}`, res.data);
        
        if (res.statusCode === 200) {
          if (res.data.code === 200) {
            resolve(res.data.data);
          } else {
            wx.showToast({
              title: res.data.message || '请求失败',
              icon: 'none'
            });
            reject(res.data);
          }
        } else if (res.statusCode === 401) {
          // token失效，需要重新登录
          wx.removeStorageSync('token');
          wx.removeStorageSync('userInfo');
          
          wx.showToast({
            title: '登录已过期，请重新登录',
            icon: 'none'
          });
          
          // 延迟跳转到登录页
          setTimeout(() => {
            wx.reLaunch({
              url: '/pages/index/index'
            });
          }, 1500);
          
          reject({ code: 401, message: '登录已过期' });
        } else {
          wx.showToast({
            title: '网络异常，请稍后再试',
            icon: 'none'
          });
          reject(res);
        }
      },
      fail: (err) => {
        console.error(`请求失败: ${url}`, err);
        wx.showToast({
          title: '网络错误，请检查网络连接',
          icon: 'none'
        });
        reject(err);
      },
      complete: () => {
        wx.hideLoading();
      }
    });
  });
};

// 封装具体API请求方法
const api = {
  // 用户相关
  login: (code) => {
    return request('/api/auth/login', 'POST', { code });
  },
  getUserInfo: () => {
    return request('/api/user/info');
  },
  updateUserInfo: (data) => {
    return request('/api/user/update', 'POST', data);
  },
  setReferrer: (referrer_id) => {
    return request('/api/user/referrer', 'POST', { referrer_id });
  },
  getTeamInfo: () => {
    return request('/api/user/team');
  },
  
  // 设备相关
  getDeviceInfo: (device_code) => {
    return request(`/api/device/info?device_code=${device_code}`);
  },
  createOrder: (device_id, product_id, quantity, pay_type = 1) => {
    return request('/api/device/order', 'POST', { device_id, product_id, quantity, pay_type });
  },
  payOrder: (order_id) => {
    return request('/api/device/pay', 'POST', { order_id });
  },
  getOrders: (status) => {
    return request(`/api/device/orders${status !== undefined && status !== null ? '?status=' + status : ''}`);
  },
  
  // 商品相关
  getProductList: (category_id, page = 1, page_size = 20) => {
    let url = `/api/product/list?page=${page}&page_size=${page_size}`;
    if (category_id) url += `&category_id=${category_id}`;
    return request(url);
  },
  getCategories: () => {
    return request('/api/product/categories');
  },
  getProductDetail: (product_id) => {
    return request(`/api/product/detail?product_id=${product_id}`);
  },
  getDeviceProducts: () => {
    return request('/api/product/device-products');
  },
  
  // 钱包相关
  getWalletInfo: () => {
    return request('/api/wallet/info');
  },
  withdraw: (amount) => {
    return request('/api/wallet/withdraw', 'POST', { amount });
  },
  getPointsInfo: () => {
    return request('/api/wallet/points');
  },
  getCommissionInfo: () => {
    return request('/api/wallet/commission');
  }
};

module.exports = api;