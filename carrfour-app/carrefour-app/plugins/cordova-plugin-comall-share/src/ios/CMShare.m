//
//  CMShare.m
//  sanzhisongshu
//
//  Created by Martin on 2017/6/14.
//
//

#import "CMShare.h"
#import "AppDelegate.h"
#import "CMShareMsgObject.h"

@interface CMShare ()

@property (strong, nonatomic)CMShareMsgObject *msgObject;
@property (strong, nonatomic)TencentOAuth * tencentOAuth;

@end

@implementation CMShare
/**
 1.初始化微博sdk
 2.初始化腾讯sdk
 */
- (void)pluginInitialize {
    NSDictionary *settings = [self.commandDelegate settings];
    NSString *qqAppKey = [settings objectForKey:@"qq_appkey_ios"];
    NSString *sinaAppKey = [settings objectForKey:@"sina_appkey"];
    [WeiboSDK enableDebugMode:YES];
    [WeiboSDK registerApp:sinaAppKey];
    _msgObject = [[CMShareMsgObject alloc] init];
    self.tencentOAuth = [[TencentOAuth alloc] initWithAppId:qqAppKey
                                                andDelegate:self];
    self.tencentOAuth.redirectURI = @"http://www.qq.com";
}

/**
 检测手机是否安装app
 */
- (void)checkAppInstalled:(CDVInvokedUrlCommand *)command {
    [self setCommand:command];
    NSString* type = [command.arguments objectAtIndex:0];
    CDVPluginResult* pluginResult = nil;
    
    if ([type isEqualToString:@"qq"]) {
        pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsBool:[QQApiInterface isQQInstalled] && [QQApiInterface isQQSupportApi]];
    } else {
        return;
    }
    [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
}

/**
 根据platformType分享
 */
- (void)shareToPlatform:(CDVInvokedUrlCommand *)command {
    [self setCommand:command];
    //根据platform设置分享内容
    _msgObject.title = [command.arguments objectAtIndex:0];
    _msgObject.text = [command.arguments objectAtIndex:1];
    _msgObject.thumbImage = [command.arguments objectAtIndex:2];
    _msgObject.url = [command.arguments objectAtIndex:3];
    _msgObject.platformType = [self.command.arguments objectAtIndex:4];
    
    if ([_msgObject.platformType isEqualToString:@"sina"]) {
        WBMessageObject *message = [WBMessageObject message];
        NSString *weiboText = [NSString stringWithFormat:@"%@\r\n%@\r\n%@", _msgObject.title, _msgObject.text, _msgObject.url];
        message.text = weiboText;
        WBImageObject *imageObject = [WBImageObject object];
        imageObject.imageData = [NSData dataWithContentsOfURL:[NSURL URLWithString:_msgObject.thumbImage]];
        message.imageObject = imageObject;
        
        WBAuthorizeRequest *authRequest = [WBAuthorizeRequest request];
        authRequest.redirectURI = @"http://www.sina.com";
        authRequest.scope = @"all";
        
        WBSendMessageToWeiboRequest *request = [WBSendMessageToWeiboRequest requestWithMessage:message authInfo:authRequest access_token:nil];
        [WeiboSDK sendRequest:request];
        
    } else if ([_msgObject.platformType isEqualToString:@"qq"] || [_msgObject.platformType isEqualToString:@"qzone"]) {

        if (![TencentOAuth iphoneQQInstalled] && [_msgObject.platformType isEqualToString:@"qq"]) {
            NSLog(@"请移步App Store去下载腾讯QQ客户端");
            UIAlertController *alertV = [UIAlertController alertControllerWithTitle:@"提示" message:@"请移步App Store去下载腾讯QQ客户端" preferredStyle:UIAlertControllerStyleAlert];
            [alertV addAction:[UIAlertAction actionWithTitle:@"取消" style:UIAlertActionStyleCancel handler:nil]];
            [self.viewController presentViewController:alertV animated:YES completion:nil];
            
        }else {
            QQApiNewsObject *messageObj = [QQApiNewsObject
                                        objectWithURL:[NSURL URLWithString:_msgObject.url]
                                        title:_msgObject.title
                                        description:_msgObject.text
                                        previewImageURL:[NSURL URLWithString:_msgObject.thumbImage]];
            SendMessageToQQReq *req = [SendMessageToQQReq reqWithContent:messageObj];
            if ([_msgObject.platformType isEqualToString:@"qq"]) {
                NSLog(@"QQ好友列表分享 - %d",[QQApiInterface sendReq:req]);
            }else if ([_msgObject.platformType isEqualToString:@"qzone"]){
                NSLog(@"QQ空间分享 - %d",[QQApiInterface SendReqToQZone:req]);
            }
        }
    }
    
}

#pragma tencent_delegate
- (void)onResp:(QQBaseResp *)resp {
    CDVPluginResult *pluginResult;
    if ([resp.result integerValue] == 0) {
        if ([_msgObject.platformType isEqualToString:@"qq"]) {
            pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:@"qq"];
        }
        else {
            pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:@"qzone"];
        }
    } else {
        NSString * errorInfo = resp.extendInfo ? resp.extendInfo : @"failed";
        pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:errorInfo];
    }
    [self.commandDelegate sendPluginResult:pluginResult callbackId:self.command.callbackId];
}

#pragma weibo_delegate
- (void)didReceiveWeiboRequest:(WBBaseRequest *)request {}

- (void)didReceiveWeiboResponse:(WBBaseResponse *)response {
    if ([response isKindOfClass:WBSendMessageToWeiboResponse.class]) {
        CDVPluginResult *pluginResult;
        if (response.statusCode == 0) {
            pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:@"sina"];
        }
        else {
            pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"failed"];
        }
        [self.commandDelegate sendPluginResult:pluginResult callbackId:self.command.callbackId];
    }
}

//设置回调
- (void)handleOpenURL:(NSNotification *)notification {
    NSURL* url = [notification object];
    NSString* scheme = [url scheme];
    
    if ([scheme hasPrefix:@"QQ"] || [scheme hasPrefix:@"tencent"]){
        [QQApiInterface handleOpenURL:url delegate:self];
    } else if ([scheme hasPrefix:@"sina"] || [scheme hasPrefix:@"wb"]) {
        [WeiboSDK handleOpenURL:url delegate:self];
    }
    
}

@end
