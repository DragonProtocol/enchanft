/*
 * @Author:
 * @Date: 2022-07-01 15:09:50
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-08-25 16:42:45
 * @Description:
 */
import { Provider as ReduxProvider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import Layout from './components/layout/Index'
import { store } from './store/store'
import GlobalStyle from './GlobalStyle'
import { injectStore } from './request/axios'
import Appsignal from '@appsignal/javascript'
import { ErrorBoundary } from '@appsignal/react'

injectStore(store)
import './mock/index'
const appsignal = new Appsignal({
  key: process.env.APPSIGNAL_FRONTEND_API_KEY,
})

const FallbackComponent = () => <div>Uh oh! There was an error :(</div>

function App() {
  appsignal.demo()
  return (
    <ErrorBoundary instance={appsignal} tags={{ tag: 'value' }} fallback={(error) => <FallbackComponent />}>
      <ReduxProvider store={store}>
        <GlobalStyle />
        <BrowserRouter>
          <Layout />
        </BrowserRouter>
      </ReduxProvider>
    </ErrorBoundary>
  )
}

export default App
