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

4. 暂时性死区：
    - 当前的执行上下文，会有变量提升，未被初始化，在执行上下文执行阶段，执行代码如果没有执行到变量赋值，引用此变量会报错
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
1. 箭头函数语法更简洁清晰：
    - 无参数，直接写空括号
    - 一个参数，省略括号
    - 多个参数，逗号分割
    - 函数体的返回值只有一句，可以省略大括号
    - 函数体无返回值，且只有一句话，可在语句前加void关键字(如调用函数)
        let fn = () => void doesNotReturn();

2. 箭头函数没有自己的this：(定义时捕获外层环境的this)
    - 不会创建自己的this，在自己作用域的上一层继承this，因此this的指向在**定义时**会捕获外层环境的this，继承来的this指向永远不会改变(箭头函数定义的作为对象的方法调用，this指向的依旧是Window)
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

#### ES6中的Proxy：定义基本操作的自定义行为(元编程)

1. Proxy构造函数：

    ```js
    const proxy = new Proxy(target, handler);
    //target：拦截的目标对象(对象，数组，函数，代理...)
    //handler：通常以函数作为属性的对象，各属性中的函数分别定义了在执行各种操作时代理 p 的行为
    
    关于handler拦截属性，有如下：
    get(target,propKey,receiver)：
    //拦截对象属性的读取
    set(target,propKey,value,receiver)：
    //拦截对象属性的设置
    has(target,propKey)：
    //拦截propKey in proxy的操作，返回一个布尔值
    deleteProperty(target,propKey)：
    //拦截delete proxy[propKey]的操作，返回一个布尔值
    ownKeys(target)：
    //拦截Object.keys(proxy)、for...in等循环，返回一个数组
    getOwnPropertyDescriptor(target, propKey)：
    //拦截Object.getOwnPropertyDescriptor(proxy, propKey)，返回属性的描述对象
    defineProperty(target, propKey, propDesc)：
    //拦截Object.defineProperty(proxy, propKey, propDesc），返回一个布尔值
    preventExtensions(target)：
    //拦截Object.preventExtensions(proxy)，返回一个布尔值
    getPrototypeOf(target)：
    //拦截Object.getPrototypeOf(proxy)，返回一个对象
    isExtensible(target)：
    //拦截Object.isExtensible(proxy)，返回一个布尔值
    setPrototypeOf(target, proto)：
    //拦截Object.setPrototypeOf(proxy, proto)，返回一个布尔值
    apply(target, object, args)：
    //拦截 Proxy 实例作为函数调用的操作
    construct(target, args)：
    //拦截 Proxy 实例作为构造函数调用的操作2.Reflect：
    ```

2. Reflect：

    - 在proxy内部调用对象的默认行为
    - Proxy对象有的代理方法，Reflect对象都有
    - 修改某些Object方法的返回结果
    - 让Object操作都变成函数行为

    ```js
    1.将 Object 对象的一些明显属于语言内部的方法（比如 Object.defineProperty，放到 Reflect 对象上。
    
    2.修改某些 Object 方法的返回结果，让其变得更合理。
    
    3.让 Object 操作都变成函数行为。
    
    4.Reflect 对象的方法与 Proxy 对象的方法一一对应，只要是 Proxy 对象的方法，就能在 Reflect 对象上找到对应的方法。这就让 Proxy 对象可以方便地调用对应的 Reflect 方法，完成默认行为，作为修改行为的基础。也就是说，不管 Proxy 怎么修改默认行为，你总可以在 Reflect 上获取默认行为
    ```

3. Proxy的几种用法：

    - get()：get接受三个参数，依次为目标对象、属性名和 proxy 实例本身，最后一个参数可选

    - (如果一个属性不可配置（configurable）且不可写（writable），则 Proxy 不能修改该属性，否则会报错)

        ```js
        var person = {
          name: "张三"
        };
        var proxy = new Proxy(person, {
          get: function(target, propKey) {
            return Reflect.get(target,propKey)
          }
        });
        proxy.name // "张三"
        ```

    - set()：set方法用来拦截某个属性的赋值操作，可以接受四个参数，依次为目标对象、属性名、属性值和 Proxy 实例本身

    - (如果目标对象自身的某个属性，不可写且不可配置，那么`set`方法将不起作用)

    - (严格模式下，`set`代理如果没有返回`true`，就会报错)

        ```js
        let validator = {
          set: function(obj, prop, value) {
            if (prop === 'age') {
              if (!Number.isInteger(value)) {
                throw new TypeError('The age is not an integer');
              }
              if (value > 200) {
                throw new RangeError('The age seems invalid');
              }
            }
            // 对于满足条件的 age 属性以及其他属性，直接保存
            obj[prop] = value;
          }
        };
        let person = new Proxy({}, validator);
        ```

    - deleteProperty()：用于拦截delete操作，如果这个方法抛出错误或者返回`false`，当前属性就无法被`delete`命令删除

    - (目标对象自身的不可配置（configurable）的属性，不能被`deleteProperty`方法删除，否则报错)

        ```js
        var handler = {
          deleteProperty (target, key) {
            invariant(key, 'delete');
            Reflect.deleteProperty(target,key)
            return true;
          }
        };
        function invariant (key, action) {
          if (key[0] === '_') {
            throw new Error(`无法删除私有属性`);
          }
        }
        var target = { _prop: 'foo' };
        var proxy = new Proxy(target, handler);
        delete proxy._prop
        // Error: 无法删除私有属性
        ```

4. 取消代理：Proxy.revocable(target, handler)

5. 使用场景：

    - 拦截和监视外部对对象的访问

    - 降低函数或类的复杂度

    - 在复杂操作前对操作进行校验或对所需资源进行管理

    - __实现观察者模式__：函数自动观察数据对象，一旦对象有变化，函数就会自动执行`observable`函数返回一个原始对象的 `Proxy` 代理，拦截赋值操作，触发充当观察者的各个函数

    - ```js
        const queuedObservers = new Set();
        
        const observe = fn => queuedObservers.add(fn);
        const observable = obj => new Proxy(obj, {set});
        
        function set(target, key, value, receiver) {
          const result = Reflect.set(target, key, value, receiver);
          queuedObservers.forEach(observer => observer());
          return result;
        }
        //观察者函数都放进Set集合，当修改obj的值，在会set函数中拦截，自动执行Set所有的观察者
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

2. 如何中断Promise后面的链式调用：直接在then方法返回新的Promise实例，让状态保持pending时，原Promise链将会中止
    Promise.resolve().then(()=>{
        console.log('then 1')
        return new Promise(()=>{})
    }).then(()=>{
        console.log('then 2')
    }).then(()=>{
        console.log('then 3')
    })

    - 例：给网络请求设置超时时间，超时后便中断
        // 超时3秒后取消请求
        const cancelRequest = (fn, time = 3000) => {
            const wait = new Promise((resolve, reject)=>{
                setTimeout(()=>{
                    reject('请求超时')
                },time)
            })
            return Promise.race([fn, wait])
        }

        function test(){
            return new Promise((resolve, reject)=>{
                setTimeout(()=>{
                    resolve('请求成功')
                },5000)
            })
        }

        cancelRequest(test())  // 请求超时
```

```js
3. Promise构造函数：接受一个函数作为参数，函数的两个参数为resolve和reject，resolve将状态由 未完成 变为 成功，reject将由 未完成 变为 失败
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
4. Promise实例： 
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

#### 12. async / await(Generator + Promise的语法糖)

```js
1. async：
    - async函数返回的是一个promise对象，可用then()处理，如果在函数中return一个直接量，async会把这个直接量通过Promise.resolve()封装成Promise对象

2.  - 函数内没有await时：执行async函数，会返回一个Promise实例对象，并且不会阻塞后面的语句
        async function test(){
            return 'xxx'
        }
        let res = test()
        console.log(res) // promise实例
        res.then(v=>{
            console.log(v) // xxx
        })

    - 函数内有await时：
        - 如果不是等待Promise对象，那么表达式的运算结果即为它等待的东西
        - 如果是Promise对象，await便会阻塞后面的代码：
            - Promise的resolve作为表达式的结果，然后继续向下执行
            - Promise的reject会抛出异常，中止向下执行

        async function awaitFn(){
            let res = await new Promise((r,j)=>{
                r('成功')
            })
            console.log(res) // 成功
        }

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

#### 13. ES6的Generator

1. 会返回一个遍历器对象，可以依次遍历 `Generator` 函数内部的每一个状态

    - `function`关键字与函数名之间有一个星号

    - 函数体内部使用`yield`表达式，定义不同的内部状态

        ```js
        1. 遇到yield表达式，就暂停执行后面的操作，并将紧跟在yield后面的那个表达式的值，作为返回的对象的value属性值。
        2. 下一次调用next方法时，再继续往下执行，直到遇到下一个yield表达式
        3. 如果没有再遇到新的yield表达式，就一直运行到函数结束，直到return语句为止，并将return语句后面的表达式的值，作为返回的对象的value属性值。
        4. 如果该函数没有return语句，则返回的对象的value属性值为undefined
        
        5. done用来判断是否存在下个状态，value对应状态值
        6. yield表达式本身没有返回值，或者说总是返回undefined
        
        function* helloWorldGenerator() {
          yield 'hello';
          yield 'world';
          return 'ending';
        }
        var hw = helloWorldGenerator();
        hw.next()
        // { value: 'hello', done: false }
        hw.next()
        // { value: 'world', done: false }
        hw.next()
        // { value: 'ending', done: true }
        hw.next()
        // { value: undefined, done: true }
        
        7. 通过调用next方法可以带一个参数，该参数就会被当作上一个yield表达式的返回值

        function* foo(x) {
            var y = 2 * (yield (x + 1));
            var z = yield (y / 3);
            return (x + y + z);
        }
        var b = foo(5);
        b.next() // { value:6, done:false }
        b.next(12) // { value:8, done:false }
        b.next(13) // { value:42, done:true }

        8. 正因为Generator函数返回Iterator对象，因此我们还可以通过for...of进行遍历
        
        原生对象没有遍历接口，通过Generator函数为它加上这个接口，就能使用for...of进行遍历了
        
        function* objectEntries(obj) {
          let propKeys = Reflect.ownKeys(obj);
        
          for (let propKey of propKeys) {
            yield [propKey, obj[propKey]];
          }
        }
        let jane = { first: 'Jane', last: 'Doe' };
        for (let [key, value] of objectEntries(jane)) {
          console.log(`${key}: ${value}`);
        }
        // first: Jane
        // last: Doe
        ```

2. 异步解决方案：
    - 回调函数
    - Promise对象
    - generator函数
    - async/await

#### 14. ES6中Decorator(装饰器)

1. 一个普通的函数，用于扩展类属性和类方法

    - __类的装饰__：

        ```js
        //想要传递参数，可在装饰器外层再封装一层函数
        
        function testable(isTestable) {
            // target可理解为 类名
          return function(target) {
            target.isTestable = isTestable;
          }
        }
        
        @testable(true) // 带参数
        class MyTestableClass {}
        MyTestableClass.isTestable // true
        
        @testable(false)
        class MyClass {}
        MyClass.isTestable // false
        ```

    - __类属性的装饰__：

        ```js
        对类属性进行装饰的时候，能够接受三个参数:
        1. 类的原型对象
        2. 需要装饰的属性名
        3. 装饰属性名的描述对象
        
        //首先定义一个readonly装饰器
        function readonly(target, name, descriptor){
          descriptor.writable = false; // 将可写属性设为false
          return descriptor;
        }
        
        //使用readonly装饰类的name方法
        class Person {
          @readonly
          name() { return `${this.first} ${this.last}` }
        }
        
        相当于以下调用
        readonly(Person.prototype, 'name', descriptor);
        ```

    - 如果有多个装饰器，则从外到内(从上往下)进入，再从内到外(从下往上)执行

        ```js
        function dec(id){
            console.log('进入', id);
            return (target, property, descriptor) =>console.log('执行', id);
        }

        class Example {
            @dec(1)
            @dec(2)
            method(){}
        }
        // 进入 1
        // 进入 2
        // 执行 2
        // 执行 1
        ```

    - 装饰器不能用于修饰函数，因为函数存在变量声明情况

    - 使用场景：
        1. 使用react-redux的时候：

            ```js
                class MyComponent extends React.Component {}
                export default connect(mapStateToProps, mapDispatchToProps)(MyComponent)

                // 使用装饰器
                @connect(mapStateToProps, mapDispatchToProps)
                export default class MyComponent extends React.Component{}
            ```

        2. 将mixins写成装饰器：

            ```js
                function mixins(...args){
                    return function(target){
                        Object.assign(target.prototype, ...args)
                    }
                }
                // 使用
                const Foo = {
                    foo(){
                        console.log('foo')
                    }
                }
                @mixins(Foo)
                class MyClass{}

                let obj = new MyClass{}
                obj.foo() // foo
            ```

#### 15. ES6的Class(类) 和 ES5的类

```js
1. 
    - class类必须new调用，不能直接执行；ES5的类与普通函数一样，可以执行
    - class类不存在变量提升；ES5的类可以变量提升
    - class类无法遍历实例原型链的属性和方法；ES5的类则可以遍历
    - ES6中为new命令引入一个new.target属性，返回new命令作用于的构造函数，不是通过new调用或Reflect.constructor调用的，new.target会返回undefined
    - class类有static静态方法，只能通过类调用，实例无法调用，静态方法包含this，this指的是类，而不是实例，static声明的静态属性和方法可被子类继承
```

#### 16. ES6中的Iterator迭代器

```js
1. 提供统一的接口，为不同的数据结构提供统一的访问途径

2. Iterator规范：迭代器包含一个next()方法，方法返回两个属性：done(布尔值，表示遍历是否结束)和value(返回当前位置的成员)

3. 定义一个对象的Symbol.iterator属性，可将此对象修改为迭代器对象，可使用for...of遍历

4. obj[Symbol.iterator] = function(){
        let that = this,
            keys = Object.keys(that),
            id = 0;
        return {
            next(){
                return id < keys.length ? {
                    // value: [keys[id],that[keys[id++]]]
                    value: that[keys[id++]],
                    done: false
                } : {
                    value: undefined,
                    done: true
                }
            }
        }
   }

   for(let v of obj){
       console.log(v)
   }
```

#### 17. 