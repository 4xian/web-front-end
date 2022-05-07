# Scss相关

#### 1. 变量

```scss
$font: 14px;
// 使用
font-size: $font;
```

#### 2. mixin(预先定义一些样式)

```scss
@mixin styleName($args1, $args2, ...){
    // 样式
    font-size: $args1;
    color: $args2;
    ...
}
// 使用
div{
    @include styleName(14px, red);
    // 参数换顺序
    @include styleName($args2:red, $args1: 14px)
}
```

#### 3. 继承/扩展

```scss
.one{
    color: red;
}
.one a{
    font-size: 12px;
}
.two {
    @extend .one;
    background: #fff;
}
// 相当于
.one, .two{
    color: red;
}
.one a, .two a{
    font-size: 12px;
}
.two{
    background:#fff;
}
```

#### 4. 计算

```scss
$width: 20px;
div{
    margin:(5px * 2);
    left: 10px + $width;
}
// 相当于
div{
    margin: 10px;
    left: 30px;
}
```

#### 5. 颜色函数

```scss
// 1. hsl(色相, 饱和度, 明度)
div{
    background: hsl(5,20%,20%);
    // 相当于 background: #3d2b29;
}
// 2. hsl(色相, 饱和度, 明度, 不透明度)
div{
    background: hsl(5,20%,20%,0.5);
    // 相当于 background: rgba(61, 43, 41, 0.5);
}
// 3. 调整色相: adjust-hue(颜色, 调整的度数);
div{
    background: adjust-hue(hsl(0,100,50%), 100deg);
    // 相当于: background: #55ff00;
}
// 4. 调整颜色明暗度: lighten(color, 亮度百分比)更亮, darken(color, 暗度百分比)更暗
div{
    color: lighten(rgb(228,145,145), 50%);
    background: darken(rgb(228,145,145), 50%);
    // 相当于:
    color: #5f1717;
    background: white;
}
// 5. 调整颜色的纯度: saturate(color, 纯度百分比)更纯, desaturate(color, 不纯百分比)不纯
    // 用法同4
```

#### 6. Interpolation: #{变量} (把一个值插入到另一个值)

```scss
$custom : color;
div{
    #{$custom}: red;
    // 相当于: color: red
}
```

#### 7. if-else

```scss
@if 条件{
    ...
}@else {
    ...
}
```

#### 8. for循环

```scss
// (不包括结束值)
@for 变量 from 开始 to 结束 {
    ...
}

// (包括结束值)
@for 变量 from 开始 through 结束 {
    ...
}

// 使用
@for $i from 1 to 3 {
    .div#{$i} {
        color: red;
    }
}
// 相当于:
.div1,.div2{
    color : red
}

@for $i from 1 through 3 {
    .div#{$i} {
        color: red;
    }
}
// 相当于:
.div1,.div2,.div3{
    color : red
}
```

#### 9. 遍历列表

```scss
@each 变量 in 列表{
    ...
}

// 使用
$colors: red green blue white;
@each $v in $colors {
    .div#{$v} {
        color: $v;
    }
}
// 相当于:
.divred{
    color: red;
}
.divgreen{
    color: green;
}
.divblue{
    color:blue;
}
.divwhite{
    color: white;
}
```

#### 10. while循环

```scss
@while 条件{
    ...
}
// 
$num : 1;
@while $num < 4 {
    .div#{$num}{
        height: $num * 20px;
    }
    $num: $num + 1;
}
// 相当于:
.div1 {
  height: 20px;
}

.div2 {
  height: 40px;
}

.div3 {
  height: 60px;
}
```

#### 11. function函数

```scss
@function funcName($args1, $args2, ...){
    ...
}
// 使用
@function customWidth($v){
    @if($v < 10){
        @return $v * 2;
    }@return $v;
}
div{
   width: customWidth(5px); 
// width: customWidth(15px); 
}
// 相当于
div{
    width: 10px;
//  width: 15px;
}
```

#### 12. %百分号

```scss
1. 类似占位符，不会输出代码，用@extend扩展使用

%one{
    color: red;
    font-size: 12;
}
.two{
    @extend %one;
    border: 1px solid blue;
}

生成的css代码：
.two{
    color: red;
    font-size:12;
}
.two{
    border: 1px solid blue;
}
```
