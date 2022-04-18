# JavaScript相关总结

##### 1.  JS的数据类型：

1. 基本数据类型：
    - Number / String / Boolean / 
    - null / undefined
    - Symbol  创建独一无二的不可改变数据(确保对象属性唯一)
    - BigInt   安全的存储和操作大整数

2. 引用类型：
    - Object(基本对象，数组，函数，日期，正则，Map，Set...)

3. 基本数据类型值存储于栈中；引用数据类型指针存储于栈中，值存储于堆中

##### 2. null 和undefined的区别：

1. null ：空对象指针，未指向任何对象，一般作初始化返回对象的遍历使用
2. undefined：未定义，声明了没有给值，为了安全的获取undefined值可使用void 0 代替undefined   (xxx === void 0)

##### 3. JS中原型 | 原型链：

1. 原型：构造函数内部都有一个prototype属性，该对象包含可以由该构造函数所有实例共享的属性和方法，当构造函数新建一个对象时，对象中包含一个\__proto\__属性，指向构造函数的prototype，可以使用Object.getPrototypeOf()获取对象的原型

2. 原型链：当访问一个对象的属性时，如果对象内部无该属性，则会向创建该实例的原型对象上寻找，原型对象也有自己的原型，一直找下去，最后到Object.prototype形成原型链

    ```js
    1. 每个函数都有一个特殊的属性叫作原型(prototype)
    2. prototype是一个对象(原型对象)，有属constructor，指向该函数(func.prototype.coustructor === func)
    3. 原型对象也可能有原型，并从中继承方法和属性，一层一层以此类推，这种关系称为原型链
    func.prototype = {
    	constructor:func(),
    	_proto_:{
    		// 各种方法
    		_proto_:{
    			// 各种方法
    			_proto_:{
    				...
    			}
    		}
    	}
    }
    
    4. function Func(){
       		// 构造函数Func() 
       }
    	let instance = new Func();
    instance._proto_ = Func.prototype;
    Func.prototype._proto_ 指向内置对象(Object.prototype)
    
    5. _proto_ 指向创建它的构造函数的原型prototype
    instance._proto_ = Func.prototype;
    构造函数式一个函数对象，通过Function构造器产生的
    Func._proto_ = Function.prototype;
    原型本身是一个普通对象，通过Object构造器产生
    Func.prototype._proto_ = Object.prototype;
    所有的构造器都是函数对象，都由Function构造产生
    Object._proto_ = Function.prototype;
    Object的原型对象也有_proto_，指向null(原型链的顶端)
    ```

3. 获取原型的方法：
    - instance.\__proto\__
    - instance.constructor.prototype
    - Object.getPrototypeOf(instance)

##### 4. JS中整数的安全范围：

1. 安全整数：在该范围内转换为二进制不会丢失精度，最大安全整数为2^53 - 1，ES6中定义为Number.MAX.SAFE_INTEGER，最小安全整数为-2^53 - 1，Number.MIN.SAFE_INTEGER

##### 5. isNaN和Number.isNaN

1. isNaN先将参数转为数值，不能转为数值的都返回true
2. Number.isNaN先判断是否为数字，是数字再判断是否为NaN

###### 6. Array构造函数只有一个参数值时

1. 该参数会作为数组的预设长度(length)，创建的是空数组

##### 7. JS中的类型转换规则：(显示转换，隐式转换)

1. 其他值转为数字：Number() / parseInt() / parseFloat()

    - undefined || 'string(非数字)'=> NaN
    - null || ' '  || false=> 0
    - true => 1
    - 对象类型先调用toPrimitive转为基本类型，再遵循基本类型转为数字规则(转为基本类型时，先检查值是否有valueOf()方法，如果有并返回基本类型值，则使用该值转换，没有则使用toString()的返回值来进行转换，若都不返回基本类型值，则报错)

    ```js
    1. Number转换的时候是很严格的，只要有一个字符无法转成数值，整个字符串就会被转为NaN
    2. parseInt函数逐个解析字符，遇到不能转换的字符就停下来
    
    Number(324) // 324
    // 字符串：如果可以被解析为数值，则转换为相应的数值
    Number('324') // 324
    // 字符串：如果不可以被解析为数值，返回 NaN
    Number('324abc') // NaN
    // 空字符串转为0
    Number('') // 0
    // 布尔值：true 转成 1，false 转成 0
    Number(true) // 1
    Number(false) // 0
    // undefined：转成 NaN
    Number(undefined) // NaN
    // null：转成0
    Number(null) // 0
    // 对象：通常转换成NaN(除了只包含单个数值的数组)
    Number({a: 1}) // NaN
    Number([1, 2, 3]) // NaN
    Number([5]) // 5
    
    parseInt('32a3') //32
    ```

2. 任意值转成字符串：String()

    - 一般都是直接加" "
    - 对象转成字符串为"[object Object]"

3. 其他值转为布尔值：Boolean()

    - undefined / null / false / +0 / -0 / 0 / NaN / " "   ==> false
    - true / 非空字符串 / 非零数值(无穷) / 任意对象(除null) / ==>true

4. **隐式转换**：(要求运算符两边的操作数不是同一类型)

    - 比较运算（`==`、`!=`、`>`、`<`）、`if`、`while`需要布尔值地方
    - 算术运算（`+`、`-`、`*`、`/`、`%`）

    ```js
    1. 自动转成布尔值：(系统内部会调用Boolean函数)
    
    2. 自动转成字符串：(常发生在+运算中，一旦存在字符串，则会进行字符串拼接操作)
    	- 先将复合类型的值转为原始类型的值，再将原始类型的转	     为字符串
    '5' + 1 // '51'
    '5' + true // "5true"
    '5' + false // "5false"
    '5' + {} // "5[object Object]"
    '5' + [] // "5"
    '5' + function (){} // "5function (){}"
    '5' + undefined // "5undefined"
    '5' + null // "5null"
    
    3. 自动转换成数值：(除了+有可能把运算子转为字符串，其他运算符都会把运算子自动转成数值)
    	- null转为数值时，值为0 
    	- undefined转为数值时，值为NaN
    '5' - '2' // 3
    '5' * '2' // 10
    true - 1  // 0
    false - 1 // -1
    '1' - 1   // 0
    '5' * []    // 0
    false / '5' // 0
    'abc' - 1   // NaN
    null + 1 // 1
    undefined + 1 // NaN
    ```

##### 8. 生成[min , max]范围内的随机整数：

1. Math.floor(Math.random() * (max - min + 1)) + min

##### 9. JS创建对象的方式：

1. 字面量方式

2. 工厂模式：函数来封装创建对象的复用代码

    - 缺点：(没有建立对象和类型的关系)

3. 构造函数模式(new操作符的工作)：new Func()

    - 先创建一个新对象 a = {}

    - 将对象的原型指向构造函数 a.\__proto\__ = Func.prototype

    - 将该对象赋值给this，然后执行函数

    - 根据构造函数返回类型判断：无指定返回值或指定为原始值，则默认返回创建的对象，否则返回指定的对象

    - 

    - 缺点：

    - 每次都会新建一个函数对象，浪费内存空间

        ```js
        //模拟实现new操作符功能
        function objectFactory(Func, ...args) {
          let newobj = null,
              result = null;
          // 参数判断
          if (typeof Func !== "function") {
            console.error("type error");
            return;
          }
          // 1. 新建一个空对象，对象的原型为构造函数的 prototype 对象
          newobj = Object.create(Func.prototype);
          // 2. 将 this 指向新建对象，并执行函数
          result = Func.apply(newobj, args);
          // 3. 判断返回结果是自定义对象还是创建的对象
          return result instanceof Object ? result : newobj;
        }
        // 使用方法
        // objectFactory(构造函数, 初始化参数);
        ```

4. 原型模式：通过向prototype上添加属性和方法，实现代码复用
    - 解决了构造函数的缺点
    - 无法传参初始化
    - 所有实例共享一个对象，改变引用类型值会影响所有实例

5. 组合模式(构造函数+原型模式)：通过构造函数初始化对象的属性，通过原型对象实现方法的复用。
    - 代码的封装性不够好

6. 动态原型模式：将原型方法赋值的创建过程移动到了构造函数的内部，通过对属性是否存在的判断，实现第一次调用函数的时对原型对象赋值一次的效果
7. 寄生构造函数模式：和工厂函数原理相同，基于已有的类型，对实例化对象进行扩展

##### 10. JS实现继承的方式：

1.  **原型链**的方式：

    ```js
    Child.prototype = new Parent();
    ```

    - 包含引用类型数据时，会被所有实例共享，创建子类时无法向父类传参

2. **构造函数**方式：子类型中调用父类型的构造函数，

    ```javascript
    function Child(name,age){
        Parent.call(this)
    }
    ```

    - 解决了向父类传参问题
    - 无法实现函数方法的复用，**父类的方法子类型无法访问**

3. **组合式继承**：将原型链和构造函数结合，原型链继承方法，构造函数继承属性

    ```js
    function Child(name,age){
        Parent.call(this)
    }
    
    Child.prototype = new Parent();
    Child.prototype.constructor = Child;
    ```

    - 调用了两次父类的构造函数，造成子类原型汇总出现不必要的属性

4. **原型式继承**：基于已有的对象创建新的对象，向函数中传入一个对象，**以这个对象为原型返回新的对象**，借助**Object.create()**，**缺点与原型链方式一样**

    ```js
    const obj = {
    	// 属性和方法
    };
    const newobj = Object.create(obj);
    newobj可以使用父对象的属性和方法
    ```

5. **寄生式继承**：创建一个用于封装继承过程的函数，传入一个对象，复制这个对象，并进行扩展，最后返回该复制的对象（无法实现函数复用）

    ```js
    let parent5 = {
        name: "parent5",
        friends: ["p1", "p2", "p3"],
        getName: function() {
            return this.name;
        }
    };
    function clone(original) {
        let clone = Object.create(original);
        clone.getFriends = function() {
            return this.friends;
        };
        return clone;
    }
    let person5 = clone(parent5);
    console.log(person5.getName()); // parent5
    console.log(person5.getFriends()); // ["p1", "p2", "p3"]
    ```

6. **寄生组合式继承**：使用父类原型的副本作为子类的原型，避免创建不必要的属性

    ```js
    function Person(name) {
      this.name = name;
    }
    Person.prototype.sayName = function() {
      console.log("My name is " + this.name + ".");
    };
    
    function Student(name, grade) {
      Person.call(this); // 构造函数式
      this.grade = grade;
    }
    Student.prototype = Object.create(Person.prototype); // 原型链式
    Student.prototype.constructor = Student; // 修复constructor指向
    
    Student.prototype.sayMyGrade = function() {
      console.log("My grade is " + this.grade + ".");
    };
    ```

7. **ES6的继承**：

    - extends和super()：

    ```js
    class Person {
      constructor(name) {
        this.name = name
      }
      getName() {
        console.log('Person:', this.name)
      }
    }
    
    class Gamer extends Person {
      constructor(name, age) {
        // 子类中存在构造函数，则需要在使用“this”之前首先调用 super()。
        super(name)
        this.age = age
      }
    }
    const asuna = new Gamer('Asuna', 20)
    asuna.getName() // 成功访问到父类的方法
    ```

##### 11. JS的作用域链：

1. **作用域**：(变量和函数生效的区域)
    - 全局作用域：
        - 不在函数中或是大括号中声明的变量，都是在全局作用域下
    - 函数作用域(局部)：
        - 变量是在函数内部声明
        - 变量只能在函数内部访问，不能在函数以外去访问
    - 块级作用域：
        - 大括号中使用`let`和`const`声明的变量存在于块级作用域中
        - 大括号之外不能访问这些变量
2. 词法作用域(静态作用域)：
    - 变量被创建时就确定好了，而非执行阶段确定
    - JS遵循的是词法作用域
3. 作用域链：
    - 当使用变量时，首先在当前作用下寻找，若没有找到则向上层作用域寻找，以此类推最终到全局作用域，若还未找到则报错

- 作用域链是一个指向变量对象的指针列表，变量对象包含执行环境所有变量和函数

- 通过作用域链，可以访问到外层环境的变量和函数

- 当前环境的变量对象时作用域链中第一个对象，全局对象是最后一个对象

##### 12. this的理解：(执行时绑定调用它的对象)

1. 执行上下文的一个属性，**`this`永远指向的是最后调用它的对象**

2. **构造函数new绑定**：生成实例对象时，this指向该实例对象

    ```js
    1. new过程遇到return一个对象，此时this指向return的对象
    function fn()  {  
        this.user = 'xxx';  
        return {};  
    }
    var a = new fn();  
    console.log(a.user); //undefined
    
    2. 若return一个简单类型时，this指向实例对象(返回null也一样)
    function fn()  {  
        this.user = 'xxx';  
        return 1;
    }
    var a = new fn;  
    console.log(a.user); //xxx
    ```

3. **apply，call，bind**方式：显示指定调用函数的this指向(改变函数的调用对象)

4. **方法调用**：作为对象的方法调用时，this指向该对象(包含多对象时，只向上一层)

5. **函数调用**(默认绑定)：该函数非对象属性，直接作为函数调用，this指向全局对象(非严格模式)

    ```js
    apply(obj,[1,'string']);// (this指向, 参数数组)
    call(obj, 1,string); //(this指向, 参数1, 参数2,...)
    bind(obj,1,'string'); // 传入一个对象，返回一个this绑定了传入对象的新函数
    ```

6. **箭头函数**：(编译时绑定this的指向)，定义时的位置就确定了this，而不是执行时的位置

##### 13. JS中的事件模型：

1. **事件**：在html文档或浏览器中发生的交互操作，常见的加载事件，鼠标事件，自定义事件等

2. **事件流**：

    - **事件捕获阶段**(向下延伸)：与事件冒泡相反，事件由最高节点开始，一直到目标节点
    - **处于目标阶段**：
    - **事件冒泡阶段**(向上追溯)：由目标节点逐渐向上传播到DOM最高层的父节点

3. **事件模型**：

    - 原始事件模型(DOM0级)：

        - HTML中直接绑定
        - JS绑定

        ```js
        <input type="button" onclick="fun()">
        var btn = document.getElementById('.btn');
        btn.onclick = fun;
        
        // 特点：
        1. 绑定速度快
        2. 只支持冒泡，不支持捕获
        3. 同一类型事件只能绑定一次(后绑定的事件会覆盖之前的事件)
        4. 删除DOM0事件将其置为null
        btn.onclick = null;
        ```

    - 标准事件模型(DOM2级)：

        - 事件捕获阶段：事件从document向下传播到目标元素，依次检查经过的节点是否绑定事件，有则执行
        - 事件处理阶段：事件到达目标元素，触发目标元素的监听函数
        - 事件冒泡阶段：事件从目标元素向上冒泡到document，依次检查经过的节点是否有绑定事件，有则执行

        ```js
        1. 事件绑定监听函数方式：
        addEventListener(event, func, isCapture)
        event：监听的事件类型
        func：事件处理函数
        isCapture：布尔值，是否在捕获阶段处理，一般为false
        
        2. 事件移除监听函数方式：
        removeEventListener(event, func, isCapture)
        
        // 特点：
        1. 可在一个DOM元素上绑定多个事件处理器，不冲突
        2. 可以设置执行时机是捕获阶段还是冒泡阶段
        ```

    - IE事件模型(基本不用)：

        - 事件处理阶段：事件到达目标元素, 触发目标元素的监听函数
        - 事件冒泡阶段：事件从目标元素冒泡到`document`, 依次检查经过的节点是否绑定了事件监听函数，如果有则执行

        ```js
        1. 事件绑定监听函数方式：
        attachEvent(event, func);
        2. 事件移除监听函数方式：
        detachEvent(event, func);
        
        //事件类型需加on
        var btn = document.getElementById('.btn');
        btn.attachEvent(‘onclick’, showMessage);
        btn.detachEvent(‘onclick’, showMessage);
        ```

```js
const EventUtils = {
  // dom0||dom2||IE方式 来绑定事件(三种事件模型)
  // 添加事件
  addEvent: function(element, type, handler) {
    if (element.addEventListener) {
      element.addEventListener(type, handler, false);
    } else if (element.attachEvent) {
      element.attachEvent("on" + type, handler);
    } else {
      element["on" + type] = handler;
    }
  },

  // 移除事件
  removeEvent: function(element, type, handler) {
    if (element.removeEventListener) {
      element.removeEventListener(type, handler, false);
    } else if (element.detachEvent) {
      element.detachEvent("on" + type, handler);
    } else {
      element["on" + type] = null;
    }
  },

  // 获取事件目标
  getTarget: function(event) {
    return event.target || event.srcElement;
  },

  // 获取 event 对象的引用，取到事件的所有信息，确保随时能使用 event
  getEvent: function(event) {
    return event || window.event;
  },

  // 阻止事件（主要是事件冒泡，因为 IE 不支持事件捕获）
  stopPropagation: function(event) {
    if (event.stopPropagation) {
      event.stopPropagation();
    } else {
      event.cancelBubble = true;
    }
  },

  // 取消事件的默认行为
  preventDefault: function(event) {
    if (event.preventDefault) {
      event.preventDefault();
    } else {
      event.returnValue = false;
    }
  }
};
```

##### 14. 闭包：(内层函数中访问到外层函数的作用域)

1. 有权访问另一个函数作用域中变量的函数，创建方式为在一个函数内创建另一个函数

2. 用途：

    - 外部调用闭包函数，外部可以访问函数内部变量，**创建私有变量**
    - 运行结束的函数上下文的变量对象继续留在内存中，避免回收(**延长变量的生命周期**)

3. 柯里化函数：(避免频繁调用具有相同参数函数的同时，又可轻松复用)

    ```js
    // 假设我们有一个求长方形面积的函数
    function getArea(width, height) {
        return width * height
    }
    // 如果我们碰到的长方形的宽老是10
    const area1 = getArea(10, 20)
    const area2 = getArea(10, 30)
    const area3 = getArea(10, 40)
    // 我们可以使用闭包柯里化这个计算面积的函数
    function getArea(width) {
        return height => {
            return width * height
        }
    }
    const getTenWidthArea = getArea(10)
    // 之后碰到宽度为10的长方形就可以这样计算面积
    const area1 = getTenWidthArea(20)
    // 而且如果遇到宽度偶尔变化也可以轻松复用
    const getTwentyWidthArea = getArea(20)
    ```

4. 闭包模拟私有方法：

    ```js
    //单个counter
    const Counter = (function(){
       // 立即执行函数
    })()
    
    // 多个counter
    function makeCounter(){
        let privateCount = 0;
        function changeCount(val){
            privateCount += val;
        };
        function increment(){
            changeCount(1);
        };
        function decrement(){
            changeCount(-1);
        };
        function value(){
            return privateCount;
        };
        // 抛出
        return {
            increment,
            decrement,
            value
        }
    }
    
    const Counter1 = makeCounter();
    console.log(Counter1.value()); /* logs 0 */
    Counter1.increment();
    Counter1.increment();
    console.log(Counter1.value()); /* logs 2 */
    Counter1.decrement();
    console.log(Counter1.value()); /* logs 1 */
    ```

##### 15. 判断对象是否属于某个类：

1. instanceof判断构造函数的prototype是否出现在该对象的原型链中
2. 通过对象的constructor属性是否指向该对象的构造函数(不安全，constructor可改写)
3. 若判断某个内置的引用类型，可使用Object.prototype.toString()

##### 16. AJAX：异步通信，局部刷新

1. 创建XMLHttpRequest对象

2. 创建新的HTTP请求，指定请求的方法，URL等

3. 设置响应HTTP请求状态变化的函数

4. 发送HTTP请求

5. 获取异步调用返回的数据

6. 使用JS操作DOM刷新页面

    ```js
    // promise 封装xhr请求
    function asyncXHR(options){
        return new Promise((resolve,reject)=>{
            options = options || {};
            options.type = (options.type || 'GET').toUpperCase();
            options.dataType = options.dataType || 'json';
            // 1. 创建xhr对象
            let xhr = new XMLHttpRequest();
            // 2. 建立连接
            if(options.type === 'GET'){
                let temp = '';
                Object.keys(options.data).forEach(item=>{
                    temp += `${item}=${options.data[item]}&`
                });
                xhr.open('GET', `${options.url}?${temp}`, true);
            }else if(options.type === 'POST'){
                xhr.open('POST', options.url, true);
            }
    		
    		//3. 设置监听服务器端状态
    		xhr.onreadystatechange = function(){
                //readyState=4时,表示服务器返回数据接收完成
        		if(this.readyState === 4) {
                    if(this.status === 200){
            			resolve(this.responseText);
        			}else{
            			reject(new Error(this.responseText));
        			}
                }
    		};
    		//4. 请求失败时
    		xhr.onerror = function(){
        		reject(new Error(this.statusText));
    		};
    		//5. 设置请求头信息
    		xhr.responseType = 'json';
    		xhr.setRequestHeader('Accept', 'application/json');
    		//发送请求
    		if(options.type === 'GET'){
                xhr.send();
            }else if(options.type === 'POST'){
                xhr.send(options.data);
            }
    
        })
    }
    
    // 使用
    asyncXHR({
        type:'post',
        dataType:'json',
        data:{},
        url:''
    }).then(res=>{
        console.log(res);
    }).catch(err=>{
        console.log(err);
    })
    
    ```

##### 17. 浏览器的缓存机制：

1. 强缓存策略：
    - 设置http头信息的Expires 和Cache-Control属性
    - Cache-Control：max-age设置资源可缓存的时间；private规定资源只能客户端缓存，不能代理服务器缓存；no-store指定资源不能够缓存；no-cache代表资源可缓存，但立即失效，即每次都要重新请求

2. 协商缓存策略：
    - 先向服务器发送一个请求，资源没有修改，则返回304状态，使用本地资源的副本；若资源发生修改，则返回修改后的资源
    - 设置http头信息的Etag 和Last-Modified属性
    - 服务器在响应头中添加Last-Modified属性记录最后一次修改时间，浏览器请求时，在请求头中加If-Modified-Since,值为上一次返回的Last-Modified，然后服务端会进行比较(只能精确到秒级，会出现命中不准确)
    - 服务器在响应头中添加Etag属性，资源变化该值也会变化，浏览器请求时，在请求头中加If-None-Match,值为上一次返回的Etag，然后服务端会进行比较是否需要返回资源

##### 18. 解决跨域问题：

1. 实现主域名下的不同子域名跨域，可通过document.domain设置为主域名，此时cookie即可共享
2. 通过postMessage发送信息，在窗口中通过对message监听来接收消息
3. JSONP实现跨域，原理是通过动态构建script标签，在请求的url后指定一个回调函数，服务器返回数据的时候，构建一个json数据的包装，该包装就是回调函数，前端接收后会立即执行，先前定义好的回调函数就可被调用(只用于Get请求)
4. CORS：服务端配合，分为简单请求和非简单请求
    - 简单请求：请求头信息中增加Origin字段，说明请求来自哪个源，服务端决定是否返回数据，服务端在Access-Control-Allow-Origin中设置符合请求的白名单
    - 非简单请求：先发出一次预请求，来判断域名是否在服务端的白名单里，收到肯定回复后才发起请求

5. 使用websocket协议，该协议无同源限制
6. nginx代理：有跨域请求时发送给后端，让后端代为请求，然后把结果返回

##### 19.  JS中的模块规范：

1. CommonJS：通过require()来引入模块，通过module.exports定义输出接口，服务器端的解决方案，以同步方式引入，运行时加载模块

    - CommonJS模块输出的是值的拷贝，当模块内部发生变化将无法影响输出的值

2. AMD：异步加载模块，所有依赖这个模块的语句都定义在回调函数里，等加载完毕再执行回调函数(require.js实现了AMD规范)

    - reuqire.js原理是动态创建script脚本来异步引入模块，然后对脚本的load事件进行监听，每个脚本都加载完后，再执行回调函数

        ```js
        function require(path) {
          if (require.cache[path]) {
            return require.cache[path].exports
          }
          var src = fs.readFileSync(path)
          var code = new Function('exports, module', src)
          var module = {exports:{}}
          code(module.exports, module)
          require.cache[path] = module
          return module.exports
        }
        require.cache = Object.create(null)
        
        ```

3. CMD：异步加载模块，

4. ES6：使用import 和export 来导入导出模块，**编译时**就能确定模块的依赖关系，以及输入和输出的变量

    - JS引擎对脚本静态解析时，遇到import会生成一个只读引用，等脚本执行时，再根据只读引用去对应的模块中取值

        ```js
        export相关：
        	const A = '';
        	const B = '';
        	const func = function(){
        		
        	};
        	const func1 = function(){
        		
        	};
        // 导出模块
        export{A, B, func, func1 as Alias};
        
        import相关：
        import{A, B, func as otherName, Alias} from '';
        
        //加载整个模块时 需用*号
        import * as Alias from '';
        // Alias: {A, B, func,...}
        
        //如果不需要知道变量名或函数就完成加载，就要用到export default命令，为模块指定默认输出
        // export-default.js
        export default function () {
            console.log('foo');
        }
        //加载该模块的时候，import命令可以为该函数指定任意名字
        // import-default.js
        import customName from './export-default';
        customName(); // 'foo'
        ```

    - 允许动态加载模块，将import()作为函数调用将其作为参数传递给模块的路径。 它返回一个 `promise`，它用一个模块对象来实现，让你可以访问该对象的导出

        ```js
        import('/modules/myModule.mjs')
          .then((module) => {
            // Do something with the module.
          });
        ```

        

5. AMD与CMD的区别：

    - **模块定义时对依赖的处理不同**，AMD推崇依赖前置，定义模块时要声明其依赖的模块；CMD推崇就近依赖，用到的时候再去require()

    - **对依赖模块的执行时机不同**，AMD在依赖模块加载完成后执行依赖，执行顺序与书写的不一定一致；CMD在依赖模块加载完成后并不执行，等所有依赖模块都加载好，进入回调函数逻辑，遇到require()的时候才执行对应模块，这样执行顺序就与书写顺序一致

        ```js
        // CMD
        define(function(require, exports, module) {
          var a = require("./a");
          a.doSomething();
          // 此处略去 100 行
          var b = require("./b"); // 依赖可以就近书写
          b.doSomething();
          // ...
        });
        
        // AMD 默认推荐
        define(["./a", "./b"], function(a, b) {
          // 依赖必须一开始就写好
          a.doSomething();
          // 此处略去 100 行
          b.doSomething();
          // ...
        });
        ```

##### 20. 常见 DOM(文档对象模型)操作：

```js
Node.nodeName   //返回节点名称，只读
Node.nodeType   //返回节点类型的常数值，只读
Node.nodeValue  //返回Text或Comment节点的文本值，只读
Node.textContent  //返回当前节点和它的所有后代节点的文本内容，可读写
Node.baseURI    //返回当前网页的绝对路径

Node.ownerDocument  //返回当前节点所在的顶层文档对象，即document
Node.nextSibling  //返回紧跟在当前节点后面的第一个兄弟节点
Node.previousSibling  //返回当前节点前面的、距离最近的一个兄弟节点
Node.parentNode   //返回当前节点的父节点
Node.parentElement  //返回当前节点的父Element节点
Node.childNodes   //返回当前节点的所有子节点
Node.firstChild  //返回当前节点的第一个子节点
Node.lastChild   //返回当前节点的最后一个子节点

//parentNode接口
Node.children  //返回指定节点的所有Element子节点
Node.firstElementChild  //返回当前节点的第一个Element子节点
Node.lastElementChild   //返回当前节点的最后一个Element子节点
Node.childElementCount  //返回当前节点所有Element子节点的数目。


***Node.appendChild(node)   //把子节点添加到父节点的最后一个子节点
Node.hasChildNodes()   //返回布尔值，表示当前节点是否有子节点
Node.cloneNode(true);  // 默认为false(克隆节点), true(克隆节点及其属性，以及后代)
***parentNode.insertBefore(newNode,oldNode)  // 在指定子节点(oldNode)之前插入新的子节点(newNode)
***parentNode.removeChild(childNode)   //删除节点，在要删除节点的父节点上操作
Node.replaceChild(newChild,oldChild)  //替换节点
Node.contains(node)  //返回一个布尔值，表示参数节点是否为当前节点的后代节点。
Node.compareDocumentPosition(node)   //返回一个7个比特位的二进制值，表示参数节点和当前节点的关系
Node.isEqualNode(noe)  //返回布尔值，用于检查两个节点是否相等。所谓相等的节点，指的是两个节点的类型相同、属性相同、子节点相同。
Node.normalize()   //用于清理当前节点内部的所有Text节点。它会去除空的文本节点，并且将毗邻的文本节点合并成一个。

//ChildNode接口
Node.remove()  //用于删除当前节点
Node.before()  //
Node.after()
Node.replaceWith()


document.doctype   //
***document.documentElement  //返回当前文档的根节点html
document.defaultView   //返回document对象所在的window对象
***document.body   //返回当前文档的<body>节点
document.head   //返回当前文档的<head>节点
document.activeElement  //返回当前文档中获得焦点的那个元素。

//节点集合属性
document.links  //返回当前文档的所有a元素
document.forms  //返回页面中所有表单元素
document.images  //返回页面中所有图片元素
document.embeds  //返回网页中所有嵌入对象
document.scripts  //返回当前文档的所有脚本
document.styleSheets  //返回当前网页的所有样式表

//文档信息属性
document.documentURI  //表示当前文档的网址
document.URL  //返回当前文档的网址
document.domain  //返回当前文档的域名
document.lastModified  //返回当前文档最后修改的时间戳
document.location  //返回location对象，提供当前文档的URL信息
document.referrer  //返回当前文档的访问来源
document.title    //返回当前文档的标题
document.characterSet //属性返回渲染当前文档的字符集，比如UTF-8、ISO-8859-1。
document.readyState  //返回当前文档的状态
document.designMode  //控制当前文档是否可编辑，可读写
document.compatMode  //返回浏览器处理文档的模式
document.cookie   //用来操作Cookie


document.open()   //用于新建并打开一个文档
document.close()   //不安比open方法所新建的文档
document.write()   //用于向当前文档写入内容
document.writeIn()  //用于向当前文档写入内容，尾部添加换行符。

// 获取节点
document.querySelector(selectors)  //接受一个CSS选择器作为参数，返回第一个匹配的元素节点。
document.querySelectorAll(selectors) //接受一个CSS选择器作为参数，返回所有匹配的元素节点。
document.getElementsByTagName(tagName)  //返回所有指定HTML标签的元素
document.getElementsByClassName(className)   //返回包括了所有class名字符合指定条件的元素
document.getElementsByName(name)   //用于选择拥有name属性的HTML元素（比如<form>、<radio>、<img>、<frame>、<embed>和<object>等）
document.getElementById(id)   //返回匹配指定id属性的元素节点。
document.elementFromPoint(x,y)  //返回位于页面指定位置最上层的Element子节点。

// 创建节点
***document.createElement(tagName)   //用来创建HTML元素节点。
***document.createTextNode(text)   //用来创建文本节点
***document.createAttribute(name)  //创建属性节点，可以是自定义属性
***document.createDocumentFragment()  //创建文档碎片，表示轻量级文档，主要用来存储临时节点，然后一次性添加到DOM中


document.createEvent(type)   //生成一个事件对象，该对象能被element.dispatchEvent()方法使用
document.addEventListener(type,listener,capture)  //注册事件
document.removeEventListener(type,listener,capture)  //注销事件
document.dispatchEvent(event)  //触发事件
document.hasFocus()   //返回一个布尔值，表示当前文档之中是否有元素被激活或获得焦点。
document.adoptNode(externalNode)  //将某个节点，从其原来所在的文档移除，插入当前文档，并返回插入后的新节点。
document.importNode(externalNode, deep)   //从外部文档拷贝指定节点，插入当前文档。


Element.attributes  //返回当前元素节点的所有属性节点
Element.id  //返回指定元素的id属性，可读写
Element.tagName  //返回指定元素的大写标签名
Element.innerHTML   //返回该元素包含的HTML代码，可读可写
Element.outerHTML  //返回指定元素节点的所有HTML代码，包括它自身和包含的的所有子元素，可读写
Element.className  //返回当前元素的class属性，可读写
Element.classList  //返回当前元素节点的所有class集合
Element.dataset   //返回元素节点中所有的data-*属性。
Element.clientHeight   //返回元素节点可见部分的高度
Element.clientWidth   //返回元素节点可见部分的宽度
Element.clientLeft   //返回元素节点左边框的宽度
Element.clientTop   //返回元素节点顶部边框的宽度
Element.scrollHeight  //返回元素节点的总高度
Element.scrollWidth  //返回元素节点的总宽度
Element.scrollLeft   //返回元素节点的水平滚动条向右滚动的像素数值,通过设置这个属性可以改变元素的滚动位置
Element.scrollTop   //返回元素节点的垂直滚动向下滚动的像素数值
Element.offsetHeight   //返回元素的垂直高度(包含border,padding)
Element.offsetWidth    //返回元素的水平宽度(包含border,padding)
Element.offsetLeft    //返回当前元素左上角相对于Element.offsetParent节点的垂直偏移
Element.offsetTop   //返回水平位移
Element.style  //返回元素节点的行内样式
Element.children   //包括当前元素节点的所有子元素
Element.childElementCount   //返回当前元素节点包含的子HTML元素节点的个数
Element.firstElementChild  //返回当前节点的第一个Element子节点  
Element.lastElementChild   //返回当前节点的最后一个Element子节点  
Element.nextElementSibling  //返回当前元素节点的下一个兄弟HTML元素节点
Element.previousElementSibling  //返回当前元素节点的前一个兄弟HTML节点
Element.offsetParent   //返回当前元素节点的最靠近的、并且CSS的position属性不等于static的父元素。


getBoundingClientRect()  
// getBoundingClientRect返回一个对象，包含top,left,right,bottom,width,height // width、height 元素自身宽高
// top 元素上外边界距窗口最上面的距离
// right 元素右外边界距窗口最上面的距离
// bottom 元素下外边界距窗口最上面的距离
// left 元素左外边界距窗口最上面的距离
// width 元素自身宽(包含border,padding) 
// height 元素自身高(包含border,padding) 

getClientRects()   //返回当前元素在页面上形参的所有矩形。

// 元素在页面上的偏移量  
var rect = el.getBoundingClientRect()  
return {   
  top: rect.top + document.body.scrollTop,   
  left: rect.left + document.body.scrollLeft  
}

Element.getAttribute()：//读取指定属性  
Element.setAttribute(属性名, 属性值)：//指定元素中添加属性  
Element.hasAttribute()：//返回一个布尔值，表示当前元素节点是否有指定的属性  
Element.removeAttribute()：//移除指定属性

Element.querySelector()  
Element.querySelectorAll()  
Element.getElementsByTagName()  
Element.getElementsByClassName()

Element.addEventListener()：添加事件的回调函数  
Element.removeEventListener()：移除事件监听函数  
Element.dispatchEvent()：触发事件

//ie8
Element.attachEvent(oneventName,listener)
Element.detachEvent(oneventName,listener)

// event对象  
var event = window.event||event;    

// 事件的目标节点  
var target = event.target || event.srcElement;

// 事件代理  
ul.addEventListener('click', function(event) {   
  if (event.target.tagName.toLowerCase() === 'li') {   
    console.log(event.target.innerHTML)   
  }  
});

Element.scrollIntoView()   //滚动当前元素，进入浏览器的可见区域

//解析HTML字符串，然后将生成的节点插入DOM树的指定位置。
Element.insertAdjacentHTML(where, htmlString); 
Element.insertAdjacentHTML('beforeBegin', htmlString); // 在该元素前插入  
Element.insertAdjacentHTML('afterBegin', htmlString); // 在该元素第一个子元素前插入 
Element.insertAdjacentHTML('beforeEnd', htmlString); // 在该元素最后一个子元素后面插入 
Element.insertAdjacentHTML('afterEnd', htmlString); // 在该元素后插入

Element.remove()  //用于将当前元素节点从DOM中移除
Element.focus()   //用于将当前页面的焦点，转移到指定元素上
```

##### 21. innerHTML 与 outerHTML：

```
对于这样一个 HTML 元素：
<div id='test'><p>content<br/></p></div>。

innerHTML：内部 HTML，<p>content<br/></p>
outerHTML：外部 HTML，<div id='test'><p>content<br/></p></div>
innerText：内部文本，content
outerText：内部文本，content
```

##### 22. 类数组转为数组的方法：拥有length属性和若干索引属性的对象被称为类数组对象

1. call方法调用数组的slice / splice / 方法：
    - Array.prototype.slice.call(likeArr)
    - Array.prototype.splice.call(likeArr,0)

2. apply调用数组的concat方法：
    - Array.prototype.concat.apply([] , likeArr)

3. Array.form：
    - Array.form(likeArr)

##### 23. 常见数组的原生方法：

1. 数组和字符串的转换：
    - toString() / toLocalString() / join() / 

2. 尾部操作：pop() / push()
3. 首部操作：shift() / unshift()
4. 重排序：reserve() / sort()
5. 数组拼接：concat() 返回新数组
6. 数组截取：slice()  返回截取的部分
7. 数组插入：splice()
8. 数组填充：fill() // (value, start, end) 填充固定值value
9. 数组查找索引项：indexOf() / lastIndexOf() /
10. 数组迭代：every() / some() / filter() / map() / forEach() / 
11. 数组归并：reduce() / reduceRight() / 

##### 24. V8引擎的垃圾回收机制：

基于分代回收机制  将内存分为新生代和老生代

1. 新生代：分为From 和 To 两个空间，From满的时候会执行垃圾回收算法，此时应用逻辑停止，等垃圾回收结束后再执行
    - 先检查From空间的存活对象，判断是否满足晋升到老生代的条件，不满足则移动到To空间
    - 如果对象不存活，则释放对象的空间
    - 最后将From 和To 的空间角色进行交换

2. 新生代晋升到老生代需满足两个条件：
    - 判断对象是否经历一次垃圾回收，若经历过则晋升到老生代中，若没有，则到To空间
    - To空间占比是否超过限制，若To空间超过25%，则对象直接晋升到老生代中，老生代采用了标记清除法和标记压缩法，标记清除法先对存活的对象进行标记，标记结束后清除没有标记的对象，清除后会引起内存碎片，因而引入标记压缩法；
    - 老生代垃圾回收时间过长，引入增量标记，将一次停顿分为多步，应用逻辑和垃圾回收交替执行

##### 25. 哪些操作会造成内存泄漏：某些变量一直留在内存中无法回收

1. 意外的全局变量(window.xxx)
2. 被遗忘的计时器或回调函数(setInterval 定时器, 引用外部的变量)
3. 脱离DOM的引用
4. 闭包(不合理的使用闭包)
5. 对事件监听没有取消监听

##### 26. 判断浏览器的标识符：

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

##### 27. 节流与防抖：

1. 节流(**控制频率**)：规定时间内，多次触发事件**只执行一次回调函数**(scroll，mousemove等事件)

    ```js
    // 时间戳写法
    function throttle(fn, time = 500){
        let pre = Date.now();
        return function(...args){
            if(Date.now() - pre >= time){
                pre = Date.now();
                fn.apply(this, args);
            }
        }
    }
    
    // 定时器写法
    function throttle2(func, delay = 500){
        let timer = null;
        return function(...args){
            if(!timer){
               timer = setTimeout(()=>{
                	func.apply(this, args);
                   timer = null;
            	}, delay)
            }
        }
    }
    
    // 时间戳和定时器结合
    function throttle2(fn, delay = 500){
        let timer = null,
            start = Date.now();
        return function(...args){
            let curr = Date.now(),
               remain = delay - (curr - start);
            clearTimeout(timer);
            if(remain <= 0){
                fn.apply(this, args)
            }else{
                timer = setTimeout(fn, remain)
            }
        }
    }
    ```

2. 防抖(**减少次数**)：触发事件n秒后再执行回调，**n秒内多次触发则重新计时**(resize，点击请求的事件上，搜索框输入)

    ```js
    function debounce(fn, time = 500){
    	let timer = null;
        return function(...args){
            clearTimeout(timer);
            timer = setTimeout(()=>{
               fn.apply(this, args);
            },time)
        }
    }
    
    // 是否立即执行
    function debounce1(fn, delay = 500, immediate){
        let timer;
        return function(...args){
            if(timer) clearTimeout(timer);
        	if(immediate){
            	let temp = !timer;
            	timer = setTimeou(()=>{
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
    ```

##### 28. 事件循环：

1. 任务进入执行栈，同步任务进入主线程，异步任务进入任务队列，
2. 执行宏任务，遇到微任务就加到微任务队列
3. 当前宏任务执行完毕后，查看微任务的事件队列，执行所有的微任务，然后执行新的宏任务(这一套执行流程叫事件循环)

- 微任务：(主函数执行之后，当前宏任务结束之前)

    - promise.then

    - node中的process.nextTick

    - 监听DOM的MutationObserver

- 宏任务

    - 整体script代码

    - setTimeout / setInterval

    - postMessage

    - requestAnimationFrame

    - I/O操作 / setImmediate

    - UI渲染

- async / await ：

    - async 用来声明一个异步方法

    - await 用来等待异步方法执行

    - 不管await后面跟的什么，都会阻塞后面的代码(加入到微任务队列)，先执行async外面的同步代码，同步执行完，再回到async中，执行await阻塞的代码

- promise 和 async 的代码是当作同步任务立即执行的

```

		
执行栈：	---------任务队列{ 宏任务，微任务}
  |  |
  |--|
事件队列

```

##### 29. 深浅拷贝的实现：

1. 浅拷贝：(浅拷贝是拷贝一层，深层次的引用类型则共享内存地址)

    - 将一个对象的属性值复制到另一个对象，属性是基本类型，拷贝的就是基本类型的值；属性为引用类型，拷贝的就是内存地址
    - const newobj = Object.assign({}, oldobj, ...) 
    - const newobj = {...oldobj}  / [...oldarr]
    - const newobj = oldobj. slice(0) 
    - const newobj = oldobj. concat()

    ```js
    const shallowCopy = function(obj){
        if(typeof obj !=== 'object') return;
        const temp = obj instanceof Array ? []:{};
        for(let key in obj){
            if(obj.hasOwnProperty(key)){
                temp[key] = obj[key];
            }
        }
        return temp;
    }
    
    
    const shadowClone = function(obj){
        if(typeof obj !== 'object') return;
        const temp = obj instanceof Object ?{}:[];
        if(Array.isArray(obj)){
            obj.forEach(item=>{
                temp.push(item);
            })
        }
        if(obj instanceof Object){
            Object.keys(obj).forEach(item=>{
                if(obj.hasOwnProperty(item)){
                    temp[item] = obj[item];
                }
            })
        }
        return temp;
    }
    ```

2. 深拷贝：(两对象属性相同，但对应两个不同地址，互不影响)
    - 遇到引用类型时，会新建一个引用类型并将值复制给它
    - JSON.parse(JSON.stringfy(obj)) (遇到函数，正则，undefined，日期，Symbol则失效)

```js
const deepCopy = function(obj){
    if(typeof obj !=== 'object') return obj;
    const temp = Array.isArray(obj) ? []:{};
    for(let key in obj){
        if(obj.hasOwnProperty(key)){
            temp[key] = Array.isArray(obj[key]) || 							obj[key] instanceof Object  ? 						deepCopy(obj[key]) : obj[key];
        }
    }
    return temp;
}

const deepClone = function(obj){
    if(obj == null) return obj;
    if(typeof obj !== 'object') return obj;
    if(obj instanceof Function) return new Function(obj);
    if(obj instanceof Date) return new Date(obj);
    if(obj instanceof RegExp) return new RegExp(obj);
    let newobj = new obj.constructor();
    for(let key in obj){
        if(obj.hasOwnProperty(key)){
            newobj[key] = deepClone(obj[key]);
        }
    }
    return newobj;
}
```

##### 30. 手写apply call bind方法：(改变函数执行时的上下文，即this指向)

1. call(obj,  x, y, z, ...)：改变this指向后原函数立即执行，**临时改变this指向一次**

    ```js
    Fucntion.prototype.mycall = function(context){
        if(typeof this !== 'function'){
            throw new Error('调用类型错误!');
        }
        let args = [...arguments].slice(1),
            result = null;
        context = context || window;
        context.fn = this;
        result = context.fn(...args);
        delete context.fn;
        return result;
    }
    ```

2. apply(obj, [ x, y, z, ...])：改变this指向后原函数立即执行，**临时改变this指向一次**

    ```js
    Function.prototype.myapply = function(ctx){
        if(typeof this !== 'function'){
            throw new Error('调用类型错误!');
        }
        let result = null;
        ctx = ctx || window;
        ctx.fn = this;
        if(arguments[1]){
            result = ctx.fn([...arguments[1]])
        }else{
            result = ctx.fn();
        }
        
        delete ctx.fn;
        return result;
    }
    ```

3. bind(obj,  x, y, z, ...)：改变this指向后不会立即执行，返回一个**永久改变this指向**的函数

    ```js
    Function.prototype.mybind = function(ctx){
        if(typeof this !== 'function'){
            throw new Error('调用类型错误!');
        }
        let args = [...arguments].slice(1),
            fn = this;
        return function Fn(){
            return fn.apply(
            	this instanceof Fn ? new fn(...arguments) : ctx, args.concat(...arguments);
            )
        }
    }
    ```

4. 若没有给指向的对象，则默认指向全局window

##### 31. 函数柯里化的实现：

1. ```js
    function curry(fn, ...args){
        return fn.length <= args.length ? 				fn(...args) : curry.bind(null, fn, ...args)
    }
    ```

    

2. 

```js
// 函数柯里化指的是一种将使用多个参数的一个函数转换成一系列使用一个参数的函数的技术。
function curry(fn, args) {
  // 获取函数需要的参数长度
  let length = fn.length;
  args = args || [];
  return function() {
    let subArgs = args.slice(0);
    // 拼接得到现有的所有参数
    for (let i = 0; i < arguments.length; i++) {
      subArgs.push(arguments[i]);
    }
    // 判断参数的长度是否已经满足函数所需参数的长度
    if (subArgs.length >= length) {
      // 如果满足，执行函数
      return fn.apply(this, subArgs);
    } else {
      // 如果不满足，递归返回科里化的函数，等待参数的传入
      return curry.call(this, fn, subArgs);
    }
  };
}
```

##### 32. 异步编程的方式：

1. async 函数
2. Promise函数
3. 发布/订阅(观察者模式)
4. 回调函数
5. 事件监听
6. Generator函数

##### 33. 用setTimeout模拟setInterval：

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



##### 36. 手写一个Promise原理：

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

##### 37. 常用的Content-Type：

```html
application/x-www-form-urlencoded
浏览器的原生 form 表单，如果不设置 enctype 属性，那么最终就会以 application/x-www-form-urlencoded 方式提交数据。该种方式提交的数据放在 body 里面，数据按照 key1=val1&key2=val2 的方式进行编码，key 和 val 都进行了 URL
转码。

multipart/form-data
该种方式也是一个常见的 POST 提交方式，通常表单上传文件时使用该种方式。

application/json
告诉服务器消息主体是序列化后的 JSON 字符串。

text/xml
该种方式主要用来提交 XML 格式的数据。
```

##### 38. 解释一下事件代理(事件委托)：

1. **事件委托**：把一个或一组元素的事件委托的它的父层或更外层元素上，真正绑定事件的是外层元素，而不是目标元素(利用事件冒泡机制)，然后对目标元素进行匹配
2. 适合事件委托的情况：click`，`mousedown`，`mouseup`，`keydown`，`keyup`，`keypress
3. 优点：
    - 减少页面所需的缓存，提升整体性能
    - 动态绑定，减少重复工作
4. 缺点：
    - foucs， blur没有冒泡机制，无法进行事件委托
    - mousemove， mouseout对性能消耗高，不适用事件委托
    - 都用事件代理，可能会出现事件误判，不该触发的事件绑定了事件

##### 39. 手写一个JSONP：

```js
function jsonp(url, params, callback) {
  // 判断是否含有参数
  let queryString = url.indexOf("?") === "-1" ? "?" : "&";

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

##### 40. 手写一个观察者模式：

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

##### 41. 实现事件触发器(EventEmitter)：

```js
class EventEmitter {
  constructor() {
    this.events = {};
  }

  on(event, callback) {
    let callbacks = this.events[event] || [];
    callbacks.push(callback);
    this.events[event] = callbacks;

    return this;
  }

  off(event, callback) {
    let callbacks = this.events[event];
    this.events[event] = callbacks && callbacks.filter(fn => fn !== callback);

    return this;
  }

  emit(event, ...args) {
    let callbacks = this.events[event];
    callbacks.forEach(fn => {
      fn(...args);
    });

    return this;
  }

  once(event, callback) {
    let wrapFun = function(...args) {
      callback(...args);

      this.off(event, wrapFun);
    };
    this.on(event, wrapFun);

    return this;
  }
}
```

##### 42. 计算页面从加载到完成的时间：

```html
ECMAScript 5引入“高精度时间戳”这个 API，部署在 performance 对象上。它的精度可以达到1毫秒
的千分之一（1秒的百万分之一）。

navigationStart：当前浏览器窗口的前一个网页关闭，发生 unload 事件时的 Unix 毫秒时间戳。如果没有前一个网页，则等于 fetchStart 属性。

loadEventEnd：返回当前网页 load 事件的回调函数运行结束时的 Unix 毫秒时间戳。如果该事件还没有发生，返回 0。

var t = performance.timing;
var pageLoadTime = t.loadEventEnd - t.navigationStart;

```



##### 44. JS中数组常用的方法：

1. 增：

    - push()：尾部加入任意数量的值
    - unshfit()：头部加入任意数量的值
    - splice(start, num, add)：三参数，(开始位置，删除的数量，插入的元素)
    - concat()：相当于拼接，返回新数组

2. 删：

    - pop()：删除最后一项，返回删除的项
    - shift()：删除数组的第一项，返回删除的项
    - splice()：前两参数分别为删除起始位，删除的个数
    - slice(start, end)：返回原数组的子集(相当于剪切)，(起始位，结束位)

3. 查：

    - indexOf：返回元素在数组的索引，没有则返回-1
    - includes：返回元素在数组的索引，找到返回true，否则false
    - find(func)：返回第一个符合条件的元素

4. 排序：

    - reserve()：反向排列
    - sort(func)：接收一个比较函数，判断哪个值在前面

    ```js
    function compare(value1, value2) {
        if (value1 < value2) {
            return -1;
        } else if (value1 > value2) {
            return 1;
        } else {
            return 0;
        }
    }
    let values = [0, 10, 50, 20, 3];
    values.sort(compare); // [0, 3, 10, 20, 50]
    ```

5. 转换方法：

    - join(' , ')：

6. 迭代方法：**对每一项都执行传入的函数**

    - some()：有一项返回true，结果都返回true
    - every()：每一项都返回true，结果才为true，有一项为false，都为false
    - forEach()：无返回值
    - filter()：返回true的项会组成新数组返回
    - map()：返回函数执行后的结果构成的新数组

##### ES6. 数组中新增的内容：

1. **Array.from(likeArr, callback)**：将类数组和具有iterable的对象转为数组

    - ```js
        Array.from([1, 2, 3], (x) => x * x)
        // [1, 4, 9]
        ```

2. **Array.of()**：用于将一组值转为数组

    - ```js
        Array.of(3, 11, 8) // [3,11,8]
        ```

3. **copyWithin(target, start, end)**：用于选定成员并复制到其他位置

    - ```js
        [1, 2, 3, 4, 5].copyWithin(0, 3) // 将从 3 号位直到数组结束的成员（4 和 5），复制到从 0 号位开始的位置，结果覆盖了原来的 1 和 2
        // [4, 5, 3, 4, 5] 
        ```

4. **find(callback(value, index, arr), this) / findIndex(callback(value, index, arr), this)**：找出第一个符合条件的数组成员 / 数组成员的位置(无则返回-1)

    - 这两个方法都可以接受第二个参数，用来绑定回调函数的`this`对象

    - ```js
        [1, 5, 10, 15].find(function(value, index, arr) {
          return value > 9;
        }) // 10
        
        [1, 5, 10, 15].findIndex(function(value, index, arr) {
          return value > 9;
        }) // 2
        ```

5. **fill(data, start, end)**：用给定值填充数组，有起始位置和结束位置

    - 如果填充的类型为对象，则是浅拷贝

    - ```javascript
        ['a', 'b', 'c'].fill(7)
        // [7, 7, 7]
        ```

6. **keys() / values() / entries()**：对键名，键值，键值对的遍历

    - ```js
        for (let elem of ['a', 'b'].values()) {
          console.log(elem);
        }
        // 'a'
        // 'b'
        
        for (let [index, elem] of ['a', 'b'].entries()) {
          console.log(index, elem);
        }
        // 0 "a"
        ```

7. **includes()**：判断数组是否包含给定的值

    - ```js
        [1, 2, 3].includes(2)     // true
        [1, 2, 3].includes(4)     // false
        ```

8. **flat(num)**  ：数组扁平化处理，返回新数组，num为拉平的层数，不填默认一层

    **flatMap(map方法，this)**：可操作每个成员，相当于执行map方法，第二个参数，用来绑定遍历函数里面的`this`

    - ```js
        [1, 2, [3, 4]].flat()
        // [1, 2, 3, 4]
        
        // 相当于 [[2, 4], [3, 6], [4, 8]].flat()
        [2, 3, 4].flatMap((x) => [x, x * 2])
        // [2, 4, 3, 6, 4, 8]
        
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

##### 45. ES6对象中新增的内容：

1. 属性的简写：

    - 键名与值名相等可简写
    - 方法可省略function声明词(省略后的方法不可作构造函数)

2. 属性名表达式：

    - 字面量定义对象时，表达式放在括号内 

        ```js
        const a = {
          'first word': 'hello',
          [lastWord]: 'world'  // 表达式作键名
        };
        
        ```

    - 表达式还可定义方法名

    - 属性名表达式如果是一个对象，默认情况下会自动将对象转为字符串`[object Object]`

    - ```js
        let obj = {
          ['h' + 'ello']() {  // 定义方法名
            return 'hi';
          }
        };
        obj.hello() // hi
        
        const keyA = {a: 1};
        const keyB = {b: 2};
        const myObject = {
          [keyA]: 'valueA',
          [keyB]: 'valueB'
        };
        myObject // Object {[object Object]: "valueB"}
        ```

3. super关键词：指向当前对象的原型对象

    ```javascript
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
    ```

4. 属性的遍历：

    - for...in ：遍历**自身**和**继承**的可枚举属性(不含Symbol属性)
    - Object.keys(obj)：遍历自身的可枚举属性(不含继承)的键名，(不含Symbol属性)，返回数组
    - Object.getOwnPropertyNames(obj)：遍历自身的所有属性，包括不可枚举属性的键名，(不含Symbol属性)，返回数组
    - Object.getOwnPropertySymbol(obj)：遍历自身所有Symbol属性的键名，返回数组
    - Reflect.ownKeys(obj)：遍历对象自身(不含继承)的所有键名，不管是Symbol或字符串，或是否可枚举

    - 

    - 上述遍历，都遵守同样的属性遍历的次序规则：

        - 首先遍历所有数值键，按照数值升序排列
        - 其次遍历所有字符串键，按照加入时间升序排列
        - 最后遍历所有 Symbol 键，按照加入时间升序排

    - ```js
        Reflect.ownKeys({ [Symbol()]:0, b:0, 10:0, 2:0, a:0 })
        // ['2', '10', 'b', 'a', Symbol()]
        ```

5. 对象新增的方法：

    - **Object.is()**：严格判断两值是否相等，与===基本一致，不同之处：+0不等于-0，NaN等于自身

        ```js
        +0 === -0 //true
        NaN === NaN // false
        
        Object.is(+0, -0) // false
        Object.is(NaN, NaN) // true
        ```

    - **Object.assign(target, source1, source2, ...)**：对象的合并，将源对象source所有可枚举属性复制到目标对象(target为目标对象，source可有多个)（浅拷贝）

    - **Object.getOwnPropertyDescriptors(obj)**：获取指定对象所有自身属性(非继承属性)的描述对象

        ```js
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
        //      configurable: true } 
        // }
        ```

        

    - **Object.setPrototypeOf(obj, prototype)**：设置一个对象的原型

    - **Object.getPrototypeOf(obj)**：获取一个对象的原型

    - **Object.keys(obj) / Object.values(obj) / Object.entries(obj)**：对键名，键值，键值对的遍历（不含继承，所有可枚举属性）

    - **Object.fromEntries()**：将一个键值对数组转为对象

        ```js
        Object.fromEntries([
          ['foo', 'bar'],
          ['baz', 42]
        ])
        // { foo: "bar", baz: 42 }
        ```

##### 46. ES6函数中新增哪些内容：

1. 为参数设置默认值：

    - 参数默认值可以与解构赋值的默认值结合起来使用
    - 函数的形参是默认声明的，不能使用`let`或`const`再次声明
    - 参数默认值应该是函数的尾参数，如果不是非尾部的参数设置默认值，实际上这个参数是没发省略的

    ```js
    function log(x, y = 'World') {
      console.log(x, y);
    }
    
    function foo({x, y = 5} = {}){//设置默认值避免无参
      console.log(x, y);
    }
    ```

2. 属性：

    - length属性：返回没有指定默认值的参数个数，rest参数不计入length，设置默认参数不是尾参数，length也不计入后面的参数

        ```js
        (function (a) {}).length // 1
        (function (a = 5) {}).length // 0
        (function(...args) {}).length // 0
        (function (a = 0, b, c) {}).length // 0
        (function (a, b = 1, c) {}).length // 1
        ```

        

    - name属性：返回函数的函数名

        

3. 作用域：
    - 参数设置默认值，函数在声明初始化时，会形成单独的作用域，初始化结束，这个作用域消失

4. 箭头函数：
    - 函数体内的this对象，是**定义时**所在的对象，而不是使用时所在的对象
    - 不可当构造函数，不可使new命令，无原型无constructor
    - 不可使用arguments，可用...rest参数代替
    - 不可使用yield命令，因此不能用作Generator函数

##### 47. ES6中的Set 和 Map：

1. Set：**集合**的数据结构，无序的，相关联的，且不重复的元素组成的集合[键，键]

    - 类似于数组，成员值都唯一

        ```js
        const s = new Set()
        Set的增删改查：
        s.add(xx); // 已存在的值不会添加
        s.delelte(xx); //返回布尔值，表示是否删除成功
        s.has(xx); // 判断某值是否为Set的成员
        s.clear(); // 清除所有成员
        ```

    - 遍历方法：

        ```js
        keys(); // 返回键名的遍历器
        values(); // 返回键值的遍历器
        entries(); //返回所有键值对的遍历器
        
        for (let item of set.entries()) {
          console.log(item);
        }
        // ["red", "red"]
        // ["green", "green"]
        // ["blue", "blue"]
        
        forEach(); // 使用回调函数遍历每个成员,第二个参数绑定this
        let set = new Set([1, 4, 9]);
        set.forEach((value, key) => console.log(key + ' : ' + value))
        // 1 : 1
        // 4 : 4
        // 9 : 9
        ```

    - 快速实现数组或字符串去重

    - 实现并集，交集，差集

2. Map：**字典**的数据结构，元素的集合 [键，值]，键和值可以是任意类型

    - 键值对的有序列表

        ```js
        const m = new Map();
        Map的增删改查：
        m.size; // 返回Map的成员个数
        m.set(key, value); // 新增键名和键值
        m.get(key);//读取key对应的值,无返回undefined
        m.has(key); // 查询某个键是否在Map中，返回布尔值
        m.delete(key); // 删除某个键，返回布尔值
        m.clear(); // 清除所有成员
        ```

    - 遍历方法：

        ```js
        keys(); // 返回键名的遍历器
        values(); // 返回键值的遍历器
        entries(); //返回所有键值对的遍历器
        forEach(); // 遍历Map的所有成员
        
        for (let [key, value] of map.entries()
        {
          console.log(key, value);
        }
        // "F" "no"
        // "T" "yes"
        
        // 等同于使用map.entries()
        for (let [key, value] of map) {
          console.log(key, value);
        }
        // "F" "no"
        // "T" "yes"
        
        map.forEach(function(value, key, map) {
          console.log("Key: %s, Value: %s", key, value);
        });
        ```

3. Set和Map存储不重复的值

4. WeakSet：接受一个具有 `Iterable`接口的对象作为参数

    - 没有遍历操作的`API`
    - 没有`size`属性
    - 成员只能是引用类型，而不能是其他类型的值

5. WeakMap：也是用于生成键值对的集合
    - 没有遍历操作的`API`
    - 没有`clear`清空方法
    - 只接受对象作为键名（不包括`null`），不接受其他类型的值作为键名
    - 弱引用的只是键名，而不是键值。键值依然是正常引用

##### 48. ES6中的Promise：异步编程的一种解决方案

1. promise只有三种状态：状态不受外界影响，只有异步操作的结果可以决定状态，状态一旦变化便不再改变且只有pending-->fuifilled | pending-->rejected
    - pending：进行中
    - fulfilled：已成功
    - rejected：已失败

2. reslove将状态由''未完成''变为''成功''，reject将由''未完成''变为''失败''

    - 实例有then()方法

    ```js
    const promise = new Promise((resolve, reject)=>{
    	// 
    })
    
    getJSON("/posts.json").then(function(json) {
      return json.post;
    }).then(function(post) {
      // ...链式书写
    });
    
    ```

    -  catch()：`catch()`方法是`.then(null, rejection)`或`.then(undefined, rejection)`的别名，用于指定发生错误时的回调函数；

        ```js
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
        ```

    -  finally()：用于指定不管 Promise 对象最后状态如何，都会执行的操作

        ```js
        promise
        .then(result => {···})
        .catch(error => {···})
        .finally(() => {···});
        ```

        

3. Promise构造函数方法：

    - all()：

        ```html
        1. 用于将多个 `Promise`实例，包装成一个新的 `Promise`实例
        2. 接受一个数组（迭代对象）作为参数，数组成员都应为`Promise`实例
        3. 如果作为参数的 Promise 实例，自己定义了catch方法，那么它一旦被rejected，并不会触发Promise.all()的catch方法
        ```

    - race()：

        ```
        1. 同样是将多个 Promise 实例，包装成一个新的 Promise 实例
        2. 有一个实例率先改变状态，p的状态就跟着改变
        ```

    - allSettled()：

        ```
        1. 接受一组 Promise 实例作为参数，包装成一个新的 Promise 实例
        2. 只有等到所有这些参数实例都返回结果，不管是fulfilled还是rejected，包装实例才会结束
        ```

    - reslove()：

        ```
        1. 将现有对象转为 Promise对象
        2. 参数是一个 Promise 实例，promise.resolve将不做任何修改、原封不动地返回这个实例
        3. 参数是一个thenable对象，promise.resolve会将这个对象转为 Promise对象，然后就立即执行thenable对象的then()方法
        4. 参数不是具有then()方法的对象，或根本就不是对象，Promise.resolve()会返回一个新的 Promise 对象，状态为resolved
        5. 没有参数时，直接返回一个resolved状态的 Promise 对象
        ```

    - reject()：

        ```
        1. 返回一个新的 Promise 实例，该实例的状态为rejected
        2. reject()方法的参数，会原封不动地变成后续方法的参数
        ```

        

##### 49. ES6的Generator：

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
        7. 通过调用next方法可以带一个参数，该参数就会被当作上一个yield表达式的返回值
        
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
        
        正因为Generator函数返回Iterator对象，因此我们还可以通过for...of进行遍历
        
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

##### 50. ES6中Decorator(装饰器)

1.  一个普通的函数，用于扩展类属性和类方法

    - 类的装饰：

        ```js
        //想要传递参数，可在装饰器外层再封装一层函数
        
        function testable(isTestable) {
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

    - 类属性的装饰：

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

    - 装饰器不能用于修饰函数，因为函数存在变量声明情况

##### 51. ES6中的Proxy：定义基本操作的自定义行为(元编程)

1.  Proxy构造函数：

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

    ```
    1.将 Object 对象的一些明显属于语言内部的方法（比如 Object.defineProperty，放到 Reflect 对象上。
    
    2.修改某些 Object 方法的返回结果，让其变得更合理。
    
    3.让 Object 操作都变成函数行为。
    
    4.Reflect 对象的方法与 Proxy 对象的方法一一对应，只要是 Proxy 对象的方法，就能在 Reflect 对象上找到对应的方法。这就让 Proxy 对象可以方便地调用对应的 Reflect 方法，完成默认行为，作为修改行为的基础。也就是说，不管 Proxy 怎么修改默认行为，你总可以在 Reflect 上获取默认行为
    ```

3. Proxy的几种用法：

    - get()：get接受三个参数，依次为目标对象、属性名和 proxy 实例本身，最后一个参数可选

    - (如果一个属性不可配置（configurable）且不可写（writable），则 Proxy 不能修改该属性，否则会报错)

        ```
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

    - **实现观察者模式**：函数自动观察数据对象，一旦对象有变化，函数就会自动执行`observable`函数返回一个原始对象的 `Proxy` 代理，拦截赋值操作，触发充当观察者的各个函数

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

##### 52.  JS中字符串的常用方法：字符串一旦创建，就不可变(都是新建副本，在副本上操作再返回新的)

1. 增：
    - concat()：用于拼接新字符串
2. 删：(剪切)
    - slice(start, end)：包括前索引值，不包后
    - substring(start, end)：包括前索引值，不包后
    - substr(start, length)：包前包后(length为长度)
3. 改：
    - trim() / trimLeft() / trimRight()：删除前后空格
    - repeat(num)：要将字符串复制多少次，然后返回拼接所有副本后的结果
    - padStart(length, ' string') / padEnd()：复制字符串，如果小于指定长度，则在相应一边填充字符，直至满足长度条件
    - toLowerCase() / toUpperCase()：大小写转换
4. 查：
    - chaeAt(num)：返回给定索引位置的字符
    - indexOf('string')：从字符串开头去搜索传入的字符串，并返回位置（如果没找到，则返回 -1 ）
    - startWith() / includes() ：从字符串中搜索传入的字符串，并返回一个表示是否包含的布尔值
5. 转换方法：
    - split()：把字符串按照指定的分割符，拆分成数组中的每一项
6. 模板匹配(正则)：
    - match()：参数，可以是一个正则表达式字符串，也可以是一个`RegExp`对象，返回数组(string.match(reg))
    - search()：接收一个参数，可以是一个正则表达式字符串，也可以是一个`RegExp`对象，找到则返回匹配索引，否则返回 -1，(string.search(reg))
    - replace()：接收两个参数，第一个参数为匹配的内容，第二个参数为替换的元素（可用函数）(string,replace('a', 'b'))

##### 53.  == 和 === ：

1. == ：(先进行类型转换，再判断值是否相等)
    - 都为简单类型：字符串 / 布尔值 ==> 先转数值，再比较
    - 简单和引用类型比较：引用类型转为原始类型，再比较
    - null 和undefined相等
    - 存在NaN返回false
2. ===：(类型相同，值也相同)
    - null === null  // true
    - undefined === undefined  // true
    - null === undefined  // false
3. 除了在比较对象属性为`null`或者`undefined`的情况下，我们可以使用相等操作符（==），其他情况建议一律使用全等操作符（===）

##### 54. JS中执行上下文和执行栈：

1. 执行上下文：(JS代码执行环境)

    - **全局执行上下文**：只有一个，window全局对象
    - **函数执行上下文**：无数个，**函数调用时创建**，每次调用都会创建新的执行上下文，会创建一个私有作用域，函数内部声明的任何变量都不能在当前函数作用域外部直接访问
    - **eval函数执行上下文**：运行在eval函数中的代码

2. 生命周期：

    - **创建阶段**：

        - 绑定this
        - 词法环境被创建(存储函数声明和变量let/const绑定)
        - 变量环境被创建(存储变量var绑定)
        - let 和 const定义的变量在创建阶段没有赋值(保持uninitialized未初始化状态)，但var声明的变量被赋值为undefined(**变量提升的原因**)

        ```js
        ExecutionContext = {  
          ThisBinding = <this value>,     // 确定this 
          LexicalEnvironment = { ... },   // 词法环境
          VariableEnvironment = { ... },  // 变量环境
        }
        
        FunctionExectionContext = { // 函数执行上下文
          LexicalEnvironment: {     // 词法环境
            EnvironmentRecord: {    // 环境记录
              Type: "Declarative",      // 函数环境
              // 标识符绑定在这里      // 对外部环境的引用
              outer: <Global or outer function environment reference>  
          }  
        }
            
        GlobalExectionContext = {
        
          ThisBinding: <Global Object>,
        
          LexicalEnvironment: {  // 词法环境
            EnvironmentRecord: {  
              Type: "Object",  
              // 标识符绑定在这里  
              a: < uninitialized >,  
              b: < uninitialized >,  
              multiply: < func >  
            }  
            outer: <null>  
          },
        
          VariableEnvironment: {  // 变量环境
            EnvironmentRecord: {  
              Type: "Object",  
              // 标识符绑定在这里  
              c: undefined,  
            }  
            outer: <null>  
          }  
        }
        
        FunctionExectionContext = {  
           
          ThisBinding: <Global Object>,
        
          LexicalEnvironment: {  
            EnvironmentRecord: {  
              Type: "Declarative",  
              // 标识符绑定在这里  
              Arguments: {0: 20, 1: 30, length: 2},  
            },  
            outer: <GlobalLexicalEnvironment>  
          },
        
          VariableEnvironment: {  
            EnvironmentRecord: {  
              Type: "Declarative",  
              // 标识符绑定在这里  
              g: undefined  
            },  
            outer: <GlobalLexicalEnvironment>  
          }  
        }
        ```

    - **执行阶段**：执行变量赋值，代码执行

    - **回收阶段**：执行上下文出栈等待虚拟机回收执行上下文

3. 执行栈：(后进先出) 用于存储在代码执行期间创建的所有执行上下文

    - 创建全局执行上下文压入执行栈
    - 按顺序将函数执行上下文压入执行栈
    - 函数执行，对应的执行上下文出栈，继续执行下面的函数
    - 所有的函数执行上下文执行完毕，然后执行全局上下文
    - 全局上下文出栈，结束

##### 55.  typeof 与 instanceof：

1. typeof：返回一个基本类型字符串，表示未经计算的操作数的类型

    - 除了null 和 引用类型(除Function) 都可准确识别
    - 判断变量是否存在，可用typeof

    ```js
    typeof 1 // 'number'     
    typeof '1' // 'string'
    typeof undefined // 'undefined'
    typeof true // 'boolean'
    typeof Symbol() // 'symbol'
    typeof console.log // 'function'
    
    typeof null // 'object'
    typeof [] // 'object'
    typeof {} // 'object'
    typeof console // 'object'
    
    if(typeof a != 'undefined'){
        //变量存在
    }
    ```

2.  instanceof：检测某个构造函数的prototype是否在某个实例对象的原型链上(返回布尔值)

    - instanceof可以准确判断复杂引用类型，但不能正确判断基本数据类型

    - 实现原理：

        ```js
        const myInstanceof = function(left, right){
        	if(typeof left !== 'object' || typeof left === null) return false;
            let proto = Object.getPrototypeOf(left);
            while(true){
                if(proto === null) return false;
                if(proto == right.prototype) return true;
                proto = Object.getprototypeOf(proto);
            }
        }
        ```

3. 通用检测数据类型方法：

    - Object.prototype.toString.call()：统一返回 "[object Xxxx]" 格式的字符串

    ```js
    const isType = function(value){
        // 判断数据是 null 的情况
      if (value === null) return value;
      
        // 判断数据时基本类型
      if (typeof value !== "object") {
          return typeof value;
        
      } 
        // 判断数据是引用类型
       let valueClass = Object.prototype.toString.call(value),
          	type = valueClass.split(" ")[1].split("");
        	type.pop();
        	return type.join("").toLowerCase();
        // (或者 ：return Object.prototype.toString.call(obj).replace(/^\[object (\S+)\]$/, '$1'); )
    }
    ```

##### 56. 常见的BOM(浏览器对象模型)对象：

1. BOM的核心对象是window，表示浏览器的一个实例
2. 窗口控制方法：
    - moveBy(x, y)：从当前位置水平移动x个像素，垂直向下移动y个像素，若x，y为负，则向左，向上移动
    - moveTo(x, y)：移动窗体左上角到相对屏幕左上角的(x, y)点
    - resizeBy(w, h) ：相对窗体当前的大小，若w，h为正，则宽度增加w，高度增加h；若w，h为负，则缩小
    - resizeTo(w, h)：把窗体调整成宽为w，高为h
    - scrollTo(x, y)：有滚动条时，将横向滚动条移动到相对于窗体宽度为x个像素的位置，将纵向移动到相对于窗体高度为y个像素的位置
    - scrollBy(x, y)：有滚动条时，横向滚动条向左移动x个像素，纵向滚动条移动y个像素
3. **location**：
    - hash：URL中#后面的字符
    - host：域名+端口号
    - hostname：域名(不带端口)
    - href：完整url
    - pathname：服务器下面的文件路径
    - port：端口号
    - protocol：协议
    - search：?后面的内容
    - location.reload()：刷新页面，若页面没有改变过，则会从浏览器缓存中加载，若强制重新请求，则传参true
4. navigator：获取浏览器的属性，区分浏览器类型
5. history：操作浏览器url的历史记录
    - history.go()：接收数字或字符串，正数前进的页面，负数为后退的页面；字符串为某个网址
    - history.forward()：向前跳转一个页面
    - history.back()：向后跳转一个页面
    - history.length：获取历史记录数

##### 57. 对尾递归的理解：

```js
// 其他格式化例子
function format(obj){
    if(!obj instanceof Object)return;
    const temp= {};
    Object.keys(obj).forEach(it=>{
           let props =  it.toLowerCase();
            temp[props] = obj[it] instanceof Object ? format(obj[it]) : obj[it];

    });
    return temp;
}

function format(obj){
    const temp = {};
    for(let key in obj){
        if(obj.hasOwnProperty(key)){
            let props = key.toLowerCase();
            temp[props] = obj[key] instanceof Object ? format(obj[key]) : obj[key];
        }
    }
    return temp;
}
```

##### 58. JS本地存储的方式及区别：

1. cookie(小型文本文件)：辨别用户身份而存储在用户本地终端上的数据

    - Expires：设置Cookie的过期时间
    - Max-Age：设置Cookie失效前要经过的秒数(优先级比Expires高)
    - Dmain：指定了Cookie可以送达的主机名
    - Path：指定一个URL路径，该路径出现在请求的资源路径中才可以发送Cookie首部
    - Secure：设置后Cookie只能被HTTPS协议加密过的请求发送给服务端
    - 数据大小不能超过4k

    ```
    doucment.cookie = 'key=value; key=value; key=value'
    ```

2. localStorage：持久化的本地存储，

    - 不主动删除会一直存在
    - 同域中共享存储数据，受同源策略的限制
    - 储存容量较大(5M)
    - 无法设置过期时间，只能存字符串

    ```
    localStorage.setItem('key', value); // 新增
    localStorage.getItem('key'); // 获取
    localStorage.removeItem('key'); // 移除
    locaStorage.clear; // 移除所有
    ```

3. sessionStorage：

    - 与localStorage用法基本一致
    - 页面关闭，数据删除

##### 59. 

```

```

