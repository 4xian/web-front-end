{
  /* <m-form id="form" rules="{{rules}}" data="{{data}}" message="{{messages}}">
						<m-input required label="用户名：" model:value="{{name}}"  placeholder="输入内容吧~" error="{{error.name}}">
						</m-input>
						<m-input required label="手机号码：" model:value="{{phone}}"  placeholder="输入内容吧~" error="{{error.phone}}">
						</m-input>
						<m-input required label="邮箱：" model:value="{{email}}"  placeholder="输入内容吧~" error="{{error.email}}">
						</m-input>
						<m-input required type="textarea" label="标签(必填)：" model:value="{{mValue}}" placeholder="输入内容吧~" height="200" wordLimit maxlength="10" error="{{error.mValue}}">
						</m-input>
						<button bindtap="submit">提交</button>
	</m-form> */
}

// 验证规则
const rules = {
  name: {
    required: true,
  },
  phone: {
    required: true,
    tel: true,
  },
  email: {
    required: true,
    email: true,
  },
}

// 错误时提示信息
const messages = {
  name: {
    required: '请输入用户名',
  },
  phone: {
    required: '请输入手机号',
    tel: '请输入正确的手机号',
  },
  email: {
    required: '请输入邮箱',
    email: '请输入正确的邮箱',
  },
}

// 字段数据
const data = {
  name: '',
  phone: '',
  email: '',
}

Page({
  data: {
    errorMsg: {},
  },
})

// 提交表单验证
function sumbit() {
  const form = this.selectComponent('#form')
  // 1. 下方红字文字提示:
  // form.validate(this, 'errorMsg').then(res => {
  //
  // 2. 默认微信toast提示:
  form
    .validate()
    .then((res) => {
      console.log('验证成功!')

      // 模拟请求接口返回后重置表单
      setTimeout(() => {
        form.reset(this, ['name', 'phone', 'email'])
      }, 2000)
    })
    .catch((err) => {
      // 自定义微信toast提示
      wx.showToast({
        title: err,
        icon: 'none',
      })
    })
}
