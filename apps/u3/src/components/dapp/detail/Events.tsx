/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2023-01-18 17:12:51
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2023-01-18 18:02:11
 * @Description: file description
 */
import styled, { StyledComponentPropsWithRef } from 'styled-components';
import { ProjectExploreListItemEventResponse } from '../../../services/types/project';
import EventExploreGridListItem from '../../event/EventExploreGridListItem';
import Card, { CardTitle } from './Card';

type Props = StyledComponentPropsWithRef<'div'> & {
  data: ProjectExploreListItemEventResponse[];
};
export default function Events({ data, ...otherProps }: Props) {
  return (
    <EventsWrapper {...otherProps}>
      <CardTitle>Events({data.length})</CardTitle>
      <EventsList>
        {data.map((item) => (
          <EventExploreGridListItem data={item} />
        ))}
      </EventsList>
    </EventsWrapper>
  );
}

const EventsWrapper = styled(Card)`
  width: 100%;
  min-height: 424px;
`;
const EventsList = styled.div`
  margin-top: 20px;
  display: grid;
  grid-gap: 20px;
  grid-template-columns: repeat(4, minmax(100px, 1fr));
`;
