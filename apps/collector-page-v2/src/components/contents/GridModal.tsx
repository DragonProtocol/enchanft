import Modal from 'react-modal';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { ContentListItem } from '../../services/types/contents';
import { Close } from '../icons/close';
import ContentShowerBox from './ContentShowerBox';
import { ContentItemActions } from './ListItem';

export default function GridModal({
  show,
  closeModal,
  selectContent,
  favorPendingIds,
  favorsAction,
  hiddenAction,
  shareAction,
  voteAction,
  scoreContent,
  delContent,
}: {
  show: boolean;
  closeModal: () => void;
  selectContent: ContentListItem | undefined;
  favorPendingIds: (string | number)[];
  favorsAction?: () => void;
  hiddenAction?: () => void;
  shareAction?: () => void;
  voteAction?: () => void;
  scoreContent?: (id: number) => void;
  delContent?: (id: number) => void;
}) {
  const navigate = useNavigate();
  return (
    <Modal
      isOpen={show}
      style={{
        overlay: {
          backgroundColor: 'rgba(0,0,0,0.3)',
          zIndex: 200,
          backdropFilter: 'blur(12px)',
        },
        content: {
          display: 'flex',
          alignItems: 'center',
          margin: '0 auto',
          background: 'none',
          border: 'none',
        },
      }}
    >
      <ContentBox>
        <div className="title">
          {(selectContent && (
            <ContentItemActions
              isActive
              withVote
              favorPendingIds={favorPendingIds}
              voteAction={() => {
                if (voteAction) voteAction();
              }}
              shareAction={() => {
                if (shareAction) shareAction();
              }}
              hiddenAction={() => {
                if (hiddenAction) hiddenAction();
              }}
              favorsAction={() => {
                if (favorsAction) favorsAction();
              }}
              {...selectContent}
            />
          )) || <div />}
          <span onClick={closeModal}>
            <Close />
          </span>
        </div>
        {selectContent && (
          <ContentShowerBoxWrapper>
            <ContentShowerBox
              selectContent={selectContent}
              deleteAction={() => {
                if (delContent) delContent(selectContent.id);
              }}
              editAction={() => {
                navigate(`/contents/create?id=${selectContent.id}`);
              }}
              thumbUpAction={() => {
                if (scoreContent) scoreContent(selectContent.id);
              }}
            />
          </ContentShowerBoxWrapper>
        )}
      </ContentBox>
    </Modal>
  );
}

const ContentBox = styled.div`
  margin: 0 auto;
  text-align: start;
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 982px;
  height: 100%;

  background: #1b1e23;
  border-radius: 20px;
  padding: 20px;
  box-sizing: border-box;

  & .title {
    display: flex;
    justify-content: space-between;
    align-items: center;

    & > span {
      cursor: pointer;
      padding: 10px;
    }
  }

  & h2 {
    margin: 0;
    font-weight: 700;
    font-size: 24px;
    line-height: 28px;

    color: #ffffff;
  }

  & p {
    font-weight: 400;
    font-size: 16px;
    line-height: 24px;
    margin: 0;
    color: #ffffff;
  }

  & .btns {
    display: flex;
    justify-content: space-between;
    & button {
      cursor: pointer;
      width: 160px;
      height: 48px;

      background: #1a1e23;
      border: 1px solid #39424c;
      border-radius: 12px;
      font-weight: 500;
      font-size: 16px;
      line-height: 24px;

      text-align: center;

      color: #718096;
    }

    & button.confirm {
      background: #ffffff;
      color: #14171a;
    }
  }
`;

const ContentShowerBoxWrapper = styled.div`
  border: 1px solid #39424c;
  border-radius: 10px;
  height: 100%;
  overflow: hidden;
`;