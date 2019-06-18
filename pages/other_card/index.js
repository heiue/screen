// pages/other_card/index.js

const api = require('../../http.js');
//获取应用实例
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title:'名片',
    uid: '',
    imgurl:'http://api.gojbcs.com',
    userInfo:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      title:options.name,
      uid: options.id
    })
  },
  getUserInfo(){
    var that = this;
    api.post('/screenwriter/detail',{
      sid: that.data.uid,
      uid: wx.getStorageSync('user_id')
    },function(res) {
      that.setData({
        userInfo: res.data.data
      })
    })
  },
  attention: function () {
    var that = this;
    let id = this.data.uid,
      uid = wx.getStorageSync('user_id');
    api.post('/collection/save', {
      rid: id,
      rType: 4,
      uid: uid
    }, (res) => {
      if (that.data.userInfo.isCollection == 0){
        wx.showToast({
          title: '关注成功',
          icon: 'none',
          duration: 1000
        })
      }else {
        wx.showToast({
          title: '已取消关注',
          icon: 'none',
          duration: 1000
        })
      }
      
      that.getUserInfo();
    })
  },
  callPhone: function (e) {
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.phone
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