import {HTTP} from '../utils/http.js'

class indexModels extends HTTP{
    getIndexData(iCallback) {
        this.request({
            url: 'sapi/home/index',
            data: {
              dsp: 'msite',
              appType: 5
            },
            method: 'GET',
            success: (res) => {
                iCallback(res)
            }
          })
    }
}
export {indexModels}