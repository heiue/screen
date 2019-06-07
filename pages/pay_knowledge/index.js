// pages/pay_knowledge/index.js
let app = getApp()
const api = require('../../http.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl: app.globalData.imgUrl,
    imgurl: app.globalData.imgurl,
    bannerLength:5,
    active:1,
    banner:[1,1,1,1,1],
    autoplay: true,
    interval: 3000,
    circular: true,
    eliteList:[]//精英养成记列表
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  },
  swiperchange:function (e) {
    this.setData({
      active: e.detail.current + 1
    })
  },
  goDetail(e) {
    // console.log(e.currentTarget.dataset.id)
    wx.navigateTo({
      url: '/pages/pay_know_detail/index?id=' + e.currentTarget.dataset.id
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
    this.getPayPlist();
  },

  getPayPlist() {
    var that = this;
    api.get('/knowledge/elite/list', function (res) {
      that.setData({
        eliteList:res.data.data
      })
      console.log(that.data.eliteList)
    }, false)
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