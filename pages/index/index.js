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
      'https://images.unsplash.com/photo-1551334787-21e6bd3ab135?w=640',
      'https://images.unsplash.com/photo-1551214012-84f95e060dee?w=640',
      'https://images.unsplash.com/photo-1551446591-142875a901a1?w=640'
    ],
    autoplay: false,
    interval: 5000,
    duration: 1000,
    toView: 'yellow',
    scrollLeft: 0,
    //滚动的数组
    scrolls: [
      {
        name: '黄色',
        tag: 'yellow',
      },
      {
        name: '绿色',
        tag: 'green',
      },
      {
        name: '红色',
        tag: 'red',
      },
      {
        name: '黄色',
        tag: 'yellow',
      },
      {
        name: '绿色',
        tag: 'green',
      },
      {
        name: '红色',
        tag: 'red',
      },
    ],
    list:[{
      img:"http://api.gojbcs.com/images/header.jpg",
      name:"施瓦辛格",
      masterpiece:"《hollo》"
    },{
        img: "http://api.gojbcs.com/images/header.jpg",
        name: "施瓦辛格",
        masterpiece: "《hi》"
      }, {
        img: "http://api.gojbcs.com/images/header.jpg",
        name: "施瓦辛格",
        masterpiece: "《nice》"
      }],
      swiperHeight:380,
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    var that = this;
    this.setSwiperHeight();
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
    api.get('/screenwriter/list',function(res) {
      // console.log(res)
      that.setData({
        list:res.data.data
      })
    }, true)
  },
  // getUserInfo: function(e) {
  //   this.setData({
  //     userInfo: e.detail.userInfo,
  //     hasUserInfo: true
  //   })
  // },
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
  setSwiperHeight:function() {
    var that = this;
    // console.log(this.data.list.length)
    wx.createSelectorQuery().selectAll('.fall-item').boundingClientRect(function (rect) {
      // console.log(rect[0].height)
      var h = rect[0].height
    }).exec()
    wx.createSelectorQuery().selectAll('.index-swiper-tab').boundingClientRect(function (rect) {
      // console.log(rect[0].height)
      that.setData({
        swiperHeight: rect[0].height + Math.ceil(that.data.list.length / 2) * 200
      })
    }).exec()
    
  },
	goDetail:function() {
		wx.navigateTo({
		  url: '/pages/other_card/index'
		})
	},
	goRecruit:function() {
		wx.navigateTo({
		  url: '/pages/recruit/index'
		})
	}
})
