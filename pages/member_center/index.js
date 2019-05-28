// pages/member_center/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    popupShow: false,
    cardActive: 0,
    cardList: [1, 1, 1, 1],
    animationData: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  closePopup() {
    const animation = wx.createAnimation({
      duration: 200
    })
    this.animation = animation
    animation.bottom('-1000rpx').step()
    this.setData({
      animationData: animation.export(),
    })
    let that = this
    setTimeout(() => {
      that.setData({
        popupShow: false
      })
    },200)
    
  },
  showPopup() {
    this.setData({
      popupShow: true
    })
    const animation = wx.createAnimation({
      duration: 1000
    })
    this.animation = animation
    animation.bottom('0').step()
    this.setData({
      animationData: animation.export()
    })
  },
  cardChage(e) {
    this.setData({
      cardActive: e.currentTarget.dataset.index
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