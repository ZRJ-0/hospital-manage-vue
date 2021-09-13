'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  //   定义开发环境下后端api接口的主机地址
  //   BASE_API: '"https://easy-mock.com/mock/5950a2419adc231f356a6636/vue-admin"',
  BASE_API: '"http://localhost"',
  //   BASE_API: '"http://192.168.208.129:9001"', //  访问虚拟机的nginx转发到对应的服务地址
})