# React相关：

#### 1. 生命周期相关：

- componentWillMount:：(render之前)
    - 挂载前调用，修改state状态
- componentDidMount：(render之后)
    - 挂载完成，可用ReactDOM.findDOMNode(this)
- **更新相关**：
    - componentWillReceiveProps
    - shouldComponentUpdate
    - componentWillUpdate
    - componentDidUpdate
- 卸载相关：
    - componentWillUnmount

#### 2. DOM操作：(获取DOM节点)

- **findDOMNode**：

```react
import {findDOMNode} from 'react-dom';
// 组件挂载之后获取
componentDidMount(){
    const el = findDOMNode(this);
}
// findDOMNode 不能用在无状态组件上
```

- **refs**：

    ```react
    // DOM元素上设置refs，然后通过this.refs.name 获取DOM节点
    1. refs设置在原生HTML上，即获取DOM元素；
    2. refs设置在自定义组件上，即获取组件实例，需通过findDOMNode获取DOM元素
    
    3. 不在render或render之前访问refs
    ```

- **无状态组件无实例，想要获取DOM元素，需要用状态组件封装一层，然后通过refs和findDOMNode获取**

#### 3. 组件间通信：

- 父子间通信：

    ```react
    1. 子组件通过props获取值/方法，onClick调用父组件方法
    2. 父组件通过refs访问子组件
    ```

- 非父子间通信：

    ```react
    1. 发布订阅模式：
    	componentDidMount 订阅事件
        componentWillUnmount 取消事件
    事件触发时调用setState更新UI
    
    2. Flux
    ```

#### 4. Mixins：(组件的扩展，共用方法)

```react
// 定时器例子
const SetIntervalMixin = {
    componentWillMount: function() {
        this.intervals = [];
    },
    setInterval: function() {
        this.intervals.push(setInterval.apply(null, arguments));
    },
    componentWillUnmount: function() {
        this.intervals.map(clearInterval);
    }
};

const TickTock = React.createClass({
    mixins: [SetIntervalMixin], // Use the mixin
    getInitialState: function() {
        return {seconds: 0};
    },
    componentDidMount: function() {
        this.setInterval(this.tick, 1000); // Call a method on the mixin
    },
    tick: function() {
        this.setState({seconds: this.state.seconds + 1});
    },
    render: function() {
        return (
            <p>
                React has been running for {this.state.seconds} seconds.
            </p>
        );
    }
});

React.render(
    <TickTock />,
    document.getElementById('example')
);

// 单组件共用多个mixins，其中有多个相同的生命周期方法，这些方法会在组件方法执行后按照mixins指定的数组顺序执行
```

#### 5. Redux：

- Actions：{ type, payload}  

```react
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

    ```react
    // 例子:
    const initState = {
        a:'a',
        b:'b'
    };
    
    function someReducer(state = initState, action){
        switch (action.type){
            case 'CHANGE_A':
                return { ...state, a:'change A'};
            case 'CHANGE_B':
                return { ... state, b:'change B'};
            default:
                return state
        }
    }
    
    // 多reducer拆分写法
    function someReducer(state = {}, action){
        return {
            a: reducerA(state.a, action),
            b: reducerB(state.b, action)
        }
    }
    // 每个reducer的形式还是(oldState, action) => newState    
    
    // 利用combineReducer 简化reducer合并
    import {combineReducers} from 'redux';
    
    const someReducer = combineReducer({
        a: reducerA,
        b: reducerB
    })
    // someReducer 称为root reducer
    ```

- Store：

    ```react
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

    ```react
    1. 调用store.dispatch(action):
    	任意地方调用store.dispatch(action)，比如组件内部，AJAX回调函数里
        
    2. action会触发给store指定的root reducer:
    	- reducer 函数接收(state, action) 
    	- reducer 函数判断action.type 然后处理对应的action.payload数据更新一个新		的state
    
    3. store保存root reducer返回的新state
    	- 新stated代替旧state, 然后store.subscribe(listener) 注册的回调函数会被调用，回调函数通过store.getState获取新的state
    ```

- 在React里使用Redux：

    ```react
    import { render } from 'react-dom';
    import { Provider} from 'react-redux';
    import { App } from './app';
    
    render(
    	<Provider store = { store}>
        	<App />
        </Provider>,
        document.getElementById('root')
    );
    
    ```

    