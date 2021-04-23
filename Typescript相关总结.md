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
1.  function getCacheData(key: string): any {
    	return (window as any).cache[key];
	}

	interface Cat {
    	name: string;
    	run(): void;
	}

	const tom = getCacheData('tom') as Cat;
	tom.run();
```

