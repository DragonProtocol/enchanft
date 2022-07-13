/*
 * @Author:
 * @Date: 2022-07-01 15:09:50
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-07-11 09:03:50
 * @Description:
 */
import { Provider as ReduxProvider } from 'react-redux'
import SolanaProvider from './providers/SolanaProvider'
import { Provider as SynftProvider } from '@ecnft/js-sdk-react'
import { HashRouter } from 'react-router-dom'
import Layout from './components/layout/Index'
import { store } from './store/store'
import GlobalStyle from './GlobalStyle'
import { injectStore } from './request/axios'
injectStore(store)
import './mock/index'
function App() {
  return (
    <SolanaProvider>
      <SynftProvider>
        <ReduxProvider store={store}>
          <GlobalStyle />
          <HashRouter>
            <Layout />
          </HashRouter>
        </ReduxProvider>
      </SynftProvider>
    </SolanaProvider>
  )
}

export default App
