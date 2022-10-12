import React, { FC } from 'react';
import { HashRouter } from 'react-router-dom';


import Layout from './components/Layout';
import GlobalStyle from './GlobalStyle';

import { useGAPageView } from './hooks';
function AppLayout() {

  useGAPageView();

  return <Layout />;
}
const App: FC = () => {
  return (
    <>
      <GlobalStyle />
      <HashRouter>
        <AppLayout />
      </HashRouter>
    </>
  );
};

export default App;
