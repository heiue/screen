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
    grant_type: "password"
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
            _this.setData({
              username: 'juben' + result.data.data.user_id,
              password: '123456'
            });
            var options = {
              apiUrl: WebIM.config.apiURL,
              username: _this.data.username.toLowerCase(),
              password: _this.data.password,
              nickname: "",
              appKey: WebIM.config.appkey,
              success: function (res) {
                console.log('res', res)
                if (res.statusCode == "200") {
                  console.log('成功')
                  // that.toastSuccess('注册成功');
                  var data = {
                    apiUrl: WebIM.config.apiURL,
                    user: _this.data.username.toLowerCase(),
                    pwd: _this.data.password,
                    grant_type: "password",
                    appKey: WebIM.config.appkey
                  };
                  wx.setStorage({
                    key: "myUsername",
                    data: _that.data.username.toLowerCase()
                  });
                  getApp().conn.open({
                    apiUrl: WebIM.config.apiURL,
                    user: _this.data.username.toLowerCase(),
                    pwd: _this.data.password,
                    grant_type: _this.data.grant_type,
                    appKey: WebIM.config.appkey
                  });
                  // 跳转回原页面
                  _this.getCardInfo();
                  _this.navigateBack();
                }
              },
              error: function (res) {
                getApp().conn.open({
                  apiUrl: WebIM.config.apiURL,
                  user: _this.data.username.toLowerCase(),
                  pwd: _this.data.password,
                  grant_type: _this.data.grant_type,
                  appKey: WebIM.config.appkey
                });
                wx.setStorage({
                  key: "myUsername",
                  data: _this.data.username.toLowerCase()
                });
                // 跳转回原页面
                _this.getCardInfo();
                _this.navigateBack();
              }
            };
            WebIM.utils.registerUser(options);

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