Page({
  data: {
    address: {}
  },
  onShow() {
    const address = wx.getStorageSync('address') || {};
    this.setData({ address });
  },
  onSubmit(e) {
    const form = e.detail.value;
    if (!form.name || !form.phone || !form.detail) {
      wx.showToast({ title: '请填写完整信息', icon: 'none' });
      return;
    }
    wx.setStorageSync('address', form);
    wx.showToast({ title: '地址已保存', icon: 'success' });
    wx.navigateBack();
  }
});