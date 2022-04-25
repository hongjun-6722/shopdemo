import axios from 'axios'
let http = axios.create({
    baseURL: process.env.API,
    withCredentials: true,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
    },
    transformRequest: [function (data) {
      let newData = '';
      for (let k in data) {
        if (data.hasOwnProperty(k) === true) {
          newData += encodeURIComponent(k) + '=' + encodeURIComponent(data[k]) + '&';
        }
      }
      return newData;
    }]
  });
  
async function apiAxios(method, url, params) {
    var obj = await http({
      method: method,
      url: url,
      data: method === 'POST' || method === 'PUT' ? params : null,
      params: method === 'GET' || method === 'DELETE' ? params : null,
    }).then(function (res) {
      // console.log(res)
      return res
    }).catch(function (err) {
      // console.log(err)
      return err
    })
    return obj
  }

const axiosAPI = {
  get(url, params){
    return apiAxios('GET', url, params)
  },
  post(url, params){
    return  apiAxios('POST', url, params)
  }
}

export default axiosAPI
    // post: function (url, params, response) {
    //   return apiAxios('POST', url, params, response)
    // },
    // put: function (url, params, response) {
    //   return apiAxios('PUT', url, params, response)
    // },
    // delete: function (url, params, response) {
    //   return apiAxios('DELETE', url, params, response)
    // }
  
