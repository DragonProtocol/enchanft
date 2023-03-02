/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-05 15:35:42
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2023-03-02 09:36:01
 * @Description: 首页任务看板
 */
import { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { usePermissions } from '@ecnft/wl-user-react';
import { useNavigate, useParams } from 'react-router-dom';
import Loading from '../common/loading/Loading';
import ListScrollBox from '../common/box/ListScrollBox';
import { MainWrapper } from '../layout/Index';
import FeedsMenu from '../layout/FeedsMenu';
import FeedsMenuRight, { Layout } from '../layout/FeedsMenuRight';
import FeedsFilterBox from '../layout/FeedsFilterBox';
import Filter from './Filter';
import SearchInput from '../common/input/SearchInput';
import NoResult from '../common/NoResult';
import ContentOrderBySelect from './ContentOrderBySelect';
import {
  getContentsLayoutFromLocal,
  setContentsLayoutToLocal,
} from '../../utils/localLayout';
import ContentList from './ContentList';
import { ButtonPrimaryLine } from '../common/button/ButtonBase';
import type { ContentsPageProps } from '../../container/Contents';
import ContentListMobile from './ContentListMobile';

export default function ContentsPageMobile({
  // Queries
  loading,
  loadingMore,
  hasMore,
  contents,
  currentSearchParams,
  searchParamsChange,
  hasNewest,
  getMore,
  // Mutations
  votePendingIds,
  onVote,
  favorPendingIds,
  onFavor,
  hiddenPendingIds,
  onHiddenAction,
  onHiddenUndoAction,
  onAdminScore,
  onAdminDelete,
  // Others
  onShare,
}: ContentsPageProps) {
  const navigate = useNavigate();

  const renderMoreLoading = useMemo(
    () =>
      loadingMore ? (
        <MoreLoading>loading ...</MoreLoading>
      ) : !hasMore ? (
        <MoreLoading>No other contents</MoreLoading>
      ) : null,
    [loadingMore, hasMore]
  );

  return (
    <Box>
      {(() => {
        if (loading) {
          return (
            <ContentsWrapper loading="true">
              <div className="loading">
                <Loading />
              </div>
            </ContentsWrapper>
          );
        }
        if (contents.length === 0) {
          return (
            <ContentsWrapper>
              <NoResult />
            </ContentsWrapper>
          );
        }

        return (
          <ListBox onScrollBottom={getMore}>
            <ContentListMobile
              data={contents}
              onItemClick={(item) => {
                navigate(`/contents/${item?.id || item?.uid}`);
              }}
            />
            {renderMoreLoading}
          </ListBox>
        );
      })()}
    </Box>
  );
}

const Box = styled(MainWrapper)`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding-top: 0;
`;
// const Box = styled.div`
//   margin: 0 auto;
//   height: calc(100vh - 72px);
//   box-sizing: border-box;
//   padding: 24px 40px 0 40px;
//   overflow: hidden;
// `;
const ContentsWrapper = styled.div<{ loading?: string }>`
  /* width: calc(100% - 2px);
  height: calc(100% - 94px); */
  /* box-sizing: border-box; */
  border: ${(props) => (props.loading ? 'none' : '1px solid #39424c')};
  background-color: ${(props) => (props.loading ? '' : '#1b1e23')};
  border-radius: 20px;
  overflow: hidden;
  display: flex;
  /* margin-top: 24px; */
  flex-grow: 1;

  & .loading {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
  }
`;
const ListBox = styled(ListScrollBox)`
  width: 100%;
  height: calc(100%);
  overflow: scroll;

  & .load-more {
    margin: 20px;
    text-align: center;
    color: #718096;
    > button {
      cursor: pointer;
      background-color: inherit;
      color: #fff;
      border: 1px solid gray;
      border-radius: 5px;
      padding: 10px 20px;
      outline: none;
    }
  }
`;
const GrideListBox = styled(ListScrollBox)`
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  overflow-y: auto;
`;

const MoreLoading = styled.div`
  padding: 20px;
  text-align: center;
  color: #748094;
`;
const NewestButton = styled(ButtonPrimaryLine)<{ isActive?: boolean }>`
  height: 40px;
  border-radius: 100px;
  position: relative;
  ${({ isActive }) =>
    isActive &&
    `
    background: #718096;
    transition: all 0.3s ease-out;
    color: #14171A;
  `}
  &:not(:disabled):hover {
    ${({ isActive }) =>
      isActive &&
      `
        background: #718096;
        color: #14171A;
      `}
  }
`;
const HasNewestTag = styled.div`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #ff0000;
  position: absolute;
  top: 0;
  right: 10px;
  transform: translateY(-50%);
`;
