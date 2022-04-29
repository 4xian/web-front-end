# JS算法

### 1. 爬楼梯问题

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

### 2. 总和最大子数组问题

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

### 3. 跳棋游戏

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

### 4. 二分算法

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

### 5. 快排

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

### 6. 冒泡排序

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

### 7. 计算时钟时分间角度

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
