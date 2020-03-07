import axios from 'axios'

axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1'
axios.defaults.timeout = 5000

export function request (url, params) {
  return new Promise((resolve, reject) => {
    axios.get(url, {
      params: params
    }).then(res => {
      resolve(res.data)
    }).catch(err => {
      reject(err.data)
    })
  })
}

export function fetchPost (url, params) {
  axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1'
  axios.defaults.timeout = 5000
  return new Promise((resolve, reject) => {
    axios.post(url, params)
      .then(res => {
        resolve(res.data)
      }).catch(err => {
        reject(err)
      })
  })
}
export function putModify (url, data = {}) {
  return new Promise((resolve, reject) => {
    axios.put(url, data)
      .then(res => {
        resolve(res.data)
      }).catch(err => {
        reject(err)
      })
  })
}
export function deleteModify (url, data = {}) {
  return new Promise((resolve, reject) => {
    axios.delete(url, data)
      .then(res => {
        resolve(res.data)
      }).catch(err => {
        reject(err)
      })
  })
}
// 请求拦截器
/* 在request中展示进度条Nprogress.start() */
axios.interceptors.request.use(config => {
  // 拦截后需要将拦截下来的请求数据返回发送
  // 使用方面：1-比如config中一些信息不符合服务器要求，需要请求拦截进行某种变化之后在给服务器传过去
  // 2-每次发送请求的时候都希望在界面中显示一个请求中的图片 （当在请求的的时候把图片显示出来，当请求成功
  // 的时候在响应拦截器里面隐藏掉）
  // 3-某些网络请求比如(登录 token)必须携带一些特殊的信息
  console.log(config)
  // Authorization这样有权限的api就可以正常调用了
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
// 响应拦截器
/* 在response中隐藏进度条 Nprogress.done() */
axios.interceptors.response.use(config => {
  // 拦截后需要将拦截下来处理成的结果返回

  return config
})
