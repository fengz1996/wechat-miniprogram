const api = require('../../utils/api');

Page({
  data: {
    balance: '0.00',
    transactions: [],
    activeTab: 'transactions', // transactions or commissions
    commissions: [],
    loading: false
  },
  
  onLoad: function() {
    this.getWalletInfo();
    this.getCommissionInfo();
  },
  
  onShow: function() {
    this.getWalletInfo();
    this.getCommissionInfo();
  },
  
  getWalletInfo: function() {
    this.setData({ loading: true });
    
    api.getWalletInfo().then(data => {
      this.setData({
        balance: data.balance.toFixed(2),
        transactions: data.transactions || [],
        loading: false
      });
    }).catch(err => {
      console.error('获取钱包信息失败:', err);
      this.setData({ loading: false });
    });
  },
  
  getCommissionInfo: function() {
    api.getCommissionInfo().then(data => {
      this.setData({
        commissions: data || []
      });
    }).catch(err => {
      console.error('获取佣金信息失败:', err);
    });
  },
  
  changeTab: function(e) {
    const tab = e.currentTarget.dataset.tab;
    this.setData({
      activeTab: tab
    });
  },
  
  showWithdrawModal: function() {
    wx.showModal({
      title: '提现',
      content: '请输入提现金额',
      editable: true,
      placeholderText: '请输入提现金额',
      success: (res) => {
        if (res.confirm && res.content) {
          const amount = parseFloat(res.content);
          
          if (isNaN(amount) || amount <= 0) {
            wx.showToast({
              title: '请输入有效金额',
              icon: 'none'
            });
            return;
          }
          
          if (amount > parseFloat(this.data.balance)) {
            wx.showToast({
              title: '余额不足',
              icon: 'none'
            });
            return;
          }
          
          // 提现
          api.withdraw(amount).then(() => {
            wx.showToast({
              title: '提现申请已提交',
              icon: 'success'
            });
            
            // 刷新钱包信息
            this.getWalletInfo();
          }).catch(err => {
            console.error('提现失败:', err);
          });
        }
      }
    });
  },
  
  // 获取交易类型名称
  getTransactionTypeName: function(type) {
    const types = {
      1: '充值',
      2: '提现',
      3: '佣金收入',
      4: '消费'
    };
    return types[type] || '未知';
  },
  
  // 获取佣金类型名称
  getCommissionTypeName: function(type) {
    const types = {
      1: '直推设备',
      2: '自有设备销售',
      3: '管道收益'
    };
    return types[type] || '未知';
  }
})