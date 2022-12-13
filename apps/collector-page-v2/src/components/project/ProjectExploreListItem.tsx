/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-12-01 15:41:39
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-12-13 13:49:28
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
    <ProjectExploreListItemWrapper isActive={isActive} {...props}>
      <LayoutLeft>
        <ProjectAvatar src={data.image} />
      </LayoutLeft>

      <LayoutRight>
        <LayoutRightRow>
          <ProjectName>{data.name}</ProjectName>
        </LayoutRightRow>
        <LayoutRightRow>
          {data?.events?.length && (
            <LayoutText>{data.events.length} events</LayoutText>
          )}
          {data?.contents?.length && (
            <LayoutText>{data.contents.length} contents</LayoutText>
          )}
        </LayoutRightRow>
      </LayoutRight>
    </ProjectExploreListItemWrapper>
  );
}
const ProjectExploreListItemWrapper = styled.div<{
  isActive: boolean;
}>`
  width: 100%;
  display: flex;
  align-items: center;
  padding: 20px;
  box-sizing: border-box;
  gap: 10px;

  background: ${({ isActive }) => (isActive ? '#14171A' : '#1B1E23')};
  border-bottom: 1px solid #39424c;
  ${({ isActive }) =>
    isActive &&
    `
    box-shadow: inset -4px 0px 0px #FFFFFF;
  `}
`;

const LayoutLeft = styled.div`
  display: flex;
  align-items: center;
  flex-shrink: 0;
`;
const ProjectAvatar = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
`;
const LayoutRight = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 10px;
`;
const LayoutRightRow = styled.div`
  width: 100%;
  display: flex;
  gap: 20px;
  align-items: center;
`;

const ProjectName = styled.span`
  font-weight: 500;
  font-size: 16px;
  line-height: 19px;
  color: #ffffff;
`;
const LayoutText = styled.span`
  font-weight: 400;
  font-size: 16px;
  line-height: 19px;
  color: #718096;
  opacity: 0.8;
`;
