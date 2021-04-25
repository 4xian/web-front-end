# Typescript相关总结：

### 1.  数据类型：

```typescript
1. 布尔值：
	let isBol: boolean = false;
	let isBol: boolean = Boolean(1);
2. 数值：
	let num: number = 9;
	let num: number = NaN;
	let num: number = Infinity;
3. 字符串：
	let str: string = 'str'
    
4. null 和 undefined：
	let isnull: null = null;
	let isundefined: undefined = undefined;
// null 和 undefined 不可赋给number类型

5. void(空值)：
	用void表示没有任何返回值的函数：
    function func(): void{
        // ...
    }

6. any(任意值)：
	// 普通类型赋值过程中是不允许改变类型的
	// any类型则允许赋值为任意类型
	let reandom: any = 'test';
		readom = 9;
		readom = {};
	// 任意值也可以访问任意属性和方法
	readom.func();
	readom.xxx;

7. 声明未赋值变量时，未声明类型将被认为任意值类型
	let some;
	// 等价于 let some: any;

8. 类型推断：
	声明并赋值时，未声明类型ts将自动推测出一个类型
    let test = 'str'; // ts自动推断为 let test: string = 'str'
	let num = 9; // ts自动推断为 let num: number = 9
	
9. 联合类型：
	表示定义时类型可选多个：| 隔开
	let test: string | number // test可存 string类型或 number类型
    - 联合类型赋值时，会根据类型推断推断出一个类型
    - 当不确定联合类型的变量到底是哪一个类型时，只能访问所有类型的共有属性和方		法
    - 已知联合类型的类型时，访问联合类型的属性和方法，只能访问当前类型的属性和		方法
```

### 2. 对象的类型(接口)：

```typescript
interface Person{
    readonly id: number;
    name: string;
    age: number;
    height?: number;
    [readomProp: string]: any
}

const tom: Person{
    id: 999,
    name:'xxx',
    age:23,
    readomProp: 'xxxx'
}
1. 必有属性：
	定义了一个变量tom，类型为Person，tom里的属性和方法必须与接口Person的一样
2. 可选属性：
	可使用可选属性?约束该属性可有可无
3. 任意属性：
    - 定义任意属性后，确定属性和可选属性的类型必须为任意属性类型的子集
    - 一个接口只能有一个任意类型，如果接口中有多个类型的属性，则可以在任意属性		中使用联合类型
4. 只读属性：
    - 首次便要赋值
    - 只读，后续不可更改
    readonly xxx: [type]
```

### 3.  数组的类型：

```typescript
1. 基础定义：
	`[类型] []`
	let numArr : number[] = [1,2,3];
	let anyArr : any[] = ['xx', 13, {}]; // 数组中可出现任意类型
	- 定义一个类型后，数组中只能存在该类型
	- 使用数组的方法时，也会受类型的限制，比如push只能推该类型的值

2. 数组泛型：Array<type>
    let numArr: Array<number> = [1, 2, 3]

3. 接口表示数组：(常用于表示类数组)
	interface NumArr{
        [index number]: number;
    }
	let tempArr: NumArr = [1, 2, 3];

	// 类数组
	// 内置对象
     interface IArguments:{
            [index: number]: any;
            length: number;
            callee: Function;
     }
     function sum(){
        let args: IArguments = arguments;
     }
```

### 4. 函数的类型：

```typescript
1. 函数声明的类型定义：
	- 对入参和返回都有限制
	- 参数长度必须一致，不可多不可少
	function sum(x: number, y: number): number{
        return x + y;
    }

2. 函数表达式的类型定义：
	- => 左边为输入类型约束，右边为输出类型
	let myFunc: (x: number, y: number) => number = function (x: number, y: number): number {
        return x + y;
    }
    
3. 接口定义函数的类型：
	interface FuncType {
        (args1: string, args2: string): boolean;
    }
    let myFunc: FuncType;
	myFunc = function(args1: string, args2: string){
        return xxxx // 返回布尔类型
    }

4. 可选参数：
	- 用?表示可选参数
	- 可选参数必须放在最后(必选, 必选, ..., 可选)
	function sum(x: number, y?: number): number{
        if(y){
            return x + y;
        }
        return x ;
    };
	let add = sum(1,10);
	let add = sum(5);

5. 参数默认值：
	- ts会将添加默认值的参数识别为可选参数，并且不受可选参数放在最后限制
	function buildName(firstName: string = 'Cat', lastName: string) {
    	return firstName + ' ' + lastName;
	}
	let tomcat = buildName('Tom', 'Cat');
	let tom = buildName(undefined, 'Tom');

6. 剩余参数(rest)：
	- rest参数只能是最后一个参数
	function push(array: any[], ...items: any[]){
        items.forEach(item=>{
            array.push(item);
        })
    }
	let a = [];
	push(a, 1,2,3);

7. 重载：
	- 重载允许一个函数接收不同数量或类型的参数时，作出不同的处理
	- 精确的表达==>输入为数字，输出也为数字;输入为字符串，输出也为字符串
	
	function reserve(x: number): number;
	function reserve(x: string): string;
	function reserve(x: number | string):number | string {
        if(typeof x === 'string') {
            return Number(x.toString().split('').reserve().join(''));
        }else if (typeof x === 'string'){
            return x.split('').reverse().join('');
        }
    }
	- 重复定义函数reserve,前几次是函数定义, 最后一次是函数实现
```

### 5. 类型断言：(手动指定一个值的类型)

- 类型断言的各种情况：

```typescript
1. 格式：值 as 类型 | <类型> 值
	- tsx 中只能使用前者
  
2. 用途：
	- 1. 将一个联合类型断言为其中一个类型：
		// 尽量避免断言后调用方法或引用深层属性
	interface Cat {
    name: string;
    run(): void;
  }
interface Fish{
  name: string;
  swim(): void;
}
function isFish(animal: Cat | Fish){
  // 将animal指定为Fish类型
  if(typeof(animal as Fish).swim === 'function'){
    return true;
  }
  return false;
}

- 2. 将一个父类断言为更加具体的子类：
		interface(或class) ApiError extends Error{
      code: number;
    }
		interface(或class) HttpError extends Error{
      statusCode: number;
    }
		function isApiError(error: Error){
      // 断言为具体的子类
      if(typeof (error as ApiError).code === 'number'){
        return true;
      }
      return false;
    }
- 3. 将任何一个类型断言为any：
		如window.foo = 1; ts 会报错，可将它断言为(window as any).foo = 1;

- 4. 将any断言为一个更具体的类型：
		function getCache(key: string): any{
      return (window as any).cache[key];
    }
		interface Cat{
      name: string;
      run(): void
    }
    const tom = getCache('tom') as Cat;
		tom.run();
		// 调用完getCache后，将返回的值断言为Cat类型，这样明确了tom的类型

```

- 类型断言的限制：

```typescript
1. A兼容B，则A可被断言为B，B也可被断言为A；
	 B兼容A，则B可被断言为A，A也可被断言为B；
   // 例子：
   A为父类，B为子类；
   interface Animal{
     name: string;
   }
	 interface Cat{
     name: string;
     run(): void;
   }
function testAnimal(animal: Animal){
  return (animal as Cat);
}
function testCat(animal: Cat){
  return (animal as Animal);
}
// Animal 可断言为Cat；
// Cat 也可被断言为Animal；
Cat可理解为在Animal接口上的继承
interface Cat extends Animal{
  run(): void;
}
```

- 双重断言：

```typescript
1. 将任何一个类型断言为任何另一个类型：
	interface Cat{
    run():void;
  }
	interface Fish{
    swim():void;
  }
	function testCat(cat: Cat){
    return (cat as any as Fish);
  }
// 直接将Cat类型断言为Fish类型会报错；
// 借助any类型作中介即可
除非迫不得已，否则不用双重断言
```

- 类型断言 与 类型转换：

```typescript
1. 类型断言只影响ts编译时的类型，类型断言语句在编译结果中会被删除，它不会真的影		响到变量的类型
2. 若要类型转换，直接调用类型转换的方法
function toBoolean(some: any) boolean{
  return some as boolean;
}
toBoolean(1); // 1
// 编译后为：
function toBoolean(some){
  return some;
}

// 若想转换类型，调用转换方法
function toBoolean(some: any) boolean{
  return Boolean(some);
}
```

- 类型断言 与 类型声明：

```typescript
1. function getCacheData(key: string): any {
    return (window as any).cache[key];
}

interface Cat {
    name: string;
    run(): void;
}

const tom = getCacheData('tom') as Cat; // 类型断言
const tom: Cat = getCacheDate('tom'); // 类型声明,将tom声明为Cat，然后将any类型的getCacheData('tom')赋值给Cat类型的tom
tom.run();

// 类型声明比较严格 
```

- 类型断言 与 泛型：

    ```typescript
    1. 上面例子改写：
    function getCacheData<T>(key: string): T{
        return (window as any).cache[key];
    }
    interface Cat{
        name: string;
        run(): void;
    }
    const tom = getCacheData<Cat>('tom');
    // 通过给getCacheData函数加一个泛型，对返回值的约束，同时去除代码中的any
    tom.run();
    ```

### 6.  声明文件：

- 全局变量的声明文件：(类型声明)

```typescript
- 声明语句只能定义类型，不能定义具体实现

1. 声明全局变量:
	declare var
    declare let
    // let 和 var 可以修改全局变量
    declare const
    // const 不允许修改

// src/xxx.d.ts
declare var jQuery: (sel: string) => any;
declare let jQuery: (sel: string) => any;
declare const jQuery: (sel: string) => any;



2. 声明全局函数：
	declare function 

// src/xxx.d.ts
declare function jQuery(sel: string): any;

- 函数类型的声明语句中，函数重载也是支持的
declare function jQuery(sel: string): any;
declare function jQuery(callBack: () => any): any;

3. 声明全局类：
declare class Animal {
    name: string;
    constructor(name: string);
    sayHi(): string;
}
let cat = new Animal('Tom');

4. 定义枚举类型：
declare enum Dirertions {
    up,
    down,
    left,
    right
}
let directions = [Directions.up, Directions.down, Directions.left, Directions.right];

5. namespace : 表示全局变量是一个对象，包含许多子属性

- 类型或接口的声明：
- 为了减少全局变量的冲突，尽量将interface或type放在namespace里
delcare namespace jQuery {
    interface(type) AjaxSettings {
    	method?: 'GET' | 'POST';
    	data?: any;
	}
    function ajax(url: string, settings?: AjaxSettings): void;
}

    // 在其他文件中即可使用该接口或类型
    let settings: jQuery.AjaxSettings = {
        methods: 'POST',
        data:{
            name: 'foo'
        }
    }
    jQuery.ajax('', settings);
    
6. 声明合并：
// 若jQuery既是函数，又是对象，可以组合多个声明语句，它们会合并起来
declare function jQuery(sel: string): any;
declare namespace jQuery{
    function ajax(url: string, settings?: any): void;
}
// 使用
jQuery('#foo');
jQuery.ajax('xxx/xx')
```

### 7. 内置对象：

- ECMAScript的内置对象：

```typescript
Boolean, Error, Date, RegExp等
let b: Boolean = new Boolean(1);
let e: Error = new Error('Error');
let d: Date = new Date();
let r: RegExp = /[a-z]/;
```

- DOM 和BOM的内置对象：

```typescript
Document, HTMLElement, Event, NodeList等
let body: HTMLElement = documnet.body;
let allDiv: NodeList = documnet.querySelectorAll('div');
documnet.addEventListener('click', function(e: MouseEvent)){
	//                          
}
```

### 8. 基础类型字面量类型(约束取值范围)：

```typescript
1. 约束取值只能取规定内的值：
type EventNames = 'click' | 'scroll' | 'mousemove';
function handleEvent(ele: Element, event: EventNames){
    //
}
// 使用
handleEvent(documnet.getElementById('hello'), 'scroll');
handleEvent(document.getElementById('world'), 'dbclick'); // 报错，EventNames中不存在dbclick
```

### 9.  元组：

```typescript
1. 元组合并不同类型的对象：
let tom: [string, number] = ['Tom', 25];

2. 越界的元素：
- 添加的元素只能是定义类型的联合类型，不能添加未定义的类型
tom.push('male');
tom.push(true); // 
```

### 10.  枚举(用于取值被限制在一定范围内)：

```typescript
enum Days {Sun, Mon, Tue, Wed, Thu, Fri, Sat};
Days[0] // Sun
Days['Sun'] // 0
```

- 常数枚举：

```typescript
- const enum 声明
- 常数枚举在编译阶段会被删除
const enum Directions {
    up,
    down,
    left,
    right
}
```

- 外部枚举：

```typescript
- declare enum
- declare 定义的类型只用于编译检查，编译结果中会被删除
declare enum Directions {
    up,
    down,
    left,
    right
}
```

### 10.  ts中的类：

- 三种修饰符：(public, private, protected)

```typescript
public: 修饰公有属性和方法
private: 修饰私有属性和方法，不能在声明它的类的外部访问，子类也不可以访问
protected: 修饰受保护的属性和方法，与private相似，它在子类中也可访问

- 当private修饰构造函数时，该类不允许被继承或实例化
- 当protected修饰构造函数时，该类只允许继承

class Animal {
    public name;
    private age;
    protected sex;
    public constructor(name, age, sxe){
        this.name = name;
        this.age = age;
        this.sex = sex;
    }
}

class Cat extends Animal{
    constructor(name, age){
        super(name, age);
        console.log(this.sex); // 不报错，子类可访问父类的protected属性
        console.log(this.age); // 报错，子类不可访问父类的private属性
    }
}

let a = new Animal('Jack',22);
console.log(a.name); // Jack

```

- 参数属性：

```typescript
1. 修饰符和readonly可直接使用在构造函数参数中
class Animal {
    readonly age;
    public constructor(public name, age) {
        this.name = name;
        this.age = age;
    }
}

2. readonly
- 只读关键字，只允许出现在属性声明或索引签名或构造函数中
- 若readonly和其他修饰符一起存在，需写在后面
public constructor(public readonly name){
    
}

let a = new Animal('Jack', 15);
console.log(a.age) // 15
a.age = 80; // 报错,只读
```

- 抽象类：

```typescript
1. 抽象类不允许被实例化：

abstract class Animal {
    public name = name;
    public constructor(name){
        this.name = name;
    }
    public abstract sayHi(); // 定义抽象方法，需要子类实现
}
let a = new Animal('Jack'); // 报错，抽象类不能被实例化

2. 抽象类中的抽象方法必须被子类实现：
class Cat extends Animal {
    public eat(){
        console.log(`${this.name} is eating`);
    }
}
let cat = new Cat('Tom'); // 报错，子类未实现父类的抽象sayHi方法

// 正确格式：
class Cat extends Animal {
    // 实现父类的sayHi方法
    public sayHi(){
        console.log(`my name is ${this.name}`);
    }
}
let cat = new Cat('Tom');
```

- 类的类型：

```typescript
1. 给类加ts类型，与接口类似：
class Animal {
    name: string;
    constructor(name: string) {
        this.name = name;
    }
    sayHi(): string {
        return `name is ${this.name}`
    }
}

let a: Animal = new Animal('Jack');
console.log(a.sayHi());
```

### 11. 类与接口：

- 类实现接口：

```typescript
1. 一个只能继承另一个类，不同类的共有特性就可以提取成接口(interfaces)，用implements实现
// 例子：
interface Alarm {
    arlert(): void;
}
class Door{
    
}
class SecurityDoor extends Door implements Alarm {
    alert() {
        console.log('SecurityDoor alert');
    }
}
class Car implements Alarm {
    alert(){
        console.log('Car alert');
    }
}

2. 一个类可以实现多个接口:
interface Alarm {
    alert(): void;
}
interface Light {
    lightOn(): void;
    lightOff(): void;
}

class Car implements Alarm, Light {
    alert(){
        console.log('Car Alert');
    }
    lightOn(){
        console.log('Light On');
    }
    lightOff(){
        console.log('Light Off');
    }
}
```

- 接口继承接口：

```typescript
interface Alarm(){
    alert(): void;
}
interface LightAlarm extends Alarm {
    lightOn(): void;
    lightOff(): void;
}
// LightAlarm 拥有三个方法
```

- 接口继承类：

```typescript
class Point {
    x: number;
    y: number;
    constructor(x: number, y: number){
        this.x = x;
        this.y = y;
    }
}
// Point3d继承的其实是类Point实例的类型(该类型只包含实例属性和实例方法,不包括构造函数，静态属性，静态方法)
interface Piont3d extends Point {
    z: number;
}
let point3d: Point3d = {
    x: 1,
    y: 2,
    z: 3
};
// 声明class Point时，创建一个Point的类，同时也创建了名为Point的类型(实例的类型),所以既可以把Point当一个类用，也可以当类型用
function printPoint(p: Point) {
    console.log(p.x, p.y);
}
printPoint(new Point(1, 2))
```

### 13.  泛型：

- 泛型是指在定义函数，接口，类的时候，不预先指定具体的类型，而是使用的时候再指定

```typescript
// 例子：实现一个函数，创建一个指定长度的数组，同时将每一项都填默认值
function createArr<T>(length: number, value: T): Array<T> {
    let result: T[] = [];
    for(let i = 0; i < length; i++){
        result[i]  = value;
    }
    return result;
}
// 调用时可指定返回值具体的类型
createArr<string>(3, 'x'); // ['x', 'x', 'x']
```

- 多个类型