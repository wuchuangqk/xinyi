import sryptoJs from 'crypto-js';
import { storageKeys, BASE_URL } from './constants.js'

const SECERET_KEY = 'com.8bpm.yuansong.keys.2020.05.89' // 加密参数

const sortAndEncrypt = (paramValues, SECERET_KEY) => {
  let paramsStr = sortParams(paramValues);
  const signature = hamcsha1(paramsStr, SECERET_KEY);
  paramsStr += '&signature=' + encodeURIComponent(signature);
  return paramsStr;
}

/**
 * 签名
 */
const hamcsha1 = (plaintext, SECERET_KEY) => {
  const ciphertext = sryptoJs.HmacSHA1(plaintext, SECERET_KEY);
  return sryptoJs.enc.Base64.stringify(ciphertext);
}

/**
 * 参数排序
 */
const sortParams = (params) => {
  const keys = [];
  for (const item in params) {
    keys.push(item);
  }
  // 1排序key
  keys.sort((a, b) => {
    if (a > b) {
      return 1;
    } else if (a < b) {
      return -1;
    } else {
      return 0;
    }
  });

  let finalStr = '';
  let length = keys.length;
  let i = 0;
  for (const key of keys) {
    const value = encodeURIComponent(params[key]);
    finalStr += key + '=' + value;
    if (i < length - 1) {
      finalStr += '&';
    }
    i++;
  }
  return finalStr;
}

export const setPostData = (data) => {
  const token = uni.getStorageSync(storageKeys.TOKEN)
  if (token) {
    data.access_token = token
  }

  // 添加时间戳
  data.timestamp = new Date().getTime() + '';
  // 加密参数
  const signature = hamcsha1(sortParams(data), SECERET_KEY);
  data.signature = signature;
  return data
}

/**
 * Get请求，使用uni.request
 * @param {*} url 接口路径，以“/”开头
 * @param {*} data 
 * @returns 
 */
export const doGet = (url, data = {}) => {
  return new Promise((resolved, rejected) => {
    const token = uni.getStorageSync(storageKeys.TOKEN)
    if (token) {
      data.access_token = token
    }
    data.timestamp = new Date().getTime() + ''
    const queryString = '?' + sortAndEncrypt(data, SECERET_KEY)
    uni.request({
      url: BASE_URL + '/api' + url + queryString,
      method: 'GET',
      success: (res) => {
        // 404兼容处理
        if (res.statusCode === 404) {
          handleError({ status_code: '30000', msg: '请重新登录' }, rejected)
          return
        }
        if (res.statusCode === 200 && res.data.MessageDetail) {
          handleError({ status_code: '30000', msg: '请重新登录' }, rejected)
          return
        }
        // 处理正常返回的结果
        const data = res.data
        if (data.status_code === '200') {
          resolved(data)
        } else {
          handleError(data, rejected)
        }
      },
      fail: (err) => {
        uni.showToast({
          title: '未知错误',
          icon: 'none'
        });
        console.log('util/request.js doGet uni.request:fail回调', err)
        rejected(err)
      }
    })
  })
}

export const doPost = (url, data, files = []) => {
  return new Promise((resolve, rejected) => {
    uni.uploadFile({
      url: BASE_URL + '/api' + url,
      files: files.map((val, index) => {
        return {
          name: 'file' + index,
          uri: val.url
        }
      }),
      formData: setPostData(data),
      success(res) {
        if (res.statusCode === 404) {
          handleError({ status_code: '30000', msg: '请重新登录' }, rejected)
          return
        }
        try {
          res.data = typeof (res.data) === 'string' ? JSON.parse(res.data) : res.data
          if (res.data.status_code === '200') {
            resolve(res.data)
          } else {
            console.log('util/request.js doPost 接口返回失败信息', res.data)
            handleError(res.data, rejected)
          }
        } catch (e) {
          console.log('util/request.js doPost 尝试转换JSON出错', e)
          handleError({ status_code: '500', msg: '未知错误' }, rejected)
        }
      },
      fail(err) {
        console.log('util/request.js doPost uni.request:fail回调', err)
        rejected(err)
      },
      complete() {
        uni.hideLoading();
      }
    })
  })
}

export const handleError = (res, rejected) => {
  switch (res.status_code) {
    // 授权已过期
    case '30000':
      uni.showToast({
        title: res.msg,
        icon: 'none'
      });
      uni.setStorageSync(storageKeys.IS_LOGIN, 0)
      uni.removeStorageSync(storageKeys.TOKEN)
      uni.removeStorageSync(storageKeys.USER_INFO)
      uni.reLaunch({
        url: '/pages/login/login'
      });
      break
    // 其他错误，例如缺少必填字段等
    default:
      uni.showToast({
        title: res.msg,
        icon: 'none'
      });
      if (rejected) {
        rejected(res)
      }
  }
}