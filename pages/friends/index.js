// pages/friends/index.js

const api = require('../../http.js');
let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: JSON.parse(app.globalData.userInfo),
    cardInfo: wx.getStorageSync('cardInfo'),
    imgUrl: app.globalData.imgUrl,
    friendsIndex:0,
    moreTitleShow: true,
    animationData: {},
		host: app.globalData.host,
    friendsList:[],
    friendsClassList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getFriendsList();
    this.getFriendsClassify();
    console.log(wx.getStorageSync('cardInfo'))
  },
  getFriendsClassify() {
    var that = this;
    api.get('/card/class', function (res) {
      that.setData({
        friendsClassList: res.data.data
      })
      console.log(that.data.friendsClassList)
    }, false)
  },
  getFriendsList(){
    var that = this;
    api.get('/card/list',function(res){
      that.setData({
        friendsList: res.data.data.data
      })
    },true)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
    
  },
  showMenu: function () {
    this.setData({
      moreTitleShow: !this.data.moreTitleShow
    })
    const animation = wx.createAnimation({
      duration: 200
    })
    this.animation = animation
    if (this.data.moreTitleShow) {
      console.log(0)
      animation.left('-100%').step()
    } else {
      console.log(2)
      animation.left('0').step()
    }
    this.setData({
      animationData: animation.export()
    })
  },
	changeFriendsTap:function(e) {
		// console.log(e.currentTarget.dataset.index)
		this.setData({
			friendsIndex: e.currentTarget.dataset.index
		})
	},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (wx.getStorageSync('user_info')){
      this.setData({
        userInfo: JSON.parse(wx.getStorageSync('user_info'))
      })
    }
    
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