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

#### 10. 实现通用数据类型检测方法

```js
function getType(v){
    let temp;
    if(v === 'null') return null
    if(typeof v !== 'object') return typeof v
    temp = Object.prototype.toString.call(v).split(' ')[1].split('')
    temp.pop()
    return temp.join('').toLowerCase()
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

#### 15. 用setTimeout模拟setInterval

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

#### 18. 

```js

```
