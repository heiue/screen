import {HTTP} from '../utils/http.js'

class loginModels extends HTTP {
  getCountry(lCallback) {
    this.request({
      url: 'common/countryMobile/list',
      data: {
        appType:5
      },
      method: 'GET',
      success: function (res) {
        lCallback(res)
      }
    })
  }
}

export {loginModels}