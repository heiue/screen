// pages/chat/chat.js
var webim = require('../../utils/twebim.js');
var webimhandler = require('../../utils/txywebim_handler.js');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inputValue:'',//发送的文字消息内容
    myMessages: [],//消息
    house:{},//房源
    custom:'',
    selToID:0,
    scrollTop: 0,
    houseId:'',//房源id
    type:'',//房源类型
    ischat:'',//是否是手动选择推盘
    height:'',
    complete:0,//默认为有历史记录可以拉取
    is_lock:true,
    is_house:false,
    sendHouseLock:true,//房源发送按钮锁
    isEmoji:false,
    agentInfo:{},
    user_co_pattern_type:'',
    pic:"",
    name:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.setData({
      height: wx.getSystemInfoSync().windowHeight,
    })
    if (options.id){
      that.setData({
        selToID: options.id,
      })
      console.log(this.data.selToID)
    }


  },
  onShow:function () {
    this.initTim();
  },
  /**
   * 登录腾讯云或者初始化会话列表
   */
  initTim: function () {
    if (app.globalData.userInfo) {
      wx.showLoading()
      var that = this;
      wx.setStorageSync('msgKey', '')
      wx.setStorageSync('lastMsgTime', '')
      webimhandler.init({
        accountMode: app.globalData.Config.accountMode
        , accountType: app.globalData.Config.accountType
        , sdkAppID: app.globalData.Config.sdkappid
        , selType: webim.SESSION_TYPE.C2C//私聊
        , agent_member_id: app.globalData.userInfoSign.identifier
        , id: that.data.selToID
        , name: ''
        , icon: '',
        that: that
      });
      app.globalData.is_login_webim = wx.getStorageSync('is_login_webim')
      if (app.globalData.is_login_webim) {
        //获取聊天历史记录
        webimhandler.getC2CHistoryMsgs();
        wx.hideLoading()
      } else {
        webimhandler.sdkLogin(that, app, that.data.selToID, function () {
          //获取聊天历史记录
          webimhandler.getC2CHistoryMsgs();

          wx.hideLoading()
        }, function () {

        });
      }
    }
  },
  //获取普通文本消息
  bindKeyInput:function(e){
    var that = this;
     that.setData({
      inputValue:e.detail.value,
      // isEmoji: false
    })

  },

  // 发送普通文本消息
  bindConfirm: function(e) {
    var that = this;
    this.setData({
      isEmoji: false

    })
      if (that.data.inputValue.length == 0) {
        wx.showToast({
          title: '消息不能为空!',
          icon:'none'
        })
        that.setData({
          is_lock: true
        })
        return;
      }
      var content = that.data.inputValue;
      webimhandler.onSendMsg(content)
  },
  // 清除输入框
  clearInput:function(e){
    this.setData({
      inputValue:''
    })
  },
  /**
   * 下拉刷新
   */
  onPullDownRefresh: function () {
    if (this.data.complete == 0){
      wx.showLoading({
        title: '加载历史记录中...',
      })
      var that = this;
      webimhandler.getPrePageC2CHistoryMsgs()
      wx.stopPullDownRefresh();
    }else{
      wx.showToast({
        title: '没有更多历史记录了',
        icon:'none'
      })
      setTimeout(function () {
        wx.stopPullDownRefresh();
      }, 1000)
    }


  },
  //获取七天之前的聊天历史记录
  getc2cmsg:function(){
    var that = this;
    var MsgTimestamp = wx.getStorageSync('lastMsgTime')
    var param = {
      app_token: app.globalData.userInfo.app_token,
      To_Account: that.data.selToID,
      MsgTimestamp: MsgTimestamp
    }
    app.request('get', 'getc2cmsg', that, param,
      (data) => {
      }, () => {
        setTimeout(function () {
          login.login(app)
        }, 500)
      }, () => {
        wx.navigateBack({
          delta: 1
        })
        return;
      })
  },
  // 滚动最底部
  pageScrollToBottom: function () {
      wx.createSelectorQuery().select('#chat').boundingClientRect(function (rect) {
        // 使页面滚动到底部
        wx.pageScrollTo({
          scrollTop: rect.bottom
        })
      }).exec()
  },
  // 跳转房源详情
  linkDetail:function(e){
    var type;
    switch (e.currentTarget.dataset.type){
      case '新房':
        wx.navigateTo({
          url: '../newHouseDetail/newHouseDetail?lock=1&id=' + e.currentTarget.dataset.id,
        })

        break;
      case '二手房':
        type = 'sale';
        if (e.currentTarget.dataset.usage == '住宅'){
          wx.navigateTo({
            url: '../useroomDetail/useroomDetail?lock=1&id=' + e.currentTarget.dataset.id,
          })
        } else if (e.currentTarget.dataset.usage == '商铺'){
          wx.navigateTo({
            url: '../shopDetail/shopDetail?lock=1&id=' + e.currentTarget.dataset.id+'&type=' + type,
          })
        }else{
          wx.navigateTo({
            url: '../officeDetail/officeDetail?lock=1&id=' + e.currentTarget.dataset.id+'&type=' + type,
          })
        }
        break;
      case '租房':
        type = 'rent';
        if (e.currentTarget.dataset.usage == '住宅') {
          wx.navigateTo({
            url: '../rentroomDetail/rentroomDetail?lock=1&id=' + e.currentTarget.dataset.id,
          })
        } else if (e.currentTarget.dataset.usage == '商铺') {
          wx.navigateTo({
            url: '../shopDetail/shopDetail?lock=1&id=' + e.currentTarget.dataset.id + '&type=' + type,
          })
        } else {
          wx.navigateTo({
            url: '../officeDetail/officeDetail?lock=1&id=' + e.currentTarget.dataset.id + '&type=' + type,
          })
        }
        break;
      case '小区':
        wx.navigateTo({
          url: '../unitDetail/unitDetail?lock=1&id=' + e.currentTarget.dataset.id,
        })
        break;
    }
    this.setData({
      ischat: ''
    })
  },
  setDatas: function (data){
    var that = this;
    var myMessages = data.map((item, index) => {

      switch (item.type) {
        case 1:
          item.type = '二手房'
          break;
        case 2:
          item.type = '租房'
          break;
        case 3:
          item.type = '小区'
          break;
        case 4:
          item.type = '新房'
          break;
      }
      if (item.img == '') {
        item.img = that.data.houseDefault
      }
      return item;
    })

    return myMessages;

  },



})