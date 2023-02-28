import { BASE_URL } from './constants.js'
/**
 * Post请求，使用ajax传formData
 * @param {*} url 接口路径，以“/”开头
 * @param {*} data 
 * @param {*} axios
 */
export const doPost = (url, data, axios) => {
  return new Promise((resolve, reject) => {
    // 转成formData
    const formData = new FormData();
    for (const i in data) {
      formData.append(i, data[i]);
    }
    axios.post(BASE_URL + '/api' + url, formData).then(res => {
      // 兼容404
      if (res.status === 404) {
        reject({ status_code: '30000', msg: '请重新登录' })
      }
      try {
        const data = typeof (res.data) === 'string' ? JSON.parse(res.data) : res.data
        if (data.status_code === '200') {
          resolve(data)
        } else {
          reject({ status_code: data.status_code, msg: data.msg })
        }
      } catch (e) {
        console.log('util/post.js doPost 尝试转换JSON出错', e)
        reject({ status_code: '500', msg: '未知错误' })
      }
    }).catch(err => {
      console.log('util/post.js doPost 请求出错', err)
      reject({ status_code: '500', msg: '未知错误' })
    })
  })
}