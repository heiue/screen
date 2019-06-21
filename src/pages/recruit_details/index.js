// pages/recruit_details/index.js
var WxParse = require('../../wxParse/wxParse.js');
let app = getApp()
const api = require('../../http.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    rid:'',
    recruitDetail:[],
    recruitIntro:'',
    recruitposition:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      rid: options.rid
    })
  },
  getRecruitDetail(){
    var that = this;
    api.get('/task/recruitment/detail?rid=' + that.data.rid + '&uid=' + wx.getStorageSync('user_id'),function(res){
      
      that.setData({
        recruitDetail:res.data.data,
        recruitIntro: WxParse.wxParse('recruitIntro', 'html', res.data.data.introduction, that),
        recruitposition: WxParse.wxParse('recruitposition', 'html', res.data.data.positionClaim, that),
      })
    },true)
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
    this.getRecruitDetail();
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