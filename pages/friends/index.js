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
    friendsClassList:[],
    page:1,
    industry_id:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getFriendsList(this.data.page);
    this.getFriendsClassify();
    console.log(wx.getStorageSync('cardInfo'))
  },
  getFriendsClassify() {
    var that = this;
    api.get('/card/class', function (res) {
      that.setData({
        friendsClassList: res.data.data
      })
      // console.log(that.data.friendsClassList)
    }, false)
  },
  getFriendsList(page,industry_id,flag){
    if (industry_id == undefined){
      industry_id = ''
    }
    var that = this;
    that.setData({
      industry_id: industry_id
    })
    api.get('/card/list?page=' + page + '&limit=10' + '&industry_id=' + industry_id,function(res){
      if(flag){
        that.setData({
          friendsList: that.data.friendsList.concat(res.data.data.data)
        })
      }else{
        that.setData({
          friendsList:res.data.data.data
        })
      }
      console.log(that.data.friendsList)
      
    },true)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
    
  },
  searchFriendsList(e){
    var that = this;
    that.getFriendsList(1, e.currentTarget.dataset.id,false)
    this.showMenu();
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
      animation.left('-100%').step()
    } else {
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
    this.getFriendsList(1, this.data.industry_id)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.getFriendsList(this.data.page++, this.data.industry_id,true)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})