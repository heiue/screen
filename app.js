//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  globalData: {
    userInfo: null
  },

  editTabBar: function () {

    var _curPageArr = getCurrentPages();

    var _curPage = _curPageArr[_curPageArr.length - 1];

    var _pagePath = _curPage.__route__;

    if (_pagePath.indexOf('/') != 0) {

      _pagePath = '/' + _pagePath;

    }

    var tabBar = this.globalData.tabBar;

    for (var i = 0; i < tabBar.list.length; i++) {

      tabBar.list[i].active = false;

      if (tabBar.list[i].pagePath == _pagePath) {

        tabBar.list[i].active = true;//根据页面地址设置当前页面状态

      }

    }

    _curPage.setData({

      tabBar: tabBar

    });

  },

  globalData: {

    userInfo: null,

    tabBar: {

      color: "#333333",

      selectedColor: "#ffe147",

      borderStyle: "white",

      list: [
        {
          selectedIconPath: "/pages/image/index-on.png",

          iconPath: "/pages/image/index.png",

          pagePath: "/pages/index/index",

          text: "首页",

          clas: "menu-item",

          selected: false,

        },

        {

          selectedIconPath: "/pages/image/project-on.png",

          iconPath: "/pages/image/project.png",

          pagePath: "/pages/project/project",

          text: "项目",

          clas: "menu-item",

          selected: false

        },

        {

          selectedIconPath: "/pages/image/friend-on.png",

          iconPath: "/pages/image/friend.png",

          pagePath: "/pages/friend/friend",

          text: "人脉圈",

          clas: "menu-item",

          selected: false

        },

        {

          selectedIconPath: "/pages/image/pay-on.png",

          iconPath: "/pages/image/pay.png",

          pagePath: "/pages/pay/pay",

          text: "知识付费",

          clas: "menu-item menu-item2",

          selected: false

        },

        {

          selectedIconPath: "/pages/image/my-on.png",

          iconPath: "/pages/image/my.png",

          pagePath: "/pages/my/my",

          text: "我的",

          clas: "menu-item menu-item2",

          selected: false

        }

      ],

      position: "bottom"

    }

  }
})