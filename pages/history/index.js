// pages/favorite/index.js
const api = require('../../http.js');
//获取应用实例
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    activeIdex: 0,
    favoriteList: [],
    imgUrl: 'http://api.gojbcs.com',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  getFavorite(e) {
    // console.log(e)
    var that = this;
    if (e && e.currentTarget.dataset.index == 1 ){
      api.get('/collection/scriptlist?uid=' + wx.getStorageSync('user_id'), function (res) {
        // console.log(res.data.data.data)
        that.setData({
          favoriteList: res.data.data
        })
      }, true)
      that.setData({
        activeIdex: 1
      })
    } else{
      that.setData({
        activeIdex: 0
      })
      api.get('/collection/screenlist?uid=' + wx.getStorageSync('user_id'), function (res) {
        // console.log(res)
        that.setData({
          favoriteList: res.data.data
        })
      }, true)
    }
    // console.log(that.data.favoriteList)
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
    this.getFavorite();
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