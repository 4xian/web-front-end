# ES6相关总结

#### 1. let const var

```js
1. let const：
    - 声明的变量只在声明时的代码块内有效({}内)(块级作用域)
        - 解决了内层变量可能覆盖外层变量
        - 用来计数的循环变量泄漏为全局变量
    - 不存在变量提升
    - 存在暂时性死区，如果在变量声明前使用，会报错
    - 相同作用域内不允许重复声明，重复声明会报错，但是可以更改指针指向

2. const：
    - 声明只读的常量，声明后不可改变(引用类型是指针不可变，属性还可以改变)
    - 声明时必须设置初始值
    - 暂时性死区
    - 如果用var 或 let 声明过，再用const会报错

3.  var：
    - var声明的既是全局变量，也是顶层变量(window/global)
    - 存在变量提升
    - 可以对一个变量重复声明，会覆盖
    - 函数内使用var声明，变量时局部的
```

#### 2. 可以new一个键头函数吗？

```js
箭头函数 没有prototype，没有自己的this指向，也不能使用arguments参数，无法new箭头函数

new操作符的实现：
    - 以构造函数的prototype新建一个空对象
    - 将构造函数的this指向新建对象，并执行函数
    - 判断函数的返回值类型，引用类型则返回该引用类型，值类型则返回创建的对象

    function newFactory(){
        let obj = null,
            res = null,
            constructor = Array.prototype.shift.call(arguments);
        if(typeof constructor !== 'function'){
            return
        }
        obj = Object.create(constructor.prototype)
        res = constructor.apply(obj,arguments)
        return res && typeof (res === 'object' || typeof res === 'function') ? res : obj
    }

    // 使用
    newFactory(构造函数, 参数)
```

#### 3. 箭头函数和普通函数的区别

```js
1. 箭头函数更简洁：
    - 无参数，直接写空括号
    - 一个参数，省略括号
    - 多个参数，逗号分割
    - 函数体的返回值只有一句，可以省略大括号
    - 函数体无返回值，且只有一句话，可在语句前加void关键字(如调用函数)
        let fn = () => void doesNotReturn();

2. 箭头函数没有自己的this:
    - 不会创建自己的this，在自己作用域的上一层继承this，因此this的指向在定义时即确定，继承来的this指向永远不会改变
    - call apply bind 等方法不能改变箭头函数的this指向

3. 箭头函数不能作为构造函数使用，也没有prototype

4. 箭头函数没有自己的arguments：
    - 箭头函数中的arguments实际是外层函数的arguments

5. 箭头函数不能用作Generator函数，不能用yield关键字
```

#### 4. 扩展运算符(...)

```js
1. 可用于：
    - 展开数组/对象
    - 浅拷贝(生成新的数组或对象，不复制继承的属性或类的属性，会复制ES6的 symbol属性)
    - 合并数组
    - 生成数组
    - 可将定义了Iterator接口的类数组转为数组(如arguments)
```

#### 5. Proxy

```js
    - 创建一个对象的代理，实现基本操作的拦截和自定义
    - 如果一个属性不可配置（configurable）且不可写（writable），则 Proxy 不能修改该属性，否则会报错
    - 严格模式下，set代理如果没有返回true，就会报错
    - 取消代理：Proxy.revocable(target, handler);

1. Reflect：
    - 需在Proxy内部调用对象的默认行为，可使用Reflect
    - Proxy拥有的代理方法，Reflect对象都有，以静态方法存在
    - 修改某些Object方法的返回结果，让其变的更合理
    - 让Object操作都变成函数行为

2. 实现一个简易数据响应式：
    const reactive = (obj, getFunc, setFunc)=>{
        let handler = {
            // (目标对象, 属性名, proxy实例)
            get(target,property,proxy){
                getFunc(target,property)
                return Reflect.get(target,property,proxy)
            },
            // (目标对象, 属性名, 属性值, proxy实例)
            set(target,property,value,proxy){
                setFunc(value,property)
                return Reflect.set(target,property,value)
            }
        }
        return new Proxy(obj,handler)
    }
```

#### 6. ES6新增的字符串方法

```js
    // str中是否包括xxx
    - str.includes('xxx')
    // str是否以xxx开头
    - str.startWidth('xxx')
    // str是否以xxx结尾
    - str.endsWidth('xxx')

    // 重复多次复制字符串
    - str.repeat(n)
```

#### 7. ES6数组新增的方法

```js
1. Array.from：将类数组和具有iterable的对象(如Set,Map)转为数组
    - Array.from(likeArr, callback)

        Array.from([1, 2, 3], (x) => x * x)
        // [1, 4, 9]

2. Array.of：将一组值转为数组
    - 无参数时，返回空数组

3. copyWithin()：将指定位置的成员复制到其它位置，返回当前数组
    // target: 起始替换位置，负数为倒数
    // start: 起始替换数据，默认0，负值为倒数开始
    // end: 结束替换数据，默认数组长度，负值为倒数开始
    - copyWithin(target, start, end)
        [1, 2, 3, 4, 5].copyWithin(0, 3) // 将从 3 号位直到数组结束的成员（4 和 5），复制到从 0 号位开始的位置，结果覆盖了原来的 1 和 2
        // [4, 5, 3, 4, 5] 

4. find()：找出符合条件的第一个数组成员
   findIndex()：返回符合条件的第一个数组成员的位置，无符合则返回-1

    - 两个方法接受第二个参数，绑定回调函数的this对象
    - arr.find((value,index,arr){
        return 条件判断
    })

    [1, 5, 10, 15].find(function(value, index, arr) {
        return value > 9;
    }) // 10

    [1, 5, 10, 15].find(function(value, index, arr) {
        return value > 9;
    }) // 2

    
5. fill()：给定值填充一个数组
    - 接受第二个 第三个参数，指定填充的起始位置和结束位置

        ['a', 'b', 'c'].fill(7)
        // [7, 7, 7]

        new Array(3).fill(7)
        // [7, 7, 7]

6. entries() keys() values()：
    - keys 对键名的遍历
    - values 对键值的遍历
    - entries 对键值对的遍历
    for (let name of [1,2,3,4].keys()) {
        console.log(name)
    }

7. includes()：判断数组是否包含某个值
    - 第二个参数表示搜索的起始位置，默认0
    - 参数为负数表示倒数的位置

        [1, 2, 3].includes(2)     // true
        [1, 2, 3].includes(3, -1); // true

8. flat()：数组扁平化处理，返回新数组，对原数据无影响
    - 默认扁平一层，可填入参数指定层数，Infinity表示完全扁平

   flatMap()：对数组中的每个成员执行类似map的方法，然后对返回值组成的数组执行flat方法，返回新数组，对原数据无影响
    - 第二个参数绑定遍历函数里面的this

    利用尾递归自己实现数组扁平化：
        // 具体实现
        function flat(arr = [], result = []) {
            arr.forEach(v => {
                if(Array.isArray(v)) {
                    result = result.concat(flat(v, []))
                }else {
                    result.push(v)
                }
            })
            return result
        }

```

#### 8. ES6对象新增的方法

```js
1. 对象键名和值名相等时可简写，方法也可简写
    - 简写的对象方法不能用作构造函数

2. 属性名表达式：
     - 表达式放括号内
        const a = {
            'first word': 'hello',
            [lastWord]: 'world'  // 表达式作键名
        };

    - 表达式定义方法名
        let obj = {
          ['h' + 'ello']() {  // 定义方法名
            return 'hi';
          }
        };

    - 属性名表达式如果是对象，会将对象转为字符串[object Object]
        const keyA = {a: 1};
        const myObject = {
            [keyA]: 'valueA'
        };
        // Object {[object Object]: "valueB"} 相同的键，值被覆盖
        myObject

3. super关键字：指向当前的对象的原型对象
        const proto = {
            foo: 'hello'
        };
        const obj = {
            foo: 'world',
            find() {
                return super.foo;
            }
        };
        Object.setPrototypeOf(obj, proto); // 为obj设置原型对象
        obj.find() // "hello"

4. 属性的遍历：
    - for in : 遍历对象自身和继承的可枚举属性(不含Symbol属性)
    - Object.keys(obj): 返回数组，包括对象自身的(不含继承)的所有可枚举属性(不含Symbol属性)的键
    - Object.getOwnPropertyNames(obj)：回一个数组，包含对象自身的所有属性（不含 Symbol 属性，但是包括不可枚举属性）的键名
    - Object.getOwnPropertySymbols(obj)：返回一个数组，包含对象自身的所有 Symbol 属性的键名
    - Reflect.ownKeys(obj)：返回一个数组，包含对象自身的（不含继承的）所有键名，不管键名是 Symbol 或字符串，也不管是否可枚举

    - 以上遍历遵循次序规则：
        - 首先遍历所有数值键，按照数值升序排列
        - 其次遍历所有字符串键，按照加入时间升序排列
        - 最后遍历所有 Symbol 键，按照加入时间升序排

        Reflect.ownKeys({ [Symbol()]:0, b:0, 10:0, 2:0, a:0 })
        // ['2', '10', 'b', 'a', Symbol()]

5. 新增方法：
    - Object.is(): 判断两值是否相等，与===不同的是： +0不等于-0，NaN等于NaN
    - Object.assign(): 用于对象合并，将源对象所有可枚举属性，复制到目标对象target中(浅拷贝，同名属性会替换)
        - 第一个参数是目标对象，其他参数都是源对象
        Object.assign(target, source1, source2, ...);
        console.log(target)

    - Object.getOwnPropertyDescriptors()：返回指定对象所有自身属性(非继承)的描述对象
        const obj = {
            foo: 123,
            get bar() { return 'abc' }
        };

        Object.getOwnPropertyDescriptors(obj)
        // { foo:
        //    { value: 123,
        //      writable: true,
        //      enumerable: true,
        //      configurable: true },
        //   bar:
        //    { get: [Function: get bar],
        //      set: undefined,
        //      enumerable: true,
        //      configurable: true } }

    - Object.setPrototypeOf()：设置一个对象的原型对象
        Object.setPrototypeOf(obj, prototype)

    - Object.getPrototypeOf()：获取一个对象的原型对象
        Object.getPrototypeOf(obj);

    - Object.keys() | Object.values() | Object.entries()
        - Object.keys(): 返回自身的(不含继承)所有可遍历属性的键名数组
        - Object.values(): 返回自身的(不含继承)所有可遍历的键值的数组
        - Object.entries(): 返回对象自身的(不含继承)所有可遍历属性键值对的数组

        var obj = { foo: 'bar', baz: 42 };
        Object.keys(obj) // ["foo", "baz"]
        Object.values(obj) // ["bar", 42]
        Object.entries(obj) // [ ["foo", "bar"], ["baz", 42] ]

    - Object.fromEntries(): 用于将键值对数组转为对象
        Object.fromEntries([
            ['foo', 'bar'],
            ['baz', 42]
        ])
        // { foo: "bar", baz: 42 }
```

#### 9. ES6函数新增相关

```js
1. 参数相关：
    - 函数参数可设默认值
    - 函数的形参是默认声明的，不能使用let/const再次声明
    - 参数默认值可与解构的默认值结合使用
    - 参数默认值如不是尾参数，则该参数无法省略
    function log(x, y = 'World') {
      console.log(x, y);
    }
    
    function foo({x, y = 5} = {}){//设置默认值避免无参报错
      console.log(x, y);
    }

2. 属性相关：
    - name属性：返回函数的函数名
       - Function构造函数返回的函数实例，name属性的值为anonymous
       - bind返回的函数，name属性值会加上bound前缀

       (new Function).name // "anonymous"
       function foo() {};
       foo.bind({}).name // "bound foo"

    - length属性：返回没有指定默认值的参数个数，rest参数不计入length，设置默认参数不是尾参数，length也不计入后面的参数

    (function (a) {}).length // 1
    (function (a = 5) {}).length // 0
    (function(...args) {}).length // 0
    (function (a = 0, b, c) {}).length // 0
    (function (a, b = 1, c) {}).length // 1

3. 作用域：设置参数默认值后，函数声明初始化时，参数会形成一个单独的作用域，初始化结束，作用域会消失(无参数默认值时，不会出现该情况)
    // y=x会形成一个单独作用域，x没有被定义，所以指向全局变量x
    let x = 1;
    function f(y = x) { 
        // 等同于 let y = x  
        let x = 2; 
        console.log(y);
    }
    f() // 1

4. 函数内部开启严格模式时，参数使用默认值，解构赋值，扩展运算符会报错
```

#### 10. ES6中Set Map相关

```js
1. Set：无序的，不重复的元素组成的集合
    - 常用方法：
        const s = new Set()
        // Set的增删改查：
        s.size; // 返回Set的成员个数
        s.add(xx); // 已存在的值不会添加
        s.delete(xx); //返回布尔值，表示是否删除成功
        s.has(xx); // 判断某值是否为Set的成员
        s.clear(); // 清除所有成员

    - 遍历(遍历顺序即插入顺序)：
        keys(); // 返回键名的遍历器
        values(); // 返回键值的遍历器
        entries(); //返回所有键值对的遍历器

        let set = new Set(['red', 'green', 'blue']);
        for (let item of set.entries()) {
          console.log(item);
        }
        // ["red", "red"]
        // ["green", "green"]
        // ["blue", "blue"]

        forEach()
         - 对每个成员执行某种操作，键值，键名都相等
         - 第二个参数绑定处理函数的this

            let set = new Set([1, 4, 9]);
            set.forEach((value, key) => console.log(key + ' : ' + value))
            // 1 : 1
            // 4 : 4
            // 9 : 9

2. Map：有序的，不重复的任意类型键值对组成的的字典(实际是一个数组，里面的数据也是一个数组)
    - 常用方法：
        const m = new Map();
        Map的增删改查：
        m.size; // 返回Map的成员个数
        m.set(key, value); // 新增键名和键值
        m.get(key);//读取key对应的值,无返回undefined
        m.has(key); // 查询某个键是否在Map中，返回布尔值
        m.delete(key); // 删除某个键，返回布尔值
        m.clear(); // 清除所有成员

    - 遍历：同Set
        map.forEach(function(value, key, map) {
            console.log("Key: %s, Value: %s", key, value);
        });

3. WeakSet：
    - 接受一个具有Iterable接口的对象作为参数
        const a = [[1, 2], [3, 4]];
        const ws = new WeakSet(a);
        // WeakSet {[1, 2], [3, 4]}

    - WeakSet成员只能引用类型
        let weakSet=new WeakSet([2,3]);
        console.log(weakSet) // 报错

        // 成员为引用类型
        let obj1={name:1}
        let obj2={name:1}
        let ws=new WeakSet([obj1,obj2]); 
    
    - WeakSet里面的引用只要在外部消失，它在WeakSet里面的引用就会自动消失

    - 与Set相比：
        - 没有遍历操作的API
        - 没有size属性

4. WeakMap：(键是弱引用，值是正常引用)
    - 只接受对象作为键名(null除外)，值可以是任意的，可使用set方法添加成员，也可接受数组做参数
    - 键名所指向的对象，不需要后里面的键名对象和对应的键值对会自动消失，无需手动删除引用(WeakMap的键名所指向的对象，不计入垃圾回收机制)
      例：在网页的 DOM 元素上添加数据，就可以使用WeakMap结构，当该 DOM 元素被清除，其所对应的WeakMap记录就会自动被移除
        const wm = new WeakMap();
        const element = document.getElementById('example');
        wm.set(element, 'some information');
        wm.get(element) // "some information"

    - WeakMap 弱引用的只是键名，而不是键值，键值依然是正常引用
        例：键值obj会在WeakMap产生新的引用，当你修改obj不会影响到内部
        const wm = new WeakMap();
        let key = {};
        let obj = {foo: 1};

        wm.set(key, obj);
        obj = null;
        wm.get(key)
        // Object {foo: 1}

    - 与Map区别：
        - 没有遍历操作的API
        - 没有clear清空方法，其他方法(set,get,has,delete)与Map一样(可以通过创建一个空的WeakMap并替换原对象来实现清除)

5. Map与Object的区别：
    - Map:
        - Map默认不包含任何键，只包括显示插入的键
        - Map的键可是任意值，函数，对象等等
        - Map的键是有序的
        - Map的键值对个数可通过size属性获取
        - Map是有Iterable，可被迭代

    - Object:
        - Object有原型，原型链上的键名可能会与定义的产生冲突
        - Object的键必须是String或Symbol
        - Object的键是无序的
        - Object的键值对个数只能手动计算
        - Object需要先获取键才能迭代
```

#### 11. ES6中的Promise

```js
1. Promise只有三种状态：状态不受外界影响，只有异步操作的结果可以决定状态，状态一旦变化便不再改变且只有 pending-->fulfilled | pending-->rejected
    - pending：进行中
    - fulfilled：已成功
    - rejected：已失败

    -缺点：
        - 无法中途取消Promise
        - 不设置回调函数，Promise内部抛出的错误，不会反应到外部
        - 处于pending时，无法确定目前是哪个阶段(刚开始还是即将完成)
```

```js
2. Promise构造函数：接受一个函数作为参数，函数的两个参数为resolve和reject，resolve将状态由 未完成 变为 成功，reject将由 未完成 变为 失败
    - all()：
        - 用于将多个 `Promise`实例，包装成一个新的 `Promise`实例
        - 接受一个数组（迭代对象）作为参数，数组成员都应为`Promise`实例
        - 数组中所有成员状态都resolved时，all方法才会变成resolved，有一个rejected，all方法将变成rejected
        - 如果作为参数的 Promise 实例，自己定义了catch方法，那么它一旦被rejected，并不会触发Promise.all()的catch方法，而是走then方法
        - 成功时回调函数的参数也是一个数组，按顺序保存着每一个promise实例resolve的值，失败时则返回最先reject的值

    - race()：
        - 同样是将多个 Promise 实例，包装成一个新的 Promise 实例
        - 有一个实例率先改变状态(resolved/rejected)，它的状态就跟着改变

    - allSettled()：
        - 接受一组 Promise 实例作为参数，包装成一个新的 Promise 实例
        - 只有等到所有这些参数实例都返回结果，不管是fulfilled还是rejected，包装实例才会结束

    - resolve()：
        - 将现有对象转为 Promise对象
        - 参数是一个 Promise 实例，promise.resolve将不做任何修改、原封不动地返回这个实例
        - 参数是一个thenable对象，promise.resolve会将这个对象转为 Promise对象，然后就立即执行thenable对象的then()方法
        - 参数不是具有then()方法的对象，或根本就不是对象，Promise.resolve()会返回一个新的 Promise 对象，状态为resolved
        - 没有参数时，直接返回一个resolved状态的 Promise 对象

    - reject()：
        - 返回一个新的 Promise 实例，该实例的状态为rejected
        - reject()方法的参数，会原封不动地变成后续方法的参数
```

```js
3. Promise实例： 
    - then()：
        - 接受两个回调函数作参数，第一个为状态resolved时使用，第二个为状态为rejected时使用(第二个参数可省略)
        - 可链式调用(用于顺序的异步事件)

        const promise = new Promise((resolve, reject)=>{
            if(/* 异步成功 */){
                resolve()
            }else{
                reject()
            }
        })

        promise.then(function(msg){
            console.log(msg);
        },function(error){
            console.log(error);
        });

        getJSON("/posts.json").then(function(json) {
            return json.post;
        }).then(function(post) {
            // ...链式书写
        });

    - catch()：`catch()`方法是`.then(null, rejection)`或`.then(undefined, rejection)`的别名(即then的第二个参数)，用于指定发生错误时的回调函数；

        getJSON('/posts.json').then(function(posts) {
          // ...
        }).catch(function(error) {
          // 处理 getJSON 和 前一个回调函数运行时发生的错误
          console.log('发生错误！', error);
        });
        
        
        // 错误具有“冒泡”性质，会一直向后传递，直到被捕获为止
        getJSON('/post/1.json').then(function(post) {
          return getJSON(post.commentURL);
        }).then(function(comments) {
          // some code
        }).catch(function(error) {
          // 处理前面三个Promise产生的错误
        });
        
        // 一般这样写
        promise.then((res)=>{
            //...
        }).catch(error=>{
            //...
        });

    - finally()：用于指定不管 Promise 对象最后状态如何，都会执行的操作(在then/catch后执行)
        promise
        .then(result => {···})
        .catch(error => {···})
        .finally(() => {···});

```

#### 12. async / await(Generator的语法糖)

```js
1. async：
    - async函数返回的是一个promise对象，可用then()处理，如果在函数中return一个直接量，async会把这个直接量通过Promise.resolve()封装成Promise对象
    - 在没有await的情况下执行async函数，会立即执行，返回一个Promise对象，并且不会阻塞后面的语句
        async function test(){
            return 'xxx'
        }
        let res = test()
        console.log(res)
        res.then(v=>{
            console.log(v) // xxx
        })

2. await：等待表达式的结果
    - 如果不是等待Promise对象，那么表达式的运算结果即为它等待的东西
    - 如果是Promise对象，await便会阻塞后面的代码，等待Promise对象resolve作为表达式的结果

3. async/await 与 Promise的区别：
    - 摆脱了Promise的链式调用，解决了Promise传递中间值的繁琐行为
    - 使用try/catch处理错误
    - 断点调试友好，调试器只能跟踪同步代码，无法进入.then代码块

4. 捕获异常：
    async function fn(){
        try{
            let res = await Promise.reject('err')
        }catch(err){
            console.log(err)
        }
    }
```

#### 13. ES6Class(类) 和 ES5的类

```js
1. 
    - class类必须new调用，不能直接执行；ES5的类与普通函数一样，可以执行
    - class类不存在变量提升；ES5的类可以变量提升
    - class类无法遍历实例原型链的属性和方法；ES5的类则可以遍历
    - ES6中为new命令引入一个new.target属性，返回new命令作用于的构造函数，不是通过new调用或Reflect.constructor调用的，new.target会返回undefined
    - class类有static静态方法，只能通过类调用，实例无法调用，静态方法包含this，this指的是类，而不是实例，static声明的静态属性和方法可被子类继承
```

#### 14. ES6中的Iterator迭代器

```js
1. 提供统一的接口，为不同的数据结构提供统一的访问途径

2. 
```
