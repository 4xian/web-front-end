/* 多视频上传 */
import { imgBaseUrl } from '@/utils/env'
type P = WechatMiniprogram.Component.PropertyOption
type M = WechatMiniprogram.Component.MethodOption
interface V {
  oldList: string[]
  uploadList: string[]
  allList: string[]
  isUpdate: boolean
}
Component<V, P, M>({
  properties: {
    // 上传最大数量
    max: {
      type: Number,
      value: 3,
    },
    //
    videoSize: {
      type: Number,
      value: 20,
    },
    // 视频列表
    videoList: {
      type: Array,
      value: [],
    },
    videoWidth: {
      type: Number,
      value: 332,
    },
    videoHeight: {
      type: Number,
      value: 197,
    },
    duration: {
      type: Number,
      value: 60,
    },
    // 上传视频默认图
    uploadImg: {
      type: String,
      //   value: `${getApp().globalData.baseUrl}/shop-manage/shangchuantupian@2x.png`,
      value: `../../images/upload-video-icon.png`,
    },
  },
  observers: {
    videoList: function (pre) {
      if (pre.length > 0) {
        this.setData({ oldList: pre, allList: pre })
      }
    },
  },
  data: {
    oldList: [], // 已经上传
    uploadList: [], // 待上传的视频列表
    allList: [], // 待上传+ 已经上传
    isUpdate: false, // 是否上传视频
  },
  methods: {
    chooseVideo() {
      const that = this
      const { videoSize, allList, max, oldList, duration } = this.data
      if (allList.length < max) {
        wx.chooseVideo({
          sourceType: ['album', 'camera'],
          maxDuration: duration,
          camera: 'back',
          compressed: true,
          success(res) {
            const { tempFilePath, size } = res
            const videoFileSize = size / 1024 / 1024
            if (videoFileSize > videoSize) {
              wx.showToast({
                title: `请上传小于${videoSize}M的视频`,
                icon: 'none',
              })
            } else {
              that.setData({
                isUpdate: true,
                uploadList: [...that.data.uploadList, tempFilePath],
              })
              that.setData({
                allList: [...that.data.oldList, ...that.data.uploadList],
              })
            }
          },
          fail(err) {
            console.log(err)
          },
        })
      } else {
        wx.showToast({
          title: `上传数量已超最大限制`,
          icon: 'none',
        })
      }
    },

    async uploadFile() {
      const that = this
      const { uploadList, isUpdate } = that.data
      const funcArr: Promise<string>[] = []
      wx.showLoading({
        title: '正在上传视频',
        mask: true,
      })
      const uploadTask = (url: string) => {
        return new Promise<string>((resolve, reject) => {
          wx.uploadFile({
            url: `${imgBaseUrl}/oss/file/uploadFile`,
            filePath: url,
            name: 'file',
            header: {},
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

      if (isUpdate && uploadList.length) {
        uploadList.forEach((v) => {
          funcArr.push(uploadTask(v))
        })
        const temp = await Promise.all(funcArr),
          tempList = temp.map((v) => {
            return JSON.parse(v).data
          })
        wx.showToast({
          title: `视频上传成功`,
          icon: 'none',
        })
        return [...this.data.oldList, ...tempList]
      } else {
        wx.hideLoading()
        return [...this.data.oldList]
      }
    },

    deleteVideo(e: { currentTarget: { dataset: { item: string } } }) {
      const { uploadList, oldList } = this.data
      const value = e.currentTarget.dataset.item
      const tempUpload = uploadList.filter((item: string) => item !== value)
      const tempOld = oldList.filter((item: string) => item !== value)
      this.setData({ allList: [...tempOld, ...tempUpload], uploadList: tempUpload, oldList: tempOld })
    },
  },
})
