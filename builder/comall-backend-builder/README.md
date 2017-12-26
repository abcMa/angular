# 标准后台构建工具

本项目包含「标准后台重构」工作中的前端部分。
该项目旨在提供一种可配置化的方式使得能够基于客户需求快速开发后台产品，降低开发及维护成本。

## 安装

```
npm install git+ssh://git@gitlab.product.co-mall:10022/frontend/comall-backend-builder.git --save
```

## 使用

### 引入模块

```javascript
import { builder } from 'comall-backend-builder';
```

### 初始化配置信息

配置信息结构为 `{ apiRoot, entities, components, router }`，详见 wiki 。

配置中若使用了自定义的组件、类型或加载器，需在初始化配置信息前注册。

```javascript
builder.init(config);
```

### 渲染生成的系统

```javascript
ReactDOM.render(
    <builder.component />,
    document.getElementById('app')
);
```

### 注册自定义组件

```javascript
/**
 * @param {string} name 组件名称
 * @param {Component} component 组件类定义
 */
builder.registerComponent(name, component);
```

### 注册自实体

```javascript
/**
 * @param {string} name 实体名称
 * @param {object} desc 实体的描述信息
 */
builder.registerEntity(name, desc);
```

### 注册自定义类型

```javascript
/**
 * @param {string} name 类型名称
 * @param {Type} type 类型实例
 */
builder.registerType(name, type);
```

### 注册自定义加载器

```javascript
/**
 * @param {string} apiPath 加载器处理的 url，不包含 /loader/ 前缀
 * @param {object} loader 加载器定义
 */
builder.registerLoader(apiPath, loader);
```

### 获取和修改全局配置

```javascript
import { globalConfig } from 'comall-backend-builder';

globalConfig.set('api.key', 'YOUR_API_KEY');
globalConfig.set('api.token', 'YOUR_API_TOKEN');
let dateFormat = globalConfig.get('format.date');
```

## 开发

### 客户端

1. 在命令行中 `cd` 到项目根目录；
2. 执行 `npm install` 安装依赖库；
3. 执行 `npm start` 启动开发服务。

### 假数据服务

1. 在命令行中 `cd` 到 `server` 目录下；
2. 执行 `npm install` 安装依赖库；
3. 执行 `npm run serve` 启动开发服务。

假数据服务需要绑定到 `4000` 端口，请保证该端口没有被其它程序占用。

### 发布流程

1. 在 `dev` 分支合并完成所有版本发布内容。
2. 修改 `package.json` 中的版本信息。
3. 更新 `CHANGELOG.md` 中的记录。
4. 合并 `dev` 至 `master` 分支。
5. 在 `master` 分支下执行 `npm run release`，提交 `dist` 和 `lib` 目录下的更新内容。
6. 新建发布版本的 `tag`。