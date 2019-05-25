// pages/project/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nav: ['全部', '网剧', '电视剧', '院线', '网络大电影', '动漫', 'IP项目', '舞台剧', '网台互动', '影视资源'],
    navActive: 0,
    project: [1, 1, 1, 1, 1],
    moreTitleShow: true,
    animationData: {},
    moreTitle: ['古装类','古装类','古装类','古装类','古装类','古装类','古装类','古装类','古装类','古装类','古装类','古装类','古装类','古装类','古装类','古装类','古装类','古装类','古装类','古装类','古装类','古装类','古装类','古装类','古装类','古装类','古装类','古装类','古装类','古装类','古装类','古装类','古装类','古装类','古装类','古装类']
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
  showTitle: function () {
    this.setData({
      moreTitleShow: !this.data.moreTitleShow
    })
    const animation = wx.createAnimation({
      duration: 200
    })
    this.animation = animation
    if (this.data.moreTitleShow) {
      animation.height('0').step()
    } else {
      animation.height('500rpx').step()
    }
    this.setData({
      animationData: animation.export()
    })
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

  },
  onTabItemTap(item){
    console.log(item)
  }
})