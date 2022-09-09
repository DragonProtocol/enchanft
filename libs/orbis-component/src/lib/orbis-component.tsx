// import styles from './orbis-component.module.css';

import App from './pages/_app.js'
import GroupHome from './pages/index.js'

import { FunctionComponent } from 'react';
import React from 'react';
interface OrbisComponentProps { }
export function OrbisComponent(props: OrbisComponentProps): FunctionComponent<OrbisComponentProps> {
  return (
    <App Component={GroupHome} pageProps={undefined} />
  ) as unknown as FunctionComponent;
}

export default OrbisComponent;
