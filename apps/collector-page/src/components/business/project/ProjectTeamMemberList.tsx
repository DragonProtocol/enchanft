/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-11 12:02:09
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-08-03 14:20:55
 * @Description: file description
 */
import React from 'react';
import styled from 'styled-components';
import ProjectTeamMemberItem, {
  ProjectTeamMemberItemDataViewType,
} from './ProjectTeamMemberItem';

export type ProjectTeamMemberListViewConfigType = {
  loading?: boolean;
  loadingMsg?: string;
  emptyMsg?: string;
};
export type ProjectTeamMemberListItemsType =
  ProjectTeamMemberItemDataViewType[];
export type ProjectTeamMemberListProps = ProjectTeamMemberListViewConfigType & {
  items: ProjectTeamMemberListItemsType;
};
const ProjectTeamMemberList: React.FC<ProjectTeamMemberListProps> = ({
  items,
  loading,
  loadingMsg,
  emptyMsg,
}: ProjectTeamMemberListProps) => (
  <ProjectTeamMemberListWrapper>
    {!loading &&
      items.length > 0 &&
      items.map((item) => (
        <ProjectTeamMemberItemBox key={`${item.data.id}`}>
          <ProjectTeamMemberItem
            data={item.data}
            viewConfig={item.viewConfig}
          />
        </ProjectTeamMemberItemBox>
      ))}
    {loading && (
      <div
        style={{
          textAlign: 'center',
          marginTop: '20px',
          marginBottom: '20px',
        }}
      >
        {loadingMsg}
      </div>
    )}
    {!loading && items.length === 0 && emptyMsg && (
      <div style={{ textAlign: 'center', marginTop: '50px' }}>{emptyMsg}</div>
    )}
  </ProjectTeamMemberListWrapper>
);
export default ProjectTeamMemberList;
const ProjectTeamMemberListWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 40px;
`;
const ProjectTeamMemberItemBox = styled.div``;
