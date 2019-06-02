// pages/member_center/index.js
const api = require('../../http.js');
//获取应用实例
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: JSON.parse(app.globalData.userInfo),
    popupShow: false,
    cardActive: 0,
    cardList: [{
      chargeName:'一个月',
      chargePrice: 9.9
    },
    {
      chargeName: '三个月',
      chargePrice: 39
    },
    {
      chargeName: '六个月',
      chargePrice: 69
    },
    {
      chargeName: '一年',
      chargePrice: 99
    }],
    animationData: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  pay() {
    var that = this;
    console.log(that.data.cardActive)
    api.post('/pay',{
      token: wx.getStorageSync('token'),
      rechargeType: Number(that.data.cardActive)+1,
      price: that.data.cardList[that.data.cardActive].chargePrice
    },function(res){
      console.log(res)
    })
  },
  closePopup() {
    const animation = wx.createAnimation({
      duration: 200
    })
    this.animation = animation
    animation.bottom('-1000rpx').step()
    this.setData({
      animationData: animation.export(),
    })
    let that = this
    setTimeout(() => {
      that.setData({
        popupShow: false
      })
    },200)
    
  },
  showPopup() {
    this.setData({
      popupShow: true
    })
    const animation = wx.createAnimation({
      duration: 1000
    })
    this.animation = animation
    animation.bottom('0').step()
    this.setData({
      animationData: animation.export()
    })
  },
  cardChage(e) {
    this.setData({
      cardActive: e.currentTarget.dataset.index
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})