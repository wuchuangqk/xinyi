import { BASE_URL } from '@/util/constants.js'

const mixin = {
  methods: {
    getFileUrl(url) {
      if (url.startsWith('http://192.168.0.5:8326')) {
        return url.replace('http://192.168.0.5:8326', BASE_URL)
      } else {
        return url
      }
    }
  }
}

export default mixin