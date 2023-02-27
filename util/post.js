import { BASE_URL } from './constants.js'
/**
 * Post请求，使用ajax传formData
 * @param {*} url 接口路径，以“/”开头
 * @param {*} data 
 * @param {*} axios
 * @param {*} files 文件
 */
export const doPost = (url, data, axios, files = []) => {
  // 转成formData
  const formData = new FormData();
  for (const i in data) {
    formData.append(i, encodeURIComponent(data[i]));
  }
  files.forEach(file => {
    console.log(file.file)
    formData.append('file', file.file);
  })
  console.log(formData.entries(), files)
  // return axios.post(BASE_URL + url, formData)
  return axios.post('http://localhost:4091/upload', formData)
}