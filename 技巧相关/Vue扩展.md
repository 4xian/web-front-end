# Vue相关高级技巧

#### 1. 自动注册组件

```js
1.组件文件夹同级建个js:
import Vue from 'vue'
function changeStr (str){
    return str.charAt(0).toUpperCase() + str.slice(1);
}
const requireComponent = require.context('./',false,/\.vue$/); // './'操作对象为当前目录
requireComponent.keys().forEach(element => {
    const config = requireComponent(element);
    const componentName = changeStr(
        element.replace(/^\.\//,'').replace(/\.\w+$/,'')
    )
    Vue.component(componentName, config.default || config)
});

2. main.js引入该js文件
// require.context是webpack的一个API，所以，需要基于webpack环境才可以使用。
```

#### 2. 自定义权限指令

```js
1. 过滤权限:
function checkPermission(val){
    let allPermission = [1,2,3,4,5];
    return allPermission.some(v => v === val)
}

Vue.directive('permission-auth',{
    inserted(el,binding){
        if(binding.value){
            if(!checkPermission(binding.value)) 
                el.parentNode && el.parentNode.removeChild(el)
        }else{
            throw new Error('指令缺少参数')
        }
    }
})

//使用 <button v-permission-auth="3">按钮</b
```

#### 3. 封装引入第三方组件步骤

```js
1. 创建xxx.js文件专门引入第三方组件:
import {Button,Icon} from 'element-ui'
const components = [Button,Icon]
function install(Vue){
    components.forEach((v,id)=>Vue.use(components[id]))
}
export default {install}

2. 在main.js文件引入:
import UIComponents from './xxx.js'
Vue.use(UIComponents)

```

#### 4. 根据合并策略自定义生命周期

```js
// /utils/customCycle.js
1. 监听浏览器页面是否激活:
-1. 通知所有组件页面状态变化:
const notifyStatus = (lifeCycle,vm) => {
    // 生命周期存于$options中, 通过$options[lifeCycle]获取
    const lifeArray = vm.$options[lifeCycle]
    // 使用了created合并策略,为数组
    if(lifeArray && lifeArray.length){
        // 依次执行lifeCycle中的函数
        lifeArray.forEach(life=>{
            life.call(vm)
        })
    }
    // 遍历子组件,依次执行
    if(vm.$children && vm.$children.length){
        vm.$children.forEach(child=>{
            notifyStatus(lifeCycle,child)
        })
    }
}

-2. 添加生命周期钩子函数:
export function init(){
    // 指定showPage,hiddenPage两个生命周期的合并策略与created相同
    const optionMerge = Vue.config.optionMergeStrategies;
    optionMerge.showPage = optionMerge.beforeCreate;
    optionMerge.hiddenPage = optionMerge.created;
}

-3. 将事件变化绑定到根节点:
export function bind(root){
    window.addEventListener('visibilitychange',()=>{
        let lifeCycle = '',
        if(document.visibilityState === 'hidden'){
            lifeCycle = 'hiddenPage'
        }else if(document.visibilityState === 'visible'){
            lifeCycle = 'showPage'
        }
        if(lifeCycle){
            notifyStatus(lifeCycle,root)
        }
    })
}

(
    // 全局mixin和插件方式
    install(Vue) {
        Vue.mixin({
            created() { 
                window.addEventListener('visibilitychange', this.$_hanldeVisiblityChange);
                this.$on('hook:beforeDestory', () => {
                    window.removeEventListener('visibilitychange', this.$_hanldeVisiblityChange)
                })
            },
            methods: {
                $_hanldeVisiblityChange() {
                if (document.visibilityState === 'hidden') {
                    this.$options.hiddenPage && this.$options.hiddenPage.apply(this)
                } else if (document.visibilityState === 'visible') {
                    this.$options.showPage && this.$options.showPage.apply(this)
                }
            }
        }
    })
)

2. main.js入口引入:
import {init, bind} from './utils/customCycle'
// 1.在Vue实例化之前初始化
init()
const vm = new Vue({
 //实例化
}).$mount('#app')
// 2.bind绑定实例
bind(vm)

3. 使用:
export default {
    showPage(){
        console.log('页面显示了')
    },
    hiddenPage(){
        console.log('页面隐藏了')
    }
}
```

#### 5. provide 和 inject

```js
1. provide:
export default {
    provide(){
        return {
            custom: this
        }
    }
}

2.inject(多种方式):
 // 使用: this.custom.xxx
 -1. 数组方式:
 export default{
    inject: ['custom']
 }
 
 -2. 设置默认值:
 export default{
     inject:{
         custom:{
             default:()=>{
                 xxx: 'default'
             }
         }
     }
 }

// this.aliasCustom.xxx
 -3. 别名:
 export default {
     inject:{
         aliasCustom:{
             // 指定注入那个属性
             from: 'custom',
             default:()=>{
                 xxx: 'default'
             }
         }
     }
 }

provide 和 inject非响应式的,但传入一个可监听的对象,其对象的属性还是响应的
```

#### 6. 实现冒泡和捕获(vue1的$dispatch,$broadcast)

##### 1. $dispatch

```js
/* 
(向上传播事件) 子=>父
(事件名称, 触发的组件名称, 其他参数)
@params(eventName, comName, ...params)
*/
// /mixin/emitter.js
function dispatch(eventName, comName, ...params){
    let parent = this.$parent || this.$root
    while (parent){
        const currentComName = parent.$options.name
        // 当前组件即为目标组件
        if(currentComName === comName){
            parent.$emit.apply(parent,[eventName, ...params])
            break
        }else{
            // 继续向上
            parent = parent.$parent
        }
    }
}
// 导出对象,需要就混入添加
export default{
    methods:{
        $dispatch: dispatch
    }
}

// 使用:
import emitter from './mixin/emitter'
export default {
    name: 'ChildCom',
    mixins:[emitter],
    mounted(){
        // 渲染后,组件通过$dispatch将自己注册到Board组件上
        this.$dispatch('register', 'Board', this)
    }
}

在Board组件上通过$on监听要注册的事件
export default {
    name: 'Board',
    created(){
        this.$on('register',(component)=>{
            // 
        })
    }
}
```

##### 2. $broadcast

```js
/* 
(向下广播事件) 父=>子
(事件名称, 触发的组件名称, 其他参数)
@params(eventName, comName, ...params)
*/
// /mixin/emitter.js
function broadcast(eventName, comName, ...params){
    this.$children.forEach(child=>{
        let name = child.$options.name
        if(name === comName){
            child.$emit.apply(child, [eventName, ...params])
        }else{
            broadcast.apply(child,[eventName, comName, ...params])
        }
    })
}
export default {
    methods:{
        $broadcast: broadcast
    }
}

// 应用:
import emitter from './mixin/emitter'
export default {
    name: 'Board',
    mixins:[emitter],
    methods:{
        $_refreshChild(params){
            this.$broadcast('refresh', 'ChildCom', params)
        }
    }
}

// 后代组件上通过$on监听刷新事件
export default {
    name: 'ChildCom',
    created(){
        this.$on('refresh',(params)=>{
            // 
        })
    }
}
```

#### 7. 使用hook监听生命周期

```js
1. 使用this.$on,this.$once(只执行一次)内部监听生命周期函数:
export default {
    mounted(){
        this.$once('hook:beforeDestroy',()=>{
            //
        })
    }
}

2. 外部监听第三方组件的生命周期函数:
// 组件的所有生命周期都可用@hook:钩子函数监听
<CustomComponent @hook:updated="handleFunc"></CustomComponent>
```

#### 8. Vue.observable实现一个简易状态管理

```js
1. 创建store:
// store/index.js
import Vue from 'vue'

// 创建一个可响应的对象
export const store = Vue.observable({
    userInfo: {},
    roleIds:[]
})

// 定义mutations
export const mutations = {
    setUserInfo(data){
        store.userInfo = data
    },
    setRoleIds(data){
        store.roleIds = data
    }
}

2. 组件引入:
<div>
{{userInfo.name}}
</div>

import {store, mutations} from './store/index'
export default {
    computed:{
        userInfo(){
            return store.userInfo
        }
    },
    created(){
        mutations.setUserInfo({
            name: 'xxx'
        })
    }
}
```

#### 9. 使用Vue.extend和指令开发v-loading组件

```js
1. loading组件
<!--loading.vue -->
<template>
  <transition name="custom-loading-fade">
    <!--loading蒙版-->
    <div v-show="visible" class="custom-loading-mask">
      <!--loading中间的图标-->
      <div class="custom-loading-spinner">
        <i class="custom-spinner-icon"></i>
        <!--loading上面显示的文字-->
        <p class="custom-loading-text">{{ text }}</p>
      </div>
    </div>
  </transition>
</template>
<script>
export default {
  data(){
      return {
          text:'',
          visible: false
      }
  }
}
</script>

```

```js
2. 使用js调用组件:
import Vue from 'vue'
import LoadingCom from './loading'
// 使用Vue.extend将组件包装成子类
const LoadingConstructor = Vue.extend(LoadingCom)
let loading = undefined

LoadingConstructor.prototype.close = ()=>{
    if(loading){
        loading = undefined
    }
    this.visible = false
    setTimeout(()=>{
        if(this.$el && this.$el.parentNode){
            this.$el.parentNode.removeChild(this.$el)
        }
        this.$destroy()
    },300)
}

const Loading = (options = ={}) => {
    if(loading){
        return loading
    }
    const parent = document.body
    const opt = {
        text: '',
        ...options
    }
    // 初始化组件
    const instance = new LoadingConstructor({
        el: document.createElement('div'),
        data: opt
    })
    // 将loading挂载到parent
    parent.appendChild(instance.$el)
    Vue.nextTick(()=>{
        instance.visible = true
    })
    loading = instance
    Vue.prototype.$loading = Loading
    return instance
}

export default Loading

// 使用:
this.$loading({text: '正在加载中...'})
setTimeout(()=>{
    this.$loading.close()
},3000)
```

```js
3. 开发v-loading指令:
import Vue from 'vue'
import LoadingCom from './loading'
const LoadingConstructor = Vue.extend(LoadingCom)

Vue.directive('loading',{
    bind(el,binding){
        const instance = new LoadingConstructor({
            el: document.createElement('div'),
            data:{}
        })
        el.appendChild(instance.$el)
        el.instance = instance
        Vue.nextTick(()=>{
            el.instance.visible = binding.value
        })
    },
    // 更新时
    update(el,binding){
        if(binding.oldValue !== binding.value) {
            el.instance.visible = binding.value
        }
    },
    unbind(el){
        const ele = el.instance.$el
        if(ele.parentNode){
            ele.parentNode.removeChild(ele)
        }
        el.instance.$destroy()
        el.instance = undefined
    }
})
```

#### 10. Vue单页面引入js

```js
1. 全局组件：
Vue.component('custom-script', {
	render: (c)=> {
		let that = this;
		return c('script', {
			attrs: {
				type: 'text/javascript',
				src: this.src
			},
			on: {
				load: (e)=> {
					that.$emit('load',e)
				},
				error: (e)=> {
					that.$emit('error',e)
				},
				readystatechange: (e)=> {
					if (this.readyState == 'complete') {
                        			self.$emit('load', e);
                    			}
				},
			}
		})
	},
	props: {
		src: {
			type: String,
			required: true
		}
	}
})

2. 局部引入：
<template> 
	<div> 
		<remote-css href="https://cdn.bootcss.com/twitter-bootstrap/4.2.1/css/bootstrap.css"></remote-css>
  		<remote-js src="https://cdn.bootcss.com/twitter-bootstrap/4.2.1/js/bootstrap.bundle.js"></remote-js>
 	</div>
</template>
components:{
       'remote-css': {
            render(createElement) {  
              return createElement('link', { attrs: { rel: 'stylesheet', href: this.href }});
            },
            props: {
            	href: { type: String, required: true },
            },
        },
        'remote-js': {
            render(createElement) {
              return createElement('script', { attrs: { type: 'text/javascript', src: this.src }});  
            },
            props: {
            	src: { type: String, required: true },
            },
        },
},
```

#### 11. Vue 刷新页面的几种方式

```javascript
1. 最简单的方式：(整个页面重新加载，有白屏)
	- location.reload()
	- this.$router.go(0)

2. provide/inject方式：
	- 首先在app.vue中对<router-view>进行调整
	- 在需要的页面inject使用

	// app.vue
	<template>
		<div id="app">
			<router-view v-if="showRouter"></router-view>
		</div>
	</template>
	<script>
		export default {
			name: 'App',
			provide() {
				return {
					reload: this.reload
				}
			},
			data() {
    				return {
      					showRouter: true
    				}
  			},
			methods: {
    				reload() {
      					this.showRouter = false
      					this.$nextTick(() => {
        					this.showRouter = true
      					})
    				}
  			},
		}

	</script>

	// 需要的页面直接inject调用
	<script>
		export default {
			// 引用provide提供的方法
			inject: ['reload']
			data() {
    				return {}
  			},
			methods: {
    				refresh(){
					this.reload()
				}
  			},
		}

	</script>

3. 先跳转空白页面再跳转回去：(页面不会闪，但路由会快速变化)
	// new page.vue
	beforeRouteEnter(to, from, next) {
    		next((vm) => vm.router.replace(from.path))
  	},
```
