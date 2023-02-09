import sryptoJs from 'crypto-js';
import { storageKeys } from './constants.js'

const SECERET_KEY = 'com.8bpm.yuansong.keys.2020.05.89' // 加密参数
const BASE_URL = 'https://36q635g350.zicp.fun/api/v2'

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
      url: BASE_URL + url + queryString,
      method: 'GET',
      success: (res) => {
        if (res.data.status_code === '200') {
          resolved(res.data)
        } else {
          handleError(res.data, rejected)
        }
      },
      fail: (err) => {
        rejected(err)
      }
    })
  })
}

/**
 * Post请求，使用ajax传formData
 * @param {*} url 接口路径，以“/”开头
 * @param {*} data 
 * @param {*} axios
 * @param {*} files 文件
 */
export const doPost = (url, data, axios, files = []) => {
  const token = uni.getStorageSync(storageKeys.TOKEN)
  if (token) {
    data.access_token = token
  }

  // 添加时间戳
  data.timestamp = new Date().getTime() + '';
  // 加密参数
  const signature = hamcsha1(sortParams(data), SECERET_KEY);
  data.signature = signature;

  // 转成formData
  const formData = new FormData();
  for (const i in data) {
    formData.append(i, encodeURIComponent(data[i]));
  }
  files.forEach(file => {
    formData.append('file', file.file);
  })

  return axios.post(BASE_URL + url, formData)
}

const handleError = (res, rejected) => {
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
    default:
      rejected(res)
  }
}