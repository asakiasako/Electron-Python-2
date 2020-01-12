<!-- content -->
- [项目运行指南](#项目运行指南)
- [环境变量和模式](#环境变量和模式)
- [编码规范](#编码规范)
  - [Vue 单文件组件](#Vue-单文件组件)
    - [组件名称](#组件名称)
    - [组件存放位置](#组件存放位置)
    - [组件间的数据传递](#组件间的数据传递)
    - [CSS 相关](#CSS-相关)
    - [统一的标签顺序](#统一的标签顺序)
  - [vue-router](#vue-router)
  - [vuex](#vuex)
  - [自定义 js 模块](#自定义-js-模块)
  - [alias](#alias)
  - [静态资源](#静态资源)
  - [工程目录结构](#工程目录结构)
- [常见问题](#常见问题)
  - [这个项目是为了解决什么问题?](#这个项目是为了解决什么问题?)
  - [这个项目的意义在哪里?](#这个项目的意义在哪里?)
  - [适用场景与优缺点](#适用场景与优缺点)
  - [为什么不用 C++/C#? 为什么不使用纯 js 实现?](#为什么不用-C++/C#?-为什么不使用纯-js-实现?)

# 项目运行指南

- 项目安装：`yarn install`

  这个命令会对项目进行一些预配置，然后安装所有的 python 和 node.js 依赖。

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

  你可以为 .env 文件增加后缀 [mode] 来设置某个模式下特有的环境变量。为特定模式准备的环境文件拥有比一般的环境文件更高的优先级。模式的名称与 `NODE_ENV` 环境变量是一致的。

# 编码规范

## Vue 单文件组件

### 组件名称

  在 script 中，一律使用 PascalCase。在 template 中，一律使用 kebab-case。

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
  - 非父子组件：使用 vm.bus 或 vuex
  - 紧密耦合的祖孙间传递也可以考虑用父组件作为中间运输层
  - 紧密耦合的兄弟间传递也可以考虑用父组件作为中转运输层

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

---

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

---

## vuex

- 需要由 vuex 管理的数据

  - 组件间共享的响应式数据
  - 非父子组件之间的数据传递

- getter、mutation、action、module 的命名使用 camelCase
- module 应避免嵌套，尽量扁平化
- module 应启用命名空间：`namespaced: true`

---

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

---

## alias

  在 `js` 和 `.vue` 文件中，可以使用 `@` 作为路径的别名，该别名等同于 `/src/`。

  ``` js
  import Home from '@/views/Home.vue'
  ```
---
## 静态资源

放置在 public 目录下的资源会直接被拷贝，而不会经过 webpack 的处理。

在 main 进程和 renderer 进程中，你都可以通过 `__static` 这个全局变量来指向 public 文件夹，不论是 develope 环境还是 procuction 环境下。
---
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