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

function App() {
  const { validLogin } = useAppConfig();

  if (!validLogin) {
    return (
      <div>
        <Header />
        <ConnectBox>Connect Wallet First</ConnectBox>
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
          <Route path="detail" element={<ProjectDetail />} />
          <Route path="info/edit" element={<ProjectInfoEdit />} />
          <Route
            path="announcement/edit"
            element={<ProjectAnnouncementEdit />}
          />
          <Route path="mint/edit" element={<ProjectMintEdit />} />
          <Route path="task/new" element={<TaskNew />} />
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
  return (
    <BrowserRouter>
      <ReduxProvider store={store}>
        <AppProvider>
          <App />
        </AppProvider>
      </ReduxProvider>
    </BrowserRouter>
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
