# JS题目:

### 1. 实现一个document.getElementById功能的函数:
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

### 2. 实现一个模拟sql语句的查找方法：
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
            for(i in reg){
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

### 3. 将字符串转为/消除千分位格式:
```js
1. 正则:
let str = '12345678';
// (str, 几位)
const filter = (v,num) => {
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

### 4. 扁平化flat方法:
```js
1. 数组扁平化:

    -1.arr.flat(num:'扁平化的层数')

    -2.利用arr.reduce(callback, initValue):
    function flats(arr){
        return arr.reduce((all,next)=>Array.isArray(next) ? [...all, ...flats(next)] : [...all, next],[])
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
```

### 5. 