// components/map/index.js
Component({
	options: {
		multipleSlots: true
	},
	/**
	 * 组件的属性列表
	 */
	properties: {
		value: {
			type: String,
			value: ''
		},
		label: {
			type: String,
			value: '标签：'
		},
		// 是否显示必填*号
		required: {
			type: Boolean,
			value: false
		},
		// 占位符内容
		placeholder: {
			type: String,
			value: '请输入内容'
		},
		// 输入框类型
		type: {
			type: String,
			value: 'text'
		},
		// 占位符样式
		placeholderStyle: {
			type: String,
			value: ''
		},
		// 是否禁用
		disabled: {
			type: Boolean,
			value: false
		},
		// 是否为密码
		password: Boolean,
		// 输入框内容
		value: {
			type: String,
			value: '',
		},
		// 限制字数
		maxlength: {
			type: Number,
			value: -1,
		},
		foucs: Boolean,
		confirmType: String,
		height: {
			type: String,
			value: 300
		},
		autoHeight: Boolean,
		forceHeight: Boolean,
		fixed: Boolean,
		// 显示字数统计
		wordLimit: Boolean,
		error: String
	},
	/* 
	custom-class: 输入框根样式;
	label-class: 输入框左边标签样式;
	input-class: 输入框本身样式;

	textarea-class: 文本框本身样式;
	custom-class: 
	*/
	externalClasses: ["label-class", "input-class", "textarea-class", "custom-class", "error-class"],

	/**
	 * 组件的初始数据
	 */
	data: {

	},


	/**
	 * 组件的方法列表
	 */
	methods: {

		bindinput(e) {
			this.setData({
				value: e.detail.value
			})
			this.triggerEvent('input', e.detail.value)
		},
		bindconfirm(e) {
			this.triggerEvent('confirm', e.detail.value)
		},
		bindblur(e) {
			this.triggerEvent('blur', e.detail.value)
		},
		bindlinechange(e) {
			this.triggerEvent('linechange', e.detail)
		}
	}
})