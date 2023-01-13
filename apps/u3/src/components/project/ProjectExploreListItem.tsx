/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-12-01 15:41:39
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2023-01-06 18:07:26
 * @Description: file description
 */
import styled, { StyledComponentPropsWithRef } from 'styled-components';
import { ProjectExploreListItemResponse } from '../../services/types/project';
import { ButtonPrimaryLine } from '../common/button/ButtonBase';
import IconLike from '../common/icons/IconLike';
import ShareSvg from '../common/icons/svgs/share.svg';
import ProjectImgDefault from './ProjectImgDefault';

export type ProjectExploreListItemData = ProjectExploreListItemResponse;
export type ProjectExploreListItemProps = StyledComponentPropsWithRef<'div'> & {
  data: ProjectExploreListItemData;
  isActive: boolean;
  disabledFavor?: boolean;
  loadingFavor?: boolean;
  isFavored?: boolean;
  displayHandles?: boolean;
  onShare?: () => void;
  onFavor?: () => void;
};
export default function ProjectExploreListItem({
  data,
  isActive,
  disabledFavor,
  loadingFavor,
  isFavored,
  displayHandles = true,
  onShare,
  onFavor,
  ...props
}: ProjectExploreListItemProps) {
  return (
    <ProjectExploreListItemWrapper isActive={isActive} {...props}>
      <ListItemInner>
        <ProjectInfo>
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
        </ProjectInfo>
        {displayHandles && (
          <ProjectHandles>
            <ProjectHandleButton onClick={onFavor} disabled={disabledFavor}>
              <ProjectHandleButtonLikeIcon
                fill={isFavored ? '#718096' : 'none'}
              />
            </ProjectHandleButton>
            <ProjectHandleButton onClick={onShare}>
              <ProjectHandleButtonIcon src={ShareSvg} />
            </ProjectHandleButton>
          </ProjectHandles>
        )}
      </ListItemInner>
    </ProjectExploreListItemWrapper>
  );
}
const ProjectExploreListItemWrapper = styled.div<{
  isActive: boolean;
}>`
  width: 100%;
  padding: 20px;
  box-sizing: border-box;
  cursor: pointer;

  background: ${({ isActive }) => (isActive ? '#14171A' : '#1B1E23')};
  border-bottom: 1px solid #39424c;
  ${({ isActive }) =>
    isActive &&
    `
    border-right: 4px solid #FFFFFF;
  `}
  transition: background-color 0.5s, box-shadow 0.5s;
  overflow: hidden;
  &:hover {
    & > * {
      transform: scale(1.05);
    }
  }
`;
const ListItemInner = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  transition: all 0.3s;
`;
const ProjectInfo = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 10px;
`;

const LayoutLeft = styled.div`
  display: flex;
  align-items: center;
  flex-shrink: 0;
`;
const ProjectAvatar = styled(ProjectImgDefault)`
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

const ProjectHandles = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 10px;
`;
const ProjectHandleButton = styled(ButtonPrimaryLine)`
  padding: 6px;
  height: 32px;
`;
const ProjectHandleButtonLikeIcon = styled(IconLike)`
  width: 20px;
  height: 20px;
`;
const ProjectHandleButtonIcon = styled.img`
  width: 20px;
  height: 20px;
`;
