# 综述

这个项目是一个**开箱即用**的最小示例/模板，使用 Web 技术作为 python 的 UI 层，来构建完整的桌面应用。

该项目基于 windows7/10 和 ia32 架构构建，如果环境有所差别，很可能导致无法开箱即用。

由于该项目为个人项目，因此不承诺提供任何支持。但会对使用中的常见问题进行记录，以供参考。

更详细的内容可能需要你自己阅读源码了。

进一步了解请参考: [基本逻辑架构](#基本逻辑架构) | [常见问题](#常见问题)

# 项目的开发环境

在使用这个项目之前，你需要为项目提供必要的开发环境。

## NodeJS

- 安装 Node.js
- 安装 Yarn：我们使用 [Yarn](https://www.yarnpkg.com/lang/en/) 作为 node 的包管理器，以代替默认的 npm。
- 配置 node-gyp 的运行环境
  
  node-gyp 用于编译原生的 node 模块。请参考 [官方文档](https://github.com/nodejs/node-gyp#on-windows) 进行配置。
  
  注意：安装 Visual Studio Build Tools 时，除了默认勾选的安装项，还要勾选 Build Tools for V140，否则在编译原生模块时，会提示缺少此内容。

- 安装 python 2.7，它被 node-gyp 用来编译 NodeJS 原生模块，且是必须的。这与你的代码使用的 python 版本没有关系。

  你需要在 .npmrc 中指定 python 2.7 的路径。可以参考：[项目配置项](#项目配置项)

## python

- 安装 python 3.8 或更高版本，并将其添加到 path 环境变量。在你初始化项目时，它应该是你的 `python` 命令所指向的版本。
- 安装 poetry。我们使用 poetry 作为 python 子项目的管理器。

  windows powershell install instructions

  ```
  (Invoke-WebRequest -Uri https://raw.githubusercontent.com/python-poetry/poetry/master/get-poetry.py -UseBasicParsing).Content | python
  ```

  不建议使用 pip 安装 poetry，详情请参考：https://python-poetry.org/docs/#installation

# 项目配置项

- `/.npmrc`
  
  该文件为 npm 的配置文件，在使用 yarn install 命令或安装 NodeJS 模块时，将会从该文件中读取配置。

  ```
  <!-- npm -->
  registry ------------ npm 仓库地址
  electron_mirror ----- electron 相关文件
  python -------------- python 2.7 可执行文件的路径，用于 node-gyp 对原生项目进行编译。注意，它与你项目中所用到的 python 版本无关，且只能使用 python 2.7。详情请参考 node-gyp 的文档。
  msvs_version -------- 用于编译 node_gyp 的 Visual Studio 版本。默认为 2017。请根据实际情况进行选择。

  <!-- electron 相关 -->
  target -------------- electron 的版本号
  arch ---------------- electron 的架构(ia32 或 x64)
  target_arch --------- electron 的架构(ia32 或 x64)
  disturl ------------- electron 官方提供，请勿修改。
  runtime=electron
  build_from_source=true

  <!-- node-gyp -->
  node_gyp ------------ node-gyp 的地址。你不用修改此项，在 install 的时候，会自动在你的项目内安装 node-gyp，并修改此配置为指向该 node-gyp 包的绝对地址。这样做是为了避免 node-gyp 部分版本所存在的 bug。
  ```

- `/vue.config.js`
  
  项目的配置文件。请参考：https://cli.vuejs.org/config/#global-cli-config

- `/py-code`

  配置文件在根目录下，请参考 Poetry 官方文档。

  __scripts.py 是 pyproject.toml 中的 scripts 来源。

# 项目运行指南

当你安装好上述安装环境后，只需要使用预先设置好的命令，就可以完成整个项目 —— 包括 Node.js 和 python 两部分 —— 的初始化及编译。

- 项目安装：`yarn install`

  这个命令会对项目进行一些预配置，然后安装所有的 python 和 node.js 依赖。

  如果在 `yarn install` 时出现错误，可以参考：[在 yarn install 时可能出现的常见错误](#在 yarn install 时可能出现的常见错误)

- 在 develope 环境下运行：`yarn electron:serve`

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

# RPC 通信

  RPC 通信是这个项目最核心的部分，它是连接 python 和 Node.js 的桥梁。

  在这个项目中，python 作为 RPC Server，用于业务逻辑的实现。Electron 是整个应用的外部框架。在应用启动时，Electron Main Process 会以子程序的方式启动 python RPC Server。Electron Renderer Process 负责 UI 界面的渲染，通过其实现的 RPC Client 向 RPC Server 发送请求并获取反馈。

  整个项目应遵循视图层与业务逻辑层分离的原则，即 Node.js 部分只负责 UI 界面的渲染和逻辑——例如对数据格式的处理转换等。具体的业务逻辑应由 RPC Server 来实现。

  在 Electron Renderer Process 中，我们使用 Vue.js 来构建 UI，同时引入 element-ui 作为 UI 组件库。与 UI 相关的内容将在后面阐述，这一节将主要讨论与 RPC 通信相关的问题。

  关于 Electron、Vue、Element-UI 等技术栈的描述，请参阅其官方文档，本文将不作赘述。

  RPC 通信主要由 3 部分组成——RPC 接口规范，如何在 RPC Server 中定义接口，以及如何通过 RPC Client 调用接口。

  ## RPC 接口规范

  RPC 接口由 3 部分组成：Route，args，kwargs。

  Route 为接口的路由，用于指向接口对应的目标函数。它是一个由冒号 ":" 分隔的字符串。":" 为顶层路由 (root)。每一层路由可以有无限多的子路由。例如：

  ``` python
  ':instr:list'   # root -> instr -> list
  ':trx:dac:get'  # root -> trx -> dac -> get
  ```

  注意：Route 最前面的 ":" 不可省略。

  args 中的元素将作为位置参数依次传递给目标函数。在 Javascript 环境中，它的表现形式为一个数组 (array)。

  kwargs 中的元素将作为关键字参数传递给目标函数。在 Javascript 环境中，它的表现形式为一个简单对象 (object)。

  args 和 kwargs 都是可选的。

  注意，只有可以序列化的基本类型或者它们组成的容器类型才可以作为参数进行传递。你无法传递诸如一个函数对象之类的复杂对象作为参数。

  完整的接口参数可以由一个 mapping 对象来描述：

  ``` javascript
  options = {
    route: ':trx:dac:get',
    args: [dacKey]
  }
  ```

  ## 在 RPC Server 中定义接口

  python 部分的目的就是为了暴露一系列的 RPC 接口，它是整个 python code 的终端，所有其它代码都是为这些接口而服务的。

  RPC 接口的顶层结构是一个 mapping 对象：`/py-code/src/apis/routes.py` 中的 API_ROUTES。

  API_ROUTES 本身代表根路由节点，它有 2 个可选的键：'method' 和 'children'。method 的值为一个函数，通过根路由 ':' 即可指向这个函数。

  children 的值则为该路由的子路由，其键为子路由节点的名称。每个子路由节点都是和根路由相似的一个对象，它也有 'method' 和 'children' 两个可选键。通过冒号将从根路由到子路由的各个节点名称连接起来，即可形成访问该子路由的完整路径。

  例如我们有如下的根路由对象：

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

  则我们可以通过路由 `:example` 指向到 `example` 函数，通过路由 `:example:child1` 指向 `child` 函数。

  如果访问的路由节点不存在，或者在该路由节点上没有通过 'method' 注册函数，在调用时会抛出 `APIRouteError`。

  为了结构的清晰，我们可以将不同的节点分别放在不同的文件当中。在本示例代码中，根路由的子节点被分别放在了 module 文件夹的不同文件之中。
  
  ## 在 RPC Client 中调用接口

  在 Electron Renderer Process 中可以通过 rpcClient 对象来调用 RPC 接口。

  * rpcClient 被绑定在 Vue 组件中，因此在 Vue 组件中，可以直接通过 `vm.$rpcClient` 获取 rpcClient 对象。

  * 在普通的 js 文件中，可以通过如下方式引入 rpcClient 对象：

    ```
    import rpcClient from '@/plugins/rpc-client/client'
    ```

  我们可以通过 rpcClient.request 来调用 RPC 接口，返回一个 Promise 对象：
  
  ``` javascript
  let options = {
    route: ':abc:xyz',
    args: [arg1, arg2],
    kwargs: { kwarg1: value1, kwarg2: value2 }
  }
  rpcClient.request(options).then(res => {
    // manage result
  }).catch(err => {
    // manage error
  })
  ```

  其中，args 和 kwargs 会分别作为位置参数和关键字参数传递给目标函数，这二者都是可选的。

# Electron Renderer Process 中的预设资源

  基于应用的基本要素，在 Renderer Process 中有一些预设资源可以直接使用，便于快速构建应用。

## Alias

  在 js 和 .vue 文件中，可以使用 @ 作为路径的别名，该别名等同于 /src/。

## Vue Plugins

  项目预设了一些 Vue Plugin，用于实现一些常见的功能。我们用 `vm` 来表示一个 Vue 实例：

  * alert-error

    使用 `vm.$alertError (err, callback)` 来弹出一个对话框，用于提示信息。如果指定了 callback，将在对话框弹出后执行。

  * event-bus

    event-bus 是一个事件总线，用于在任意两个 Vue 组件间传递信息。它本身是一个 Vue 组件。

    ``` javascript
    vmA.$bus.$emit('event-name')
    vmB.$bus.$on('event-name', () => {...})
    ```

  * lodash

    通过 `vm.$lodash` 来调用 lodash 库

  * rpc-client

    通过 `vm.$rpcClient` 来调用 rpcClient 对象。请参考：RPC 通信

  * vue-electron

    通过 `vm.$electron` 即可调用 electron 库。等价于 `require('electron')`

## element-ui

  项目集成了 element-ui，可以直接使用其功能。

## font-awesome

  集成了 font-awesome 5 的免费图标库。通过在图标分类的类名前加上 el-icon 前缀，即可以与 element-ui 的内置 icon 一样的方式使用。

  我们可以在[官网图标库](https://fontawesome.com/icons?d=gallery&m=free)中查询图标。例如，对于官网图标中的类：class="fas fa-cog"，可以按照如下方式调用：

  ``` html
  <i class="el-icon-fas fa-cog"></i>
  ```

## global-variables

  '@/styles/global-variables.scss' 中的变量，可以在任何 .vue 组件中直接使用，而无需额外导入。你可以将需要全局使用的变量导入到该文件中。例如，_colors.scss 中的变量已经导入该文件，因而可以在任何 .vue 组件中直接使用。

# 其它

  关于其它内容，可以根据项目的结构自己扒一扒，在此不做赘述。

  关于编码规范，请参考：CodingStyle.md


# 常见问题

## 这个项目的意义在哪里? 为什么不适用 C++ 或纯 javascript 实现？

  在很多应用场合，特别是工程和科研领域，python 有着无与伦比的开发效率。这不仅得益于 python 相对简洁且灵活的语法，更得益于其丰富的生态系统，很多功能往往通过一个 python 包便能实现。

  例如，javascript 没有稳定更新的、成熟的 VISA （虚拟仪器仪表控制） 实现。至于 C++，它的开发效率要比使用 python 和 electron 要低得多。

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

## 在 yarn install 时可能出现的常见错误

- Downloading libzmq for windows 时超时

  由于特殊的网络环境，很容易在这个位置报错退出。我们可以在显示 Downloading 时，通过 'CTRL+C' 中止安装，进入 `node-modules/zeromq/scripts/preinstall.js`，通过阅读代码，找到对应的包，手动放置在 `-/zerpmq/windows/lib` 中，并更改为目标文件名。然后重新运行 `yarn install`。此时就可以跳过下载步骤。

- node-gyp 编译出错

  需要你阅读具体的报错信息，进行处理。如果你是中文系统，在 install 前输入：`chcp 65001` 可以正确的显示中文，帮助你的分析。
  
  可能的一些原因：

  - 没有安装 Visual C++ v140 编译包

  - electron 版本不匹配，electron-builder 似乎与 electron 版本有某种适配关系，除非你知道你在做什么，不要更新 electron 的版本。

  - node 的架构与目标架构不一致，例如 node 是 x64，但 .npmrc 中配置的是 ia32 架构。在这种情况下，可能一直卡住但不报错。