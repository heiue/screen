let WebIM = require("../../utils/WebIM")["default"];
let disp = require("../../utils/broadcast");
let app = getApp();
const api = require('../../http.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    username: "",
    password: "",
    grant_type: "password",
		nickName:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // new app.ToastPannel.ToastPannel();
  },

  /**
   * 授权登录
   */
  authorLogin: function (e) {
    let _this = this;
    if (e.detail.errMsg !== 'getUserInfo:ok') {
      return false;
    }
    wx.showLoading({ title: "正在登录", mask: true });
    // 执行微信登录
    wx.login({
      success: function (res) {
        //发送用户信息
        api.post('/user/login'
          , {
            code: res.code,
            user_info: e.detail.rawData
          }
          , function (result) {
            // 记录token user_id
            wx.setStorageSync('user_info', e.detail.rawData);
            wx.setStorageSync('token', result.data.data.token);
            wx.setStorageSync('user_id', result.data.data.user_id);
            // 跳转回原页面
            _this.getUserId();
            _this.getCardInfo();
            _this.navigateBack(); 
          });
      }
    });
  },

  // 获取名片信息
  getCardInfo() {
    api.post('/user/getusercard', {
      uid: wx.getStorageSync('user_id')
    },function(res){
      console.log(res)
    },true)
  },

  getUserId() {
    api.post('/user/getuserinfo', {
      token: wx.getStorageSync('token')
    }, function (res) {
      wx.setStorageSync('user_id', res.data.data.userinfo.id);
      wx.setStorageSync('userInfoSign', res.data.data.userinfo);
      app.globalData.userInfoSign = wx.getStorageSync('userInfoSign');
      app.globalData.userInfo = wx.getStorageSync('user_info');
    })
  },

  /**
   * 授权成功 跳转回原页面
   */
  navigateBack: function () {
    wx.navigateBack();
    // let currentPage = wx.getStorageSync('currentPage');
    // wx.redirectTo({
    //   url: '/' + currentPage.route + '?' + App.urlEncode(currentPage.options)
    // });
  },

})