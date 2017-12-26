#import "Preference.h"
#import <Cordova/CDV.h>

@implementation Preference

- (void)get:(CDVInvokedUrlCommand*)command
{
    NSString* key = [[command.arguments objectAtIndex:0] lowercaseString];
    NSString* value = [[self.commandDelegate settings] objectForKey:key];
    CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:value];
    [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
}

@end
