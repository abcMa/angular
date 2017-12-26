#!/usr/bin/env node

module.exports = function (self) {
    var path         = self.requireCordovaModule('path'),
        xcode        = self.requireCordovaModule('xcode'),
        fs           = self.requireCordovaModule('fs'),
        shell        = self.requireCordovaModule('shelljs'),
        projectRoot  = self.opts.projectRoot,
        ConfigParser = self.requireCordovaModule('cordova-lib/src/configparser/ConfigParser'),
        config       = new ConfigParser(path.join(self.opts.projectRoot, "config.xml"));
    // ios platform available?
    if (self.opts.cordova.platforms.indexOf("ios") === -1) {
        console.info("ios platform has not been added.");
        return ;
    }
    var targetPath    = config.name()+'.xcodeproj';
    var targetDir     = path.join(projectRoot, "platforms", "ios", targetPath),
        targetDir2    = path.join(projectRoot,'plugins','cordova-plugin-comall-jpush','src','ios'),
        targetDir3    = path.join(projectRoot, "platforms", "ios",config.name(),"Resources"),
        targetDir4    = path.join(projectRoot, 'platforms', 'ios','cordova'),
        targetFile    = path.join(targetDir, "project.pbxproj"),
        targetFile2   = path.join(targetDir2, "commonauth.entitlements"),
        targetFile3   = path.join(targetDir3, "commonauth.entitlements"),
        targetFile4   = path.join(targetDir4, 'build.xcconfig'),
        projectPath1  = path.join(projectRoot, "platforms", "ios", targetPath),
        projectPath2  = path.join(projectPath1, "project.pbxproj"),
        myProj        = xcode.project(projectPath2);
        console.log('--------------------'+targetFile);
    if (['after_plugin_add', 'after_plugin_install', 'after_platform_add'].indexOf(self.hook) === -1) {
        // remove it?
        try {
            fs.unlinkSync(targetFile);
        } catch (err) {}
    } else {
        // create directory
        shell.mkdir('-p', targetDir);
        shell.mkdir('-p', targetDir2);
        shell.mkdir('-p', targetDir3);
        shell.mkdir('-p', targetDir4);
        shell.mkdir('-p', projectPath1);
        shell.mkdir('-p', projectPath2);
        // sync the content

        if (fs.existsSync(targetFile3)) {

        } else {
            fs.writeFileSync(path.join(projectRoot, 'platforms', 'ios',config.name(), 'Resources','commonauth.entitlements'),fs.readFileSync(path.join(projectRoot,'plugins','cordova-plugin-comall-jpush','src','ios','commonauth.entitlements')),{flag:"w"});
        }

        myProj.parseSync()
        myProj.addResourceFile(path.join(projectRoot, 'platforms', 'ios',config.name(), 'Resources','commonauth.entitlements'));
        fs.writeFileSync(projectPath2, myProj.writeSync());
        console.log('new project written');

        fs.readFile(path.join(projectRoot, 'platforms', 'ios',targetPath, 'project.pbxproj'), {encoding: 'utf-8'}, function (err, data) {
            if (err) {
                throw err;
            }
            data = data.replace('isa = PBXProject;', 'isa = PBXProject;attributes = {LastUpgradeCheck = 510;TargetAttributes = {1D6058900D05DD3D006BFB54 = {SystemCapabilities = {com.apple.BackgroundModes = {enabled = 1;};com.apple.Push = {enabled = 1;};};};};};');
            fs.writeFileSync(targetFile, data);
        });
        fs.readFile(path.join(projectRoot, 'platforms', 'ios','cordova', 'build.xcconfig'), {encoding: 'utf-8'}, function (err, data) {
            if (err) {
                throw err;
            }
            data = data.replace('Entitlements-$(CONFIGURATION).plist', 'Resources/commonauth.entitlements');
            fs.writeFileSync(targetFile4, data);
        });
    }
};
