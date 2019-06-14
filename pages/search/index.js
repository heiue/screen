// pages/search/index.js
const api = require('../../http.js');
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl: app.globalData.imgUrl,//图片路径前缀
    searchQurey: '',
    search: true,
    searchList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  goCard(e){
    wx.navigateTo({
      url: '/pages/friends_card/index?uid=' + e.currentTarget.dataset.uid + '&uid=' + wx.getStorageSync('user_id')
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  },
  searchInput(e) {
    this.setData({
      searchQurey: e.detail.value
    })
    console.log(e)
  },
  getSearch(e) {
    let query = e.detail.value,
    _this = this
    api.get(`/search?keyword=${query}&limit=5`,(res) => {
      _this.setData({
        searchList: res.data.data
      })
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