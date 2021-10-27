# JS算法：

### 1. 爬楼梯问题：
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

### 2. 总和最大子数组问题：
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

### 3. 跳棋游戏：
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

### 4. 二分算法：
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