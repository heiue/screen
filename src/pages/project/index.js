// pages/project/index.js
let app = getApp();
const api = require('../../http.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl: app.globalData.imgUrl,
    imgUrlUp:'http://api.gojbcs.com',
    nav: [],
    navActive: 0,
    project: [],
    moreTitleShow: true,
    animationData: {},
    moreTitle: [],
    currentIndex:0,
    currentIndexType2:0,
    page:1,
    type:'',
    isNone: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  },
  getProjectList(type,type2,page) {
    if (type == undefined){
      type = ''
    }
    if (type2 == undefined) {
      type2 = ''
    }
    var that = this;
    api.get('/project/list?type=' + type+'&type2='+type2+'&page='+page,function(res){
      that.setData({
        project: that.data.project.concat(res.data.data)
      })
      if (that.data.project.length < 1) {
        that.setData({
          isNone: true
        })
      }else{
        that.setData({
          isNone: false
        })
      }
    },false)
  },
  getClassifyList() {
    var that = this;
    api.get('/project/class',function(res){
      // console.log(res)
      that.setData({
        nav: res.data.data
      })
    },false)
  },
  goDetail: function (e) {
    wx.navigateTo({
      url: '/pages/project_detail/index?projectId='+e.currentTarget.dataset.id
    })
  },

  getSelectList(e) {
    var that = this;
    that.setData({
      currentIndex: e.currentTarget.dataset.index,
      project:[],
      page: 1
    })
    that.getProjectList(this.data.currentIndex, this.data.currentIndexType2,this.data.page)
  },
  getSelectListType2(e){
    var that = this;
    that.setData({
      currentIndexType2: e.currentTarget.dataset.id,
      page:1,
      project: []
    })
    that.showTitle();
    that.getProjectList(this.data.currentIndex, this.data.currentIndexType2, this.data.page)
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
    this.getProjectList('','', this.data.page);
    this.getClassifyList();
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
    this.getProjectList(this.data.currentIndex, this.data.currentIndexType2, this.data.page+=1)
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