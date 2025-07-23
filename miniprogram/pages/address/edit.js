Page({
  data: {
    address: null,
    id: ''
  },

  onLoad: function(options) {
    if (options.id) {
      this.setData({
        id: options.id
      })
      this.loadAddress(options.id)
    }
  },

  // 加载地址信息
  loadAddress: function(id) {
    const addressList = wx.getStorageSync('addressList') || []
    const address = addressList.find(item => item.id === id)
    
    if (address) {
      this.setData({
        address: address
      })
    } else {
      wx.showToast({
        title: '地址不存在',
        icon: 'none'
      })
      setTimeout(() => {
        wx.navigateBack()
      }, 1000)
    }
  },

  // 输入框内容变化
  inputChange: function(e) {
    const field = e.currentTarget.dataset.field
    const value = e.detail.value
    
    this.setData({
      [`address.${field}`]: value
    })
  },

  // 保存地址
  saveAddress: function() {
    const { address } = this.data
    
    // 验证表单
    if (!address.userName || !address.telNumber || !address.provinceName || 
        !address.cityName || !address.countyName || !address.detailInfo) {
      wx.showToast({
        title: '请填写完整信息',
        icon: 'none'
      })
      return
    }
    
    // 验证手机号格式
    if (!/^1\d{10}$/.test(address.telNumber)) {
      wx.showToast({
        title: '请输入正确的手机号',
        icon: 'none'
      })
      return
    }
    
    // 获取地址列表
    let addressList = wx.getStorageSync('addressList') || []
    
    // 查找当前地址的索引
    const index = addressList.findIndex(item => item.id === address.id)
    
    if (index > -1) {
      // 更新地址
      addressList[index] = address
      
      // 如果是默认地址，需要更新默认地址存储
      if (address.isDefault) {
        wx.setStorageSync('defaultAddress', address)
      }
    }
    
    // 保存地址列表
    wx.setStorageSync('addressList', addressList)
    
    wx.showToast({
      title: '保存成功',
      icon: 'success'
    })
    
    setTimeout(() => {
      wx.navigateBack()
    }, 1000)
  },

  // 从微信通讯录选择地址
  chooseWxAddress: function() {
    wx.chooseAddress({
      success: (res) => {
        const currentAddress = this.data.address || {}
        
        // 更新地址信息，保留原有的ID和默认状态
        const address = {
          ...currentAddress,
          userName: res.userName,
          telNumber: res.telNumber,
          provinceName: res.provinceName,
          cityName: res.cityName,
          countyName: res.countyName,
          detailInfo: res.detailInfo,
          postalCode: res.postalCode
        }
        
        this.setData({
          address: address
        })
      }
    })
  }
})