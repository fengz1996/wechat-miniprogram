const api = require('../../utils/api');

Page({
  data: {
    teamMembers: [],
    loading: false,
    totalCount: 0
  },
  
  onLoad: function() {
    this.getTeamInfo();
  },
  
  onPullDownRefresh: function() {
    this.getTeamInfo();
    wx.stopPullDownRefresh();
  },
  
  getTeamInfo: function() {
    this.setData({ loading: true });
    
    api.getTeamInfo().then(data => {
      this.setData({
        teamMembers: data.team_members || [],
        totalCount: data.team_count || 0,
        loading: false
      });
    }).catch(err => {
      console.error('获取团队信息失败:', err);
      this.setData({ loading: false });
    });
  },
  
  copyInviteCode: function() {
    const userInfo = wx.getStorageSync('userInfo');
    if (!userInfo || !userInfo.id) {
      wx.showToast({
        title: '获取邀请码失败',
        icon: 'none'
      });
      return;
    }
    
    wx.setClipboardData({
      data: `${userInfo.id}`,
      success: function() {
        wx.showToast({
          title: '邀请码已复制',
          icon: 'success'
        });
      }
    });
  },
  
  navigateToQRCode: function() {
    wx.showToast({
      title: '功能开发中',
      icon: 'none'
    });
  },
  
  formatDate: function(dateStr) {
    if (!dateStr) return '';
    
    const date = new Date(dateStr);
    return `${date.getFullYear()}-${(date.getMonth()+1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
  }
})