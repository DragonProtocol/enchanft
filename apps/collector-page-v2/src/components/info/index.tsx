import styled from 'styled-components';
import { sortPubKey } from '../../utils/solana';
import { Copy } from '../icons/copy';
import { Discord } from '../icons/discord';
import { Twitter } from '../icons/twitter';

export default function Info({
  nickname,
  walletAddr,
  avatar,
}: {
  nickname: string;
  walletAddr: string;
  avatar: string;
}) {
  return (
    <InfoBox>
      <div className="user-info">
        <img
          className="user-avatar"
          src={
            avatar ||
            'https://arweave.net/QeSUFwff9xDbl4SCXlOmEn0TuS4vPg11r2_ETPPu_nk'
          }
          alt=""
        />

        <div>
          <div className="nickname">
            <span className="name">{nickname || 'Unknown'}</span>
            {/* <span className="share">
              <Share />
            </span> */}
          </div>
          <div className="addr">
            <span>{sortPubKey(walletAddr || '')}</span>
            <span
              className="copy"
              onClick={() => {
                navigator.clipboard.writeText(walletAddr).then(
                  function () {
                    alert('copied');
                  },
                  function (err) {
                    console.error('Async: Could not copy text: ', err);
                  }
                );
              }}
            >
              <Copy />
            </span>
          </div>
        </div>
      </div>
      <div className="attach">
        <div>date</div>
        <div>
          <span className="twitter">
            <Twitter />
          </span>
          <span className="discord">
            <Discord />
          </span>
        </div>
      </div>
    </InfoBox>
  );
}

const InfoBox = styled.div`
  flex-grow: 1;
  .user-info {
    display: flex;
    gap: 10px;
    & img.user-avatar {
      border-radius: 5px;

      width: 100px;
      height: 100px;
    }
    & > div {
      flex-grow: 1;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      & .nickname {
        display: flex;
        justify-content: space-between;
        & .name {
          font-size: 25px;
          font-weight: 700;
        }
      }
    }

    div.addr {
      display: flex;
      gap: 5px;
      & .copy {
        cursor: pointer;
      }
    }

    & .share {
      cursor: pointer;
    }
  }

  .attach {
    display: flex;
    justify-content: space-between;

    > div {
      display: flex;
      gap: 10px;
    }

    & .twitter,
    & .discord {
      width: 34px;
      height: 34px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      background-color: rgb(52, 128, 223);
    }
    & .discord {
      background-color: rgb(64, 72, 243);
    }
  }
`;
