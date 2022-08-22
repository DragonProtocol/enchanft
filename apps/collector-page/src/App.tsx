/*
 * @Author:
 * @Date: 2022-07-01 15:09:50
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-07-27 17:44:57
 * @Description:
 */
import { Provider as ReduxProvider } from 'react-redux'
import SolanaProvider from './providers/SolanaProvider'
import { Provider as SynftProvider } from '@ecnft/js-sdk-react'
import { BrowserRouter } from 'react-router-dom'
import Layout from './components/layout/Index'
import { store } from './store/store'
import GlobalStyle from './GlobalStyle'
import { injectStore } from './request/axios'
import Appsignal from "@appsignal/javascript";
import { ErrorBoundary } from "@appsignal/react";

injectStore(store)
import './mock/index'
const appsignal = new Appsignal({
  key: process.env.APPSIGNAL_FRONTEND_API_KEY
})

const FallbackComponent = () => (
  <div>Uh oh! There was an error :(</div>
)

function App() {
  appsignal.demo()
  return (
    <ErrorBoundary
      instance={appsignal}
      tags={{ tag: "value" }}
      fallback={(error) => <FallbackComponent />}
    >
      <SolanaProvider>
        <SynftProvider>
          <ReduxProvider store={store}>
            <GlobalStyle />
            <BrowserRouter>
              <Layout />
            </BrowserRouter>
          </ReduxProvider>
        </SynftProvider>
      </SolanaProvider>
    </ErrorBoundary>
  )
}

export default App
