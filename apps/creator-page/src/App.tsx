import React, { useState, useEffect } from 'react';

import { Metaplex } from '@metaplex-foundation/js';
import bs58 from 'bs58';
import { Connection, clusterApiUrl } from '@solana/web3.js';
// import { walletAdapterIdentity } from '@metaplex-foundation/js';
import logo from './logo.svg';
import './App.css';
import { BrowserRouter } from 'react-router-dom';
import { AppProvider, useAppConfig } from './AppProvider';

function App() {
  const { phantomValid, metaMaskValid } = useAppConfig();
  return (
    <div className="App">
      {(phantomValid && <button>Connect Phantom</button>) || (
        <button>installPhantom</button>
      )}
      {(metaMaskValid && <button>Connect MetaMask</button>) || (
        <button>installMetaMask</button>
      )}
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
