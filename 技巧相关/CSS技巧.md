# CSS技巧

#### 1. writing-mode(调整文本排版)

```scss
vertical-rl (垂直右边开始) | vertical-lr (垂直左边开始) | horizontal-tb |  sideways-rl | sideways-lr (后三个水平排列)
```

#### 2. text-align-last(文本对齐方式)

```scss
auto | start | end | left | right | center | justify (两端对齐)
```

#### 3. 使用:not()指定元素不使用样式

#### 4. object-fit(设置图片展示方式)

```scss
fill(填满,会拉伸) | contain(保持宽高比,有黑边) | cover(保持宽高填满,会裁剪) | none | scale-down(none/contain中的一个)
```

#### 5. 给文字设置省略号

```scss
// 1. 多行设置省略号
        display: -webkit-box;
  overflow: hidden;
  text-overflow: ellipsis;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3; // 要省略的行数

// 2. 单行设置省略号
        overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
```

#### 6. 利用scale和::after画1px边框

```scss
&::after{
   position:absolute;
   content: '';
   width:200%;
   height:200%;
   left:0;
   top:0;
   border:1px solid red;
   transform:scale(0.5);
   transform-origin: top left // 转换元素的起点
  }
```

#### 7. 使用letter-spacing倒序文本

```scss
// 设置负值
.class{
    padding-left: 40px; // 与letter-spacing数值一致
 font-size: 20px;
 letter-spacing: -40px; // letter-spacing最少是font-size的2倍
}
```

#### 8. -webkit-overflow-scrolling

```scss
// 解决IOS滚动卡顿情况
-webkit-overflow-scrolling: touch; // ios原生滚动
```

#### 9. 使用transform启用硬件加速解决多个动画卡顿

```scss
transform: translateZ(0) / transform3d(0,0,0)
```

#### 10. attr()获取data-*内容

```scss
<div data-msg="haha" class='attr'></div>
.attr{
    &::after{
        content: attr(data-msg)
    }
}
```

#### 11. 使用 :valid 和 :invalid 校验表单

```scss
input 可以使用:valid 和 :invalid pattern(正则) 校验表单
<input pattern="^1[3456789]\d{9}$">
input{
    &:focus:valid{
        // 满足pattern条件时
        border-color: #3c9;
    }
    &:focus:invalid{
        // 不满足pattern条件时
        border-color: #f66
    }
}
```

#### 12. 使用pointer-events禁用事件

```scss
// 禁用(默认事件, 冒泡事件, 鼠标事件, 键盘事件...)
pointer-events: none;
```

#### 13. filter设置灰度

```scss
filter: grayscale(100%);// 全灰
```

#### 14. ::selection改变文本选择颜色

```scss
// 鼠标选择时
::selection{

}
```

#### 15. 控制文本渐变

```scss
    background-image: linear-gradient( #f66, #f90);
 background-clip: text;
```

#### 16. caret-color改变光标颜色

```scss
caret-color: red;
```

#### 17. 设置滚动条样式

```scss
.scrollBar{
    &::-webkit-scrollbar {
   width: 5px; // 滚动条宽度
  }
  &::-webkit-scrollbar-track {
   background-color: transparent; // 滚动条整个背景色
  }
  &::-webkit-scrollbar-thumb {
   border-radius: 2px;
   background-color: rgba(144, 147, 153, 0.5); // 滚动条当前区块颜色
  }
}

// 横向进度条
background: linear-gradient(to right top, #f66 50%, #f0f0f0 50%) no-repeat;
background-size: 100% calc(100% - 298px + 5px);
```

#### 18. filter滤镜效果

```scss
filter: blur(5px); // 设置模糊度
filter: brightness(100%); // 设置亮度 0%为全黑; 100%不变; 100%以上增强
filter: contrast(1) // 调整图形的对比度 0%为全黑; 100%不变; 100%以上更低的对比
filter: grayscale() // 设置图像灰度
filter: hue-rotate(0deg); // 设置图像颜色色相旋转 0deg~360deg
filter: invert(0%) // 反转图像 0%~100% 100%完全反转
filter: opacity(0.5) // 设置图像的透明度 
filter: saturate(0%) // 设置图像的饱和度 超过100%更高的饱和度
filter: sepia(0%) // 将图像转为深褐色 0%~100%  100%完全深褐色

filter: contrast(175%) brightness(3%) // 可以多属性复合使用
```

#### 19. linear-gradient画波浪线

```scss
@mixin waveline($h, $color: #f66) {
 position: relative;
 &::after {
  position: absolute;
  left: 0;
  top: 100%;
  width: 100%;
  height: $h;
  background: linear-gradient(135deg, transparent, transparent 45%, $color, transparent 55%, transparent 100%),
   linear-gradient(45deg, transparent, transparent 45%, $color, transparent 55%, transparent 100%);
  background-size: $h * 2 $h * 2;
  content: "";
 }
}
```

#### 20. 自动打字效果

```scss
<div class="bruce flex-ct-x" data-title="自动打字">
 <div class="auto-typing">Do You Want To Know More About CSS Development Skill</div>
</div>

@mixin typing($count: 0, $duration: 0, $delay: 0) {
 overflow: hidden;
 border-right: 1px solid transparent;
 width: #{$count + 1}ch;
 font-family: Consolas, Monaco, monospace;
 white-space: nowrap;
 animation: typing #{$duration}s steps($count + 1) #{$delay}s infinite backwards,
  caret 500ms steps(1) #{$delay}s infinite forwards;
}
.auto-typing {
 font-weight: bold;
 font-size: 30px;
 color: #09f;
 @include typing(52, 5);
}
@keyframes caret {
 50% {
  border-right-color: currentColor;
 }
}
@keyframes typing {
 from {
  width: 0;
 }
}
```
