import { config } from '../config.js'

let tips = {
    1: '抱歉，出现了一个错误',
    1000: '服务器请求错误'
}
class HTTP {
    constructor () {
        this.baseRestUrl = config.api_blink_url
    }
    request(params) {
        let that = this
        let url = this.baseRestUrl + params.url
        if(!params.method) {
            params.method = 'GET'
        }
        wx.request({
            url: url,
            data: params.data,
            method: params.method,
            success: function(res) {
                let code = res.data.code
                if (code == 0) {
                    params.success(res.data.data)
                } else {
                    this._show_error(res.data.code)
                }
            },
            fail: function (err) {
                this._show_error(1)
            }
        })
    }
    _show_error( error_code) {
        wx.showToast({
            title: tips[error_code],
            icon: 'none',
            duration: 2000
        })
    }
}

export { HTTP }