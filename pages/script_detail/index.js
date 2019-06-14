// pages/project_detail/index.js
let app = getApp();
const api = require('../../http.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    projectId:'',//项目id
    projectDetail: [],
    imgUrl: app.globalData.imgUrl,
    phone: app.globalData.phone,
    sid: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options.sid)
    this.setData({
      projectId: options.projectId || 1,
      sid: options.sid
    })
    this.getProjectDetail();
  },
  getProjectDetail() {

    var that = this;
      api.get('/script/detail?sid=' + that.data.sid, function (res) {
        console.log(res)
        that.setData({
          projectDetail: res.data.data
        })
      }, true)
    
  },
  attention: function () {
    let id = this.data.sid,
    uid = wx.getStorageSync('user_id');
    api.post('/collection/save',{
      rid: id,
      rType: 3,
      uid: uid
    }, (res) => {
      wx.showToast({
        title: '关注成功',
        icon: 'none',
        duration:1000
      })
    })
  },
  goHome () {
    wx.switchTab({
      url: '/pages/index/index'
    })
  },
	callPhone: function () {
	  wx.makePhoneCall({
	    phoneNumber: app.globalData.phone
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