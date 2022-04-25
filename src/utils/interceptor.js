import axios from 'axios'
// axios.defaults.baseURL = '/api'
axios.interceptors.request.use(function (config) {
    let token = localStorage.getItem('mytoken')
    if (token) {
      config.headers['Authorization'] = token
    }
    return config
})