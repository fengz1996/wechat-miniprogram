Page({
  data: {
    addressList: [],
    selectedId: ''
  },

  onLoad: function(options) {
    // 如果有传入参数，表示是从结算页面跳转来的选择地址
    if (options.from === 'cart') {
      this.setData({
        fromCart: true
      })
    }
  },

  onShow: function() {
    // 加载地址列表
    this.loadAddressList()
  },

  // 加载地址列表
  loadAddressList: function() {
    const addressList = wx.getStorageSync('addressList') || []
    const defaultAddress = wx.getStorageSync('defaultAddress') || null
    
    if (defaultAddress) {
      this.setData({
        selectedId: defaultAddress.id
      })
    }

    this.setData({
      addressList: addressList
    })
  },

  // 添加新地址
  addAddress: function() {
    wx.chooseAddress({
      success: (res) => {
        // 生成一个唯一ID
        const addressId = 'addr_' + Date.now()
        
        // 构建地址对象
        const address = {
          id: addressId,
          userName: res.userName,
          telNumber: res.telNumber,
          provinceName: res.provinceName,
          cityName: res.cityName,
          countyName: res.countyName,
          detailInfo: res.detailInfo,
          postalCode: res.postalCode,
          isDefault: false
        }
        
        // 获取现有地址列表
        let addressList = wx.getStorageSync('addressList') || []
        
        // 如果是第一个地址，则设为默认
        if (addressList.length === 0) {
          address.isDefault = true
          wx.setStorageSync('defaultAddress', address)
        }
        
        // 添加新地址到列表
        addressList.unshift(address)
        wx.setStorageSync('addressList', addressList)
        
        // 更新页面数据
        this.loadAddressList()
        
        wx.showToast({
          title: '添加成功',
          icon: 'success'
        })
      },
      fail: (err) => {
        if (err.errMsg !== 'chooseAddress:fail cancel') {
          wx.showToast({
            title: '获取地址失败',
            icon: 'none'
          })
        }
      }
    })
  },

  // 编辑地址
  editAddress: function(e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/address/edit/edit?id=${id}`
    })
  },

  // 删除地址
  deleteAddress: function(e) {
    const id = e.currentTarget.dataset.id
    
    wx.showModal({
      title: '提示',
      content: '确定要删除该地址吗？',
      success: (res) => {
        if (res.confirm) {
          // 获取地址列表
          let addressList = wx.getStorageSync('addressList') || []
          
          // 查找要删除的地址
          const index = addressList.findIndex(item => item.id === id)
          
          if (index > -1) {
            const address = addressList[index]
            
            // 从列表中移除
            addressList.splice(index, 1)
            wx.setStorageSync('addressList', addressList)
            
            // 如果删除的是默认地址，需要重新设置默认地址
            if (address.isDefault && addressList.length > 0) {
              addressList[0].isDefault = true
              wx.setStorageSync('defaultAddress', addressList[0])
            } else if (addressList.length === 0) {
              // 如果没有地址了，清除默认地址
              wx.removeStorageSync('defaultAddress')
            }
            
            // 更新页面数据
            this.loadAddressList()
            
            wx.showToast({
              title: '删除成功',
              icon: 'success'
            })
          }
        }
      }
    })
  },

  // 设为默认地址
  setDefault: function(e) {
    const id = e.currentTarget.dataset.id
    
    // 获取地址列表
    let addressList = wx.getStorageSync('addressList') || []
    
    // 更新所有地址的默认状态
    addressList = addressList.map(item => {
      if (item.id === id) {
        item.isDefault = true
        wx.setStorageSync('defaultAddress', item)
      } else {
        item.isDefault = false
      }
      return item
    })
    
    wx.setStorageSync('addressList', addressList)
    
    // 更新页面数据
    this.loadAddressList()
    
    wx.showToast({
      title: '设置成功',
      icon: 'success'
    })
  },

  // 选择地址并返回
  selectAddress: function(e) {
    if (!this.data.fromCart) return
    
    const id = e.currentTarget.dataset.id
    
    // 获取地址列表
    const addressList = wx.getStorageSync('addressList') || []
    
    // 查找选中的地址
    const address = addressList.find(item => item.id === id)
    
    if (address) {
      // 临时存储选中的地址
      wx.setStorageSync('selectedAddress', address)
      
      // 返回上一页
      wx.navigateBack()
    }
  }
})