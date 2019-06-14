// pages/recruit/index.js
var WxParse = require('../../wxParse/wxParse.js');
let app = getApp()
const api = require('../../http.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    page:1,
    limit:"7",
    intro:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  getList(page){
    var that = this;
    api.get('/task/recruitment/list?page='+page+'&limit='+that.data.limit,function(res){
      that.setData({
        list: that.data.list.concat(res.data.data)
      })
      var _data = res.data.data;
      var _len = _data.length;
      for (var i = 0; i < _len; i++) {
        WxParse.wxParse('comment' + i, 'html', _data[i].introduction, that);
        if (i === _len - 1) {
          WxParse.wxParseTemArray("askItemsArr", 'comment', _data.length, that)
         
        }
      }
      
    },false)
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
    this.getList(this.data.page);
  },
  goDetails(e) {
    console.log(e.currentTarget.dataset.id)
    wx.navigateTo({
      url: '/pages/recruit_details/index?rid='+e.currentTarget.dataset.id+'&uid='+wx.getStorageSync('user_id')
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
    this.getList(this.data.page++);
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})