/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-12-08 14:04:04
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2023-02-02 15:24:04
 * @Description: file description
 */
import styled from 'styled-components';
import { ContentListItem } from '../../services/types/contents';
import AnimatedListItem, {
  useAnimatedListTransition,
} from '../animation/AnimatedListItem';
import ListItem, { ListItemHidden } from './ListItem';

export type ContentListProps = {
  data: ContentListItem[];
  activeId: string | number;
  loadingFavorIds?: Array<string | number>;
  onVote?: (item: ContentListItem) => void;
  onFavor?: (item: ContentListItem) => void;
  onShare?: (item: ContentListItem) => void;
  onHidden?: (item: ContentListItem) => void;
  onHiddenUndo?: (item: ContentListItem) => void;
  onItemClick?: (item: ContentListItem) => void;
};
export default function ContentList({
  data,
  activeId,
  loadingFavorIds = [],
  onVote,
  onFavor,
  onShare,
  onHidden,
  onHiddenUndo,
  onItemClick,
}: ContentListProps) {
  const transitions = useAnimatedListTransition(data);
  return (
    <ContentListWrapper>
      {transitions((styles, item) => {
        return (
          <AnimatedListItem key={item.id} styles={{ ...styles }}>
            {item.hidden ? (
              <ListItemHidden
                isActive={String(item.id || item.uuid) === String(activeId)}
                hidden
                undoAction={() => onHiddenUndo && onHiddenUndo(item)}
              />
            ) : (
              <ListItem
                data={item}
                isActive={String(item.id || item.uuid) === String(activeId)}
                favorPendingIds={loadingFavorIds}
                clickAction={() => onItemClick && onItemClick(item)}
                voteAction={() => onVote && onVote(item)}
                favorsAction={() => onFavor && onFavor(item)}
                shareAction={() => onShare && onShare(item)}
                hiddenAction={() => onHidden && onHidden(item)}
              />
            )}
          </AnimatedListItem>
        );
      })}
    </ContentListWrapper>
  );
}
const ContentListWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;
