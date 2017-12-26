###
本构建操作为两步构建：

1. 第一步：以临时目录为目标目录，进行预编译，预处理等操作，生成最终的原始代码；
1. 第二步：以 dist 目录为目标目录，进行合并压缩等操作，生成最终的可发布代码。
###

# 依赖工具引入
# -----------------------------------------------------------------------------

p = require "./package.json"

fs = require "fs"
del = require "del"
sh = require "shelljs"
gulp = require "gulp"
gutil = require "gulp-util"
mkdirp = require "mkdirp"
program = require "commander"
moment = require "moment"

webserver = require "gulp-webserver"
debug = require "gulp-debug"
concat = require "gulp-concat"
uglify = require "gulp-uglify"
rev = require "gulp-rev"
revReplace = require "gulp-rev-replace"
RevAll = require "gulp-rev-all"
useref = require "gulp-useref"
gulpif = require "gulp-if"
insert = require "gulp-insert"
cheerio = require "gulp-cheerio"
gulpFilter = require "gulp-filter"
vinylPaths = require "vinyl-paths"
zip = require "gulp-zip"
sourcemaps = require "gulp-sourcemaps"

runSequence = require "run-sequence"

cyan = gutil.colors.cyan
magenta = gutil.colors.magenta

currentTime = moment().format('YYYYMMDD-HHmmss-SSS')

# 自动添加 angular 的依赖声明
ngAnnotate = do ->
    _ngAnnotate = require "gulp-ng-annotate"

    options = {
        add: true,
        remove: true,
        signle_quotes: true
    }

    -> _ngAnnotate options

# 自动添加 CSS3 的浏览器前缀
autoprefixer = do ->
    _autoprefixer = require "gulp-autoprefixer"

    options = {
        browsers: ["> 0.1%"]
    }

    -> _autoprefixer options

# 编译 SASS 文件
# @example
# sass("path/for/*.scss").pipe(...)
sass = do ->
    _sass = require "gulp-ruby-sass"

    options = {
        verbose: true, # 输出更多的异常信息
        lineNumbers: true, # 显示源文件文件及行号
        loadPath: ["./bower_components/"],
        style: "expanded",
        precision: 10,
        sourcemap: true
    }

    (path) -> _sass path, options

# 压缩 HTML 文件
minifyHtml = do ->
    _minifyHtml = require "gulp-minify-html"

    options = {
        empty: true,
        spare: true,
        quotes: true
    }

    -> _minifyHtml options

# 压缩 CSS 文件
minifyCss = do ->
    _minifyCss = require "gulp-minify-css"

    options = {
        keepSpecialComments: 0,
        advanced: false
    }

    -> _minifyCss options

# 将 angular.js 的 HTML 模板转换为 JS 文件
template2js = do ->
    _nghtml2js = require "gulp-ng-html2js"

    options = {
        moduleName: "app.templates"
    }

    -> _nghtml2js options

# 对象赋值
extend = (object, properties) ->
    for key, val of properties
        object[key] = val
    object

# 替换源文件内配置信息占位符
replaceConfig = (stream) ->
    _replace = require "gulp-replace"
    for key, val of buildConfig
        stream = stream.pipe _replace "<<< #{key} >>>", val
    stream

# 命令行参数
# -----------------------------------------------------------------------------

programVariable = (val, variables) ->
    variables.push(val)
    variables

program
    .option("-t, --target <mobile>|<wxshop>|<wap>", "构建的目标客户端", String, "mobile")
    .option("-p, --platform <ios>|<android>", "目标平台", String)
    .option("-e, --environment <test>|<testPublic>|<production>", "目标环境", String, "test")
    .option("-r, --remote ", "启动远程调试模式")
    .option("-m, --message <message>", "提交描述", String, "")
    .option("--username <username>", "若任务需要访问权限时需提供的用户名", String)
    .option("--password <password>", "若任务需要访问权限时需提供的密码", String)
    .option("--webserverpath <path>", "启动 webserver 时配置的根目录", String)
    .option("--plugin <pluginid>|<directory>|<giturl>", "添加指定的插件", String)
    .option("--variable <variable>", "插件初始化参数", programVariable, [])
    .parse(process.argv)

buildTarget = p.targets[program.target]
if program.target && !buildTarget
    throw gutil.colors.red "目标#{program.target}不存在"

buildEnvironment = if buildTarget.environments && program.environment then buildTarget.environments[program.environment] else null
if program.environment && !buildEnvironment
    throw gutil.colors.red "环境#{program.environment}不存在"

buildPlatform = if buildTarget.platforms && program.platform then buildTarget.platforms[program.platform] else null
if program.platform && !buildPlatform
    throw gutil.colors.red "平台#{program.platform}不存在"

buildConfig = {
    name: p.name,
    version: p.version
}
extend buildConfig, buildTarget.config
if buildEnvironment
    extend buildConfig, buildEnvironment.config
if buildPlatform
    extend buildConfig, buildPlatform.config
originalService = buildConfig.service
if program.remote
    gutil.log "reverse proxy - #{cyan(JSON.stringify(originalService))}"
    buildConfig.service = "/REVERSEMARK"
gutil.log "构建配置信息 - #{cyan(JSON.stringify(buildConfig))}"

# 目标客户端类型名称
# -----------------------------------------------------------------------------

# 是否参数中没有提供目标客户端，而使用默认的
_IS_USE_DEFAULT_CLIENT = !(process.argv.join("&").match(/&(--target|-t)/))

console.info "#{__dirname}/src/#{program.target}"
unless fs.existsSync "#{__dirname}/src/#{program.target}"
    throw new gutil.PluginError "-", "gulpfile 中没有 #{program.target} 客户端的相关配置"


# 构建任务
# -----------------------------------------------------------------------------

tasks = {

    # 主任务
    # -----------------------------------------------------------------------------

    default: -> gulp.run "package"

    # 初始化项目
    start: ->
        gutil.log "delete current", cyan("tmp"), "folder."
        del.sync "./.tmp"

        gutil.log "create a new #{cyan("tmp")} folder structure ..."
        gutil.log "  #{cyan("./.tmp")} - 临时目录"
        gutil.log "    |- #{cyan("./.tmp/factory/www")}       - cordova www 目录"

        mkdirp.sync "./.tmp"
        mkdirp.sync "./.tmp/factory"
        mkdirp.sync "./.tmp/factory/www"
        mkdirp.sync "./release"

    # 开启开发环境
    develop: ->
        runSequence(
            "clean.factory",
            "sass",
            "image",
            "fonts",
            "script",
            "html",
            "libs",
            "watch",
            "webserver"
        )

    # develop 任务别名
    dev: -> this.develop()

    # 在手机上运行 android 应用
    "run.android": ->
        runSequence(
            "clean.dist.www",
            "dist.copy.libs",
            "dist.copy.resources",
            "dist.useref",
            "dist.template",
            "dist.quote.template",
            "cordova.run.android"
        )

    # 打包
    package: ->
        if buildTarget.platforms
            gulp.run "package.application"
        else
            gulp.run "package.website"

    # 手机客户端打包相关子任务
    _packageApplicationTasks: [
        "clean.factory",
        "clean.dist",
        "sass",
        "image",
        "fonts",
        "script",
        "html",
        "libs",
        "hooks",
        "config.xml",
        "app.resources",
        "dist.copy.all.except.www",
        "dist.copy.libs",
        "dist.copy.resources",
        "dist.useref",
        "dist.template",
        "dist.quote.template",
        "dist.min.script",
        "dist.min.css",
        "dist.clean.libs",
        "dist.cordova.platform.install",
        "build-extras.gradle",
        "cordova.build.ios",
        "cordova.build.android"
    ]

    # 手机客户端打包操作
    "package.application": ->
        runSequence.apply null, tasks._packageApplicationTasks

    # 网站打包相关子任务
    _packageWebsiteTasks: [
        "clean.factory",
        "clean.dist",
        "image",
        "fonts",
        "script",
        "html",
        "libs",
        "sass",
        "dist.copy.libs",
        "dist.copy.resources",
        "dist.useref",
        "dist.template",
        "dist.quote.template",
        "dist.min.script",
        "dist.min.css",
        "dist.hash",
        "dist.clean.libs",
        "dist.promotion.www",
        "dist.addons"
    ]

    # 网站项目打包
    "package.website": ->
        runSequence.apply null, tasks._packageWebsiteTasks

    # 创建热部署压缩包
    "deploy": ->
        runSequence.apply null, [
            "clean.factory",
            "clean.dist",
            "image",
            "fonts",
            "script",
            "html",
            "libs",
            "sass",
            "dist.copy.libs",
            "dist.copy.resources",
            "dist.useref",
            "dist.template",
            "dist.quote.template",
            "dist.min.script",
            "dist.min.css",
            "dist.clean.libs",
            "dist.remove.libs",
            "dist.zip.www"
        ]

    # 发布项目
    release: ->
        if buildTarget.platforms
            runSequence.apply null, ["release.application"]
        else
            runSequence.apply null, tasks._packageWebsiteTasks.concat ["release.website"]

    # 发布目标至svn
    "release.website": ->
        unless sh.which "svn"
            gutil.log "没有检测到 svn 命令行程序"
            return

        repositoryUrl = buildConfig.svn
        repositoryFolderName = "#{program.target}-release-factory"
        repositoryFolderPath = ".tmp/#{repositoryFolderName}"

        # 若发布仓库已存在，则视为已拉取该仓库，则进行更新后直接推送发布内容
        # 但若不存在，则先创建临时目录，把将仓库拉取到该临时目录中再进行发布。
        sh.cd __dirname
        unless sh.test '-d', repositoryFolderPath
            # 创建临时目录
            unless sh.test "-d", ".tmp" then sh.mkdir ".tmp"
            sh.cd ".tmp"

            # 拉取 SVN 仓库
            gutil.log "拉取 SVN 仓库 - #{cyan(repositoryUrl)}"
            sh.exec "svn checkout #{repositoryUrl} #{repositoryFolderName}"
            sh.cd repositoryFolderName
        else
            # 更新 SVN 仓库
            gutil.log "更新 SVN 仓库"
            sh.cd repositoryFolderPath
            sh.exec "svn update"

        # 删除当前仓库中的所有内容
        gutil.log "删除仓库中的所有内容"
        del.sync ["#{__dirname}/#{repositoryFolderPath}/**/*", "!#{__dirname}/#{repositoryFolderPath}/.svn", "!#{__dirname}/#{repositoryFolderPath}/README.md"], { force: true }

        # 复制 www 中所有文件到仓库目录中
        # gutil.log "将当前最新的内容拷贝到仓库中"
        sh.cd __dirname
        sh.cp "-Rf", "./dist/*", repositoryFolderPath
        sh.cd repositoryFolderPath

        # 提交 SVN
        gutil.log "提交内容到 SVN 仓库"
        statusInfo = sh.exec("svn status", {silent:true}).output

        statusInfo.split(/[\n|\r\n]{1,}/g).forEach (info)->
            unless info then return

            status = info[0]
            path = info.substring(1).trim()

            if path.indexOf('@') > -1 then path += '@'

            switch status
                when 'M'
                    ;
                when '!', 'D'
                    console.info "delete #{path}"
                    sh.exec "svn delete #{path}"
                else
                    console.info "add #{path}"
                    sh.exec "svn add #{path}"

        sh.exec "svn commit -m \"release build - #{buildConfig.name}(#{program.target}) v#{buildConfig.version} - #{currentTime} - #{program.message}\""
        sh.cd __dirname

    # 生成应用安装包
    "release.application": ->
        releaseTasks = [].concat tasks._packageApplicationTasks
        releaseTasks.splice -2
        for name, platform of buildTarget.platforms when !program.platform || program.platform == name
            releaseTasks.push "cordova.build.#{name}.release"
        runSequence.apply null, releaseTasks

    # Android 平台多渠道打包相关子任务
    _channelsTasks: [
        "config.xml",
        "dist.copy.config",
        "cordova.build.android.release"
    ]

    # 按配置发布渠道生成所有 Android 安装包
    "channels": ->
        channelsTasks = ["clean.release"].concat tasks._packageApplicationTasks
        channelsTasks.splice -2
        for channel in p.releaseChannels
            channelsTasks.push 'channels.' + channel
            channelsTasks = channelsTasks.concat tasks._channelsTasks
        runSequence.apply null, channelsTasks

    # 清理子任务
    # -----------------------------------------------------------------------------

    # 清理 dist 目录
    "clean.dist": ->
        del.sync [ "./dist" ]

    # 清理 dist/www 目录
    "clean.dist.www": ->
        del.sync [ "./dist/www" ]

    # 清理临时目录中的工厂目录
    "clean.factory": ->
        del.sync [ "./.tmp/factory/*" ]

    # 清理 release 目录
    "clean.release": ->
        del.sync [ "./release/*" ]

    # dist 生成子任务，其源文件从工厂目录中获取
    # -----------------------------------------------------------------------------

    # 将所有内容拷贝到 dist 目录下
    "dist.copy.all": ->
        gulp.src "./.tmp/factory/**/*"
            .pipe gulp.dest "./dist"

    # 将 config.xml 拷贝到 ./dist 目录下
    "dist.copy.config": ->
        gulp.src "./.tmp/factory/config.xml"
            .pipe gulp.dest "./dist"

    # 将 www/resources 目录拷贝到 ./dist/www 目录下
    "dist.copy.resources": ->
        gulp.src "./.tmp/factory/www/resources/**/*", { base: "./.tmp/factory/www" }
            .pipe gulp.dest "./dist/www"

    # 将 www/libs 目录拷贝到 ./dist/www/ 目录下
    # 因为虽然第三方库中的 js 和 css 文件已经被合并到总文件中，
    # 但可能还有一些其它被引用的资源文件（比如 ionic 中的字体图片文件），
    # 因此保险起见，最好使用该任务将 libs 整个拷贝过去
    "dist.copy.libs": ->
        gulp.src "./.tmp/factory/www/libs/**/*", { base: "./.tmp/factory/www" }
            .pipe gulp.dest "./dist/www"

    # 拷贝除 www 目录之外的 cordova 相关的文件及目录
    "dist.copy.all.except.www": ->
        sh.cp '-rf', './.tmp/factory/*', './dist'
        sh.rm '-rf', './dist/www'

    # 合并 index.html 文件中引入的其它资源文件
    "dist.useref": ->
        assets = useref.assets()

        gulp.src "./.tmp/factory/www/index.html"
            .pipe assets
            .pipe assets.restore()
            .pipe useref()
            .pipe gulp.dest "./dist/www"

    # 合并模板文件
    "dist.template": ->
        gulp.src "./.tmp/factory/www/templates/**/*.html", { base: "./.tmp/factory/www" }
            .pipe minifyHtml()
            .pipe template2js()
            .pipe concat('templates.js')
            .pipe gulp.dest "./dist/www"

    # 在 index.html 文件中添加模板脚本文件的引用
    "dist.quote.template": ->
        gulp.src "./dist/www/index.html"
            .pipe cheerio {
                parserOptions: { decodeEntities: false }
                run: ($, file) ->
                    $('head').append '<script src="templates.js"></script>'
            }
            .pipe gulp.dest "./dist/www"

    # 压缩脚本
    "dist.min.script": ->
        gulp.src ["./dist/www/**/*.js", "!./dist/www/libs/**/*"], { base: "./dist/www" }
            .pipe uglify()
            .pipe gulp.dest "./dist/www"

    # 压缩 css
    "dist.min.css": ->
        gulp.src "./dist/www/resources/css/**/*.css", { base: "./dist/www" }
            .pipe minifyCss()
            .pipe gulp.dest "./dist/www"

    # 为所有静态资源文件的文件名添加 hash 码
    "dist.hash": ->
        revAll = new RevAll({
            dontRenameFile: ['.html'],
            dontSearchFile: ['.js']
        })

        gulp.src [
            "./dist/www/**"]
            .pipe revAll.revision()
            .pipe gulp.dest "./dist/www/.hash-tmp/"
            .on 'end', ->
                del.sync ["./dist/www/**", "!./dist/www", "!./dist/www/.hash-tmp"]

                sh.cd __dirname
                sh.mv "-f", "./dist/www/.hash-tmp/**", "./dist/www"
                sh.rm "-rf", "./dist/www/.hash-tmp"

    # 清理libs目录内的文件
    "dist.clean.libs": ->
        del.sync ["./dist/www/libs/**/*.js", "./dist/www/libs/**/*.css",
            "./dist/www/libs/**/*.scss", "./dist/www/libs/**/*.json",
            "./dist/www/libs/**/*.md", "./dist/www/libs/**/*.map"
            , "./dist/www/libs/**/*.gzip"]

    # 删除libs目录，避免因为空目录造成android热部署解压失败
    "dist.remove.libs": ->
        del.sync ["./dist/www/libs/"]

    # 将 www 目录中的内容拷贝到 dist 目录下，并移除 www 目录
    "dist.promotion.www": ->
        sh.cd __dirname
        sh.cp '-r', "./dist/www/**", "./dist"
        sh.rm '-rf', "./dist/www"

    # 将 addons 目录中的内容附加至 dist 目录
    "dist.addons": ->
        sh.cd __dirname
        sh.cp '-rf', "./addons/**", "./dist"

    "dist.zip.www": ->
        gulp.src 'dist/www/**/*'
            .pipe zip "deploy-v#{buildConfig.version}.zip"
            .pipe gulp.dest 'dist'


    # 普通子任务，用于将项目文件放到 .tmp 中，并对其进行一些预处理
    # -----------------------------------------------------------------------------


    # 将依赖的第三方库拷贝到 .tmp/facetoy/www/libs 目录下
    libs: ->
        # 拷贝 HTML 文件
        gulp.src "./bower_components/**/*", { base: "./bower_components" }
            .pipe gulp.dest "./.tmp/factory/www/libs"

    # 将被缓存的所有插件拷贝到 .tmp/factory/plugins 目录下
    plugins: ->
        sh.cp '-rf', './.tmp/pluginsCache/' + program.target + '/*', './.tmp/factory/plugins'

    # 将钩子文件拷贝到 .tmp/factory/hooks 目录下
    hooks: ->
        gulp.src ["./hooks/**/*", "./src/#{program.target}/hooks/**/*"]
            .pipe gulp.dest "./.tmp/factory/hooks"

    # 将所有 html 文件拷贝到 .tmp/factory/www 目录下
    html: ->
        # 拷贝 HTML 文件
        gulp.src ["./src/common/**/*.html", "./src/#{program.target}/**/*.html"]
            .pipe gulp.dest "./.tmp/factory/www"

    # 编译 sass 文件到 ./.tmp/factory/resources/css 目录下
    sass: ->
        # 先将所有 sass 文件汇总到一个临时目录
        sh.cd __dirname
        sh.rm "-rf", "./.tmp/sass-factory"
        sh.mkdir "-p", "./.tmp/sass-factory"

        if sh.test "-d", "./src/common/resources/sass"
            sh.cp "-rf", "./src/common/resources/sass/*", "./.tmp/sass-factory"

        if sh.test "-d", "./src/#{program.target}/resources/sass"
            sh.cp "-rf", "./src/#{program.target}/resources/sass/*", "./.tmp/sass-factory"

        # 再对汇总后的内容进行编译
        sass "./.tmp/sass-factory"
            .on "error", (err) ->
                console.error("Error", err.message)
            .pipe autoprefixer()
            .pipe sourcemaps.write()
            .pipe gulp.dest "./.tmp/factory/www/resources/css"
            .on 'end', -> sh.rm "-rf", './tmp/sass-facotry'

    # 处理图片，并将其放到 ./.tmp/factory/resources/images 目录下
    image: ->
        gulp.src ["./src/common/resources/images/**/*", "./src/#{program.target}/resources/images/**/*"]
            .pipe gulp.dest "./.tmp/factory/www/resources/images"

    # 处理图标字体，并将其放到 ./.tmp/factory/resources/fonts 目录下
    fonts: ->
        gulp.src ["./src/common/resources/fonts/**/*", "./src/#{program.target}/resources/fonts/**/*"]
            .pipe gulp.dest "./.tmp/factory/www/resources/fonts"

    # 处理所有脚本文件文件
    script: ->
        stream = gulp.src ["./src/common/**/*.js", "./src/#{program.target}/**/*.js"]
            .pipe ngAnnotate()
        replaceConfig stream
            .pipe gulp.dest "./.tmp/factory/www"

    # 如果目标客户端是 APP 应用，则需要额外拷贝 config.xml 配置文件
    "config.xml": ->
        replaceConfig gulp.src ["./src/#{program.target}/config.xml"]
            .pipe gulp.dest "./.tmp/factory"

    # 处理build-extras.gradle
    "build-extras.gradle": ->
        if !program.platform || program.platform == "android"
            replaceConfig gulp.src "./build-extras.gradle"
                .pipe gulp.dest "./dist/platforms/android"

    # 将应用相关的的静态文件拷贝到 ./.tmp/factory/resources/ 目录下
    "app.resources": ->
        gulp.src [
            "./src/#{program.target}/resources/ios/**/*",
            "./src/#{program.target}/resources/android/**/*"
            ], { base: "./src/#{program.target}/resources" }

            .pipe gulp.dest "./.tmp/factory/resources"

    # 开启一个开发用的 web 服务
    webserver: ->
        option = {
            host: "0.0.0.0",
            port: "8888",
            livereload: {
                enable: true
            },
            open: "/index.html"
        }
        if program.remote
            option.proxies = [{
                source: '/REVERSEMARK',
                target: originalService
                }]
        gulp.src program.webserverpath || "./.tmp/factory/www"
            .pipe webserver option

    # 观察 sass 文件的修改
    watch: ->
        # 通用监听
        # ---------------------------

        # 通用脚本
        gulp.watch "./src/common/**/*.js", ["script"]

        # 依赖库相关文件
        gulp.watch "./bower_components/**/*", ["libs"]

        # 通用 html
        gulp.watch "./src/common/**/*.html", ["html"]

        # 通用 样式
        gulp.watch "./src/common/resources/sass/**/*", ["sass"]

        # 通用 图片
        gulp.watch "./src/common/resources/images/**/*", ["image"]

        # 通用 图片
        gulp.watch "./src/common/resources/fonts/**/*", ["fonts"]

        # 客户端类型相关监听
        # ---------------------------

        # 客户端 html
        gulp.watch "./src/#{program.target}/**/*.html", ["html"]

        # 客户端 脚本
        gulp.watch "./src/#{program.target}/**/*.js", ["script"]

        # 客户端 样式
        gulp.watch "./src/#{program.target}/resources/sass/**/*", ["sass"]

        # 客户端 图片
        gulp.watch "./src/#{program.target}/resources/images/**/*", ["image"]

        # 客户端 图片
        gulp.watch "./src/#{program.target}/resources/fonts/**/*", ["fonts"]


    # cordova 相关子任务
    # -----------------------------------------------------------------------------

    # 安装 cordova 平台
    "dist.cordova.platform.install": ->
        sh.cd "./dist"

        # 使用 ionic 安装平台时，会往 package.json 中写入平台信息，当该文件不存在时，会抛出异常。
        fs.writeFileSync "package.json", "{}"

        # 当 hook 文件没有添加执行权限时，使用 cordova 运行 hook 文件会抛出异常，
        # 在使用 ionic 添加 platform 时，ionic 会实现为所有 hook 文件添加执行权限。
        # 但 ionic 会下载一些资源文件： https://github.com/driftyco/ionic-default-resources/archive/master.zip
        # 应该是因为墙的问题，该下载会特别慢，且容易下载失败，因此依然使用 cordova 来添加 platform，并在这里为所有 hook 文件添加执行权限
        if sh.test '-e', './hooks' then sh.chmod "-R", "+x", "./hooks"

        # 添加 package.json 文件中配置的 platform
        for name, platform of buildTarget.platforms when !program.platform || program.platform == name
            gutil.log "install cordova platform - #{name}@#{platform.cordovaVersion}"
            sh.exec "cordova platform add #{name}@#{platform.cordovaVersion}"

        sh.cd __dirname

    # 构建 iOS 包
    "cordova.build.ios": ->
        if !program.platform || program.platform == "ios"
            sh.cd "./dist"
            sh.exec "cordova build ios --buildConfig=../build.json"
            sh.cd __dirname

    # 构建安卓包
    "cordova.build.android": ->
        if !program.platform || program.platform == "android"
            sh.cd "./dist"
            sh.exec "cordova build android --buildConfig=../build.json"
            sh.cd __dirname

    # 运行 android 应用
    "cordova.run.android": ->
        sh.cd "./dist"
        sh.exec "cordova run android --buildConfig=../build.json"
        sh.cd __dirname

    # 构建安卓包
    "cordova.build.android.release": ->
        sh.cd "./dist"
        sh.exec "cordova build android --release --buildConfig=../build.json"
        sh.cd __dirname
        sh.mv "./dist/platforms/android/build/outputs/apk/android-release.apk",
        "./release/#{buildConfig.name}-#{buildConfig.version}-#{buildConfig.channel}_#{currentTime}.apk"


    # 构建iOS包
    "cordova.build.ios.release": ->
        sh.cd "./dist"
        sh.exec "cordova build ios --device --release --buildConfig=../build.json"
        sh.cd __dirname
        sh.mv "./dist/platforms/ios/build/device/" + buildConfig.name + ".ipa",
            "./release/#{buildConfig.name}-#{buildConfig.version}-#{buildConfig.channel}_#{currentTime}.ipa"
}

###
为 channels 任务添加渠道配置任务
###
for channel in p.releaseChannels
    tasks["channels." + channel] = do (channel) ->
        ->
            gutil.log "生成渠道" + channel + "安装包"
            buildConfig.channel = channel
            gutil.log "构建配置信息 - #{cyan(JSON.stringify(buildConfig))}"

###
将所有构建任务注册到 gulp 中
###

for name, fun of tasks
    gulp.task name, fun.bind(tasks) if name[0] != "_"
