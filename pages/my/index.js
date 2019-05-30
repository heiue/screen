// pages/my/index.
let app = getApp();
const api = require('../../http.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: JSON.parse(app.globalData.userInfo)
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(this.data.userInfo)
  },
  goMyCard: function () {
    wx.navigateTo({
      url: '/pages/my_card/index'
    })
  },
  goMyMessage: function () {
    wx.navigateTo({
      url: '/pages/my_message/index'
    })
  },
  goMember: function () {
    wx.navigateTo({
      url: '/pages/member_center/index'
    })
  },
  goExcon: function() {
    wx.navigateTo({
      url: '/pages/exclusive_consultant/index'
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
  gohistory() {
    wx.navigateTo({
      url: '/pages/history/index'
    })
  },
  goFavorite() {
    wx.navigateTo({
      url: '/pages/favorite/index'
    })
  },
  goBindphone: function() {
    wx.navigateTo({
      url: '/pages/bind_phone/index'
    })
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