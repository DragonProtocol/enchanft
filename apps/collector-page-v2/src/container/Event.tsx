/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-05 15:35:42
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-11-30 21:04:21
 * @Description: 首页任务看板
 */
import { useParams } from 'react-router-dom';
import styled from 'styled-components';

function Event() {
  const params = useParams();
  return <EventWrapper>event id: {params.id}</EventWrapper>;
}
export default Event;
const EventWrapper = styled.div`
  width: 100%;
`;
