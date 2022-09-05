import React, { useState, useEffect } from 'react';

import { Metaplex } from '@metaplex-foundation/js';
import bs58 from 'bs58';
import { Connection, clusterApiUrl } from '@solana/web3.js';

import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AppProvider } from './AppProvider';
import Header from './Components/Header';

import './App.css';
import LayoutMain from './Components/LayoutMain';
import LayoutCommunity from './Components/LayoutCommunity';
import ProjectList from './Pages/ProjectList';
import CommunityList from './Pages/CommunityList';
import CommunityNew from './Pages/CommunityNew';

function App() {
  return (
    <div className="App">
      <Header />
      <Routes>
        <Route path="/" element={<LayoutCommunity />}>
          <Route index element={<CommunityList />} />
          <Route path="community/new" element={<CommunityNew />} />
        </Route>
        <Route element={<LayoutMain />}>
          <Route path="community/:name" element={<ProjectList />} />
        </Route>
      </Routes>
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
