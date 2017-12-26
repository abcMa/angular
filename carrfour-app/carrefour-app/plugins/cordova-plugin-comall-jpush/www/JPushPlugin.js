

var JPushPlugin = function(){
};

//private plugin function

JPushPlugin.prototype.receiveMessage = {}
JPushPlugin.prototype.openNotification = {}
JPushPlugin.prototype.receiveNotification = {}


JPushPlugin.prototype.isPlatformIOS = function() {
	var isPlatformIOS = device.platform == "iPhone"
		|| device.platform == "iPad"
		|| device.platform == "iPod touch"
		|| device.platform == "iOS";
	return isPlatformIOS;
}

JPushPlugin.prototype.error_callback = function(msg) {
	console.log("Javascript Callback Error: " + msg);
}

JPushPlugin.prototype.call_native = function(name, args, callback) {
	ret = cordova.exec(callback, this.error_callback, 'JPushPlugin', name, args);
	return ret;
}

JPushPlugin.prototype.init = function () {
  if (this.isPlatformIOS()) {
    this.call_native('initial', [], null)
  } else {
    this.call_native('init', [], null)
  }
}

JPushPlugin.prototype.getRegistrationID = function (callback) {
  this.call_native('getRegistrationID', [], callback)
}

JPushPlugin.prototype.stopPush = function () {
  this.call_native('stopPush', [], null)
}

JPushPlugin.prototype.resumePush = function () {
  this.call_native('resumePush', [], null)
}

JPushPlugin.prototype.isPushStopped = function (callback) {
  this.call_native('isPushStopped', [], callback)
}
//新加入的函数
JPushPlugin.prototype.startJPushSDK = function () {    
  this.call_native('startJPushSDK', [] , null)
}
//新加入的函数
// 判断系统设置中是否对本应用启用通知。
// iOS: 返回值如果大于 0，代表通知开启；0: 通知关闭。
//		UIRemoteNotificationTypeNone    = 0,
//    	UIRemoteNotificationTypeBadge   = 1 << 0,
//    	UIRemoteNotificationTypeSound   = 1 << 1,
//    	UIRemoteNotificationTypeAlert   = 1 << 2,
//    	UIRemoteNotificationTypeNewsstandContentAvailability = 1 << 3,
// Android: 返回值 1 代表通知启用、0: 通知关闭。
JPushPlugin.prototype.getUserNotificationSettings = function (callback) {
  if (this.isPlatformIOS()) {
    this.call_native('getUserNotificationSettings', [], callback)
  } else if (device.platform == 'Android') {
    this.call_native('areNotificationEnabled', [], callback)
  }
}

JPushPlugin.prototype.addDismissActions = function (actions, categoryId) {
  this.call_native('addDismissActions', [actions, categoryId])
}

JPushPlugin.prototype.addNotificationActions = function (actions, categoryId) {
  this.call_native('addNotificationActions', [actions, categoryId])
}
// 删除了
// JPushPlugin.prototype.receiveMessageIniOSCallback = function(data) {
// 	try {
// 		console.log("JPushPlugin:receiveMessageIniOSCallback--data:" + data);
// 		var bToObj = JSON.parse(data);
// 		var content = bToObj.content;
//     	console.log(content);
// 	} catch(exception) {
// 		console.log("JPushPlugin:receiveMessageIniOSCallback" + exception);
// 	}
// }

JPushPlugin.prototype.setTagsWithAlias = function (tags, alias) {
  if (tags == null) {
    this.setAlias(alias)
    return
  }
  if (alias == null) {
    this.setTags(tags)
    return
  }
  var arrayTagWithAlias = [tags]
  arrayTagWithAlias.unshift(alias)
  this.call_native('setTagsWithAlias', arrayTagWithAlias, null)
}

JPushPlugin.prototype.setTags = function (tags) {
  this.call_native('setTags', tags, null)
}

JPushPlugin.prototype.setAlias = function (alias) {
  this.call_native('setAlias', [alias], null)
}

// iOS methods

JPushPlugin.prototype.setBadge = function (value) {
  if (this.isPlatformIOS()) {
    this.call_native('setBadge', [value], null)
  }
}

JPushPlugin.prototype.resetBadge = function () {
  if (this.isPlatformIOS()) {
    this.call_native('resetBadge', [], null)
  }
}

JPushPlugin.prototype.setDebugModeFromIos = function () {
  if (this.isPlatformIOS()) {
    this.call_native('setDebugModeFromIos', [], null)
  }
}

JPushPlugin.prototype.setLogOFF = function () {
  if (this.isPlatformIOS()) {
    this.call_native('setLogOFF', [], null)
  }
}

JPushPlugin.prototype.setCrashLogON = function () {
  if (this.isPlatformIOS()) {
    this.call_native('crashLogON', [], null)
  }
}

JPushPlugin.prototype.addLocalNotificationForIOS = function (delayTime, content,
  badge, notificationID, extras) {
  if (this.isPlatformIOS()) {
    this.call_native('setLocalNotification', [delayTime, content, badge, notificationID, extras], null)
  }
}

JPushPlugin.prototype.deleteLocalNotificationWithIdentifierKeyInIOS = function (identifierKey) {
  if (this.isPlatformIOS()) {
    this.call_native('deleteLocalNotificationWithIdentifierKey', [identifierKey], null)
  }
}

JPushPlugin.prototype.clearAllLocalNotifications = function () {
  if (this.isPlatformIOS()) {
    this.call_native('clearAllLocalNotifications', [], null)
  }
}

JPushPlugin.prototype.setLocation = function (latitude, longitude) {
  if (this.isPlatformIOS()) {
    this.call_native('setLocation', [latitude, longitude], null)
  }
}

JPushPlugin.prototype.startLogPageView = function (pageName) {
  if (this.isPlatformIOS()) {
    this.call_native('startLogPageView', [pageName], null)
  }
}

JPushPlugin.prototype.stopLogPageView = function (pageName) {
  if (this.isPlatformIOS()) {
    this.call_native('stopLogPageView', [pageName], null)
  }
}

JPushPlugin.prototype.beginLogPageView = function (pageName, duration) {
  if (this.isPlatformIOS()) {
    this.call_native('beginLogPageView', [pageName, duration], null)
  }
}

JPushPlugin.prototype.setApplicationIconBadgeNumber = function (badge) {
  if (this.isPlatformIOS()) {
    this.call_native('setApplicationIconBadgeNumber', [badge], null)
  }
}

JPushPlugin.prototype.getApplicationIconBadgeNumber = function (callback) {
  if (this.isPlatformIOS()) {
    this.call_native('getApplicationIconBadgeNumber', [], callback)
  }
}

//android methods

JPushPlugin.prototype.receiveMessageInAndroidCallback = function(data) {
	try {
		console.log("JPushPlugin:receiveMessageInAndroidCallback");
		data = JSON.stringify(data);
		var bToObj = JSON.parse(data);
		this.receiveMessage = bToObj
		cordova.fireDocumentEvent('jpush.receiveMessage', null);
	} catch(exception) {
		console.log("JPushPlugin:pushCallback " + exception);
	}
}

JPushPlugin.prototype.openNotificationInAndroidCallback = function(data) {
	try {
		console.log("JPushPlugin:openNotificationInAndroidCallback");
		data = JSON.stringify(data);
		var bToObj = JSON.parse(data);
		this.openNotification = bToObj;
		cordova.fireDocumentEvent('jpush.openNotification', null);
	} catch(exception) {
		console.log(exception);
	}
}

JPushPlugin.prototype.receiveNotificationInAndroidCallback = function(data) {
	try{
		console.log("JPushPlugin:receiveNotificationInAndroidCallback");
		data = JSON.stringify(data);
		var bToObj = JSON.parse(data);
		this.receiveNotification = bToObj;
		cordova.fireDocumentEvent('jpush.receiveNotification', null);
	} catch(exception) {
		console.log(exception);
	}
}

JPushPlugin.prototype.setBasicPushNotificationBuilder = function() {
	if(device.platform == "Android") {
		data = [];
		this.call_native("setBasicPushNotificationBuilder", data, null);
	}
}

JPushPlugin.prototype.setCustomPushNotificationBuilder = function() {
	if(device.platform == "Android") {
		data = [];
		this.call_native("setCustomPushNotificationBuilder", data, null);
	}
}

JPushPlugin.prototype.setDebugMode = function(mode) {
	if(device.platform == "Android") {
		this.call_native("setDebugMode", [mode], null);
	}
}

//setDebugMode
JPushPlugin.prototype.clearAllNotification = function() {
	if(device.platform == "Android") {
		data = [];
		this.call_native("clearAllNotification", data, null);
	}
}

JPushPlugin.prototype.clearNotificationById = function(notificationId) {
	if(device.platform == "Android") {
		data = [];
		this.call_native("clearNotificationById", [notificationId], null);
	}
}

JPushPlugin.prototype.setLatestNotificationNum = function(num) {
	if(device.platform == "Android") {
		this.call_native("setLatestNotificationNum", [num], null);
	}
}

JPushPlugin.prototype.setDebugMode = function(mode) {
	if(device.platform == "Android") {
		this.call_native("setDebugMode", [mode], null);
	}
}

JPushPlugin.prototype.addLocalNotification = function(builderId, content, title,
	notificaitonID, broadcastTime, extras) {
	if(device.platform == "Android") {
		data = [builderId, content, title, notificaitonID, broadcastTime, extras];
		this.call_native("addLocalNotification", data, null);
	}
}

JPushPlugin.prototype.removeLocalNotification = function(notificationID) {
	if(device.platform == "Android") {
		this.call_native("removeLocalNotification", [notificationID], null);
	}
}

JPushPlugin.prototype.clearLocalNotifications = function() {
	if(device.platform == "Android") {
		data = [];
		this.call_native("clearLocalNotifications", data, null);
	}
}

JPushPlugin.prototype.reportNotificationOpened = function(msgID) {
	if(device.platform == "Android") {
		this.call_native("reportNotificationOpened", [msgID], null);
	}
}

/**
 *是否开启统计分析功能，用于“用户使用时长”，“活跃用户”，“用户打开次数”的统计，并上报到服务器上，
 *在 Portal 上展示给开发者。
 **/
JPushPlugin.prototype.setStatisticsOpen = function(mode) {
	if(device.platform == "Android") {
		this.call_native("setStatisticsOpen", [mode], null);
	}
}

/**
* 用于在 Android 6.0 及以上系统，申请一些权限
* 具体可看：http://docs.jpush.io/client/android_api/#android-60
*/
JPushPlugin.prototype.requestPermission = function () {
  if (device.platform == 'Android') {
    this.call_native('requestPermission', [], null)
  }
}

//iOS  single

if(!window.plugins) {
	window.plugins = {};
}

if(!window.plugins.jPushPlugin) {
	window.plugins.jPushPlugin = new JPushPlugin();
}

module.exports = new JPushPlugin();
