import styled from 'styled-components';
import SaveExploreListItem, {
  SaveExploreListItemData,
} from './SaveExploreListItem';
import AnimatedListItem, {
  useAnimatedListTransition,
} from '../animation/AnimatedListItem';
import CardBase from '../common/card/CardBase';

export type SaveExploreListProps = {
  data: SaveExploreListItemData[];
  onItemClick?: (item: SaveExploreListItemData) => void;
};

export default function SaveExploreList({
  data,
  onItemClick,
}: SaveExploreListProps) {
  const transitions = useAnimatedListTransition(data);
  return (
    <SaveExploreListWrapper>
      {transitions((styles, item) => {
        return (
          <AnimatedListItem key={item.id} styles={{ ...styles }}>
            <SaveExploreListItem
              data={item}
              onClick={() => onItemClick && onItemClick(item)}
            />
          </AnimatedListItem>
        );
      })}
    </SaveExploreListWrapper>
  );
}
const SaveExploreListWrapper = styled(CardBase)`
  padding: 0;
  width: 100%;
  display: flex;
  flex-direction: column;
  & > div {
    & {
      border-bottom: 1px solid rgba(57, 66, 76, 0.5);
    }
    &:last-child {
      border-bottom: none;
    }
  }
`;
