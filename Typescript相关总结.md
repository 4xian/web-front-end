### 1. 类型断言：

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
1. 类型断言只影响ts编译时的类型，类型断言语句在编译结果中会被删除，它不会真的影响到变量的类型
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
1. 
```

