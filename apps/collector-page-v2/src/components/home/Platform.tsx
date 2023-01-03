/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-12-26 10:22:20
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-12-30 18:12:17
 * @Description: file description
 */
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import Title from './Title';
import { PlatformData } from '../../services/types/home';

export default function Platform({
  platforms,
  viewAllAction,
}: {
  platforms: Array<PlatformData>;
  viewAllAction: () => void;
}) {
  const navigate = useNavigate();
  return (
    <Box>
      <Title text="Browse by Platform" viewAllAction={viewAllAction} />{' '}
      <div className="lists">
        {platforms.map((item) => {
          return (
            <Card
              key={item.platform}
              {...item}
              clickAction={() => {
                if (item.platformUrl) {
                  navigate(`/events?platform=${item.platform}`);
                }
              }}
            />
          );
        })}
      </div>
    </Box>
  );
}

const Box = styled.div`
  & .lists {
    display: flex;
    gap: 20px;
    margin-top: 20px;
  }
`;

function Card(props: PlatformData & { clickAction: () => void }) {
  const { eventNumber, platform, platformLogo, clickAction } = props;
  return (
    <CardBox onClick={clickAction}>
      <img src={platformLogo} alt="" />
      <h2>{platform}</h2>
      <div>{eventNumber} events</div>
    </CardBox>
  );
}

const CardBox = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  text-align: center;
  box-sizing: border-box;
  padding: 20px;
  gap: 10px;
  cursor: pointer;
  width: 160px;
  height: 146px;
  background: #1b1e23;
  border-radius: 20px;
  > img {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    margin: 0 auto;
  }

  > h2 {
    font-weight: 500;
    font-size: 16px;
    line-height: 19px;
    margin: 0;

    text-align: center;

    color: #ffffff;
  }
  > div {
    font-weight: 400;
    font-size: 16px;
    line-height: 19px;

    color: #718096;
  }
`;
