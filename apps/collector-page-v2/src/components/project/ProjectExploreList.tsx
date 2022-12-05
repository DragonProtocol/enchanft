/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-12-01 15:42:42
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-12-02 12:44:48
 * @Description: file description
 */
import styled from 'styled-components';
import { ProjectExploreListItemResponse } from '../../services/types/project';
import ProjectExploreListItem from './ProjectExploreListItem';

export type ProjectExploreListProps = {
  data: ProjectExploreListItemResponse[];
  activeId: number;
  onItemClick?: (item: ProjectExploreListItemResponse) => void;
};
export default function ProjectExploreList({
  data,
  activeId,
  onItemClick,
}: ProjectExploreListProps) {
  return (
    <ProjectExploreListWrapper>
      {data.map((item) => (
        <ProjectExploreListItem
          key={item.id}
          data={item}
          isActive={item.id === activeId}
          onClick={() => onItemClick && onItemClick(item)}
        />
      ))}
    </ProjectExploreListWrapper>
  );
}
const ProjectExploreListWrapper = styled.div`
  width: 400px;
  height: 100%;
  border-radius: 10px;
  background-color: rgba(41, 41, 41, 1);
  padding: 20px;
  box-sizing: border-box;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;
