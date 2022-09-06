import React, { useState, useEffect } from 'react';

import bs58 from 'bs58';
import { Connection, clusterApiUrl } from '@solana/web3.js';

import { Provider as ReduxProvider } from 'react-redux';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AppProvider, useAppConfig } from './AppProvider';
import Header from './Components/Header';
import { ToastContainer } from 'react-toastify';

import LayoutMain from './Components/LayoutMain';
import LayoutProject from './Components/LayoutProject';
import PPList from './Pages/PPList';
import ProjectList from './Pages/ProjectList';
import ProjectNew from './Pages/ProjectNew';
import TaskNew from './Pages/TaskNew';

import 'react-toastify/dist/ReactToastify.css';
import { store } from './redux/store';
import NotFound from './Pages/NotFound';
import Account from './Pages/Account';

function App() {
  const { validLogin } = useAppConfig();
  if (!validLogin) {
    return (
      <div>
        <Header />
        <div>Connect Wallet First</div>
      </div>
    );
  }
  return (
    <div>
      <Header />
      <Routes>
        <Route path="/" element={<LayoutProject />}>
          <Route index element={<ProjectList />} />
          <Route path="project/new" element={<ProjectNew />} />
        </Route>
        <Route element={<LayoutMain />}>
          <Route path="project/:slug" element={<PPList />} />
          <Route path="project/:slug/task/new" element={<TaskNew />} />
          <Route path="account" element={<Account />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
      <ToastContainer autoClose={2000} position="top-right" />
    </div>
  );
}

export default function Providers() {
  return (
    <BrowserRouter>
      <ReduxProvider store={store}>
        <AppProvider>
          <App />
        </AppProvider>
      </ReduxProvider>
    </BrowserRouter>
  );
}
