
require("sdk/libs/strophe");
let WebIM = require("utils/WebIM")["default"];
let msgStorage = require("comps/chat/msgstorage");
let msgType = require("comps/chat/msgtype");
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
		
		
			// 
			disp.on("em.main.ready", function(){
				calcUnReadSpot();
			});
			disp.on("em.chatroom.leave", function(){
				calcUnReadSpot();
			});
			disp.on("em.chat.session.remove", function(){
				calcUnReadSpot();
			});
			disp.on('em.chat.audio.fileLoaded', function(){
				calcUnReadSpot()
			});
		
			disp.on('em.main.deleteFriend', function(){
				calcUnReadSpot()
			});
			disp.on('em.chat.audio.fileLoaded', function(){
				calcUnReadSpot()
			});
			
		
			// 
			WebIM.conn.listen({
				onOpened(message){
					WebIM.conn.setPresence();
					if(getCurrentRoute() == "pages/login/login" || getCurrentRoute() == "pages/login_token/login_token"){
						me.onLoginSuccess(wx.getStorageSync("myUsername").toLowerCase());
					}
				},
				onReconnect(){
					wx.showToast({
						title: "重连中...",
						duration: 2000
					});
				},
				onClosed(){
					wx.showToast({
						title: "网络已断开连接",
						duration: 2000
					});
					wx.redirectTo({
							url: "../login/login"
						});
					me.conn.closed = true;
					WebIM.conn.close();
				},
				onInviteMessage(message){
					me.globalData.saveGroupInvitedList.push(message);
					disp.fire("em.xmpp.invite.joingroup", message);
					// wx.showModal({
					// 	title: message.from + " 已邀你入群 " + message.roomid,
					// 	success(){
					// 		disp.fire("em.xmpp.invite.joingroup", message);
					// 	},
					// 	error(){
					// 		disp.fire("em.xmpp.invite.joingroup", message);
					// 	}
					// });
				},
				onPresence(message){
					//console.log("onPresence", message);
					switch(message.type){
					case "unsubscribe":
						// pages[0].moveFriend(message);
						break;
					// 好友邀请列表
					case "subscribe":
						if(message.status === "[resp:true]"){
		
						}
						else{
							// pages[0].handleFriendMsg(message);
							for (let i = 0; i < me.globalData.saveFriendList.length; i ++) {
						      	if(me.globalData.saveFriendList[i].from === message.from){
						      		me.globalData.saveFriendList[i] = message
						      		disp.fire("em.xmpp.subscribe");
						      		return;
						 		}
						    }
							me.globalData.saveFriendList.push(message);
							disp.fire("em.xmpp.subscribe");
						}
						break;
					case "subscribed":
						wx.showToast({
							title: "添加成功",
							duration: 1000
						});
						disp.fire("em.xmpp.subscribed");
						break;
					case "unsubscribed":
						// wx.showToast({
						// 	title: "已拒绝",
						// 	duration: 1000
						// });
						break;
					case "memberJoinPublicGroupSuccess":
						wx.showToast({
							title: "已进群",
							duration: 1000
						});
						break;
					// 好友列表
					// case "subscribed":
					// 	let newFriendList = [];
					// 	for(let i = 0; i < me.globalData.saveFriendList.length; i++){
					// 		if(me.globalData.saveFriendList[i].from != message.from){
					// 			newFriendList.push(me.globalData.saveFriendList[i]);
					// 		}
					// 	}
					// 	me.globalData.saveFriendList = newFriendList;
					// 	break;
					// 删除好友
					case "unavailable":
						console.log('delete')
						disp.fire("em.xmpp.contacts.remove");
						break;
		
					// case "joinChatRoomSuccess":
					// 	wx.showToast({
					// 		title: "JoinChatRoomSuccess",
					// 	});
					// 	break;
					// case "memberJoinChatRoomSuccess":
					// 	wx.showToast({
					// 		title: "memberJoinChatRoomSuccess",
					// 	});
					// 	break;
					// case "memberLeaveChatRoomSuccess":
					// 	wx.showToast({
					// 		title: "leaveChatRoomSuccess",
					// 	});
					// 	break;
		
					default:
						break;
					}
				},
		
				onRoster(message){
					// let pages = getCurrentPages();
					// if(pages[0]){
					// 	pages[0].onShow();
					// }
				},
		
				// onVideoMessage(message){
				// 	console.log("onVideoMessage: ", message);
				// 	if(message){
				// 		msgStorage.saveReceiveMsg(message, msgType.VIDEO);
				// 	}
				// },
		
				onAudioMessage(message){
					console.log("onAudioMessage", message);
					if(message){
						if(onMessageError(message)){
							msgStorage.saveReceiveMsg(message, msgType.AUDIO);
						}
						calcUnReadSpot(message);
						ack(message);
					}
				},
				
				onCmdMessage(message){
					console.log("onCmdMessage", message);
					if(message){
						if(onMessageError(message)){
							msgStorage.saveReceiveMsg(message, msgType.CMD);
						}
						calcUnReadSpot(message);
						ack(message);
					}
				},
		
				// onLocationMessage(message){
				// 	console.log("Location message: ", message);
				// 	if(message){
				// 		msgStorage.saveReceiveMsg(message, msgType.LOCATION);
				// 	}
				// },
		
				onTextMessage(message){
					console.log("onTextMessage", message);
					if(message){
						if(onMessageError(message)){
							msgStorage.saveReceiveMsg(message, msgType.TEXT);
						}
						calcUnReadSpot(message);
						ack(message);
					}
				},
		
				onEmojiMessage(message){
					console.log("onEmojiMessage", message);
					if(message){
						if(onMessageError(message)){
							msgStorage.saveReceiveMsg(message, msgType.EMOJI);
						}
						calcUnReadSpot(message);
						ack(message);
					}
				},
		
				onPictureMessage(message){
					console.log("onPictureMessage", message);
					if(message){
						if(onMessageError(message)){
							msgStorage.saveReceiveMsg(message, msgType.IMAGE);
						}
						calcUnReadSpot(message);
						ack(message);
					}
				},
		
				onFileMessage(message){
					console.log('onFileMessage', message);
					if (message) {
						if(onMessageError(message)){
							msgStorage.saveReceiveMsg(message, msgType.FILE);
						}
						calcUnReadSpot(message);
						ack(message);
					}
				},
		
				// 各种异常
				onError(error){
					// 16: server-side close the websocket connection
					if(error.type == WebIM.statusCode.WEBIM_CONNCTION_DISCONNECTED && !logout){
						if(WebIM.conn.autoReconnectNumTotal < WebIM.conn.autoReconnectNumMax){
							return;
						}
						wx.showToast({
							title: "server-side close the websocket connection",
							duration: 1000
						});
						wx.redirectTo({
							url: "../login/login"
						});
						logout = true
						return;
					}
					// 8: offline by multi login
					if(error.type == WebIM.statusCode.WEBIM_CONNCTION_SERVER_ERROR){
						wx.showToast({
							title: "offline by multi login",
							duration: 1000
						});
						wx.redirectTo({
							url: "../login/login"
						});
					}
					if(error.type ==  WebIM.statusCode.WEBIM_CONNCTION_OPEN_ERROR){
						wx.hideLoading()
						disp.fire("em.xmpp.error.passwordErr");
						// wx.showModal({
						// 	title: "用户名或密码错误",
						// 	confirmText: "OK",
						// 	showCancel: false
						// });
					}
					if (error.type == WebIM.statusCode.WEBIM_CONNCTION_AUTH_ERROR) {
						wx.hideLoading()
						disp.fire("em.xmpp.error.tokenErr");
					}
				},
			});
			this.checkIsIPhoneX();
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
    imgUrl: 'http://api.gojbcs.com/images',
    imgurl: 'http://api.gojbcs.com',
    phone: '01056257208',
    isIPX: false, //是否为iphone X
		unReadMessageNum: 0,
		userInfo: null,
		saveFriendList: [],
		saveGroupInvitedList: [],
  },
  conn: {
    closed: false,
    curOpenOpt: {},
    open(opt) {
      wx.showLoading({
        title: '正在初始化客户端...',
        mask: true
      })
      this.curOpenOpt = opt;
      WebIM.conn.open(opt);
      this.closed = false;
    },
    reopen() {
      if (this.closed) {
        //this.open(this.curOpenOpt);
        WebIM.conn.open(this.curOpenOpt);
        this.closed = false;
      }
    }
  },
	checkIsIPhoneX: function() {
	    const me = this
	    wx.getSystemInfo({
	      	success: function (res) {
		        // 根据 model 进行判断
		        if (res.model.search('iPhone X') != -1) {
		          	me.globalData.isIPX = true
		        }
	      	}
	    })
	},
})
