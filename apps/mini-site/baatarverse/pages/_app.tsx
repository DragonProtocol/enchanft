import { AppProps } from 'next/app';
import Head from 'next/head';
import './styles.css';
import favicon from '../public/static/favicon.png';

function CustomApp({ Component }: AppProps) {
  return (
    <>
      <Head>
        <link rel="icon" href={favicon.src} />
        <title>CASKBAATAR</title>
      </Head>
      <main className="app">
        <Component />
      </main>
    </>
  );
}

export default CustomApp;
