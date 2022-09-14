import { useState } from 'react';
import { EditBox, EditTitle } from '../Components/Project/EditTitle';
import CalendarTime from '../Components/Project/Mint/CalendarTime';
import TotalSupply from '../Components/Project/Mint/TotalSupply';
import MintPrice from '../Components/Project/Mint/MintPrice';
import MintLimit from '../Components/Project/Mint/MintLimit';
import styled from 'styled-components';
import IconPlus from '../Components/Icons/IconPlus';
import { useAppConfig } from '../AppProvider';
import { useParams } from 'react-router-dom';
import { useAppSelector } from '../redux/store';
import { selectProjectDetail } from '../redux/projectSlice';
import WhitelistSupply from '../Components/Project/Mint/WhitelistSupply';

export default function ProjectMintEdit() {
  const { account } = useAppConfig();
  const { slug } = useParams();
  const { data } = useAppSelector(selectProjectDetail);

  // TODO fix any
  const [project, setProject] = useState<any>({ ...data });
  return (
    <ContentBox>
      <EditTitle title="Mint Information" save={() => {}} />
      <div className="info">
        <div className="left">
          <TotalSupply />
          <MintPrice />
        </div>
        <div className="right">
          <CalendarTime />
          <MintLimit />
        </div>
      </div>
      <hr />
      <div className="whitelist">
        <div className="title">
          <h3>Whitelist 1</h3>
          <span>(Optional)</span>
        </div>
        <div className="info">
          <div className="left">
            <WhitelistSupply />
            <MintPrice />
          </div>
          <div className="right">
            <CalendarTime />
            <MintLimit />
          </div>
        </div>
      </div>
      <hr />
      <div className="whitelist">
        <div className="title">
          <h3>Whitelist 2</h3>
          <span>(Optional)</span>
        </div>
        <div className="info">
          <div className="left">
            <WhitelistSupply />
            <MintPrice />
          </div>
          <div className="right">
            <CalendarTime />
            <MintLimit />
          </div>
        </div>
      </div>
      <hr />
      <div className="add-btns">
        <button>
          <IconPlus size="16px" /> Add Whitelist
        </button>
      </div>
    </ContentBox>
  );
}

const ContentBox = styled(EditBox)`
  & .whitelist {
    & .title {
      margin-top: 40px;
      display: flex;
      align-items: center;
      justify-content: start;

      & h3 {
        font-weight: 700;
        font-size: 24px;
        line-height: 36px;
        margin: 0;
        color: #3dd606;
      }

      & span {
        margin-left: 5px;
        font-weight: 400;
        font-size: 16px;
        line-height: 24px;
        color: #333333;
      }
    }

    & .info {
      margin-top: 20px;
    }
  }

  & .add-btns {
    margin-top: 40px;
    & button {
      padding: 10px 18px;
      width: 210px;
      height: 48px;
      background: #ebeee4;
      box-shadow: inset 0px -4px 0px rgba(0, 0, 0, 0.1);
      border-radius: 10px;
      font-weight: 700;
      font-size: 18px;
      line-height: 27px;
      color: #333333;
    }
  }
`;
