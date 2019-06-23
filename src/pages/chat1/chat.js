// pages/chat/chat.js

const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    noData: app.data.imageUrl + '/no-msg.png',
    unitDefaultImg: app.data.imageUrl + '/xq-default.png',    
    houseDefault: app.data.imageUrl + '/msg-default.png',
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
    marginTop:'238',
    is_house:false,
    sendHouseLock:true,//房源发送按钮锁
    isEmoji:false,
    emojiChar: ["😁", "😋", "😜", "😉", "😌", "😅", "😳", "😊", "😝", "😰", "😠", "😩", "😲", "😞", "😭", "😍", "😖", "😱", "😡", "😚", "😤"],
    agentInfo:{},
    user_co_pattern_type:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.setData({
      height: wx.getSystemInfoSync().windowHeight,
      user_co_pattern_type: app.data.userInfo.user_co_pattern_type
    })
    
    if(options){
      if(options.id){//设置会话列表传参过来的为好友id
        that.setData({
          selToID: options.id,
          is_house: false,
          ischat: options.ischat,
          marginTop: '0',
                    
        })
        wx.setNavigationBarTitle({
          title: options.name
        })
        console.log(app.data.userInfo.id, '会话列表进')

      }else if (!options.name){//非经纪人角色,私聊账号为推荐经纪人账号
        that.setData({
          selToID: options.cid,
          houseId: options.houseid,
          type:options.type,
          ischat: options.ischat,
          is_house: true,
          marginTop: '238',
          
        })
        wx.setNavigationBarTitle({
          title: '置业顾问' + app.data.userInfo.agent_name
        })
        return;
      }else{
        that.setData({
          selToID: options.id ,
          houseId: options.houseid,
          type: options.type,
          ischat: options.ischat,
          is_house: true,
          marginTop: '238',
          
        })
        wx.setNavigationBarTitle({
          title: '盘方顾问' + options.name
        })
      }
    }
    
  },
  onShow:function () {
    if (!app.data.userInfo) {
      wx.switchTab({
        url: '/pages/index/index',
      })
      return;
    }
    this.initTim();
    this.checkAgent();
  },
  checkAgent:function(){
    var that = this;
    console.log(this.data.selToID,'对方的id')
    wx.request({
      url: app.data.apiUrl + 'member/get_member_info',
      header: {
        'content-type': 'application/json'
      },
      data: {
        app_token: app.data.userInfo.app_token,
        id: that.data.selToID
      },
      success: function (res) {
        wx.hideLoading()
        if (res.data.code == 0) {
          that.setData({
            agentInfo: res.data.data
          })
        } else if (res.data.code == 1) {
          setTimeout(function () {
            login.login(app)
          }, 500)
        } else {
          
        }
      }
    })
  },
  /**
   * 登录腾讯云或者初始化会话列表
   */
  initTim: function () {
    if (app.data.userInfo) {
      wx.showLoading()
      var that = this;
      wx.setStorageSync('msgKey', '')
      wx.setStorageSync('lastMsgTime', '')
      webimhandler.init({
        accountMode: app.data.Config.accountMode
        , accountType: app.data.Config.accountType
        , sdkAppID: app.data.Config.sdkappid
        , selType: webim.SESSION_TYPE.C2C//私聊
        , agent_member_id: app.data.userInfo.id
        , id: that.data.selToID
        , name: app.data.userInfo.agent_name
        , icon: app.data.userInfo.agent_pic,
        that: that
      });
      if (app.data.is_login_webim) {
        //获取聊天历史记录
        webimhandler.getC2CHistoryMsgs();
        //拉取所需要自定义的消息数据发送,从房源详情打开对话
        if (that.data.type != '') {
          that.createhousemsg();
        }
        wx.hideLoading()
      } else {
        webimhandler.sdkLogin(that, app, that.data.selToID, function () {
          //获取聊天历史记录
          webimhandler.getC2CHistoryMsgs();
          //拉取所需要自定义的消息数据发送,从房源详情打开对话
          if (that.data.type != '') {
            that.createhousemsg();
          }
          wx.hideLoading()
        }, function () {
          wx.request({
            url: app.data.apiUrl + 'index/update_tim_sign',
            header: {
              'content-type': 'application/json'
            },
            data: {
              app_token: app.data.userInfo.app_token,
            },
            success: function (res) {
              wx.hideLoading()
              if (res.data.code == 0) {
                // 重新存储用户信息
                app.data.userInfo = res.data.data;
                wx.setStorageSync("userInfo", res.data.data)
                that.initTim()
              } else if (res.data.code == 1) {
                setTimeout(function () {
                  login.login(app)
                }, 500)
              } else {
                wx.showToast({
                  title: res.data.msg,
                  icon: 'none',
                  duration: 2000
                })
              }
            }
          })
        });
      }
    }
  },
  // 选择表情发送
  selectEmoji:function(e){
    this.setData({
      inputValue: this.data.inputValue + e.currentTarget.dataset.text
    })

  },
  // 显示表情
  showEmoji:function(e){
    if (this.data.isEmoji){
      this.setData({
        isEmoji:false
      })
      
    }else{
      this.setData({
        isEmoji: true
      })
      this.pageScrollToBottom();
    }
  },

  //创建房源消息体
  createhousemsg:function(){
    var that = this;
    
    var param = {
      app_token: app.data.userInfo.app_token,
      id:that.data.houseId,
      type: that.data.type
    }
    app.request('get', 'createhousemsg', that, param,
      (data) => {

        var house = JSON.parse(data.array.MsgContent.Data);
        console.log(data.array.MsgContent,'房源消息体')
        that.setData({
          house:house,
          custom: data.array.MsgContent
        })
        if (that.data.ischat =='1') {
          if (!app.data.is_firstSend) {
            return;
          } else {
            //发送自定义消息
              that.sendCustom();
              app.data.is_firstSend = false;
              wx.setStorageSync('is_firstSend', app.data.is_firstSend)
          }
        }else{
          that.sendCustoms();
          this.setData({
            sendHouseLock: true
          })
        }
        
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
  //发送自定义消息(自动发送)
  sendCustom:function(msgdata){

    var that = this;
    webimhandler.sendCustomMsg(that.data.custom, (data)=>{//发送自定义消息成功
          var myMessages = that.setDatas(data)
            that.setData({
              myMessages: myMessages,
            })
            that.setData({
              houseId: 0,
              type: '',
              ischat: '',
            })
            setTimeout(function () {
              that.autoMsg()              
              that.pageScrollToBottom()
            }, 1000)
        })
  },
  //发送自定义消息(手动发送)
  sendCustoms: function (msgdata) {
    
    if (this.data.sendHouseLock){
      this.setData({
        sendHouseLock: false
      })
      var that = this;
      webimhandler.sendCustomMsg(that.data.custom, (data) => {//发送自定义消息成功
        var myMessages = that.setDatas(data)
        that.setData({
          myMessages: myMessages,
        })
        that.setData({
          houseId: 0,
          type: '',
          ischat:'',

        })
        setTimeout(function () {
          that.pageScrollToBottom()
        }, 1000)

      })
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
    if(that.data.is_lock){
      that.setData({
        is_lock:false
      })
      
      console.log(that.data.inputValue.length)
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
      if (!content.replace(/^\s*|\s*$/g, '')) return;
      this.setData({
        isEmoji: false
      })
      webimhandler.onSendMsg(content)
    }
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
      app_token: app.data.userInfo.app_token,
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
  //消息通知经纪人
  msginformagent: function (id, msgBody) {
    var that = this;
    var MsgTimestamp = wx.getStorageSync('lastMsgTime')
    var param = {
      app_token: app.data.userInfo.app_token,
      To_Account: id,
      MsgBody: msgBody
    }
    app.request('get', 'msginformagent', that, param,
      (data) => {

      }, () => {
        return;
      }, () => {
        return;
      })
  },
  // 经纪人自动回复消息
  autoMsg:function(e){
    var that = this;
    //获取新房数据
    wx.request({
      url: app.data.apiUrl + 'im/msgautoreply',
      header: {
        'content-type': 'application/json'
      },
      data: {
        app_token: app.data.userInfo.app_token,
        To_Account: that.data.selToID,
      },
      success: function (res) {
        if (res.data.code == 0) {
          that.pageScrollToBottom()
        } else if (res.data.code == 1) {
          setTimeout(function () {
            login.login(app)
          }, 500)
        } else {
         
        }

      },
      fail: function (e) {
        wx.hideLoading();
        wx.showModal({
          content: '网络不畅，请检测网络后重试',
          confirmText: "确认",
          cancelText: "取消",
          success: function (res) {
            if (res.confirm) {
            } else {
            }
          }
        });
      }
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
  // 选择楼盘进行推盘
  filterHouse: function (e) {
    // 0.新房 1.海外 2.二手房 3.租房
    switch (e.currentTarget.dataset.type) {
      case '0':
        if (this.data.user_co_pattern_type == '1'){//商业地产
          wx.navigateTo({
            url: '/pages/newShop/newShop?type=0&is_choose2=1',
          })
        }else{
          wx.navigateTo({
            url: '/pages/newhouse/newhouse?type=0&is_choose2=1',
          })
        }
        break;
      case '2':
        if (this.data.user_co_pattern_type == '1') {//商业地产
         
          wx.navigateTo({
            url: '/pages/shop/shop?is_choose2=1',
          })
        } else {
          wx.navigateTo({
            url: '/pages/useroom/useroom?is_choose2=1',
          })
        }
        break;
      case '1':
        wx.navigateTo({
          url: '/pages/newhouse/newhouse?type=1&is_choose2=1',
        })
        break;
      case '3':
        if (this.data.user_co_pattern_type == '1') {//商业地产
          wx.navigateTo({
            url: '/pages/office/office?is_choose2=1',
          })
        }else{
          wx.navigateTo({
            url: '/pages/rentroom/rentroom?is_choose2=1',
          })
        }
        break;
    }
  },
  // 资料详情
  linkCard: function () {
    if (this.data.agentInfo.is_agent == '1'){//经纪人
      wx.navigateTo({
        url: '../agentCard/agentCard?lock=1&agent_phone=' + this.data.agentInfo.agent_info.phone + '&id=' + this.data.agentInfo.agent_info.id
      })
    }else{//普通用户
      wx.navigateTo({
        url: '/pages/userDetail/userDetail?lock=1&id=' + this.data.selToID
      })
    }
  },

  

})