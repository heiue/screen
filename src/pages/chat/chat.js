let disp = require("../../utils/broadcast");
var util = require('../../utils/tutil.js');
var webim = require('../../utils/twebim.js');
var webimhandler = require('../../utils/txywebim_handler.js');

let isfirstTime = true
const app = getApp()

Page({
	data: {
    isNoData: true,
    contactList: [],//会话列表
    sqType: true,//获取用户信息弹窗显示
    component: false,
    subscribe: '1',
    selected: true,
    selected1: false,
    page: '1',//页数
    count: 0,//总条数
    signList: [],//拓展的用户列表
    placeValue: '搜索用户名称或电话',
    title: '累计发展',
    keyword: '',
    is_open: true,
	},

  onLoad: function (options) {

  },
  onShow: function () {
    this.initTim();
  },
  onLoadData: function () {
    // 如果是在消息列表页触发登录的则在登录成功后会触发这个方法
    this.initTim();
  },
  // 获取搜索字段
  searchName: function (e) {
    this.setData({
      keyword: e.detail.value
    })
  },
  search: function (e) {
    this.setData({
      signList: [],
      page: 1,
      title: '搜索到'
    })
    this.loadSign()
  },
  
  selected: function () {
    this.setData({
      selected: true,
      selected1: false

    })
  },
  selected1: function () {
    this.setData({
      selected: false,
      selected1: true
    })
  },
  /**
   * 登录腾讯云或者初始化会话列表
   */
  initTim: function () {
    console.log(app.globalData.userInfo)
    if (app.globalData.userInfo) {
      wx.showLoading()
      var that = this;
      var selToID = '';//会话列表不设置对方私聊账号
      webimhandler.init({
        accountMode: app.globalData.Config.accountMode
        , accountType: app.globalData.Config.accountType
        , sdkAppID: app.globalData.Config.sdkappid
        , selType: webim.SESSION_TYPE.C2C//私聊
        , id: app.globalData.userInfo.identifier
        , name: app.globalData.userInfo.agent_name
        , icon: app.globalData.userInfo.agent_pic,
        that: that
      });
      app.globalData.is_login_webim = wx.getStorageSync('is_login_webim')
      if (app.globalData.is_login_webim) {
        console.log(app.globalData.is_login_webim,'我不用再登录了')
        // 登录成功了再去检测更新用户信息
        that.initRecentContactList();
        wx.hideLoading()
      } else {
        console.log(app.globalData.is_login_webim,'我要登录')
        
        webimhandler.sdkLogin(that, app, selToID, function () {
          // 登录成功了再去检测更新用户信息
          that.initRecentContactList();
          wx.hideLoading()
        }, function () {
          
        });
      }
    }else{
      app.doLogin();
    }
  },

  //初始化聊天界面最近会话列表
  initRecentContactList: function () {

    var that = this;
    webim.getRecentContactList({
      'Count': 10 //最近的会话数 ,最大为 100
    }, function (resp) {
      console.log(resp.SessionItem,'会话列表')
      if (resp.SessionItem) {
        if (resp.SessionItem.length == 0) {
          that.setData({
            isNoData: false,
          })

        } else if (resp.SessionItem.length > 0) {
          that.setData({
            contactList: resp.SessionItem,
            isNoData: true
          })
          var data = that.data.contactList.map((item, index) => {
            if (item.MsgShow == '[其他]') {
              item.MsgShow = '[房源信息]'
            }
            var MsgTimeStamp = util.getDateDiff(item.MsgTimeStamp * 1000)
            item.MsgTimeStamp = MsgTimeStamp;
            return item;
          })
          that.setData({
            contactList: data
          })
          // 初始化最近会话的消息未读数(这里直接监听新消息事件)
          webim.syncMsgs(webimhandler.onMsgNotify());
        } else {
          return;
        }
      } else {
        var param = {
          app_token: app.globalData.userInfo.app_token,
        }
        //腾讯云会话列表接口
        // app.request('get', 'contact', that, param,
        //   (data) => {
        //     var data = data.map((item, index) => {

        //       item.C2cNick = item.nickname;
        //       item.To_Account = item.member_id;
        //       item.MsgTimeStamp = item.msgtimestamp;
        //       item.MsgShow = item.msgtxt;
        //       return item;
        //     })
        //     that.setData({
        //       contactList:data
        //     })
        //     // //获取所有用户id(用来获取头像)
        //     var userId = data.map((item, index) => {
        //       return item.To_Account
        //     })
        //     //获取头像
        //     that.getAvatar(userId, that.data.contactList, function (data) {
        //       data = data.map((item, index) => {
        //         item.C2cImage = item.pic
        //         if (item.MsgShow == '[其他]') {
        //           item.MsgShow = '[房源信息]'
        //         }
        //         return item;
        //       })
        //       that.setData({
        //         contactList: data
        //       })

        //     })

        //   }, () => {

        //   }, () => {

        //   })
      }


    }, function (resp) {
      //错误回调
    });


  },


  /**
   * 聊天
   */
  linkChat: function (e) {
    wx.navigateTo({
      url: '/pages/chatroom/chatroom?id=' + e.currentTarget.dataset.id + '&name=' + e.currentTarget.dataset.name,
    })
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var that = this;
    if (this.data.count > 10) {
      if (this.data.signList.length < this.data.count) {
        setTimeout(() => {
          var that = this;
          that.data.page++;
          that.loadSign()
        }, 50)

      } else {
        this.setData({
          loadTip: '加载完成！',
          isHideLoadMore: true,
        })
      }
    } else {
      this.setData({
        isHideLoadMore: true,
        loadTip: '加载完成！'
      })
    }

  },


	

});
