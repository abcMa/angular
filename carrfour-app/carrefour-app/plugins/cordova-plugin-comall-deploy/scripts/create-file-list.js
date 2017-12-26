#!/usr/bin/env node

module.exports = function (context) {
    var path          = context.requireCordovaModule('path'),
        fs            = context.requireCordovaModule('fs'),
        projectRoot   = context.opts.projectRoot,

        assetsDirPath = path.join(projectRoot, "platforms", "android", "assets"),
        wwwDirName    = "www",
        indexFilePath = path.join(assetsDirPath, "www.fileindex.json"),

        fileIndex     = [],

        wwwDirStat    = undefined,
        indexFileStat = undefined;

    try {
        wwwDirStat = fs.statSync( path.join(assetsDirPath, wwwDirName) );
    }
    catch (e) { ; }

    if (!wwwDirStat || !wwwDirStat.isDirectory()) {
        return;
    }

    index(wwwDirName);

    function index(rootPathStr, subPathStr) {
        subPathStr = subPathStr || "";

        var absolutePathStr = path.join(assetsDirPath, rootPathStr, subPathStr),
            stat = fs.statSync( absolutePathStr );

        if (stat.isFile()) {
            // 若是在 windows 系统下，需要将路径分隔符转换成 *nix 风格的分割符，
            // 因为在 android 及 iOS 中，路径分隔符使用的是 *nix 风格。
            fileIndex.push(subPathStr.split(path.sep).join('/'));
        }
        else {
            var files = fs.readdirSync( absolutePathStr );
            for (var i = 0, l = files.length; i < l; i++) {
                index( rootPathStr, path.join(subPathStr, files[i]) );
            }
        }
    }

    fs.writeFileSync(indexFilePath, JSON.stringify(fileIndex));
};
