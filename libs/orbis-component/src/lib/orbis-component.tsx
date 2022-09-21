// import styles from './orbis-component.module.css';

import App from './pages/_app.js'
import GroupHome from './pages/group.js'
import ChannelDetails from './pages/channel.js';

import { FunctionComponent } from 'react';
import React from 'react';
interface OrbisComponentProps {
  group_id: string
  channel_id?: string
  showNav?: boolean
  routePrefix?:string
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
