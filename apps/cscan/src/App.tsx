import { Routes, Route, Outlet } from 'react-router-dom';
import styled from 'styled-components';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import {
  phantomAuthorizer,
  martianAuthorizer,
  rainbowKitAuthorizer,
  setApiBaseUrl,
  WlUserReactProvider,
} from '@ecnft/wl-user-react';

import { USER_API_BASE_URL } from './constants';

import Stream from './container/Stream';
import Profile from './container/Profile';
import Family from './container/Family';

import Home from './container/Home';
import Nav from './components/Nav';
import NoMatch from './components/NoMatch';

dayjs.extend(relativeTime);
setApiBaseUrl(USER_API_BASE_URL || '');

const authorizers = [
  rainbowKitAuthorizer(),
  phantomAuthorizer(),
  martianAuthorizer(),
];

export default function App() {
  return (
    <WlUserReactProvider theme="dark" authorizers={authorizers}>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path=":network/stream/:streamId" element={<Stream />} />
          <Route path=":network/profile/:did" element={<Profile />} />
          <Route path=":network/family/:familyOrApp" element={<Family />} />

          <Route path="*" element={<NoMatch />} />
        </Route>
      </Routes>
    </WlUserReactProvider>
  );
}

function Layout() {
  return (
    <AppContainer>
      <Nav />

      <main>
        <Outlet />
      </main>
    </AppContainer>
  );
}

const AppContainer = styled.div`
  display: flex;

  > main {
    flex-grow: 1;
    margin: 0 auto;
    max-width: calc(100vw - 300px);
  }
`;
