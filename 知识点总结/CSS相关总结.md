# CSS相关总结

#### 1. CSS盒子模型

```js
IE盒模型 / 标准盒模型

盒模型：内容(content) / 填充(padding) / 边界(margin) / 边框(border) / 四部分组成.

- IE盒模型(border-box)：width和height 包含content / padding / border/
- 标准盒模型：width和height 只包含content
- 可使用box-sizing属性指定盒模型
```

#### 2. CSS选择器有哪些

```js
1. 选择器种类：
    - id选择器(#id) 
    - 类选择器(.className) 
    - 标签选择器(div,h1,p) 
    - 后代选择器(h1 p) 
    - 相邻后代选择器(子)选择器(ul > li) 
    - 兄弟选择器(li~a) 
    - 相邻兄弟选择器(li+a)
    - 属性选择器(a[rel="external"]) 
    - 伪类选择器(:hover, :nth-child) 
    - 伪元素选择器(::after, ::before) 
    - 通配符选择器(*)

2. 伪元素和伪类：修饰不在文档树中的部分
    - 伪元素:
        ::before / ::after / ::first-letter(选取指定选择器的首字母) / ::first-line(选取指定选择器的首行)

    - 伪类:
        :link(未被访问的链接)
        :visited(已被访问的链接)
        :active(活动的链接)
        :hover(鼠标悬浮的元素)
        :focus(选择具有焦点的)
        :first-child(选择父元素的首个子元素)
        // 以下css3新增
        :first-of-type 父元素的首个元素
        :last-of-type 父元素的最后一个元素
        :only-of-type 父元素的特定类型的唯一子元素
        :only-child 父元素中唯一子元素
        :nth-child(n) 选择父元素中第N个子元素
        :nth-last-of-type(n) 选择父元素中第N个子元素，从后往前
        :last-child 父元素的最后一个元素
        :root 设置HTML文档
        :empty 指定空的元素
        :enabled 选择被禁用元素
        :disabled 选择被禁用元素
        :checked 选择选中的元素
        :not(selector) 选择非 <selector> 元素的所有元素

    - 伪类匹配的是特殊状态， 伪元素匹配的是特殊位置

3. 属性选择器：
    - [attribute]：选择带有attribute属性的元素
    - [attribute=value]：选择所有使用attribute=value的元素
    - [attribute~=value]：选择attribute属性包含value的元素
    - [attribute|=value]：选择attribute属性以value开头的元素
    // 以下css3新增
    - [attribute*=value]：选择attribute属性值包含value的所有元素
    - [attribute^=value]：选择attribute属性开头为value的所有元素
    - [attribute$=value]：选择attribute属性结尾为value的所有元素

4. 优先级相关：!important > 内联 > ID选择器 > 类选择器 > 标签选择器
    - 计算规则：
       - 如果存在内联样式，那么 A = 1, 否则 A = 0
       - B的值等于 ID选择器出现的次数
       - C的值等于 类选择器 和 属性选择器 和 伪类 出现的总次数
       - D 的值等于 标签选择器 和 伪元素 出现的总次数

        // 例：
        #nav-global > ul > li > a.nav-link
        - 因为没有内联样式 ，所以 A = 0
        - ID选择器总共出现了1次， B = 1
        - 类选择器出现了1次， 属性选择器出现了0次，伪类选择器出现0次，所以 C = (1 + 0 + 0) = 1
        - 标签选择器出现了3次， 伪元素出现了0次，所以 D = (3 + 0) = 3
        结果可以简记作：(0, 1, 1, 3)

    - 比较规则：
        - 从左往右依次进行比较 ，较大者优先级更高
        - 如果相等，则继续往右移动一位进行比较
        - 如果4位全部相等，则后面的会覆盖前面的
```

#### 3. CSS中可继承的属性

```js
1. 可继承的：
    - 字体系列：font / font-size / font-weight / font-family / font-style / ...
    - 文本系列：text-align / text-shadow / line-height / word-spacing / letter-spacing / color/...
    - 列表属性：list-style / list-style-type / list-style-image / list-style-position / ...
    - cursor / visibility
    - 可使用inherit显式指定是否可继承

2. 无继承的：
    - display
    - 文本属性：vertical-align、text-decoration
    - 盒子模型的属性：宽度、高度、内外边距、边框等
    - 背景属性：背景图片、颜色、位置等
    - 定位属性：浮动、清除浮动、定位position等
```

#### 4. CSS中优先级如何计算

```js
四个等级：

行内样式：1,0,0,0  
ID选择器：0,1,0,0  
类/属性/伪类选择器：0,0,1,0  
元素和伪元素选择器：0,0,0,1

- 优先级相同，则后出现的优先级高
- 继承样式优先级最低，!important优先级最高(可理解为10000)
```

#### 5. CSS3中新增伪类

```js
- ele:nth-child(n)：选中父元素下的第n个子元素，子元素的标签名为ele
- ele:nth-last-child(n)：同上，从后往前找
- ele:last-child：选中最后一个子元素
- ele:only-child：如果ele是父元素唯一的子元素，则选中
- ele:nth-of-type(n)：选中父元素下第n个ele类型元素
- ele:first-of-type：选中父元素下第1个ele类型元素
- ele:last-of-type：选中父元素下最后1个ele类型元素
- ele:only-of-type：如果父元素的子元素只有一个ele类型元素，则选中
- ele:target：选中当前活动的ele元素
- :not(ele)：选中非ele的每个元素
- :enabled：表单控件的禁用状态
- :disabled：表单控件的禁用状态
- :checked：单选框/复选框被选中
```

#### 6. 水平垂直居中

```js
1. 水平居中：

    - div给宽度，添加 
        margin: 0 auto

    - text-align : center

    - 绝对定位的div居中：
        margin : auto, 
        top : 0, 
        left : 0, 
        right : 0,
        bottom : 0

2. 水平垂直居中：

    - 绝对定位，利用
        position: absolute,
        top : 50%, 
        left : 50%,
        transform ：translate(-50%,-50%)

    - 利用flex布局：
        // 法1
            display:flex, 
            align-items: center, 
            justify-content: center

        // 法2
            // 父类
            display:flex,
            align-items:center,
            // 子类
            align-self:center

    - 利用grid布局：
        // 法1
            display:grid,
            align-items:center,
            justify-items:center

        // 法2
            // 父类
            display:grid,
            // 子类
            align-self:center,
            justify-self:center

    - 利用text-align :center(父类) 和 vertical-align : center(子类)
```

#### 7. display相关

```js
block： 块类型，默认宽度为父元素宽度，可设置宽高，换行显示
none：从文档流中移出
inline：行内类型，默认宽度为内容宽度，不可设置宽高
inline-block：默认宽度为内容宽度，可以设置宽高，同行显示
list-item：像块类型显示，添加样式列表标记
table：作为块级表格来显示
inherit：继承父元素值
```

#### 8. position相关

```js
static：默认无定位，文档出现在正常流
relative：相对定位，相对于元素本身进行偏移
absolute：绝对定位，相对于距离最近的非static的padding box左上角原点进行偏移
fixed：绝对定位， 相对于浏览器窗口进行定位
```

#### 9. CSS3新特性

```js
CSS各种选择器
border-radius / text-shadow / 多列布局 / 阴影和反射/ 渐变 / 旋转 / 缩放 / 定位 / 倾斜 / 动画 / 多背景 / ...
```

#### 10. flex弹性盒布局模型

```js
display : flex 水平的主轴和垂直的交叉轴

1. 外层容器上的属性：

    - flex-direction : 决定项目的排列方向 row / row-reserve / column / column-reserve /
    - flex-warp ：内容是否可换行 warp / nowarp
    - flex-flow：前两个的简写形式 row nowarp
    - justify-content：水平方向的对齐方式 start / center / end / space-around / space-evenly / space-between
    - align-items：垂直方向上的对齐方式 start / center / end / stretch

2. 内层元素的属性：

    - order：每个元素的排列先后， 数值越小，越靠前，默认为0
    - flex-grow：元素的放大比例，默认为0，即存在空间也不放大
    - flex-shrink：元素的缩小比例，默认为1，空间不足将缩小
    - flex-basis：定义分配多余空间之前，项目占据的主轴空间
    - flex：flex-grow，flex-shirk，flex-basis的简写默认0 1 auto
    - align-self：允许单个项目与其他有不一样的对齐方式，可覆盖align-items
```

#### 11. CSS实现三角形原理

```js
​ 相邻边框连接处的均分原理：

width：0, 
height：0, 
border-width: 10px, 
border-style : solid, 
border-color : transparent transparent red transparent
```

#### 12. 浏览器兼容性有哪些

```js
- 浏览器默认的margin和padding不统一 (加一个*{margin : 0, padding : 0解决})

- 统一使用getAttribute()获取自定义属性

- chrome 中奖小于12px的文本按照12px显示(利用-webkit-transform-scale(0.75)，但是缩小的是整个元素 需转换成块元素display : block / inline-block)

- 被点击访问过的超链接样式不再具有hover和active(改变css顺序L-V-H-A)

- 初始化CSS代码：

body,h1,h2,h3,h4,h5,h6,hr,p,blockquote,dl,dt,dd,ul,ol,li,pre,form,fieldset,legend
,button,input,textarea,th,td{margin:0;padding:0;}
body,button,input,select,textarea{font:12px/1.5tahoma,arial,\5b8b\4f53;}
h1,h2,h3,h4,h5,h6{font-size:100%;}
address,cite,dfn,em,var{font-style:normal;}
code,kbd,pre,samp{font-family:couriernew,courier,monospace;}
small{font-size:12px;}
ul,ol{list-style:none;}
a{text-decoration:none;}
a:hover{text-decoration:underline;}
sup{vertical-align:text-top;}
sub{vertical-align:text-bottom;}
legend{color:#000;}
fieldset,img{border:0;}
button,input,select,textarea{font-size:100%;}
table{border-collapse:collapse;border-spacing:0;}
```

#### 13. 块级格式化上下文(BFC)

```js
1. 按规则摆放的容器，内外环境都不受影响，相当于一个隔离区域

2. 
    - box垂直方向的距离由margin决定，同一个BFC中的两个相邻box的margin会重叠
    - BFC区域不会与float box重叠
    - 计算BFC的高度时，浮动元素也会参与计算

3. 创建BFC：
    - 根元素html
    - float为非none的值
    - 绝对定位absolute/fixed
    - display为inline-block / flex / inline-flex / table-cell / table-caption /
    - overflow为非visible的值
```

#### 14. 清除浮动

```js
脱离文档流，内部元素高度高于外部盒子时，会出现高度塌陷

- 使用clear清楚浮动(只有块级元素才生效)：
    .class::after{
        display : block , 
        content : '' , 
        clear : both 
    }
- 创建BFC

- 使用：.class{
            display: flow-root
        }
```

#### 15. CSS优化

```js
- 压缩css，减小体积 / 减少使用@import
- css选择器是从右到左匹配的，避免使用通配符*{}， 多用class而非标签，尽量少用后代选择器做关键选择器
- 慎用定位，浮动 / 尽量减少重绘，回流 / 去除空规则 / 属性为0时不加单位 / 值为小数时，省略0 / 标准化浏览器前缀 / 选择器避免嵌套过深 /
- 相同属性的样式抽离出来，整合并通过class使用 / 样式定义到外部css中
```

#### 16. 常见的元素隐藏方式及特点

```js
1. display：none 
    - 脱离文档流，渲染树不会包含该渲染对象，无法响应点击事件
    - 非继承属性，无法通过修改子节点属性显示
    - 会造成回流
    - 不支持动画

2. visibility：hidden，
    - 页面中仍然占据空间，不会响应绑定的事件
    - 继承属性，子节点设置visibility:visible可让子节点显示
    - 会造成重绘

3. opacity：0，
    - 页面中占据空间，并且【响应绑定的事件】
    - 非继承属性，无法通过修改子节点属性显示
    - 会造成重绘

4. 通过绝对定位将元素移出可视区域
5. 通过clip/clip-path裁剪元素的方式实现隐藏，占据空间，不会响应事件
    - clip-path: polygon(0px 0px,0px 0px,0px 0px,0px 0px)
6. transform: scale(0) ，占据空间，不会响应事件
7. 设置height，width为0 和 overflow：hidden
    - 不占据页面空间，无法响应点击事件
```

#### 17. CSS中百分比的计算基准

```js
公式：当前元素某CSS属性值 = 基准 * 对应的百分比

- 元素的 position 为 relative 和 absolute 时，top和bottom、left和right基准分别为父元素的 height、width
- 元素的 position 为 fixed 时，top和bottom、left和right基准分别为初始父元素（也就是视口）的 height、width，移动设备较为复杂，基准为 Layout viewport 的 height、width
- 元素的 height 和 width 设置为百分比时，基准分别为父元素的 height 和 width
- 元素的 margin 和 padding 设置为百分比时，【基准为父元素的 width】（易错）
- 元素的 border-width，不支持百分比
- 元素的 text-indent，基准为父元素的 width

- 元素的 border-radius，基准为分别为【自身】的height、width
- 元素的 background-size，基准为分别为自身的height、width
- 元素的 translateX、translateY，基准为分别为自身的height、width
- 元素的 line-height，基准为自身的 font-size

- 元素的 font-size，基准为父元素字体
```

#### 18. 行内元素和块级元素

```js
1. 行内元素：
    - 行内元素在一行内排不下时会换行，宽度随内容变化
    
    - 常见的行内元素：
        span, a, strong, button, input, textarea, select, code, img, sub

2. 块级元素：
    - 宽度自动填满父元素宽度
    
    - 常见的块级元素：
        div, p, li, h1-h6, form, header, ol, ul, article, aside, audio, canvas, dd, dl, section, video

3. 区别：
    - 行内元素不会以新的一行开始；块级元素会新起一行
    - 行内元素设置宽高无效；块级可以设置宽高(仍然独占一行)
    - 行内元素对于margin和padding 【水平方向有效，竖直方向无效】；块级元素水平竖直都有效
    - 行内元素无法包裹块级元素；块级元素可以包裹行内元素/块级元素
```

#### 19. css加载会造成阻塞吗

```js
1. 结论：
    - css加载不会阻塞DOM树的解析
    - css加载会阻塞DOM树的渲染
    - css加载会阻塞后面js语句的执行

2. 原因：
    - DOM解析和CSS解析是并行的过程，CSS加载不会阻塞DOM解析
    - 由于渲染树需要DOM树和CSSOM树，必须等到CSS资源加载完成才能渲染DOM，因此CSS加载会阻塞DOM渲染
    - js可能会操作dom节点和css样式，css会在js执行前先执行，因此css会阻塞后面js执行

3. 提高css加载速度：
    - 使用CDN
    - 对css进行压缩
    - 合理的使用缓存
    - 减少http请求数，将多个css文件合并
```

#### 20. grid网格布局

```js
1. 
    grid-template-columns： 设置列宽
    grid-template-rows：设置行高

        - repeat(次数, 数值): 简写重复的值
        - auto-fill：自动填充，让一行或一列可以容纳更多的单元格
        - fr：片段，表示比例关系
        - minmax(min, max)：长度范围，第一个参数是最小值，第二个是最大值
        - auto：由浏览器自己决定长度

    .class{
        display: grid;
        grid-template-columns: 200px 200px 200px; // 或者 repeat(3, 200px)
        grid-template-columns: repeat(auto-fill, 200px); // 列表是200px，数量不固定，随浏览器自动放置个数
        grid-template-columns: 200px 1fr 2fr; // 第一列宽200px，后面剩余两部分，宽度比例为剩余宽度的1/3 和2/3
        grid-template-columns: 200px auto 200px; // 第一列 第三列为200px，中间由浏览器决定
    }

2. grid-row-gap： 行间距
   grid-column-gap：列间距
   grid-gap：行列间距的简写形式

3. grid-template-areas：定义区域，一个区域由一个或多个单元格组成

    // 九个单元格，将其定义为a-i的九个区域
    .class{
        display: grid;
        grid-template-columns: repeat(3, 100px);
        grid-template-rows: repeat(3, 100px);
        grid-template-areas: 'a b c'
                             'd e f'
                             'g h i'

        // 合并某些区域 将9个单元格分成a、b、c三个区域
        grid-template-areas: 'a a a'
                             'b b b'
                             'c c c'

        某些区域不需要利用，则使用"点"（.）表示
    }

4. grid-area：指定项目放在哪一个区域，与grid-template-areas一起使用
    // 放置b区域
    .class{
        grid-area: b
    }

5. grid-auto-flow：决定子元素的排列顺序
    - row 先行后列(默认)
    - column 先列后行
```

#### 21. 
