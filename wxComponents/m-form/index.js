// components/m-form/index.js
import AsyncValidator from 'async-validator'
Component({
	options: {
		multipleSlots: true
	},
	/**
	 * 组件的属性列表
	 */
	properties: {
		// 验证规则
		rules: Object,
		// 源数据
		data: Object,
		// 是否用微信提示框提示错误信息
		errorModal: {
			type: Boolean,
			value: true
		}
	},
	externalClasses: ["form-class"],

	/**
	 * 组件的初始数据
	 */
	data: {},

	/**
	 * 组件的方法列表
	 */
	methods: {
		validate() {
			const {
				data,
				rules,
				errorModal,
			} = this.data;
			const rulesName = Object.keys(rules),
				validator = new AsyncValidator(rules)
			return new Promise((resolve, reject) => {
				validator.validate(data, (errors, fields) => {
					if (errors) {
						let msg = '',
							obj = {}
						for (const t of rulesName) {
							obj = errors.find(v => v.field === t)
							if (obj) {
								msg = obj.message
								reject(obj)
								break
							}
						}
						// show wx modal
						if (errorModal) {
							wx.showToast({
								title: msg,
								icon: 'none'
							})
						}
					}
					resolve(fields)
				})
			})
		},

		// 重置表单
		resetFields(that) {
			if (that) {
				const propertyName = Object.keys(this.data.data)
				propertyName.forEach(item => {
					that.setData({
						[item]: ''
					})
				});
			} else throw Error('请传入当前页面实例this')

		}
	}
})