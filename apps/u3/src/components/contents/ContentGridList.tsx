/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-12-01 15:42:42
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2023-01-20 16:56:21
 * @Description: file description
 */
import styled from 'styled-components';
import AnimatedListItem, {
  useAnimatedListTransition,
} from '../animation/AnimatedListItem';
import { MEDIA_BREAK_POINTS } from '../../constants';
import { ContentListItem } from './ContentList';
import GridItem, { GridItemHidden } from './GridItem';

export type ContentGridListProps = {
  data: ContentListItem[];
  activeId: string | number;
  onHiddenUndo?: (item: ContentListItem) => void;
  onItemClick?: (item: ContentListItem) => void;
};

export default function ContentGridList({
  data,
  activeId,
  onHiddenUndo,
  onItemClick,
}: ContentGridListProps) {
  const transitions = useAnimatedListTransition(data);
  return (
    <ContentGridListWrapper>
      {transitions((styles, item) => {
        let isActive = false;
        if (item.id) {
          isActive = item.id === activeId;
        } else {
          isActive = item.uuid === activeId;
        }
        return (
          <AnimatedListItem key={item.id || item.uuid} styles={{ ...styles }}>
            {item.hidden ? (
              <GridItemHidden
                isActive={isActive}
                hidden
                undoAction={() => onHiddenUndo && onHiddenUndo(item)}
              />
            ) : (
              <GridItem
                clickAction={() => onItemClick && onItemClick(item)}
                {...{ isActive, ...item }}
              />
            )}
          </AnimatedListItem>
        );
      })}
    </ContentGridListWrapper>
  );
}
const ContentGridListWrapper = styled.div`
  width: 100%;
  display: grid;
  grid-gap: 20px;
  grid-template-columns: repeat(6, minmax(calc((100% - 20px * 5) / 6), 1fr));
  @media (min-width: ${MEDIA_BREAK_POINTS.xxxl}px) {
    grid-template-columns: repeat(6, minmax(calc((100% - 20px * 5) / 6), 1fr));
  }

  @media (min-width: ${MEDIA_BREAK_POINTS.xxl}px) and (max-width: ${MEDIA_BREAK_POINTS.xxxl}px) {
    grid-template-columns: repeat(6, minmax(calc((100% - 20px * 4) / 5), 1fr));
  }

  @media (min-width: ${MEDIA_BREAK_POINTS.md}px) and (max-width: ${MEDIA_BREAK_POINTS.xxl}px) {
    grid-template-columns: repeat(6, minmax(calc((100% - 20px * 3) / 4), 1fr));
  }
`;
