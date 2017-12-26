#import "PickerViewPlugin.h"

@implementation PickerViewPlugin

- (void) show:(CDVInvokedUrlCommand*)command {
    data = [command.arguments objectAtIndex:0];
    
    options = [command.arguments objectAtIndex:1];
    level = [[options objectForKey:@"level"] integerValue];
    
    callbackId = command.callbackId;
    
    // default select first row
    values = [[NSMutableArray alloc] initWithCapacity:level];
    selectedItems = [[NSMutableArray alloc] initWithCapacity:level];
    
    NSDictionary* selectedSubItem = [data objectAtIndex:0];
    values[0] = data;
    selectedItems[0] = selectedSubItem;

    for (int i = 1; i < level; i++) {
        NSArray* subItems = [selectedSubItem objectForKey:@"subItems"];
        selectedSubItem = [subItems objectAtIndex:0];
        
        values[i] = subItems;
        selectedItems[i] = selectedSubItem;
    }

    [self createPickerView];
}

- (void) hide:(CDVInvokedUrlCommand*) command {
    
}

- (void) createPickerView {
    
    UIView* view = self.webView.superview;
    maskView = [[UIView alloc] initWithFrame:CGRectMake(0, 0, view.bounds.size.width, view.bounds.size.height)];
    [maskView setBackgroundColor:[UIColor colorWithRed:0.0 green:0.0 blue:0.0 alpha:0.5]];
    
    [view addSubview:maskView];
    
    // 创建picker上方的动作条 增加Done按钮
    // 距离屏幕底部260px 全宽度，44px高
    toolbar = [[UIToolbar alloc] initWithFrame:CGRectMake(0, view.bounds.size.height - 260, view.bounds.size.width, 44)];
    
    UIBarButtonItem *flexSpace = [[UIBarButtonItem alloc] initWithBarButtonSystemItem:UIBarButtonSystemItemFlexibleSpace target:nil action:nil];
    
    // 完成按钮
    NSString* doneButtonText = @"Done";
    
    if ([[options allKeys] containsObject:@"doneButton"]) {
        NSDictionary* doneButtonOptions = [options objectForKey:@"doneButton"];
        
        if ([[doneButtonOptions allKeys] containsObject:@"text"]) {
            doneButtonText = [doneButtonOptions objectForKey:@"text"];
        }
    }
    
    UIBarButtonItem *done = [[UIBarButtonItem alloc] initWithTitle:doneButtonText style:UIBarButtonItemStylePlain target:self action:@selector(onConfirm:)];
    
    // 取消按钮
    NSString* cancelButtonText = @"Cancel";
    
    if ([[options allKeys] containsObject:@"cancelButton"]) {
        NSDictionary* cancelButtonOptions = [options objectForKey:@"cancelButton"];
        
        if ([[cancelButtonOptions allKeys] containsObject:@"text"]) {
            cancelButtonText = [cancelButtonOptions objectForKey:@"text"];
        }
    }
    
    UIBarButtonItem *cancel = [[UIBarButtonItem alloc] initWithTitle:cancelButtonText style:UIBarButtonItemStylePlain target:self action:@selector(onCancel:)];
    
    // 中间的文本
    label =[[UILabel alloc] initWithFrame:CGRectMake(0, 0, 180, 30)];
    [label setTextAlignment:NSTextAlignmentCenter];
    [label setTextColor: (NSFoundationVersionNumber > NSFoundationVersionNumber_iOS_6_1) ? [UIColor blackColor] : [UIColor whiteColor]];
    [label setFont: [UIFont boldSystemFontOfSize:16]];
    [label setBackgroundColor:[UIColor clearColor]];
    label.text = @"";
    UIBarButtonItem *labelButton = [[UIBarButtonItem alloc] initWithCustomView:label];
    
    // 插到Toolbar上，布局是按顺序来的
    toolbar.items = @[cancel, flexSpace, labelButton, flexSpace, done];
    toolbar.barStyle = UIBarStyleDefault;
    [view addSubview:toolbar];
    
    // 创建 pickerView
    pickerView = [[UIPickerView alloc] initWithFrame:CGRectMake(0, view.bounds.size.height - 216, view.bounds.size.width, 216)];
    pickerView.backgroundColor = [UIColor colorWithRed:1.0 green:1.0 blue:1.0 alpha:1];
    pickerView.delegate = self;
    pickerView.dataSource = self;
    pickerView.showsSelectionIndicator = YES;
    
    for (int i = 0; i < level; i++) {
        [pickerView selectRow:0 inComponent:i animated:NO];
    }
    
    [self setLabelText];

    [UIView transitionWithView:view
                      duration:0.5
                       options:UIViewAnimationOptionBeginFromCurrentState
                    animations:^{[view addSubview:pickerView];}
                    completion:nil];

}

- (void)onConfirm:(id)sender {
    CDVPluginResult* result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsArray:selectedItems];
    [self.commandDelegate sendPluginResult:result callbackId:callbackId];
    
    [maskView removeFromSuperview];
    [pickerView removeFromSuperview];
    [toolbar removeFromSuperview];
}

- (void)onCancel:(id)sender {
    CDVPluginResult* result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:@"cancel"];
    [self.commandDelegate sendPluginResult:result callbackId:callbackId];
    
    [maskView removeFromSuperview];
    [pickerView removeFromSuperview];
    [toolbar removeFromSuperview];
}

- (NSInteger)numberOfComponentsInPickerView:(UIPickerView*)pickerView  {
    return level;
}

- (CGFloat)pickerView:(UIPickerView*)pickerView widthForComponent:(NSInteger)component {
    UIView* view = self.webView.superview;
    NSInteger viewWidth = view.bounds.size.width;
    return viewWidth / level;
}

- (NSInteger)pickerView:(UIPickerView*)pickerView numberOfRowsInComponent:(NSInteger)component {
    return [values[component] count];
}

- (NSString*)pickerView:(UIPickerView*)pickerView titleForRow:(NSInteger)row forComponent:(NSInteger)component {
    NSArray* componentData = [values objectAtIndex:component];
    NSDictionary* dataItem = [componentData objectAtIndex:row];
        
    return [dataItem objectForKey:@"text"];
}

- (UIView *)pickerView:(UIPickerView *)pickerView viewForRow:(NSInteger)row forComponent:(NSInteger)component reusingView:(UIView *)view {
    UILabel* pickerLabel = (UILabel*)view;
    
    if (!pickerLabel) {
        pickerLabel = [[UILabel alloc] init];
        
        pickerLabel.minimumScaleFactor = 8;
        pickerLabel.adjustsFontSizeToFitWidth = YES;
        pickerLabel.textAlignment = NSTextAlignmentCenter;

        [pickerLabel setTextColor:[UIColor blackColor]];
        [pickerLabel setFont:[UIFont systemFontOfSize:17.0f]];
    }
    
    pickerLabel.text = [self pickerView:pickerView titleForRow:row forComponent:component];
    return pickerLabel;
}

- (void)pickerView:(UIPickerView*)pickerView didSelectRow: (NSInteger)row inComponent:(NSInteger)component  {
    if (component < level - 1) {
        NSDictionary* selectedItem = values[component][row];
        NSInteger nextComponent = component + 1;
        NSArray* nextData = [selectedItem objectForKey:@"subItems"];
        
        // change selected
        selectedItems[component] = selectedItem;
        
        // set next row data and selected
        values[nextComponent] = nextData;
        selectedItems[nextComponent] = nextData[0];
        
        [pickerView selectRow:0 inComponent:nextComponent animated:YES];
        [pickerView reloadComponent:nextComponent];
        
        [self setLabelText];
    }
    else if (component == level - 1) {
        NSDictionary* selectedItem = values[component][row];
        selectedItems[component] = selectedItem;

        [self setLabelText];
    }
}

-(void)setLabelText {
    NSDictionary* item = selectedItems[level - 1];
    
    if ([[item allKeys] containsObject:@"subtext"]) {
        [label setText:[item objectForKey:@"subtext"]];
    }
}

+(UIColor *)colorWithHexColorString:(NSString *)hexColorString {
    if ([hexColorString length] < 6){ //长度不合法
        return [UIColor blackColor];
    }
    
    NSString *tempString = [hexColorString lowercaseString];
    
    if ([tempString hasPrefix:@"0x"]) { //检查开头是0x
        tempString = [tempString substringFromIndex:2];
    }
    
    else if ([tempString hasPrefix:@"#"]) { //检查开头是#
        tempString = [tempString substringFromIndex:1];
    }
    
    if ([tempString length] != 6){
        return [UIColor blackColor];
    }
    
    //分解三种颜色的值
    NSRange range;
    range.location = 0;
    
    range.length = 2;
    NSString *rString = [tempString substringWithRange:range];
    
    range.location = 2;
    NSString *gString = [tempString substringWithRange:range];
    
    range.location = 4;
    NSString *bString = [tempString substringWithRange:range];
    
    //取三种颜色值
    unsigned int r, g, b;
    [[NSScanner scannerWithString:rString] scanHexInt:&r];
    [[NSScanner scannerWithString:gString] scanHexInt:&g];
    [[NSScanner scannerWithString:bString] scanHexInt:&b];

    return [UIColor colorWithRed:((float) r /255.0f)
                           green:((float) g /255.0f)
                            blue:((float) b /255.0f)
                           alpha:1.0f];
}

@end

