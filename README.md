# vue-kbone

使用 vue 多端开发(小程序和Web)，基于 [kbone](https://github.com/wechat-miniprogram/kbone) 的 element 和 render。

## 特性

* 一键接入，立即使用
* 支持更完整的 vue 语法及特性
* webpack、es6、babel、hot reload、cli、vue-router、vuex，你想要的都有

## 开发
cnpm install

* Web 端：直接浏览器访问 localhost:8080/ 即可看到效果。

```
npm run web
```

* 小程序端：使用开发者工具打开 dist/mp 目录即可。

```
npm run mp
```

## 构建

* Web 端：构建完成会生成 dist/web 目录

```
npm run build
```

* 小程序端：构建完成会生成 dist/mp 目录

```
npm run build:mp
```

## 小程序端打开

需要先进入 dist/mp 目录执行 `npm install` 安装相关的依赖包，然后用开发者工具打开 dist/mp 目录后再进行 npm 构建（关于 npm 构建可[点此查看官方文档](https://developers.weixin.qq.com/miniprogram/dev/devtools/npm.html)）。

## 目录说明

此模板 Web 端使用单入口，通过 vue-router + 动态 import 的方式来运行；小程序端则按照业务分拆成多个页面，同属一个业务的页面则通过 vue-router 来组织。

```
├─ build
│  ├─ miniprogram.config.js  // mp-webpack-plugin 配置
│  ├─ webpack.base.config.js // Web 端构建基础配置
│  ├─ webpack.dev.config.js  // Web 端构建开发环境配置
│  ├─ webpack.mp.config.js   // 小程序端构建配置
│  └─ webpack.prod.config.js // Web 端构建生产环境配置
├─ dist
│  ├─ mp                     // 小程序端目标代码目录，使用微信开发者工具打开，用于生产环境
│  └─ web                    // web 端编译出的文件，用于生产环境
├─ src
│  ├─ config                 // 配置目录
│  │  ├─ entry.mp.js         // 小程序端 入口页面配置
│  │  └─ settings.js         // 系统配置信息
│  ├─ components             // 通用组件目录
│  ├─ pages                  // 页面目录
│  │  ├─ home                // home页面（页面名称作为目录）
│  │  │  ├─ Index.vue        // 页面内容
│  │  │  ├─ main.mp.js       // 小程序端 页面入口文件
│  │  │  └─ web.js           // web端 业务js
│  │  └─ other               // 其他页面 
│  ├─ router                 // vue-router 路由定义
│  ├─ store                  // vuex 相关目录
│  ├─ app.mp.css             // 小程序端 入口主样式
│  ├─ app.mp.js              // 小程序端 主入口
│  ├─ App.vue                // Web 端入口主视图
│  └─ main.js                // Web 端入口文件
└─ index.html                // Web 端入口模板
```

## 其他说明

如果要使用 ts，则在 vue 的 script 标签上加上 `lang="ts"`，具体可参考 src/list/Index.vue。如果要使用 reduce-loader，就不能使用 ts，因为 ts 目前没有支持内联 loader。

## License

MIT 
