import { EditBox, EditTitle } from '../Components/Project/EditTitle';
import CalendarTime from '../Components/Project/Mint/CalendarTime';
import TotalSupply from '../Components/Project/Mint/TotalSupply';
import MintPrice from '../Components/Project/Mint/MintPrice';
import MintLimit from '../Components/Project/Mint/MintLimit';

export default function ProjectMintEdit() {
  return (
    <EditBox>
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
    </EditBox>
  );
}
