# JS算法

#### 1. 爬楼梯问题

```js
n个阶梯，每次爬一步或两步，有多少种情况可以到达顶部

const stairs = (total)=>{
    if(total <= 0) return 0;
    if(total <= 2) return total;
    let arr = [1,2];
    for(let i = 3; i <= total; i++){
        [arr[0],arr[1]] = [arr[1],arr[0] + arr[1]]
    }
    return arr[1]
}
```

#### 2. 总和最大子数组问题

```js
一个数组，找出最大的连续子数组，使得总和为最大

const subArray = (arr)=>{
    let max = -Infinity,
        currentTotal = 0,
        startIndex = 0,
        endIndex = arr.length - 1,
        currentIndex = 0;
    
    arr.forEach((item,index)=>{
        currentTotal += item;
        if(max < currentTotal){
            max = currentTotal;
            startIndex = currentIndex;
            endIndex = index;
        }
        if(currentTotal < 0){
            currentTotal = 0;
            currentIndex = index +1;
        }
    })
    return arr.slice(startIndex,endIndex + 1)
}
```

#### 3. 跳棋游戏

```js
在一个非负整数数组中，第一个索引为起点，第一个索引的值为下一步走的步数，最终走到终点为true,走不到终点为false

function jump(arr,i =0){
    let step = arr[i],
        flag = false;
    const func = (arr,id)=>{
        let nextIdx = arr[id];
        if(nextIdx === 0){
            flag = false;
            return;
        };
        step = step + nextIdx;
        if(step >= arr.length){
            flag = true;
            return;
        };
        func(arr,step)
    }
    func(arr,step)
    return flag;
}
```

#### 4. 二分算法

```js
function binary(v,arr){
    let mid = Math.floor(arr.length / 2),
        midLeft = arr.slice(mid);
        midRIght = arr.slice(mid + 1);
        if(v === arr[mid]){
            return mid
        }else if(v < arr[mid]){
            binary(v,midLeft)
        }else if(v > arr[mid]){
            binary(v,midRight)
        }
}
```

#### 5. 快排

```js
const quickSort = (arr) => {
    if (arr.length < 1) {
        return arr;
    } else {
        let middle = Math.floor(arr.length / 2),
            middleValue = arr.splice(middle, 1),
            left = [],
            right = [];

        for (let i = 0; i < arr.length; i++) {
            if (arr[i] < middleValue) {
                left.push(arr[i]);
            } else {
                right.push(arr[i]);
            }
        }

        return quickSort(left).concat(middleValue, quickSort(right));
    }
}
```

#### 6. 冒泡排序

```js
const sort = (arr) => {
    for(let i=0;i<arr.length - 1;i++){
        for (let j=0;j<arr.length-i-1;j++){
           //两个for循环 依次比较 把较大的数记录下来给后面 依次类推 达到排序的结果
            if(arr[j]>arr[j+1]){
                var swap = arr[j];
                arr[j]=arr[j+1];
                arr[j+1]=swap;//大的放在右边，小的放左边
            }
        }
                
    }
    return arr;
}
```

#### 7. 计算时钟时分间角度

```js
// h: 小时 m: 分钟
const calcTime = (h,m) => {
    let d = (h - 12) * 30,
        d1 = (6 - 0.5) * m,
        gap = d1 - d;
    return Math.abs(Math.min(gap,360-gap))
    // Math.abs(Math.min(5.5 * m - 30 * h + 360,5.5 * m - 30 * h))
}
```

#### 8. 实现根据运算优先级给字符串添加括号

```js

例：存在字符串 const str = '11+2-3*4+5/2*4+10/5'，现在需要将高优先级运算，用小括号包裹起来，例如结果为 '11+2-(3*4)+(5/2*4)+(10/5)'。注意可能会出现连续的乘除运算，需要包裹到一起

    function addBrackets(exp){
        // 存储结果
        const res = []
        // 运算符
        const operator = ['+', '-', '*', '/']
        // 高级运算符
        const highOperator = ['*', '/']
        const isOperator = (v)=>operator.includes(v)
        const isHighOperator = (v)=>highOperator.includes(v)
        const len = exp.length
        // 是否处在高级运算符范围内
        let flag = false
        // 临时存储
        let curr = ''

        for(let i = 0; i<len; i++){
            let isOp = isOperator(exp[i])
            let isHighOp = isHighOperator(exp[i])
            // 是运算符
            if(isOp){
                // 是高级运算符
                if(isHighOp){
                    // 不在高级范围内，说明高级运算符刚开始，添加左括号
                    if(!flag){
                        curr = '(' + curr
                    }
                    // 高级运算符为true
                    flag = true
                    curr += exp[i]
                }else{
                    if(flag){
                        // 不是高级运算符 但在高级范围内，说明高级范围结束，添加右括号
                        res.push(curr + ')')
                        // 高级运算符结束为false
                        flag = false
                    }else{
                        res.push(curr)
                    }
                    res.push(exp[i])
                    curr = ''
                }
            }else{
                curr += exp[i]
            }
        }
        if(curr){
            res.push(curr + (flag ? ')' : ''))
        }
        return res.join('')
    }
```



#### 9. 函数柯里化的实现

1. ```js
    function curry(fn, ...args){
        return fn.length <= args.length ?     fn(...args) : curry.bind(null, fn, ...args)
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

#### 10. 查找一篇文章中出现频率最高的单词

```js
function searchWord(text){
    if(text){
        let map = {},
            r = {
                max:0,
                name:''
            };
        // 先过滤 只保留单词
        let temp = text.match(/[a-z]+/g).join('')
        for(let v of temp){
            if(map.hasOwnProperty(v)){
                map[v] += 1
                // 每次循环都与存的比较 最大的替换下来
                if(map[v] > r.max){
                    r = {
                        max: map[v],
                        name: v
                    }
                } 
            }else{
                map[v] = 1
            }
        }
        return r
    }
}

function searchWord(text){
    if(text){
        let res = [],
            max = 0;
        let arr = text.match(/[a-z]+/g).join('')
        for(let v of arr){
            let temp = res.findIndex(k => k.name === v)
            if(temp !== -1){
                res[temp].value += 1  
            }else{
                res.push({
                    name: v,
                    value:1
                })
            }
        }
        max = Math.max(...res.map(v => v.value).join(''))
        return res.map(v => {
            if(v.value === max) return v
        })
}

```

#### 11. 
