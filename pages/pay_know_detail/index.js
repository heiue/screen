// pages/pay_know_detail/index.js
var WxParse = require('../../wxParse/wxParse.js');
let app = getApp()
const api = require('../../http.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl: app.globalData.imgUrl,
    imgurl: app.globalData.imgurl,
    id:'',
    isVip: false,//是否为VIP用户
    detail:[],
    content:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.setData({
      id: options.id
    })
    this.getdetail();
  },
  getVip() {
    wx.navigateTo({
      url: '/pages/member_center/index'
    })
  },
  //获取详情
  getdetail(){
    var that = this;
    api.get('/knowledge/elite/detail?eid='+that.data.id,function(res){
      // console.log(res.data.data.content )
      that.setData({
        detail: res.data.data,
        content: WxParse.wxParse('content', 'html', res.data.data.content,that)
      })
      
    },false)
  },
  //获取用户信息 判断是否为vip
  getUserInfo(){
    var that = this;
    api.get('/user/getuserinfo?token=' + wx.getStorageSync('token'),function(res){
      that.setData({
        isVip: res.data.data.userinfo.is_vip
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
    this.getUserInfo()
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