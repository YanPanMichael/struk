import bxios from '@bilibili-live/bxios'
bxios.defaults.baseURL = 'https://api.live.bilibili.com'

export const getGuildInfo = () => {
  return bxios.get('/xlive/mcn-interface/v1/homePage/CenterEntryIsShow')
}
