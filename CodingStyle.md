
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
|-- py-code ---------------------- python 部分的源码
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