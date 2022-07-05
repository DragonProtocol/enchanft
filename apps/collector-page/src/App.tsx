/*
 * @Author:
 * @Date: 2022-07-01 15:09:50
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-07-04 17:01:08
 * @Description:
 */
import { Provider as ReduxProvider } from 'react-redux'
import SolanaProvider from 'providers/SolanaProvider'
import { Provider as SynftProvider } from '@enchanft/js-sdk-react'
import { BrowserRouter } from 'react-router-dom'
import Layout from 'components/layout/Index'
import { store } from './store/store'
import GlobalStyle from './GlobalStyle'
import './mock/index'

function App() {
  return (
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
  )
}

export default App