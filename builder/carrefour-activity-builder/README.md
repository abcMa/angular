# 家乐福APP活动页开发

## 1. 相关目录和文件
```
activity/
  |- .tmp/  -------------------  临时文件
  |- .node_modules/  ----------  npm包目录
  |- template/  ---------------  构建模板  
  |- libs/  ---------------      引入库文件
  |- resources/  --------------  活动页所需的图片等资源文件
  |  |- btn.png
  |  |- btn_disabled.png
  |  |- cancel.png
  |  |- line_1.png
  |  |- line_2.png
  |  |- line_3.png
  |  |- line_4.png
  |  |- line_5.png
  |- gulpfile.js  -------------  gulp配置文件
  │- README.md  ---------------  活动页开发说明
  │- index.html  --------------  活动页源文件
  │- index.css  ---------------  活动页源文件
  │- index.js  ----------------  活动页源文件
  |- config.js ----------------  开发环境配置文件
```

## 2. 注意事项

- APP环境下默认 `box-sizing: border-box;`
- 构建工具会将 `index.css` 中的 `px` 单位转换为 `rem`，基准为 `16px`(已停用)
- 文章页接口会给图片拼接服务器地址，测试环境下中可给 `img` 标签增加class同时使用绝对路径避免指向错误的图片服务器

```
// 这种情况是错误的
<img src="/asserts/foo.png"/>

// 需要写成绝对路径
<img class="" src="http://www.carrefour.com/asserts/foo.png"/>
```

- Dev开发环境中存在2016-5-11以前家乐福产品中的所有 `tools` , `service` , `directives` 和 `filters`。
- Dev开发环境中并未包含 `modals` 与 `states` 相关内容。
- 相关 `APP_CONFIG` 内容配置请查看 `config.js`

## 3. 开发流程

### 3.1. 安装Node.js和gulp构建工具

- 下载 [Node.js](https://nodejs.org/) 并安装
- 打开命令行运行命令 `node -v` ，确认 *Node.js* 安装成功并添加了环境变量。
- 运行命令 `npm config set registry http://registry.npm.taobao.org/` ，设置淘宝npm镜像。
- 若出现提示 **/xxx/xxx/npm** 目录不存在，请根据路径找到该位置，手动创建 **npm** 目录，然后再执行 `npm` 相关命令行操作。
- 运行命令 `npm install -g gulp` ，安装全局 *gulp* 构建工具。

### 3.2. 安装项目依赖模块

- 使用cmd命令行进入目录（同时按住Shift + 鼠标右键键点击项目根目录，菜单中选择在此处打开命令窗口）
- 运行命令 `npm install` ，根据 **package.json** 文件中的配置自动下载依赖模块。
- 如果模块安装出现报错并导致安装流程未完成，需要使用代理翻墙重新运行命令。

### 3.1. 执行gulp构建命令

- 在项目根目录执行 `gulp` 命令会使用 **gulpfile.js** 中的 *default* 任务进行构建。*default* 任务功能包含:
    - 清理 **./assets/** 目录中已有的构建结果。
    - 生成新的开发环境构建文件。
- 可使用 `CTRL + C` 结束运行中的任务。
- 常用gulp任务列表：

```
> gulp dev
  启动开发环境，在 default 任务的功能外，额外启动包含页面自动刷新功能的开发服务器，gulp-watch 监视代码变更自动构建。

> gulp export
  发布源码，在部署时使用，一般开发流程中不需要使用。
  生成的文件在./dist/中

> gulp clean
  清理assets,tmp,dist目录下的临时文件

```
