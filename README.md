<!-- content -->
- [综述](#综述)
- [项目的开发环境](#项目的开发环境)
  - [NodeJS](#NodeJS)
  - [python](#python)
- [项目运行指南](#项目运行指南)
- [环境变量和模式](#环境变量和模式)
- [项目配置项](#项目配置项)
- [基本逻辑架构](#基本逻辑架构)
  - [RPC Server](#RPC-Server)
  - [API 调用规范](#API-调用规范)
  - [RPC Client](#RPC-Client)
- [常见问题](#常见问题)
  - [这个项目的意义在哪里? 为什么不适用 C++ 或纯 javascript 实现？](#这个项目的意义在哪里? 为什么不适用 C++ 或纯 javascript 实现？)
  - [适用场景与优缺点](#适用场景与优缺点)
  - [在 yarn install 时可能出现的常见错误](#在 yarn install 时可能出现的常见错误)

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

# 项目运行指南

当你安装好上述安装环境后，只需要使用预先设置好的命令，就可以完成整个项目 —— 包括 Node.js 和 python 部分 —— 的初始化及编译。

如果你的环境是 Windows7/10 和 ia32 架构（包括 node 和 python），你应该可以直接进行初始化。否则请参考[项目配置项](#项目配置项)

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

- `/py-code`

  配置文件在根目录下，请参考 Poetry 官方文档。

  __scripts.py 是 pyproject.toml 中的 scripts 来源。

# 基本逻辑架构

  使用 zerorpc 为消息层在 electron render process 和 python 之间进行通信。在程序开始运行时，electron main process 使用子进程来启动 python RPC server。python RPC server 会暴露一系列的 API。Electron renderer process 通过 rpc Client 访问这些 API。

  原则：视图层和逻辑层分离。视图层 (electron renderer) 只应处理用户界面的逻辑，而实际的功能逻辑则通过调用 python API 来实现。

  视图层使用 Vue 来进行渲染，关于该技术的细节请参考官方文档。

  ## RPC Server

  python 层的作用是通过 RPC Server 暴露一系列的 API，你的其它代码都是为这些 API 服务的。API 的入口文件为 `/py-code/src/apis/main.py`。顶层 API 路由被放置在 `/py-code/src/apis/routes.py` 中，它的结构如下：

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