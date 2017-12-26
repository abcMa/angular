#import "CMDeploy.h"
#import <Cordova/CDV.h>
#import "UNIRest.h"
#import "SSZipArchive.h"
#import "CMConstant.h"

@interface CMDeploy()

@property (nonatomic) NSURLConnection *connectionManager;
@property (nonatomic) NSMutableData *downloadedMutableData;
@property (nonatomic) NSURLResponse *urlResponse;

@property int progress;
@property NSString *callbackId;
@property NSString *channel_tag;
@property NSDictionary *last_update;
@property Boolean ignore_deploy;
@property NSString *version_label;
@property NSString *currentUUID;
@property dispatch_queue_t serialQueue;
@property NSString *cordova_js_resource;
@property NSString *checkUrl;
@property NSDictionary *requestHeaders;

@end

static NSOperationQueue *delegateQueue;

typedef struct JsonHttpResponse {
    __unsafe_unretained NSString *message;
    __unsafe_unretained NSDictionary *json;
    Boolean *error;
} JsonHttpResponse;

@implementation CMDeploy

- (void) pluginInitialize {
    NSUserDefaults *prefs = [NSUserDefaults standardUserDefaults];
    self.cordova_js_resource = [[NSBundle mainBundle] pathForResource:@"www/cordova" ofType:@"js"];
    self.serialQueue = dispatch_queue_create("Deploy Plugin Queue", NULL);
    self.version_label = [prefs stringForKey:@"ionicdeploy_version_label"];

    NSLog(@" version_label  %@", self.version_label);
    if(self.version_label == nil) {
        self.version_label = NO_DEPLOY_LABEL;
    }
    [self initVersionChecks];

    NSLog(@" version_label version_label %@", self.version_label);
}

- (NSString *) getUUID {
    NSUserDefaults *prefs = [NSUserDefaults standardUserDefaults];
    NSString *uuid = [prefs stringForKey:@"uuid"];
    if(uuid == nil) {
        uuid = NO_DEPLOY_LABEL;
    }
    return uuid;
}

- (NSArray *) deconstructVersionLabel: (NSString *) label {
    return [label componentsSeparatedByString:@":"];
}

- (NSString *) constructVersionLabel: (NSString *) uuid {
    NSString *version = [[NSBundle mainBundle] objectForInfoDictionaryKey:@"CFBundleShortVersionString"];
    NSFileManager* fm = [NSFileManager defaultManager];
    NSDictionary* attrs = [fm attributesOfItemAtPath:self.cordova_js_resource error:nil];

    if (attrs != nil) {
        NSDate *date = (NSDate*)[attrs objectForKey: NSFileCreationDate];
        int int_timestamp = [date timeIntervalSince1970];
        NSString *timestamp = [NSString stringWithFormat:@"%d", int_timestamp];
        return [NSString stringWithFormat:@"%@:%@:%@", version, timestamp, uuid];
    }
    return NO_DEPLOY_LABEL;
}

- (void) updateVersionLabel: (NSString *)ignore_version {
    NSLog(@"updating version label");
    NSUserDefaults *prefs = [NSUserDefaults standardUserDefaults];
    NSString *ionicdeploy_version_label = [self constructVersionLabel:[self getUUID]];
    [prefs setObject:ionicdeploy_version_label forKey: @"ionicdeploy_version_label"];
    [prefs setObject:ignore_version forKey: @"ionicdeploy_version_ignore"];
    [prefs synchronize];
    self.version_label = ionicdeploy_version_label;
}

- (void) initVersionChecks {
    NSUserDefaults *prefs = [NSUserDefaults standardUserDefaults];
    NSString *uuid = [self getUUID];
    NSString *ionicdeploy_version_label = [self constructVersionLabel:uuid];

    NSLog(@"VERSION LABEL: %@", ionicdeploy_version_label);

    if(![ionicdeploy_version_label isEqualToString: NO_DEPLOY_LABEL]) {
        if(![self.version_label isEqualToString: ionicdeploy_version_label]) {
            self.ignore_deploy = true;
            [self updateVersionLabel:uuid];
            [prefs setObject: @"" forKey: @"uuid"];
            [prefs synchronize];
        }
    }
}

- (void) onReset {
    // redirect to latest deploy
    [self doRedirect];
}

- (void) initialize:(CDVInvokedUrlCommand *)command {
    NSDictionary* options = [command.arguments objectAtIndex:0];
    self.checkUrl = [options objectForKey:@"checkUrl"];
    self.requestHeaders = [options objectForKey:@"requestHeaders"];
    [self.commandDelegate sendPluginResult:[CDVPluginResult resultWithStatus:CDVCommandStatus_OK] callbackId:command.callbackId];
}

- (void) check:(CDVInvokedUrlCommand *)command {
    self.channel_tag = [command.arguments objectAtIndex:0];

    dispatch_async(self.serialQueue, ^{
        CDVPluginResult* pluginResult = nil;

        NSUserDefaults *prefs = [NSUserDefaults standardUserDefaults];

        NSString *our_version = [[NSUserDefaults standardUserDefaults] objectForKey:@"uuid"];

        JsonHttpResponse result = [self postDeviceDetails];

        NSMutableDictionary *resultJson = [[NSMutableDictionary alloc] init];

        NSLog(@"Response: %@", result.message);

        if(result.json != nil) {
            NSNumber *compatible = [result.json valueForKey:@"compatible_binary"];
            NSNumber *update_available = [result.json objectForKey:@"update_available"];
            NSString *ignore_version = [prefs objectForKey:@"ionicdeploy_version_ignore"];


            NSLog(@"compatible: %@", (compatible) ? @"True" : @"False");
            NSLog(@"available: %@", (update_available) ? @"True" : @"False");

            if (compatible != [NSNumber numberWithBool:YES]) {
                NSLog(@"Refusing update due to incompatible binary version");
            }
            else if(update_available == [NSNumber numberWithBool: YES]) {

                NSDictionary *update = [result.json objectForKey:@"update"];
                NSString *update_uuid = [update objectForKey:@"version"];
                NSInteger *force = [[update objectForKey:@"mandatoryStatus"] integerValue];
                NSString *targetVersion = [update objectForKey:@"version"];

                NSLog(@"update uuid: %@", update_uuid);

                [resultJson setObject:[NSNumber numberWithBool:force] forKey:@"force"];
                [resultJson setObject:targetVersion forKey:@"targetVersion"];

                if(![update_uuid isEqual:ignore_version] && ![update_uuid isEqual:our_version]) {
                    [prefs setObject: update_uuid forKey: @"upstream_uuid"];
                    [prefs synchronize];
                    self.last_update = result.json;
                }
                else {
                    update_available = 0;
                }
            }
            [resultJson setObject:[NSNumber numberWithBool:update_available == [NSNumber numberWithBool:YES] && compatible == [NSNumber numberWithBool:YES]] forKey:@"update"];
        }
        else {
            NSLog(@"unable to check for updates");
            [resultJson setObject:[NSNumber numberWithBool:NO] forKey:@"update"];
            [resultJson setObject:@"unable to check for updates" forKey:@"error"];
        }
        pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary:resultJson];
        [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];

    });
}


- (void) download:(CDVInvokedUrlCommand *)command {
    dispatch_async(self.serialQueue, ^{
        // Save this to a property so we can have the download progress delegate thing send
        // progress update callbacks
        self.callbackId = command.callbackId;

        NSUserDefaults *prefs = [NSUserDefaults standardUserDefaults];

        NSString *upstream_uuid = [[NSUserDefaults standardUserDefaults] objectForKey:@"upstream_uuid"];

        NSLog(@"Upstream UUID: %@", upstream_uuid);

        if (upstream_uuid != nil && [self hasVersion:upstream_uuid]) {
            // Set the current version to the upstream version (we already have this version)
            [prefs setObject:upstream_uuid forKey:@"uuid"];
            [prefs synchronize];
            [self.commandDelegate sendPluginResult:[CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:@"false"] callbackId:self.callbackId];
        } else {
            NSDictionary *result = self.last_update;
            NSDictionary *update = [result objectForKey:@"update"];
            NSString *download_url = [update objectForKey:@"url"];

            NSLog(@"update is: %@", update);
            NSLog(@"download url is: %@", download_url);

            self.downloadManager = [[DownloadManager alloc] initWithDelegate:self];

            NSURL *url = [NSURL URLWithString:download_url];

            NSArray *paths = NSSearchPathForDirectoriesInDomains(NSApplicationSupportDirectory, NSUserDomainMask, YES);
            NSString *libraryDirectory = [paths objectAtIndex:0];
            NSString *filePath = [NSString stringWithFormat:@"%@/%@", libraryDirectory,@"www.zip"];

            NSLog(@"Queueing Download...");
            [self.downloadManager addDownloadWithFilename:filePath URL:url];
        }
    });
}

- (void) extract:(CDVInvokedUrlCommand *)command {
    dispatch_async(self.serialQueue, ^{
        NSUserDefaults *prefs = [NSUserDefaults standardUserDefaults];

        self.callbackId = command.callbackId;
        self.ignore_deploy = false;

        NSString *download_uuid = [[NSUserDefaults standardUserDefaults] objectForKey:@"download_uuid"];

        if(download_uuid != nil && [self hasVersion:download_uuid]) {
            [self updateVersionLabel:NOTHING_TO_IGNORE];
            [self.commandDelegate sendPluginResult:[CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:@"done"] callbackId:self.callbackId];
        } else {
            NSArray *paths = NSSearchPathForDirectoriesInDomains(NSApplicationSupportDirectory, NSUserDomainMask, YES);
            NSString *libraryDirectory = [paths objectAtIndex:0];

            // NSString *uuid = [[NSUserDefaults standardUserDefaults] objectForKey:@"uuid"];

            NSString *filePath = [NSString stringWithFormat:@"%@/%@", libraryDirectory, @"www.zip"];
            NSString *extractPath = [NSString stringWithFormat:@"%@/%@/", libraryDirectory, download_uuid];

            // 先复制应用中的 WWW 目录到热部署目录中
            NSLog(@"copy app www dir...");
            [self copyByMainBundle:@"www" to:libraryDirectory newNameIs:download_uuid];

            // 再将增量更新包中的文件解压缩到热部署目录中
            NSLog(@"Path for zip file: %@", filePath);
            NSLog(@"Unzipping...");

            [SSZipArchive unzipFileAtPath:filePath toDestination:extractPath delegate:self];
        }
    });
}

- (void) redirect:(CDVInvokedUrlCommand *)command {
    CDVPluginResult* pluginResult = nil;

    [self doRedirect];

    [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
}

- (void) info:(CDVInvokedUrlCommand *)command {
    NSMutableDictionary *json = [[NSMutableDictionary alloc] init];
    NSString *uuid = [self getUUID];
    if ([uuid isEqualToString:@""]) {
        uuid = NO_DEPLOY_LABEL;
    }

    [json setObject:uuid forKey:@"deploy_uuid"];
    [json setObject:[[self deconstructVersionLabel:self.version_label] firstObject] forKey:@"binary_version"];
    [self.commandDelegate sendPluginResult:[CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary:json] callbackId:command.callbackId];
}

- (void) getVersions:(CDVInvokedUrlCommand *)command {
    [self.commandDelegate sendPluginResult:[CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsArray:[self getDeployVersions]] callbackId:command.callbackId];
}

- (void) doRedirect {
    NSUserDefaults *prefs = [NSUserDefaults standardUserDefaults];
    NSString *uuid = [[NSUserDefaults standardUserDefaults] objectForKey:@"uuid"];
    NSString *ignore = [prefs stringForKey:@"ionicdeploy_version_ignore"];
    if (ignore == nil) {
        ignore = NOTHING_TO_IGNORE;
    }
    NSLog(@"uuid is: %@", uuid);
    if (self.ignore_deploy) {
        NSLog(@"ignore deploy");
    }
    NSLog(@"ignore version: %@", ignore);
    if (![uuid isEqualToString:@""] && !self.ignore_deploy && ![uuid isEqualToString:ignore]) {

        dispatch_async(self.serialQueue, ^{
            if ( uuid != nil && ![self.currentUUID isEqualToString: uuid] ) {
                NSArray *paths = NSSearchPathForDirectoriesInDomains(NSApplicationSupportDirectory, NSUserDomainMask, YES);
                NSString *libraryDirectory = [paths objectAtIndex:0];


                NSString *query = [NSString stringWithFormat:@"cordova_js_bootstrap_resource=%@", self.cordova_js_resource];

                NSURLComponents *components = [NSURLComponents new];
                components.scheme = @"file";
                components.path = [NSString stringWithFormat:@"%@/%@/index.html", libraryDirectory, uuid];
                components.query = query;

                self.currentUUID = uuid;

                NSLog(@"Redirecting to: %@", components.URL.absoluteString);
                [self.webViewEngine loadRequest: [NSURLRequest requestWithURL:components.URL] ];
            }
        });
    }
}

- (struct JsonHttpResponse) postDeviceDetails {
    NSString *url = self.checkUrl;
    NSString *uuid = [[NSUserDefaults standardUserDefaults] objectForKey:@"uuid"];
    NSString *app_version = [[self deconstructVersionLabel:self.version_label] firstObject];

    NSDictionary* parameters;

    NSLog(@"app_version－－: %@", app_version);
    NSLog(@"uuid －－: %@", uuid);

    if (uuid == nil || [uuid isEqualToString:@""]) {
        parameters = @{
                       @"device_app_version": app_version,
                       @"device_platform": @"ios",
                       @"channel_tag": self.channel_tag
                       };
    }
    else {
        parameters = @{
                       @"device_app_version": app_version,
                       @"device_deploy_version": uuid,
                       @"device_platform": @"ios",
                       @"channel_tag": self.channel_tag
                       };
    }

    NSMutableDictionary* mutableHeaders = [NSMutableDictionary dictionaryWithCapacity:2];
    mutableHeaders[@"Content-Type"] = @"application/json";
    mutableHeaders[@"accept"] = @"application/json";

    if (self.requestHeaders != nil) {
        [mutableHeaders addEntriesFromDictionary:self.requestHeaders];
    }

    UNIHTTPJsonResponse *result = [[UNIRest get:^(UNISimpleRequest *request) {
        [request setUrl:url];
        [request setHeaders:mutableHeaders];
        [request setParameters:parameters];
    }] asJson];

    NSLog(@"version is: %@", app_version);
    NSLog(@"uuid is: %@", uuid);
    NSLog(@"channel is: %@", self.channel_tag);

    JsonHttpResponse response;
    NSError *jsonError = nil;

    @try {
        response.message = nil;
        response.json = [result.body JSONObject];
    }
    @catch (NSException *exception) {
        response.message = exception.reason;
        NSLog(@"JSON Error: %@", jsonError);
        NSLog(@"Exception: %@", exception.reason);
    }
    @finally {
        NSLog(@"In Finally");
        NSLog(@"JSON Error: %@", jsonError);

        if (jsonError != nil) {
            response.message = [NSString stringWithFormat:@"%@", [jsonError localizedDescription]];
            response.json = nil;
        }
    }

    return response;
}

- (NSMutableArray *) getMyVersions {
    NSMutableArray *versions;
    NSArray *versionsLoaded = [[NSUserDefaults standardUserDefaults] arrayForKey:@"my_versions"];
    if (versionsLoaded != nil) {
        versions = [versionsLoaded mutableCopy];
    } else {
        versions = [[NSMutableArray alloc] initWithCapacity:5];
    }

    return versions;
}

- (NSMutableArray *) getDeployVersions {
    NSArray *versions = [self getMyVersions];
    NSMutableArray *deployVersions = [[NSMutableArray alloc] initWithCapacity:5];

    for (id version in versions) {
        NSArray *version_parts = [version componentsSeparatedByString:@"|"];
        NSString *version_uuid = version_parts[1];
        [deployVersions addObject:version_uuid];
    }

    return deployVersions;
}

- (void) removeVersionFromPreferences:(NSString *) uuid {
    NSUserDefaults *prefs = [NSUserDefaults standardUserDefaults];
    NSArray *versions = [self getMyVersions];
    NSMutableArray *newVersions = [[NSMutableArray alloc] initWithCapacity:5];

    for (id version in versions) {
        NSArray *version_parts = [version componentsSeparatedByString:@"|"];
        NSString *version_uuid = version_parts[1];
        if (![version_uuid isEqualToString:uuid]) {
            [newVersions addObject:version_uuid];
        }
    }

    [prefs setObject:newVersions forKey:@"my_versions"];
    [prefs synchronize];
}


- (bool) hasVersion:(NSString *) uuid {
    NSArray *versions = [self getMyVersions];

    NSLog(@"Versions: %@", versions);

    for (id version in versions) {
        NSArray *version_parts = [version componentsSeparatedByString:@"|"];
        NSString *version_uuid = version_parts[1];

        NSLog(@"version_uuid: %@, uuid: %@", version_uuid, uuid);
        if ([version_uuid isEqualToString:uuid]) {
            return true;
        }
    }

    return false;
}

- (void) deleteVersion:(CDVInvokedUrlCommand *)command {
    NSString *uuid = [command.arguments objectAtIndex:1];
    BOOL success = [self removeVersion:uuid];
    CDVPluginResult *pluginResult = nil;

    if (success) {
        pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK];
    } else {
        pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"Unable to delete the deploy version"];
    }
    [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
}

- (void) saveVersion:(NSString *) uuid {
    NSUserDefaults *prefs = [NSUserDefaults standardUserDefaults];
    NSMutableArray *versions = [self getMyVersions];

    int versionCount = (int) [[NSUserDefaults standardUserDefaults] integerForKey:@"version_count"];

    if (versionCount) {
        versionCount += 1;
    } else {
        versionCount = 1;
    }

    [prefs setInteger:versionCount forKey:@"version_count"];
    [prefs synchronize];

    NSString *versionString = [NSString stringWithFormat:@"%i|%@", versionCount, uuid];

    [versions addObject:versionString];

    [prefs setObject:versions forKey:@"my_versions"];
    [prefs synchronize];

    [self cleanupVersions];
}

- (void) cleanupVersions {
    NSUserDefaults *prefs = [NSUserDefaults standardUserDefaults];
    NSMutableArray *versions = [self getMyVersions];

    int versionCount = (int) [[NSUserDefaults standardUserDefaults] integerForKey:@"version_count"];

    if (versionCount && versionCount > 3) {
        NSInteger threshold = versionCount - 3;

        NSInteger count = [versions count];
        for (NSInteger index = (count - 1); index >= 0; index--) {
            NSString *versionString = versions[index];
            NSArray *version_parts = [versionString componentsSeparatedByString:@"|"];
            NSInteger version_number = [version_parts[0] intValue];
            if (version_number < threshold) {
                [versions removeObjectAtIndex:index];
                [self removeVersion:version_parts[1]];
            }
        }

        NSLog(@"Version Count: %i", (int) [versions count]);
        [prefs setObject:versions forKey:@"my_versions"];
        [prefs synchronize];
    }
}

- (BOOL) excludeVersionFromBackup:(NSString *) uuid {
    NSArray *paths = NSSearchPathForDirectoriesInDomains(NSApplicationSupportDirectory, NSUserDomainMask, YES);
    NSString *libraryDirectory = [paths objectAtIndex:0];

    NSString *pathToFolder = [NSString stringWithFormat:@"%@/%@", libraryDirectory, uuid];
    NSURL *URL= [NSURL fileURLWithPath:pathToFolder];

    NSError *error = nil;
    BOOL success = [URL setResourceValue:[NSNumber numberWithBool: YES] forKey: NSURLIsExcludedFromBackupKey error: &error];
    if(!success){
        NSLog(@"Error excluding %@ from backup %@", [URL lastPathComponent], error);
    } else {
        NSLog(@"Excluding %@ from backup", pathToFolder);
    }
    return success;
}

- (BOOL) removeVersion:(NSString *) uuid {
    NSUserDefaults *prefs = [NSUserDefaults standardUserDefaults];
    NSString *currentUUID = [self getUUID];
    NSArray *paths = NSSearchPathForDirectoriesInDomains(NSApplicationSupportDirectory, NSUserDomainMask, YES);
    NSString *libraryDirectory = [paths objectAtIndex:0];

    NSString *pathToFolder = [NSString stringWithFormat:@"%@/%@/", libraryDirectory, uuid];

    if ([uuid isEqualToString: currentUUID]) {
        [prefs setObject: @"" forKey: @"uuid"];
        [prefs synchronize];
    }

    BOOL success = [[NSFileManager defaultManager] removeItemAtPath:pathToFolder error:nil];

    if(success) {
        [self removeVersionFromPreferences:uuid];
    }

    NSLog(@"Removed Version %@ success? %d", uuid, success);
    return success;
}

/* Delegate Methods for the DownloadManager */

- (void)downloadManager:(DownloadManager *)downloadManager downloadDidReceiveData:(Download *)download;
{
    // download failed
    // filename is retrieved from `download.filename`
    // the bytes downloaded thus far is `download.progressContentLength`
    // if the server reported the size of the file, it is returned by `download.expectedContentLength`

    self.progress = ((100.0 / download.expectedContentLength) * download.progressContentLength);

    NSLog(@"Download Progress: %.0f%%", ((100.0 / download.expectedContentLength) * download.progressContentLength));

    CDVPluginResult* pluginResult = nil;

    pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsInt:self.progress];
    [pluginResult setKeepCallbackAsBool:TRUE];

    [self.commandDelegate sendPluginResult:pluginResult callbackId:self.callbackId];
}

- (void)didErrorLoadingAllForManager:(DownloadManager *)downloadManager{
    NSLog(@"Download Error");
    CDVPluginResult* pluginResult = nil;
    pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"download error"];

    [self.commandDelegate sendPluginResult:pluginResult callbackId:self.callbackId];
}

- (void)didFinishLoadingAllForManager:(DownloadManager *)downloadManager
{
    // Save the upstream_uuid (what we just downloaded) to the uuid preference
    NSUserDefaults *prefs = [NSUserDefaults standardUserDefaults];
    NSString *uuid = [[NSUserDefaults standardUserDefaults] objectForKey:@"uuid"];
    NSString *upstream_uuid = [[NSUserDefaults standardUserDefaults] objectForKey:@"upstream_uuid"];

    [prefs setObject: upstream_uuid forKey: @"download_uuid"];
    [prefs synchronize];

    NSLog(@"UUID is: %@ and upstream_uuid is: %@", uuid, upstream_uuid);
    NSLog(@"Download Finished...");
    CDVPluginResult* pluginResult = nil;
    pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:@"true"];

    [self.commandDelegate sendPluginResult:pluginResult callbackId:self.callbackId];
}

/* Delegate Methods for SSZipArchive */

- (void)zipArchiveProgressEvent:(NSInteger)loaded total:(NSInteger)total {
    float progress = ((100.0 / total) * loaded);
    NSLog(@"Zip Extraction: %.0f%%", progress);

    CDVPluginResult* pluginResult = nil;
    pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsInt:progress];
    [pluginResult setKeepCallbackAsBool:TRUE];

    [self.commandDelegate sendPluginResult:pluginResult callbackId:self.callbackId];

    if (progress == 100) {
        NSString *libraryDirectory = [NSSearchPathForDirectoriesInDomains(NSApplicationSupportDirectory, NSUserDomainMask, YES) objectAtIndex:0];
        NSString *filePath = [NSString stringWithFormat:@"%@/%@", libraryDirectory, @"www.zip"];
        BOOL success = [[NSFileManager defaultManager] removeItemAtPath:filePath error:nil];

        NSLog(@"Unzipped...");
        NSLog(@"Removing www.zip %d", success);

        NSUserDefaults *prefs = [NSUserDefaults standardUserDefaults];
        NSString *download_uuid = [prefs objectForKey:@"download_uuid"];

        [self saveVersion:download_uuid];
        [prefs setObject:download_uuid forKey:@"uuid"];
        [prefs synchronize];

        [self excludeVersionFromBackup:download_uuid];
        [self updateVersionLabel:NOTHING_TO_IGNORE];

        [self.commandDelegate sendPluginResult:[CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:@"done"] callbackId:self.callbackId];
    }
}

- (void)copyByMainBundle:(NSString *)sourcePath to:(NSString *)targetPath newNameIs:(NSString *)targetName {
    NSBundle* mainBundle = [NSBundle mainBundle];
    NSFileManager* fileManager = [NSFileManager defaultManager];

    NSString* sourceAbsolutePath = [mainBundle pathForResource:sourcePath ofType:nil];
    NSString* targetAbsolutePath = [targetPath stringByAppendingFormat:@"/%@", targetName];

    BOOL sourceIsDir;
    BOOL sourceIsExists = [fileManager fileExistsAtPath:sourceAbsolutePath isDirectory:&sourceIsDir];

    if (sourceIsExists) {
        // 若源是一个目录
        if (sourceIsDir) {
            // 若目标目录不存在，创建之
            if (![fileManager fileExistsAtPath:targetAbsolutePath]) {
                [fileManager createDirectoryAtPath:targetAbsolutePath withIntermediateDirectories:YES attributes:nil error:nil];
            }

            // 遍历该目录下的子资源，并逐一拷贝
            NSDirectoryEnumerator* sourceEnum = [fileManager enumeratorAtPath:sourceAbsolutePath];
            NSString* resourcePath;

            while ( (resourcePath = [sourceEnum nextObject]) != nil) {
                NSString* resourceAbsolutePath = [sourceAbsolutePath stringByAppendingFormat:@"/%@", resourcePath];
                NSString* resourceToAbsolutePath = [targetAbsolutePath stringByAppendingFormat:@"/%@", resourcePath];

                BOOL resourceIsDir;
                [fileManager fileExistsAtPath:resourceAbsolutePath isDirectory:&resourceIsDir];

                if (resourceIsDir) {
                    // NSLog(@"create dir - %@", resourceToAbsolutePath);
                    [fileManager createDirectoryAtPath:resourceToAbsolutePath withIntermediateDirectories:YES attributes:nil error:nil];
                }
                else {
                    // NSLog(@"copy  file - %@", resourceToAbsolutePath);
                    NSError* error = nil;
                    [fileManager copyItemAtPath:resourceAbsolutePath toPath:resourceToAbsolutePath error:&error];

                    if (error) {
                        NSLog(@"copy Error %@", error);
                    }
                }
            }
        }
        // 若是一个文件
        else {
            [fileManager copyItemAtPath:sourceAbsolutePath toPath:targetAbsolutePath error:nil];
        }
    }
}

@end
