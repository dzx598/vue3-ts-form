一个基于native ui 生成表单的低代码demo
已初始化公司业务前端规范的脚手架：vue3.2 + ts + vite2 + pinia + axios

# 开发规范

## 一、编辑器配置及代码格式化

### 1.1 集成 editorconfig 配置

1. EditorConfig 有助于为不同 IDE 编辑器上处理同一项目的多个开发人员维护一致的编码风格。
2. **<font color="red">VSCode 需要安装一个插件：EditorConfig for VS Code</font>**
   ![image-20220405](https://tva1.sinaimg.cn/large/008i3skNgy1gsq2gh989yj30pj05ggmb.jpg)
3. Webstrom 是内置安装的，不需要独立安装

### 1.2 使用 prettier 工具保持代码统一风格

Prettier 是一款强大的代码格式化工具，支持 JavaScript、TypeScript、CSS、SCSS、Less、JSX、Angular、Vue、GraphQL、JSON、Markdown 等语言，基本上前端能用到的文件格式它都可以搞定，是当下最流行的代码格式化工具

1. 本项目中已经安装了 `prettier` 第三方库 和 配置了`.prettierrc`文件(也可以创建`.prettierrc.js文件`,js 文件有时候格式化不生效，建议使用`.prettierrc`) 及 `.prettierignore` 忽略文件

2. **<font color=red>VSCode 需要安装一个插件 prettier 的插件</font>**
   ![image-20220405](https://tva1.sinaimg.cn/large/008i3skNgy1gsq2acx21rj30ow057mxp.jpg)

3. 然后再设置代码保存后自动格式化，格式化按 prettier 风格保存。这样保存后就会按 prettier 风格格式化代码
   ![image-20220405](https://p3.toutiaoimg.com/img/tos-cn-i-qvj2lq49k0/a0fb194644cd4fba8c972fffca43a3af~tplv-shrink:1280:546.jpeg?from=post)

4. `prettierrc`文件常见配置

```js
{
    // 箭头函数参数括号 默认avoid 可选 avoid| always
    // avoid 能省略括号的时候就省略 例如x => x
    // always 总是有括号
    "arrowParens": "avoid",

    // 使用单引号, 默认false(在jsx中配置无效, 默认都是双引号)
    "singleQuote": false,

    // 使用分号, 默认true
    "semi": false,

    "printWidth": 100, // 一行的字符数，超过会换行（默认80）

    // tab缩进大小,默认为2
    "tabWidth": 2,

    "useTabs": false, // 使用tab缩进，默认false

    "quoteProps": "as-needed",

    // 行尾逗号,默认none,可选 none|es5|all
    // es5 包括es5中的数组、对象
    // all 包括函数对象等所有可选
    "TrailingCooma": "all",

    // 对象中的空格 默认true
    // true: { foo: bar }
    // false: {foo: bar}
    "bracketSpacing": true,

    // JSX标签闭合位置 默认false
    // false: <div
    //          className=""
    //          style={{}}
    //       >
    // true: <div
    //          className=""
    //          style={{}} >
    "jsxBracketSameLine": false,


}

```

## 二、目录及文件命名规范

### 2.1 多单词目录或者文件使用 - 连字符

1. 目录与文件统一使用"-" 连字符 而不是用驼峰命名法
   ![image-20220405](https://wx1.sinaimg.cn/bmiddle/006Dd4Ovgy1h0yruuglyuj30bq070js9.jpg)

### 2.2 src/components 下创建组件规则

1. 一个组件为一个目录，如 `basic-form` 组件 不是直接创建一个 `basic-form.vue` 文件，而是创建 basic-form 目录
2. basic-form 目录下 创建 src 目录。src 目录下 才是 定义 `basic-form.vue` 组件，如果改组件在拆分组件，可以在 src 目录在定义.vue 文件
3. 如果该组件 有涉及到 定义 ts 类型，在其目录下创建 types/index.ts 写该组件做需要的类型
4. 该组件下 都需要一个 `index.ts` 文件,作为统一出口, 导出 src 下的组件及 `types/index.ts` 中的类型。
5. 导入组件 及 类型

```js
import BasicForm, { IFormItem } from "@/components/basic-form"; //可省略 /index.ts
```

### 2.3 view 视图目录下的目录解构

1. `layout.vue` 文件：如果页面是二级路由时，`layout.vue` 文件作为 一级路由的 `component`，统一管理。大部分页面都有二级路由
   ![image-20220405](https://p6.toutiaoimg.com/img/tos-cn-i-qvj2lq49k0/2fbd35d97df34a75b854528eca217dac~tplv-shrink:1280:409.jpeg?from=post)

2. view 下的目录按模块划分，register 目录是系统中登记工作站下的所有页面。如果有其他工作站或者模块，应该在 view 目录下创建模块目录
   ![image-20220405](https://wx3.sinaimg.cn/bmiddle/006Dd4Ovgy1h0yuewrrenj30an0ebad1.jpg)

3. register 目录下的 .vue 文件就是 登记工作站 中的 具体某个页面。如 register/add.vue 就是 登记工作站的 新增页面
4. register 目录下的 components 目录 是该模块下的页面 所涉及到的组件。components 下直接创建 .vue 文件的组件。
5. register 目录下的 config 目录 是 该模块下的组件 所需要的静态数据，静态数据不应该在组件中定义，造成组件代码臃肿
6. 例如：register/config/table-msg.ts 文件定义的就是 register/components/table-msg.vue 组件所需要的表单字段检验规则
7. register 目录下的 types 目录 则是声明 本模块下的页面所用的 ts 类型

### 2.4 router 目录解构划分

1. router 目录 下也是按导航栏菜单工作站 和 模块划分。与 view 目录对应。router/register 对应 view/register 视图中的页面路由
   ![image-20220405](https://wx2.sinaimg.cn/bmiddle/006Dd4Ovgy1h0yuh9h4o9j307v0bh75z.jpg)

2. router/index.ts 是路由入口文件 统一导入 模块下的子路由

### 2.5 store 目录解构划分规则

1. `store` 状态管理 这里用的是 `Vuex` 而不是 pinia。相比之下 `Vuex` 对 ts 的支持要差一些。尽然用了 `Vue`,就体验一下 Vue 的全家桶吧
2. `store` 目录下按业务模块划分 而不是 按菜单栏 模块划分。比如 user：用户模块保存用户信息的。http-path：其他系统路径
   ![image-20220405](https://wx1.sinaimg.cn/bmiddle/006Dd4Ovgy1h0yv9p7o7kj308206u750.jpg)

3. 每个模块下有 `index.ts` 和 `types.ts` 文件。`types.ts` 文件用于定义 该模块下 `state` 的类型
4. `store` 目录下的 `index.ts` 文件导入并加载模块，并导出。`types.js` 定义 根 `state` 的类型

### 2.6 utils 目录

1. utils 目录为工具函数目录

### 2.7 service 目录解构划分

1. request 目录是 基于 `axios` 封装的 Request 类。service/index.ts 统一导出 request 请求
2. 考虑到后期业务可能会更复杂.所以 对 Request 类 做了 对单个 `axios` 实例、全部 `axios` 实例、单个接口请求 进行 请求拦截 和 响应拦截

```js
// 给单个实例添加拦截器

// service/index.ts
import Request from "./request";
import { BASE_URL, TIME_OUT } from "./request/config";
// 创建 Request 类 实例，就是创建一个实例。可在对应 拦截器中做 该实例的操作。
// 比如在 requestInterceptor中 对统一的实例 请求在 headers中 添加tokan。不过现在病历系统 没有用到token
const request = new Request({
  baseURL: BASE_URL,
  timeout: TIME_OUT,
  interceptors: {
    requestInterceptor: config => {
      // console.log("单个axios实例的 请求成功拦截");
      return config;
    },
    requestInterceptorCatch: err => {
      // 单个axios 实例的 请求失败的拦截
      return err;
    },
    responseInterceptor: res => {
      // console.log("单个axios 实例的 响应成功拦截");
      return res;
    },
    responseInterceptorCatch: err => {
      // console.log("单个axios 实例的 响应失败的拦截");
      return err;
    },
  },
});

export default request;
```

```js
// 对单个接口 添加拦截器
import request from "@/service";
import { IDataType } from "@/service/types";
import { IQueryCurUser } from "./types";

enum CommonApi {
  queryCurUser = "dnas/pis/common/queryCurUser",
}

export const queryCurUser = (params: IQueryCurUser) => {
  // 单个接口添加 请求拦截
  const requestInterceptor = (config) => {
    return config;
  }
  return request.post<IDataType>({ url: CommonApi.queryCurUser, data: params, interceptors: {requestInterceptor} });
};
```

3. types.ts 文件是 `axios` 请求 涉及到的 类型
4. api 目录下 按 工作站 和 模块 划分 封装的单个接口请求。

## 三、代码规则

### 3.1 以 g- 开头的 class 是全局样式

1. 以 g- 开头定义全局 class。是在 src/assets/style/global.less 中定义的全局 class 样式。
   ![image-20220405](https://p3.toutiaoimg.com/img/tos-cn-i-qvj2lq49k0/293a4fdc236943f19b021ca4a68276e6~tplv-shrink:1263:506.jpeg?from=post)
   ![image-20220405](https://wx3.sinaimg.cn/bmiddle/006Dd4Ovgy1h0ytxz02faj30ew0g2n11.jpg)

2. 比较常用的样式尽量抽出到 `global.less` 文件。定义为全局样式，避免在组件中在写一遍样式

### 3.2 typescript 代码统一规范

1. 类型首字母大写，使用 interface 定义类型时候 习惯以 I 开头 表示以 interface 定义的。比如：

```js
// 定义user对象类型, i大写I，第二个字母也大写
interface IUser {
  name: string;
}
//使用 type 的时候，后面最好加上 Type
type IdType = string | number;
```

2. 泛型用大写字母

```js
// good
function foo<T>(a: T) {}

//bad
function foo<t>(a: t) {}
```

3. 类型能推导就不用定义

```js
// good 推荐
const str = "AAA";

// 不推荐
const name: string = "BBB";
```

# git 提交规范

## 一、git commit message 统一规范

### 1.1 使用 Angular 团队提交规范

- 常见提交项

| Type     | 作用                                                                                   |
| -------- | -------------------------------------------------------------------------------------- |
| feat     | 新增特性 (feature)                                                                     |
| fix      | 修复 Bug(bug fix)                                                                      |
| docs     | 修改文档 (documentation)                                                               |
| style    | 代码格式修改(white-space, formatting, missing semi colons, etc)                        |
| refactor | 代码重构(refactor)                                                                     |
| perf     | 改善性能(A code change that improves performance)                                      |
| test     | 测试(when adding missing tests)                                                        |
| build    | 变更项目构建或外部依赖（例如 scopes: webpack、gulp、npm 等）                           |
| ci       | 更改持续集成软件的配置文件和 package 中的 scripts 命令，例如 scopes: Travis, Circle 等 |
| chore    | 变更构建流程或辅助工具(比如更改测试环境)                                               |
| revert   | 代码回退                                                                               |
| types    | 类型定义文件更改                                                                       |
| wip      | 开发中                                                                                 |

```js
// example
git status
git add .

git commit -m 'feat: 新增xxxx功能'
// or
git commit -m 'fix: 修改了xxxbug'

//注意：message 中 英文冒号(:) 后面要空格
```
