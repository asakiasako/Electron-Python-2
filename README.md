<!-- content -->
- [综述](#综述)
- [项目运行指南](#项目运行指南)
- [环境变量和模式](#环境变量和模式)
- [编码规范](#编码规范)
  - [Vue 单文件组件](#Vue-单文件组件)
    - [组件名称](#组件名称)
    - [组件存放位置](#组件存放位置)
    - [组件间的数据传递](#组件间的数据传递)
    - [使用插件为应用增加特性](#使用插件为应用增加特性)
    - [使用 `element-ui`](#使用-element-ui)
    - [使用 `vm.$bus` 进行通信](#使用-vm.$bus-进行通信)
    - [使用 `vm.$electron`](#使用-vm.$electron`)
    - [CSS 相关](#CSS-相关)
    - [统一的标签顺序](#统一的标签顺序)
    - <a target="_blank" href="https://cn.vuejs.org/v2/style-guide/">More: 参考官方风格指南</a>
  - [vue-router](#vue-router)
  - [vuex](#vuex)
  - [自定义 js 模块](#自定义-js-模块)
  - [alias](#alias)
  - [静态资源](#静态资源)
  - [工程目录结构](#工程目录结构)
- [基本逻辑架构](#基本逻辑架构)
  - [RPC Server](#RPC-Server)
  - [API 调用规范](#API-调用规范)
  - [RPC Client](#RPC-Client)
- [项目的开发环境](#项目的开发环境)
  - [NodeJS](#NodeJS)
  - [python](#python)
- [项目配置项](#项目配置项)
- [常见问题](#常见问题)
  - [这个项目是为了解决什么问题?](#这个项目是为了解决什么问题?)
  - [这个项目的意义在哪里?](#这个项目的意义在哪里?)
  - [适用场景与优缺点](#适用场景与优缺点)
  - [为什么不用 C++/C#? 为什么不使用纯 js 实现?](#为什么不用-C++/C#?-为什么不使用纯-js-实现?)

# 综述

这个项目是一个**开箱即用**的最小示例/模板，使用 Web 技术作为 python 的 UI 层，来构建完整的桌面应用。

进一步了解请参考: [基本逻辑架构](#基本逻辑架构) | [常见问题](#常见问题)

# 项目运行指南

- 项目安装：`yarn install`

  这个命令会对项目进行一些预配置，然后安装所有的 python 和 node.js 依赖。

  为了这个命令能够顺利运行，你需要先安装 python 的 poetry 包管理器，以及对环境进行一些预配置。

- 运行：
  - 在 development 环境下运行项目：`yarn electron:serve`
  - 打包为可安装文件：`yarn electron:build`
  - 检查并修复源码：`yarn lint`

# 环境变量和模式

- 你可以在项目根目录中建立下列文件来指定环境变量：

  ``` sh
  .env                # 在所有的环境中被载入
  .env.local          # 在所有的环境中被载入，但会被 git 忽略
  .env.[mode]         # 只在指定的模式中被载入
  .env.[mode].local   # 只在指定的模式中被载入，但会被 git 忽略
  ```

- 一个环境文件只包含环境变量的键值对：

  ```
  FOO=bar
  VUE_APP_SECRET=secret
  ```

- 模式:

  你可以为 `.env` 文件增加后缀 `[mode]` 来设置某个模式下特有的环境变量。为特定模式准备的环境文件拥有比一般的环境文件更高的优先级。模式的名称与 `NODE_ENV` 环境变量是一致的。

# 编码规范

## Vue 单文件组件

### 组件名称

  在 `<script>` 中，一律使用 PascalCase。在 `<template>` 中，一律使用 kebab-case。

  组件的 name 属性不可省略，且应与 `.vue` 文件名一致。

  引入 `*.vue` 文件时，一律不省略 `.vue` 后缀名。

  ``` html
  <template>
    <!-- 在 template 中一律使用 kebab-case -->
    <my-component />
  </template>

  <script>
    import MyComponent from '@/components/MyComponent.vue'
    export default {
      name: 'ComponentName',  //使用 PascalCase，不可省略。
      components: {
        MyComponent
      }
    }
  </script>
  ```

### 组件存放位置

  - 作为视图存在的 `.vue` 组件应存放在 `/src/views/` 文件夹下，且目录结构与 router 结构相对应。
  - 作为可复用组件的 `.vue` 组件应存放在 `/src/views/` 文件夹下。

### 组件间的数据传递

  - 父组件 -> 子组件：使用 propsC
  - 子组件 -> 父组件：自定义事件
  - 父组件 <-> 子组件： v-model 或 .sync
  - 非父子组件：使用 vm.$bus 或 vuex
  - 紧密耦合的祖孙间传递也可以考虑用父组件作为中间运输层
  - 紧密耦合的兄弟间传递也可以考虑用父组件作为中转运输层

### 使用插件为应用增加特性

使用插件为应用增加全局特性，使得这些特性能方便的在多个不同应用中使用，且富有弹性：能够方便的增加、移除某些特性，而不用担心对其它部分造成影响。

自己编写的插件存放在 `/src/plugins` 文件夹的子目录中。`/src/plugins/index.js` 负责所有插件的加载，包括你安装在 `node-modules` 中的插件和 `plugins` 文件夹中你自己编写的插件。

关于插件的内容请参考：[Creating Custom Vue.js Plugins](https://alligator.io/vuejs/creating-custom-plugins/)

### 使用 `element-ui`

已通过全局引用，引入了 `element-ui`，可以直接在 `.vue` 组件中使用。

### 使用 `vm.$bus` 进行通信

`vm.$bus` 是通过 `/src/plugins/event-bus` 插件挂载到每个 `Vue` 实例上的属性。非父子组件可以以之作为桥梁进行通信。

``` js
vmA.$bus.$emit('event-name')
vmB.$bus.$on('event-name', () => {...})
```

### 使用 `vm.$electron`

`vm.$electron` 是通过 `vue-electron` 插件引入的属性，它指向 `electron` 包。这样你就不用在每个 `Vue` 组件里都引入这个包了。

### CSS 相关

- 使用 scss 预处理器

  - 可以在 style 标签内直接使用 scss 语法，只需通过 lang 属性指定：

    ``` scss
    <style lang="scss">
      $color: red;
    </style>
    ```

  - 全局变量：`/src/styles/global-variables.scss` 中的变量会自动加载到所有 vue 组件中，因而你可以将它们当作全局变量使用。你也可以将新的 scss 变量引入这个文件当中。

- 使用 CSS Modules 使样式具有局部的作用域，避免了全局样式的污染，简化了 CSS 选择器的复杂程度。

  - 你可以通过 `<style module\>` 以开箱即用的方式在 `*.vue` 文件中使用 <a target="_blank" href="https://vue-loader.vuejs.org/zh/guide/css-modules.html">CSS Modules</a>。所有支持的预处理器都不受影响。

    ``` scss
    <style module>
      .red {
        color: red;
      }
      .bold {
        font-weight: bold;
      }
    </style>
    ```

  - 通过 `$style` 变量来访问该 CSS Module 对象：

    ``` scss
    <template>
      <p :class="$style.red">
        This should be red
      </p>
    </template>
    ```

  - 从文件中引入 CSS Modules：

    ```
    import styles from './foo.module.css'
    // 所有支持的预处理器都一样工作
    import sassStyles from './foo.module.scss'
    ```

  - 更多信息请参考: <a target="_blank" href="https://vue-loader.vuejs.org/zh/guide/css-modules.html">CSS Modules</a>

- 改变 Element-UI 的样式

  项目集成了 Element-UI 组件库。通过改写 `/src/styles/element-variables.scss` 中的变量，你就可以对 Element-UI 的样式进行修改。

  详情请参考 [在项目中改变 SCSS 变量](https://element.eleme.cn/#/zh-CN/component/custom-theme#zai-xiang-mu-zhong-gai-bian-scss-bian-liang)。

### 统一的标签顺序

  - 从上至下分别为：
  
    ``` html
    <template>
      ...
    </template>

    <script>
      ...
    </script>

    <style>
      ...
    </style>
    ```

### <a target="_blank" href="https://cn.vuejs.org/v2/style-guide/">More: 参考官方风格指南</a>

## vue-router

- URL 命名规范：path 对应视图变化 (使用 kebab-case 命名法)，query 对应数据变化，hash 对应滚动条位置

  `如：/project-list?type=1&search=keyword#position`

- 路由的 name 值 (命名路由) 使用驼峰命名法

- 视图跳转尽量使用声明式

  ```html
  <router-link :to="path | { path, ... }">使用声明式</router-link>

  <!-- 不推荐的做法 -->
  <a @click="$router.push(...)">使用命令式</a>
  ```

- 当组件依赖 \$route 时 (特别是 \$route.params)，使用<a target="_blank" href="https://router.vuejs.org/zh/guide/essentials/passing-props.html">路由组件传参</a>，与 \$route 解耦

## vuex

- 需要由 vuex 管理的数据

  - 组件间共享的响应式数据
  - 非父子组件之间的数据传递

- getter、mutation、action、module 的命名使用 camelCase
- module 应避免嵌套，尽量扁平化
- module 应启用命名空间：`namespaced: true`

## 自定义 js 模块

- 避免重复造轮子，尽量使用成熟的现成工具/类库/组件，如：lodash、qs、url-parse 等
- 模块设计原则：
  - 高内聚，低耦合，可扩展
  - 永远不要去改变模块输入的数据，如：函数参数、组件 prop
- 接口设计
  - 参数类型与个数要保持稳定
  - 参数原则上不要超过3个，且预留一个 options 对象，以提高扩展性
  ```js
  export function myMethod1(a, options) {} // 当必选参数只有一个时
  export function myMethod2(a, b, options) {} // 当必选参数只有两个时
  export function myMethod3(options) {} // 当必选参数有两个以上时
  export function myMethod4(options) {} // 当所有参数都是可选时
  ```

## alias

  在 `js` 和 `.vue` 文件中，可以使用 `@` 作为路径的别名，该别名等同于 `/src/`。

  ``` js
  import Home from '@/views/Home.vue'
  ```

## 静态资源

放置在 public 目录下的资源会直接被拷贝，而不会经过 webpack 的处理。

在 main 进程和 renderer 进程中，你都可以通过 `__static` 这个全局变量来指向 public 文件夹，不论是 develope 环境还是 procuction 环境下。

## 工程目录结构

```
|-- README.md
|-- .env[.<mode>][.local] ------- 环境变量，可以通过多个环境文件来为不同模式进行特有的配置
|-- .scripts -------------------- 项目的脚本，用于在执行任务（如 install）时对项目进行一些配置
|-- .vscode --------------------- VSCode 配置
|-- .npmrc ---------------------- npm 配置，有一些用于原生模块编译的参数
|-- vue.config.js --------------- vue-cli 项目的配置文件
|-- dist-electron --------------- 项目编译后的输出文件夹
|-- build ----------------------- 一些用于编译的资源文件，例如 icon.ico
|-- public
|   |-- index.html
|-- py-api ---------------------- python 部分的源码
|-- src
    |-- main.js ----------------- renderer 进程的入口
    |-- background.js ----------- main 进程的入口，也是整个 electron 程序的入口
    |-- App.vue
    |-- bg ---------------------- background.js 引用的功能模块，例如菜单，快捷键等
    |-- plugins ----------------- renderer 进程用于实现某一功能的模块
    |-- assets
    |-- styles
    |-- utils ------------------- 通用工具，包括一些常量和函数等
    |-- router
    |-- store
    |-- components -------------- 存放可复用的组件
    |-- views ------------------- 视图组件，文件结构与路由相对应
```

# 基本逻辑架构

  使用 zerorpc 为消息层在 electron render process 和 python 之间进行通信。在程序开始运行时，electron main process 使用子进程来启动 python RPC server。python RPC server 会暴露一系列的 API。Electron renderer process 通过 rpc Client 访问这些 API。

  原则：视图层和逻辑层分离。视图层 (electron renderer) 只应处理用户界面的逻辑，而实际的功能逻辑则通过调用 python API 来实现。

  视图层使用 Vue 来进行渲染，关于该技术的细节请参考官方文档。

  ## RPC Server

  python 层的作用是通过 RPC Server 暴露一系列的 API，你的其它代码都是为这些 API 服务的。API 的入口文件为 `/py-api/apis/main.py`。顶层 API 路由被放置在 `/py-api/apis/routes.py` 中，它的结构如下：

  ``` python
  API_ROUTES = {
    'method': None,
    'children': {
      'example': {
        'method': example,
        'chindren': {
          'child1': {
            'method': child1
          }
        }
      }
    }
  }
  ```

  这个 API 路由可以无限嵌套子路由。调用 API 时，实际上是调用 API route 所对应的 method。对于每一个路由节点，'method' 和 'children' 都可以省略。如果调用的 API route 在 API_ROUTES 中不存在，或者某个节点没有注册 method 或注册为 None，调用该 API 将会报错。

  你可以参考示例代码，将 API 分别放在不同的 module 中。

  ## API 调用规范
  
  - Route 命名规范：使用 `:` 分隔，`:` 代表顶层路由。注意，最前面的一个 `:` 不可省略。如: `:example`，`:example:child1` 分别对应上文中的 `example`，`child1` 节点。

  - 调用规范：API 调用传递一个 mapping 对象作为参数:

    ``` js
    // options
    {
      route: ':example',
      args: [arg1, arg2],
      kwargs: {
        kw1: val1,
        kw2: val2
      }
    }
    ```

    除了 route 以外，其它参数都是可选的。`args` 和 `kwargs` 会分别作为位置参数和关键字参数传递给 API 对应的方法。

  ## RPC Client

  - 在 Vue 组件中可以直接通过 `vm.rpcClient.request()` 调用:

    ``` js
    // vm 为 Vue 实例
    vm.rpcClient.request(options).then(res => {
      // manage result
    }).catch(err => {
      // manage errors
    })
    ```
  
  - 在普通 js 文件中，可以手动引入 rpcClient:

    ``` js
    import {rpcClient} from '@/plugins/rpc-client'

    rpcClient.request(options).then(res => {
      // manage result
    }).catch(err => {
      // manage errors
    })
    ```

  - options 参数为符合上述 API 调用规范的一个 mapping 对象。

# 项目的开发环境

## NodeJS

- 安装 Node.js
- 安装 Yarn：我们使用 [Yarn](https://www.yarnpkg.com/lang/en/) 作为 node 的包管理器
- 配置 node-gyp 的运行环境
  
  node-gyp 用于编译一些原生的 node 模块。请参考 [官方文档](https://github.com/nodejs/node-gyp#on-windows) 进行配置。
  
  注意：安装 Visual Studio Build Tools 时，除了默认勾选的安装项，还要勾选 Build Tools for V140，否则在编译原生模块时，会提示缺少此内容。

## python

- 安装 python 3.7.4 或更高版本，并添加 path 环境变量，使之成为默认版本。
- 安装 pipenv：我们使用 pipenv 作为 python 的包管理器。
    
  ```
  pip install pipenv
  ```

- 安装 python 2.7，它被 node-gyp 用来编译 NodeJS 原生模块，与你的代码使用的 python 版本没有关系。

# 项目配置项

- `/.npmrc`
  
  该文件为 npm 相关的配置文件，在使用 yarn install 命令或安装 NodeJS 模块时，将会从该文件中读取配置。

  ```
  <!-- npm -->
  registry ------------ npm 仓库地址
  electron_mirror ----- 用于下载 electron 所需的一些文件
  python -------------- python 2.7 可执行文件的路径，用于 node-gyp 对原生项目进行编译。注意，它与你项目中所用到的 python 版本无关，且只能使用 python 2.7。python 3 是不被 node-gyp 支持的。
  msvs_version -------- 用于编译 node_gyp 的 Visual Studio 版本。

  <!-- electron 相关 -->
  target -------------- electron 的版本号
  arch ---------------- electron 的架构(ia32 或 x64)
  target_arch --------- electron 的架构(ia32 或 x64)
  disturl ------------- electron 官方提供，请勿修改。
  runtime=electron
  build_from_source=true

  <!-- node-gyp -->
  node_gyp ------------ node-gyp 的地址。你不用修改此项，在 install 的时候，会自动在你的项目内安装 node-gyp，并修改此配置为指向该 node-gyp 包的绝对地址。
  ```

- `/vue.config.js`
  
  项目的配置文件。请参考：https://cli.vuejs.org/config/#global-cli-config

  请注意：在修改某项配置前，确保你知道它。

- `/py-api/pipfile`

  ```
  [[source]]
  url: pypi 库的地址

  [requires]
  python_version: 你想使用的 python 版本号，可指定 1 位、2 位或者 3 位。如需指定 arch，在后面加上 `-32` 或 `-64`。否则它将使用你默认的版本架构。
  ```

# 常见问题

## 这个项目是为了解决什么问题?

  这个项目是一个开箱即用的示例/模板，将 electron、vue 和 python 这三者结合起来，从而实现使用 Web 技术为 python 提供 GUI 界面的目的。

## 这个项目的意义在哪里?

  在很多应用场合，特别是工程和科研领域，python 有着无与伦比的开发效率。这不仅得益于 python 相对简洁且灵活的语法，更得益于其丰富的生态系统，很多功能往往通过一个 python 包便能实现。

  但令人遗憾的是，python 至今没有一套官方的、成熟的、易用的 GUI 方案（很可能是个人观点），因而在开发 GUI 方面显得低效。

  而 Web 技术则正好弥补了这一短板。Web 技术就是为了 UI 而生，因此具有较高的开发效率，丰富的生态，成熟的工具和工作流，同时能很方便的实现各种视觉效果，更加富有表现力。

  当然，web 技术是否好用，也是因人而异的。如果你并不熟悉 web 技术，你可能觉得直接用 PyQt, wxPython 比多学一门技术要容易的多。

## 适用场景与优缺点

- 优点：
  - 开发效率高
  - UI 灵活度高，表现力强
  - 在逻辑层面（python）和试图层面（web）都有丰富的生态和成熟的工具
  - 跨平台

- 缺点：
  - 应用体积偏大（主要是 electron 相关依赖体积太大）
  - 运行效率低，资源占用大

- 适用场景：
  适用于开发效率优先于运行效率的场景。例如在工程研发领域，需求都是快速迭代的，我们需要的是快速实现其功能，而对软件的运行效率没有太高的要求。这类软件通常不消耗太多的资源，在 PC 平台下，这些资源占用是可以忽略的。毕竟，任何一个工程师一天的工资都比一条 8G 内存条来的贵。

  相反，这种实现并不适用于面向普通用户的消费级的应用。消费级的应用应该更关注运行效率。

## 为什么不用 C++/C#? 为什么不使用纯 js 实现?

相对于 C++/C#，python 的开发效率要高许多。而且它在不同领域都有丰富的生态。

例如针对于自动化控制符合 VISA 接口的仪器这一需求，python 具有成熟的、稳定更新的包，而 js 的相关模块却并不完善，而且许久没有更新了。

python 针对大多数需求基本上都能找到成熟的解决方案，而 js 的生态大多数还是集中在前端领域的。

换句话说，是不是非得用 python？这个问题是根据你的需求来决定的。