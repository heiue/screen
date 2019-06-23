let WebIM = require("./utils/WebIM")["default"];
require("sdk/libs/strophe");
let ToastPannel = require("./comps/toast/toast");
let disp = require("utils/broadcast");
let logout = false;
function ack(receiveMsg) {
  // 处理未读消息回执
  var bodyId = receiveMsg.id;         // 需要发送已读回执的消息id
  var ackMsg = new WebIM.message("read", WebIM.conn.getUniqueId());
  ackMsg.set({
    id: bodyId,
    to: receiveMsg.from
  });
  WebIM.conn.send(ackMsg.body);
}

function onMessageError(err) {
  if (err.type === "error") {
    wx.showToast({
      title: err.errorText
    });
    return false;
  }
  return true;
}

function getCurrentRoute() {
  let pages = getCurrentPages();
  let currentPage = pages[pages.length - 1];
  return currentPage.route;
}

function calcUnReadSpot(message) {
  console.log(message,'--------')
  let myName = wx.getStorageSync("myUsername");
  let members = wx.getStorageSync("member") || []; //好友
  var listGroups = wx.getStorageSync('listGroup') || []; //群组
  let allMembers = members.concat(listGroups)
  let count = allMembers.reduce(function (result, curMember, idx) {
    let chatMsgs;
    if (curMember.roomId) {
      chatMsgs = wx.getStorageSync(curMember.roomId + myName.toLowerCase()) || [];
    } else {
      chatMsgs = wx.getStorageSync(curMember.name.toLowerCase() + myName.toLowerCase()) || [];
    }
    return result + chatMsgs.length;
  }, 0);
  getApp().globalData.unReadMessageNum = count;
  disp.fire("em.xmpp.unreadspot", message);
}

//app.js
App({
	
	conn: {
		closed: false,
		curOpenOpt: {},
		open(opt){
			wx.showLoading({
			  	title: '正在初始化客户端...',
			  	mask: true
			})
			this.curOpenOpt = opt;
			WebIM.conn.open(opt);
			this.closed = false;
		},
		reopen(){
			if(this.closed){
				//this.open(this.curOpenOpt);
				WebIM.conn.open(this.curOpenOpt);
				this.closed = false;
			}
		}
	},
	
	// getPage(pageName){
	// 	var pages = getCurrentPages();
	// 	return pages.find(function(page){
	// 		return page.__route__ == pageName;
	// 	});
	// },
	
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
			// 调用 API 从本地缓存中获取数据
			var me = this;
			var logs = wx.getStorageSync("logs") || [];
			logs.unshift(Date.now());
			wx.setStorageSync("logs", logs);

  },
	onShow(){
		
	},
  /**
  * 执行用户登录
  */
  doLogin() {
    // 保存当前页面
    let pages = getCurrentPages();
    if (pages.length) {
      let currentPage = pages[pages.length - 1];
      "pages/login/login" != currentPage.route &&
        wx.setStorageSync("currentPage", currentPage);
    }
    // 跳转授权页面
    wx.navigateTo({
      url: "/pages/login/index"
    });
  },
  /**
 * 当前用户id
 */
  getUserId() {
    return wx.getStorageSync('user_id');
  },
  /**
   * 验证是否存在user_info
   */
  validateUserInfo() {
    let user_info = wx.getStorageSync('user_info');
    return !!wx.getStorageSync('user_info');
  },
  globalData: {
    userInfo: wx.getStorageSync('user_info') || null,
    userInfoSign: wx.getStorageSync('userInfoSign') || null,
    imgUrl: 'http://api.gojbcs.com/images',
    imgurl: 'http://api.gojbcs.com',
    phone: '01056257208',
    is_login_webim:false,
    unread: '',//消息总数
    Config: {
      sdkappid: 1400222815,
      accountType: 1,
      accountMode: 0 
    },
  }
})
