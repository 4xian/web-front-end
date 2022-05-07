# React 相关

#### 1. 生命周期相关

```js
1. 组件挂载阶段：创建组件，将组件实例插入DOM中，为组件的第一次渲染，依次调用以下方法：
    1. constructor：
        - 组件的构造函数，初始化组件的state和给事件处理方法绑定this
        - 若未显示定义，则会默认一个构造函数；若显示定义，则需在构造函数中执行super(props)，否则无法在构造函数中拿到this
        constructor(props) {
            super(props);
            // 不要在构造函数中调用 setState，可以直接给 state 设置初始值
            this.state = { counter: 0 }
            this.handleClick = this.handleClick.bind(this)
        }

    2. getDerivedStateFromProps：
        - 接收到新的 props 或者调用了 setState 和 forceUpdate 时被调用
        - 静态方法，无法在函数内使用this，props和state两个参数，为接收到的新参数和当前组件的state对象
        - 该函数返回一个对象更新当前的state，如果不需要更新则返回null
        static getDerivedStateFromProps(props, state) {
            if (props.counter !== state.counter) {
                return {
                    counter: props.counter
                }
            }
            return null
        }

    3. render：
        - 返回需要渲染的内容：
            - React元素: 原生的DOM以及React组件
            - 数组和Fragment(片段): 返回多个元素
            - Portals(插槽): 将子元素渲染到不同的DOM子树中
            - 字符串和数字: 渲染成DOM中的text节点
            - 布尔值/null: 不渲染

    4. componentDidMount：
        - 组件挂载后调用(插入DOM中):
            - 执行依赖于DOM的操作
            - 异步请求
            - 添加订阅消息(componentWillUnmount取消订阅)

2. 组件更新阶段：当props改变 或是内部调用了setState/forceUpdate，会触发更新重新渲染，依次调用以下方法：
    1. getDerivedStateFromProps： 同上

    2. shouldComponentUpdate：
        - 在重新渲染组件开始前触发，默认返回true
        - 通过比较 新旧props 和 新旧state 是否有改变，返回true/false 来决定组件需不需要重新渲染
        - 返回false时，组件停止更新，render和componentDidUpdate 也不会执行
        - 使用该方法时应避免使用深比较(效率低)
        *** tip ***：
            - setState函数在任何情况下都会导致组件重新渲染
            - 没有调用setState函数，props值也没有变化，组件也会重新渲染(父组件重新渲染，子组件也会重新渲染)
        
        shouldComponentUpdate(nextProps, nextState)

    3. render： 同上

    4. getSnapshotBeforeUpdate：
        - 有两个参数(prevProps,prevState)，表示更新之前的props和state
        - 该函数需和componentDidUpdate一起使用，须有一个返回值，作为componentDidUpdate的第三个参数

        getSnapshotBeforeUpdate(prevProps, prevState)
    
    5. componentDidUpdate：
        - 更新后立即调用，首次渲染不会执行：
            - 组件更新后，对DOM操作
            - 对比props是否变化而执行相关函数
        - 三个参数：
            - prevProps: 更新前的props
            - prevState: 更新前的state
            - snapshot: getSnapshotBeforeUpdate的返回值

        componentDidUpdate(prevProps, prevState, snapshot)

3. 组件卸载状态：
    1. componentWillUnmount：组件卸载及销毁前调用
        - 清除定时器，取消订阅监听，取消请求等
        - 取消在componentDidMount()中创建的订阅等

4. 错误处理阶段：
    1. componentDidCatch：后代组件抛出错误后调用
        - error：抛出的错误
        - info：包含组件引发错误的栈信息

React常见生命周期的过程大致如下：
    ● 挂载阶段，首先执行constructor构造方法，来创建组件
    ● 创建完成之后，就会执行render方法，该方法会返回需要渲染的内容
    ● 随后，React会将需要渲染的内容挂载到DOM树上
    ● 挂载完成之后就会执行componentDidMount生命周期函数
    ● 如果我们给组件创建一个props（用于组件通信）、调用setState（更改state中的数据）、调用forceUpdate（强制更新组件）时，都会重新调用render函数
    ● render函数重新执行之后，就会重新进行DOM树的挂载
    ● 挂载完成之后就会执行componentDidUpdate生命周期函数
    ● 当移除组件时，就会执行componentWillUnmount生命周期函数
```

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

#### 5. Redux相关

```js
1. Actions：
    - 描述动作相关信息包含type 和 payload属性

{
    type: 'ADD_XXX', // action类型,
    text:'xxx' // 负载数据
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

2. Reducers：(oldState, action) => newState
    - 定义应用状态如何响应不同action，如何更新状态

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

3. Store：
    - 管理action和reducer及其关系的对象
        1. 提供一个getState()方法获取state
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

#### 6. React-Router路由模式及原理

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

#### 7. 配置React-Router实现路由切换

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

#### 8. React性能优化相关

```js
1. 父组件重新渲染，子组件不需要重新渲染：
    - 可以使用shouldComponentUpdate:
        - 通过比较当前props值与新的props的值来判断是否需要重新渲染
        - 此方法为浅比较，当为引用类型时，则会返回true。可使用Object.assign浅拷贝或者JSON.parse(JSON.stringify())深拷贝

        shouldComponentUpdate(nextProps,nextState) {
            if (this.props.num === nextProps.num) {
                return false
            }
            return true;
        }

```

#### 9. Hooks相关

```js
1. 函数组件和类组件：
    - 函数组件：
        - 无需继承
        - 无生命周期
        - 没有this
        - 无state

    - 类组件：
        - 继承class
        - 可以访问生命周期
        - 获取实例化后的this
        - 可以定义维护state

2. Hooks解决了什么问题：
    - 复用状态逻辑
    - 拆分逻辑易理解

3. Hooks使用注意：
    - 不要再循环，条件，嵌套函数中调用Hook，需在函数的顶层使用Hook(Hook的设计是基于链表实现，可能导致调用顺序不一致)
    - 在函数组件中调用Hook
    - 使用useState时，处理数组对象应用解构方式(num = [...num ,1]，setNum(num)，而不是使用push pop splice)

4. useState为何使用数组而不是对象：
    - 数组解构可以自定义命名
    - 若为对象，则解构需与useState返回的名字相同，多次使用需设置别名

5. Hooks和生命周期：
    - useState来初始化state
    - 在渲染过程中用setState更新state，以实现getDerivedStateFromProps
    - 使用useMemo优化组件(等效于PureComponent，浅比较)，相当于shouldComponentUpdate
    - useEffect可相当于componentDidMount(空数组)，componentDidUpdate(相关依赖)，componentWillUnmount(return 返回的内容)
       useEffect(()=>{
        // componentDidMount 执行的内容
       }, []) 

       useEffect(()=>{
        // xxx更新时 componentDidUpdate执行的内容

        return ()=>{
            // componentWillUnmount时期执行的内容
        }
       }, [xxx]) 

6. 常用Hooks：
    1. useState：
        - 返回一个数组，当前state和更新state的函数
        - 参数是变量，对象或函数，函数的话 返回值作初始值

    2. useEffect 和 useLayoutEffect：
        - 第一个参数回调函数，第二个参数为依赖项数组，依赖变化后执行回调函数
        - useEffect的回调函数在页面渲染之后执行，useLayoutEffect在页面渲染前执行(主要是对两个hook的处理不同，useEffect异步调用，useLayoutEffect是同步调用)
        - 使用时机：
            - 回调函数修改state导致重新渲染，可以使用useLayoutEffect(避免页面闪烁)
            - 回调函数异步请求或js执行时间长，则使用useEffect(避免浏览器堵塞渲染)

    3. useMemo 和 useCallback：用于性能优化，减少重复渲染
        - 两个hook都是第一个参数都是回调函数，第二个参数为依赖数组
        - useMemo：
            - 回调函数返回一个组件，用于包裹组件，包裹的组件渲染时，新旧props会进行浅比较，无变化则不渲染
            - 传入的函数会在渲染期间执行，不要在这个函数内部执行与渲染无关的操作，如副作用
            - 如果没有提供依赖数组，则会在每次渲染都重新计算
        - useCallback：
            - 用于包裹函数，依赖不改变，传入的函数也将始终是同一个函数
            - useCallback(fn, deps) 相当于 useMemo(()=> fn, deps)

            const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b]);

            // 返回优化后的函数
            const memoizedCallback = useCallback(
                () => {
                    doSomething(a, b);
                },
                [a, b]
            );

    4. useRef：
        - 用来获取组件实例
        - 还可用来缓存数据，.current数据改变后不会触发组件重新渲染
            let refData = useRef(initData)
            console.log(refData.current)

    5. useContext：用于跨组件通信
        - 接收一个React.createContext返回值作为参数，并返回该context的当前值，该值取决于上层组件中最近的<Context.Provider>的value
        - 使用useContext的组件总会在context值变化时重新渲染
        - useContext(Context)只是能够读取context的值以及订阅context的变化
            const Context = React.createContext(oldVal);
            function App() {
                return (
                    <Context.Provider value={newVal}>
                        <Toolbar />
                    </Context.Provider>
                );
            }
            function Toolbar(props) {
                return (
                    <div>
                        <ThemedButton />
                    </div>
                );
            }
            function ThemedButton() {
                const ctx = useContext(Context);
                    return (
                        <button style={{ background: ctx.xxx, color: ctx.xxx }}>
                            I am styled by theme context!
                        </button>
                    );
            }

    6. useReducer：
        - const [state,dispatch] = useReducer(reducer, initState)
            const initialState = {count: 0};
            function reducer(state, action) {
                switch (action.type) {
                    case 'increment':
                        return {count: state.count + 1};
                    case 'decrement':
                        return {count: state.count - 1};
                    default:
                        throw new Error();
                }
            }
            function Counter() {
                const [state, dispatch] = useReducer(reducer, initialState);
                    return (
                        <>
                            Count: {state.count}
                            <button onClick={() => dispatch({type: 'decrement'})}>-</button>
                            <button onClick={() => dispatch({type: 'increment'})}>+</button>
                        </>
                    );
            }

    7. useImperativeHandle：
        - 在使用ref时自定义暴露给父组件
        - useImperativeHandle应于forwardRef一起使用
            function FancyInput(props, ref) {
                const inputRef = useRef();
                    useImperativeHandle(ref, () => ({
                        focus: () => {
                        inputRef.current.focus();
                    }
                }));
                return <input ref={inputRef} ... />;
            }
            FancyInput = forwardRef(FancyInput);
            <FancyInput ref={inputRef} /> 的父组件可以调用 inputRef.current.focus()
```

#### 10. 受控组件和非控组件

```js
1. 受控组件：当表单状态发生变化，触发onChange事件，更新组件的state，这种组件成为受控组件
    - 初始state设置表单默认值
    - 表单值发生改变，触发onChange事件
    - 通过事件拿到改变后的状态，并修改state
    - 通过setState更新state，触发视图重新渲染，完成表单组件更新

2. 非受控组件：表单组件无需将值赋值给value或checked时，非受控组件可用ref获取表单值，无需编写事件处理
    - 非受控组件将数据储存在DOM节点中
    <input type="text" ref={(input) => this.input = input} />
```

#### 11. refs的作用及场景

```js
1. refs用于访问render方法创建的React元素或DOM节点

2. 类组件中通过createRef()创建，Hooks可用useRef()，函数组件没有实例，无法在组件上直接使用ref，可用在函数组件内部使用refs
    function XXX(props){
        let textRef = null
        return (
            <div>
                <input type="text" ref={(input) => { textRef = input; }} />
            </div>
        )
    }

3. ref的返回值取决于节点类型：
    - 作用于普通的HTML元素时，将接收底层DOM元素作为属性current的值来创建ref
    - 作用于自定义的类组件时，将组件挂载的实例作为属性current的值来创建ref
```

#### 12. React绑定this的方式

```js
1. 构造函数中绑定this(预先bind当前组件，可以避免在render操作中重复绑定)：
    constructor(props){
      super(props); 
       this.state={
           msg:'hello world',
       }
       this.getMsg = this.getMsg.bind(this)
   }

2. render方法中使用箭头函数(每次render渲染的时候，都会重新进行bind的操作)：
    constructor(props){
        super(props);
        this.state={
           msg:'hello world',
        }
        render(){
            <button onClick={()=>{alert(this.state.msg)}}>点我</button>
        }
    }

3. render方法中使用bind绑定this(影响性能)：
     <button onClick={this.getMsg.bind(this)}>点我</button>

4. 函数定义阶段使用剪头函数绑定(避免重复绑定)：
    class App extends React.Component {
        constructor(props) {
            super(props);
        }
        // 箭头函数定义
        handleClick = () => {
            console.log('this > ', this);
        }
        render() {
            return (
                <div onClick={this.handleClick}>test</div>
            )
        }
    }
```

#### 13. setState相关

```js
1. 调用setState时，组件中state不会立即改变，会把state放入队列中，出于性能原因，会将多次setState的状态合并修改成一次状态修改，最终只产生一次组件及子组件的重新渲染：
    - 同步代码还在执行，队列合并就不会停止
    - 对于相同属性的设置，只会保留最后一次的更新

2. setState同步与异步：
    - 异步设计一般为了性能优化，减少渲染次数

    - 异步：组件生命周期及合成事件中
    - 同步：原生DOM事件(如：addEventListener) 或 setTimeout setInterval 

3. setState的第二个参数作用：
    - 可选的回调函数，在组件重新渲染后执行，等价于componentDidUpdate

4. 同步或异步的原因：
    - 在setState的实现中，有个变量isBatchingUpdates判断是直接更新this.state还是加入队列
    - isBatchingUpdates默认为false，及默认同步更新，batchingUpdates可以修改isBatchingUpdates
    - React使用事务机制，在生命周期和合成事件都处于一个大事务中，事务的前置钩子中调用batchingUpdates修改isBatchingUpdates为true，后置钩子中则变为false
    - 原生绑定事件和setTimeout没有进入React的事务中，或者她们执行时，事务已经结束了，后置钩子触发了，此时的setState会直接进入非批量更新模式，表现在我们看来成为了同步SetState
```
