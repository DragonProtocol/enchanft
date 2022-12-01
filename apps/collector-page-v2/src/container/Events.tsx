/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-05 15:35:42
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-11-30 21:03:08
 * @Description: 首页任务看板
 */
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import ListRouteLayout from '../components/layout/ListRoutelLayout';
import { RouteKey } from '../route/routes';
import useRoute from '../route/useRoute';

function Events() {
  const navigate = useNavigate();
  const { lastRouteMeta } = useRoute();
  const params = useParams();
  const events = [
    {
      id: 1,
      name: 'aaa',
    },
    {
      id: 2,
      name: 'bbb',
    },
  ];
  return (
    <ListRouteLayout>
      <EventsWrapper>
        {events.map((item) => (
          <EventItem
            key={item.id}
            isActive={
              lastRouteMeta.key === RouteKey.event &&
              params?.id === String(item.id)
            }
            onClick={() => navigate(`/events/${item.id}`)}
          >
            {item.name}
          </EventItem>
        ))}
      </EventsWrapper>
    </ListRouteLayout>
  );
}
export default Events;

const EventsWrapper = styled.div`
  width: 100%;
  height: 100%;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
`;
const EventItem = styled.div<{ isActive: boolean }>`
  font-weight: 700;
  font-size: 18px;
  line-height: 27px;
  text-transform: uppercase;
  padding: 20px;
  display: flex;
  align-items: center;
  cursor: pointer;
  background: ${(props) => (props.isActive ? '#000' : 'none')};
  color: ${(props) => (props.isActive ? '#fff' : '#000')};
  &:hover {
    background: #999;
  }
`;
