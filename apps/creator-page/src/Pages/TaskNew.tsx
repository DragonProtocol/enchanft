import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import log from 'loglevel';

import {
  State as CreateTaskState,
  DefaultState,
} from '../Components/TaskCreate/type';
import Basic from '../Components/TaskCreate/Basic';
import Actions from '../Components/TaskCreate/Actions';
import PreviewBtn from '../Components/TaskCreate/PreviewBtn';
import Preview from '../Components/TaskCreate/Preview';
import { useAppConfig } from '../AppProvider';
import { useAppDispatch, useAppSelector } from '../redux/store';
import { fetchProjectDetail, selectProjectDetail } from '../redux/projectSlice';

export default function TaskNew() {
  const { slug } = useParams();
  const { account } = useAppConfig();
  const dispatch = useAppDispatch();
  const project = useAppSelector(selectProjectDetail);

  const [state, setState] = useState<CreateTaskState>({
    ...DefaultState,
  });
  const [openPreview, setOpenPreview] = useState(false);

  useEffect(() => {
    if (!slug) return;
    dispatch(fetchProjectDetail({ slug, token: account.info.token }));
  }, [account, dispatch, slug]);

  log.debug(slug, project);

  return (
    <>
      <NewBox style={{ display: (openPreview && 'none') || '' }}>
        <h3 className="title">Create a New Task</h3>
        <Basic
          state={state}
          updateState={(newState) => {
            setState({ ...newState });
          }}
        />

        <Actions
          hasInviteBot={true}
          updateStateActions={(newStateActions) => {
            setState({ ...state, actions: newStateActions });
          }}
          projectName={slug || ''}
          projectTwitter={'projectTwitter'}
          followTwitters={state.followTwitters}
          updateStateFollowTwitters={(data) => {
            setState({ ...state, followTwitters: data });
          }}
        />
        <PreviewBtn
          state={state}
          updateState={(newState) => {
            setState({ ...newState });
          }}
          passAction={() => {
            setOpenPreview(true);
          }}
        />
      </NewBox>
      <Preview
        state={state}
        open={openPreview}
        closeHandler={() => setOpenPreview(false)}
        submitResult={() => {}}
      />
    </>
  );
}

const NewBox = styled.div`
  padding: 40px;
  & h3 {
    margin: 0;
  }
  & .title {
    font-weight: 700;
    font-size: 36px;
    line-height: 40px;
    color: #333333;
  }

  & .subtitle {
    margin-top: 40px;
    border-bottom: 1px solid #d9d9d9;
    margin-bottom: 10px;
    & span {
      display: inline-block;
      font-weight: 700;
      font-size: 24px;
      line-height: 40px;
      border-bottom: 4px solid #3dd606;
    }
  }
`;
