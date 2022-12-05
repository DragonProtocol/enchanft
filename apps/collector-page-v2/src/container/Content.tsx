/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-05 15:35:42
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-11-30 14:58:00
 * @Description: 首页任务看板
 */
import { useParams } from 'react-router-dom';
import styled from 'styled-components';

function Content() {
  const { id } = useParams();

  return <ContentWrapper>content {id}</ContentWrapper>;
}
export default Content;
const ContentWrapper = styled.div`
  width: 100%;
`;
