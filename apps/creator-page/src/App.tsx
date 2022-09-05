import React, { useState, useEffect } from 'react';

import bs58 from 'bs58';
import { Connection, clusterApiUrl } from '@solana/web3.js';

import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AppProvider } from './AppProvider';
import Header from './Components/Header';
import { ToastContainer } from 'react-toastify';

import LayoutMain from './Components/LayoutMain';
import LayoutProject from './Components/LayoutProject';
import PPList from './Pages/PPList';
import ProjectList from './Pages/ProjectList';
import ProjectNew from './Pages/ProjectNew';
import TaskNew from './Pages/TaskNew';

import './App.css';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <div className="App">
      <Header />
      <Routes>
        <Route path="/" element={<LayoutProject />}>
          <Route index element={<ProjectList />} />
          <Route path="project/new" element={<ProjectNew />} />
        </Route>
        <Route element={<LayoutMain />}>
          <Route path="project/:name" element={<PPList />} />
          <Route path="project/:name/task/new" element={<TaskNew />} />
        </Route>
      </Routes>
      <ToastContainer autoClose={2000} position="top-right" />
    </div>
  );
}

export default function Providers() {
  return (
    <BrowserRouter>
      <AppProvider>
        <App />
      </AppProvider>
    </BrowserRouter>
  );
}
