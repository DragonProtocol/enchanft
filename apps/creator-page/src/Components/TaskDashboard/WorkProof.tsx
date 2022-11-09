import styled from 'styled-components';
import { WorkProofInfo } from '../../redux/creatorDashboard';
import { ActionTypeMore } from '../TaskCreate/type';

export default function WorkProof({
  workProofs,
}: {
  workProofs: WorkProofInfo[];
}) {
  const dateNow = new Date();
  return (workProofs && workProofs.length>0) ? (
    <WorkProofBox>
      <h3>WorkProof</h3>
      <WorkProofListBox>
        {workProofs.map((item, idx) => {
          const text =
            ((item.userName !== '') ?
              item.userName
              :
              'somebody')
            +
            ((item.actionType === ActionTypeMore.QUESTIONNAIRE) ?
              ' answered the question'
              :
              (item.actionType === ActionTypeMore.UPLOAD_IMAGE) ?
                ' upload a image'
                :
                ''
            )
          const timeDiff = dateNow.getTime() - new Date(item.submitTime).getTime()
          const timeDiffText = (timeDiff / 24 / 60 / 60 / 1000 >= 1) ?
            Math.floor(timeDiff / 24 / 60 / 60 / 1000) + 'd'
            :
            (timeDiff / 60 / 60 / 1000 >= 1) ?
              Math.floor(timeDiff / 60 / 60 / 1000) + 'h'
              :
              (timeDiff / 60 / 1000 >= 1) ?
                Math.floor(timeDiff / 60 / 1000) + 'm'
                :
                Math.floor(timeDiff / 1000) + 's'
          console.log(item.actionType, new Date(item.submitTime), text, timeDiff)
          return (
              <div className="item" key={idx}>
                <span className="text">{text}</span>
                <span className="time">{timeDiffText}</span>
              </div>
          );
        })}
      </WorkProofListBox>
    </WorkProofBox>
  ) :
    <></>
}

const WorkProofListBox = styled.div`
  margin-top: 20px;
  & div.item {
    position: relative;
    font-weight: 400;
    font-size: 16px;
    line-height: 20px;
    color: #333333;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin-top:20px;
  }

  & .text {
  }
  & .time {
  }
`;

const WorkProofBox = styled.div`
  padding: 20px;
  & h3 {
    font-weight: 700;
    font-size: 20px;
    line-height: 30px;
    color: #333333;
  }
`;
