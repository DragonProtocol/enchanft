/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-11-30 18:17:08
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-11-30 20:45:36
 * @Description: file description
 */
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { navs } from '../../route/routes';
import useRoute from '../../route/useRoute';

function Nav() {
  const navigate = useNavigate();
  const { firstRouteMeta } = useRoute();
  return (
    <NavWrapper>
      {navs.map((item) => (
        <PcNavItem
          key={item.link}
          isActive={item.activeRouteKeys.includes(firstRouteMeta.key)}
          onClick={() => navigate(item.link)}
        >
          {item.name}
        </PcNavItem>
      ))}
    </NavWrapper>
  );
}
const NavWrapper = styled.div`
  min-width: 200px;
  height: 100%;
  padding: 20px 0px;
  box-sizing: border-box;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
`;
const PcNavItem = styled.div<{ isActive: boolean }>`
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
export default Nav;
