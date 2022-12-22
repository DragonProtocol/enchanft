/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-12-08 14:04:04
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-12-22 18:32:21
 * @Description: file description
 */
import styled from 'styled-components';
import AnimatedListItem, {
  useAnimatedListTransition,
} from '../animation/AnimatedListItem';
import ListItem from './ListItem';

export type ContentListItem = {
  id: number;
  upVoteNum: number;
  title: string;
  type: string;
  author: string;
  createdAt: number;
  favored?: boolean;
};
export type ContentListProps = {
  data: ContentListItem[];
  activeId: number;
  onVote?: (item: ContentListItem) => void;
  onFavor?: (item: ContentListItem) => void;
  onShare?: (item: ContentListItem) => void;
  onHidden?: (item: ContentListItem) => void;
  onItemClick?: (item: ContentListItem) => void;
};
export default function ContentList({
  data,
  activeId,
  onVote,
  onFavor,
  onShare,
  onHidden,
  onItemClick,
}: ContentListProps) {
  const transitions = useAnimatedListTransition(data);
  return (
    <ContentListWrapper>
      {transitions((styles, item) => {
        return (
          <AnimatedListItem key={item.id} styles={{ ...styles }}>
            <ListItem
              type={item.type}
              author={item.author}
              createdAt={item.createdAt}
              title={item.title}
              upVoteNum={item.upVoteNum}
              isActive={item.id === activeId}
              clickAction={() => onItemClick && onItemClick(item)}
              favored={item.favored}
              voteAction={() => onVote && onVote(item)}
              favorsAction={() => onFavor && onFavor(item)}
              shareAction={() => onShare && onShare(item)}
              hiddenAction={() => onHidden && onHidden(item)}
            />
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
