import axios from 'axios'
export default function request(config) {
  const instance = axios.create({
    baseURL: 'http://localhost:9001'
  })
  instance.interceptors.request.use(
    config => {
      return config
    },
    err => {
      console.log(err)
    }
  )
  instance.defaults.withCredentials = true
  instance.interceptors.response.use(
    res => {
      return res
    },
    err => {
      console.log(err)
    }
  )
  return instance(config)
}
