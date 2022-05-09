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

#### 2. 实现禁止移动端页面的左右滑动手势

```js
1. touch-action 用于设置触摸屏用户如何操纵元素的区域(如：浏览器内置的缩放，双击缩放)

2. 方法：
    - html {
        touch-action: none;
        touch-action: pan-y;
    }
```

#### 3. IconFont的原理是什么

```js
1. 来源于css的 @font-face 属性

2. @font-face {
        font-family: 定义字体名称;
        // url: 字体路径，有相对路径 / 绝对路径 / 网络地址 
        // type：truetype(.ttf)、opentype(.otf)、truetype-aat、embedded-opentype(.eot)、svg(.svg)、woff(.woff)
        src: url('./xxx') format(type),
             url('./xxx1) format(type),
             ...;
        font-weight: 定义加粗样式
        font-style: 定义字体样式
    }

    // 常见写法：
    @font-face {
        font-family: 'myFont';
        src: url('xxx.ttf?') format('truetype'),
             url('xxx.woff') format('woff');
        font-weight: normal;
        font-style: normal;
    }

    // 使用：
    .class {
        font-family: 'myFont'
    }
```

#### 4. 响应式设计相关

```js
1. 通过媒体查询检测不同的设备屏幕尺寸做处理，处理移动端，页面头部须有meta声明viewport

    // <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
    - width=device-width: 自适应手机屏幕的尺寸宽度
    - maximum-scale: 缩放比例的最大值
    - initial-scale: 缩放的初始化
    - user-scalable: 用户是否可以缩放

2. 实现响应式布局的方式：
    - 媒体查询：对不同的媒体类型定义不同的样式
        @media screen and (max-width: 1920px){
            // 窗口最大为1920
        }
        @media screen (min-width: 375px) and (max-width: 600px) {
            // 窗口在375和600之间
        }

    - 百分比
    - vw/vh
    - rem：相对于根元素html的font-size，默认情况为1rem=16px
```

#### 5. 