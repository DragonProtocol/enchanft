import { Provider as ReduxProvider } from 'react-redux';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AppProvider, useAppConfig } from './AppProvider';
import Header from './Components/Header';
import { ToastContainer } from 'react-toastify';

import LayoutProject from './Pages/LayoutProject';
import LayoutMain from './Pages/LayoutMain';
import ProjectDetail from './Pages/ProjectDetail';
import ProjectList from './Pages/ProjectList';
import ProjectNew from './Pages/ProjectNew';
import TaskNew from './Pages/TaskNew';

import 'react-toastify/dist/ReactToastify.css';
import { store } from './redux/store';
import NotFound from './Pages/NotFound';
import Account from './Pages/Account';
import { TaskDashboard } from './Pages/TaskDashboard';
import styled from 'styled-components';
import ProjectInfoEdit from './Pages/ProjectInfoEdit';
import ProjectMintEdit from './Pages/ProjectMintEdit';
import ProjectAnnouncementEdit from './Pages/ProjectAnnouncementEdit';
import Members from './Pages/Members';
import { TaskPre } from './Pages/TaskPre';

import {
  twitterAuthorizer,
  discordAuthorizer,
  phantomAuthorizer,
  martianAuthorizer,
  rainbowKitAuthorizer,
} from '@ecnft/wl-user-react';

import {
  WlUserReactProvider,
  WlUserReactContextType,
} from '@ecnft/wl-user-react';
import { useState } from 'react';
import { WorkProofList } from './Pages/WorkProofList';

const TWITTER_CLIENT_ID = process.env.REACT_APP_TWITTER_CLIENT_ID;
const TWITTER_CALLBACK_URL =
  process.env.REACT_APP_WL_USER_AUTH_CALLBACK_TWITTER;
const DISCORD_CLIENT_ID = process.env.REACT_APP_DISCORD_CLIENT_ID;
const DISCORD_CALLBACK_URL =
  process.env.REACT_APP_WL_USER_AUTH_CALLBACK_DISCORD;

if (
  !TWITTER_CLIENT_ID ||
  !TWITTER_CALLBACK_URL ||
  !DISCORD_CLIENT_ID ||
  !DISCORD_CALLBACK_URL
) {
  throw new Error('config required!!!');
}

const signers = [
  twitterAuthorizer({
    twitterClientId: TWITTER_CLIENT_ID,
    oauthCallbackUri: TWITTER_CALLBACK_URL,
  }),
  discordAuthorizer({
    discordClientId: DISCORD_CLIENT_ID,
    oauthCallbackUri: DISCORD_CALLBACK_URL,
  }),
  rainbowKitAuthorizer(),
  phantomAuthorizer(),
  martianAuthorizer(),
];

function App() {
  const { validLogin } = useAppConfig();

  if (!validLogin) {
    return (
      <div>
        <Header />
        <ConnectBox>Login First</ConnectBox>
      </div>
    );
  }
  return (
    <div>
      <Header />
      <Routes>
        <Route path="/" element={<LayoutMain />}>
          <Route index element={<ProjectList />} />
          <Route path="project/new" element={<ProjectNew />} />
        </Route>
        <Route path="project/:slug" element={<LayoutProject />}>
          <Route path="members" element={<Members />} />
          <Route path="detail" element={<ProjectDetail />} />
          <Route path="info/edit" element={<ProjectInfoEdit />} />
          <Route
            path="announcement/edit"
            element={<ProjectAnnouncementEdit />}
          />
          <Route path="mint/edit" element={<ProjectMintEdit />} />
          <Route path="task/pre" element={<TaskPre />} />
          <Route path="task/new" element={<TaskNew />} />
          <Route path="task/:taskId/workProofs" element={<WorkProofList />} />
          <Route path="task/:taskId" element={<TaskDashboard />} />
          <Route path="account" element={<Account />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
      <ToastContainer autoClose={2000} position="top-right" />
    </div>
  );
}

export default function Providers() {
  const [wlUserReactValue, setWlUserReactValue] = useState<
    WlUserReactContextType | undefined
  >(undefined);

  return (
    <WlUserReactProvider
      authorizers={signers}
      valueChange={(value) => setWlUserReactValue(value)}
    >
      <BrowserRouter>
        <ReduxProvider store={store}>
          <AppProvider>
            <App />
          </AppProvider>
        </ReduxProvider>
      </BrowserRouter>
    </WlUserReactProvider>
  );
}

const ConnectBox = styled.div`
  margin: 0 auto;
  text-align: center;
  padding-top: 50px;

  font-size: 36px;
  line-height: 40px;
  color: #333333;
`;
