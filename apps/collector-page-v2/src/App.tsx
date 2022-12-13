/*
 * @Author:
 * @Date: 2022-07-01 15:09:50
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-11-30 16:48:10
 * @Description:
 */
import { Provider as ReduxProvider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import Modal from 'react-modal';
import Appsignal from '@appsignal/javascript';
import { ErrorBoundary } from '@appsignal/react';
import {
  WlUserReactProvider,
  handleAuthFailed,
  setApiBaseUrl,
} from '@ecnft/wl-user-react';
import Layout from './components/layout/Index';
import { store } from './store/store';
import GlobalStyle from './GlobalStyle';

import { authorizers } from './utils/wlUserReact';
import { API_BASE_URL } from './constants';
import {
  injectHandleAxiosResponse401,
  injectStore,
  injectWlUserReactContextValue,
} from './services/api/request';

injectStore(store);
setApiBaseUrl(API_BASE_URL || '');
injectHandleAxiosResponse401(handleAuthFailed);
const appsignal = new Appsignal({
  key: process.env.APPSIGNAL_FRONTEND_API_KEY,
});
function FallbackComponent() {
  return <div>Uh oh! There was an error :(</div>;
}

Modal.setAppElement('#root');
function App() {
  appsignal.demo();
  return (
    <ErrorBoundary
      instance={appsignal}
      tags={{ tag: 'value' }}
      fallback={() => FallbackComponent}
    >
      <WlUserReactProvider
        authorizers={authorizers}
        valueChange={(value) => injectWlUserReactContextValue(value)}
      >
        <ReduxProvider store={store}>
          <GlobalStyle />
          <BrowserRouter>
            <Layout />
          </BrowserRouter>
        </ReduxProvider>
      </WlUserReactProvider>
    </ErrorBoundary>
  );
}

export default App;
