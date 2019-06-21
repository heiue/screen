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
    bannerLength:0,
    active:1,
    autoplay: true,
    interval: 3000,
    circular: true,
    eliteList:[],//精英养成记列表
    eliteClassList:[],//精品讲座
    page:1
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
      url: '/pages/pay_know_detail/index?id=' + e.currentTarget.dataset.id + '&name=' + e.currentTarget.dataset.name
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
    this.setData({
      page:1,
      eliteList:[]
    })
    this.getPayPlist(this.data.page);
    this.getPayPlistClass();
  },
  //精品讲座
  getPayPlistClass() {
    var that = this;
    api.get('/knowledge/elite/list?cid=1', function (res) {
      that.setData({
        eliteClassList: res.data.data,
        bannerLength: res.data.data.length
      })
    }, false)
  },
  // 精英养成记
  getPayPlist(page) {
    var that = this;
    api.get('/knowledge/elite/list?cid=2&page='+page, function (res) {
      that.setData({
        eliteList: res.data.data.concat(that.data.eliteList)
      })
      // console.log(that.data.eliteList)
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
    this.getPayPlist(this.data.page+=1)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})