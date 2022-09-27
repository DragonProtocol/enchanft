import { useEffect } from 'react'

import { AppProps } from 'next/app';
import Head from 'next/head';
import './styles.css';
import favicon from '../public/static/favicon.jpg'

function CustomApp({ Component, pageProps }: AppProps) {
  console.log(favicon,'favicon')
  return (
    <>
      <Head>
      <link rel="icon" href={favicon.src}/>
      {/* <link rel="icon" href="/static/favicon.ico"/> */}
        <title>CASKBAATAR</title>
      </Head>
      <main className="app">
        <Component {...pageProps} />
      </main>
    </>
  );
}

export default CustomApp;
