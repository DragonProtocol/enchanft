import dayjs from 'dayjs';
import styled from 'styled-components';
import { ProjectDetail } from '../redux/projectSlice';

export default function MintInfo({ project }: { project: ProjectDetail }) {
  const whitelist = project.whitelists && project.whitelists[0];
  return (
    <InfoBox>
      <div className="title">
        <h3>Mint Information</h3>
        {/* <button>Edit</button> */}
      </div>
      <div className="info">
        {whitelist && (
          <>
            <div className="item">
              <h4>Whitelist</h4>
              <span>
                Start in{' '}
                <span>
                  {dayjs(whitelist.mintStartTime).format('YYYY/MM/DD HH:mm:ss')}
                </span>
              </span>
              <span>
                Max <span>{whitelist.mintMaxNum} Tokens</span>
              </span>
              <span>
                <span>
                  {whitelist.mintPrice.startsWith('0')
                    ? 'Free'
                    : whitelist.mintPrice}
                </span>{' '}
                Mint
              </span>
            </div>
            <hr />
          </>
        )}
        <div className="item">
          <h4>Public</h4>
          <span>
            Start in{' '}
            <span>
              {dayjs(project.publicSaleTime).format('YYYY/MM/DD HH:mm:ss')}
            </span>
          </span>
          {/* <span>
            Max <span>{1} Tokens</span>
          </span> */}
          <span>
            Mint Price <span>{project.publicSalePrice}</span>
          </span>
        </div>
      </div>
    </InfoBox>
  );
}

const InfoBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  & .info {
    display: flex;
    flex-direction: column;
    gap: 20px;

    & .item {
      display: flex;
      align-items: center;
      gap: 10px;

      font-size: 16px;
      line-height: 24px;

      > h4 {
        margin: 0;
        width: 170px;
        font-weight: 700;
        font-size: inherit;
        line-height: inherit;
        color: #333333;
      }

      & > span {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        padding: 10px 20px;
        gap: 12px;
        min-width: 240px;
        height: 40px;
        box-sizing: border-box;
        background: #ebeee4;
        border-radius: 10px;

        font-weight: 400;
        font-size: inherit;
        line-height: inherit;
        color: rgba(51, 51, 51, 0.6);

        > span {
          font-weight: 700;
          font-size: inherit;
          line-height: inherit;
          color: #333333;
        }
      }
    }

    > hr {
      width: 100%;
      height: 1px;
      background: #d9d9d9;
      border: none;
    }
  }
`;
