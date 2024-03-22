import request from '@/utils/request'
import { encrypt } from '@/utils/jsencrypt'


// 登录方法
export function login(phone, code, salesUserId, openId) {
  const data = {
    phone,
    code,
    salesUserId,
    openId
  }
  return request({
    'url': '/custom/wechat/login',
    headers: {
      isToken: false
    },
    'method': 'post',
    'data': data
  })
}

// 获取用户详细信息
export function getInfo() {
  return request({
    'url': '/getInfo',
    'method': 'get'
  })
}

// 退出方法
export function logout() {
  return request({
    'url': '/logout',
    'method': 'post'
  })
}

// 获取验证码
export function getCodeImg() {
  return request({
    'url': '/captchaImage',
    headers: {
      isToken: false
    },
    method: 'get',
    timeout: 20000
  })
}

// 获取验证码
export function getCodeSms(params) {
  return request({
    'url': '/custom/wechat/sendSms',
    headers: {
      isToken: false
    },
    method: 'get',
    timeout: 20000,
    params
  })
}