'use strict';
export const host = 'https://api.gojbcs.com/api';
const app = getApp();
// var util = require('util.js');

function _post_(url, params, callback) {
  wx.request({
    url: host + url,
    method: 'POST',
    data: params,
    header: {
      'content-type': 'application/json'
    },
    success: (res) => {
      callback(res)
    },
    fail: (err) => {
      console.log(err)
    }
  })
}

function _get_(url, callback, check_login) {
  wx.request({
    url: host + url,
    method: 'GET',
    header: {
      "content-type": "application/json;charset=UTF-8"
    },
    success: (res) => {
      if (!wx.getStorageSync('token') && check_login){
        app.doLogin()
      }
      callback(res)
    },
    fail: (err) => {
      wx.redirectTo({
        url: '../register/index'　　// 
      })
    }
  })
}

function _del_(url,params, callback) {
  wx.request({
    url: host + url,
    data: params,
    method: 'DELETE',
    header: {
      "content-type": "application/json;charset=UTF-8",
      'X-HTTP-Method-Override': "DELETE"
    },
    success: (res) => {
      if (res.header['x-token']) {
        wx.setStorageSync('token', res.header['x-token']);
      }
      callback(res)
    },
    fail: (err) => {
      console.log(err)
    }
  })
}

module.exports = {
  post: _post_,
  get: _get_,
  del: _del_
}