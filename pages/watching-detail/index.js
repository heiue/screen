// pages/watching-detail/index.js
let app = getApp()
const api = require('../../http.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl: app.globalData.imgUrl,//图片路径前缀
    aId: "",
    watching: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options.aid)
    this.setData({
      aId: options.aid
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
    this.getWatchingDetail()
  },
  getWatchingDetail() {
    let aid = this.data.aId,
    _this = this
    api.get(`/article/detail?aid=${aid}`,(res) => {
      _this.setData({
        watching: res.data.data
      })
    })
  },
  attention: function () {
    let id = this.data.watching.id,
    uid = wx.getStorageSync('user_id');
    api.post('/collection/save',{
      rid: id,
      rType: 2,
      uid: uid
    }, (res) => {
      wx.showToast({
        title: '关注成功',
        icon: 'none',
        duration:1000
      })
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