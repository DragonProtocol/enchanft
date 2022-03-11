import log from 'loglevel'

log.info({ env: process.env.NODE_ENV })
export const isProd = process.env.NODE_ENV === 'production'

// explore 数据源
export const collections = isProd ? [] : ['Hkunn4hct84zSPNpyQygThUKn8RUBVf5b4r975NRaHPb']

export default {}
