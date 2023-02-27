# JS相关题目

#### 1. 实现一次多个并发请求，其余的等待请求，如何最快的获取所有请求结果

```js
1. 共n个请求，每次并发m个请求，如何最快获取到所有请求结果
    let multipleRequest = {
        // 空位标志，默认最大并发3
        id: 0,
        // 请求总数量
        count:0,
        // 请求列表
        queue:[],
        // 等待列表
        wait:[],
        // 所有请求结果
        result:[],
        init: function(list, num = 3){
            this.count = list.length
            this.id = num
            this.queue = []
            this.wait = []
            this.result = []
        
            this.addQueue(list)
        },
        addQueue: function(arr, flag = true){
            // flag为标志符，是否首次请求
            if(!flag) this.queue = []
            arr.forEach((item)=>{
                // 有空位
                if(this.id){
                    this.queue.push(item)
                    this.id--
                    // 首次满队列请求开始
                    if(this.id === 0 && flag){
                        console.log('请求开始', Date.now())
                        this.run()
                    }
                // 没空位加入等待队列
                }else{
                    this.wait.push(item)
                }
            })
        },
        run: function(){
            for(let request of this.queue){
                request().then(res=>{
                    this.result.push(res)
                    this.id++
                    if(this.wait.length){
                        this.addQueue(this.wait.splice(0,1), false)
                        this.run()
                    }
                    if(this.result.length === this.count){
                        console.log('所有请求结束', Date.now())
                        console.log('所有请求结果', this.result)
                    }
                })
            }
        }
    }
```

#### 2. 实现Object.create

```js
function myCreate(obj){
    let res
    function F(){}
    F.prototype = obj
    res = new F()
    if(!obj) res.__proto__ = null
    return res
}
```

#### 3. 实现instanceof：判断构造函数的prototype是否在对象的原型链上

```js
function myInstanceof(left,right){
    let proto = Object.getPrototypeOf(left),
        prototype = right.prototype;
  
    while(true){
        if(!proto) return false
        if(proto === prototype) return true
        proto = Object.getPrototypeOf(proto)
    }
}
```

#### 4. 实现new操作符

```js
function myNew(func, ...args){
    let obj = null, res = null;
    if(typeof func !== 'function'){
        throw new Error('传入类型错误')
    }
    obj = Object.create(func.prototype)
    res = func.apply(obj, args)
    return res instanceof Object ? res : obj
}
```

#### 5. 实现一个Promise

```js
const PENDING = "pending";
const RESOLVED = "resolved";
const REJECTED = "rejected";

function MyPromise(fn) {
  // 保存初始化状态
  var self = this;
  // 初始化状态
  this.state = PENDING;
  // 用于保存 resolve 或者 rejected 传入的值
  this.value = null;
  // 用于保存 resolve 的回调函数
  this.resolvedCallbacks = [];
  // 用于保存 reject 的回调函数
  this.rejectedCallbacks = [];

  // 状态转变为 resolved 方法
  function resolve(value) {
    // 判断传入元素是否为 Promise 值，如果是，则状态改变必须等待前一个状态改变后再进行改变
    if (value instanceof MyPromise) {
      return value.then(resolve, reject);
    }
    // 保证代码的执行顺序为本轮事件循环的末尾
    setTimeout(() => {
      // 只有状态为 pending 时才能转变，
      if (self.state === PENDING) {
        // 修改状态
        self.state = RESOLVED;

        // 设置传入的值
        self.value = value;

        // 执行回调函数
        self.resolvedCallbacks.forEach(callback => {
          callback(value);
        });
      }
    }, 0);
  }

  // 状态转变为 rejected 方法
  function reject(value) {
    // 保证代码的执行顺序为本轮事件循环的末尾
    setTimeout(() => {
      // 只有状态为 pending 时才能转变
      if (self.state === PENDING) {
        // 修改状态
        self.state = REJECTED;
        // 设置传入的值
        self.value = value;
        // 执行回调函数
        self.rejectedCallbacks.forEach(callback => {
          callback(value);
        });
      }
    }, 0);
  }

  // 将两个方法传入函数执行
  try {
    fn(resolve, reject);
  } catch (e) {
    // 遇到错误时，捕获错误，执行 reject 函数
    reject(e);
  }
}

MyPromise.prototype.then = function(onResolved, onRejected) {
  // 首先判断两个参数是否为函数类型，因为这两个参数是可选参数
  onResolved =
    typeof onResolved === "function"
      ? onResolved
      : function(value) {
          return value;
        };
  onRejected =
    typeof onRejected === "function"
      ? onRejected
      : function(error) {
          throw error;
        };

  // 如果是等待状态，则将函数加入对应列表中
  if (this.state === PENDING) {
    this.resolvedCallbacks.push(onResolved);
    this.rejectedCallbacks.push(onRejected);
  }

  // 如果状态已经凝固，则直接执行对应状态的函数
  if (this.state === RESOLVED) {
    onResolved(this.value);
  }
  if (this.state === REJECTED) {
    onRejected(this.value);
  }
};
```

#### 6. 实现Promise.all方法

```js
function myAll(list){
    let id = 0,count = list.length,result = [];
    return new Promise((resolve, reject)=>{
        list.forEach((item,idx)=>{
            Promise.resolve(item).then(res=>{
                id++
                result[idx] = res
                if(id === count) resolve(result)
            },err=>{
                reject(err)
            })
        })
    })
}

// 使用
myAll([p1,p2,p3,...]).then(res=>{
    console.log(res)
}).catch(err=>{
    console.log(err)
})

```

#### 7. 实现Promise.race方法

```js
function myRace(list){
    return new Promise((resolve,reject)=>{
        for(let i = 0; i < list.length; i++){
            list[i].then(resolve, reject)
        }
    })
}
```

#### 8. 实现防抖函数

```js
    // 是立即执行还是等待后执行
    function debounce1(fn, delay = 500, immediate){
        let timer;
        return function(...args){
            if(timer) clearTimeout(timer);
         if(immediate){
             let temp = !timer;
             timer = setTimeout(()=>{
                 timer = null
             }, delay)
             if(temp){
                 fn.apply(this, args)
             }
         }else{
                timer = setTimeout(()=>{
                    fn.apply(this, args)
                }, delay)
            }
        }
    }

    // 首次立即执行，其余等后执行
    function debounce(fn, time = 2000, immediate = true){
     let timer = null,flag = immediate
        return function(...args){
            if(flag){
                fn.apply(this, args)
                flag = false
            }
           if(timer) clearTimeout(timer)
            timer = setTimeout(()=>{
               fn.apply(this, args);
            },time)
        }
    }
```

#### 9. 实现节流函数

```js
    // 时间戳和定时器结合
    function throttle(fn, delay = 500){
        let timer = null,cur = 0,remain = 0,
            start = Date.now();
        return function(...args){
            cur = Date.now()
            remain = delay - (cur - start)
            if(remain <= 0){
               if(timer) clearTimeout(timer)
                start = Date.now()
                fn.apply(this,args)
            }else timer = setTimeout(fn, remain)
        }
    }
```

#### 10. 实现一个通用数据类型检测方法

```js
function getType(v){
    let temp;
    if(v === 'null') return null
    if(typeof v === 'object'){
        temp = Object.prototype.toString.call(v).split(' ')[1].split('')
        temp.pop()
        return temp.join('').toLowerCase()
    }else{
        return typeof v
    } 
  
}
```

#### 11. 实现浅拷贝

```js
1. Object.assign()

    Object.assign(target, s, s1, ...)
    console.log(target)

2. 扩展运算符：
    let newObj = {...obj}

3. 数组浅拷贝：
    - Array.prototype.slice
        let newArr = arr.slice()

    - Array.prototype.concat
        let newArr = arr.concat()

4. 手写浅拷贝：
    function shallowClone(obj){
        if(!obj || typeof obj !== 'object') return;
        let result = obj instanceof Array ? [] : {}
        for(let v in obj){
            if(obj.hasOwnProperty(v)){
                result[v] = obj[v]
            }
        }
        return result
    }
```

#### 12. 实现深拷贝

```js
1. JSON.parse(JSON.stringify(obj))
    - 对象中有函数，undefined，Symbol，正则，处理后会消失

2. 手写深拷贝：
    function deepClone(obj){
        if(obj == null || typeof obj !== 'object') return obj
        if(obj instanceof Function) return new Function(obj)
        if(obj instanceof Date) return new Date(obj)
        if(obj instanceof RegExp) return new RegExp(obj)
        if(typeof obj === 'symbol') return new Symbol(obj)
        let temp = new obj.constructor()
        for(let key in obj){
            if(obj.hasOwnProperty(key)){
                temp[key] = deepClone(obj[key])
            }
        }
        return temp
    }
```

#### 13. 实现sleep函数(Promise封装setTimeout)

```js
    function sleep(time){
        return new Promise(resolve=>{
            setTimeout(resolve(), time)
        })
    }
```

#### 14. 实现Object.assign

```js
    function myAssign(target,...args){
        if(targe == null) throw new Error('传入类型错误')
        let res = Object(target)
        for(let obj of args){
            if(obj != null){
                for(let k in obj){
                    res[k] = obj[k]
                }
            }
        }
        return res
    }
```

#### 15. 实现用setTimeout模拟setInterval

```js
const myInterval = function(fn, time){
 let flag  = true;
    function interval(){
        if(flag){
            fn();
            setTimeout(interval, time);
        }
    }
    setTimeout(interval, time);
    return flag;
}
```

#### 16. 用requestAnimationFrame模拟setInterval

```js
const myInterval = (callback, interval)=>{
    let timer, startTime = Date.now(), endTime;
    const loop = ()=>{
        timer = window.requestAnimationFrame(loop)
        endTime = Date.now()
        if(endTime - startTime >= interval){
            startTime = Date.now()
            callback(timer)
        }
    }
    timer = window.requestAnimationFrame(loop)
    return timer
}
```

#### 17. 用requestAnimationFrame模拟setTimeout

```js
const myTimeout = (fn, interval)=>{
    let timer, startTime = Date.now(), endTime;
    const loop = ()=>{
        timer = window.requestAnimationFrame(loop)
        endTime = Date.now()
        if(endTime - startTime >= interval){
            fn()
            window.cancelAnimationFrame(timer)
        }
    }
    loop()
}

```

#### 18. 实现get方法(获取对象嵌套属性值)

```js
function getObjValue(obj, attr){
  let arr = attr.split('.'),
      temp = obj;
    //   for(let i = 0; i < arr.length; i++){
    //       temp = temp[arr[i]]
    //   }
    //  return temp
  return arr.reduce((o,v)=>{
    console.log(o,v)
    return o[v]
  },obj)
}
```

#### 19. 实现字符串repeat方法

```js
1. 使用join方法：

function repeat(str, n){
    return new Array(n + 1).join(str)
}

2. 使用递归：

function repeat(str, n){
    if(n === 1) return str
    let s = repeat(str, Math.floor(n / 2))
    s += s
    if(n % 2){ // 奇数多加一次
        s += str
    }
    return s
}
```

#### 20. 使用promise封装一个异步加载图片

```js
function loadImg(url){
    return new Promise((resolve, reject)=>{
        let img = new Image()
        img.onload = function(){
            resolve(img)
        }
        img.onerror = function(){
            reject(url'加载出错!')
        }
        img.src = url
    })
}
```

#### 21. 实现类似Promise.all()功能，按数组顺序执行

```js
function myPromise(arr){
    let result = [],
        promise = Promise.resolve();
    arr.forEach(v=>{
        promise = promise.then(v).then(res=>{
            result.push(res)
            return result
        })
    })
    return promise
}
```

#### 22. 实现所有维度的排列组合

```js

// 输出所有维度的组合，如 [['热', '冷''], ['大', '中']]  => 热+大，热+中，冷+大，冷+中

1. for循环实现：

function compose(list){
    if(!list.length) return list
    let res = []
    for(let arr of list){
        if(!res.length){
            res = arr.map(v=>[v])
        }else{
            let temp = []
            for(let item of arr){
                temp.push(...res.map(v=>[...v,item]))
            }
            res = temp
        } 
    }
    return res.map(v=>v.join(''))
}

2. 函数式编程实现：

function compose(list){
    let res = list.reduce((result, nextlist)=>{
        return nextlist.reduce((subres, item)=>{
            let tail = result.length ? res.map(v=>[...v,item]):[[item]]
            return [...subres,...tail]
        },[])
    },[])
    return res.map(v=>v.join(''))
}
```

#### 23. 用Promise实现红绿灯交替重复亮

```js
红灯3秒亮一次，黄灯2秒亮一次，绿灯1秒亮一次；如何让三个灯不断交替重复亮灯？
function red() {
    console.log('red');
}
function green() {
    console.log('green');
}
function yellow() {
    console.log('yellow');
}

function light(fn,time){
    return new Promise((resolve)=>{
        setTimeout(()=>{
           fn && fn()
           resolve()
        },time)
    })
}

function circleLight(){
    light(red,3000).then(()=>{
        light(yellow,2000).then(()=>{
            light(green,1000).then(()=>{
                circleLight()
            })
        })
    })
}

async function step(){
  await light(red,3000)
  await light(yellow,2000)
  await light(green,1000)
  console.log('下一波')
}
```

#### 24. 随机生成多少位的某数组 | 随机生成范围(x, x+n)的数组

```js
1. 使用Array.from：

function genArray(...args){
    if((args.length === 1)){
       return Array.from({
            length: args[0][1] - args[0][0] + 1
        },(_,i) => i + 1)
    }else{
       return Array.from({
            length: args[0]
        }).fill(args[1])
    }
}

function genArray(arr){
    return Array.from(new Array(arr[1]).keys()).slice(arr[0])
}

// 使用 genArray(10, 6) | genArray([1, 10])

2. 使用 new Array()：

function genArray(...args){
    return new Array(args[0]).fill(args[1])
}

// 使用 genArray(10, 6)
```

#### 25. a == 1 && a == 2 && a == 3 可能为 true 吗？

```js
将a定义为一个对象，重写 toString方法 或者 valueOf方法 实现
(左边对象在比较时会调用 toString方法 和 valueOf方法)

let a = {
    value: 1
    toString(){
        return a.value++
    }
    // valueOf(){
    //     return a.value++
    // }
}
```

#### 26. 实现判断浏览器的标识符

```js
if (window.ActiveXObject)
return "IE";
else if (document.getBoxObjectFor)
return "Firefox";
else if (window.MessageEvent && !document.getBoxObjectFor)
return "Chrome";
else if (window.opera)
return "Opera";
else if (window.openDatabase)
return "Safari";
```

#### 27. 实现一个观察者模式

```js
var events = (function() {
  var topics = {};
  return {
    // 注册监听函数
    subscribe: function(topic, handler) {
      if (!topics.hasOwnProperty(topic)) {
        topics[topic] = [];
      }
      topics[topic].push(handler);
    },

    // 发布事件，触发观察者回调事件
    publish: function(topic, info) {
      if (topics.hasOwnProperty(topic)) {
        topics[topic].forEach(function(handler) {
          handler(info);
        });
      }
    },

    // 移除主题的一个观察者的回调事件
    remove: function(topic, handler) {
      if (!topics.hasOwnProperty(topic)) return;

      var handlerIndex = -1;
      topics[topic].forEach(function(item, index) {
        if (item === handler) {
          handlerIndex = index;
        }
      });

      if (handlerIndex >= 0) {
        topics[topic].splice(handlerIndex, 1);
      }
    },

    // 移除主题的所有观察者的回调事件
    removeAll: function(topic) {
      if (topics.hasOwnProperty(topic)) {
        topics[topic] = [];
      }
    }
  };
})();
```

#### 28. 实现一个JSONP

```js
function jsonp(url, params, callback) {
  // 判断是否含有参数
  let queryString = url.indexOf("?") === -1 ? "?" : "&";

  // 添加参数
  for (var k in params) {
    if (params.hasOwnProperty(k)) {
      queryString += k + "=" + params[k] + "&";
    }
  }

  // 处理回调函数名
  let random = Math.random()
      .toString()
      .replace(".", ""),
    callbackName = "myJsonp" + random;

  // 添加回调函数
  queryString += "callback=" + callbackName;

  // 构建请求
  let scriptNode = document.createElement("script");
  scriptNode.src = url + queryString;

  window[callbackName] = function() {
    // 调用回调函数
    callback(...arguments);

    // 删除这个引入的脚本
    document.getElementsByTagName("head")[0].removeChild(scriptNode);
  };

  // 发起请求
  document.getElementsByTagName("head")[0].appendChild(scriptNode);
}
```

#### 29. 实现Promise.all

```js
1. 简易版：
Promise.myAll = function(list){
    return new Promise((resolve,reject)=>{
        if(list && list.length){
            let res = [],
                id = 0;
            list.forEach((v,i)=>{
                Promise.resolve(v).then(r=>{
                    res[i] = r
                    id++
                    if(id === list.length){
                        resolve(res)
                    }
                }).catch(err=>{
                    reject(err)
                })
            })
        }else resolve([])
    })
}

2. 通用版：
Promise.myAll = function(args){
    return new Promise((resolve,reject)=>{
        const result = []
        let forId = 0,
            sucId = 0;
        // 使用for of遍历带有Iterable结构的
        for(let v of args){
            let tempId = forId
            forId++
            // 包裹一层兼容非promise情况
            Promise.resolve(v).then(res=>{
                result[tempId] = res
                sucId++
                if(sucId === forId){
                    resolve(result)
                }
            }).catch(err=>{
                reject(err)
            })
        }
        if(!forId) resolve(result)
    })
}
```

#### 30. 实现一个Promise

```js

```

#### 31. 将类数组(拥有length属性和若干索引属性，但不具有数组原型上的方法被称为类数组)转为数组

```js
1. call方法调用数组的slice / splice 方法：
    - Array.prototype.slice.call(likeArr)
    - Array.prototype.splice.call(likeArr,0)

2. apply调用数组的concat方法：
    - Array.prototype.concat.apply([] , likeArr)

3. Array.form：
    - Array.form(likeArr)

4. 扩展运算符：
    - [...likeArr]
```

#### 32. 自定义事件监听localStorage

```js
1. 监听localStorage的内容变化：
	// 重写setItem
	const setItem = localStorage.setItem
	localStorage.setItem = function(name, value) {
		setItem.apply(this, arguments)
		let event = new Event('storageEvent')
		event.key = name
		event.value = value
		window.dispatchEvent(event)
	}

// 使用：
window.addEventListener('storageEvent', (e) => {
	console.log(e)
})
```
