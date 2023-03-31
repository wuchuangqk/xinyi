const mixin = {
  methods: {
    setFiledContent({ label, field }) {
      if (label === '是否带车') {
        return field ? field : '不带车'
      } else {
        return field
      }
    },
    getRelativePath(url) {
      const match = url.match(/\/upload\/.+\.\w{2,4}'> <img/)
      if (!match) {
        return [{ fileurl: '' }]
      }
      const path = match[0]
      const placeholderLength = "'> <img".length
      return [{ fileurl: path.substring(0, path.length - placeholderLength) }]
    },
    isFileUrl(label) {
      return label === '加班开始附件' || label === '加班结束附件'
    }
  }
}

export default mixin