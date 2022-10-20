/*
 * @Author:
 * @Date: 2022-07-01 15:09:50
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-10-20 17:06:15
 * @Description:
 */
import { Provider as ReduxProvider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import Layout from './components/layout/Index'
import { store } from './store/store'
import GlobalStyle from './GlobalStyle'
import { injectStore, injectWlUserContextValue, injectHandleAxiosResponse401 } from './request/axios'
import Appsignal from '@appsignal/javascript'
import { ErrorBoundary } from '@appsignal/react'
import { WlUserReactProvider, handleAxiosResponse401, setApiBaseUrl } from '../../../libs/wl-user-react/core/src'
import { signers } from './utils/wlUserReact'
import './mock/index'
import { API_BASE_URL } from './constants'
injectStore(store)
injectHandleAxiosResponse401(handleAxiosResponse401)
setApiBaseUrl(API_BASE_URL || '')
const appsignal = new Appsignal({
  key: process.env.APPSIGNAL_FRONTEND_API_KEY,
})

const FallbackComponent = () => <div>Uh oh! There was an error :(</div>

function App() {
  appsignal.demo()
  return (
    <ErrorBoundary instance={appsignal} tags={{ tag: 'value' }} fallback={(error) => <FallbackComponent />}>
      <WlUserReactProvider signers={signers} valueChange={(value) => injectWlUserContextValue(value)}>
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
