// pages/my_card/index.js
let app = getApp();
const api = require('../../http.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: JSON.parse(app.globalData.userInfo),
    cardData:{
      uid: wx.getStorageSync('user_id'),
      cardid:'',
      card:{
        name:'',
        company:'',
        position:'',
      },
      info: {
        mobile: "",
        wechat: "",
        email: "",
        address: "",
        intro: ""
      }
    },//名片内可修改的用户信息
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
      uid: this.data.cardData.uid
    },function(res){
      console.log(res)
    })
  },

  submitUserInfo(e){
    var that = this;
    if (e.currentTarget.dataset.val == 'industry') {
      this.data.cardData.card.position = e.detail.value
    }
    console.log(that.data.cardInfo)
    var cardData = that.data.cardData
    api.post('/user/updateusercard',{
      cardData 
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