# 家乐福移动端 APP

该项目预计将包含手机端及微信商城两个产品，目前只仅实现手机端 APP。


## 相关目录及文件说明

```
- /src  ------------------------  源代码目录
  |- /common  ------------------  全平台通用代码
  |  |- /directives ------------  angular 的 directives
  |  |- /tools  ----------------  通用的工具类 services
  |  |- /services  -------------  封装业务操作的 services
  |  |- init.js  ---------------  通用的初始化操作
  |  |- config.js  -------------  应用配置信息
  |  |- lang.*.js  -------------  国际化配置
  |  |- stateCode.js  ----------  状态码配置信息
  |  |- user.js  ---------------  用户信息
  |
  |- /mobile  ------------------  手机端相关代码
  |  |- /controllers  ----------  视图控制器
  |  |- /templates  ------------  模板
  |  |- /resources  ------------  静态资源文件
  |  |- config.xml  ------------  cordova 的配置文件
  |  |- index.html  ------------  主页面
  |  |- mobile-init.js  --------  客户端相关初始化操作
  |  |- states.js  -------------  路由配置
  |  |- modals.js  -------------  弹出层配置
  |  |- tabs.js  ---------------  tabs 配置
  |
  |- /wxshop  ------------------  微信商城相关代码
  |  |- /controllers  ----------  视图控制器
  |  |- /templates  ------------  模板
  |  |- /resources  ------------  静态资源文件
  |  |- config.xml  ------------  cordova 的配置文件
  |  |- index.html  ------------  主页面
  |  |- wxshop-init.js  --------  客户端相关初始化操作
  |  |- states.js  -------------  路由配置
  |  |- modals.js  -------------  弹出层配置
  |  |- tabs.js  ---------------  tabs 配置

- /.tmp  -----------------------  构建时创建的临时目录
- /dist  -----------------------  打包时创建的发布文件存放目录
- /addons ----------------------  发布web站点时的附加文件存放目录
```


## 常量

在 JS 中，会提供如下四个数据对象常量：

```
- APP_CONFIG  ------------------  应用程序相关配置
- APP_LANG  --------------------  国际化配置
- APP_STATE_CODE  --------------  一个状态码及对应状态名称的双向映射表
- APP_USER  --------------------  当前登录用户的相关信息
```

具体数据可去 common 目录下的对应文件中查看。


## angular 各模块命名规则

- directive: 添加 「cm」 前缀；
- controller: 添加 「Ctrl」 后缀；
- service: 用于封装业务操作的 service 需添加 「Service」 后缀；通用的工具类型的 service 不添加任何前缀或后缀，若 service 是一个类，则首字母大写；


## 开发说明

    若有条件，请翻墙后再进行以下操作，否则无法保证操作成功。

###  预装环境

- [node.js] (or [io.js])
- [ruby]：windows 系统请访问 [ruby 的 windows 版下载链接] 下载 `1.0` 以上，`2.0` 以下的最新版本
- [git]

当环境安装好之后，请执行如下两个命令安装相关程序：

    $ sudo gem install sass
    $ sudo npm install -g gulp cordova

<small>_注意：在 windows 下，请将每个命令前面的 sudo 去掉。_</small>

之后，请进入项目根目录，并在该目录下执行 `npm start` 命令以初始化项目（构建临时目录，安装项目内依赖等）。

## 开发

在项目根目录下运行 `gulp develop --target=wxshop`（或 `gulp dev --target=wxshop`）任务以开启开发环境。

`target` 参数的默认值为 `mobile`。

## 打包

在项目根目录下运行 `gulp package --target=wxshop` 任务以进行相关打包操作。

## 发布

微信商城应用需要使用命令 `gulp release --target=wxshop --username=your-svn-name` 发布到后台的 web 项目中。

后台 web 项目的 svn 地址在 `package.json` 文件中配置。

`username` 参数只在本地中第一次运行该命令时需要提供，当将 web 项目拉取到本地之后，就不需要再次提供了。

[node.js]: https://nodejs.org/ "node.js 官方网站"
[io.js]: https://iojs.org/zh/index.html "io.js 官方网站"
[ruby]: https://www.ruby-lang.org/zh_cn/ "ruby 官方网站"
[ruby 的 windows 版下载链接]: http://rubyinstaller.org/downloads/ "rubyInstaller 下载页面"
[git]: https://git-scm.com "git 官方网站"
