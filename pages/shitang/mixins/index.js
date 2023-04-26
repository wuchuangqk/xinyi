import { BASE_URL } from '@/util/constants.js'

const mixin = {
  methods: {
    getFileUrl(url) {
      const match = url.match(/\/upload\/.+\.\w{2,4}/)
      if (!match) {
        return url
      }
      return 'http://58.218.148.154:8090' + match[0]
    }
  }
}

export default mixin