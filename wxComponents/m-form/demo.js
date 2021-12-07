{
	// 方式1
	/* <m-form id="form" rules="{{rules}}" data="{{formData}}" >
						<m-input required label="用户名：" model:value="{{name}}" custom-class="custom-input"
							input-class="inputClass">
						</m-input>
						<m-input required label="手机号码：" model:value="{{phone}}" custom-class="custom-input"
							input-class="inputClass">
						</m-input>
						<m-input type="textarea" required label="标签：" model:value="{{mValue}}" height="200" wordLimit
							maxlength="10">
						</m-input>
						<button bindtap="submit">提交</button>
					</m-form> */
	// 方式2 
	/* <m-form id="form" rules="{{rules}}" data="{{formData}}" errorModal="{{false}}">
						<m-input required label="用户名：" model:value="{{name}}" custom-class="custom-input"
							input-class="inputClass" error="{{error.name}}">
						</m-input>
						<m-input required label="手机号码：" model:value="{{phone}}" custom-class="custom-input"
							input-class="inputClass" error="{{error.phone}}">
						</m-input>
						<m-input type="textarea" required label="标签：" model:value="{{mValue}}" height="200" wordLimit
							maxlength="10" error="{{error.mValue}}">
						</m-input>
						<button bindtap="submit">提交</button>
					</m-form> */
}

/* 
 * 使用前需npm安装 async-validator 并构建npm
 * npm i async-validator
 */

// 验证规则(同ant design)
const rules = {
	name: [{
		required: true,
		message: '请输入用户名',
	}, {
		validator: (_, value) => {
			if (value.length <= 5) return Promise.resolve()
			else return Promise.reject('用户名最多5个字符')
		}
	}],
	phone: [{
		required: true,
		message: '请输入手机号码',

	}, {
		validator: (_, value) => {
			if (validPhone(value)) return Promise.resolve()
			else return Promise.reject('请输入正确的手机号码')
		}
	}],
	mValue: {
		required: true,
		message: '请输入标签'
	},
}


Page({
	data: {
		// 表单数据
		formData: {},
		name: '',
		phone: '',
		mValue: '',
		// 输入框下方提示错误信息
		error: {}
	}
})


// 提交表单验证
function sumbit() {
	const {
		name,
		phone,
		mValue
	} = this.data
	// (小程序无法双向绑定对象数据 如：formData.name，只能单个数据如：name, 校验前先把单个数据统一放到formData中)
	this.setData({
		formData: {
			name,
			phone,
			mValue
		},
		// 若使用输入框下方提示信息，则该项需要重置
		error: {},
	})
	const form = this.selectComponent('#form');
	// 1. 默认微信toast提示: 若不想可将errorModal设为false, 即可使用方式2自定义错误提示
	form.validate().then(fields => {
		// 验证通过，返回表单最新数据
		console.log(fields);

		// 重置表单(传入当前页面实例this)
		setTimeout(() => {
			form.resetFields(this);
		}, 2000)
	}).catch(err => {
		// 2. 自定义错误提示 
		console.log(err);
		const {
			field,
			message
		} = err
		// 使用输入框下方提示信息需添加此段
		this.setData({
			[`error.${field}`]: message
		})
	})
}