/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-12-01 15:41:39
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-12-09 16:56:08
 * @Description: file description
 */
import styled, { StyledComponentPropsWithRef } from 'styled-components';
import { ProjectExploreListItemResponse } from '../../services/types/project';

export type ProjectExploreListItemProps = StyledComponentPropsWithRef<'div'> & {
  data: ProjectExploreListItemResponse;
  isActive: boolean;
};
export default function ProjectExploreListItem({
  data,
  isActive,
  ...props
}: ProjectExploreListItemProps) {
  return (
    <ProjectExploreListItemWrapper {...props}>
      <LayoutLeft>
        <ProjectAvatar src={data.image} />
      </LayoutLeft>

      <LayoutRight>
        <LayoutRightRow>
          <ProjectName>{data.name}</ProjectName>
        </LayoutRightRow>
        <LayoutRightRow>
          <LayoutText>{data?.events?.length || 0} events</LayoutText>
        </LayoutRightRow>
      </LayoutRight>
    </ProjectExploreListItemWrapper>
  );
}
const ProjectExploreListItemWrapper = styled.div`
  width: 100%;
  height: 80px;
  padding: 20px;
  box-sizing: border-box;
  cursor: pointer;
  background: rgba(64, 149, 229, 1);
  border-radius: 4px;
  display: flex;
  align-items: center;
  gap: 20px;
`;

const LayoutLeft = styled.div`
  display: flex;
  align-items: center;
  flex-shrink: 0;
`;
const ProjectAvatar = styled.img`
  width: 52px;
  height: 52px;
`;
const LayoutRight = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;
const LayoutRightRow = styled.div`
  width: 100%;
  display: flex;
  gap: 8px;
  align-items: center;
  overflow: hidden;
`;

const ProjectName = styled.span`
  color: rgba(255, 255, 255, 1);
  font-size: 18px;
`;
const LayoutText = styled.span`
  color: rgba(255, 255, 255, 1);
  font-size: 14px;
`;
