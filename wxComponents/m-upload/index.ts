import { imgBaseUrl } from '@/utils/env'
interface UP {
  uploadList: string[]
  imgList: string[]
  baseUrl: string
  oldList: string[]
}

Component<UP, APPLET.TWO, APPLET.THREE>({
  properties: {
    maxSize: {
      type: Number,
      value: 9,
    },
    imgSize: {
      type: Number,
      value: 5,
    },
    editImages: {
      type: Array,
      value: [],
    },
    imgWidth: {
      type: Number,
      value: 197,
    },
    imgHeight: {
      type: Number,
      value: 197,
    },
    imgUrl: {
      type: String,
      value: `${getApp().globalData.baseUrl}/shop-manage/shangchuantupian@2x.png`,
    },
  },
  observers: {
    editImages: function (pre) {
      if (pre.length > 0) {
        this.setData({ oldList: pre, imgList: pre })
      }
    },
  },
  data: {
    baseUrl: getApp().globalData.baseUrl,
    uploadList: [],
    oldList: [],
    imgList: [],
  },
  methods: {
    handleUpload() {
      const { maxSize, imgSize } = this.data
      const that = this
      wx.chooseImage({
        count: maxSize - that.data.oldList.length - that.data.uploadList.length,
        sizeType: ['original', 'compressed'],
        sourceType: ['album', 'camera'],
        success(res) {
          const { tempFilePaths, tempFiles } = res
          if (!that.validateSize(tempFiles)) {
            wx.showToast({ title: `图片不能超过${imgSize}MB`, icon: 'none' })
          } else {
            that.setData({
              uploadList: [...that.data.uploadList, ...tempFilePaths],
            })
            that.setData({
              imgList: [...that.data.oldList, ...that.data.uploadList],
            })
          }
        },
      })
    },

    validateSize(data: Array<{ path: string; size: number }>): boolean {
      const { imgSize } = this.data
      return data
        .map((item) => {
          return {
            ...item,
            size: item.size / 1024 / 1024,
          }
        })
        .every((item) => item.size <= imgSize)
    },

    handleView(e: APPLET.E<{ item: string }>) {
      const { imgList } = this.data
      const item = e.currentTarget.dataset.item
      wx.previewImage({
        current: item,
        urls: imgList,
      })
    },

    handleDelete(e: APPLET.E<{ item: string }>) {
      const { uploadList, oldList } = this.data
      const value = e.currentTarget.dataset.item
      const tempUpload = uploadList.filter((item: string) => item !== value)
      const tempOld = oldList.filter((item: string) => item !== value)
      this.setData({ imgList: [...tempOld, ...tempUpload], uploadList: tempUpload, oldList: tempOld })
    },

    onTap() {
      this.uploadPromise()
    },

    async uploadPromise() {
      const p_arr: Promise<string>[] = []
      const { uploadList } = this.data
      const new_p = (nowUrl: string) => {
        return new Promise<string>((resolve, reject) => {
          wx.uploadFile({
            url: `${imgBaseUrl}/oss/file/uploadFile`,
            filePath: nowUrl,
            name: 'file',
            formData: {},
            success(res) {
              resolve(res.data)
            },
            fail(err) {
              reject(err)
            },
            complete() {
              wx.hideLoading()
            },
          })
        })
      }
      wx.showLoading({
        title: '正在上传',
        mask: true,
      })

      if (uploadList.length) {
        uploadList.forEach((_: string, index: number) => {
          const nowUrl = uploadList[index]
          p_arr.push(new_p(nowUrl))
        })
        const tempArr = await Promise.all(p_arr),
          tempList = tempArr.map((v) => {
            return JSON.parse(v).data
          })
        return [...this.data.oldList, ...tempList]
      } else {
        wx.hideLoading()
        return [...this.data.oldList]
      }
    },

    clear() {
      this.setData({
        uploadList: [],
      })
    },
  },
})
