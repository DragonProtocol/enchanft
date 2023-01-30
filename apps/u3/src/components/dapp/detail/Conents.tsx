/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2023-01-18 17:12:51
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2023-01-19 11:47:16
 * @Description: file description
 */
import styled, { StyledComponentPropsWithRef } from 'styled-components';
import { ProjectExploreListItemContentResponse } from '../../../services/types/project';
import GridItem from '../../contents/GridItem';
import Card, { CardTitle } from './Card';

type Props = StyledComponentPropsWithRef<'div'> & {
  data: ProjectExploreListItemContentResponse[];
  onItemClick?: (data: ProjectExploreListItemContentResponse) => void;
};
export default function Conents({ data, onItemClick, ...otherProps }: Props) {
  return (
    <ConentsWrapper {...otherProps}>
      <CardTitle>Conents({data.length})</CardTitle>
      <ConentsList>
        {data.map((item) => (
          <GridItem
            key={item.id}
            clickAction={() => onItemClick && onItemClick(item)}
            {...item}
          />
        ))}
      </ConentsList>
    </ConentsWrapper>
  );
}

const ConentsWrapper = styled(Card)`
  width: 100%;
  min-height: 424px;
`;
const ConentsList = styled.div`
  margin-top: 20px;
  display: grid;
  grid-gap: 20px;
  grid-template-columns: repeat(4, minmax(100px, 1fr));
`;
