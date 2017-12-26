//
//  CMShare.h
//  sanzhisongshu
//
//  Created by Martin on 2017/6/14.
//
//

#import <Cordova/CDVPlugin.h>
#import "WeiboSDK.h"
#import <TencentOpenAPI/TencentOAuth.h>
#import <TencentOpenAPI/QQApiInterface.h>

@interface CMShare : CDVPlugin <WeiboSDKDelegate, TencentSessionDelegate, QQApiInterfaceDelegate>

@property (nonatomic, retain) CDVInvokedUrlCommand *command;

- (void)checkAppInstalled:(CDVInvokedUrlCommand*)command;
- (void)shareToPlatform:(CDVInvokedUrlCommand *)command;

@end
