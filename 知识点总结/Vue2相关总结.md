# Vue相关总结

#### 1. MVP MVC MVVM

```js
MVC、MVP 和 MVVM 是三种常见的软件架构设计模式，主要通过分离关注点的方式来组织代码结构，优化我们的开发效率。

MVC 通过分离 Model、View 和 Controller 的方式来组织代码结构。其中 View 负责页面的显示逻辑，Model 负责存储页面的业务数据，以及对相应数据的操作。并且 View 和 Model 应用了观察者模式，当 Model 层发生改变的时候它会通知有关 View 层更新页面。Controller 层是 View 层和 Model 层的纽带，它主要负责用户与应用的响应操作，当用户与页面产生交互的时候，Co
ntroller 中的事件触发器就开始工作了，通过调用 Model 层，来完成对 Model 的修改，然后 Model 层再去通知 View 层更新。

MVP 模式与 MVC 唯一不同的在于 Presenter 和 Controller。在 MVC 模式中我们使用观察者模式，来实现当 Model 层数据发生变化的时候，通知 View 层的更新。这样 View 层和 Model 层耦合在一起，当项目逻辑变得复杂的时候，可能会造成代码的混乱，并且可能会对代码的复用性造成一些问题。MVP 的模式通过使用 Presenter 来实现对 View 层和 Model 层的解耦。MVC 中的
Controller 只知道 Model 的接口，因此它没有办法控制 View 层的更新，MVP 模式中，View 层的接口暴露给了 Presenter 因此我们可以在 Presenter 中将 Model 的变化和 View 的变化绑定在一起，以此来实现 View 和 Model 的同步更新。这样就实现了对 View 和 Model 的解耦，Presenter 还包含了其他的响应逻辑。

MVVM 模式中的 VM，指的是 ViewModel，它和 MVP 的思想其实是相同的，不过它通过双向的数据绑定，将 View 和 Model 的同步更新给自动化了。当 Model 发生变化的时候，ViewModel 就会自动更新；ViewModel 变化了，View 也会更新。这样就将 Presenter 中的工作给自动化了。我了解过一点双向数据绑定的原理，比如 vue 是通过使用数据劫持和发布订阅者模式来实现的这一功
能。
(
Model：模型层，负责处理业务逻辑以及和服务器端进行交互
View：视图层：负责将数据模型转化为UI展示出来，可以简单的理解为HTML页面
ViewModel：视图模型层，用来连接Model和View，是Model和View之间的通信桥梁
)
```

#### 2. Vue和React

```js
1. 相同点：
    - 组件化思想
    - 支持服务端渲染
    - 都有虚拟dom
    - 数据驱动视图
    - 都有自己的构建工具

2. 不同点：
    - **数据流向不同**：vue是双向数据流；react是单向数据流
    - **数据变化实现的原理不同**：vue使用的是可变的数据；react使用的是不可变数据
    - **组件化通信的不同**：vue子传父有两种，事件和回调函数；react使用回调函数来通信
    - **diff算法不同**：vue使用双指针，边对比，边更新dom；react主要使用diff队列保存需要更新哪些dom，得到patch树，再统一操作批量更新dom
```

#### 3. 使用Object.defineProperty()进行数据劫持有何缺点

```js
1. 无法拦截某些属性的操作：
    - 通过下标方式修改数组数据
    - 给新对象新增属性
2. 只能监听首次渲染时有的属性，无法实现深度监听
```

#### 4. 说说对SPA的理解

```js
1. 单页面应用：

    - 一个主页面和多个页面片段

    - 局部刷新 / 哈希模式 / 数据传递容易 / 用户体验好

        - 优点：
            1.用户体验好，无需每次重新加载整个页面
            2.前后端分离，分工明确
        
        - 缺点：
            1.不利于SEO
            2.首屏渲染较慢

2. 实现一个单页面：

    - 监听地址栏中hash变化，驱动界面变化

    - 用pushstate记录浏览器的历史，驱动界面发送变化

        1.检测hash/pushstate变化
        2.以当前hash为索引，加载对应资源
        3.等待资源加载完毕，隐藏之前界面，执行回调
        4.显示当前界面，点击按钮或浏览器回退/前进按钮触发hash变化(回到步骤1)

    - hash模式：监听url中的hash来进行路由跳转

        //定义Router
        class Router{
            constructor(){
                this.routes = {};
                //存放路由path和callback
                this.currentUrl = '';
                window.addEventListener('load', this.refresh,false); window.addEventListener('hashchange', this.refresh, false)
            }
            route(path,callback){
                this.routes[path] = callback;
            }
            push(path){
                this.routes[path] && this.routes[path]();
            }
        }
        
        //使用router
        window.myrouter = new Router();
        myrouter.route('/', ()=>{
            console.log('page1')
        });
        myrouter.route('/page2',()=>{
            console.log('page2')
        });
        myrouter.push('/'); //page1
        myrouter.push('/page2'); //page2

    - history模式：借用H5 history api

        - history.pushState()：浏览器历史记录添加记录
        - history.replaceState()：修改历史记录中当前记录
        - history.popState()：当history发生变化时触发

        class Router {
            constructor(){
                this.routes = {};
                this.listenerPopState();
            }
            init(path){
             history.replaceState({path:path},     null, path);
        this.routes[path]&&this.routes[path]();
            }
            
            route(path, callback){
                this.routes[path] = callback;
            }
            push(path){
                history.pushState({path:path},     null, path);
        this.routes[path]&&this.routes[path]();
            }
            
            listenerPopState(){
                window.addEventListener('popstate', e=>{
             const path = e.state && e.state.push;
                    this.routes[path] && this.routers[path]();
                })
            }
        }
        
        //使用router
        window.myrouter = new Router();
        myrouter.route('/', ()=>{
            console.log('page1');
        });
        myrouter.route('/page2', ()=>{
            console.log('page2');
        });
        myrouter.push('/page2'); // page2

3. 给SPA做SEO优化：
    - SSR服务端渲染：将组件或页面通过服务器生成html，再返回给浏览器，如nuxt.js
    - 静态化：
    - 使用Phantomjs针对爬虫处理：
        - Nginx配置，user-agent判断请求是否为爬虫，若是则将请求转发到一个node server，通过Phantomjs解析完整的HTML，返回给爬虫
    - 静态化：
        - 通过程序将动态网页抓取并保存为静态网页，存于服务器的硬盘中
        - 通过web服务器的URL Rewrite方式，把外部请求的静态地址转为实际的动态页面地址，静态页面实际不存在
```

#### 5. v-show和v-if

```js
1. v-show：

    - 不管初始条件是什么，元素都会被渲染

    - 通过display:none隐藏元素，但还存于dom结构中

    原理分析：有transition就执行transition，没有就直接设置display属性
    export const vShow: ObjectDirective<VShowElement> = {
     beforeMount(el, {value}, {transition}){
      el._vod = el.style.display === 'none' ? '' : el.style.display
         if (transition && value) {
            transition.beforeEnter(el)
         } else {
            setDisplay(el, value)
         }
     },
        mounted(el, { value }, { transition }) {
        if (transition && value) {
          transition.enter(el)
        },
        updated(el, { value, oldValue }, {      transition }) {
          // ...
       },
        beforeUnmount(el, { value }) {
         setDisplay(el, value)
       }
      },
    }

2. v-if：

    - 将整个dom元素添加或删除，切换内部有个局部编译/卸载的过程，切换过程中合适的销毁和重建内部的事件监听和子组件

    - false-->true 时，触发组件：beforeCreate， create，beforeMount，mounted

    - true-->false 时，触发组件：beforeDestory，destoryed

        原理分析：返回一个node节点，render函数通过表达式的值来决定是否生成DOM
        export const transformIf = createStructuralDirectiveTransform(
          /^(if|else|else-if)$/,
          (node, dir, context) => {
            return processIf(node, dir, context, (ifNode, branch, isRoot) => {
              // ...
              return () => {
                if (isRoot) {
                  ifNode.codegenNode = createCodegenNodeForBranch(
                    branch,
                    key,
                    context
                  ) as IfConditionalExpression
                } else {
                  // attach this branch's codegen node to the v-if root.
                  const parentCondition = getParentCondition(ifNode.codegenNode!)
                  parentCondition.alternate = createCodegenNodeForBranch(
                    branch,
                    key + ifNode.branches.length - 1,
                    context
                  )
                }
              }
            })
          }
        )

3. v-if有更高的切换消耗，v-show有更高的初始渲染消耗
```

#### 6. Vue中new Vue() 的时候发生了什么

```js
1. new Vue的时候调用_init方法
    - 定义$set, $get, $delete, $watch等方法
    - 定义$on, $off, $emit, $once等事件
    - 定义_update,_forceUpdate, _destroy等生命周期
    - 调用beforeCreate之前，数据未完成初始化，像data,props无法访问
    - initState()：初始化顺序：props, methods, data
    - 到create时，数据已完成初始化，能够访问data, props，但并未完成dom挂载，因此无法访问到dom元素
    - 调用vm.$mount()实现挂载：
        - 不能将根元素放到body或html上
        - 将html文档片段解析成ast语法树
        - 将ast语法树解析成字符串
        - 调用compileToFunctions, 将template解析成render函数
        - 生成render函数后，挂载到vm上，会再次调用mount方法

2. 调用$mount进行页面的挂载
3. 挂载时主要通过mountComponent()方法
    - 触发beforeMount钩子
    - 定义updateComponent更新函数
    - 监听组件数据，有变化就触发beforeUpdate钩子
4. 执行render生成虚拟dom
5. _update将调用patch虚拟DOM生成真实dom，并渲染到页面中
```

#### 7. Vue生命周期的理解

```js
1. Vue生命周期中会自动绑定this上下文到实例中，因此不能用箭头函数定义生命周期方法
2. beforeCreate --> created：初始化Vue实例，进行数据观测
    - 初始化inject
    - 初始化state：props --> methods --> data --> computed --> initWatch
    - (data中可以使用props的值)
    - 初始化provide
    - (组件实例还未创建，通常用于插件开发中执行初始化任务)

3. created：(编译template模板，生成ast语法树；优化ast，标记静态节点；根据ast生成render函数)
    - 完成数据观测，属性和方法的运算，watch，event事件回调的配置
    - 可调用methods的方法，访问和修改data数据触发响应式渲染dom，可通过computed和watch完成数据计算
    - $el没有被创建，无法访问dom元素
    - (组件初始化完毕，数据可使用，常用于异步获取数据)

4. created --> beforeMount：
    - 判断是否存在el选项，不存在则停止编译，直到调vm.$mount($el)才会继续编译
    - 优先级：render > template > outerHTML
    - vm.el 获取到的是挂载DOM的

5. beforeMount：
    - vm.el已完成DOM初始化，可获取到vm.el，但并未挂载到el选项上
    - (未执行渲染，更新，dom未创建)

6. beforeMount --> mounted：
    - vm.el完成挂载，vm.$el生成的DOM替换了el选项所对应的DOM

7. mounted：
    - vm.el已完成DOM的挂载与渲染，可以获取vm.$el
    - (初始化结束，dom创建完毕，可访问dom元素)

8. beforeUpdate：
    - view层未更新
    - 在此阶段中再修改数据，不会再次触发更新方法
    - (可获取更新前各种状态)

9. updated：
    - 完成view层的更新
    - 在此阶段中再修改数据，会再次触发更新方法(beforeUpdate, updated)
    - (更新后，所有状态已是最新)

10. beforeDestroy：
    - 实例销毁前，此时实例属性和方法仍可用
    - (可用于一些定时器或订阅的取消)

11. destroyed：
    - 实例销毁，解绑全部指令与事件监听器
    - 并不能清楚DOM，只是销毁实例
```

#### 8. v-if和v-for相关

```js
1. 同一标签中同时使用v-if和v-for，vue2中v-for优先级高，源码中先判断v-for后判断v-if；而vue3中v-if优先级高

2. 不要把v-if和v-for同时用同在一个元素上(每次渲染都会先循环再条件判断)

3. 将v-if写在v-for的外层template标签上

4. 用computed提前过滤掉那些不需要显示的项
```

#### 9. SPA首屏渲染慢如何解决

```js
1. 利用DOMContentLoad 或 performance计算首屏加载时间

    //方案一：
    document.addEventListener('DOMContentLoaded', (event) => {
        console.log('first contentful painting');
    });
    
    // 方案二：
    performance.getEntriesByName("first-contentful-paint")[0].startTime
    // performance.getEntriesByName("first-contentful-paint")[0]
    // 会返回一个 PerformancePaintTiming的实例，结构如下：
    {
      name: "first-contentful-paint",
      entryType: "paint",
      startTime: 507.80000002123415,
      duration: 0,
    };

2. 加载慢的原因：
    - 网络延时
    - 资源文件体积过大
    - 资源是否重复请求加载
    - 加载脚本时，渲染内容阻塞

3. 解决方案：

    - 减小入口文件体积

        路由懒加载，把不同路由对应的组件分割成不同的代码块，待路由被请求的时候会单独打包路由，使得入口文件变小，加载速度大大增加
        
        //vue-router配置路由的时候，采用动态加载路由的形式
        routes:[ 
            path: 'Blogs',
            name: 'ShowBlogs',
            component: () => import('./components/ShowBlogs.vue')
        ]

    - 静态资源本地缓存

        //后端返回资源问题：
        1. 采用HTTP缓存，设置Cache-Control，Last-Modified，Etag等响应头
        2. 采用Service Worker离线缓存
        
        //前端合理利用localStorage

    - UI框架按需加载

    - 抽离公共库

        //在webpack的config文件中，修改CommonsChunkPlugin的配置
        minChunks: 3
        //minChunks为3表示会把使用3次及以上的包抽离出来，放进公共依赖文件，避免了重复加载组件

    - 图片资源的压缩

    - 开启GZip压缩

        nmp i compression-webpack-plugin -D
        
        // 在vue.config.js中引入并修改webpack配置
        const CompressionPlugin = require('compression-webpack-plugin')
        
        configureWebpack: (config) => {
            if (process.env.NODE_ENV === 'production') {
                    // 为生产环境修改配置...
                config.mode = 'production'
                return {
                    plugins: [new CompressionPlugin({
                        test: /\.js$|\.html$|\.css/, //匹配文件名
                        threshold: 10240, //对超过10k的数据进行压缩
                        deleteOriginalAssets: false //是否删除原文件
                    })]
                }
            }
        })

    - 使用SSR

        1.组件或页面通过服务器生成html字符串，再发送到浏览器
        2.从头搭建一个服务端渲染是很复杂的，vue应用建议使用Nuxt.js实现服务端渲染
```

#### 10. data属性为什么是一个函数

```js
1. **根实例**中定义data时既可以是函数，也可以是对象
    - (根实例是单例，不会产生数据污染情况)；
2. **组件**中定义data属性只能是函数
    - (多个组件实例，对象是引用类型，共用一个data会污染数据)
    - (函数不一样，initData时会将其作为工厂函数，每次都会返回全新data对象)
```

#### 11. Vue2中响应式数据的缺点及解决方法

```js
1. 缺点：
    - 无法检测数组/对象的新增
    - 无法检测通过索引修改数组的操作【this.items[indexOfItem] = newValue】(Object.defineProperty是可以检测到通过索引改变数组的操作，只是由于性能问题，vue没有做该功能的实现)

2. 如果给data中的对象新增一个属性，页面情况？
    - 数据会变，但页面并不会更新：
        - 一开始data中的属性都经过Object.defineProperty()设置成响应式，因此data中数据变化，会进行拦截
        - 但直接给data添加一个新的属性，并没有通过defineProperty()设置成响应式

3. 解决方法：

    - Vue.set(obj, key, value) / this.$set(Vue.set的别名)：

        //通过Vue.set向响应式对象中添加一个property，并确保这个新 property同样是响应式的，且触发视图更新
        原理：
        无非再次调用defineReactive方法，实现新增属性的响应式，关于defineReactive方法，内部还是通过Object.defineProperty实现属性拦截
        function defineReactive(obj, key, val) {
            Object.defineProperty(obj, key, {
                get() {
                    console.log(`get ${key}:${val}`);
                    return val
                },
                set(newVal) {
                    if (newVal !== val) {
                        console.log(`set ${key}:${newVal}`);
                        val = newVal
                    }
                }
            })
        }

    - 对于数组可使用splice：vue重写splice可以监听
        - 重写的数组方法： push() / pop() / shift() / unshift() / splice() / sort() / reverse()

    - Object.assign()：

        //直接使用Object.assign()添加到对象的新属性不会触发更新
        //应创建一个新的对象，合并原对象和混入对象的属性
        this.someObject =  Object.assign({},this.someObject,{newProperty1:1,newProperty2:2 ...})

    - $forceUpdate()：

        - 仅仅影响实例本身和插入插槽内容的子组件，而不是所有子组件。

3. 小结：
    - 如果为对象添加少量的新属性，可以直接采用`Vue.set()`
    - 如果需要为新对象添加大量的新属性，则通过`Object.assign()`创建新对象
    - 如果你实在不知道怎么操作时，可采取`$forceUpdate()`进行强制刷新 (不建议)
    - `vue3`是用过`proxy`实现数据响应式的，直接动态添加新属性仍可以实现数据响应式
```

#### 12. Vue中组件和插件的区别

```js
1. 组件：

    - 降低整个系统的耦合度

    - 调试方便

    - 提高可维护性

    -

    - 编写组件：

        // 可以通过template属性来编写一个组件，如果组件内容多，我们可以在外部定义template组件内容，如果组件内容并不多，我们可直接写在template属性上
        
        <template id="testComponent">     // 组件显示的内容
            <div>component!</div>   
        </template>
        
        Vue.component('componentA',{ 
            template: '#testComponent'  
            template: `<div>component</div>`  // 组件内容少可以通过这种形式
        })

2. 插件：

    - 添加全局方法或者属性。如: `vue-custom-element`

    - 添加全局资源：指令/过滤器/过渡等。如 `vue-touch`

    - 通过全局混入来添加一些组件选项。如`vue-router`

    - 添加 `Vue` 实例方法，通过把它们添加到 `Vue.prototype` 上实现。

    - 一个库，提供自己的 `API`，同时提供上面提到的一个或多个功能。如`vue-router`

    -

    - 编写插件：

        // vue插件的实现应该暴露一个 install 方法。这个方法的第一个参数是 Vue 构造器，第二个参数是一个可选的选项对象
        MyPlugin.install = function (Vue, options) {
          // 1. 添加全局方法或 property
          Vue.myGlobalMethod = function () {
            // 逻辑...
          }
          // 2. 添加全局资源
          Vue.directive('my-directive', {
            bind (el, binding, vnode, oldVnode) {
              // 逻辑...
            }
            ...
          })
          // 3. 注入组件选项
          Vue.mixin({
            created: function () {
              // 逻辑...
            }
            ...
          })
          // 4. 添加实例方法
          Vue.prototype.$myMethod = function (methodOptions) {
            // 逻辑...
          }
        }

3. 区别：

    - 组件注册：全局注册 / 局部注册

        // 全局注册通过Vue.component方法，第一个参数为组件的名称，第二个参数为传入的配置项
        Vue.component('my-component-name', { /* ... */ })
        
        // 局部注册只需在用到的地方通过components属性注册一个组件
        const component1 = {...} // 定义一个组件
        export default {
         components:{
          component1   // 局部注册
         }
        }

    - 插件注册：

        // 插件的注册通过Vue.use()的方式进行注册（安装），第一个参数为插件的名字，第二个参数是可选择的配置项
        Vue.use(插件名字,{ /* ... */} )
        
        注册插件的时候，需要在调用 new Vue() 启动应用之前完成
        Vue.use会自动阻止多次注册相同插件，只会注册一次
```

#### 13. Vue组件之间的通信方式

```js
1. 父子间通信：

    - props与$emit：

        - 子组件设置props属性，接收父组件传过来的参数
        - 子组件通过$emit触发事件，父组件绑定监听器获取参数

        //父组件：
        <Children name:"jack" age=18 @add='addFunc($event)'/>
        
        //子组件：
        props:{  
            // 字符串形式  
         name:String // 接收的类型参数  
            // 对象形式  
            age:{    
                type:Number, // 接收的类型为数值 
                default:18,  // 默认值为18  
               require:true // age属性必须传递  
            }  
        }  
        this.$emit('add', good)

    - ref：

        - 父组件在使用子组件的时候设置`ref`
        - 父组件通过设置子组件`ref`来获取数据

        <Children ref="foo" /> 
        this.$refs.foo  // 获取子组件实例，通过子组件实例我们就能拿到对应的数据  

2. 兄弟间通信：

    - EventBus：创建一个中央时间总线EventBus

        - 兄弟组件通过`$emit`触发自定义事件，`$emit`第二个参数为传递的数值(传递数据的一方)
        - 另一个兄弟组件通过`$on`监听自定义事件(获取数据的一方)

        // 另一种方式  
        Vue.prototype.$bus = new Vue() // Vue已经实现了Bus的功能 
        
        // 兄弟组件1：
        this.$bus.$emit('foo', data)；
        
        // 兄弟组件2：
        this.$bus.$on('foo', this.handle)

    - $parent / $root：

        - 通过共同祖辈`$parent`或者`$root`搭建通信侨联

        // 兄弟组件1：
        this.$parent.emit('add');
        
        // 兄弟组件2：
        this.$parent.on('add',this.add);

3. 祖孙与后代间通信：(祖父--儿子--孙子) (祖父-- ... --后代组件)

    - $attrs / $listeners：

        - 设置批量向下传属性`$attrs`和 `$listeners`
        - 包含了父级作用域中不作为 `prop` 被识别 (且获取) 的特性绑定 ( class 和 style 除外)
        - 可以通过 `v-bind="$attrs"` 传⼊内部组件

        // 祖父组件引用儿子组件：
        <Child msg="lalala" @some-event="onSomeEvent"></Child>
        
        // 儿子组件引用孙子组件：(类似消息中介,需设置$attrs, $listeners)
        <Grandson v-bind="$attrs" v-on="$listeners"></Grandson>
        
        // 孙子组件：(触发祖父自定义的事件)
        <div @click="$emit('some-event', 'msg from grandson')">  
        {{msg}}  
        </div>  

    - provide / inject：

        - 祖先组件定义`provide`属性，返回传递的值
        - 后代组件通过`inject`接收组件传递过来的值

        // 祖先组件：
        provide(){  
            return {  
                foo:'foo'  
            }  
        }  
        
        // 后代组件：
        inject:['foo'] // 获取到祖先组件传递过来的值  

4. 非关系组件间通信：

    - Vuex(存储共享变量的容器 )：复杂关系的组件数据传递

        1. state用来存放共享变量的地方
        2. getter，可以增加一个getter派生状态，(相当于store中的计算属性），用来获得共享变量的值
        3. mutations用来存放修改state的方法(同步)
        4. actions也是用来存放修改state的方法，不过action是在mutations的基础上进行。常用来做一些异步操作
```

#### 14. 双向数据绑定的原理

```js
1. 理解ViewModel：
    - 数据变化后更新视图
    - 视图变化后更新数据
    - 监听器（Observer）：对所有数据的属性进行监听
    - 解析器（Compiler）：对每个元素节点的指令进行扫描跟解析,根据指令模板替换数据,以及绑定相应的更新函数

// 1. 先来一个构造函数：执行初始化，对data执行响应化处理
class Vue {  
  constructor(options) {  
    this.$options = options;  
    this.$data = options.data;     
    // 对data选项做响应式处理  
    observe(this.$data);      
    // 代理data到vm上  
    proxy(this);  
    // 执行编译  
    new Compile(options.el, this);  
  }  
}  

// 对data选项执行响应化具体操作
function observe(obj) {  
  if (typeof obj !== "object" || obj == null) {  
    return;  
  }  
  new Observer(obj);  
} 
class Observer {  
  constructor(value) {  
    this.value = value;  
    this.walk(value);  
  }  
  walk(obj) {  
    Object.keys(obj).forEach((key) => {  
      defineReactive(obj, key, obj[key]);  
    });  
  }  
}  

// 2. 编译Compile
class Compile {  
  constructor(el, vm) {  
    this.$vm = vm;  
    this.$el = document.querySelector(el);  // 获取dom  
    if (this.$el) {  
      this.compile(this.$el);  
    }  
  }  
  compile(el) {  
    const childNodes = el.childNodes;   
    Array.from(childNodes).forEach((node) => { // 遍历子元素  
      if (this.isElement(node)) {   // 判断是否为节点  
        console.log("编译元素" + node.nodeName);  
      } else if (this.isInterpolation(node)) {  
        console.log("编译插值⽂本" + node.textContent);  // 判断是否为插值文本 {{}}  
      }  
      if (node.childNodes && node.childNodes.length > 0) {  // 判断是否有子元素  
        this.compile(node);  // 对子元素进行递归遍历  
      }  
    });  
  }  
  isElement(node) {  
    return node.nodeType == 1;  
  }  
  isInterpolation(node) {  
    return node.nodeType == 3 && /\{\{(.*)\}\}/.test(node.textContent);  
  }  
}  

// 3. 依赖收集
1. defineReactive时为每⼀个key创建⼀个Dep实例
2. 初始化视图时读取某个key，例如name1，创建⼀个watcher1
3. 由于触发name1的getter方法，便将watcher1添加到name1对应的Dep中
4. 当name1更新，setter触发时，便可通过对应Dep通知其管理所有Watcher更新

// 负责更新视图
class Watcher{
    constructor(vm, key, updater){
        this.vm = vm;
        this.key = key;
        this.updateFn = updater;
       // 创建实例时，把当前实例指定到Dep.target静态属性上
     Dep.target = this;
  // 读一下key, 触发get
  vm[key];
  //置空
  Dep.target = null;
    }
    
    // 执行dom更新函数，由dep调用的
    update(){
        this.updateFn.call(this.vm, this.vm[this.key])
    } 
}

//声明Dep
class Dep{
    constructor(){
        this.deps = []; // 依赖管理
    }
    addDep(dep){
        this.deps.push(dep)
    }
    notify(){
        this.deps.forEach((dep)=>dep.update());
    }
}

//创建Watcher时触发getter
class Watcher(){
    constructor(vm, key, updateFn){
        Dep.target = this;
        this.vm[this.key];
        Dep.target = null;
    }
}

//依赖收集 创建Dep实例
function definaReactive(obj, key, val){
    this.observe(val);
    const dep = new Dep();
    Object.defineProperty(obj, key, {
        get(){
            //Dep.target 也就是Watcher实例
            Dep.target && dep.addDep(Dep.target);
            return val;
        },
        set(newVal){
            if(newVal === val) return;
            dep.notify();// 通知dep执行更新方法
        }
    })
}
```

#### 15. 谈谈对NextTick的理解：(本质是一种优化策略)

```js
1. 在下次 DOM 更新循环结束之后**执行延迟回调**，修改数据之后立即使用这个方法，获取更新后的 DOM

    (`Vue` 在更新 `DOM` 时是异步执行的。当数据发生变化，`Vue`将开启一个异步更新队列，视图需要**等队列中所有数据变化完成之后**，再统一进行更新)

2. 在修改数据后立刻得到更新后的`DOM`结构，可以使用`Vue.nextTick()`，组件内可使用this.$nextTick()

3. $nextTick会返回一个promise对象,可以用await

    this.message = '修改后的值'
    console.log(this.$el.textContent) // => '原始的值'
    await this.$nextTick()
    console.log(this.$el.textContent) // => '修改后的值'

4. 实现原理：

    - 执行异步延迟函数:

        - 当前环境支持什么方法就用什么
        - Promise.then
        - MutationObserver
        - setImmediate
        - setTimeout

        export let isUsingMicroTask = false
        if (typeof Promise !== 'undefined' && isNative(Promise)) {
          //判断1：是否原生支持Promise
          const p = Promise.resolve()
          timerFunc = () => {
            p.then(flushCallbacks)
            if (isIOS) setTimeout(noop)
          }
          isUsingMicroTask = true
        } else if (!isIE && typeof MutationObserver !== 'undefined' && (
          isNative(MutationObserver) ||
          MutationObserver.toString() === '[object MutationObserverConstructor]'
        )) {
          //判断2：是否原生支持MutationObserver
          let counter = 1
          const observer = new MutationObserver(flushCallbacks)
          const textNode = document.createTextNode(String(counter))
          observer.observe(textNode, {
            characterData: true
          })
          timerFunc = () => {
            counter = (counter + 1) % 2
            textNode.data = String(counter)
          }
          isUsingMicroTask = true
        } else if (typeof setImmediate !== 'undefined' && isNative(setImmediate)) {
          //判断3：是否原生支持setImmediate
          timerFunc = () => {
            setImmediate(flushCallbacks)
          }
        } else {
          //判断4：上面都不行，直接用setTimeout
          timerFunc = () => {
            setTimeout(flushCallbacks, 0)
          }
        }
        
        //无论是微任务还是宏任务，都会放到flushCallbacks使用
        //这里将callbacks里面的函数复制一份，同时callbacks置空
        //依次执行callbacks里面的函数
        
        function flushCallbacks () {
          pending = false
          const copies = callbacks.slice(0)
          callbacks.length = 0
          for (let i = 0; i < copies.length; i++) {
            copies[i]()
          }
        }

    - 小结：

        1. 把回调函数放入callbacks等待执行
        2. 将执行函数放到微任务或者宏任务中
        3. 事件循环到了微任务或者宏任务，执行函数依次执行callbacks中的回调
```

#### 16. 谈谈你对mixin的理解

```js
1. 本质其实就是一个`js`对象，它可以包含我们组件中任意功能选项，如`data`、`components`、`methods`、`created`、`computed`等等

2. 局部混入：

    定义一个mixin对象，有组件options的data、methods属性
    var myMixin = {
      created: function () {
        this.hello()
      },
      methods: {
        hello: function () {
          console.log('hello from mixin!')
        }
      }
    }
    
    组件通过mixins属性调用mixin对象
    Vue.component('componentA',{
      mixins: [myMixin] // 调用
    })

3. 全局混入：

    通过Vue.mixin()进行全局的混入
    Vue.mixin({
      created: function () {
          console.log("全局混入")
        }
    })
    使用全局混入需要特别注意，因为它会影响到每一个组件实例（包括第三方组件）

4. 注意事项：

    - 组件存在与`mixin`对象相同的选项的时候，进行递归合并的时候组件的选项会覆盖`mixin`的选项
    - 如果相同选项为生命周期钩子的时候，会合并成一个数组，先执行`mixin`的钩子，再执行组件的钩子(钩子函数先后执行)

5. 原理分析：

    - 优先递归处理 `mixins`
    - 先遍历合并`parent` 中的`key`，调用`mergeField`方法进行合并，然后保存在变量`options`
    - 再遍历 `child`，合并补上 `parent` 中没有的`key`，调用`mergeField`方法进行合并，保存在变量`options`
    - 通过 `mergeField` 函数进行了合并

    合并策略：
    1.替换型：
     同名的props、methods、inject、computed会被来 者代替
    2.合并型：
     data
     - 当目标 data 对象不包含当前属性时，调用 set方    法进行合并（set方法其实就是一些合并重新赋值的      方法）
     - 当目标 data 对象包含当前属性并且当前值为纯象      时，递归合并当前对象值，这样做是为了防止对存       在新增属性
    3. 队列型：
     全部生命周期和watch
     - 生命周期钩子和watch被合并为一个数组，然后正遍   历一次执行
    4.叠加型：
     叠加型合并有：component、directives、filters
     叠加型主要是通过原型链进行层层的叠加
```

#### 17. 谈谈你对slot的理解

```js
1. `slot`在组件模板中占好了位置，当使用该组件标签时候，组件标签里面的内容就会自动填坑（替换组件模板中`slot`位置），作为承载分发内容的出口
2. 通过`slot`插槽**向组件内部指定位置传递内容**，完成这个复用组件在不同场景的应用
3. 默认插槽：
    - 父组件直接在子组件中写的内容被默认放到子组件插槽位置

4. 具名插槽：

    - 子组件用name区分插槽的位置
    - 父组件在子组件使用时加上v-slot:name(子组件插槽name值)即可

    // 子组件：
    <template>
        <slot>插槽后备的内容</slot>
      <slot name="content">插槽后备的内容</slot>
    </template>
    
    // 父组件：
    <child>
        <template v-slot:default>具名插槽</template>
        <!-- 具名插槽⽤插槽名做参数 -->
        <template v-slot:content>内容...</template>
    </child>

5. 作用域插槽：

    - 子组件在作用域上绑定属性来将子组件的信息传给父组件使用，这些属性会被挂在父组件`v-slot`接受的对象上
    - 父组件中在使用时通过`v-slot:`（简写：#）获取子组件的信息，在内容中使用

    // 子组件：
    <template> 
      <slot name="footer" testProps="子组件的值">
              <h3>没传footer插槽</h3>
        </slot>
    </template>
    
    // 父组件：
    <child> 
        <!-- 把v-slot的值指定为作⽤域上下⽂对象 -->
        <template v-slot:default="slotProps">
          来⾃⼦组件数据：{{slotProps.testProps}}
        </template>
      <template #default="slotProps">
          来⾃⼦组件数据：{{slotProps.testProps}}
        </template>
    </child>

6. 小结：
    - `v-slot`属性只能在`<template>`上使用，但在只有默认插槽时可以在组件标签上使用
    - 默认插槽名为`default`，可以省略default直接写`v-slot`
    - 缩写为`#`时不能不写参数，写成`#default`
    - 可以通过解构获取`v-slot={user}`，还可以重命名`v-slot="{user: newName}"`和定义默认值`v-slot="{user = '默认值'}"`
```

#### 18. 谈谈你对Vue.observable的理解

```js
1. 让一个对象变成响应式数据，`Vue` 内部会用它来处理 `data` 函数返回的对象
```

#### 19. 常用的修饰符有哪些

```js
1. 表单修饰符：

    - lazy：

        在我们填完信息，光标离开标签的时候，才会将值赋予给value，也就是在change事件之后再进行信息同步
        // <input type="text" v-model.lazy="value">
        // <p>{{value}}</p>

    - trim：

        自动过滤用户输入的首空格字符，而中间的空格不会过滤
        // <input type="text" v-model.trim="value">

    - number：

        自动将用户的输入值转为数值类型，但如果这个值无法被parseFloat解析，则会返回原来的值
        // <input v-model.number="age" type="number">

2. **事件修饰符**：对事件捕获以及目标进行了处理

    - stop：

        阻止了事件冒泡，相当于调用了event.stopPropagation方法
        // <div @click="shout(2)">
        //   <button @click.stop="shout(1)">ok</button>
        //</div>

    - prevent：

        阻止了事件的默认行为，相当于调用了event.preventDefault方法
        // <form v-on:submit.prevent="onSubmit"></form>

    - self：

        只当在 event.target 是当前元素自身时触发处理函数
        // <div v-on:click.self="doThat">...</div>
        
        用 v-on:click.prevent.self 会阻止所有的点击，而 v-on:click.self.prevent 只会阻止对元素自身的点击

    - once：

        绑定了事件以后只能触发一次，第二次就不会触发
        // <button @click.once="shout(1)">ok</button>

    - capture：向下捕获

        使事件触发从包含这个元素的顶层开始往下触发
        
        /* <div @click.capture="shout(1)">
            obj1
            <div @click.capture="shout(2)">
                obj2
                <div @click="shout(3)">
                    obj3
                    <div @click="shout(4)">
                        obj4
                    </div>
                </div>
            </div>
        </div> */

        // 输出结构: 1 2 4 3 

    - passive：

        移动端，当我们在监听元素滚动事件的时候，会一直触发onscroll事件会让我们的网页变卡，因此我们使用这个修饰符的时候，相当于给onscroll事件整了一个.lazy修饰符
        <!-- 滚动事件的默认行为 (即滚动行为) 将会立即触发 -->
        <!-- 而不会等待 `onScroll` 完成  -->
        <!-- 这其中包含 `event.preventDefault()` 的情况 -->
        // <div v-on:scroll.passive="onScroll">...</div>

    - native：

        让组件变成像html内置标签那样监听根元素的原生事件，否则组件上使用 v-on 只会监听自定义事件
        // <my-component v-on:click.native="doSomething"></my-component>
        使用.native修饰符来操作普通HTML标签是会令事件失效的

3. **鼠标按钮修饰符**：

    - left 左键点击

    - right 右键点击

    - middle 中键点击

        /* <button @click.left="shout(1)">ok</button>
        <button @click.right="shout(1)">ok</button>
        <button @click.middle="shout(1)">ok</button> */

4. **键盘修饰符**：用来修饰键盘事件（`onkeyup`，`onkeydown`）的

    - 普通键（enter、tab、delete、space、esc、up...）
    - 系统修饰键（ctrl、alt、meta、shift...）

    // 只有按键为keyCode的时候才触发
    // <input type="text" @keyup.keyCode="shout()">
    
    还可以通过以下方式自定义一些全局的键盘码别名
    Vue.config.keyCodes.f2 = 113

5. **v-bind修饰符**：主要是为属性进行操作

    - async：能对`props`进行一个双向绑定

    // 父组件
    // <comp :myMessage.sync="bar"></comp> 
    // 子组件
    // this.$emit('update:myMessage',params);
    
    以上这种方法相当于以下的简写:
    // 父亲组件
    // <comp :myMessage="bar" @update:myMessage="func"></comp>
    func(e){
     this.bar = e;
    }
    // 子组件js
    func2(){
      this.$emit('update:myMessage',params);
    }
    
    1. 使用sync的时候，子组件传递的事件名格式必须为update:value，其中value必须与子组件中props中声明的名称完全一致
    2. 注意带有 .sync 修饰符的 v-bind 不能和表达式一起使用
    3. 将 v-bind.sync 用在一个字面量的对象上，例如 v-bind.sync=”{ title: doc.title }”，是无法正常工作的

    - props：

    设置自定义标签属性，避免暴露数据，防止污染HTML结构
    // <input id="uid" title="title1" value="1" :index.prop="index">

    - camel：

    将命名变为驼峰命名法，如将view-Box属性名转换为 viewBox
    // <svg :viewBox="viewBox"></svg>
```

#### 20. 自定义指令相关

```js
1. 指令的几种方式：

    //会实例化一个指令，但这个指令没有参数 
    `v-xxx`
    
    // -- 将值传到指令中
    `v-xxx="value"`  
    
    // -- 将字符串传入到指令中，如`v-html="'<p>内容</p>'"`
    `v-xxx="'string'"` 
    
    // -- 传参数（`arg`），如`v-bind:class="className"`
    `v-xxx:arg="value"` 
    
    // -- 使用修饰符（`modifier`）
    `v-xxx:arg.modifier="value"`

2. 全局注册：Vue.directive('name', { })

    // 注册一个全局自定义指令 `v-focus`
    Vue.directive('focus', {
      // 当被绑定的元素插入到 DOM 中时……
      inserted: function (el) {
        // 聚焦元素
        el.focus()  // 页面加载完成之后自动让输入框获取到焦点的小功能
      }
    })

3. 局部注册：在组件`options`选项中设置`directives`属性\

    directives: {
      focus: {
        // 指令的定义
        inserted: function (el) {
          el.focus() // 页面加载完成之后自动让输入框获取到焦点的小功能
        }
      }
    }
    
    // 使用
    <input v-focus />

4. 钩子函数：

    bind：只调用一次，指令第一次绑定到元素时调用。在这里可以进行一次性的初始化设置
    
    inserted：被绑定元素插入父节点时调用 (仅保证父节点存在，但不一定已被插入文档中)
    
    update：所在组件的 VNode 更新时调用，但是可能发生在其子 VNode 更新之前。指令的值可能发生了改变，也可能没有。但是你可以通过比较更新前后的值来忽略不必要的模板更新
    
    componentUpdated：指令所在组件的 VNode 及其子 VNode 全部更新后调用
    
    unbind：只调用一次，指令与元素解绑时调用
    
    // 所有的钩子函数的参数都有以下：
    // (el, binding, vnode, oldVnode)
    el：指令所绑定的元素，可以用来直接操作 DOM
    
    binding：一个对象
    {
       name：指令名，不包括 v- 前缀
       value：指令的绑定值，例如：v-my-directive="1 + 1" 中，绑定值为 2
       oldValue：指令绑定的前一个值，仅在 update 和 componentUpdated 钩子中可用。无论值是否改变都可用
       expression：字符串形式的指令表达式。例如 v-my-directive="1 + 1" 中，表达式为 "1 + 1"
       arg：传给指令的参数，可选。例如 v-my-directive:foo 中，参数为 "foo"
       modifiers：一个包含修饰符的对象。例如：v-my-directive.foo.bar 中，修饰符对象为 { foo: true, bar: true }
    }
    
    vnode：Vue 编译生成的虚拟节点
    oldVnode：上一个虚拟节点，仅在 update 和 componentUpdated 钩子中可用
    
    // 除了 el 之外，其它参数都应该是只读的，切勿进行修改。如果需要在钩子之间共享数据，建议通过元素的 dataset 来进行

5. 例子：

    - 1. 设置v-throttle自定义指令
    Vue.directive('throttle', {
      bind: (el, binding) => {
        let throttleTime = binding.value; // 防抖时间
        if (!throttleTime) { // 用户若不设置防抖时间，则默认2s
          throttleTime = 2000;
        }
        let cbFun;
        el.addEventListener('click', event => {
          if (!cbFun) { // 第一次执行
            cbFun = setTimeout(() => {
              cbFun = null;
            }, throttleTime);
          } else {
            event && event.stopImmediatePropagation();
          }
        }, true);
      },
    });
    // 为button标签设置v-throttle自定义指令
    <button @click="sayHello" v-throttle>提交</button>

    - 2. 图片懒加载
    const LazyLoad = {
        // install方法
        install(Vue,options){
           // 代替图片的loading图
            let defaultSrc = options.default;
            Vue.directive('lazy',{
                bind(el,binding){
                    LazyLoad.init(el,binding.value,defaultSrc);
                },
                inserted(el){
                    // 兼容处理
                    if('IntersectionObserver' in window){
                        LazyLoad.observe(el);
                    }else{
                        LazyLoad.listenerScroll(el);
                    }
                    
                },
            })
        },
        // 初始化
        init(el,val,def){
            // data-src 储存真实src
            el.setAttribute('data-src',val);
            // 设置src为loading图
            el.setAttribute('src',def);
        },
        // 利用IntersectionObserver监听el
        observe(el){
            let io = new IntersectionObserver(entries => {
                let realSrc = el.dataset.src;
                if(entries[0].isIntersecting){
                    if(realSrc){
                        el.src = realSrc;
                        el.removeAttribute('data-src');
                    }
                }
            });
            io.observe(el);
        },
        // 监听scroll事件
        listenerScroll(el){
            let handler = LazyLoad.throttle(LazyLoad.load,300);
            LazyLoad.load(el);
            window.addEventListener('scroll',() => {
                handler(el);
            });
        },
        // 加载真实图片
        load(el){
            let windowHeight = document.documentElement.clientHeight
            let elTop = el.getBoundingClientRect().top;
            let elBtm = el.getBoundingClientRect().bottom;
            let realSrc = el.dataset.src;
            if(elTop - windowHeight<0&&elBtm > 0){
                if(realSrc){
                    el.src = realSrc;
                    el.removeAttribute('data-src');
                }
            }
        },
        // 节流
        throttle(fn,delay){
            let timer; 
            let prevTime;
            return function(...args){
                let currTime = Date.now();
                let context = this;
                if(!prevTime) prevTime = currTime;
                clearTimeout(timer);
                
                if(currTime - prevTime > delay){
                    prevTime = currTime;
                    fn.apply(context,args);
                    clearTimeout(timer);
                    return;
                }
    
                timer = setTimeout(function(){
                    prevTime = Date.now();
                    timer = null;
                    fn.apply(context,args);
                },delay);
            }
        }
    
    }
    export default LazyLoad;

    - 3. 一键复制
    import { Message } from 'ant-design-vue';
    
    const vCopy = { //
      /*
        bind 钩子函数，第一次绑定时调用，可以在这里做初始化设置
        el: 作用的 dom 对象
        value: 传给指令的值，也就是我们要 copy 的值
      */
      bind(el, { value }) {
        el.$value = value; // 用一个全局属性来存传进来的值，因为这个值在别的钩子函数里还会用到
        el.handler = () => {
          if (!el.$value) {
          // 值为空的时候，给出提示，我这里的提示是用的 ant-design-vue 的提示，你们随意
            Message.warning('无复制内容');
            return;
          }
          // 动态创建 textarea 标签
          const textarea = document.createElement('textarea');
          // 将该 textarea 设为 readonly 防止 iOS 下自动唤起键盘，同时将 textarea 移出可视区域
          textarea.readOnly = 'readonly';
          textarea.style.position = 'absolute';
          textarea.style.left = '-9999px';
          // 将要 copy 的值赋给 textarea 标签的 value 属性
          textarea.value = el.$value;
          // 将 textarea 插入到 body 中
          document.body.appendChild(textarea);
          // 选中值并复制
          textarea.select();
          // textarea.setSelectionRange(0, textarea.value.length);
          const result = document.execCommand('Copy');
          if (result) {
            Message.success('复制成功');
          }
          document.body.removeChild(textarea);
        };
        // 绑定点击事件，就是所谓的一键 copy 啦
        el.addEventListener('click', el.handler);
      },
      // 当传进来的值更新的时候触发
      componentUpdated(el, { value }) {
        el.$value = value;
      },
      // 指令与元素解绑的时候，移除事件绑定
      unbind(el) {
        el.removeEventListener('click', el.handler);
      },
    };
    
    export default vCopy;
```

#### 21. vue中key相关

```js
1. key是每个vnode的唯一节点，也是diff算法的一种优化策略，根据key，更快速准确的找到对应vnode节点(减少对页面的dom操作，提高diff效率)
```

#### 22. vue的过滤器相关(vue2)

```js
1. 过滤器可以用在两个地方：双花括号插值和 `v-bind` 表达式，过滤器应该被添加在 `JavaScript`表达式的尾部，由“管道”符号指示：

    <!-- 在双花括号中 -->
    {{ message | capitalize }}
    
    <!-- 在 `v-bind` 中 -->
    <div v-bind:id="rawId | formatId"></div>
    
    过滤器是 JavaScript函数，因此可以接收参数：
    {{ message | filterA('arg1', arg2) }}
    filterA 被定义为接收三个参数的过滤器函数

2. 局部过滤器：

    filters: {
      capitalize: function (value) {
        if (!value) return ''
        value = value.toString()
        return value.charAt(0).toUpperCase() + value.slice(1)
      }
    }

3. 全局过滤器：

    Vue.filter('capitalize', function (value) {
      if (!value) return ''
      value = value.toString()
      return value.charAt(0).toUpperCase() + value.slice(1)
    })
    
    new Vue({
      // ...
    })
    
    // 当全局过滤器和局部过滤器重名时，会采用局部过滤器
```

#### 23. 虚拟DOM相关

```js
1. 抽象化真实DOM，表现为一个JS对象，用对象的属性描述节点，主要包括标签名(tag)，属性(attrs)，子元素(children)三个属性
2. 更新节点时，虚拟dom并不会立即操作DOM，而是将多次更新的diff内容保存到本地js对象，最终将js对象一次性attach到DOM树上
```

#### 24. vue的diff算法

```js
1. 同层级进行, 不会跨层级比较；diff比较的过程中，循环从两边向中间比较

2. 作用于虚拟 `dom` 渲染成真实 `dom` 的新旧 `VNode`节点比较

3. 比较方式：

    - 深度优先，同层比较

    diff算法优化策略：

    ​    \1. 新前 旧前

    ​    \2. 新后 旧后

    ​    \3. 新后 旧前 (旧前节点，移动到旧后之后)

    ​    \4. 新前 旧后 (旧后节点，移动到旧前之前)

 4. 总结：
    - 在Vue类的构造器里进行观测数据observe，初始化Watcher类,并将Watcher本身赋值给Dep.target；模板编译
    - 通过Observer类将每层属性转成响应式的对象，添加一个_ob_属性(对象的话直接进行响应式添加,数组可能需要遍历再添加)
    (数组通过原型式继承原来的方法，并改写了7个，添加dep的notify方法)
        - new一个Dep类，作用是管理订阅者，通知更新
        - 定义响应式中get中通过dep实例依赖收集，添加订阅者；set中通过dep实例通知更新
        - Watcher类开始更新视图
 
    - h函数将template模板转为js对象描述(标签名，属性，子元素)
    - patch函数进行节点对比，同一节点开始详细对比，不同节点直接新建新节点，插入旧节点之前，删除旧节点
    - 节点对比有无文本，新节点有文本直接innerText替换旧文本，新旧若都有子节点，那就diff比较；新有子节点，旧无，则新建子节点appendChild
    - diff 比较 四优化策略
```

#### 25. Vue中如何解决跨域

```js
1. CORS(跨域资源共享)：
    - 一系列传输的HTTP头组成，HTTP头决定浏览器是否阻止前端获取请求响应
    - 只需增加一些http头，让服务器能声明允许的访问来源(后端)

// 以koa框架举例:
app.use(async (ctx, next)=> {
  ctx.set('Access-Control-Allow-Origin', '*');
  ctx.set('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderField');
  ctx.set('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
  if (ctx.method == 'OPTIONS') {
    ctx.body = 200; 
  } else {
    await next();
  }
})

2. Proxy：

    - vue.config.js配置

    我们可以通过webpack为我们起一个本地服务器作为请求的代理对象
    通过该服务器转发请求至目标服务器，得到结果再转发给前端，但是最终发布上线时如果web应用和接口服务器不在一起仍会跨域
    
    在vue.config.js文件，新增以下代码:
    module.exports = {
        devServer: {
            host: '127.0.0.1',
            port: 8084,
            open: true,// vue项目启动时自动打开浏览器
            proxy: {
                '/api': { // '/api'是代理标识，用于告诉node，url前面是/api的就是使用代理的
                    target: "http://xxx.xxx.xx.xx:8080", //目标地址，一般是指后台服务器地址
                    changeOrigin: true, //是否跨域
                    pathRewrite: { // pathRewrite 的作用是把实际Request Url中的'/api'用""代替
                        '^/api': "" 
                    }
                }
            }
        }
    }
    
    通过axios发送请求中，配置请求的根路径:
    axios.defaults.baseURL = '/api'

    - 通过nginx配置：

    server {
        listen    80;
        # server_name www.josephxia.com;
        location / {
            root  /var/www/html;
            index  index.html index.htm;
            try_files $uri $uri/ /index.html;
        }
        location /api {
            proxy_pass  http://127.0.0.1:3000;
            proxy_redirect   off;
            proxy_set_header  Host       $host;
            proxy_set_header  X-Real-IP     $remote_addr;
            proxy_set_header  X-Forwarded-For  $proxy_add_x_forwarded_for;
        }
    }
```

#### 26. Vue中computed和watch的区别

```js
1. computed：
    - 基于【data中声明】过的或【父组件传递的props】计算得到的新值(依赖其他属性计算而来)
    - 属性名不可与data中声明的重复
    - 属性值是函数时，默认走get方法，必须有返回值，切返回值即为属性的属性值
    - 属性被使用时，才会执行computed代码，默认会缓存计算结果，当依赖的发生变化时才会重新计算，否则返回缓存结果

    data:{
        first: 123,
        last: 234
    },
    computed:{
        count:function(){
            return this.first + this.last
        }
    }

    - 高级用法：拥有get和set方法
    computed:{
        count:{
            get(){
                return this.first + this.last
            },
            set(val){
                // val为新值
                this.first = val.split('')[0]
                this.last = val.split('')[1]
            }
        }
    }

2. watch：
    - 监听Vue实例上的属性变化(data，props，computed)
    - 支持异步的，不支持缓存
    watch:{
        first:function(val, old){
            // val为新值; old为旧值
            this.count = val + this.last
        }
    }

    - 高级用法：
    watch:{
        first: {
            handler(newVal,old){
                console.log(newVal, old)
            },
            // 是否监听对象内部的变化
            deep: true,
            // 是否第一次就监听执行
            immediate: true
        }
    }

    - 监听对象单个属性的变化：
        - 直接监听对象的属性 
            watch:{
                obj.first: function(val, old){
                    console.log(val,old)
                }
            }

        - 与computed配合使用：computed返回想要监听的属性值，watch用来监听
            computed: {
                firstChange(){
                    return obj.first
                }
            }
            watch: {
                firstChange(val,old){
                    console.log(val,old)
                }
            }
```

#### 27. Vue中keep-alive相关

```js
1. <keep-alive>是Vue的内置组件，会缓存不活动的组件实例，而不是销毁它们；本身是一个抽象组件，不会渲染为DOM元素，也不会出现在父组件链中

2. include：字符串 / 正则 / 数组
    - 指定哪些组件被缓存
    - 指定多个被缓存

    // 指定home组件和about组件被缓存
    <keep-alive include="home,about">
        <router-view> </router-view>
    </keep-alive>

3. exclude：字符串 / 正则 / 数组
    - 指定组件不被缓存
    - 指定多个不被缓存

    // 除了home组件和about组件别的都缓存
    <keep-alive exclude="home,about" >
        <router-view></router-view>
    </keep-alive>
```

### Vue-Router相关

#### 1. Vue-Router的懒加载方法

```js
1. 正常非懒加载：
    import XXX from 'xxx.vue'
    const router = new VueRouter({
        routes:[
            {
                path: 'xxx',
                component: XXX
            }
        ]
    })

2. 方法一(常用)：箭头函数 + import动态加载
    const XXX = () => import('xxx.vue')
    const router = new VueRouter({
        routes:[
            {
                path: 'xxx',
                component: XXX
            }
        ]
    })

3. 方法二：箭头函数 + require()
    const router = new VueRouter({
        routes:[
            path: 'xxx',
            component: resolve => require(['xxx'], resolve)
        ]
    })

4. 方法三：使用webpack的require.ensure；该情况下，多路由指定相同的chunkName，会合并打包成一个js文件
    const XXX = resolve => require.ensure([], () => resolve('xxx'))
    const router = new VueRouter({
        routes:[
            path: 'xxx',
            component: XXX,
            name:'xxx'
        ]
    })
```

#### 2. Vue-Router的 hash模式 和 history模式

```js
1. hash模式：
    // http://www.abc.com/#/vue
    - hash值为#后面的内容：#/vue
    - hash值会出现在url中，但不会出现在HTTP请求中
    - 改变hash值不会重载页面，hash值变化对应的url都会被浏览器记录下来，可以实现页面的前进和后退
    - 主要原理就是onhashchange事件
        window.onhashchange = function(e){

        }

2. history模式：分两部分(切换历史状态；修改历史状态)
    - 切换历史状态：forward()、back()、go() 对应浏览器前进 后退 跳转
    - 修改历史状态：pushState()、replaceState() 可以对浏览器历史记录进行修改，改变url，但不会立即像后端发送请求(改变url不会刷新页面)

3. 两种方式的对比：
    - pushState设置的新URL可以与当前URL同源的任意URL；hash只修改 # 后面的部分，因此只能设置与当前URL同文档的URL
    - pushState设置的新URL可与旧的一样，也会记录到栈中；hash必须不同的值才会记录
    - pushState通过stateObject可设置任意类型的数据到记录中；hash只能添加短字符串
    - hash模式下仅hash符号之前的会在请求中，如果没有对路由的全覆盖，也不会报404错误；history下，前端url需和请求的url一致，如没有对应的路由则会报404
```

#### 3. 获取页面的hash变化

```js
1. 监听$route的变化：
    watch:{
        $route:{
            handler:(val,old){
                console.log(val)
            },
            deep:true
        }
    }


2. window.location.hash：可以读取值也可以设置值
```

#### 4. $route 和 $router 的区别

```js
1. $route：路由信息对象，是只读不可变的(可监听)
    - fullpath：'' // 路由完整路径
    - hash：'' // 路由的hash值(锚点)
    - mathced：[] // 当前路由的所有嵌套路径片段的路由记录
    - meta：{} // 路由文件中自定义的meta内容
    - name：'' // 路由名称
    - params：{} // 
    - path：'' // 当前路由的路径
    - query：{} // 表示URL查询参数，跟随在路径后？的参数

2. $router：路由实例对象，包含了路由跳转方法，钩子函数等
    // 导航守卫
    router.beforeEach((to, from, next) => {
        /* 需调用next() */
    })

    router.beforeResolve((to, from, next) => {
        /* 需调用next() */
    })

    router.afterEach((to, from) => {

    })

    router.push / router.replace / router.go / router.back / router.forward

```

#### 5. 路由传参及获取参数相关

```js
1. params方式：
    - /router/:id

    - 路由定义：
        <router-link :to="'/user/+userId" replace> 用户 </router-link>

        {
            path: '/user/:userId',
            component: User
        }

    - 路由跳转：
        - <router-link :to="{name: 'users', params: {name: jian}}"> 按钮 </router-link>

        - this.$router.push({
            name: 'users',
            params: {
                name: jian
            }
        })

        - this.$router.push('/user/' + jian)

    - 参数获取：
        - this.params.xxx

2. query方式：
    - /route?id=123

    - 路由定义：
        <router-link :to="{path: '/profile',query: {name: jian}}">测试</router-link>

    - 跳转方法：
        - <router-link :to="{name: 'users', query: {name: jian}}">测试</router-link>

        - <router-link :to="{path: '/users',query: {name: jian}}">测试</router-link>

        - this.$router.push({
            name: 'users',
            query: {
                name: jian
            }
        })

        - this.$router.push({
            path: '/user',
            query: {
                name: jian
            }
        })

        - this.$router.push('/user?name=' + jian)

    - 参数获取：
        - this.$route.query

```

#### 6. Vue-Router路由钩子

```js
1. 全局路由钩子：
    // 全局前置守卫：进路由之前
    - router.beforeEach((to, from, next) => {
        // to：即将要进入的目标
        // from：当前要离开的路由
        // next：可选参数，可传递指定路由

        // 返回 false 取消导航
        return false
    })

    // 全局解析守卫：在beforeRouteEnter 调用之后调用 (在所有组件内守卫和异步路由组件被解析之后，解析守卫就被正确调用)
    - router.beforeResolve(() => {
        // 获取数据或执行其他操作的钩子
    })

    // 全局后置钩子：进路由之后 (对于分析、更改页面标题、声明页面等辅助功能)
    - router.afterEach((to, from, failure) => {
        // 该钩子没有 next 但有failure
    })

    例：
        router.beforeEach((to, from, next) => {
            if(getToken()){
                if(to.path === '/login'){
                    next('/index')
                }else{
                    next()
                }
            }else{
                if(whiteList.includes(to.path)){
                    next()
                }else{
                    next('/login')
                }
            }
        })

        router.beforeResolve(async to =>{
            if(to.meta.xxx){

            }
        })

        // 跳转之后回到顶部
        router.afterEach((to, from) => {
            window.scrollTo(0,0)
        })

2. 单个路由独享钩子：
    - 进入路由时触发，不会在params，query 或 hash改变时触发，只有切换不同的路由时才会触发
    [
        {
            path: '/',
            name: 'index',
            component: Index,
            beforeEnter: (to, from, next) => {
                console.log('即将进入首页')
                next()

                // return false
            }
        }
    ]

    - 也可传递一个函数数组给beforeEnter，复用逻辑
        function removeQuery(to){
            if(Object.keys(to.keys).length){
                return {
                    path: to.path,
                    query: {},
                    hash: to.hash
                }
            }
        }
        function removeHash(to){
            if(to.hash) return {
                path: to.path,
                query: {},
                hash: ''
            }
        }
        const rules = [
            {
                path: '/users/:id',
                component: UserDetail,
                beforeEnter: [removeQuery, removeHash]
            },
            {
                path: '/about',
                component: About,
                beforeEnter: [removeQuery]
            }
        ]

3. 组件内钩子：
    - beforeRouteEnter(to, from, next){
        // 进入组件前调用
        // 由于组件实例还没被创建，因此无法获取this，可传递一个回调给next访问实例
        // beforeRouteEnter 是唯一支持给 next 传递回调的守卫
        next(vm => {        
            console.log(vm)     
        })
    }

    - beforeRouteUpdate(to, from, next){
        // 当前路由改变，组件被复用时调用
        // 例：带动态参数的路径 /user/:id，在 user/1 和 user/2 跳转时，都渲染 同一个组件，该情况下会被调用
        // 由于㢟已经挂载好了，可访问到this
    }

    - beforeRouteLeave(to, from, next){
        // 离开组件时调用，可访问到this
        // 离开守卫 通常用来预防用户在还未保存修改前突然离开，可以通过返回 false 来取消
        // return false
    }

4. 完整的路由导航解析过程：
    - 路由导航开始触发
    - 调用离开路由的组件守卫beforeRouteLeave
    - 调用全局前置守卫beforeEach
    - 调用复用的组件钩子beforeRouteUpdate
    - 调用单个路由独享守卫beforeEnter
    - 解析异步路由组件
    - 调用进入组件前的守卫beforeRouteEnter
    - 调用全局解析守卫beforeResolve
    - 导航被确认
    - 调用全局后置守卫afterEach
    - 触发dom更新
    - 调用beforeRouteEnter守卫中传给next的回调函数，创建好的组件实例会作为回调函数的参数传入

5. 路由导航和生命周期，keep-alive结合起来过程：
    - 假设从啊组件离开，第一次进入b组件
        beforeRouteLeave -> beforeEach -> beforeEnter -> beforeRouteEnter -> beforeResolve -> afterEach -> 
        beforeCreate -> created -> beforeMount -> deactivated -> mounted -> activated -> 执行beforeRouteEnter的next回调
```

#### 7. 路由跳转和location.href有什么区别

```js
1. location.href = '/xxx'：简单方便，会刷新页面

2. history.pushState('/xxx')：无刷新页面，静态跳转

3. 路由跳转：router.push()，使用了diff算法，实现了按需加载，减少了dom的消耗(在history模式下，与history.pushState没什么区别)
```

#### 8. params 与 query有什么区别

```js
1. params与name搭配使用，地址栏上不会显示，刷新会丢失params里的数据

2. query与path搭配使用，地址栏会显示参数，刷新不会丢失参数
```

### Vuex相关

#### 1. vuex的辅助函数如何使用？

```js
1. mapState：将state属性映射到computed属性上

    - 接受对象时：key可随意定义，要的是state里的值

    - 接受数组时：计算属性的key需与state中的key相同

        computed:{
            otherComputed(){
                return '其他的计算属性'
            },
            ...mapState({
                // 映射countAlias为 store.state.count
                countAlias: 'count',
                // 箭头函数方式
                nameAlias: state => state.name,
                // 访问实例this时，只能使用普通函数，不能使用箭头函数
                combineState(state){
                    return this.otherComputed + state.count
                }
            }),
            // 映射count为store.state.count, name为store.state.name
            ...mapState(['count', 'name'])
        }

        // 使用：
        this.countAlias / this.nameAlias / this.combineState / this.count / this.name

2. mapGetters：把getters里的属性映射到computed中，state中属性变化会触发getters中方法，有一个参数(state)

    - 接受对象时：key可随意定义，要的是getters里方法

    - 接受数组时：key和getters中的方法名需一致

    computed:{
        ...mapGetters({
            // key可设置方法别名，值为getters中的方法
            nameAlias: 'name',
        }),
        ...mapGetters(['name'])
    }

3. mapMutations: 把mutations里的方法映射到methods中，主要修改state中的数据，两个参数(state, payload)

    - 接受对象时：key可随意定义，要的是mutations里方法

    - 接受数组时：key和actions中的方法名需一致

    methods:{
        ...mapMutations({
            // key可设置方法别名，值为mutations中的方法
            addAlias: 'handleAdd'
        }),
        ...mapMutations(['handleAdd'])
    }

4. mapActions：把actions里的方法映射到methods中

    - 接受对象时：key可随意定义，要的是actions里方法

    - 接受数组时：key和actions中的方法名需一致

    methods:{
        ...mapActions({
            // key可设置方法别名，值为actions中的方法
            asyncAlias: 'handleAsync',
            changeAlias: 'handleInput'
        }),
        ...mapActions(['handleAsync', 'handleInput'])
    }

5. modules属性：模块
    - 每个模块都是一个小型Vuex
    - 每个模块都有state，getters，mutations，actions
    - 导出模块时加一个 namespaced:true

    // 例：
    // 单个模块 custom.js
    const store = {
        state:{},
        getters:{},
        mutations:{},
        actions:{}
    }
    export default {
        ...store,
        namespaced: true
    }

    // store中 index.js
    import customVuex from 'custom.js'
    export default new Vuex.Store({
        state:{},
        getters:{},
        mutations:{},
        actions:{},
        modules: {
            customVuex
        }
    })

    - 当开启命名空间时如何使用辅助函数：
        - mapXXX('命名空间名称', {
            // 别名：命名空间中的原名称
            alias: 'vuex中对应的原名称',
        })

        // 数组需保持名字一致
        - mapXXX('命名空间名称', ['名字1', '名字2'])

```
