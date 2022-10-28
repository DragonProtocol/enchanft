/*
 * @Author:
 * @Date: 2022-07-01 15:09:50
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-10-27 17:40:46
 * @Description:
 */
import { Provider as ReduxProvider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import Layout from './components/layout/Index'
import { store } from './store/store'
import GlobalStyle from './GlobalStyle'
import { injectStore, injectWlUserReactContextValue, injectHandleAxiosResponse401 } from './request/axios'
import Appsignal from '@appsignal/javascript'
import { ErrorBoundary } from '@appsignal/react'
import { setApiBaseUrl } from '@ecnft/wl-user-core'
import { WlUserReactProvider, handleAuthFailed } from '@ecnft/wl-user-react'
import { signers } from './utils/wlUserReact'
import { API_BASE_URL } from './constants'
injectStore(store)
setApiBaseUrl(API_BASE_URL || '')
injectHandleAxiosResponse401(handleAuthFailed)
const appsignal = new Appsignal({
  key: process.env['APPSIGNAL_FRONTEND_API_KEY'],
})
const FallbackComponent = () => <div>Uh oh! There was an error :(</div>

function App() {
  appsignal.demo()
  return (
    <ErrorBoundary instance={appsignal} tags={{ tag: 'value' }} fallback={() => <FallbackComponent />}>
      <WlUserReactProvider signers={signers} valueChange={(value) => injectWlUserReactContextValue(value)}>
        <ReduxProvider store={store}>
          <GlobalStyle />
          <BrowserRouter>
            <Layout />
          </BrowserRouter>
        </ReduxProvider>
      </WlUserReactProvider>
    </ErrorBoundary>
  )
}

export default App
