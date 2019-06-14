//index.js
const api = require('../../http.js');
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    currentTab: 0,//当前选中编剧或剧本
    imgUrls: [
      '/material/index/index_banner/700X400/1.jpg',
      '/material/index/index_banner/700X400/2.jpg',
      '/material/index/index_banner/700X400/3.jpg',
      '/material/index/index_banner/700X400/4.jpg',
      '/material/index/index_banner/700X400/12.jpg',
      '/material/index/index_banner/700X400/13.jpg'
    ],
    autoplay: false,
    interval: 5000,
    duration: 1000,
    toView: 'yellow',
    scrollLeft: 0,
    watchingList: [],
    list:[],//推荐编剧
    swiperHeight:380,
    signList:[],//签约编剧
    page:1,
		imgUrl:app.globalData.imgUrl
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    var that = this;
    this.getWriterList(that.data.page);
    this.getsignList();
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
    
  },
  onShow:function() {
    this.getWatchingList()
  },
  getWriterList: function (page) {
    var that = this;
    if(that.data.currentTab == 0){
      api.get('/screenwriter/list?position=0&limit=10&page='+page, function (res) {
        // console.log(res.data)
        that.setData({
          list: res.data.data.concat(that.data.list)
        })
      }, false)
    }else{
      api.get('/script/list?limit=10&page='+page, function (res) {
        // console.log(res.data)
        that.setData({
          list: res.data.data.concat(that.data.list)
        })
      }, false)
    }
    
  },
  getsignList: function () {
    var that = this;
    if (that.data.currentTab == 0){
      api.get('/screenwriter/list?position=1&limit=4', function (res) {
        // console.log(res.data)
        that.setData({
          signList: res.data.data
        })
      }, false)
    }
    
  },
  getWatchingList() {
    let _this = this
    api.get(`/article/list?page=1&limit=6`,(res) => {
      _this.setData({
        watchingList: res.data.data
      })
    }, false)
  },
  //滑动切换
  swiperTab: function (e) {
    console.log(e.detail.current)
    var that = this;
    that.setData({
      currentTab: e.detail.current
    });
  },
  //点击切换
  clickTab: function (e) {
    var that = this;
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current
      })
      that.getWriterList();
    }
  },
  //轮播
  changeIndicatorDots(e) {
    this.setData({
      indicatorDots: !this.data.indicatorDots
    })
  },
  changeAutoplay(e) {
    this.setData({
      autoplay: !this.data.autoplay
    })
  },
  intervalChange(e) {
    this.setData({
      interval: e.detail.value
    })
  },
  durationChange(e) {
    this.setData({
      duration: e.detail.value
    })
  },
  
	goDetail:function(e) {
    var that = this;
    if(that.data.currentTab == 0){
      wx.navigateTo({
        url: '/pages/other_card/index?name=' + e.currentTarget.dataset.name + '&id=' + e.currentTarget.dataset.id
      })
    }else{
      wx.navigateTo({
        url: '/pages/script_detail/index?sid=' + e.currentTarget.dataset.id
      })
    }
		
	},
	goRecruit:function() {
		wx.navigateTo({
		  url: '/pages/recruit/index'
		})
	},
  onReachBottom: function () {
    console.log(11111)
    console.log(this.data.currentTab)
    this.getWriterList(this.data.page++)
  },
})
