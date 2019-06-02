// pages/my_card/index.js
let app = getApp();
const api = require('../../http.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    otherInfo:[],
    userInfo: JSON.parse(app.globalData.userInfo),
    uid:'',//url中的uid
    cardData:{
      uid: wx.getStorageSync('user_id'),
      cardid:'',
      card:{
        name:'',
        company:'',
        position:'',
        industry_id: "3",
        pic: ""
      },
      info: {
        mobile: "",
        wechat: "",
        email: "",
        address: "",
        intro: ""
      },
      images: {
        0: "url",
        1: "url"
      }
    },//名片内可修改的用户信息
    userIndustry:'',
    userPhone:'',
    userWechat:'',
    userCompany: '',
    usereMail:'',
    userIntro: '',
    isOther: false,
    isChange:false,
    changeText:'',
    showModel:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.uid = Number(options.uid);
    this.getUserInfo();
    if (this.data.cardData.uid == this.data.uid){
      this.setData({
        isOther: false
      })
      return
    }else{
      this.setData({
        isOther: true
      })
    }
    
  },

  getUserInfo() {
    var that = this;
    api.post('/user/getusercard',{
      uid: that.data.uid
    }, function (res) {
      console.log(that.data.isOther)
      // console.log(res)
      if (res.data.data.cardInfo){
        wx.setStorageSync('cardInfo', res.data.data.cardInfo)
        that.data.cardData.cardid = res.data.data.cardInfo.id
        that.setData({
          userIndustry: res.data.data.cardInfo.industry_name,
          userPhone: res.data.data.cardInfo.card_info.mobile,
          userWechat: res.data.data.cardInfo.card_info.wechat,
          userCompany: res.data.data.cardInfo.company,
          usereMail: res.data.data.cardInfo.card_info.email,
          // userIntro: '',
        }) 
      }
      that.setData({
        otherInfo: res.data.data.cardInfo
      })
    })
  },
  changePosition(e){
    if (e.currentTarget.dataset.val == 'industry') {
      this.data.cardData.card.position = e.detail.value
    }
    if (e.currentTarget.dataset.val == 'phone') {
      this.data.cardData.info.mobile = e.detail.value
    }
    if (e.currentTarget.dataset.val == 'wechat') {
      this.data.cardData.info.wechat = e.detail.value
    }
    if (e.currentTarget.dataset.val == 'company') {
      this.data.cardData.card.company = e.detail.value
    }
    if (e.currentTarget.dataset.val == 'email') {
      this.data.cardData.info.email = e.detail.value
    }
    this.setData({
      isChange: true
    })
    this.submitUserInfo()
  },
  
  submitUserInfo(){
    var that = this;
    
    console.log(that.data.cardData)
    var cardData = that.data.cardData
    api.post('/user/updateusercard',{
      cardData 
    },function(res){
      if (res.data.msg == 'Successful editing'){
        that.getUserInfo();
        that.setData({
          changeText:'修改成功',
          showModel:true
        })
        setTimeout(function(){
          that.setData({
            showModel: false,
            isChange: false
          })
        },2000)
      }
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