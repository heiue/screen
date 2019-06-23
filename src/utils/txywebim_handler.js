
var webim = require('twebim.js');
var util = require('tutil.js');
const app = getApp()

var that
    ,loginInfo
    ,accountMode
    ,accountType
    , sdkAppID 
    , agent_member_id
    ,id
    ,name
    , icon
    ,selType
    ,selSess
    ,msg
    ,contactList
    ;
var myAvatar = '';//自己的头像
var friendAvatar = '';//对方的头像
var unread = [];//未读消息计数
var currentMsgsArray = [];//当前历史记录
var historyMsgsArray = [];//临时存放拉取的历史记录,与第一次历史记录进行合并
// 初始化信息
function init(opts) {
    that = opts.that;
    accountMode = opts.accountMode;//只支持独立模式
    accountType = opts.accountType;
    sdkAppID = opts.sdkAppID;
    selType = opts.selType;//会话类型，只支持私聊
    agent_member_id = opts.agent_member_id
    id = opts.id;//私聊,对方账号
    name = opts.name;//私聊,对方昵称
    icon = opts.icon;//对方头像url
}

//监听新消息(私聊(包括普通消息、全员推送消息)，普通群(非直播聊天室)消息)事件
//newMsgList 为新消息数组，结构为[Msg]
function onMsgNotify(newMsgList) {
    var newMsg;
    //获取所有聊天会话
 
    for (var j in newMsgList) {//遍历新消息
        newMsg = newMsgList[j];
        
        if (newMsg.getSession().id() == id) {//为当前聊天对象的消息
            selSess = newMsg.getSession();
            handlderMsg(newMsg, false);
            currentMsgsArray = currentMsgsArray.map((item, index) => {
              if (!item.isSelfSend) {
                item.avatar = myAvatar
              } else {
                item.avatar = friendAvatar
              }
              return item;
            })
            var myMessages = that.setDatas(currentMsgsArray);
            that.setData({
              myMessages: myMessages,

            })
            setTimeout(function () {
              if (that.data.is_chat){
                that.pageScrollToBottom()
              }
            }, 100)
          
        }
    }
    // 更新未读数
    getUnread()
    
}

//更新消息未读数
function getUnread(){
  var sess= {};
  var unread = 0 ;
  var sessMap = webim.MsgStore.sessMap();
  if (that.data.contactList) {
    // 更新消息的未读数
    for (var i in sessMap) {
      sess = sessMap[i];
      var contactList = that.data.contactList.map((item, index) => {
        if (item.To_Account == sess.id()) {
          item.UnreadMsgCount = sess.unread()
        }
        return item;
      })
      that.setData({
        contactList: contactList
      })
      //统计未读消息数量显示在底部栏
      unread = that.data.contactList.reduce(function(prev,cur){
        return cur.UnreadMsgCount + prev
      },0)
        // 获取最新的会话消息
        webim.getRecentContactList({
          'Count': 10 //最近的会话数 ,最大为 100
        }, function (resp) {
          var MsgShow = resp.SessionItem.filter((item, index) => {
            if (item.To_Account == sess.id()) return item;
          })
         
          var contactList = that.data.contactList.map((item, index) => {
            if (item.To_Account == sess.id()) {
              // 获取最新消息
              if (MsgShow[0].MsgShow == '[其他]'){
                MsgShow[0].MsgShow = '[房源信息]'
              }
              item.MsgShow = MsgShow[0].MsgShow
              
            }
            return item;
          })
          
          that.setData({
            contactList: contactList
          })

        })

      }
  }
  //设置消息未读数量总数
  unread = JSON.stringify(unread)
  wx.setStorageSync('unread', unread)
  app.globalData.unread = unread
  if (unread != '0') {
    wx.setTabBarBadge({
      index: 1,
      text:unread
    })
  } else {
    wx.removeTabBarBadge({
      index: 1
    })
  }
}
//处理消息（私聊(包括普通消息和全员推送消息)，普通群(非直播聊天室)消息）
function handlderMsg(msg,prepend) {
  console.log('解析消息')

    var fromAccount, fromAccountNick, sessType, subType, contentHtml;

    fromAccount = msg.getFromAccount();
    if (!fromAccount) {
        fromAccount = '';
    }
    fromAccountNick = msg.getFromAccountNick();
    if (!fromAccountNick) {
        fromAccountNick = fromAccount;
    }
    //解析消息
    sessType = msg.getSession().type();
    //获取消息子类型
    subType = msg.getSubType();
    switch (sessType) {
        case webim.SESSION_TYPE.C2C://私聊消息
            switch (subType) {
                case webim.C2C_MSG_SUB_TYPE.COMMON://c2c普通消息
                    // 解析消息
                  
                    convertMsg(msg, prepend);
                    var opts = {
                        'To_Account': fromAccount,//好友帐号
                        'LastedMsgTime': msg.getTime()//消息时间戳
                    };
                    webim.c2CMsgReaded(opts);
                    break;
            }
            break;
       
    }

}
// 解析消息（普通文本消息，自定义消息）
function convertMsg(msg, prepend) {
    var that = this;
    var elems, elem, type, content, isSelfSend, ifromAccount;
    elems = msg.getElems();
    isSelfSend = msg.getIsSend(); //消息是否为自己发的 true是自己发送，
    ifromAccount = msg.fromAccount
    for (var i in elems) {
        var currentMsg = {}; 
        elem = elems[i];
        type = elem.getType();
        content = elem.getContent();
        switch (type) {
            case webim.MSG_ELEMENT_TYPE.TEXT://文本消息
                var msgContent = convertTextMsgToHtml(content);
                var msgTime = msg.getTime();//得到当前消息发送的时间
                //解析时间
              convertTime(msgTime, function (data) {
              currentMsg.id = ifromAccount;//房源标题                
              currentMsg.msgContent = msgContent;//当前消息的内容
              currentMsg.img = '';
              currentMsg.msgTime = data;
              currentMsg.name = ''
              currentMsg.price = '';
              currentMsg.isSelfSend = isSelfSend;
              currentMsg.ifromAccount = ifromAccount;
              currentMsg.type = '';
                if (prepend){
                  historyMsgsArray.push(currentMsg)
                  
                }else{
                  currentMsgsArray.push(currentMsg);
                }
              
            })

            break;
           
        }


    }

}

function convertTime(msgTime,callback){
  //得到当天凌晨的时间戳
  var timeStamp = new Date(new Date().setHours(0, 0, 0, 0)) / 1000;
  var thisdate;
  var d = new Date(msgTime * 1000); //根据时间戳生成的时间对象
  var min = d.getMinutes();
  var hour = d.getHours();
  //得到时和分，分小于10时，只返回一位数
  if (min < 10) {
    min = "0" + min;
  }
  //得到月份和天  月份一般是从0开始，所以展示出来要+1
  var month = d.getMonth();
  var day = d.getDate();
  //得到时间   当天时间应该只显示时分  当天以前显示日期+时间
  if (timeStamp > msgTime) {
    thisdate = ((month + 1) + '-' + day + ' ' + hour + ":" + min);
  } else {
    thisdate = (hour + ":" + min);
  }
  callback(thisdate)
}

//解析文本消息元素
function convertTextMsgToHtml(content) {
    return content.getText();
}


//发送消息(普通消息)
function onSendMsg(msg) {

    //获取消息内容
    var msgtosend = msg;
    var msgLen = webim.Tool.getStrBytes(msg);
    // 创建会话对象
    if (!selSess) {
      selSess = new webim.Session(selType, id, name, icon, Math.round(new Date().getTime() / 1000));
    }
    var isSend = true;//是否为自己发送
    var seq = -1;//消息序列，-1表示sdk自动生成，用于去重
    var random = Math.round(Math.random() * 4294967296);//消息随机数，用于去重
    var msgTime = Math.round(new Date().getTime() / 1000);//消息时间戳
    var subType = webim.C2C_MSG_SUB_TYPE.COMMON;//消息子类型c2c消息时，参考c2c消息子类型对象：webim.C2C_MSG_SUB_TYPE 
    //loginInfo.identifier消息发送者账号,loginInfo.identifierNick消息发送者昵称
  var msg = new webim.Msg(selSess, isSend, seq, random, msgTime, id, subType, name );
    //解析文本和表情
    var expr = /\[[^[\]]{1,3}\]/mg;
    var emotions = msgtosend.match(expr);
    if (!emotions || emotions.length < 1) {
        var text_obj = new webim.Msg.Elem.Text(msgtosend);
        msg.addText(text_obj);
    } else {//有表情
    
    }    
    webim.sendMsg(msg, function (resp) {
      console.log(resp,'发送消息')
        if (selType == webim.SESSION_TYPE.C2C) {//私聊时，在聊天窗口手动添加一条发的消息
          handlderMsg(msg,false);
          // 设置双方头像
          getMyAvatar(id, app.globalData.userInfoSign.identifier, function () {
            that.clearInput();
            var myMessages = that.setDatas(currentMsgsArray);
            that.setData({
              myMessages: myMessages,
            })
          });
          setTimeout(function () {
            that.pageScrollToBottom()
          }, 100)
          webim.Log.info("发消息成功");
        }
    }, function (err) {
      console.log(err,'err')
        webim.Log.error("发消息失败:" + err.ErrorInfo);
    });
}

// 登录
function sdkLogin(that, app, selToID, callback, errcallback) {
    if (!callback){
        callback = () => {

        }
    }
  if (!errcallback) {
    errcallback = () => {

    }
  }
    this.init({
        accountMode: app.globalData.Config.accountMode
        , accountType: app.globalData.Config.accountType
        , sdkAppID: app.globalData.Config.sdkappid
        , selType: webim.SESSION_TYPE.C2C//私聊
      , agent_member_id: app.globalData.userInfoSign.identifier
        , id: selToID 
      , name: app.globalData.userInfoSign.identifier
      , icon: app.globalData.userInfoSign.pic,
        that:that
    });
    
    //当前用户身份
    var loginInfo = {
        'sdkAppID':app.globalData.Config.sdkappid, //用户所属应用id,必填
        'appIDAt3rd':app.globalData.Config.sdkappid, //用户所属应用id，必填
        'accountType':app.globalData.Config.accountType, //用户所属应用帐号类型，必填
      'identifier': app.globalData.userInfoSign.identifier, //当前用户ID,必须是否字符串类型，选填
      'identifierNick': app.globalData.userInfoSign.name, //当前用户昵称，选填
      'userSig': app.globalData.userInfoSign.usersig, //当前用户身份凭证，必须是字符串类型，选填
    };
    //1v1单聊的话，一般只需要 'onConnNotify' 和 'onMsgNotify'就行了。
    //监听连接状态回调变化事件
    var onConnNotify = function (resp) {
        switch (resp.ErrorCode) {
            case webim.CONNECTION_STATUS.ON:
                webim.Log.warn('连接状态正常...');
                break;
            case webim.CONNECTION_STATUS.OFF:
                webim.Log.warn('连接已断开，无法收到新消息，请检查下你的网络是否正常');
                break;
            default:
                webim.Log.error('未知连接状态,status=' + resp.ErrorCode);
                break;
        }
    };


    //监听事件
    var listeners = {
        "onConnNotify": onConnNotify//监听连接状态回调变化事件,必填
        , "onMsgNotify": onMsgNotify//监听新消息事件

    };

    //其他对象，选填
    var options = {
        'isAccessFormalEnv': true,//是否访问正式环境，默认访问正式，选填
        'isLogOn': true//是否开启控制台打印日志,默认开启，选填
    };

    //sdk登录(独立模式)
    webim.login(loginInfo, listeners, options, function (resp) {
      app.globalData.is_login_webim = true;
      wx.setStorageSync('is_login_webim', true)
      console.log(resp, '登录成功')
      callback()
    }, function (err) {
      console.log(err,'我登录失败')
      app.globalData.is_login_webim = false;
      wx.setStorageSync('is_login_webim', false)
      errcallback()
    });
}


//获取最新的 C2C 历史消息,用于切换好友聊天，重新拉取好友的聊天消息
function getC2CHistoryMsgs() {
  currentMsgsArray = [];
    if (selType == webim.SESSION_TYPE.GROUP) {
        alert('当前的聊天类型为群聊天，不能进行拉取好友历史消息操作');
        return;
    }
    
    if (selType == webim.SESSION_TYPE.GROUP) {
      alert('当前的聊天类型为群聊天，不能进行拉取好友历史消息操作');
      return;
    }
    var lastMsgTime = 0; //第一次拉取好友历史消息时，必须传0
    var msgKey = wx.getStorageSync('msgKey') || '';
    var reqMsgCount = 5 ;
    var options = {
      'Peer_Account': id, //好友帐号
      'MaxCnt': reqMsgCount, //拉取消息条数
      'LastMsgTime': lastMsgTime, //最近的消息时间，即从这个时间点向前拉取历史消息
      'MsgKey': msgKey
    };
    selSess = null;
    webim.MsgStore.delSessByTypeId(selType, id);
    webim.getC2CHistoryMsgs(
        options,
        function (resp) {
            var complete = resp.Complete; //是否还有历史消息可以拉取，1-表示没有，0-表示有
            if (resp.MsgList.length == 0) {
                return
            }
            //拉取消息后，要将下一次拉取信息所需要的东西给存在缓存中
            wx.setStorageSync('lastMsgTime', resp.LastMsgTime);
            wx.setStorageSync('msgKey', resp.MsgKey);
            var msgList = resp.MsgList;
            for (var j in msgList) { //遍历新消息
                var msg = msgList[j];
                if (msg.getSession().id() == id) { //为当前聊天对象的消息
                    selSess = msg.getSession();
                    handlderMsg(msg,false)                    
                }
            }
            // 设置双方头像
            getMyAvatar(id, agent_member_id,function(){
              var myMessages = that.setDatas(currentMsgsArray)
              that.setData({
                myMessages: myMessages,
                complete: complete
              })              
              setTimeout(function(){
                that.pageScrollToBottom()
              },100)
            }); 
          // that.setData({
          //   myMessages: currentMsgsArray,
          //   complete: complete
          // }) 
         
        },
    )
}
//向上翻页，获取更早的好友历史消息(callOk,成功回调),(callNoData,没有历史记录回调)
function getPrePageC2CHistoryMsgs() {

    //获取下一次拉取的c2c消息时间和消息Key
    var lastMsgTime = wx.getStorageSync('lastMsgTime')
    var msgKey = wx.getStorageSync('msgKey');
    var reqMsgCount = 5;
    var options = {
        'Peer_Account': id, //好友帐号
        'MaxCnt': reqMsgCount, //拉取消息条数
        'LastMsgTime': lastMsgTime, //最近的消息时间，即从这个时间点向前拉取历史消息
        'MsgKey': msgKey
    };
    webim.getC2CHistoryMsgs(
        options,
        function (resp) {
          var complete = resp.Complete; //是否还有历史消息可以拉取，1-表示没有，0-表示有
          if (resp.MsgList.length == 0) {
            //获取七天之前的聊天历史记录
            that.getc2cmsg()
              return;
          }
         
          wx.setStorageSync('lastMsgTime', resp.LastMsgTime);
          wx.setStorageSync('msgKey', resp.MsgKey);
          // 下拉历史记录回调
          getHistoryMsgCallback(resp.MsgList, true, function (data) {
              var myMessages = that.setDatas(data)
              myMessages = myMessages.map((item, index) => {

                if (item.isSelfSend) {
                  item.avatar = friendAvatar
                }else{
                  item.avatar = myAvatar
                }
                return item;
              })
              wx.hideLoading();
              that.setData({
                myMessages: myMessages
              })
            console.log(myMessages)
              
          });
        }
    );
};
// 更早历史消息的回调
function getHistoryMsgCallback(msgList, prepage,callback) {
  historyMsgsArray= [];
  var msg;
  prepage = prepage || false;

  //如果是加载前几页的消息，消息体需要prepend，所以先倒排一下
  for (var j in msgList) { //遍历新消息
    msg = msgList[j];
    if (msg.getSession().id() == id) { //为当前聊天对象的消息
      selSess = msg.getSession();
      handlderMsg(msg, prepage);
      
    }
  }
  currentMsgsArray = historyMsgsArray.concat(currentMsgsArray)
  callback(currentMsgsArray)
  //消息已读上报，并将当前会话的消息设置成自动已读
  webim.setAutoRead(selSess, true, true);
}
// 获取双方头像
function getMyAvatar(id, agent_member_id,callback) {

    var tag_list = ['Tag_Profile_IM_Nick', 'Tag_Profile_IM_Image']
    var account = [id, agent_member_id];
  console.log(id, agent_member_id, 'agent_member_id', account)

    var options = {
      From_Account: account,
        To_Account: account,
        LastStandardSequence: 0,
        TagList: tag_list,
    };
    webim.getProfilePortrait(
        options,
        function (res) {
          console.log(res)
          if (res.UserProfileItem){
            myAvatar = res.UserProfileItem[0].ProfileItem ? res.UserProfileItem[0].ProfileItem[1].Value : ''
            console.log(res.UserProfileItem,'res.UserProfileItem')
            friendAvatar = res.UserProfileItem[1].ProfileItem ? res.UserProfileItem[1].ProfileItem[1].Value : app.globalData.userInfoSign.pic
            currentMsgsArray = currentMsgsArray.map((item, index) => {

                if (!item.isSelfSend) {
                    item.avatar = myAvatar
                } else{
                  item.avatar = friendAvatar
                }
                return item;
            })
          }
          callback(currentMsgsArray)
        },
      function (err) {
        console.log(err.ErrorInfo);
      }
    )
}

// 数组去重
function dedupe(array) {
    return Array.from(new Set(array));
}

module.exports = {
    init : init,
    sdkLogin: sdkLogin,
    onMsgNotify : onMsgNotify,
    handlderMsg : handlderMsg,
    convertTextMsgToHtml : convertTextMsgToHtml,
    onSendMsg : onSendMsg,
    getC2CHistoryMsgs : getC2CHistoryMsgs,
    convertMsg : convertMsg,
    currentMsgsArray: currentMsgsArray,
    getUnread:getUnread,
    getPrePageC2CHistoryMsgs: getPrePageC2CHistoryMsgs
    
};