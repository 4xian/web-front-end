# CSS题目

#### 1. 如何解决相邻的两个inline-block节点间会出现间隔的情况

```js
1. 行内元素排版时，元素间的空白符(空格，回车换行)会被浏览器处理，根据white-space的处理方式，html中回车换行会被转为空白符，当字体不为0时，空白符占据一定宽度，导致inline-block出现间隔，并会随着字体的大小二变化

2. 解决办法：
    - 将HTML中的代码写成一行或用注释填充，保证标签之间没有空格
    - 使用margin负值(不太通用)
    - 使font-size为0
    - 使letter-spacing为负值
    - 使word-spacing为负值 和 display:inline-table
```

#### 2. 

```js

```