
//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
  },
  /**
  * 执行用户登录
  */
  doLogin() {
    // 保存当前页面
    let pages = getCurrentPages();
    if (pages.length) {
      let currentPage = pages[pages.length - 1];
      "pages/login/login" != currentPage.route &&
        wx.setStorageSync("currentPage", currentPage);
    }
    // 跳转授权页面
    wx.navigateTo({
      url: "/pages/login/index"
    });
  },
  /**
 * 当前用户id
 */
  getUserId() {
    return wx.getStorageSync('user_id');
  },
  /**
   * 验证是否存在user_info
   */
  validateUserInfo() {
    let user_info = wx.getStorageSync('user_info');
    return !!wx.getStorageSync('user_info');
  },
  globalData: {
    userInfo: wx.getStorageSync('user_info') || null,
    imgUrl: 'http://api.gojbcs.com/images',
		phone:'01056257208'
  }
})
