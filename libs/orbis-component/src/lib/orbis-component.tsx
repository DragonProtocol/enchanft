// import styles from './orbis-component.module.css';

import App from './pages/_app.js'
import GroupHome from './pages/index.js'

import { FunctionComponent } from 'react';
import React from 'react';
import ChannelDetails from './pages/channel.js';
interface OrbisComponentProps {
  group_id: string
  channel_id?: string
}
export function OrbisChannelComponent(props: OrbisComponentProps): FunctionComponent<OrbisComponentProps> {
  return (
    <App Component={ChannelDetails} pageProps={props} />
  ) as unknown as FunctionComponent;
}

export function OrbisGroupComponent(props: OrbisComponentProps): FunctionComponent<OrbisComponentProps> {
  return (
    <App Component={GroupHome} pageProps={props} />
  ) as unknown as FunctionComponent;
}
