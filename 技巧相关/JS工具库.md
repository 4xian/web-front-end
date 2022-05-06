# JS题目

### 1. 实现一个document.getElementById功能的函数

```js
1. 方法1: 递归

const findId = (id,node = document.body)=>{
    function getIds(node,obj){
        if(node){
            if(node.id) obj[node.id] = node;
            const children = node.children;
            for(v of children){
                getIds(v, obj)
            }
        }
        return obj;
    } 
    return getIds(node,{})[id];
}
// 使用
findId('id')

2. 方法2: document.createNodeIterator(root:'遍历起始节点', whatToShow? : '筛选节点的类型', filter? : '含有acceptNode方法的对象')

const findId = (id, nodes = document.body ) => document.createNodeIterator(nodes, NodeFilter.SHOW_ALL, {
    acceptNode(node){
        return node.id === id ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
    }
});

findId('id').nextNode();

```

### 2. 实现一个模拟sql语句的查找方法

```js
var data = [
    {title: 't1', userId: '10086', name: 'Jay'},
    {title: 't2', userId: '10087', name: 'Tom1'},
    {title: 't3', userId: '10088', name: 'Tina2'},
]

find(data).where({
name: /\d$/,
}).orderBy('userId','desc');

// 结果
[
    {title: 't3', userId: '10088', name: 'Tina2'},
    {title: 't2', userId: '10087', name: 'Tom1'}
]
```

```js
class FindSql {
    constructor(data){
        this.data = data;
    }

    // 返回符合正则后的数据,再新new
    where(reg){
        const temp = this.data.filter(v=>{
            let f = true;
            for(let i in reg){
                let cur = v[i];
                if(!(cur && reg[i].test(cur))){
                    f = false;
                }
            }
            return f;
        })
        return new FindSql(temp);
    }

    // 返回排序后的数据
    orderBy(name, sort){
        let fn;
        if(sort === 'desc'){
            fn = (a,b) => b[name] - a[name]
        }else{
            fn = (a,b) => a[name] - b[name]
        }
        return this.data.sort(fn)
    }
    
}

let find = (d) => new FindSql(d);

find(data).where({name: /\d$/}).orderBy('userId','desc');
```

### 3. 将字符串转为/消除千分位格式

```js
1. 正则:
let str = '12345678';
// (str, 几位)
const filter = (v,num = ) => {
    return v.replace(new RegExp(`\\d{1,${num}}(?=(\\d{${num}})+$)`,'g'), (i)=> i + ',');
}
filter(str,3) // 转为千分位

2. 
 let temp = str.toLocaleString("en-US",{style:"currency",currency:"USD"}).slice(1);
    temp.slice(0,temp.length - 3);

3. 消除位:
const clearFunc = (str) => {
    return (str + '').replace(/[,]/g, '');
}
```

### 4. 数组/对象扁平化flat方法

```js
1. 数组扁平化:

    -1. arr.flat(num:'扁平化的层数')

    -2. 利用arr.reduce(callback, initValue):
    function flats(arr){
        return arr.reduce((all,next)=>Array.isArray(next) ? [...all, ...flats(next)] : [...all, next],[])
    }

    -3. 利用toString方法(只适用于数字数组)：
    function flat(arr){
        return arr.toString().split(',')
    }

    -3. 自定义扁平层数:
    const flat = (arr,num = 1)=>{
        let temp = [],
            id = 0;
        function flat(arr){
            id++;
            arr.forEach(v=>{
                temp = Array.isArray(v) && id <= num ? flat(v) : [...temp, v]
            })
            return temp;
        }
        return flat(arr);
    }

2. 对象扁平化:

    -1. 自定义扁平化层数
    // 只适用于纯对象
    const flatObj = (obj,num = 1) => {
        let temp = {},
            id = 0;
        function func(obj){
            id++;
            for(let [k, v] of Object.entries(obj)){
                Object.prototype.toString.call(v) === '[object Object]' && id <= num ? func(v) : temp[k] = v;
            }
            return temp
        }
        return func(obj);
    }

    const flatObj = (obj, num = 1) => {
        let temp = {},
            id = 0;
        function flat(item, key="", isArr=false){
            id++;
            for(let [k,v] of Object.entries(item)){
                if(id <= num){
                    if(Array.isArray(v)){
                        let p = isArr ? key + '[' + k + ']' : key + k
                        flat(v, p, true)
                    }else if(typeof v === 'object'){
                        let p = isArr ? key + '[' + k + ']' : key + k + '.'
                        flat(v, p, false)
                    }else{
                        let p = isArr ? key + '[' + k + ']' : key + k
                        temp[p] = v
                    }
                }else{
                    let p = isArr ? key + '[' + k + ']' : key + k
                    temp[p] = v
                } 
            }
        }
    }


```

### 5. 格式化时间戳

```js
/* 
time(时间戳);
type(格式化类型);
zero(不满十是否补零)
*/
formatTime(time, type = 'YYYY-MM-DD HH:mm:ss', zero = true) {
        let timeArr = {
            'YYYY': new Date(time).getFullYear(),
            'yyyy': new Date(time).getFullYear(),
            'MM': new Date(time).getMonth() + 1,
            'DD': new Date(time).getDate(),
            'dd': new Date(time).getDate(),
            'HH': new Date(time).getHours(),
            'hh': new Date(time).getHours(),
            'mm': new Date(time).getMinutes(),
            'ss': new Date(time).getSeconds()
        };
        const addZero = (val) => {
            return zero ? val > 10 ? val : `0${val}` : val
        }
        for (const [key, val] of Object.entries(timeArr)) {
            if (type.indexOf(key) !== -1) {
                type = type.replace(new RegExp(key), addZero(val))
            }
        }
        return type
    }

```

### 6. 打乱数组顺序

```js
let arr = [0,1,2,3,4,5,6,7,8,9]
function randomArray(arr){
    for(let idx = 0; idx< arr.length; idx++){
        const index = Math.round(Math.random() * (arr.length - 1 - idx)) + idx;
        [arr[idx],arr[index]]= [arr[index], arr[idx]]
    }
}
```

### 7. 实现数组的push,filter,map方法

```js
    1. push方法:
    Array.prototype._push = function(...args){
        for(let i = 0; i < args.length; i++){
            this[this.length] = args[i]
        }
        return this.length;
    }

    2. filter方法:
    Array.prototype._filter = function(fn){
        if(typeof fn !== 'function'){
            throw Error('参数必须为函数')
        }
        const arr = [];
        for(let i = 0; i < this.length; i++){
            fn(this[i] && arr.push(this.[i]))
        }
        return arr;
    }

    3. map方法:
    Array.prototype._map = function(fn){
        if(typeof fn !== 'function'){
            throw Error('参数必须为函数')
        }
        const arr = [];
        for(let i = 0; i < this.length; i++){
            res.push(fn(this[i]));
        }
        return arr;
    }
```

### 8. 实现字符串的repeat方法

```js
1.
function repeat(s,n){
    return (new Array(n + 1)).join(s)
}

2.
function repeat(s,n){
    return n > 0 ? [...s,repeat(s,--n)].toString(): ''
}
```

### 9. 实现字符串的翻转

```js
function reverse(str){
    return [...str].reverse().join('')
}
```

### 10. 类数组转为数组

```js
Array.prototype.slice.call(arr);
Array.prototype.splice.call(arr,0);
Array.prototype.concat.apply([],arr);
Array.from(arr);
```

### 11. 对象与树形结构相互转化

```js
    1. 将数组对象转为树形结构:
    function toTree(arr = [], cid="id", pid="pid"){
        // 先深克隆会更好
        if(!Array.isArray(arr) || arr.length <= 0){
            return arr;
        }
        arr.forEach(v=>{
            let child = arr.filter(it=>{
                return v[cid] === it[pid]
            })
            v.children = child;
        })
        return [arr[0]]
    }

    2. 将树形结构扁平化为数对象:
    function flatTree(obj = {}, cid = 'children'){
        if(!Array.isArray(obj[cid]) || obj[cid].length <= 0){
            return obj;
        }
        let temp = [];
        const flat = (child)=>{
            child[cid].forEach(v=>{
                if(Array.isArray(v[cid]) && v[cid].length > 0){
                    flat(v);
                }
                temp.push({...v,[cid]:null});
            })
        }
        flat(obj);
        return [...temp,{...obj,[cid]:null}];
    }
```

### 12. url的params参数与对象相互转化

```js
1. 将params转为对象:
function parseUrl(str){
    let obj = {};
    str.slice(str.indexOf('?') + 1).split('&').forEach(v=>{
        let temp = v.split('=');
        obj[temp[0]] = decodeURIComponent(temp[1]) || true
    })
    return obj;
}

2. 将对象拼接为params字符串:
function mergeParams(obj = {}){
    let url = '';
    for(const [key,val] of Object.entries(obj)){
        url += `&${key}=${encodeURIComponent(val)}`
    }
    return url.replace(/&/,'?')
}
```

### 13.  获取任意区间的两整数

```js
function random(min = 0, max = 255) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};
```
