### 1. webpack是什么

```js
模块化打包工具，处理应用程序时，递归构建一个依赖关系图，包含应用程序需要的每个模块，将这些模块打包成一个或多个bundle
```

### 2. webpack rollup

```js
webpack: 拥有强大的loader和丰富的插件

rollup: 适合基础库的打包，将各模块打包进一个文件中，通过tree-shaking删除无用的代码，从而降低代码的体积；
没有webpack的功能丰富
```

### 3. 常用的loader

```js
loader配置在module.rules属性中，每个loader都是一个对象，test为匹配的规则，use为配置调用对应的loader；
loader支持链式调用，同一个use里的loader执行顺序为从下往上(从右向左)

file-loader: 将文件输出到output目录，代码中通过相对路径引用
url-loader: 类似file-loader，文件小于设定的limit时可转为base64形式注入到代码
image-loader: 加载并压缩图片
css-loader: 加载css，支持模块化，压缩，文件导入(require)
style-loader: 将css代码注入到DOM的内联style标签内，通过DOM加载css(将css-loader生成的内容，用style标签挂载到页面的head中)
sass-loader | less-loader: 处理sass,less为css
autoprefixer-loader: 处理CSS3属性前缀
babel-loader: 用babel将ES6转换为ES5
eslint-loader: 通过ESLint检查JS代码
source-map-loader: 加载额外的 Source Map⽂件，以⽅便断点调试

```

### 4. 常用的plugins

```js
解决loader无法实现的事，plugins属性传入new实例对象

html-webpack-plugin: 打包结束后，生成一个html文件，将打包生成的js引入到html中
webpack-bundle-analyzer: 可视化webpack输出文件的体积
mini-css-extract-plugin: 将CSS提取到单独的文件中，支持按需加载
purgecss-plugin-webpack: 将css进行tree shaking优化
```

### 5. Loader和Plugin的区别

```js
Loader的作用是让webpack拥有了加载和解析非JS文件的能力

Plugin扩展webpack的能力，webpack运行的生命周期中会广播出事件，Plugin监听这些事件，合适的时机通过webpack提供的API改变输出结果
```

### 6. bundle, chunk, module

```js
bundle: webpack打包出来的文件
chunk: 由多个模块组合而成的代码块，用于代码的合并和分割
module: 开发中的单个模块，一个模块对应一个文件，webpack从配置的entry中递归找出所有依赖的模块
```

### 7. webpack的构建流程

```js
Webpack 的运⾏流程是⼀个串⾏的过程，从启动到结束会依次执⾏以下流程： 
1. 初始化参数：从配置⽂件和 Shell 语句中读取与合并参数，得出最终的参数； 
2. 开始编译：⽤上⼀步得到的参数初始化 Compiler 对象，加载所有配置的插件，执⾏对象的 run ⽅法开始执⾏编译； 
3. 确定⼊⼝：根据配置中的 entry 找出所有的⼊⼝⽂件； 
4. 编译模块：从⼊⼝⽂件出发，调⽤所有配置的 Loader 对模块进⾏翻译，再找出该模块依赖的模块，再递归本步骤直到所有⼊⼝依赖的⽂件都经过了本步骤的处理； 
5. 完成模块编译：在经过第4步使⽤ Loader 翻译完所有模块后，得到了每个模块被翻译后的最终内容以及它们之间的依赖关系； 
6. 输出资源：根据⼊⼝和模块之间的依赖关系，组装成⼀个个包含多个模块的 Chunk，再把每个 Chunk 转换成⼀个单独的⽂件加⼊到输出列表，这步是可以修改输出内容的最后机会； 
7. 输出完成：在确定好输出内容后，根据配置确定输出的路径和⽂件名，把⽂件内容写⼊到⽂件系统。

在以上过程中，Webpack 会在特定的时间点⼴播出特定的事件，插件在监听到感兴趣的事件后会执⾏特定的逻辑，并且插件可以调⽤ Webpack 提供的 API 改变 Webpack 的运⾏结果

```

### 8. webpack 热更新的实现原理

```js
⾸先要知道server端和client端都做了处理⼯作：
1. 第⼀步，在 webpack 的 watch 模式下，⽂件系统中某⼀个⽂件发⽣修改，webpack 监听到⽂件变化，根据配置⽂ 
件对模块重新编译打包，并将打包后的代码通过简单的 JavaScript 对象保存在内存中。 
2. 第⼆步是 webpack-dev-server 和 webpack 之间的接⼝交互，⽽在这⼀步，主要是 dev-server 的中间件 webpack- dev-middleware 和 webpack 之间的交互，webpack-dev-middleware 调⽤ webpack 暴露的 API对代码变化进⾏监 控，并且告诉 webpack，将代码打包到内存中。 
3. 第三步是 webpack-dev-server 对⽂件变化的⼀个监控，这⼀步不同于第⼀步，并不是监控代码变化重新打包。当我们在配置⽂件中配置了devServer.watchContentBase 为 true 的时候，Server 会监听这些配置⽂件夹中静态⽂件的变化，变化后会通知浏览器端对应⽤进⾏ live reload。注意，这⼉是浏览器刷新，和 HMR 是两个概念。 
4. 第四步也是 webpack-dev-server 代码的⼯作，该步骤主要是通过 sockjs（webpack-dev-server 的依赖）在浏览器端和服务端之间建⽴⼀个 websocket ⻓连接，将 webpack 编译打包的各个阶段的状态信息告知浏览器端，同时也包括第三步中 Server 监听静态⽂件变化的信息。浏览器端根据这些 socket 消息进⾏不同的操作。当然服务端传递的最主要信息还是新模块的 hash 值，后⾯的步骤根据这⼀ hash 值来进⾏模块热替换。 
5. webpack-dev-server/client 端并不能够请求更新的代码，也不会执⾏热更模块操作，⽽把这些⼯作⼜交回给了webpack，webpack/hot/dev-server 的⼯作就是根据 webpack-dev-server/client 传给它的信息以及 dev-server 的配置决定是刷新浏览器呢还是进⾏模块热更新。当然如果仅仅是刷新浏览器，也就没有后⾯那些步骤了。 
6. HotModuleReplacement.runtime 是客户端 HMR 的中枢，它接收到上⼀步传递给他的新模块的 hash 值，它通过JsonpMainTemplate.runtime 向 server 端发送 Ajax 请求，服务端返回⼀个 json，该 json 包含了所有要更新的模块的 hash 值，获取到更新列表后，该模块再次通过 jsonp 请求，获取到最新的模块代码。这就是上图中 7、8、9 步骤。 
7. ⽽第 10 步是决定 HMR 成功与否的关键步骤，在该步骤中，HotModulePlugin 将会对新旧模块进⾏对⽐，决定是否更新模块，在决定更新模块后，检查模块之间的依赖关系，更新模块的同时更新模块间的依赖引⽤。 
8. 最后⼀步，当 HMR 失败后，回退到 live reload 操作，也就是进⾏浏览器刷新来获取最新打包代码
```

### 9. 利用webpack优化性能

```js
    1. 压缩代码(JS，CSS，HTML文件，图片)
        css-minimizer-webpack-plugin:(CSS压缩)
        html-webpack-plugin:(HTML文件代码压缩)
        compression-webpack-plugin:(文件大小压缩)
    2. CDN加速
    3. Tree Shaking: 删除不用的代码片段(启动webpack时添加参数 --optimize-minimize)
    4. 代码分离:将代码分离到不同的bundle，按需加载，可以利用浏览器缓存
    5. 提取公共第三方库: splitChunksPlugin可以抽离公共模块，利用浏览器缓存缓存不频繁变动的公共代码
```

### 10. Babel的原理是什么?

```js
babel 的转译过程也分为三个阶段，这三步具体是： 
  1.解析 Parse: 将代码解析⽣成抽象语法树（AST），即词法分析与语法分析的过程；
  2.转换 Transform: 对于 AST 进⾏变换⼀系列的操作，babel 接受得到 AST 并通过 babel-traverse 对其进⾏遍历，在此过程中进⾏添加、更新及移除等操作；
  3.⽣成 Generate: 将变换后的 AST 再转换为 JS 代码, 使⽤到的模块是 babel-generator
```
