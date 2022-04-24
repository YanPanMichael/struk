import axios from 'axios'
axios.defaults.baseURL = 'https://api.test.com'

export const getGuildInfo = () => {
  return axios.get('/aa/vv/inferface/v1/homePage/CenterEntryIsShow')
}
