/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-12-08 14:04:04
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-12-08 14:13:44
 * @Description: file description
 */
import styled from 'styled-components';
import ListItem from './ListItem';

export type ContentListItem = {
  id: number;
  upVoteNum: number;
  title: string;
  type: string;
  author: string;
  createdAt: number;
};
export type ContentListProps = {
  data: ContentListItem[];
  activeId: number;
  onItemClick?: (item: ContentListItem) => void;
};
export default function ContentList({
  data,
  activeId,
  onItemClick,
}: ContentListProps) {
  return (
    <ContentListWrapper>
      {data.map((item) => (
        <ListItem
          key={item.id}
          type={item.type}
          author={item.author}
          createdAt={item.createdAt}
          title={item.title}
          upVoteNum={item.upVoteNum}
          isActive={item.id === activeId}
          clickAction={() => onItemClick && onItemClick(item)}
        />
      ))}
    </ContentListWrapper>
  );
}
const ContentListWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;
