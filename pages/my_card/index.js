// pages/my_card/index.js
let app = getApp();
const api = require('../../http.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: JSON.parse(app.globalData.userInfo),
    cardInfo:[],//名片内可修改的用户信息
    userIndustry:'',
    userPhone:'',
    userWechat:'',
    userCompany: '',
    usereMail:'',
    userIntro: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getUserInfo();
  },

  getUserInfo() {
    api.post('/user/getusercard',{
      uid: wx.getStorageSync('user_id')
    },function(res){
      console.log(res)
    })
  },

  submitUserInfo(e){
    console.log(e.currentTarget.dataset.val)
    api.post('/user/updateuser',{

    },function(res){
      console.log(res)
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