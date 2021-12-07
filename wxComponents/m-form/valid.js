// components/m-form/index.js
import Validate from './validate'
Component({
	options: {
		multipleSlots: true
	},
	/**
	 * 组件的属性列表
	 */
	properties: {
		rules: Object,
		data: Object,
		message: Object

	},
	externalClasses: ["form-class"],

	/**
	 * 组件的初始数据
	 */
	data: {
	},

	lifetimes: {
	},

	/**
	 * 组件的方法列表
	 */
	methods: {
		_initValid() {
			const {
				rules,
				message,

			} = this.data;
			this.formValidate = new Validate(rules, message)
		},

		validate(that,errorFlag) {
			this._initValid();
			const {
				data
			} = this.data;
			return new Promise((resolve, reject) => {
				if (!this.formValidate.checkForm(data)) {
					const error = this.formValidate.errorList[0];
					if(errorFlag){
						that.setData({
							[errorFlag]:{
								[`${error.param}`]: error.msg
							} 
						});
					}
					reject(error)
				} else {
					if(errorFlag){
						that.setData({
							[errorFlag]: {} 
						});
					}
					resolve(true)
				}
				
			})

		},

		// 重置表单
		reset(that, arr){
			arr.forEach(item => {
				that.setData({
					[item]: ''
				})
			});
		}
	}
})