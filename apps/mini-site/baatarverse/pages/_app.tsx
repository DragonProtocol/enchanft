import { useEffect } from 'react'

import { AppProps } from 'next/app';
import Head from 'next/head';
import './styles.css';

function useRem() {
  const setRem = async () => {
    await require('lib-flexible')
  }
  useEffect(() => {
    setRem()
    window.addEventListener('resize', setRem)
  }, [])
}


function CustomApp({ Component, pageProps }: AppProps) {
  // useRem()

  return (
    <>
      <Head>
        <title>Baatarverse</title>
      </Head>
      <main className="app">
        <Component {...pageProps} />
      </main>
    </>
  );
}

export default CustomApp;
