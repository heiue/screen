// pages/my_card/index.js
let app = getApp();
const api = require('../../http.js');
const firlHost = 'https://api.gojbcs.com';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl: app.globalData.imgUrl,
    otherInfo:[],
    userInfo: [],
    uid:'',//url中的uid
    cardData:{
      uid: wx.getStorageSync('user_id'),
      cardid:'',
      card:{
        name:'',
        company:'',
        position:'',
        industry_id: "",
        pic: "",
        companyProfile: ''
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
    userIndustry:'请选择行业',
    userPhone:'',
    userWechat:'',
    userCompany: '',
    companyProfile:'',
    usereMail:'',
    userIntro: '',
    isOther: false,
    isChange:false,
    changeText:'',
    showModel:false,
    instryList:[],
    isSelect:false,
    images:'',//相册
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
      that.setData({
        userInfo: JSON.parse(wx.getStorageSync('user_info'))
      })
      console.log(that.data.isOther)
      // console.log(res)
      if (res.data.data.cardInfo){
        wx.setStorageSync('cardInfo', res.data.data.cardInfo)
        that.data.cardData.cardid = res.data.data.cardInfo.id
        that.setData({
          userIndustry: res.data.data.cardInfo.industry_name,
          userPhone: res.data.data.cardInfo.card_info.mobile,
          userWechat: res.data.data.cardInfo.card_info.wechat,
          companyProfile: res.data.data.cardInfo.companyProfile,
          userCompany: res.data.data.cardInfo.company,
          usereMail: res.data.data.cardInfo.card_info.email,
          userIntro: res.data.data.cardInfo.card_info.intro,
        }) 
        that.data.cardData.card.company = res.data.data.cardInfo.company
        that.data.cardData.card.companyProfile = res.data.data.cardInfo.companyProfile,
        that.data.cardData.card.position = res.data.data.cardInfo.position,
          that.data.cardData.card.industry_id = res.data.data.industry_id,
          that.data.cardData.info.mobile = res.data.data.cardInfo.card_info.mobile, 
          that.data.cardData.info.wechat = res.data.data.cardInfo.card_info.wechat,
          that.data.cardData.info.email = res.data.data.cardInfo.card_info.email,
          that.data.cardData.info.intro = res.data.data.cardInfo.card_info.intro
        console.log(that.data.cardData)
      }
      that.setData({
        otherInfo: res.data.data.cardInfo
      })
    })
  },
  changePosition(e){
    // if (e.currentTarget.dataset.val == 'industry') {
    //   this.data.cardData.card.position = e.detail.value
    // }
    if (e.currentTarget.dataset.val == 'phone') {
      this.data.cardData.info.mobile = e.detail.value
    }
    if (e.currentTarget.dataset.val == 'wechat') {
      this.data.cardData.info.wechat = e.detail.value
    }
    if (e.currentTarget.dataset.val == 'company') {
      this.data.cardData.card.company = e.detail.value
    }
    if (e.currentTarget.dataset.val == 'companyProfile') {
      this.data.cardData.card.companyProfile = e.detail.value
    }
    if (e.currentTarget.dataset.val == 'email') {
      this.data.cardData.info.email = e.detail.value
    }
    if (e.currentTarget.dataset.val == 'intro') {
      this.data.cardData.info.intro = e.detail.value
    }
    this.setData({
      isChange: true
    })
    // this.submitUserInfo()
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
  getInstryList() {
    var that = this;
    api.get('/card/class',function(res){
      that.setData({
        instryList: res.data.data,
        isSelect: true
      })
    },true)
  },
  selectIndtry(e){
    // console.log(e)
    var that = this;
    that.setData({
      isSelect: false
    })
    this.data.cardData.card.industry_id = e.currentTarget.dataset.id;
    that.setData({
      userIndustry: e.currentTarget.dataset.name
    })
  },
  closeSlect(){
    var that = this;
    that.setData({
      isSelect: false
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  upImg(){
    var that = this;
    wx.chooseImage({
      success(res) {
        const tempFilePaths = res.tempFilePaths
        wx.uploadFile({
          url: firlHost +'/uploadImg', //仅为示例，非真实的接口地址
          filePath: tempFilePaths[0],
          name: 'file',
          success(res) {
            const data = res.data
            //do something
          }
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (wx.getStorageSync('user_info')) {
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