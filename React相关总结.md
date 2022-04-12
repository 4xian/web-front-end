# React 相关

#### 1. 生命周期相关

- componentWillMount:：(render 之前)
  - 挂载前调用，修改 state 状态
- componentDidMount：(render 之后)
  - 挂载完成，可用 ReactDOM.findDOMNode(this)
- **更新相关**：
  - componentWillReceiveProps
  - shouldComponentUpdate
  - componentWillUpdate
  - componentDidUpdate
- 卸载相关：
  - componentWillUnmount

#### 2. DOM 操作：(获取 DOM 节点)

- **findDOMNode**：

```js
import {findDOMNode} from 'react-dom';
// 组件挂载之后获取
componentDidMount(){
    const el = findDOMNode(this);
}
// findDOMNode 不能用在无状态组件上
```

- **refs**：

  ```js
  // DOM元素上设置refs，然后通过this.refs.name 获取DOM节点
  1. refs设置在原生HTML上，即获取DOM元素；
  2. refs设置在自定义组件上，即获取组件实例，需通过findDOMNode获取DOM元素

  3. 不在render或render之前访问refs
  ```

- **无状态组件无实例，想要获取 DOM 元素，需要用状态组件封装一层，然后通过 refs 和 findDOMNode 获取**

#### 3. 组件通信

1. 父子间通信：

   ```js
   1. 子组件通过props获取值/方法，父组件通过回调方式获取传递过来的数据
   2. 父组件通过refs访问子组件
   ```

2. 跨级组件(爷孙)通信：

```js
   1. 使用context：类似一个大容器，当 Provider 的 value 值发生变化时，它内部的所有消费组件都会重新渲染
    
   import {React, createContext,useContext} from 'react'
       - createContext 创建并初始化
        export const C = createContext(null)
       function App(){
            const [n,setN] = useState(0)
            return(
            // 指定上下文使用范围，使用 provider,并传入读数据和写入
            <C.Provider value={{n,setN}}>
                <Baba></Baba>
            </C.Provider>
            )
        }
        function Baba(){
            // 这是爸爸
            return(
                <div>
                <Child></Child>
                </div>
            )
        }
        import C from 'App'
        function Child(){
            // 使用上下文，因为传入的是对象，则接受也应该是对象
            const {n,setN} = useContext(C)
            const add=()=>{
                setN(n=>n+1)
            };
            return(
                <div>
                 这是儿子:n:{n}
                    <button onClick={add}>+1</button>
                </div>
            )
        }
```
3. 非关系组件通信：

```js
   1. 发布订阅模式(自定义事件)：
       componentDidMount 订阅事件
       componentWillUnmount 取消事件
       事件触发时调用setState更新UI

   2. redux 或 mobx
```


#### 4. Mixins：(组件的扩展，共用方法)

```js
// 定时器例子
const SetIntervalMixin = {
  componentWillMount: function () {
    this.intervals = [];
  },
  setInterval: function () {
    this.intervals.push(setInterval.apply(null, arguments));
  },
  componentWillUnmount: function () {
    this.intervals.map(clearInterval);
  },
};

const TickTock = React.createClass({
  mixins: [SetIntervalMixin], // Use the mixin
  getInitialState: function () {
    return { seconds: 0 };
  },
  componentDidMount: function () {
    this.setInterval(this.tick, 1000); // Call a method on the mixin
  },
  tick: function () {
    this.setState({ seconds: this.state.seconds + 1 });
  },
  render: function () {
    return <p>React has been running for {this.state.seconds} seconds.</p>;
  },
});

React.render(<TickTock />, document.getElementById("example"));

// 单组件共用多个mixins，其中有多个相同的生命周期方法，这些方法会在组件方法执行后按照mixins指定的数组顺序执行
```

#### 5. Redux相关：

- Actions：{ type, payload}

```js
{
    type: 'ADD_XXX', // 常量标识动作,
    text:'xxx' // 该动作携带的参数
}
// 需要通过store.dispatch()方法来发送

// 例子:
function testAction(text){
    return {
        type:'TEST_ACTION',
        text
    }
};
store.dispatch(testAction(text))
```

- Reducers：(oldState, action) => newState

  ```js
  // 例子:
  const initState = {
    a: "a",
    b: "b",
  };

  function someReducer(state = initState, action) {
    switch (action.type) {
      case "CHANGE_A":
        return { ...state, a: "change A" };
      case "CHANGE_B":
        return { ...state, b: "change B" };
      default:
        return state;
    }
  }

  // 多reducer拆分写法
  function someReducer(state = {}, action) {
    return {
      a: reducerA(state.a, action),
      b: reducerB(state.b, action),
    };
  }
  // 每个reducer的形式还是(oldState, action) => newState

  // 利用combineReducer 简化reducer合并
  import { combineReducers } from "redux";

  const someReducer = combineReducer({
    a: reducerA,
    b: reducerB,
  });
  // someReducer 称为root reducer
  ```

- Store：

  ```js
  1. 提供一个getState方法获取state
  2. 提供一个dispatch方法发送action更改state
  3. 提供一个subscribe()方法注册回调函数监听state的更改

  // 创建store
  import { createStore } from 'redux';
  import someReducer form './xxx';
  const store = createStore(someReducer);

  // 创建store后便拿到store.dispatch，可以用来分发action
  const unsubscribe = store.subscribe(() => console.log(store.getState()));

  // 开始dispatch
  store.dispatch({
      type:'CHANGE_A'
  });
  store.dispatch({
      type:'CHANGE_B',
      payload:'Modified B'
  })

  // 停止监听state更新
  unsubscribe();
  ```

- 其他：

  ```js
  1. 调用store.dispatch(action):
   任意地方调用store.dispatch(action)，比如组件内部，AJAX回调函数里

  2. action会触发给store指定的root reducer:
   - reducer 函数接收(state, action)
   - reducer 函数判断action.type 然后处理对应的action.payload数据更新一个新  的state

  3. store保存root reducer返回的新state
   - 新stated代替旧state, 然后store.subscribe(listener) 注册的回调函数会被调用，回调函数通过store.getState获取新的state
  ```

- 在 React 里使用 Redux：

  ```js
  import { render } from "react-dom";
  import { Provider } from "react-redux";
  import { App } from "./app";

  render(
    <Provider store={store}>
      <App />
    </Provider>,
    document.getElementById("root")
  );
  ```


#### 6. React-Router路由模式及原理：
```js
1. HashRouter(hash模式)：
    监听hashchange事件，可以通过window.location.hash = 'xxx'，即通过URL的hash属性控制路由跳转的
    - 通过window.addEventListener('hashChange',callback)监听hash值的变化，并传递给其嵌套的组件，然后通过context将location数据往后代组件传递

    <HashRouter
        basename={string}
        getUserConfirmation={func}
        hashType={string}  
    />
    - hashType: window.location.hash 使用的 hash 类型
        - slash: 后面跟一个斜杠，例如 #/ 和 #/sunshine/lollipops
        - noslash: 后面没有斜杠，例如 # 和 #sunshine/lollipops
        - hashbang: Google 风格的 ajax crawlable，例如 #!/ 和 #!/sunshine/lollipops

2. BrowserRouter(history模式)：
    通过history.pushState 和 history.replaceState，history.popState改变url，将url压入栈中
    - 监听url的变化可以通过自定义事件触发

    <BrowserRouter
        basename={string}
        forceRefresh={bool}
        getUserConfirmation={func}
        keyLength={number}
    />
    - basename: 基础url，类似于url前缀
    - forceRefresh: true导航的过程中页面会刷新(在不支持HTML5 history的环境中使用)
    - getUserConfirmation: 确认导航的弹框提示函数，默认window.confirm，用户点击确定后才进行导航，否则不做任何处理
    - KeyLength: 用来设置 Location.Key 的长度，需要配合<Prompt> 一起使用

每次 URL 发生变化的回收，通过配置的 路由路径，匹配到对应的 Component，并且 render
```

#### 7. 配置React-Router实现路由切换：
```js
1. 使用<Route>组件：
    - path 属性：用于设置匹配到的路径
    - component 属性：设置匹配到路径后，渲染的组件
    - render 属性：设置匹配到路径后，渲染的内容
    - exact 属性：开启精准匹配，只有精准匹配到完全一致的路径，才会渲染对应的组件

    路由匹配通过比较<Route>中的path属性和当前地址的pathname，匹配成功则渲染，匹配失败则渲染null，无path时则始终渲染
    // when location = { pathname: '/about' }
    <Route path='/about' component={About}/> // renders <About/>
    <Route path='/contact' component={Contact}/> // renders null
    <Route component={Always}/> // renders <Always/>

2. <Switch>和<Route>结合使用：
    <Switch>用来包裹<Route>， 一个<Switch>会遍历所有的子<Route>，并仅渲染与当前地址匹配的第一个子<Route>或<Redirect>
        常用exact表示精确匹配路由
    <Switch>
        <Route exact path="/" component={Home} />
        <Route path="/about" component={About} />
        <Route path="/contact" component={Contact} />
    </Switch>

3. <Link>、 <NavLink>、<Redirect> 组件：
    - <Link>组件用来创建链接，它会在HTML中渲染<a>标签
        <Link to="/">Home</Link>   
         <a href='/'>Home</a>

    - <NavLink>是特殊的<Link>，当它的to属性与当前地址匹配时，将其定义为'活跃的'
        - activeStyle：活跃时（匹配时）的样式
        - activeClassName：活跃时添加的class

        location = { pathname: '/react' }
        <NavLink to="/react" activeClassName="hurray">
            React
        </NavLink>
         <a href='/react' className='hurray'>React</a>

    - <Redirect>用于路由重定向
        - (from: string)：需要匹配的将要被重定向路径
        - (to: string)：重定向的 URL 字符串
        - (to: object)：重定向的 location 对象
        - (push: bool): 为真，重定向操作将会把新地址加入到访问历史记录里面，并且无法回退到前面的页面
        <Switch>
            <Redirect from='/users/:id' to='/users/profile/:id'/>
            <Route path='/users/profile/:id' component={Profile}/>
        </Switch>

4. <Link> 和 <a> 标签的区别：
    - <Link> 有onclick就执行onclick；click的时候阻止a标签默认事件；跳转href用的history模式，链接变了但没有刷新页面；
    - a标签就是从一个页面跳转到另一个页面

5. 路由获取参数相关：
    - 获取URL参数：
        - 对于GET传参：通过this.props.location.search
        - 动态路由传参：通过this.props.match.params.xxx || 通过useParams()获取
        - query或state传参：
            Link组件的to属性中可以传递对象{pathname:'/admin',query:'111',state:'111'};。通过this.props.location.state或this.props.location.query来获取即可，传递的参数可以是对象、数组等，但是存在缺点就是只要刷新页面，参数就会丢失

    - 获取历史对象：
        - 通过useHistory()
        - 通过this.props.history获取

6. react-router 常用Hooks:
    - useHistory: 让组件内部直接访问history
    - useParams: 获取参数
    - useLocation: 返回当前 URL的 location对象

```