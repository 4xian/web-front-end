# HTML相关总结

#### 1. <!DOCTYPE>

```js
告知浏览器用什么文档类型解析这个文档，指定后已标准模式解析文档，否则以兼容模式(向后兼容)解析.
```

#### 2.  常见的行内，块级元素

```js
行内：a / b / span / img / strong / sub / sup / button / input / label / select / textarea /

块级：div / ul / ol / li / dl / dt / dd / h1-h6 / p

行内元素设置宽高无效，可以设置line-height；margin和padding可以设置左右
```

#### 3. 空元素

```js
空元素在开始标签结束，常见的有：br / hr / img / input / link / meta /
```

#### 4. link 与@import

```js
link定义文档与外部资源的关系，只能存在于head中，rel属性定义了当前文档与链接文档的关系，常见的stylesheet指定义一个**外部加载的样式表**.

两者区别：

- @import 是css提供的 只能导入样式表；link是html提供的，可加载css，还可定义rel连接属性，RSS，引入图标等.
- 加载顺序不同，link在加载页面时引入，@import在页面加载完毕后加载.
- 可通过js控制DOM，插入link标签改变样式，无法使用@import插入样式.

```

#### 5. 浏览器渲染原理

```js
- 解析收到的文档，根据文档定义构建DOM树，由DOM元素和属性节点组成；

- 解析CSS，组成CSSOM规则树；

- 将DOM和CSSOM树结合构建渲染树，渲染树的节点为渲染对象，一个拥有颜色，大小等属性的矩形，渲染对象和DOM元素相相应；

- 当浏览器生成渲染树后，根据渲染树进行布局(回流)，弄清各节点在页面中的确切位置和大小；

- 布局结束后是绘制阶段，遍历渲染树并调用渲染对象的paint方法将内容显示在屏幕上.

- (渲染引擎会解析一部分便渲染一部分，边解析边渲染)
```

#### 5.1 浏览器解析过程中

```js
1. JS文件会阻碍浏览器的解析，可以设置的defer 和async属性.

- 脚本无该属性，浏览器会立即加载并执行脚本；
- defer属性延迟引入JS，html不会停止解析，当document解析完毕再按顺序执行脚本，在DOMContentLoaded事件触发之前完成；
- async表示异步引入JS，加载过程不会阻塞文档解析，但加载完成就会执行，执行时会阻塞文档解析，并且脚本顺序不定.

2. 文档的预解析：
    - 执行JS脚本时，另一线程执行剩下的文档，加载需要网络的自选，预解析不改变DOM树，只解析外部资源的引用，如外部脚本，样式表，图片等.

3. CSS如何阻挡文档解析：
    - 当JS脚本执行时请求样式信息，若CSSOM未完成，浏览器会先下载和构建CSSOM树，再执行JS，最后继续文档的解析.

4. DOMContentLoaded 事件和Load事件：
    - DOM...事件在HTML文档完全加载和解析之后触发，无需等待样式表，图片，子框架等；
    - Load事件在所有资源加载完成后触发.
```

#### 5.2 浏览器渲染过程中

```js
1. 渲染页面时出现的现象：
    - 白屏: 有些浏览器需先构建DOM树和CSSOM树才会渲染，若CSS在底部或JS在顶部，则会导致浏览器迟迟未渲染，出现白屏.
    - FOUC: 样式闪烁问题，有些浏览器在CSS加载前，先呈现HTML，导致出现无样式内容，然后样式突然呈现的现象，CSS加载时间过长或放在了底部.
```

#### 5.3 浏览器绘制过程中

```js
1. 重绘和回流(重排)：
    - 重绘：渲染树的元素样式改变而不影响布局.
    - 回流：渲染树的部分或全部因为元素尺寸，布局，隐藏等需要重新构建时.
    - 回流一定引起重绘，重绘不一定引起回流.

2. 引起重绘的属性和方法：
    - color / background / border-style / border-radius / visibility / ...
3. 引起回流的属性和方法：
    - 添加或删除DOM元素；
    - 尺寸改变，margin，padding，width，height；
    - 内容变化，如input输入文字；
    - 窗口resize变化；
    - 修改默认字体时;
    - 激活伪类，如:hover
    - display / position / overflow / client(...) / offset(...) / scroll(...) / getComputedStyle() / getBoundingClientRect

4. 如何减少回流：
    - CSS中：
    - 避免table布局；避免多层内联；避免使用CSS表达式；动画效果用到脱离文档流的元素上；
    -
    - JS中：
    - 操作样式尽量用预先定义的class代替style；
    - 避免频繁操作DOM，创建一个documentFragment，在该对象里操作DOM，最后再添加到文档中；
    - 避免将节点属性放在循环的变量里
```

#### 6. H5的新特性

```js
图像，位置，存储， 多任务等功能的增加.

1. 新增：
    - canvas / video / audio / webworker / websocket /
    - 离线存储：localStorage(长期存储数据)，sessionStorage(浏览器关闭后删除);
    - 语义化标签：article / footer/  header / section / nav /...
    - 表单控件：calendar / date / time / email / url / search / ...
    - 文档属性：document.visibilityState

2. 移除：
    - basefont / big / center / font / s / tt / u / strike /
    - frame / frameset / noframes /

3. 兼容性问题：
    - IE8以下可通过document.createElement产生H5新标签，但须添加标签默认样式.
```

#### 7. HTML语义化的理解

```js
用合适的标签划分网页内容，便于阅读理解(开发者，机器)
```

#### 8. 浏览器端的存储技术

```js
cookie / localStorage / sessionStorage /  字符串类型的键值对

1. cookie 早先用于服务端记录用户状态，存储在客户端，每次同源请求时发送给服务端，最多存储4k数据，过期时间expires决定，可被同源页面共享.

2. sessionStorage：借鉴服务端session的概念，一次会话中保存的数据，大小5M或更大，当窗口关闭就失效，只能被 __同一个窗口的同源页面__ 共享.

3. localStorage：大小5M或更大，除非手动删除否则不会失效，只能被同源页面访问.

4. indexDB：更大量的存储方式，本地数据库机制，非关系型数据库，接近NoSQL数据库.
```

#### 9. 渐进增强  优雅降级

```js
1. 渐进增强：低版本浏览器时，先满足基本功能，再逐步增加交互效果.
2. 优雅降级：以高版本浏览器构建功能，再对低版本浏览器进行兼容.
```

#### 10.前端性能优化

```js
1. 页面方面：
    - 减少http请求，通过文件合并，css雪碧图，base64；
    - DNS缓存机制减少DNS查询次数；
    - 设置缓存策略，对不变的内容缓存；
    - 延迟加载减少首屏时请求的资源，需要该资源时再去请求；

2. 服务器方面：
    - 使用CDN，提高用户请求的响应速度；
    - 服务器启用Gzip对传输的资源进行压缩，减小文件的体积；
    - 减小cookie的大小

3. CSS和JS方面：
    - 样式表放在head标签中，减少首屏渲染时间；
    - 避免使用@import标签；
    - 将JS脚本放在底部或使用defer/async属性，避免阻塞；
    - 压缩JS和CSS文件，减小文件的体积
```
