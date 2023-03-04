import { BASE_URL } from '@/util/constants.js'

const setFileUrl = (url) => {
  const index = url.indexOf('/upload')
  if (index === -1) {
    return url
  }
  return `<a href='` + BASE_URL + url.substring(index)
}

const mixin = {
  methods: {
    setFiledContent({ label, field }) {
      if (label === '加班开始附件' || label === '加班结束附件') {
        return setFileUrl(field)
      } else if (label === '是否带车') {
        return field ? field : '不带车'
      } else {
        return field
      }
    }
  }
}

export default mixin