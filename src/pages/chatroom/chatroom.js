let disp = require("../../utils/broadcast");

Page({
	data: {
		username: {
			your: "",
      yourName:''
		},
	},

	// options = 系统传入的 url 参数
	onLoad(options){
		let username = JSON.parse(options.username);
    this.setData({
			title: username.your,
      username: username,
      yourName: username.yourName
		});
    console.log(this.data.yourName)
	},

	onUnload(){
		disp.fire("em.chatroom.leave");
	},

	onPullDownRefresh: function () {
	  	wx.showNavigationBarLoading();
	    this.selectComponent('#chat').getMore()
	    // 停止下拉动作
	    wx.hideNavigationBarLoading();
	    wx.stopPullDownRefresh();
  	},

});
