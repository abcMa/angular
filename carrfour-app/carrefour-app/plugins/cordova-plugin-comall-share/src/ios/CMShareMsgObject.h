//
//  CMShareMsgObject.h
//  sanzhisongshu
//
//  Created by Martin on 2017/6/14.
//
//

#import <Foundation/Foundation.h>

@interface CMShareMsgObject : NSObject

//分享标题
@property (copy, nonatomic) NSString *title;

//分享文字
@property (copy, nonatomic) NSString *text;

//分享缩略图
@property (copy, nonatomic) NSString *thumbImage;

//分享url
@property (copy, nonatomic) NSString *url;

//platformType
@property (copy, nonatomic) NSString *platformType;

@end
