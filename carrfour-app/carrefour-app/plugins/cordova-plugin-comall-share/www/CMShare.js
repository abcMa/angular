var exec = require('cordova/exec');

var CMShare = function() {
};

/**
 * 检查应用是否已安装
 * @param type {String} 平台类型 QQ:qq, 微博:sina, 微信:wechat
 * @param success {Function} 成功回调
 * @param error {Function} 失败回调，返回错误信息
 */
CMShare.checkAppInstalled = function(type, success, error) {
    exec(success, error, "CMShare", "checkAppInstalled", [type]);
};

/**
 * 分享
 * @param title {String} 分享标题
 * @param content {String} 分享内容
 * @param pic {String} 分享图片url
 * @param url {String} 分享内容跳转链接
 * @param type {String} sina //新浪, qq //QQ聊天页面, qzone //qq空间
 * @param successCallback {Function} 分享成功回调，参数为分享平台
 */
CMShare.shareToPlatform = function(title, content, pic, url, type,successCallback) {
    exec(successCallback, null, "CMShare", "shareToPlatform", [title, content, pic, url,type]);
};
module.exports = CMShare;