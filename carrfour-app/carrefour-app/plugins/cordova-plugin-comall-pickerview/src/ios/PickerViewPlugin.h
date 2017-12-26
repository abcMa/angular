#import <Cordova/CDVPlugin.h>

@interface PickerViewPlugin : CDVPlugin<UIPickerViewDelegate> {
    UIView* maskView;
    UIPickerView* pickerView;
    UIToolbar* toolbar;
    UILabel* label;
    
    NSArray* data;
    NSDictionary* options;
    NSInteger level;
    
    NSString* callbackId;
    NSMutableArray* values;
    NSMutableArray* selectedItems;
}

- (void) show:(CDVInvokedUrlCommand*)command;

- (void) hide:(CDVInvokedUrlCommand*)command;

@end

