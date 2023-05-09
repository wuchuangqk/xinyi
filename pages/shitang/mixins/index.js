import { BASE_URL } from '@/util/constants.js'

const mixin = {
  methods: {
    getFileUrl(url) {
      const match = url.match(/\/upload\/.+\.\w{2,4}/)
      if (!match) {
        return url
      }
      const path = match[0]
      return BASE_URL + path
    }
  }
}

export default mixin