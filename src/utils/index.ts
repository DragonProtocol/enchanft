import log from 'loglevel'

log.info({ env: process.env.NODE_ENV })

// TODO: 上生产接主网后改正
export const isProd = false // process.env.NODE_ENV === 'production'
export const logIsProd = process.env.NODE_ENV === 'production'

// explore 数据源
export const collections = isProd
  ? []
  : ['Hkunn4hct84zSPNpyQygThUKn8RUBVf5b4r975NRaHPb', 'HEBHYYx7qj9sveZKJLx3i3d9Tev2taWvErWGFsm7425n']

export default {}
